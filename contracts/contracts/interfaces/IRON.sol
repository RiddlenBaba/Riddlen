// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IRON - Interface for RON (Riddlen Oracle Network) Reputation System
 * @dev Soul-bound tokens representing earned intelligence validation
 */
interface IRON {

    // ============ ENUMS ============

    enum AccessTier {
        NOVICE,     // 0-999 RON
        SOLVER,     // 1,000-9,999 RON
        EXPERT,     // 10,000-99,999 RON
        ORACLE      // 100,000+ RON
    }

    enum RiddleDifficulty {
        EASY,       // 10-25 RON reward
        MEDIUM,     // 50-100 RON reward
        HARD,       // 200-500 RON reward
        LEGENDARY   // 1,000-10,000 RON reward
    }

    // ============ EVENTS ============

    event RONEarned(
        address indexed user,
        uint256 amount,
        RiddleDifficulty indexed difficulty,
        string indexed reason
    );

    event TierAchieved(
        address indexed user,
        AccessTier indexed newTier,
        uint256 totalRON
    );

    event BonusApplied(
        address indexed user,
        uint256 baseRON,
        uint256 bonusRON,
        string indexed bonusType
    );

    event AccuracyUpdated(
        address indexed user,
        uint256 correctAnswers,
        uint256 totalAttempts,
        uint256 accuracyPercentage
    );

    event StreakUpdated(
        address indexed user,
        uint256 currentStreak,
        uint256 maxStreak
    );

    // ============ CORE FUNCTIONS ============

    function awardRON(
        address user,
        RiddleDifficulty difficulty,
        bool isFirstSolver,
        bool isSpeedSolver,
        string calldata reason
    ) external returns (uint256 ronAwarded);

    function updateAccuracy(
        address user,
        bool correct
    ) external;

    function awardValidationRON(
        address user,
        uint256 baseAmount,
        string calldata validationType
    ) external;

    // ============ VIEW FUNCTIONS ============

    function balanceOf(address user) external view returns (uint256);

    function getUserTier(address user) external view returns (AccessTier);

    function getUserStats(address user) external view returns (
        uint256 totalRON,
        AccessTier currentTier,
        uint256 correctAnswers,
        uint256 totalAttempts,
        uint256 accuracyPercentage,
        uint256 currentStreak,
        uint256 maxStreak
    );

    function getRiddleAccess(address user) external view returns (
        bool canAccessEasy,
        bool canAccessMedium,
        bool canAccessHard,
        bool canAccessLegendary
    );

    function getOracleAccess(address user) external view returns (
        bool canValidateBasic,
        bool canValidateComplex,
        bool canValidateElite,
        bool canParticipateGovernance
    );

    function getTierThresholds() external pure returns (
        uint256 solverThreshold,
        uint256 expertThreshold,
        uint256 oracleThreshold
    );

    // ============ REPUTATION CALCULATIONS ============

    function calculateRONReward(
        RiddleDifficulty difficulty,
        bool isFirstSolver,
        bool isSpeedSolver,
        uint256 currentStreak
    ) external view returns (uint256 baseReward, uint256 bonusReward);

    function getNextTierRequirement(address user) external view returns (
        AccessTier nextTier,
        uint256 ronRequired,
        uint256 ronRemaining
    );
}