// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IRDLN.sol";

/**
 * @title IRDLNGroupExtension
 * @dev Extension interface for IRDLN to support group cost collection and rewards
 *
 * Purpose: Adds group-specific token operations without breaking existing IRDLN interface
 *
 * Usage:
 * - Implemented by RDLNUpgradeable contract
 * - Called by RiddleNFTv3 for group cost/reward distribution
 * - Maintains backward compatibility with existing IRDLN consumers
 */
interface IRDLNGroupExtension is IRDLN {

    // ============ GROUP-SPECIFIC EVENTS ============

    event GroupCostsCollected(
        uint256 indexed groupId,
        address[] members,
        uint256[] amounts,
        uint256 totalAmount,
        string costType
    );

    event GroupRewardsDistributed(
        uint256 indexed groupId,
        address[] members,
        uint256[] amounts,
        uint256 totalAmount,
        string rewardType
    );

    event GroupMemberPayment(
        uint256 indexed groupId,
        address indexed member,
        uint256 amount,
        uint256 effectiveRON,
        string paymentType
    );

    // ============ GROUP COST COLLECTION ============

    /**
     * @dev Collect costs from multiple group members proportionally
     * @param members Array of member addresses
     * @param amounts Array of amounts to collect from each member
     * @param groupId Group ID for tracking
     * @param costType Description of cost (e.g., "NFT_MINT", "ATTEMPT", "SUBMISSION")
     *
     * Requirements:
     * - members.length must equal amounts.length
     * - Each member must have sufficient balance
     * - Applies burn protocol (50% burn, 25% grand prize, 25% dev/ops)
     *
     * Note: Amounts should be pre-calculated based on RON weighting
     */
    function collectGroupCosts(
        address[] calldata members,
        uint256[] calldata amounts,
        uint256 groupId,
        string calldata costType
    ) external;

    /**
     * @dev Calculate RON-weighted costs for group members
     * @param members Array of member addresses
     * @param totalCost Total cost to distribute
     * @param effectiveRONs Array of effective RON values for each member
     * @return amounts Array of costs per member
     *
     * Formula: memberCost = (totalCost × memberEffectiveRON) / totalGroupEffectiveRON
     *
     * Constraints:
     * - Minimum share: 1% of totalCost
     * - Maximum share: 70% of totalCost
     */
    function calculateGroupCosts(
        address[] calldata members,
        uint256 totalCost,
        uint256[] calldata effectiveRONs
    ) external view returns (uint256[] memory amounts);

    // ============ GROUP REWARD DISTRIBUTION ============

    /**
     * @dev Distribute rewards to multiple group members proportionally
     * @param members Array of member addresses
     * @param amounts Array of amounts to distribute to each member
     * @param groupId Group ID for tracking
     * @param rewardType Description of reward (e.g., "RIDDLE_PRIZE", "BONUS")
     *
     * Requirements:
     * - members.length must equal amounts.length
     * - Contract must have sufficient balance
     * - No burn applied to rewards (direct transfer)
     *
     * Note: Amounts should be pre-calculated based on RON weighting
     */
    function distributeGroupRewards(
        address[] calldata members,
        uint256[] calldata amounts,
        uint256 groupId,
        string calldata rewardType
    ) external;

    /**
     * @dev Calculate RON-weighted rewards for group members
     * @param members Array of member addresses
     * @param totalReward Total reward to distribute
     * @param effectiveRONs Array of effective RON values for each member
     * @return amounts Array of rewards per member
     *
     * Formula: memberReward = (totalReward × memberEffectiveRON) / totalGroupEffectiveRON
     *
     * Constraints:
     * - Minimum share: 1% of totalReward
     * - Maximum share: 70% of totalReward
     */
    function calculateGroupRewards(
        address[] calldata members,
        uint256 totalReward,
        uint256[] calldata effectiveRONs
    ) external view returns (uint256[] memory amounts);

    // ============ GROUP BURN OPERATIONS ============

    /**
     * @dev Execute burn protocol for group costs
     * @param members Array of member addresses
     * @param amounts Array of amounts to burn from each member
     * @param groupId Group ID for tracking
     *
     * Burn Distribution:
     * - 50% burned (deflationary)
     * - 25% to grand prize wallet
     * - 25% to dev/ops wallet
     */
    function executeGroupBurnProtocol(
        address[] calldata members,
        uint256[] calldata amounts,
        uint256 groupId
    ) external;

    // ============ GROUP STATISTICS ============

    /**
     * @dev Get group payment statistics
     * @param groupId Group ID
     * @return totalCostsPaid Total costs paid by group
     * @return totalRewardsEarned Total rewards earned by group
     * @return totalBurned Total RDLN burned by group
     * @return memberCount Number of members who participated
     */
    function getGroupPaymentStats(uint256 groupId) external view returns (
        uint256 totalCostsPaid,
        uint256 totalRewardsEarned,
        uint256 totalBurned,
        uint256 memberCount
    );

    /**
     * @dev Get user's group payment history
     * @param user User address
     * @return totalGroupCostsPaid Total costs paid in all groups
     * @return totalGroupRewardsEarned Total rewards earned in all groups
     * @return groupsParticipated Number of groups participated in
     * @return averageCostShare Average percentage paid (in basis points)
     */
    function getUserGroupPaymentStats(address user) external view returns (
        uint256 totalGroupCostsPaid,
        uint256 totalGroupRewardsEarned,
        uint256 groupsParticipated,
        uint256 averageCostShare
    );

    // ============ VALIDATION FUNCTIONS ============

    /**
     * @dev Validate group can afford costs
     * @param members Array of member addresses
     * @param amounts Array of required amounts
     * @return allMembersCanPay True if all members have sufficient balance
     * @return insufficientMembers Array of members with insufficient balance
     */
    function validateGroupBalances(
        address[] calldata members,
        uint256[] calldata amounts
    ) external view returns (
        bool allMembersCanPay,
        address[] memory insufficientMembers
    );

    /**
     * @dev Validate distribution percentages meet constraints
     * @param amounts Array of distribution amounts
     * @param totalAmount Total amount being distributed
     * @return valid True if distribution meets 1%-70% constraints
     * @return violatingIndices Array of indices violating constraints
     */
    function validateDistributionLimits(
        uint256[] calldata amounts,
        uint256 totalAmount
    ) external pure returns (
        bool valid,
        uint256[] memory violatingIndices
    );
}