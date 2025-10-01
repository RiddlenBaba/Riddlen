// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IRiddleGroupManager
 * @dev Interface for RiddleGroupManager contract
 *
 * Purpose: Standardized interface for group lifecycle management
 *
 * Usage:
 * - Called by RiddleNFTv3 for group operations
 * - Called by frontend for group queries
 * - Enables future upgrades/replacements
 */
interface IRiddleGroupManager {

    // ============ ENUMS ============

    enum GroupState {
        FORMING,      // Accepting members
        RESERVED,     // Locked for riddle, costs locked
        ACTIVE,       // Riddle in progress
        COMPLETED,    // Finished (success or failure)
        DISBANDED     // Cancelled before start
    }

    // ============ EVENTS ============

    event GroupCreatedFromNFT(
        uint256 indexed groupId,
        address indexed creator,
        uint256 indexed nftId,
        uint256 riddleId,
        uint256 lockedEra,
        uint256 lockedAttemptCost
    );

    event MemberJoined(
        uint256 indexed groupId,
        address indexed member,
        uint256 acknowledgedCost,
        uint256 effectiveRON
    );

    event MemberLeft(
        uint256 indexed groupId,
        address indexed member,
        string reason
    );

    event GroupFinalized(
        uint256 indexed groupId,
        uint256 memberCount,
        uint256 pooledRON,
        uint256 timestamp
    );

    event GroupActivated(
        uint256 indexed groupId,
        uint256 timestamp
    );

    event GroupCompleted(
        uint256 indexed groupId,
        bool success,
        uint256 timestamp
    );

    event GroupDisbanded(
        uint256 indexed groupId,
        address indexed disbander,
        string reason,
        uint256 timestamp
    );

    // ============ GROUP CREATION ============

    /**
     * @dev Create group from converted NFT
     * @param creator Address of group creator
     * @param nftId NFT being converted to group
     * @param riddleId Target riddle ID
     * @param mintEra Era when NFT was minted
     * @param baseAttemptCost Locked attempt cost from NFT
     * @param baseSubmissionCost Locked submission cost from NFT
     * @return groupId New group ID
     */
    function createGroupFromNFT(
        address creator,
        uint256 nftId,
        uint256 riddleId,
        uint256 mintEra,
        uint256 baseAttemptCost,
        uint256 baseSubmissionCost
    ) external returns (uint256 groupId);

    // ============ GROUP MEMBERSHIP ============

    /**
     * @dev Join group - must acknowledge locked costs
     * @param groupId Group to join
     * @param acknowledgedCost Member confirms understanding of attempt cost
     */
    function joinGroup(uint256 groupId, uint256 acknowledgedCost) external;

    /**
     * @dev Leave group before finalization
     * @param groupId Group to leave
     */
    function leaveGroup(uint256 groupId) external;

    /**
     * @dev Check if address is member of group
     * @param groupId Group ID
     * @param member Address to check
     * @return isMember True if address is member
     */
    function isGroupMember(uint256 groupId, address member) external view returns (bool isMember);

    /**
     * @dev Check if address is group creator
     * @param groupId Group ID
     * @param user Address to check
     * @return isLeader True if address is creator
     */
    function isGroupLeader(uint256 groupId, address user) external view returns (bool isLeader);

    // ============ GROUP LIFECYCLE ============

    /**
     * @dev Finalize group and validate composition
     * @param groupId Group to finalize
     */
    function finalizeGroup(uint256 groupId) external;

    /**
     * @dev Activate group when riddle session starts
     * @param groupId Group to activate
     */
    function activateGroup(uint256 groupId) external;

    /**
     * @dev Complete group after solve attempt
     * @param groupId Group to complete
     * @param success Whether group solved the riddle
     */
    function completeGroup(uint256 groupId, bool success) external;

    /**
     * @dev Disband group before activation
     * @param groupId Group to disband
     * @param reason Reason for disbanding
     */
    function disbandGroup(uint256 groupId, string calldata reason) external;

    // ============ VIEW FUNCTIONS ============

    /**
     * @dev Get group's locked costs
     * @param groupId Group ID
     * @return era Mint era of linked NFT
     * @return baseAttemptCost Base attempt cost
     * @return baseSubmissionCost Base submission cost
     * @return nextAttemptCost Cost for next attempt
     */
    function getGroupCosts(uint256 groupId) external view returns (
        uint256 era,
        uint256 baseAttemptCost,
        uint256 baseSubmissionCost,
        uint256 nextAttemptCost
    );

    /**
     * @dev Get all group members
     * @param groupId Group ID
     * @return members Array of member addresses
     */
    function getGroupMembers(uint256 groupId) external view returns (address[] memory members);

    /**
     * @dev Get group member count
     * @param groupId Group ID
     * @return count Number of members
     */
    function getGroupMemberCount(uint256 groupId) external view returns (uint256 count);

    /**
     * @dev Get group state
     * @param groupId Group ID
     * @return state Current group state
     */
    function getGroupState(uint256 groupId) external view returns (GroupState state);

    /**
     * @dev Get group creator
     * @param groupId Group ID
     * @return creator Creator address
     */
    function getGroupCreator(uint256 groupId) external view returns (address creator);

    /**
     * @dev Get linked NFT ID
     * @param groupId Group ID
     * @return nftId NFT token ID
     */
    function getGroupNFTId(uint256 groupId) external view returns (uint256 nftId);

    /**
     * @dev Get target riddle ID
     * @param groupId Group ID
     * @return riddleId Riddle ID
     */
    function getGroupRiddleId(uint256 groupId) external view returns (uint256 riddleId);

    /**
     * @dev Get user's active groups
     * @param user User address
     * @return groupIds Array of group IDs
     */
    function getUserActiveGroups(address user) external view returns (uint256[] memory groupIds);

    /**
     * @dev Get pooled RON for group
     * @param groupId Group ID
     * @return pooledRON Average effective RON of all members
     */
    function getGroupPooledRON(uint256 groupId) external view returns (uint256 pooledRON);

    /**
     * @dev Get active group count for user
     * @param user User address
     * @return count Number of currently active groups
     */
    function activeGroupCount(address user) external view returns (uint256 count);
}