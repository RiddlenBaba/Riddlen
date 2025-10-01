// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol";
import "../interfaces/IRON.sol";

/**
 * @title RONUpgradeable - Riddlen Oracle Network Reputation System (Upgradeable)
 * @dev Enterprise-grade soul-bound reputation tokens with 2025 best practices
 * @notice Non-transferable reputation earned through proven problem-solving ability
 *
 * Features:
 * - UUPS upgradeable pattern for future-proofing
 * - Gas-optimized storage packing
 * - Batch operations for efficiency
 * - Circuit breakers and rate limiting
 * - Compliance hooks for regulatory future-proofing
 * - Enhanced analytics and event logging
 * - Cross-chain bridge preparation
 * - Comprehensive error handling
 *
 * Access Tiers:
 * - Novice (0-999 RON): Basic riddle access only
 * - Solver (1,000-9,999 RON): Medium riddles + basic oracle validation
 * - Expert (10,000-99,999 RON): Hard riddles + complex oracle validation
 * - Oracle (100,000+ RON): All riddles + elite validation + governance
 */
contract RONUpgradeable is
    Initializable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable,
    IRON
{
    // ============ CONSTANTS ============

    bytes32 public constant GAME_ROLE = keccak256("GAME_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE");

    // Tier thresholds (kept as constants - governance structure)
    uint256 public constant SOLVER_THRESHOLD = 1_000;
    uint256 public constant EXPERT_THRESHOLD = 10_000;
    uint256 public constant ORACLE_THRESHOLD = 100_000;

    // RON rewards by difficulty (NOW ADJUSTABLE via governance)
    uint256 public easyRONMin;
    uint256 public easyRONMax;
    uint256 public mediumRONMin;
    uint256 public mediumRONMax;
    uint256 public hardRONMin;
    uint256 public hardRONMax;
    uint256 public legendaryRONMin;
    uint256 public legendaryRONMax;

    // Circuit breaker limits
    uint256 public constant MAX_DAILY_RON_MINT = 1_000_000; // 1M RON per day
    uint256 public constant MAX_SINGLE_RON_AWARD = 50_000; // 50K RON per award
    uint256 public constant MAX_BATCH_SIZE = 50;

    // Bonus multipliers (basis points for precision)
    uint256 public constant FIRST_SOLVER_MULTIPLIER = 500; // 5x (500/100)
    uint256 public constant SPEED_SOLVER_MULTIPLIER = 150; // 1.5x (150/100)
    uint256 public constant STREAK_BONUS_RATE = 10; // 10% per streak level

    // ============ CUSTOM ERRORS ============

    error SoulBoundTokenTransfer();
    error TierRequirementNotMet(address user, AccessTier required, AccessTier current);
    error ValidationTypeNotSupported(string validationType);
    error StreakBonusExceeded(uint256 attempted, uint256 maximum);
    error BatchSizeExceeded(uint256 requested, uint256 maximum);
    error StatisticsUpdateFailed(address user, string reason);
    error SingleAwardLimitExceeded(uint256 attempted, uint256 maximum);
    error DailyMintLimitExceeded(uint256 attempted, uint256 maximum);
    error ComplianceViolation(address user, string reason);
    error UnauthorizedUpgrade(address implementation);
    error ArrayLengthMismatch();
    error InvalidDifficulty(uint8 difficulty);
    error RateLimitExceeded(address user, uint256 cooldownRemaining);

    // ============ OPTIMIZED STRUCTS ============

    /**
     * @dev Gas-optimized user statistics structure
     * Packed to minimize storage slots from 7 to 3 slots
     */
    struct UserStatsOptimized {
        uint128 totalRON;           // Slot 1: First half
        uint64 correctAnswers;      // Slot 1: Second half (partial)
        uint32 currentStreak;       // Slot 1: Second half (remaining)
        uint32 maxStreak;          // Slot 2: First part
        uint64 validationsPerformed; // Slot 2: Second part
        uint32 lastActivityTime;   // Slot 3: First part
        uint32 totalAttempts;      // Slot 3: Second part (partial)
        uint32 tier;               // Slot 3: Remaining space
        // Total: 3 storage slots vs original 7 slots (57% gas savings)
    }

    struct GlobalStatsOptimized {
        uint128 totalUsers;         // Slot 1: First half
        uint128 totalRONMinted;     // Slot 1: Second half
        uint64 totalRiddlesSolved;  // Slot 2: First part
        uint64 totalValidations;    // Slot 2: Second part
        uint64 dailyActiveUsers;    // Slot 3: First part
        uint32 lastUpdateTime;      // Slot 3: Second part (partial)
        // Total: 3 storage slots vs original 5 slots (40% gas savings)
    }

    // ============ STATE VARIABLES ============

    mapping(address => UserStatsOptimized) public userStats;
    GlobalStatsOptimized public globalStats;

    // Circuit breaker state
    mapping(uint256 => uint256) public dailyRONMinted; // day => amount
    mapping(address => uint256) public lastAwardTime; // rate limiting
    uint256 public minAwardCooldown; // seconds between awards per user

    // Compliance system
    address public complianceModule;
    bool public complianceEnabled;
    mapping(address => bool) public complianceBlocked;

    // Cross-chain bridge preparation
    mapping(uint256 => bool) public supportedChains;
    mapping(bytes32 => bool) public processedReputationTransfers;

    // Analytics and governance
    mapping(address => mapping(string => uint256)) public userMetrics;
    mapping(string => uint256) public systemMetrics;

    // Upgrade storage gap
    uint256[50] private __gap;

    // ============ EVENTS ============

    event RONEarnedEnhanced(
        address indexed user,
        uint256 indexed amount,
        RiddleDifficulty indexed difficulty,
        string reason,
        uint256 timestamp,
        uint256 userTotalRON,
        AccessTier newTier
    );

    event ValidationRONEarned(
        address indexed validator,
        uint256 indexed amount,
        string indexed validationType,
        uint256 timestamp
    );

    event PerformanceMetrics(
        address indexed user,
        uint256 indexed metricType, // 0=accuracy, 1=streak, 2=validation
        uint256 oldValue,
        uint256 newValue,
        uint256 timestamp
    );

    event SystemHealthCheck(
        uint256 totalUsers,
        uint256 totalRONMinted,
        uint256 averageUserRON,
        uint256 timestamp
    );

    event CrossChainReputationSync(
        address indexed user,
        uint256 ronAmount,
        uint256 targetChain,
        bytes32 syncHash
    );

    event ComplianceUpdate(
        address indexed user,
        bool blocked,
        string reason
    );

    event CircuitBreakerTriggered(
        string indexed breakerType,
        uint256 value,
        uint256 limit,
        uint256 timestamp
    );

    event BatchOperationExecuted(
        address indexed operator,
        uint256 indexed operationType, // 0=award, 1=validation, 2=metrics
        uint256 itemsProcessed,
        uint256 gasUsed
    );

    event RateLimitUpdated(
        uint256 oldCooldown,
        uint256 newCooldown,
        address indexed admin
    );

    event RewardRangeUpdated(
        RiddleDifficulty indexed difficulty,
        uint256 oldMin,
        uint256 oldMax,
        uint256 newMin,
        uint256 newMax
    );

    event AllRewardRangesUpdated(
        uint256[8] newRanges // [easyMin, easyMax, mediumMin, mediumMax, hardMin, hardMax, legendaryMin, legendaryMax]
    );

    // ============ MODIFIERS ============

    modifier ronLimits(uint256 ronAmount) {
        if (ronAmount > MAX_SINGLE_RON_AWARD) {
            revert SingleAwardLimitExceeded(ronAmount, MAX_SINGLE_RON_AWARD);
        }

        uint256 today = block.timestamp / 1 days;
        if (dailyRONMinted[today] + ronAmount > MAX_DAILY_RON_MINT) {
            revert DailyMintLimitExceeded(
                dailyRONMinted[today] + ronAmount,
                MAX_DAILY_RON_MINT
            );
        }

        dailyRONMinted[today] += ronAmount;
        _;
    }

    modifier onlyCompliant(address user) {
        if (complianceEnabled && complianceModule != address(0)) {
            (bool success, bytes memory result) = complianceModule.staticcall(
                abi.encodeWithSignature("isRONOperationAllowed(address)", user)
            );
            if (success && result.length > 0 && !abi.decode(result, (bool))) {
                revert ComplianceViolation(user, "RON operation not allowed");
            }
        }

        if (complianceBlocked[user]) {
            revert ComplianceViolation(user, "User is compliance blocked");
        }
        _;
    }

    modifier rateLimited(address user) {
        if (minAwardCooldown > 0) {
            uint256 timeSinceLastAward = block.timestamp - lastAwardTime[user];
            if (timeSinceLastAward < minAwardCooldown) {
                revert RateLimitExceeded(user, minAwardCooldown - timeSinceLastAward);
            }
        }
        lastAwardTime[user] = block.timestamp;
        _;
    }

    // ============ INITIALIZATION ============

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _admin,
        uint256 _minAwardCooldown
    ) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        // Grant roles
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);
        _grantRole(COMPLIANCE_ROLE, _admin);

        // Initialize state
        minAwardCooldown = _minAwardCooldown;
        globalStats.lastUpdateTime = uint32(block.timestamp);

        // Initialize RON reward ranges (can be updated via governance)
        easyRONMin = 10;
        easyRONMax = 25;
        mediumRONMin = 50;
        mediumRONMax = 100;
        hardRONMin = 200;
        hardRONMax = 500;
        legendaryRONMin = 1_000;
        legendaryRONMax = 10_000;

        // Initialize system metrics
        systemMetrics["contractVersion"] = 1;
        systemMetrics["deploymentTime"] = block.timestamp;
    }

    // ============ CORE RON FUNCTIONALITY ============

    /**
     * @dev Award RON tokens for solving riddles with enhanced tracking
     */
    function awardRON(
        address user,
        RiddleDifficulty difficulty,
        bool isFirstSolver,
        bool isSpeedSolver,
        string calldata reason
    )
        external
        override
        onlyRole(GAME_ROLE)
        whenNotPaused
        nonReentrant
        onlyCompliant(user)
        rateLimited(user)
        returns (uint256 ronAmount)
    {
        ronAmount = _calculateRONReward(user, difficulty, isFirstSolver, isSpeedSolver);
        return _awardRONInternal(user, difficulty, isFirstSolver, isSpeedSolver, reason, ronAmount);
    }

    /**
     * @dev Internal RON awarding with circuit breaker protection
     */
    function _awardRONInternal(
        address user,
        RiddleDifficulty difficulty,
        bool isFirstSolver,
        bool isSpeedSolver,
        string memory reason,
        uint256 ronAmount
    ) internal ronLimits(ronAmount) returns (uint256) {
        UserStatsOptimized storage stats = userStats[user];

        // Update user statistics (gas-optimized)
        stats.totalRON += uint128(ronAmount);
        stats.correctAnswers += 1;
        stats.lastActivityTime = uint32(block.timestamp);

        // Handle streak logic
        if (isFirstSolver || isSpeedSolver) {
            stats.currentStreak += 1;
            if (stats.currentStreak > stats.maxStreak) {
                stats.maxStreak = stats.currentStreak;
            }
        }

        // Update tier
        AccessTier newTier = _calculateUserTier(stats.totalRON);
        stats.tier = uint32(newTier);

        // Update global statistics
        globalStats.totalRONMinted += uint128(ronAmount);
        globalStats.totalRiddlesSolved += 1;
        globalStats.lastUpdateTime = uint32(block.timestamp);

        // If new user, increment counter
        if (stats.correctAnswers == 1) {
            globalStats.totalUsers += 1;
        }

        // Emit enhanced event
        emit RONEarnedEnhanced(
            user,
            ronAmount,
            difficulty,
            reason,
            block.timestamp,
            stats.totalRON,
            newTier
        );

        // Update performance metrics
        _updatePerformanceMetrics(user, 0, stats.correctAnswers - 1, stats.correctAnswers);

        return ronAmount;
    }

    // ============ BATCH OPERATIONS ============

    /**
     * @dev Batch award RON to multiple users for gas efficiency
     */
    function batchAwardRON(
        address[] calldata users,
        RiddleDifficulty[] calldata difficulties,
        bool[] calldata isFirstSolvers,
        bool[] calldata isSpeedSolvers,
        string[] calldata reasons
    )
        external
        onlyRole(GAME_ROLE)
        whenNotPaused
        nonReentrant
        returns (uint256[] memory ronAmounts)
    {
        uint256 batchSize = users.length;
        if (batchSize > MAX_BATCH_SIZE) {
            revert BatchSizeExceeded(batchSize, MAX_BATCH_SIZE);
        }

        // Validate array lengths
        if (batchSize != difficulties.length ||
            batchSize != isFirstSolvers.length ||
            batchSize != isSpeedSolvers.length ||
            batchSize != reasons.length) {
            revert ArrayLengthMismatch();
        }

        ronAmounts = new uint256[](batchSize);
        uint256 gasStart = gasleft();

        for (uint256 i = 0; i < batchSize; i++) {
            // Skip rate limiting for batch operations but keep compliance
            if (complianceBlocked[users[i]]) continue;

            uint256 ronAmount = _calculateRONReward(
                users[i],
                difficulties[i],
                isFirstSolvers[i],
                isSpeedSolvers[i]
            );

            ronAmounts[i] = _awardRONInternal(
                users[i],
                difficulties[i],
                isFirstSolvers[i],
                isSpeedSolvers[i],
                reasons[i],
                ronAmount
            );
        }

        uint256 gasUsed = gasStart - gasleft();
        emit BatchOperationExecuted(msg.sender, 0, batchSize, gasUsed);
    }

    /**
     * @dev Batch award validation RON to multiple users
     */
    function batchAwardValidationRON(
        address[] calldata validators,
        uint256[] calldata amounts,
        string[] calldata validationTypes
    )
        external
        onlyRole(ORACLE_ROLE)
        whenNotPaused
        nonReentrant
        returns (uint256 totalAwarded)
    {
        uint256 batchSize = validators.length;
        if (batchSize > MAX_BATCH_SIZE) {
            revert BatchSizeExceeded(batchSize, MAX_BATCH_SIZE);
        }

        if (batchSize != amounts.length || batchSize != validationTypes.length) {
            revert ArrayLengthMismatch();
        }

        uint256 gasStart = gasleft();

        for (uint256 i = 0; i < batchSize; i++) {
            if (!complianceBlocked[validators[i]]) {
                _awardValidationRONInternal(validators[i], amounts[i], validationTypes[i]);
                totalAwarded += amounts[i];
            }
        }

        uint256 gasUsed = gasStart - gasleft();
        emit BatchOperationExecuted(msg.sender, 1, batchSize, gasUsed);
    }

    // ============ VALIDATION FUNCTIONALITY ============

    /**
     * @dev Award RON for oracle validation work
     */
    function awardValidationRON(
        address validator,
        uint256 ronAmount,
        string calldata validationType
    )
        external
        override
        onlyRole(ORACLE_ROLE)
        whenNotPaused
        nonReentrant
        onlyCompliant(validator)
        ronLimits(ronAmount)
    {
        _awardValidationRONInternal(validator, ronAmount, validationType);
    }

    function _awardValidationRONInternal(
        address validator,
        uint256 ronAmount,
        string memory validationType
    ) internal {
        UserStatsOptimized storage stats = userStats[validator];

        stats.totalRON += uint128(ronAmount);
        stats.validationsPerformed += 1;
        stats.lastActivityTime = uint32(block.timestamp);

        globalStats.totalRONMinted += uint128(ronAmount);
        globalStats.totalValidations += 1;

        emit ValidationRONEarned(validator, ronAmount, validationType, block.timestamp);

        // Update performance metrics
        _updatePerformanceMetrics(validator, 2, stats.validationsPerformed - 1, stats.validationsPerformed);
    }

    // ============ TIER AND ACCESS FUNCTIONS ============

    function getUserTier(address user) external view override returns (AccessTier) {
        return AccessTier(userStats[user].tier);
    }

    function hasRiddleAccess(address user, RiddleDifficulty difficulty)
        external
        view
        returns (bool)
    {
        AccessTier tier = AccessTier(userStats[user].tier);

        if (difficulty == RiddleDifficulty.EASY) return true;
        if (difficulty == RiddleDifficulty.MEDIUM) return tier >= AccessTier.SOLVER;
        if (difficulty == RiddleDifficulty.HARD) return tier >= AccessTier.EXPERT;
        if (difficulty == RiddleDifficulty.LEGENDARY) return tier >= AccessTier.ORACLE;

        return false;
    }

    function hasOracleAccess(address user) external view returns (bool) {
        return AccessTier(userStats[user].tier) >= AccessTier.SOLVER;
    }

    // ============ COMPLIANCE SYSTEM ============

    function setComplianceModule(address _module, bool _enabled)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        address oldModule = complianceModule;
        complianceModule = _module;
        complianceEnabled = _enabled;

        emit ComplianceUpdate(address(0), _enabled, "Module updated");
    }

    function setComplianceBlocked(address user, bool blocked, string calldata reason)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        complianceBlocked[user] = blocked;
        emit ComplianceUpdate(user, blocked, reason);
    }

    // ============ CROSS-CHAIN BRIDGE PREPARATION ============

    function setSupportedChain(uint256 chainId, bool supported)
        external
        onlyRole(BRIDGE_ROLE)
    {
        supportedChains[chainId] = supported;
    }

    function syncReputationCrossChain(
        address user,
        uint256 targetChain
    ) external onlyRole(BRIDGE_ROLE) {
        if (!supportedChains[targetChain]) {
            revert("Chain not supported");
        }

        uint256 userRON = userStats[user].totalRON;
        bytes32 syncHash = keccak256(abi.encodePacked(
            user, userRON, targetChain, block.timestamp
        ));

        if (!processedReputationTransfers[syncHash]) {
            processedReputationTransfers[syncHash] = true;
            emit CrossChainReputationSync(user, userRON, targetChain, syncHash);
        }
    }

    // ============ ANALYTICS AND METRICS ============

    function _updatePerformanceMetrics(
        address user,
        uint256 metricType,
        uint256 oldValue,
        uint256 newValue
    ) internal {
        emit PerformanceMetrics(user, metricType, oldValue, newValue, block.timestamp);
    }

    function triggerSystemHealthCheck() external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 totalUsers = globalStats.totalUsers;
        uint256 totalRON = globalStats.totalRONMinted;
        uint256 averageRON = totalUsers > 0 ? totalRON / totalUsers : 0;

        emit SystemHealthCheck(totalUsers, totalRON, averageRON, block.timestamp);
    }

    // ============ ADMIN FUNCTIONS ============

    function setRateLimitCooldown(uint256 _cooldown)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        uint256 oldCooldown = minAwardCooldown;
        minAwardCooldown = _cooldown;
        emit RateLimitUpdated(oldCooldown, _cooldown, msg.sender);
    }

    function emergencyCircuitBreaker(string calldata reason)
        external
        onlyRole(PAUSER_ROLE)
    {
        _pause();
        emit CircuitBreakerTriggered("EMERGENCY_PAUSE", 0, 0, block.timestamp);
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Update RON reward ranges for a specific difficulty
     * @notice Only callable by admin/governance to adjust rewards based on token value
     */
    function updateRewardRange(
        RiddleDifficulty difficulty,
        uint256 newMin,
        uint256 newMax
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newMin > 0 && newMax > newMin, "Invalid reward range");
        require(newMax <= MAX_SINGLE_RON_AWARD, "Exceeds circuit breaker");

        uint256 oldMin;
        uint256 oldMax;

        if (difficulty == RiddleDifficulty.EASY) {
            oldMin = easyRONMin;
            oldMax = easyRONMax;
            easyRONMin = newMin;
            easyRONMax = newMax;
        } else if (difficulty == RiddleDifficulty.MEDIUM) {
            oldMin = mediumRONMin;
            oldMax = mediumRONMax;
            mediumRONMin = newMin;
            mediumRONMax = newMax;
        } else if (difficulty == RiddleDifficulty.HARD) {
            oldMin = hardRONMin;
            oldMax = hardRONMax;
            hardRONMin = newMin;
            hardRONMax = newMax;
        } else if (difficulty == RiddleDifficulty.LEGENDARY) {
            oldMin = legendaryRONMin;
            oldMax = legendaryRONMax;
            legendaryRONMin = newMin;
            legendaryRONMax = newMax;
        }

        emit RewardRangeUpdated(difficulty, oldMin, oldMax, newMin, newMax);
    }

    /**
     * @dev Batch update all reward ranges at once
     */
    function updateAllRewardRanges(
        uint256[8] calldata ranges // [easyMin, easyMax, mediumMin, mediumMax, hardMin, hardMax, legendaryMin, legendaryMax]
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(ranges[0] > 0 && ranges[1] > ranges[0], "Invalid easy range");
        require(ranges[2] > 0 && ranges[3] > ranges[2], "Invalid medium range");
        require(ranges[4] > 0 && ranges[5] > ranges[4], "Invalid hard range");
        require(ranges[6] > 0 && ranges[7] > ranges[6], "Invalid legendary range");
        require(ranges[7] <= MAX_SINGLE_RON_AWARD, "Exceeds circuit breaker");

        easyRONMin = ranges[0];
        easyRONMax = ranges[1];
        mediumRONMin = ranges[2];
        mediumRONMax = ranges[3];
        hardRONMin = ranges[4];
        hardRONMax = ranges[5];
        legendaryRONMin = ranges[6];
        legendaryRONMax = ranges[7];

        emit AllRewardRangesUpdated(ranges);
    }

    // ============ INTERNAL HELPER FUNCTIONS ============

    function _calculateRONReward(
        address user,
        RiddleDifficulty difficulty,
        bool isFirstSolver,
        bool isSpeedSolver
    ) internal view returns (uint256) {
        uint256 baseReward;

        if (difficulty == RiddleDifficulty.EASY) {
            baseReward = easyRONMin + (block.timestamp % (easyRONMax - easyRONMin + 1));
        } else if (difficulty == RiddleDifficulty.MEDIUM) {
            baseReward = mediumRONMin + (block.timestamp % (mediumRONMax - mediumRONMin + 1));
        } else if (difficulty == RiddleDifficulty.HARD) {
            baseReward = hardRONMin + (block.timestamp % (hardRONMax - hardRONMin + 1));
        } else if (difficulty == RiddleDifficulty.LEGENDARY) {
            baseReward = legendaryRONMin + (block.timestamp % (legendaryRONMax - legendaryRONMin + 1));
        }

        // Apply multipliers
        if (isFirstSolver) {
            baseReward = (baseReward * FIRST_SOLVER_MULTIPLIER) / 100;
        } else if (isSpeedSolver) {
            baseReward = (baseReward * SPEED_SOLVER_MULTIPLIER) / 100;
        }

        // Apply streak bonus
        uint256 streak = userStats[user].currentStreak;
        if (streak > 0) {
            uint256 streakBonus = (baseReward * streak * STREAK_BONUS_RATE) / 100;
            baseReward += streakBonus;
        }

        return baseReward;
    }

    function _calculateUserTier(uint256 totalRON) internal pure returns (AccessTier) {
        if (totalRON >= ORACLE_THRESHOLD) return AccessTier.ORACLE;
        if (totalRON >= EXPERT_THRESHOLD) return AccessTier.EXPERT;
        if (totalRON >= SOLVER_THRESHOLD) return AccessTier.SOLVER;
        return AccessTier.NOVICE;
    }

    // ============ VIEW FUNCTIONS ============

    function balanceOf(address user) external view override returns (uint256) {
        return userStats[user].totalRON;
    }

    function getUserStats(address user)
        external
        view
        override
        returns (
            uint256 totalRON,
            AccessTier currentTier,
            uint256 correctAnswers,
            uint256 totalAttempts,
            uint256 accuracyPercentage,
            uint256 currentStreak,
            uint256 maxStreak
        )
    {
        UserStatsOptimized storage stats = userStats[user];
        uint256 accuracy = stats.totalAttempts > 0
            ? (stats.correctAnswers * 100) / stats.totalAttempts
            : 0;

        return (
            stats.totalRON,
            AccessTier(stats.tier),
            stats.correctAnswers,
            stats.totalAttempts,
            accuracy,
            stats.currentStreak,
            stats.maxStreak
        );
    }

    function getRiddleAccess(address user) external view override returns (
        bool canAccessEasy,
        bool canAccessMedium,
        bool canAccessHard,
        bool canAccessLegendary
    ) {
        AccessTier tier = AccessTier(userStats[user].tier);

        return (
            true, // Everyone can access easy
            tier >= AccessTier.SOLVER,
            tier >= AccessTier.EXPERT,
            tier >= AccessTier.ORACLE
        );
    }

    function getOracleAccess(address user) external view override returns (
        bool canValidateBasic,
        bool canValidateComplex,
        bool canValidateElite,
        bool canParticipateGovernance
    ) {
        AccessTier tier = AccessTier(userStats[user].tier);

        return (
            tier >= AccessTier.SOLVER,
            tier >= AccessTier.EXPERT,
            tier >= AccessTier.ORACLE,
            tier >= AccessTier.ORACLE
        );
    }

    function getTierThresholds() external pure override returns (
        uint256 solverThreshold,
        uint256 expertThreshold,
        uint256 oracleThreshold
    ) {
        return (SOLVER_THRESHOLD, EXPERT_THRESHOLD, ORACLE_THRESHOLD);
    }

    function calculateRONReward(
        RiddleDifficulty difficulty,
        bool isFirstSolver,
        bool isSpeedSolver,
        uint256 currentStreak
    ) external view override returns (uint256 baseReward, uint256 bonusReward) {
        if (difficulty == RiddleDifficulty.EASY) {
            baseReward = easyRONMin + (block.timestamp % (easyRONMax - easyRONMin + 1));
        } else if (difficulty == RiddleDifficulty.MEDIUM) {
            baseReward = mediumRONMin + (block.timestamp % (mediumRONMax - mediumRONMin + 1));
        } else if (difficulty == RiddleDifficulty.HARD) {
            baseReward = hardRONMin + (block.timestamp % (hardRONMax - hardRONMin + 1));
        } else if (difficulty == RiddleDifficulty.LEGENDARY) {
            baseReward = legendaryRONMin + (block.timestamp % (legendaryRONMax - legendaryRONMin + 1));
        }

        bonusReward = 0;

        // Apply multipliers
        if (isFirstSolver) {
            bonusReward = (baseReward * (FIRST_SOLVER_MULTIPLIER - 100)) / 100;
        } else if (isSpeedSolver) {
            bonusReward = (baseReward * (SPEED_SOLVER_MULTIPLIER - 100)) / 100;
        }

        // Apply streak bonus
        if (currentStreak > 0) {
            bonusReward += (baseReward * currentStreak * STREAK_BONUS_RATE) / 100;
        }
    }

    function getNextTierRequirement(address user)
        external
        view
        override
        returns (
            AccessTier nextTier,
            uint256 ronRequired,
            uint256 ronRemaining
        )
    {
        AccessTier currentTier = AccessTier(userStats[user].tier);
        uint256 currentRON = userStats[user].totalRON;

        if (currentTier == AccessTier.NOVICE) {
            nextTier = AccessTier.SOLVER;
            ronRequired = SOLVER_THRESHOLD;
            ronRemaining = currentRON >= SOLVER_THRESHOLD ? 0 : SOLVER_THRESHOLD - currentRON;
        } else if (currentTier == AccessTier.SOLVER) {
            nextTier = AccessTier.EXPERT;
            ronRequired = EXPERT_THRESHOLD;
            ronRemaining = currentRON >= EXPERT_THRESHOLD ? 0 : EXPERT_THRESHOLD - currentRON;
        } else if (currentTier == AccessTier.EXPERT) {
            nextTier = AccessTier.ORACLE;
            ronRequired = ORACLE_THRESHOLD;
            ronRemaining = currentRON >= ORACLE_THRESHOLD ? 0 : ORACLE_THRESHOLD - currentRON;
        } else {
            nextTier = AccessTier.ORACLE; // Already at highest tier
            ronRequired = ORACLE_THRESHOLD;
            ronRemaining = 0;
        }
    }

    function getGlobalStats()
        external
        view
        returns (uint256, uint256, uint256, uint256)
    {
        return (
            globalStats.totalUsers,
            globalStats.totalRONMinted,
            globalStats.totalRiddlesSolved,
            globalStats.totalValidations
        );
    }

    // ============ INTERFACE REQUIRED FUNCTIONS ============

    function updateAccuracy(
        address user,
        bool correct
    ) external override onlyRole(GAME_ROLE) {
        UserStatsOptimized storage stats = userStats[user];
        stats.totalAttempts += 1;

        if (correct) {
            stats.correctAnswers += 1;
        } else {
            // Reset streak on incorrect answer
            stats.currentStreak = 0;
        }

        stats.lastActivityTime = uint32(block.timestamp);
    }

    // ============ SOUL-BOUND TOKEN PROPERTIES ============

    function transfer(address, uint256) external pure returns (bool) {
        revert SoulBoundTokenTransfer();
    }

    function transferFrom(address, address, uint256) external pure returns (bool) {
        revert SoulBoundTokenTransfer();
    }

    function approve(address, uint256) external pure returns (bool) {
        revert SoulBoundTokenTransfer();
    }

    // ============ UPGRADEABILITY ============

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {
        if (newImplementation == address(0)) {
            revert UnauthorizedUpgrade(newImplementation);
        }
        // Additional upgrade validation could be added here
    }

    function getImplementation() external view returns (address) {
        return ERC1967Utils.getImplementation();
    }

    // ============ COMPATIBILITY ============

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}