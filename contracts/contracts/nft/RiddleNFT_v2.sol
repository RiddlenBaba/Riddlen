// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "../interfaces/IRiddleNFT_v2.sol";
import "../interfaces/IRDLN.sol";
import "../interfaces/IRON.sol";

contract RiddleNFT is
    ERC721,
    ERC721Enumerable,
    AccessControl,
    ReentrancyGuard,
    Pausable,
    IRiddleNFT
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

    IRDLN public immutable rdlnToken;
    IRON public immutable ronToken;

    uint256 public constant GENESIS_TIME = 1735689600; // Jan 1, 2025 00:00:00 UTC
    uint256 public constant WEEK_DURATION = 7 days;
    uint256 public constant TOTAL_WEEKS = 1000;
    uint256 public constant BIENNIAL_PERIOD = 730 days; // 2 years

    uint256 public constant INITIAL_MINT_COST = 1000e18; // 1000 RDLN per whitepaper
    uint256 public constant PRIZE_ALLOCATION = 700_000_000e18; // 700M RDLN

    // Commission rates (in basis points, 10000 = 100%)
    uint256 public burnPercent = 5000;     // 50%
    uint256 public grandPrizePercent = 2500; // 25%
    uint256 public devOpsPercent = 2500;   // 25%

    address public grandPrizeWallet;
    address public devOpsWallet;

    uint256 public currentWeek;
    uint256 public nextTokenId = 1;

    // Core data mappings
    mapping(uint256 => RiddleData) public riddles;
    mapping(uint256 => uint256) public weekToRiddleId;
    mapping(uint256 => NFTSolveData) public nftData;
    mapping(uint256 => mapping(address => bool)) public hasUserSolvedRiddle;

    // Resale system
    mapping(uint256 => bool) public tokenForSale;
    mapping(uint256 => uint256) public tokenResalePrice;

    // Statistics
    mapping(uint256 => uint256) public riddleTotalBurned;
    uint256 public globalTotalBurned;
    uint256 public globalTotalPrizesDistributed;

    modifier onlyTokenOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        _;
    }

    modifier validRiddle(uint256 riddleId) {
        require(riddles[riddleId].riddleId > 0, "Invalid riddle");
        _;
    }

    constructor(
        address _rdlnToken,
        address _ronToken,
        address _grandPrizeWallet,
        address _devOpsWallet,
        address _admin
    ) ERC721("Riddlen Weekly NFT", "RWKLY") {
        require(_rdlnToken != address(0), "Invalid RDLN address");
        require(_ronToken != address(0), "Invalid RON address");
        require(_grandPrizeWallet != address(0), "Invalid Grand Prize wallet");
        require(_devOpsWallet != address(0), "Invalid devOps wallet");
        require(_admin != address(0), "Invalid admin address");

        rdlnToken = IRDLN(_rdlnToken);
        ronToken = IRON(_ronToken);
        grandPrizeWallet = _grandPrizeWallet;
        devOpsWallet = _devOpsWallet;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(CREATOR_ROLE, _admin);
    }

    function releaseWeeklyRiddle(
        string memory category,
        Difficulty difficulty,
        bytes32 answerHash,
        string memory ipfsHash
    ) external onlyRole(CREATOR_ROLE) returns (uint256 riddleId) {
        uint256 weekNumber = getCurrentWeek();
        require(weekNumber <= TOTAL_WEEKS, "All riddles released");
        require(weekToRiddleId[weekNumber] == 0, "Week already has riddle");

        riddleId = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            weekNumber,
            category,
            difficulty
        )));

        // Generate randomized parameters
        RiddleParameters memory params = _generateRandomParameters(difficulty);

        riddles[riddleId] = RiddleData({
            riddleId: riddleId,
            weekNumber: weekNumber,
            category: category,
            difficulty: difficulty,
            answerHash: answerHash,
            ipfsHash: ipfsHash,
            creator: msg.sender,
            releaseTime: block.timestamp,
            status: RiddleStatus.ACTIVE,
            params: params,
            totalMinted: 0,
            solverCount: 0
        });

        weekToRiddleId[weekNumber] = riddleId;

        emit WeeklyRiddleReleased(riddleId, weekNumber, difficulty, params);

        return riddleId;
    }

    function mintRiddleNFT(uint256 riddleId) external nonReentrant whenNotPaused validRiddle(riddleId) returns (uint256 tokenId) {
        RiddleData storage riddle = riddles[riddleId];
        require(riddle.status == RiddleStatus.ACTIVE, "Riddle not active");
        require(riddle.totalMinted < riddle.params.maxMintRate, "Max mint reached");

        uint256 mintCost = getCurrentMintCost();
        require(rdlnToken.transferFrom(msg.sender, address(this), mintCost), "RDLN transfer failed");

        tokenId = nextTokenId++;
        riddle.totalMinted++;

        nftData[tokenId] = NFTSolveData({
            tokenId: tokenId,
            riddleId: riddleId,
            currentOwner: msg.sender,
            originalMinter: msg.sender,
            mintedAt: block.timestamp,
            failedAttempts: 0,
            solved: false,
            solver: address(0),
            solveTime: 0,
            prizeAmount: 0,
            prizeClaimed: false,
            wasFirstSolver: false,
            wasSpeedSolver: false,
            ronEarned: 0
        });

        _mint(msg.sender, tokenId);

        emit RiddleNFTMinted(tokenId, riddleId, msg.sender, mintCost);

        return tokenId;
    }

    function attemptSolution(
        uint256 tokenId,
        string memory answer
    ) external nonReentrant whenNotPaused onlyTokenOwner(tokenId) {
        NFTSolveData storage nft = nftData[tokenId];
        RiddleData storage riddle = riddles[nft.riddleId];

        require(riddle.status == RiddleStatus.ACTIVE, "Riddle not active");
        require(!nft.solved, "Already solved");
        require(!hasUserSolvedRiddle[nft.riddleId][msg.sender], "User already solved this riddle");

        // Burn RDLN tokens for attempt (progressive burn handled by RDLN contract)
        uint256 burnAmount = rdlnToken.burnFailedAttempt(msg.sender);
        nft.failedAttempts++;

        globalTotalBurned += burnAmount;
        riddleTotalBurned[nft.riddleId] += burnAmount;

        // Check if answer is correct
        bytes32 submittedHash = keccak256(abi.encodePacked(answer));
        bool isCorrect = submittedHash == riddle.answerHash;

        emit AttemptMade(tokenId, nft.riddleId, msg.sender, nft.failedAttempts, burnAmount, isCorrect);

        if (isCorrect) {
            _handleCorrectSolution(tokenId, nft, riddle);
        }
    }

    function _handleCorrectSolution(
        uint256 tokenId,
        NFTSolveData storage nft,
        RiddleData storage riddle
    ) internal {
        require(riddle.solverCount < riddle.params.winnerSlots, "All winner slots filled");

        nft.solved = true;
        nft.solver = msg.sender;
        nft.solveTime = block.timestamp;
        hasUserSolvedRiddle[nft.riddleId][msg.sender] = true;
        riddle.solverCount++;

        // Determine bonuses
        bool isFirstSolver = (riddle.solverCount == 1);
        uint256 solveTimeDiff = block.timestamp - riddle.releaseTime;
        bool isSpeedSolver = solveTimeDiff <= 1 hours; // Top speed threshold

        nft.wasFirstSolver = isFirstSolver;
        nft.wasSpeedSolver = isSpeedSolver;

        // Calculate prize amount (equal distribution among winners)
        uint256 prizePerWinner = riddle.params.prizePool / riddle.params.winnerSlots;
        nft.prizeAmount = prizePerWinner;

        // Award RON reputation
        uint256 ronEarned = ronToken.awardRON(
            msg.sender,
            IRON.RiddleDifficulty(uint256(riddle.difficulty)),
            isFirstSolver,
            isSpeedSolver,
            string(abi.encodePacked("Solved riddle ", _toString(nft.riddleId)))
        );
        nft.ronEarned = ronEarned;

        emit RiddleSolved(
            tokenId,
            nft.riddleId,
            msg.sender,
            nft.prizeAmount,
            ronEarned,
            isFirstSolver,
            isSpeedSolver
        );

        // Check if riddle is complete
        if (riddle.solverCount >= riddle.params.winnerSlots) {
            riddle.status = RiddleStatus.SOLVED;
        }
    }

    function claimPrize(uint256 tokenId) external nonReentrant onlyTokenOwner(tokenId) {
        NFTSolveData storage nft = nftData[tokenId];
        require(nft.solved, "NFT not solved");
        require(!nft.prizeClaimed, "Prize already claimed");
        require(nft.prizeAmount > 0, "No prize to claim");

        nft.prizeClaimed = true;
        globalTotalPrizesDistributed += nft.prizeAmount;

        require(rdlnToken.transfer(msg.sender, nft.prizeAmount), "Prize transfer failed");

        emit PrizeClaimed(tokenId, msg.sender, nft.prizeAmount);
    }

    function setResalePrice(uint256 tokenId, uint256 price) external onlyTokenOwner(tokenId) {
        if (price == 0) {
            tokenForSale[tokenId] = false;
            tokenResalePrice[tokenId] = 0;
        } else {
            tokenForSale[tokenId] = true;
            tokenResalePrice[tokenId] = price;
        }
    }

    function buyNFT(uint256 tokenId) external payable nonReentrant whenNotPaused {
        require(tokenForSale[tokenId], "NFT not for sale");
        require(msg.value >= tokenResalePrice[tokenId], "Insufficient payment");

        address seller = ownerOf(tokenId);
        uint256 salePrice = tokenResalePrice[tokenId];

        // Calculate commissions
        uint256 totalCommission = (salePrice * (burnPercent + grandPrizePercent + devOpsPercent)) / 10000;
        uint256 burnAmount = (salePrice * burnPercent) / 10000;
        uint256 grandPrizeAmount = (salePrice * grandPrizePercent) / 10000;
        uint256 devOpsAmount = (salePrice * devOpsPercent) / 10000;
        uint256 sellerAmount = salePrice - totalCommission;

        // Update NFT ownership data
        nftData[tokenId].currentOwner = msg.sender;

        // Clear sale status
        tokenForSale[tokenId] = false;
        tokenResalePrice[tokenId] = 0;

        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);

        // Distribute payments
        payable(seller).transfer(sellerAmount);
        payable(grandPrizeWallet).transfer(grandPrizeAmount);
        payable(devOpsWallet).transfer(devOpsAmount);

        // Handle burn (convert ETH to RDLN via DEX and burn)
        // Note: In production, this would require DEX integration
        // For now, send to a burn address or treasury
        payable(address(0)).transfer(burnAmount);

        // Refund excess payment
        if (msg.value > salePrice) {
            payable(msg.sender).transfer(msg.value - salePrice);
        }

        emit NFTResold(tokenId, seller, msg.sender, salePrice, totalCommission);
        emit CommissionDistributed(totalCommission, burnAmount, grandPrizeAmount, devOpsAmount);
    }

    function getCurrentWeek() public view returns (uint256) {
        if (block.timestamp < GENESIS_TIME) return 0;
        return ((block.timestamp - GENESIS_TIME) / WEEK_DURATION) + 1;
    }

    function getWeeklyRiddle(uint256 weekNumber) external view returns (uint256 riddleId) {
        return weekToRiddleId[weekNumber];
    }

    function getCurrentMintCost() public view returns (uint256) {
        uint256 periodsElapsed = (block.timestamp - GENESIS_TIME) / BIENNIAL_PERIOD;
        return INITIAL_MINT_COST / (2 ** periodsElapsed);
    }

    function getBiennialPeriod() external view returns (uint256 period, uint256 cost) {
        period = (block.timestamp - GENESIS_TIME) / BIENNIAL_PERIOD;
        cost = getCurrentMintCost();
    }

    function _generateRandomParameters(Difficulty difficulty) internal view returns (RiddleParameters memory) {
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, difficulty)));

        // Randomize mint rate (10-1000)
        uint256 maxMintRate = 10 + (seed % 991);

        // Randomize prize pool based on difficulty (100K-10M RDLN)
        uint256 minPrize = difficulty == Difficulty.LEGENDARY ? 5_000_000e18 :
                          difficulty == Difficulty.HARD ? 1_000_000e18 :
                          difficulty == Difficulty.MEDIUM ? 500_000e18 : 100_000e18;
        uint256 maxPrize = difficulty == Difficulty.LEGENDARY ? 10_000_000e18 :
                          difficulty == Difficulty.HARD ? 5_000_000e18 :
                          difficulty == Difficulty.MEDIUM ? 2_000_000e18 : 1_000_000e18;
        uint256 prizePool = minPrize + ((seed >> 8) % (maxPrize - minPrize));

        // Randomize winner slots (1-100)
        uint256 winnerSlots = 1 + ((seed >> 16) % 100);

        uint256 mintCost = getCurrentMintCost();

        return RiddleParameters({
            maxMintRate: maxMintRate,
            prizePool: prizePool,
            winnerSlots: winnerSlots,
            mintCost: mintCost
        });
    }

    // View functions
    function getRiddle(uint256 riddleId) external view returns (RiddleData memory) {
        return riddles[riddleId];
    }

    function getNFTSolveData(uint256 tokenId) external view returns (NFTSolveData memory) {
        return nftData[tokenId];
    }

    function getRemainingNFTs(uint256 riddleId) external view validRiddle(riddleId) returns (uint256) {
        RiddleData memory riddle = riddles[riddleId];
        return riddle.params.maxMintRate - riddle.totalMinted;
    }

    function getRiddleWinners(uint256 riddleId) external view validRiddle(riddleId) returns (address[] memory) {
        // Implementation would track winners array
        // For now, return empty array
        return new address[](0);
    }

    function canAttemptRiddle(address user, uint256 riddleId) external view validRiddle(riddleId) returns (
        bool canAttempt,
        string memory reason
    ) {
        RiddleData memory riddle = riddles[riddleId];

        if (riddle.status != RiddleStatus.ACTIVE) {
            return (false, "Riddle not active");
        }

        if (hasUserSolvedRiddle[riddleId][user]) {
            return (false, "User already solved this riddle");
        }

        return (true, "");
    }

    function getNextAttemptCost(uint256 tokenId) external view returns (uint256) {
        NFTSolveData memory nft = nftData[tokenId];
        return (nft.failedAttempts + 1) * 1e18;
    }

    function getResaleInfo(uint256 tokenId) external view returns (
        bool forSale,
        uint256 price,
        address seller
    ) {
        forSale = tokenForSale[tokenId];
        price = tokenResalePrice[tokenId];
        seller = forSale ? ownerOf(tokenId) : address(0);
    }

    // Statistics
    function getGlobalStats() external view returns (
        uint256 totalRiddles,
        uint256 totalNFTsMinted,
        uint256 totalSolved,
        uint256 totalRDLNBurned,
        uint256 totalPrizesDistributed
    ) {
        totalRiddles = getCurrentWeek();
        totalNFTsMinted = nextTokenId - 1;
        totalSolved = 0; // Would need to track this
        totalRDLNBurned = globalTotalBurned;
        totalPrizesDistributed = globalTotalPrizesDistributed;
    }

    function getRiddleStats(uint256 riddleId) external view validRiddle(riddleId) returns (
        uint256 nftsMinted,
        uint256 solved,
        uint256 averageSolveTime,
        uint256 totalBurned,
        uint256 prizePoolRemaining
    ) {
        RiddleData memory riddle = riddles[riddleId];
        nftsMinted = riddle.totalMinted;
        solved = riddle.solverCount;
        averageSolveTime = 0; // Would need to track solve times
        totalBurned = riddleTotalBurned[riddleId];
        prizePoolRemaining = riddle.params.prizePool - (riddle.solverCount * (riddle.params.prizePool / riddle.params.winnerSlots));
    }

    // Admin functions
    function updateCommissionRates(
        uint256 _burnPercent,
        uint256 _grandPrizePercent,
        uint256 _devOpsPercent
    ) external onlyRole(ADMIN_ROLE) {
        require(_burnPercent + _grandPrizePercent + _devOpsPercent <= 10000, "Total exceeds 100%");
        burnPercent = _burnPercent;
        grandPrizePercent = _grandPrizePercent;
        devOpsPercent = _devOpsPercent;
    }

    function setDevOpsWallet(address newWallet) external onlyRole(ADMIN_ROLE) {
        require(newWallet != address(0), "Invalid address");
        devOpsWallet = newWallet;
    }

    function setGrandPrizeWallet(address newWallet) external onlyRole(ADMIN_ROLE) {
        require(newWallet != address(0), "Invalid address");
        grandPrizeWallet = newWallet;
    }

    function setLiquidityWallet(address newWallet) external onlyRole(ADMIN_ROLE) {
        require(newWallet != address(0), "Invalid address");
        // Note: liquidityWallet not yet implemented in this contract
        // This function exists for interface compatibility
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // Required overrides
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, AccessControl, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}