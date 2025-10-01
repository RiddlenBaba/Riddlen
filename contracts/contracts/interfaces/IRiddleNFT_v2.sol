// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title IRiddleNFT - Riddlen Weekly NFT System
 * @dev Weekly riddle releases with randomized parameters, progressive burns, and resale commissions
 */
interface IRiddleNFT is IERC721 {

    // ============ ENUMS ============

    enum RiddleStatus {
        ACTIVE,     // Currently solvable
        SOLVED,     // All winner slots filled
        EXPIRED     // Admin expired (rare)
    }

    enum Difficulty {
        EASY,       // RON: 0-999 required
        MEDIUM,     // RON: 1,000+ required
        HARD,       // RON: 10,000+ required
        LEGENDARY   // RON: 100,000+ required
    }

    // ============ STRUCTS ============

    struct RiddleParameters {
        uint256 maxMintRate;    // 10-1,000 NFT copies available per riddle
        uint256 prizePool;      // 100K-10M RDLN from 700M allocation
        uint256 winnerSlots;    // 1-100 potential winners
        uint256 mintCost;       // Current biennial halving cost
    }

    struct RiddleData {
        uint256 riddleId;       // Unique riddle ID
        uint256 weekNumber;     // Week 1-1000 (1 riddle per week)
        string category;        // "Mathematics", "History", "Crypto", etc.
        Difficulty difficulty;
        bytes32 answerHash;     // Keccak256 hash of correct answer
        string ipfsHash;        // Off-chain content (question, hints, media)
        address creator;        // Who submitted this riddle
        uint256 releaseTime;    // When riddle was released
        RiddleStatus status;
        RiddleParameters params;
        uint256 totalMinted;    // How many NFTs minted so far
        uint256 solverCount;    // How many have solved it
    }

    struct NFTSolveData {
        uint256 tokenId;
        uint256 riddleId;
        address currentOwner;
        address originalMinter;
        uint256 mintedAt;

        // Attempt tracking (follows NFT on resale)
        uint256 failedAttempts; // N failed attempts = next attempt costs N+1 RDLN

        // Solution tracking
        bool solved;
        address solver;         // Who solved it (gets RON reputation)
        uint256 solveTime;      // Block timestamp when solved
        uint256 prizeAmount;    // RDLN prize amount (if winner)
        bool prizeClaimed;      // Whether prize was claimed

        // Performance bonuses
        bool wasFirstSolver;    // First to solve this riddle
        bool wasSpeedSolver;    // Solved in top 10% time
        uint256 ronEarned;      // RON reputation earned
    }

    // ============ EVENTS ============

    event WeeklyRiddleReleased(
        uint256 indexed riddleId,
        uint256 indexed weekNumber,
        Difficulty indexed difficulty,
        RiddleParameters params
    );

    event RiddleNFTMinted(
        uint256 indexed tokenId,
        uint256 indexed riddleId,
        address indexed minter,
        uint256 mintCost
    );

    event AttemptMade(
        uint256 indexed tokenId,
        uint256 indexed riddleId,
        address indexed solver,
        uint256 attemptNumber,
        uint256 burnAmount,
        bool successful
    );

    event RiddleSolved(
        uint256 indexed tokenId,
        uint256 indexed riddleId,
        address indexed solver,
        uint256 prizeAmount,
        uint256 ronEarned,
        bool wasFirstSolver,
        bool wasSpeedSolver
    );

    event NFTResold(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 salePrice,
        uint256 commission
    );

    event CommissionDistributed(
        uint256 totalCommission,
        uint256 burned,
        uint256 toLiquidity,
        uint256 toDevOps
    );

    event PrizeClaimed(
        uint256 indexed tokenId,
        address indexed claimer,
        uint256 amount
    );

    // ============ WEEKLY RIDDLE SYSTEM ============

    function releaseWeeklyRiddle(
        string memory category,
        Difficulty difficulty,
        bytes32 answerHash,
        string memory ipfsHash
    ) external returns (uint256 riddleId);

    function getCurrentWeek() external view returns (uint256);

    function getWeeklyRiddle(uint256 weekNumber) external view returns (uint256 riddleId);

    // ============ NFT MINTING & SOLVING ============

    function mintRiddleNFT(uint256 riddleId) external returns (uint256 tokenId);

    function attemptSolution(
        uint256 tokenId,
        string memory answer
    ) external;

    function claimPrize(uint256 tokenId) external;

    // ============ RESALE SYSTEM ============

    function setResalePrice(uint256 tokenId, uint256 price) external;

    function buyNFT(uint256 tokenId) external payable;

    function getResaleInfo(uint256 tokenId) external view returns (
        bool forSale,
        uint256 price,
        address seller
    );

    // ============ VIEW FUNCTIONS ============

    function getRiddle(uint256 riddleId) external view returns (RiddleData memory);

    function getNFTSolveData(uint256 tokenId) external view returns (NFTSolveData memory);

    function getCurrentMintCost() external view returns (uint256);

    function getBiennialPeriod() external view returns (uint256 period, uint256 cost);

    function getRemainingNFTs(uint256 riddleId) external view returns (uint256);

    function getRiddleWinners(uint256 riddleId) external view returns (address[] memory);

    function canAttemptRiddle(address user, uint256 riddleId) external view returns (
        bool canAttempt,
        string memory reason
    );

    function getNextAttemptCost(uint256 tokenId) external view returns (uint256);

    // ============ STATISTICS ============

    function getGlobalStats() external view returns (
        uint256 totalRiddles,
        uint256 totalNFTsMinted,
        uint256 totalSolved,
        uint256 totalRDLNBurned,
        uint256 totalPrizesDistributed
    );

    function getRiddleStats(uint256 riddleId) external view returns (
        uint256 nftsMinted,
        uint256 solved,
        uint256 averageSolveTime,
        uint256 totalBurned,
        uint256 prizePoolRemaining
    );

    // ============ ADMIN FUNCTIONS ============

    function updateCommissionRates(
        uint256 burnPercent,
        uint256 liquidityPercent,
        uint256 devOpsPercent
    ) external;

    function setDevOpsWallet(address newWallet) external;
    function setLiquidityWallet(address newWallet) external;
}