// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/**
 * @title IGaslessManager
 * @dev Interface for centralized gasless transaction management
 */
interface IGaslessManager {

    // Events
    event GaslessTransactionUsed(
        address indexed user,
        address indexed contract_,
        uint256 dailyUsed,
        uint256 dailyLimit,
        uint256 timestamp
    );

    event DailyLimitExceeded(
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

    // Core functions
    function useGaslessTransaction(address user) external;

    // View functions
    function getDailyLimit(address user) external view returns (uint256);
    function canUseGasless(address user) external view returns (bool);

    function getUserGaslessStats(address user) external view returns (
        uint256 dailyUsed,
        uint256 dailyLimit,
        uint256 dailyRemaining,
        uint256 totalUsed,
        bool canUse
    );

    function getGlobalStats() external view returns (
        uint256 totalDailyTransactions,
        uint256 maxDailyTransactions,
        uint256 totalGaslessTransactions,
        uint256 authorizedContractsCount
    );

    function getAuthorizedContracts() external view returns (address[] memory);

    // Admin functions
    function authorizeContract(address contract_) external;
    function deauthorizeContract(address contract_) external;
    function batchAuthorizeContracts(address[] calldata contracts) external;
    function resetUserDailyUsage(address user) external;
}