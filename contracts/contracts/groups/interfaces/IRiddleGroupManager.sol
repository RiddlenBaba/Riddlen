// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/**
 * @title IRiddleGroupManager
 * @dev Interface for RiddleGroupManager contract
 * @notice Used by RiddleNFTAdvancedV2_Comprehensive for group conversion
 */
interface IRiddleGroupManager {
    // =============================================================
    //                        ENUMS
    // =============================================================

    enum GroupState {
        FORMING,      // Accepting members
        RESERVED,     // Locked for riddle, costs locked
        ACTIVE,       // Riddle in progress
        COMPLETED,    // Finished (success or failure)
        DISBANDED     // Cancelled before start
    }

    // =============================================================
    //                        FUNCTIONS
    // =============================================================

    /**
     * @dev Get active group count for a user
     * @param user User address
     * @return Number of active groups
     */
    function activeGroupCount(address user) external view returns (uint256);

    /**
     * @dev Create a group from an NFT
     * @param creator Group creator address
     * @param nftId NFT token ID
     * @param riddleId Target riddle ID
     * @param mintEra Era when NFT was minted
     * @param baseAttemptCost Locked attempt cost from NFT
     * @param baseSubmissionCost Locked submission cost from NFT
     * @return groupId The created group ID
     */
    function createGroupFromNFT(
        address creator,
        uint256 nftId,
        uint256 riddleId,
        uint256 mintEra,
        uint256 baseAttemptCost,
        uint256 baseSubmissionCost
    ) external returns (uint256);

    /**
     * @dev Get group state
     * @param groupId Group ID
     * @return GroupState enum value
     */
    function getGroupState(uint256 groupId) external view returns (GroupState);

    /**
     * @dev Get group member count
     * @param groupId Group ID
     * @return Number of members in the group
     */
    function getGroupMemberCount(uint256 groupId) external view returns (uint256);
}
