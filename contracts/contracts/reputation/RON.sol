// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "../interfaces/IRON.sol";

/**
 * @title RON - Riddlen Oracle Network Reputation System
 * @dev Soul-bound tokens representing earned human intelligence validation
 * @notice Non-transferable reputation earned through proven problem-solving ability
 *
 * Access Tiers:
 * - Novice (0-999 RON): Basic riddle access only
 * - Solver (1,000-9,999 RON): Medium riddles + basic oracle validation
 * - Expert (10,000-99,999 RON): Hard riddles + complex oracle validation
 * - Oracle (100,000+ RON): All riddles + elite validation + governance
 */
contract RON is AccessControl, ReentrancyGuard, Pausable, IRON {

    // ============ CONSTANTS ============

    bytes32 public constant GAME_ROLE = keccak256("GAME_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Tier thresholds
    uint256 public constant SOLVER_THRESHOLD = 1_000;
    uint256 public constant EXPERT_THRESHOLD = 10_000;
    uint256 public constant ORACLE_THRESHOLD = 100_000;

    // RON rewards by difficulty
    uint256 public constant EASY_RON_MIN = 10;
    uint256 public constant EASY_RON_MAX = 25;
    uint256 public constant MEDIUM_RON_MIN = 50;
    uint256 public constant MEDIUM_RON_MAX = 100;
    uint256 public constant HARD_RON_MIN = 200;
    uint256 public constant HARD_RON_MAX = 500;
    uint256 public constant LEGENDARY_RON_MIN = 1_000;
    uint256 public constant LEGENDARY_RON_MAX = 10_000;

    // Bonus multipliers
    uint256 public constant FIRST_SOLVER_MULTIPLIER = 500; // 5x (500/100)
    uint256 public constant SPEED_SOLVER_MULTIPLIER = 150; // 1.5x (150/100)
    uint256 public constant STREAK_BONUS_RATE = 10; // 10% per streak level

    // ============ STRUCTS ============

    struct UserStats {
        uint256 totalRON;           // Total RON balance (soul-bound)
        uint256 correctAnswers;     // Number of correct riddle solutions
        uint256 totalAttempts;      // Total riddle attempts
        uint256 currentStreak;      // Current consecutive correct answers
        uint256 maxStreak;          // Maximum streak achieved
        uint256 validationsPerformed; // Oracle validations completed
        uint256 lastActivityTime;  // Timestamp of last activity
    }

    struct ValidationStats {
        uint256 basicValidations;    // Content moderation, fact-checking
        uint256 complexValidations;  // Document review, analysis
        uint256 eliteValidations;    // Strategic consulting, disputes
        uint256 accuracyScore;       // Validation accuracy (0-10000 = 0-100%)
    }

    // ============ STATE VARIABLES ============

    // User reputation data
    mapping(address => UserStats) public userStats;
    mapping(address => ValidationStats) public validationStats;

    // Global statistics
    uint256 public totalUsers;
    uint256 public totalRONMinted;
    uint256 public totalValidationsPerformed;

    // Configuration
    bool public dynamicRewardsEnabled = true;
    uint256 public maxStreakBonus = 100; // Maximum 100% bonus from streaks

    // ============ EVENTS ============

    event GlobalStatsUpdated(
        uint256 totalUsers,
        uint256 totalRONMinted,
        uint256 totalValidationsPerformed
    );

    // ============ ERRORS ============

    error NonTransferableToken();
    error InvalidDifficulty();
    error InsufficientAccess();
    error InvalidUser();

    // ============ CONSTRUCTOR ============

    constructor(address _admin) {
        if (_admin == address(0)) revert InvalidUser();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);
    }

    // ============ CORE REPUTATION FUNCTIONS ============

    /**
     * @dev Award RON tokens for solving riddles
     * @param user Address of the user who solved the riddle
     * @param difficulty Difficulty level of the solved riddle
     * @param isFirstSolver Whether user was first to solve this riddle
     * @param isSpeedSolver Whether user solved in top 10% time
     * @param reason Description of achievement
     * @return ronAwarded Total RON tokens awarded (including bonuses)
     */
    function awardRON(
        address user,
        RiddleDifficulty difficulty,
        bool isFirstSolver,
        bool isSpeedSolver,
        string calldata reason
    ) external onlyRole(GAME_ROLE) whenNotPaused nonReentrant returns (uint256 ronAwarded) {
        if (user == address(0)) revert InvalidUser();

        UserStats storage stats = userStats[user];

        // Check if this is a new user
        if (stats.totalRON == 0 && stats.totalAttempts == 0) {
            totalUsers++;
        }

        // Calculate base reward
        uint256 baseReward = _getBaseReward(difficulty);

        // Apply bonuses
        uint256 bonusReward = _calculateBonuses(
            baseReward,
            isFirstSolver,
            isSpeedSolver,
            stats.currentStreak
        );

        ronAwarded = baseReward + bonusReward;

        // Update user stats
        stats.totalRON += ronAwarded;
        stats.correctAnswers++;
        stats.currentStreak++;
        stats.lastActivityTime = block.timestamp;

        if (stats.currentStreak > stats.maxStreak) {
            stats.maxStreak = stats.currentStreak;
        }

        // Update global stats
        totalRONMinted += ronAwarded;

        // Check for tier advancement
        AccessTier newTier = getUserTier(user);

        emit RONEarned(user, ronAwarded, difficulty, reason);

        if (bonusReward > 0) {
            string memory bonusType = _getBonusDescription(isFirstSolver, isSpeedSolver, stats.currentStreak > 1);
            emit BonusApplied(user, baseReward, bonusReward, bonusType);
        }

        emit TierAchieved(user, newTier, stats.totalRON);

        return ronAwarded;
    }

    /**
     * @dev Update user accuracy stats when they attempt a riddle
     * @param user Address of the user
     * @param correct Whether the attempt was correct
     */
    function updateAccuracy(
        address user,
        bool correct
    ) external onlyRole(GAME_ROLE) whenNotPaused {
        if (user == address(0)) revert InvalidUser();

        UserStats storage stats = userStats[user];
        stats.totalAttempts++;
        stats.lastActivityTime = block.timestamp;

        if (!correct) {
            // Reset streak on incorrect answer
            stats.currentStreak = 0;
        }

        uint256 accuracyPercentage = (stats.correctAnswers * 10000) / stats.totalAttempts;

        emit AccuracyUpdated(
            user,
            stats.correctAnswers,
            stats.totalAttempts,
            accuracyPercentage
        );

        emit StreakUpdated(user, stats.currentStreak, stats.maxStreak);
    }

    /**
     * @dev Award RON for oracle validation work
     * @param user Address of the validator
     * @param baseAmount Base RON amount for the validation
     * @param validationType Type of validation performed
     */
    function awardValidationRON(
        address user,
        uint256 baseAmount,
        string calldata validationType
    ) external onlyRole(ORACLE_ROLE) whenNotPaused nonReentrant {
        if (user == address(0)) revert InvalidUser();

        AccessTier userTier = getUserTier(user);
        if (userTier == AccessTier.NOVICE) {
            revert InsufficientAccess();
        }

        UserStats storage stats = userStats[user];
        ValidationStats storage valStats = validationStats[user];

        // Award RON based on validation type and tier
        uint256 ronAwarded = _calculateValidationReward(baseAmount, userTier);

        stats.totalRON += ronAwarded;
        stats.validationsPerformed++;
        stats.lastActivityTime = block.timestamp;

        // Update validation-specific stats
        _updateValidationStats(valStats, validationType);

        totalRONMinted += ronAwarded;
        totalValidationsPerformed++;

        emit RONEarned(user, ronAwarded, RiddleDifficulty.MEDIUM, validationType);
        emit GlobalStatsUpdated(totalUsers, totalRONMinted, totalValidationsPerformed);
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @dev Get user's RON balance (soul-bound, non-transferable)
     */
    function balanceOf(address user) external view returns (uint256) {
        return userStats[user].totalRON;
    }

    /**
     * @dev Get user's current access tier
     */
    function getUserTier(address user) public view returns (AccessTier) {
        uint256 ronBalance = userStats[user].totalRON;

        if (ronBalance >= ORACLE_THRESHOLD) return AccessTier.ORACLE;
        if (ronBalance >= EXPERT_THRESHOLD) return AccessTier.EXPERT;
        if (ronBalance >= SOLVER_THRESHOLD) return AccessTier.SOLVER;
        return AccessTier.NOVICE;
    }

    /**
     * @dev Get comprehensive user statistics
     */
    function getUserStats(address user) external view returns (
        uint256 totalRON,
        AccessTier currentTier,
        uint256 correctAnswers,
        uint256 totalAttempts,
        uint256 accuracyPercentage,
        uint256 currentStreak,
        uint256 maxStreak
    ) {
        UserStats storage stats = userStats[user];

        totalRON = stats.totalRON;
        currentTier = getUserTier(user);
        correctAnswers = stats.correctAnswers;
        totalAttempts = stats.totalAttempts;
        accuracyPercentage = stats.totalAttempts > 0 ?
            (stats.correctAnswers * 10000) / stats.totalAttempts : 0;
        currentStreak = stats.currentStreak;
        maxStreak = stats.maxStreak;
    }

    /**
     * @dev Check riddle access permissions based on tier
     */
    function getRiddleAccess(address user) external view returns (
        bool canAccessEasy,
        bool canAccessMedium,
        bool canAccessHard,
        bool canAccessLegendary
    ) {
        AccessTier tier = getUserTier(user);

        canAccessEasy = true; // All users can access easy riddles
        canAccessMedium = tier >= AccessTier.SOLVER;
        canAccessHard = tier >= AccessTier.EXPERT;
        canAccessLegendary = tier >= AccessTier.ORACLE;
    }

    /**
     * @dev Check oracle validation permissions based on tier
     */
    function getOracleAccess(address user) external view returns (
        bool canValidateBasic,
        bool canValidateComplex,
        bool canValidateElite,
        bool canParticipateGovernance
    ) {
        AccessTier tier = getUserTier(user);

        canValidateBasic = tier >= AccessTier.SOLVER;
        canValidateComplex = tier >= AccessTier.EXPERT;
        canValidateElite = tier >= AccessTier.ORACLE;
        canParticipateGovernance = tier >= AccessTier.ORACLE;
    }

    /**
     * @dev Get tier threshold values
     */
    function getTierThresholds() external pure returns (
        uint256 solverThreshold,
        uint256 expertThreshold,
        uint256 oracleThreshold
    ) {
        return (SOLVER_THRESHOLD, EXPERT_THRESHOLD, ORACLE_THRESHOLD);
    }

    /**
     * @dev Calculate potential RON reward for given parameters
     */
    function calculateRONReward(
        RiddleDifficulty difficulty,
        bool isFirstSolver,
        bool isSpeedSolver,
        uint256 currentStreak
    ) external view returns (uint256 baseReward, uint256 bonusReward) {
        baseReward = _getBaseReward(difficulty);
        bonusReward = _calculateBonuses(baseReward, isFirstSolver, isSpeedSolver, currentStreak);
    }

    /**
     * @dev Get next tier requirement for user
     */
    function getNextTierRequirement(address user) external view returns (
        AccessTier nextTier,
        uint256 ronRequired,
        uint256 ronRemaining
    ) {
        AccessTier currentTier = getUserTier(user);
        uint256 currentRON = userStats[user].totalRON;

        if (currentTier == AccessTier.ORACLE) {
            return (AccessTier.ORACLE, 0, 0); // Already at max tier
        }

        if (currentTier == AccessTier.EXPERT) {
            nextTier = AccessTier.ORACLE;
            ronRequired = ORACLE_THRESHOLD;
        } else if (currentTier == AccessTier.SOLVER) {
            nextTier = AccessTier.EXPERT;
            ronRequired = EXPERT_THRESHOLD;
        } else {
            nextTier = AccessTier.SOLVER;
            ronRequired = SOLVER_THRESHOLD;
        }

        ronRemaining = ronRequired > currentRON ? ronRequired - currentRON : 0;
    }

    // ============ INTERNAL FUNCTIONS ============

    /**
     * @dev Get base RON reward for difficulty level
     */
    function _getBaseReward(RiddleDifficulty difficulty) internal pure returns (uint256) {
        if (difficulty == RiddleDifficulty.EASY) {
            return (EASY_RON_MIN + EASY_RON_MAX) / 2; // Average reward
        } else if (difficulty == RiddleDifficulty.MEDIUM) {
            return (MEDIUM_RON_MIN + MEDIUM_RON_MAX) / 2;
        } else if (difficulty == RiddleDifficulty.HARD) {
            return (HARD_RON_MIN + HARD_RON_MAX) / 2;
        } else if (difficulty == RiddleDifficulty.LEGENDARY) {
            return (LEGENDARY_RON_MIN + LEGENDARY_RON_MAX) / 2;
        }
        revert InvalidDifficulty();
    }

    /**
     * @dev Calculate bonus RON from multipliers
     */
    function _calculateBonuses(
        uint256 baseReward,
        bool isFirstSolver,
        bool isSpeedSolver,
        uint256 currentStreak
    ) internal view returns (uint256) {
        uint256 totalBonus = 0;

        // First solver bonus (5x base reward)
        if (isFirstSolver) {
            totalBonus += (baseReward * (FIRST_SOLVER_MULTIPLIER - 100)) / 100;
        }

        // Speed solver bonus (1.5x base reward)
        if (isSpeedSolver) {
            totalBonus += (baseReward * (SPEED_SOLVER_MULTIPLIER - 100)) / 100;
        }

        // Streak bonus (10% per consecutive correct answer, max 100%)
        if (currentStreak > 1) {
            uint256 streakBonus = (currentStreak - 1) * STREAK_BONUS_RATE;
            if (streakBonus > maxStreakBonus) {
                streakBonus = maxStreakBonus;
            }
            totalBonus += (baseReward * streakBonus) / 100;
        }

        return totalBonus;
    }

    /**
     * @dev Calculate validation reward based on tier
     */
    function _calculateValidationReward(
        uint256 baseAmount,
        AccessTier tier
    ) internal pure returns (uint256) {
        if (tier == AccessTier.SOLVER) return baseAmount;
        if (tier == AccessTier.EXPERT) return (baseAmount * 120) / 100; // 20% bonus
        if (tier == AccessTier.ORACLE) return (baseAmount * 150) / 100; // 50% bonus
        return baseAmount;
    }

    /**
     * @dev Update validation statistics
     */
    function _updateValidationStats(
        ValidationStats storage valStats,
        string memory validationType
    ) internal {
        bytes32 typeHash = keccak256(bytes(validationType));

        if (typeHash == keccak256("BASIC")) {
            valStats.basicValidations++;
        } else if (typeHash == keccak256("COMPLEX")) {
            valStats.complexValidations++;
        } else if (typeHash == keccak256("ELITE")) {
            valStats.eliteValidations++;
        }
    }

    /**
     * @dev Get bonus description for events
     */
    function _getBonusDescription(
        bool isFirstSolver,
        bool isSpeedSolver,
        bool hasStreak
    ) internal pure returns (string memory) {
        if (isFirstSolver && isSpeedSolver) return "FIRST_SPEED_SOLVER";
        if (isFirstSolver) return "FIRST_SOLVER";
        if (isSpeedSolver) return "SPEED_SOLVER";
        if (hasStreak) return "STREAK_BONUS";
        return "STANDARD";
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @dev Pause the contract
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Update dynamic rewards configuration
     */
    function setDynamicRewards(bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        dynamicRewardsEnabled = enabled;
    }

    /**
     * @dev Update maximum streak bonus
     */
    function setMaxStreakBonus(uint256 newMax) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newMax <= 500, "Max bonus too high"); // Maximum 500% bonus
        maxStreakBonus = newMax;
    }

    // ============ SOUL-BOUND TOKEN COMPLIANCE ============

    /**
     * @dev RON tokens are non-transferable (soul-bound)
     */
    function transfer(address, uint256) external pure returns (bool) {
        revert NonTransferableToken();
    }

    function transferFrom(address, address, uint256) external pure returns (bool) {
        revert NonTransferableToken();
    }

    function approve(address, uint256) external pure returns (bool) {
        revert NonTransferableToken();
    }

    // ============ COMPATIBILITY ============

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}