// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IRON.sol";

/**
 * @title IRONGroupExtension
 * @dev Extension interface for IRON to support group mechanics
 *
 * Purpose: Adds RON dilution and group tracking without breaking existing IRON interface
 *
 * Usage:
 * - Implemented by RONAdvanced contract
 * - Called by RiddleGroupManager for dilution calculations
 * - Maintains backward compatibility with existing IRON consumers
 */
interface IRONGroupExtension is IRON {

    // ============ GROUP-SPECIFIC EVENTS ============

    event RONDilutionUpdated(
        address indexed user,
        uint256 baseRON,
        uint256 activeGroups,
        uint256 effectiveRON
    );

    event ActiveGroupLimitReached(
        address indexed user,
        uint256 currentGroups,
        uint256 maxAllowed,
        uint256 userTier
    );

    event GroupRONAwarded(
        address indexed user,
        uint256 indexed groupId,
        uint256 amount,
        RiddleDifficulty difficulty,
        string reason
    );

    // ============ RON DILUTION FUNCTIONS ============

    /**
     * @dev Get effective RON after dilution by active groups
     * @param user Address to check
     * @return effectiveRON Base RON divided by active group count
     *
     * Formula: effectiveRON = baseRON / activeGroups (or baseRON if 0 groups)
     *
     * Example:
     * - User has 60,000 base RON
     * - Active in 3 groups
     * - Effective RON = 60,000 / 3 = 20,000 per group
     */
    function getEffectiveRON(address user) external view returns (uint256 effectiveRON);

    /**
     * @dev Get base (undiluted) RON for user
     * @param user Address to check
     * @return baseRON Total RON before group dilution
     */
    function getBaseRON(address user) external view returns (uint256 baseRON);

    /**
     * @dev Get max concurrent groups allowed based on tier
     * @param user Address to check
     * @return maxGroups Maximum active groups (2-5 based on tier)
     *
     * Tier-based limits:
     * - Novice (0-999 RON): 2 groups
     * - Solver (1K-9.9K RON): 3 groups
     * - Expert (10K-99.9K RON): 4 groups
     * - Oracle (100K+ RON): 5 groups
     */
    function getMaxConcurrentGroups(address user) external view returns (uint256 maxGroups);

    /**
     * @dev Check if user can join another group
     * @param user Address to check
     * @return canJoin True if under max concurrent group limit
     */
    function canJoinGroup(address user) external view returns (bool canJoin);

    /**
     * @dev Get current active group count for user
     * @param user Address to check
     * @return activeCount Number of currently active groups
     */
    function getActiveGroupCount(address user) external view returns (uint256 activeCount);

    // ============ GROUP RON AWARD FUNCTIONS ============

    /**
     * @dev Award RON to user for group solve
     * @param user User to award
     * @param groupId Group ID for tracking
     * @param difficulty Riddle difficulty
     * @param isFirstSolver Whether group was first to solve
     * @param isSpeedSolver Whether group solved quickly
     * @param reason Description of achievement
     * @return ronAwarded Amount of RON awarded
     */
    function awardGroupRON(
        address user,
        uint256 groupId,
        RiddleDifficulty difficulty,
        bool isFirstSolver,
        bool isSpeedSolver,
        string calldata reason
    ) external returns (uint256 ronAwarded);

    /**
     * @dev Batch award RON to multiple group members
     * @param users Array of user addresses
     * @param groupId Group ID for tracking
     * @param difficulty Riddle difficulty
     * @param isFirstSolver Whether group was first to solve
     * @param isSpeedSolver Whether group solved quickly
     * @param reason Description of achievement
     */
    function batchAwardGroupRON(
        address[] calldata users,
        uint256 groupId,
        RiddleDifficulty difficulty,
        bool isFirstSolver,
        bool isSpeedSolver,
        string calldata reason
    ) external;

    // ============ GROUP STATS FUNCTIONS ============

    /**
     * @dev Get user's group participation statistics
     * @param user Address to check
     * @return totalGroupSolves Number of riddles solved in groups
     * @return totalGroupAttempts Number of group attempts participated in
     * @return activeGroups Current active groups
     * @return groupRONEarned Total RON earned from group solves
     */
    function getUserGroupStats(address user) external view returns (
        uint256 totalGroupSolves,
        uint256 totalGroupAttempts,
        uint256 activeGroups,
        uint256 groupRONEarned
    );

    /**
     * @dev Calculate group member's contribution weight
     * @param user Member address
     * @param groupMembers All group members
     * @return contributionWeight Percentage of contribution (in basis points, 10000 = 100%)
     *
     * Based on effective RON relative to total group effective RON
     */
    function calculateGroupContribution(
        address user,
        address[] calldata groupMembers
    ) external view returns (uint256 contributionWeight);
}