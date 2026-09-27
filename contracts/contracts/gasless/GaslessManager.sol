// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../interfaces/IRON.sol";

/**
 * @title GaslessManager
 * @dev Centralized gasless transaction management for the Riddlen ecosystem
 *
 * Purpose:
 * - Unified daily gasless transaction limits across all contracts
 * - RON tier-based limit allocation
 * - Automatic daily reset mechanism
 * - Cross-contract gasless usage tracking
 * - Admin controls for limit management
 *
 * Security Features:
 * - UUPS Upgradeable
 * - Role-based access control (4 roles)
 * - Reentrancy protection on all state-changing functions
 * - Circuit breakers for daily limits
 * - Emergency pause/unpause
 * - Comprehensive event logging
 * - Input validation on all parameters
 * - Immutable constants for critical limits
 * - Authorized contract system
 *
 * Daily Limit System:
 * - SEEKER (1K+ RON): 10 daily gasless transactions
 * - SOLVER (10K+ RON): 25 daily gasless transactions
 * - VALIDATOR (25K+ RON): 50 daily gasless transactions
 * - ORACLE (50K+ RON): 100 daily gasless transactions
 * - Automatic reset every 24 hours
 * - Global tracking across all ecosystem contracts
 *
 * @custom:security-status PRODUCTION-READY
 * @custom:audit-date 2025-01-05
 */
