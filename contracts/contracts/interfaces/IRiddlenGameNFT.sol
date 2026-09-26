// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title IRiddlenGameNFT
 * @dev Interface for the dynamic game NFT system
 */
interface IRiddlenGameNFT is IERC721 {

    // Enums
    enum GameType {
        RIDDLE,
        LOGIC_PUZZLE,
        MATH_CHALLENGE,
        CODE_PUZZLE,
        WORD_GAME,
        COMMUNITY_QUEST
    }

    enum DifficultyLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED,
        EXPERT,
        LEGENDARY
    }

    enum SubmissionStatus {
        PENDING,
        APPROVED,
        REJECTED,
        USED
    }

    enum GameNFTStatus {
        ACTIVE,
        COMPLETED,
        EXPIRED,
        LEGENDARY
    }

    // Structs
    struct GameSubmission {
        address submitter;
        GameType gameType;
        string contentIPFS;
        string solutionIPFS;
        DifficultyLevel difficulty;
        uint256 submissionTime;
        SubmissionStatus status;
        uint256 validatorVotes;
        uint256 qualityScore;
        uint256 era;
    }

    struct GameNFTData {
        uint256 weekNumber;
        uint256 era;
        GameType primaryType;
        DifficultyLevel difficulty;
        string gameDataIPFS;
        uint256 totalChallenges;
        uint256 solvedChallenges;
        uint256 creationTime;
        uint256 expiryTime;
        GameNFTStatus status;
        uint256 totalPlayers;
        uint256 totalRewardsDistributed;
        address[] topSolvers;
    }

    struct WeeklyStats {
        uint256 weekNumber;
        uint256 totalSubmissions;
        uint256 approvedSubmissions;
        uint256 uniqueSubmitters;
        bool nftGenerated;
        uint256 nftTokenId;
        GameType dominantType;
    }

    // Events
    event GameSubmissionCreated(
        uint256 indexed submissionId,
        address indexed submitter,
        GameType gameType,
        uint256 week,
        uint256 era
    );

    event SubmissionValidated(
        uint256 indexed submissionId,
        address indexed validator,
        bool approved,
        uint256 qualityScore
    );

    event WeeklyGameNFTGenerated(
        uint256 indexed tokenId,
        uint256 indexed weekNumber,
        uint256 era,
        GameType primaryType,
        DifficultyLevel difficulty,
        uint256 totalChallenges
    );

    event ChallengeSolved(
        uint256 indexed tokenId,
        address indexed solver,
        uint256 challengeIndex,
        uint256 ronReward,
        bool gameCompleted
    );

    event GameCompleted(
        uint256 indexed tokenId,
        uint256 completionTime,
        address[] topSolvers,
        uint256 totalRewards
    );

    // Core functions
    function submitGameContent(
        GameType gameType,
        string calldata contentIPFS,
        string calldata solutionIPFS
    ) external;

    function validateSubmission(
        uint256 submissionId,
        bool approve,
        uint256 qualityScore
    ) external;

    function solveChallengeUse(
        uint256 tokenId,
        uint256 challengeIndex,
        string calldata solutionIPFS
    ) external;

    // View functions
    function getCurrentEra() external view returns (uint256);
    function getCurrentWeek() external view returns (uint256);

    function getPlayerStats(address player) external view returns (
        uint256 gamesPlayed,
        uint256 challengesSolved,
        uint256 totalRONEarned,
        uint256 submissionsApproved,
        uint256 currentStreak,
        uint256 maxStreak
    );

    function getWeeklyStats(uint256 week) external view returns (WeeklyStats memory);
    function canGenerateWeeklyNFT() external view returns (bool);

    // Admin functions
    function forceGenerateWeeklyNFT() external;
    function setGameDataIPFS(uint256 tokenId, string calldata gameDataIPFS) external;
}