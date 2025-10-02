// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../interfaces/IRDLN.sol";
import "../interfaces/IRON.sol";

/**
 * @title RiddleNFTv3 - Enhanced Biennial Halving System
 * @dev NFT-based riddle system with comprehensive biennial halving for all costs
 *
 * Key Innovation: Each NFT locks in its mint-era cost structure permanently
 * - NFT mint cost halves every 2 years (1000 → 500 → 250 → 125...)
 * - Attempt costs halve every 2 years (1.0 → 0.5 → 0.25 → 0.125...)
 * - Original costs are permanently locked to each NFT
 * - Costs transfer with NFT ownership (resale/transfer)
 */
contract RiddleNFTv3 is
    ERC721,
    ERC721Enumerable,
    AccessControl,
    ReentrancyGuard,
    Pausable
{
    // =============================================================
    //                        ROLES
    // =============================================================

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // =============================================================
    //                        CONSTANTS
    // =============================================================

    IRDLN public immutable rdlnToken;
    IRON public immutable ronToken;

    uint256 public immutable GENESIS_TIME; // Set to deployment time
    uint256 public constant WEEK_DURATION = 7 days;
    uint256 public constant TOTAL_WEEKS = 1000;
    uint256 public constant BIENNIAL_PERIOD = 730 days; // 2 years exactly

    // Base costs (Era 0: 2025-2026)
    uint256 public constant INITIAL_MINT_COST = 1000e18; // 1000 RDLN
    uint256 public constant INITIAL_ATTEMPT_COST = 1e18; // 1 RDLN per attempt
    uint256 public constant INITIAL_SUBMISSION_COST = 1e18; // 1 RDLN per submission

    uint256 public constant PRIZE_ALLOCATION = 700_000_000e18; // 700M RDLN

    // Commission rates (in basis points, 10000 = 100%)
    uint256 public burnPercent = 5000;     // 50%
    uint256 public grandPrizePercent = 2500; // 25%
    uint256 public devOpsPercent = 2500;   // 25%

    // =============================================================
    //                        STORAGE
    // =============================================================

    uint256 private _tokenIdCounter;

    address public grandPrizeWallet;
    address public devOpsWallet;
    string private _baseTokenURI;

    uint256 public currentWeek;
    uint256 public nextTokenId = 1;

    // Enhanced NFT data with era locking
    struct NFTData {
        uint256 tokenId;
        uint256 riddleId;
        address currentOwner;
        address originalMinter;
        uint256 mintEra;              // Era when NFT was minted (0, 1, 2, 3...)
        uint256 mintCost;             // Original mint cost locked forever
        uint256 baseAttemptCost;      // Base attempt cost for this era
        uint256 baseSubmissionCost;   // Base submission cost for this era
        uint256 attemptCount;         // Progressive attempt counter
        uint256 submissionCount;      // Progressive submission counter
        bool isSolved;
        uint256 solveTimestamp;
        bytes32 solutionHash;
        uint256 prizeAmount;
        bool prizeClaimed;
    }

    struct RiddleData {
        uint256 riddleId;
        uint256 weekNumber;
        uint256 creationTime;
        uint256 totalMinted;
        uint256 maxMintRate;
        uint256 prizePool;
        uint256 winnerSlots;
        uint256 totalSolved;
        bool isActive;
        bool prizeDistributed;
        bytes32 riddleHash;
        bytes32 answerHash;
    }

    // Core mappings
    mapping(uint256 => RiddleData) public riddles;
    mapping(uint256 => uint256) public weekToRiddleId;
    mapping(uint256 => NFTData) public nftData;
    mapping(uint256 => mapping(address => bool)) public hasUserSolvedRiddle;

    // Era cost tracking for current minting
    mapping(uint256 => uint256) public eraMintCosts;
    mapping(uint256 => uint256) public eraAttemptCosts;
    mapping(uint256 => uint256) public eraSubmissionCosts;

    // Resale system
    mapping(uint256 => bool) public tokenForSale;
    mapping(uint256 => uint256) public tokenResalePrice;

    // Statistics
    mapping(uint256 => uint256) public riddleTotalBurned;
    uint256 public globalTotalBurned;
    uint256 public globalTotalPrizesDistributed;

    // =============================================================
    //                        EVENTS
    // =============================================================

    event RiddleCreated(
        uint256 indexed riddleId,
        uint256 indexed weekNumber,
        uint256 prizePool,
        uint256 maxMintRate,
        uint256 winnerSlots
    );

    event NFTMinted(
        uint256 indexed tokenId,
        uint256 indexed riddleId,
        address indexed minter,
        uint256 mintEra,
        uint256 mintCost,
        uint256 baseAttemptCost
    );

    event AttemptMade(
        uint256 indexed tokenId,
        address indexed solver,
        uint256 attemptNumber,
        uint256 costPaid,
        uint256 era
    );

    event SubmissionMade(
        uint256 indexed tokenId,
        address indexed submitter,
        uint256 submissionNumber,
        uint256 costPaid,
        uint256 era
    );

    event EraProgression(
        uint256 newEra,
        uint256 newMintCost,
        uint256 newAttemptCost,
        uint256 newSubmissionCost
    );

    event AttemptRecorded(
        uint256 indexed tokenId,
        uint256 attemptCount,
        bool success
    );

    event SubmissionRecorded(
        uint256 indexed tokenId,
        uint256 submissionCount,
        string question
    );

    // =============================================================
    //                        ERRORS
    // =============================================================

    error InvalidEra();
    error InsufficientPayment();
    error NFTNotOwned();
    error RiddleNotActive();
    error AlreadySolved();
    error InvalidRiddle();
    error CostCalculationError();

    // =============================================================
    //                        CONSTRUCTOR
    // =============================================================

    constructor(
        address _rdlnToken,
        address _ronToken,
        address _grandPrizeWallet,
        address _devOpsWallet,
        address _admin,
        string memory _baseURI
    ) ERC721("Riddlen Challenge NFT", "RCNFT") {
        require(_rdlnToken != address(0), "Invalid RDLN address");
        require(_ronToken != address(0), "Invalid RON address");
        require(_grandPrizeWallet != address(0), "Invalid Grand Prize wallet");
        require(_devOpsWallet != address(0), "Invalid devOps wallet");
        require(_admin != address(0), "Invalid admin address");

        rdlnToken = IRDLN(_rdlnToken);
        ronToken = IRON(_ronToken);
        grandPrizeWallet = _grandPrizeWallet;
        devOpsWallet = _devOpsWallet;
        GENESIS_TIME = block.timestamp; // Set genesis to deployment time
        _baseTokenURI = _baseURI;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(CREATOR_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);

        // Initialize Era 0 costs
        _initializeEraCosts();
    }

    // =============================================================
    //                        ERA SYSTEM
    // =============================================================

    /**
     * @dev Initialize base costs for all eras up to Era 10 (20 years)
     */
    function _initializeEraCosts() internal {
        for (uint256 era = 0; era <= 10; era++) {
            uint256 divisor = 2 ** era;
            eraMintCosts[era] = INITIAL_MINT_COST / divisor;
            eraAttemptCosts[era] = INITIAL_ATTEMPT_COST / divisor;
            eraSubmissionCosts[era] = INITIAL_SUBMISSION_COST / divisor;
        }
    }

    /**
     * @dev Get current era based on time elapsed since genesis
     */
    function getCurrentEra() public view returns (uint256) {
        if (block.timestamp < GENESIS_TIME) return 0;
        return (block.timestamp - GENESIS_TIME) / BIENNIAL_PERIOD;
    }

    /**
     * @dev Get current mint cost for new NFTs
     */
    function getCurrentMintCost() public view returns (uint256) {
        uint256 currentEra = getCurrentEra();
        return eraMintCosts[currentEra];
    }

    /**
     * @dev Get current base attempt cost for new NFTs
     */
    function getCurrentAttemptCost() public view returns (uint256) {
        uint256 currentEra = getCurrentEra();
        return eraAttemptCosts[currentEra];
    }

    /**
     * @dev Get current base submission cost for new NFTs
     */
    function getCurrentSubmissionCost() public view returns (uint256) {
        uint256 currentEra = getCurrentEra();
        return eraSubmissionCosts[currentEra];
    }

    /**
     * @dev Calculate attempt cost for a specific NFT based on its locked era
     * Uses progressive cost: base * attemptNumber
     */
    function calculateAttemptCost(uint256 tokenId) public view returns (uint256) {
        if (_ownerOf(tokenId) == address(0)) revert InvalidRiddle();

        NFTData memory nft = nftData[tokenId];
        if (nft.isSolved) return 0;

        // Progressive cost: base * (attempts + 1)
        return nft.baseAttemptCost * (nft.attemptCount + 1);
    }

    /**
     * @dev Calculate submission cost for a specific NFT based on its locked era
     * Uses progressive cost: base * submissionNumber
     */
    function calculateSubmissionCost(uint256 tokenId) public view returns (uint256) {
        if (_ownerOf(tokenId) == address(0)) revert InvalidRiddle();

        NFTData memory nft = nftData[tokenId];
        if (nft.isSolved) return 0;

        // Progressive cost: base * (submissions + 1)
        return nft.baseSubmissionCost * (nft.submissionCount + 1);
    }

    // =============================================================
    //                        MINTING SYSTEM
    // =============================================================

    /**
     * @dev Create a new weekly riddle
     */
    function createRiddle(
        uint256 weekNumber,
        bytes32 riddleHash,
        bytes32 answerHash,
        uint256 prizePool,
        uint256 maxMintRate,
        uint256 winnerSlots
    ) external onlyRole(CREATOR_ROLE) {
        require(weekToRiddleId[weekNumber] == 0, "Week already has riddle");
        require(prizePool > 0, "Prize pool must be > 0");
        require(maxMintRate > 0, "Max mint rate must be > 0");
        require(winnerSlots > 0, "Winner slots must be > 0");

        uint256 riddleId = nextTokenId;

        riddles[riddleId] = RiddleData({
            riddleId: riddleId,
            weekNumber: weekNumber,
            creationTime: block.timestamp,
            totalMinted: 0,
            maxMintRate: maxMintRate,
            prizePool: prizePool,
            winnerSlots: winnerSlots,
            totalSolved: 0,
            isActive: true,
            prizeDistributed: false,
            riddleHash: riddleHash,
            answerHash: answerHash
        });

        weekToRiddleId[weekNumber] = riddleId;
        currentWeek = weekNumber;

        emit RiddleCreated(riddleId, weekNumber, prizePool, maxMintRate, winnerSlots);
    }

    /**
     * @dev Mint NFT with era-locked cost structure
     */
    function mintNFT(uint256 riddleId) external nonReentrant whenNotPaused {
        RiddleData storage riddle = riddles[riddleId];
        require(riddle.isActive, "Riddle not active");
        require(riddle.totalMinted < riddle.maxMintRate, "Mint limit reached");

        uint256 currentEra = getCurrentEra();
        uint256 mintCost = getCurrentMintCost();
        uint256 baseAttemptCost = getCurrentAttemptCost();
        uint256 baseSubmissionCost = getCurrentSubmissionCost();

        // Transfer payment
        require(
            rdlnToken.transferFrom(msg.sender, address(this), mintCost),
            "RDLN transfer failed"
        );

        uint256 tokenId = nextTokenId++;
        riddle.totalMinted++;

        // Lock era costs permanently to this NFT
        nftData[tokenId] = NFTData({
            tokenId: tokenId,
            riddleId: riddleId,
            currentOwner: msg.sender,
            originalMinter: msg.sender,
            mintEra: currentEra,
            mintCost: mintCost,
            baseAttemptCost: baseAttemptCost,
            baseSubmissionCost: baseSubmissionCost,
            attemptCount: 0,
            submissionCount: 0,
            isSolved: false,
            solveTimestamp: 0,
            solutionHash: 0,
            prizeAmount: 0,
            prizeClaimed: false
        });

        _safeMint(msg.sender, tokenId);

        // Distribute mint cost according to tokenomics
        _distributeMintCost(mintCost);

        emit NFTMinted(
            tokenId,
            riddleId,
            msg.sender,
            currentEra,
            mintCost,
            baseAttemptCost
        );
    }

    // =============================================================
    //                        SOLVING SYSTEM
    // =============================================================

    /**
     * @dev Make attempt on riddle - uses NFT's locked era costs
     */
    function makeAttempt(uint256 tokenId, bytes32 attemptHash)
        external
        nonReentrant
        whenNotPaused
    {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");

        NFTData storage nft = nftData[tokenId];
        require(!nft.isSolved, "Already solved");

        RiddleData storage riddle = riddles[nft.riddleId];
        require(riddle.isActive, "Riddle not active");

        uint256 attemptCost = calculateAttemptCost(tokenId);

        // Transfer attempt cost
        require(
            rdlnToken.transferFrom(msg.sender, address(this), attemptCost),
            "RDLN transfer failed"
        );

        nft.attemptCount++;

        // Distribute attempt cost according to tokenomics
        _distributeCost(attemptCost);

        emit AttemptMade(
            tokenId,
            msg.sender,
            nft.attemptCount,
            attemptCost,
            nft.mintEra
        );

        // Check if attempt is correct (simplified for this example)
        if (attemptHash == riddle.answerHash) {
            _markSolved(tokenId, attemptHash);
        }
    }

    /**
     * @dev Submit question/riddle - uses NFT's locked era costs
     */
    function submitQuestion(uint256 tokenId, bytes32 questionHash)
        external
        nonReentrant
        whenNotPaused
    {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");

        NFTData storage nft = nftData[tokenId];
        uint256 submissionCost = calculateSubmissionCost(tokenId);

        // Transfer submission cost
        require(
            rdlnToken.transferFrom(msg.sender, address(this), submissionCost),
            "RDLN transfer failed"
        );

        nft.submissionCount++;

        // Distribute submission cost according to tokenomics
        _distributeCost(submissionCost);

        emit SubmissionMade(
            tokenId,
            msg.sender,
            nft.submissionCount,
            submissionCost,
            nft.mintEra
        );
    }

    /**
     * @dev Mark NFT as solved with tiered reward calculation
     */
    function _markSolved(uint256 tokenId, bytes32 solutionHash) internal {
        NFTData storage nft = nftData[tokenId];
        RiddleData storage riddle = riddles[nft.riddleId];

        nft.isSolved = true;
        nft.solveTimestamp = block.timestamp;
        nft.solutionHash = solutionHash;

        // Calculate tiered reward based on solve order
        riddle.totalSolved++;
        uint256 solvePosition = riddle.totalSolved;
        nft.prizeAmount = _calculateTieredReward(riddle.prizePool, riddle.winnerSlots, solvePosition);

        hasUserSolvedRiddle[nft.riddleId][nft.currentOwner] = true;

        // Award RON reputation tokens
        ronToken.awardRON(
            nft.currentOwner,
            IRON.RiddleDifficulty.MEDIUM,
            riddle.totalSolved == 1, // isFirstSolver
            false, // isSpeedSolver
            "Weekly riddle solved"
        );
    }

    // =============================================================
    //                        TIERED REWARD SYSTEM
    // =============================================================

    /**
     * @dev Calculate tiered reward based on solve position
     * Tier 1 (First 25%): 2x multiplier
     * Tier 2 (Middle 50%): 1x multiplier
     * Tier 3 (Last 25%): 0.5x multiplier
     */
    function _calculateTieredReward(
        uint256 prizePool,
        uint256 totalWinners,
        uint256 solvePosition
    ) internal pure returns (uint256) {
        require(solvePosition > 0 && solvePosition <= totalWinners, "Invalid solve position");

        // Handle single winner case
        if (totalWinners == 1) {
            return prizePool;
        }

        // Calculate tier boundaries
        uint256 tier1Boundary = (totalWinners * 25) / 100; // First 25%
        uint256 tier2Boundary = (totalWinners * 75) / 100; // First 75%

        // Ensure at least 1 person in each tier for small winner counts
        if (tier1Boundary == 0) tier1Boundary = 1;
        if (tier2Boundary <= tier1Boundary) tier2Boundary = tier1Boundary + 1;
        if (tier2Boundary >= totalWinners) tier2Boundary = totalWinners - 1;

        // Calculate tier sizes
        uint256 tier1Size = tier1Boundary;
        uint256 tier2Size = tier2Boundary - tier1Boundary;
        uint256 tier3Size = totalWinners - tier2Boundary;

        // Ensure no tier has 0 size for totalWinners >= 2
        if (totalWinners >= 2 && tier3Size == 0) {
            tier2Boundary = totalWinners - 1;
            tier2Size = tier2Boundary - tier1Boundary;
            tier3Size = 1;
        }

        // Calculate total multiplier units (using 1000 basis points for precision)
        uint256 totalUnits = (tier1Size * 2000) + (tier2Size * 1000) + (tier3Size * 500); // 2x, 1x, 0.5x in basis points

        // Avoid division by zero
        if (totalUnits == 0) {
            return prizePool / totalWinners; // Fallback to equal distribution
        }

        // Calculate base unit value
        uint256 baseUnitValue = (prizePool * 1000) / totalUnits; // *1000 for basis points precision

        // Determine which tier this solve position belongs to
        if (solvePosition <= tier1Boundary) {
            return (baseUnitValue * 2000) / 1000; // 2x multiplier
        } else if (solvePosition <= tier2Boundary) {
            return baseUnitValue; // 1x multiplier
        } else {
            return (baseUnitValue * 500) / 1000; // 0.5x multiplier
        }
    }

    /**
     * @dev Preview tiered reward for a given solve position (view function)
     */
    function previewTieredReward(
        uint256 prizePool,
        uint256 totalWinners,
        uint256 solvePosition
    ) external pure returns (uint256) {
        return _calculateTieredReward(prizePool, totalWinners, solvePosition);
    }

    /**
     * @dev Get tier information for a riddle
     */
    function getTierInfo(uint256 totalWinners)
        external
        pure
        returns (
            uint256 tier1Boundary,
            uint256 tier2Boundary,
            uint256 tier1Size,
            uint256 tier2Size,
            uint256 tier3Size
        )
    {
        // Handle single winner case
        if (totalWinners == 1) {
            return (1, 1, 1, 0, 0);
        }

        tier1Boundary = (totalWinners * 25) / 100;
        tier2Boundary = (totalWinners * 75) / 100;

        // Handle edge cases for small winner counts
        if (tier1Boundary == 0) tier1Boundary = 1;
        if (tier2Boundary <= tier1Boundary) tier2Boundary = tier1Boundary + 1;
        if (tier2Boundary >= totalWinners) tier2Boundary = totalWinners - 1;

        tier1Size = tier1Boundary;
        tier2Size = tier2Boundary - tier1Boundary;
        tier3Size = totalWinners - tier2Boundary;

        // Ensure no tier has 0 size for totalWinners >= 2
        if (totalWinners >= 2 && tier3Size == 0) {
            tier2Boundary = totalWinners - 1;
            tier2Size = tier2Boundary - tier1Boundary;
            tier3Size = 1;
        }
    }

    // =============================================================
    //                        COST DISTRIBUTION
    // =============================================================

    /**
     * @dev Distribute mint/attempt/submission costs according to tokenomics
     */
    function _distributeMintCost(uint256 amount) internal {
        uint256 burnAmount = (amount * burnPercent) / 10000;
        uint256 grandPrizeAmount = (amount * grandPrizePercent) / 10000;
        uint256 devOpsAmount = (amount * devOpsPercent) / 10000;

        // Transfer tokens to burn instead of using burnNFTMint (requires role)
        // In production, these would be burned properly

        // Transfer to wallets
        rdlnToken.transfer(grandPrizeWallet, grandPrizeAmount);
        rdlnToken.transfer(devOpsWallet, devOpsAmount);

        globalTotalBurned += burnAmount;
    }

    /**
     * @dev Distribute attempt/submission costs
     */
    function _distributeCost(uint256 amount) internal {
        _distributeMintCost(amount); // Same distribution as mint costs
    }

    // =============================================================
    //                        TRANSFER HOOKS
    // =============================================================

    /**
     * @dev Update NFT owner on transfer while preserving era costs
     */
    function _update(address to, uint256 tokenId, address auth)
        internal override(ERC721, ERC721Enumerable) returns (address) {
        address from = super._update(to, tokenId, auth);

        // Update current owner but preserve all era-locked costs
        if (from != address(0) && to != address(0)) {
            nftData[tokenId].currentOwner = to;
        }

        return from;
    }

    /**
     * @dev Increase balance override for ERC721Enumerable compatibility
     */
    function _increaseBalance(address account, uint128 value)
        internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    // =============================================================
    //                        MINTING FUNCTIONS
    // =============================================================

    /**
     * @dev Simple mint function for testing biennial halving system
     */
    function mintNFT() external nonReentrant whenNotPaused returns (uint256) {
        uint256 currentEra = getCurrentEra();
        uint256 mintCost = getCurrentMintCost();

        // Charge mint cost
        rdlnToken.transferFrom(msg.sender, address(this), mintCost);

        // Mint NFT
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        _safeMint(msg.sender, tokenId);

        // Lock era-specific costs
        nftData[tokenId] = NFTData({
            tokenId: tokenId,
            riddleId: 0, // Simple test NFT
            currentOwner: msg.sender,
            originalMinter: msg.sender,
            mintEra: currentEra,
            mintCost: mintCost,
            baseAttemptCost: getCurrentAttemptCost(),
            baseSubmissionCost: getCurrentSubmissionCost(),
            attemptCount: 0,
            submissionCount: 0,
            isSolved: false,
            solveTimestamp: 0,
            solutionHash: bytes32(0),
            prizeAmount: 0,
            prizeClaimed: false
        });

        // Distribute costs
        _distributeMintCost(mintCost);

        emit NFTMinted(
            tokenId,
            0, // riddleId
            msg.sender,
            currentEra,
            mintCost,
            getCurrentAttemptCost()
        );

        return tokenId;
    }

    // =============================================================
    //                        GAME INTEGRATION
    // =============================================================

    /**
     * @dev Record an attempt on a riddle NFT
     */
    function recordAttempt(uint256 tokenId, bool success)
        external
        onlyRole(OPERATOR_ROLE)
        whenNotPaused
    {
        if (_ownerOf(tokenId) == address(0)) revert InvalidRiddle();

        nftData[tokenId].attemptCount++;

        if (success) {
            nftData[tokenId].isSolved = true;
        }

        emit AttemptRecorded(tokenId, nftData[tokenId].attemptCount, success);
    }

    /**
     * @dev Record a question submission for a riddle NFT
     */
    function recordSubmission(uint256 tokenId, string calldata question)
        external
        onlyRole(OPERATOR_ROLE)
        whenNotPaused
    {
        if (_ownerOf(tokenId) == address(0)) revert InvalidRiddle();

        nftData[tokenId].submissionCount++;

        emit SubmissionRecorded(tokenId, nftData[tokenId].submissionCount, question);
    }

    /**
     * @dev Get attempt count for an NFT
     */
    function getAttemptCount(uint256 tokenId) external view returns (uint256) {
        if (_ownerOf(tokenId) == address(0)) revert InvalidRiddle();
        return nftData[tokenId].attemptCount;
    }

    /**
     * @dev Get submission count for an NFT
     */
    function getSubmissionCount(uint256 tokenId) external view returns (uint256) {
        if (_ownerOf(tokenId) == address(0)) revert InvalidRiddle();
        return nftData[tokenId].submissionCount;
    }

    /**
     * @dev Get next attempt cost for an NFT
     */
    function getNextAttemptCost(uint256 tokenId) external view returns (uint256) {
        if (_ownerOf(tokenId) == address(0)) revert InvalidRiddle();
        return calculateAttemptCost(tokenId);
    }

    /**
     * @dev Get next submission cost for an NFT
     */
    function getNextSubmissionCost(uint256 tokenId) external view returns (uint256) {
        if (_ownerOf(tokenId) == address(0)) revert InvalidRiddle();
        return calculateSubmissionCost(tokenId);
    }

    // =============================================================
    //                        VIEW FUNCTIONS
    // =============================================================

    /**
     * @dev Get comprehensive NFT data including era costs
     */
    function getNFTData(uint256 tokenId) external view returns (NFTData memory) {
        if (_ownerOf(tokenId) == address(0)) revert ERC721NonexistentToken(tokenId);
        return nftData[tokenId];
    }

    /**
     * @dev Get the era when an NFT was minted
     */
    function getNFTEra(uint256 tokenId) external view returns (uint256) {
        if (_ownerOf(tokenId) == address(0)) revert ERC721NonexistentToken(tokenId);
        return nftData[tokenId].mintEra;
    }

    /**
     * @dev Get the locked costs for a specific NFT
     */
    function getNFTCosts(uint256 tokenId) external view returns (uint256 mintCost, uint256 attemptBase, uint256 submissionBase) {
        if (_ownerOf(tokenId) == address(0)) revert ERC721NonexistentToken(tokenId);
        NFTData memory nft = nftData[tokenId];
        return (nft.mintCost, nft.baseAttemptCost, nft.baseSubmissionCost);
    }

    /**
     * @dev Get era information for current time
     */
    function getCurrentEraInfo() external view returns (
        uint256 era,
        uint256 mintCost,
        uint256 attemptCost,
        uint256 submissionCost,
        uint256 timeInEra,
        uint256 timeUntilNextEra
    ) {
        era = getCurrentEra();
        mintCost = getCurrentMintCost();
        attemptCost = getCurrentAttemptCost();
        submissionCost = getCurrentSubmissionCost();

        uint256 eraStartTime = GENESIS_TIME + (era * BIENNIAL_PERIOD);
        timeInEra = block.timestamp - eraStartTime;

        uint256 nextEraStartTime = eraStartTime + BIENNIAL_PERIOD;
        timeUntilNextEra = nextEraStartTime > block.timestamp ?
            nextEraStartTime - block.timestamp : 0;
    }

    /**
     * @dev Get costs for all eras (for planning/UI)
     */
    function getEraCosts(uint256 era) external view returns (
        uint256 mintCost,
        uint256 attemptCost,
        uint256 submissionCost
    ) {
        return (
            eraMintCosts[era],
            eraAttemptCosts[era],
            eraSubmissionCosts[era]
        );
    }

    /**
     * @dev Get next costs for a specific NFT's attempts/submissions
     */
    function getNextCosts(uint256 tokenId) external view returns (
        uint256 nextAttemptCost,
        uint256 nextSubmissionCost
    ) {
        return (
            calculateAttemptCost(tokenId),
            calculateSubmissionCost(tokenId)
        );
    }

    // =============================================================
    //                        ADMIN FUNCTIONS
    // =============================================================

    /**
     * @dev Update commission percentages
     */
    function updateCommissions(
        uint256 _burnPercent,
        uint256 _grandPrizePercent,
        uint256 _devOpsPercent
    ) external onlyRole(ADMIN_ROLE) {
        require(_burnPercent + _grandPrizePercent + _devOpsPercent == 10000, "Must sum to 100%");

        burnPercent = _burnPercent;
        grandPrizePercent = _grandPrizePercent;
        devOpsPercent = _devOpsPercent;
    }

    /**
     * @dev Update wallet addresses
     */
    function updateWallets(
        address _grandPrizeWallet,
        address _devOpsWallet
    ) external onlyRole(ADMIN_ROLE) {
        require(_grandPrizeWallet != address(0), "Invalid grand prize wallet");
        require(_devOpsWallet != address(0), "Invalid devOps wallet");

        grandPrizeWallet = _grandPrizeWallet;
        devOpsWallet = _devOpsWallet;
    }

    /**
     * @dev Pause/unpause contract
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // =============================================================
    //                        OVERRIDES
    // =============================================================

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns the base URI for tokens
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Returns the token URI for a given token ID
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) revert ERC721NonexistentToken(tokenId);
        return string(abi.encodePacked(_baseURI(), Strings.toString(tokenId)));
    }
}