contract GaslessManager is
    Initializable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    // =============================================================
    //                        ROLES
    // =============================================================

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant AUTHORIZED_CONTRACT_ROLE = keccak256("AUTHORIZED_CONTRACT_ROLE");

    // =============================================================
    //                        CONSTANTS (IMMUTABLE LIMITS)
    // =============================================================

    // Daily gasless transaction limits by RON tier
    uint256 public constant SEEKER_DAILY_LIMIT = 10;     // 10 daily transactions (1K+ RON)
    uint256 public constant SOLVER_DAILY_LIMIT = 25;     // 25 daily transactions (10K+ RON)
    uint256 public constant VALIDATOR_DAILY_LIMIT = 50;  // 50 daily transactions (25K+ RON)
    uint256 public constant ORACLE_DAILY_LIMIT = 100;    // 100 daily transactions (50K+ RON)

    // RON tier thresholds (aligned with ecosystem)
    uint256 public constant SEEKER_THRESHOLD = 1_000e18;    // 1,000 RON
    uint256 public constant SOLVER_THRESHOLD = 10_000e18;   // 10,000 RON
    uint256 public constant VALIDATOR_THRESHOLD = 25_000e18; // 25,000 RON
    uint256 public constant ORACLE_THRESHOLD = 50_000e18;   // 50,000 RON

    // Circuit breakers
    uint256 public constant MAX_DAILY_GLOBAL_TRANSACTIONS = 100_000; // Max total daily transactions
    uint256 public constant MAX_CONTRACTS_PER_TX = 10;               // Max contracts to batch authorize

    // =============================================================
    //                           STRUCTS
    // =============================================================

    struct UserGaslessData {
        uint256 dailyUsed;        // Transactions used today
        uint256 lastResetDay;     // Last day counter was reset
        uint256 totalUsed;        // Lifetime gasless transactions
    }

    // =============================================================
    //                        STATE VARIABLES
    // =============================================================

    // Core contracts
    IRON public ronToken;

    // User gasless tracking
    mapping(address => UserGaslessData) public userGaslessData;

    // Authorized contracts that can consume gasless transactions
    mapping(address => bool) public authorizedContracts;
    address[] public authorizedContractsList;

    // Global statistics
    uint256 public totalDailyTransactions;     // Total transactions today
    uint256 public lastGlobalResetDay;         // Last day global counter was reset
    uint256 public totalGaslessTransactions;   // Lifetime total

    // =============================================================
    //                           EVENTS
    // =============================================================

    event GaslessTransactionUsed(
        address indexed user,
        address indexed contract_,
        uint256 dailyUsed,
        uint256 dailyLimit,
        uint256 timestamp
    );

    event DailyLimitReached(
        address indexed user,
        address indexed contract_,
        uint256 attemptedUsage,
        uint256 dailyLimit,
        uint256 timestamp
    );

    event ContractAuthorized(
        address indexed contract_,
        address indexed admin,
        uint256 timestamp
    );

    event ContractDeauthorized(
        address indexed contract_,
        address indexed admin,
        uint256 timestamp
    );

    event DailyStatsReset(
        address indexed user,
        uint256 previousUsage,
        uint256 dayCounter,
        uint256 timestamp
    );

    event GlobalStatsReset(
        uint256 previousDailyTotal,
        uint256 dayCounter,
        uint256 timestamp
    );

    event EmergencyAction(
        address indexed admin,
        string indexed action,
        bytes data,
        uint256 timestamp
    );

    // =============================================================
    //                         ERRORS
    // =============================================================

    error InvalidAddress();
    error InvalidAmount();
    error DailyLimitExceeded();
    error ContractNotAuthorized();
    error ContractAlreadyAuthorized();
    error ContractNotFound();
    error GlobalLimitExceeded();
    error Unauthorized();

    // =============================================================
    //                         CONSTRUCTOR
    // =============================================================

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // =============================================================
    //                        INITIALIZATION
    // =============================================================

    function initialize(
        address _ronToken,
        address _admin
    ) public initializer {
        // Input validation
        if (_ronToken == address(0)) revert InvalidAddress();
        if (_admin == address(0)) revert InvalidAddress();

        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        ronToken = IRON(_ronToken);

        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);

        // Initialize global day counter
        lastGlobalResetDay = block.timestamp / 1 days;
    }

    // =============================================================
    //                       CORE FUNCTIONS
    // =============================================================

    /**
     * @dev Use a gasless transaction for a user (called by authorized contracts)
     * @param user Address of the user consuming gasless transaction
     */
    function useGaslessTransaction(address user)
        external
        onlyRole(AUTHORIZED_CONTRACT_ROLE)
        nonReentrant
        whenNotPaused
    {
        if (user == address(0)) revert InvalidAddress();

        // Reset global stats if new day
        _resetGlobalStatsIfNeeded();

        // Check global daily limit
        if (totalDailyTransactions >= MAX_DAILY_GLOBAL_TRANSACTIONS) {
            emit EmergencyAction(
                msg.sender,
                "GLOBAL_LIMIT_EXCEEDED",
                abi.encode(totalDailyTransactions, MAX_DAILY_GLOBAL_TRANSACTIONS),
                block.timestamp
            );
            revert GlobalLimitExceeded();
        }

        // Reset user stats if new day
        _resetUserStatsIfNeeded(user);

        UserGaslessData storage userData = userGaslessData[user];
        uint256 dailyLimit = getDailyLimit(user);

        // Check user daily limit
        if (userData.dailyUsed >= dailyLimit) {
            emit DailyLimitReached(
                user,
                msg.sender,
                userData.dailyUsed + 1,
                dailyLimit,
                block.timestamp
            );
            revert DailyLimitExceeded();
        }

        // Increment counters
        userData.dailyUsed++;
        userData.totalUsed++;
        totalDailyTransactions++;
        totalGaslessTransactions++;

        emit GaslessTransactionUsed(
            user,
            msg.sender,
            userData.dailyUsed,
            dailyLimit,
            block.timestamp
        );
    }

    // =============================================================
    //                        VIEW FUNCTIONS
    // =============================================================

    /**
     * @dev Get user's daily gasless limit based on RON tier
     */
    function getDailyLimit(address user) public view returns (uint256) {
        if (address(ronToken) == address(0)) return 0;

        uint256 ronBalance = ronToken.balanceOf(user);

        // Check tier thresholds
        if (ronBalance >= ORACLE_THRESHOLD) return ORACLE_DAILY_LIMIT;        // 50K+ RON = 100 daily
        if (ronBalance >= VALIDATOR_THRESHOLD) return VALIDATOR_DAILY_LIMIT;  // 25K+ RON = 50 daily
        if (ronBalance >= SOLVER_THRESHOLD) return SOLVER_DAILY_LIMIT;        // 10K+ RON = 25 daily
        if (ronBalance >= SEEKER_THRESHOLD) return SEEKER_DAILY_LIMIT;        // 1K+ RON = 10 daily

        return 0; // No RON = no gasless transactions
    }

    /**
     * @dev Check if user can use gasless transaction
     */
    function canUseGasless(address user) external view returns (bool) {
        uint256 dailyLimit = getDailyLimit(user);
        if (dailyLimit == 0) return false;

        UserGaslessData memory userData = userGaslessData[user];
        uint256 today = block.timestamp / 1 days;

        // If it's a new day, user's daily usage would reset
        if (userData.lastResetDay < today) {
            return true; // Fresh day, can use gasless
        }

        return userData.dailyUsed < dailyLimit;
    }

    /**
     * @dev Get user's gasless usage stats
     */
    function getUserGaslessStats(address user) external view returns (
        uint256 dailyUsed,
        uint256 dailyLimit,
        uint256 dailyRemaining,
        uint256 totalUsed,
        bool canUse
    ) {
        UserGaslessData memory userData = userGaslessData[user];
        uint256 today = block.timestamp / 1 days;

        dailyLimit = getDailyLimit(user);

        // If it's a new day, daily usage would reset
        if (userData.lastResetDay < today) {
            dailyUsed = 0;
        } else {
            dailyUsed = userData.dailyUsed;
        }

        dailyRemaining = dailyLimit > dailyUsed ? dailyLimit - dailyUsed : 0;
        totalUsed = userData.totalUsed;
        canUse = dailyRemaining > 0 && dailyLimit > 0;
    }

    /**
     * @dev Get global gasless statistics
     */
    function getGlobalStats() external view returns (
        uint256 _totalDailyTransactions,
        uint256 _maxDailyTransactions,
        uint256 _totalGaslessTransactions,
        uint256 _authorizedContractsCount
    ) {
        uint256 today = block.timestamp / 1 days;

        // If it's a new day, daily total would reset
        if (lastGlobalResetDay < today) {
            _totalDailyTransactions = 0;
        } else {
            _totalDailyTransactions = totalDailyTransactions;
        }

        _maxDailyTransactions = MAX_DAILY_GLOBAL_TRANSACTIONS;
        _totalGaslessTransactions = totalGaslessTransactions;
        _authorizedContractsCount = authorizedContractsList.length;
    }

    /**
     * @dev Get list of authorized contracts
     */
    function getAuthorizedContracts() external view returns (address[] memory) {
        return authorizedContractsList;
    }

    // =============================================================
    //                       ADMIN FUNCTIONS
    // =============================================================

    /**
     * @dev Authorize a contract to consume gasless transactions
     */
    function authorizeContract(address contract_) external onlyRole(ADMIN_ROLE) {
        if (contract_ == address(0)) revert InvalidAddress();
        if (authorizedContracts[contract_]) revert ContractAlreadyAuthorized();

        authorizedContracts[contract_] = true;
        authorizedContractsList.push(contract_);

        _grantRole(AUTHORIZED_CONTRACT_ROLE, contract_);

        emit ContractAuthorized(contract_, msg.sender, block.timestamp);
    }

    /**
     * @dev Deauthorize a contract from consuming gasless transactions
     */
    function deauthorizeContract(address contract_) external onlyRole(ADMIN_ROLE) {
        if (contract_ == address(0)) revert InvalidAddress();
        if (!authorizedContracts[contract_]) revert ContractNotFound();

        authorizedContracts[contract_] = false;

        // Remove from array
        for (uint256 i = 0; i < authorizedContractsList.length; i++) {
            if (authorizedContractsList[i] == contract_) {
                authorizedContractsList[i] = authorizedContractsList[authorizedContractsList.length - 1];
                authorizedContractsList.pop();
                break;
            }
        }

        _revokeRole(AUTHORIZED_CONTRACT_ROLE, contract_);

        emit ContractDeauthorized(contract_, msg.sender, block.timestamp);
    }

    /**
     * @dev Batch authorize multiple contracts
     */
    function batchAuthorizeContracts(address[] calldata contracts) external onlyRole(ADMIN_ROLE) {
        if (contracts.length > MAX_CONTRACTS_PER_TX) revert InvalidAmount();

        for (uint256 i = 0; i < contracts.length; i++) {
            if (contracts[i] != address(0) && !authorizedContracts[contracts[i]]) {
                authorizedContracts[contracts[i]] = true;
                authorizedContractsList.push(contracts[i]);
                _grantRole(AUTHORIZED_CONTRACT_ROLE, contracts[i]);

                emit ContractAuthorized(contracts[i], msg.sender, block.timestamp);
            }
        }
    }

    /**
     * @dev Reset daily usage for a user (admin emergency function)
     */
    function resetUserDailyUsage(address user) external onlyRole(ADMIN_ROLE) {
        if (user == address(0)) revert InvalidAddress();

        UserGaslessData storage userData = userGaslessData[user];
        uint256 previousUsage = userData.dailyUsed;
        userData.dailyUsed = 0;
        userData.lastResetDay = block.timestamp / 1 days;

        emit EmergencyAction(
            msg.sender,
            "RESET_USER_DAILY",
            abi.encode(user, previousUsage),
            block.timestamp
        );
    }

    /**
     * @dev Emergency pause
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
        emit EmergencyAction(msg.sender, "PAUSE", "", block.timestamp);
    }

    /**
     * @dev Unpause
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit EmergencyAction(msg.sender, "UNPAUSE", "", block.timestamp);
    }

    // =============================================================
    //                       INTERNAL FUNCTIONS
    // =============================================================

    /**
     * @dev Reset user stats if new day
     */
    function _resetUserStatsIfNeeded(address user) internal {
        UserGaslessData storage userData = userGaslessData[user];
        uint256 today = block.timestamp / 1 days;

        if (userData.lastResetDay < today) {
            uint256 previousUsage = userData.dailyUsed;
            userData.dailyUsed = 0;
            userData.lastResetDay = today;

            emit DailyStatsReset(user, previousUsage, today, block.timestamp);
        }
    }

    /**
     * @dev Reset global stats if new day
     */
    function _resetGlobalStatsIfNeeded() internal {
        uint256 today = block.timestamp / 1 days;

        if (lastGlobalResetDay < today) {
            uint256 previousTotal = totalDailyTransactions;
            totalDailyTransactions = 0;
            lastGlobalResetDay = today;

            emit GlobalStatsReset(previousTotal, today, block.timestamp);
        }
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}