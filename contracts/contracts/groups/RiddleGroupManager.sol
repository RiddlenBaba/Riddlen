// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title RiddleGroupManager
 * @dev Manages collaborative riddle-solving groups with era-locked costs
 *
 * Key Features:
 * - Groups inherit NFT's locked costs (era-based)
 * - RON dilution tracking for active groups
 * - Tier-based composition validation
 * - Group lifecycle management (FORMING → RESERVED → ACTIVE → COMPLETED)
 *
 * Security:
 * - Reentrancy protection on all state changes
 * - Access control for NFT contract integration
 * - Pausable for emergency stops
 */
contract RiddleGroupManager is
    IERC721Receiver,
    AccessControl,
    ReentrancyGuard,
    Pausable
{
    // =============================================================
    //                        ROLES
    // =============================================================

    bytes32 public constant NFT_CONTRACT_ROLE = keccak256("NFT_CONTRACT_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

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
    //                        STRUCTS
    // =============================================================

    struct Group {
        uint256 groupId;
        address creator;
        address[] members;
        GroupState state;
        uint256 targetRiddleId;
        uint256 linkedNFTId;
        uint256 createdAt;
        uint256 finalizedAt;
        uint256 completedAt;

        // Era-locked costs inherited from NFT
        uint256 lockedMintEra;
        uint256 lockedAttemptCost;
        uint256 lockedSubmissionCost;

        // Member tracking
        uint256 memberCount;
        bool success; // Did group solve the riddle?
    }

    // =============================================================
    //                        STORAGE
    // =============================================================

    mapping(uint256 => Group) public groups;
    mapping(uint256 => mapping(address => bool)) public isGroupMember;
    mapping(uint256 => mapping(address => uint256)) public memberEffectiveRON;

    uint256 public nextGroupId = 1;

    // Active group tracking for RON dilution
    mapping(address => uint256) public activeGroupCount;
    mapping(address => uint256[]) public userActiveGroups;

    // Configuration
    uint256 public constant MAX_GROUP_SIZE = 11;
    uint256 public constant MIN_GROUP_SIZE = 3;
    uint256 public constant GROUP_FORMATION_TIMEOUT = 7 days;
    uint256 public disbandFee = 10 * 10**18; // 10 RDLN

    // External contracts
    address public nftContract;
    address public ronContract;
    address public rdlnToken;
    address public compositionValidator;

    // =============================================================
    //                        EVENTS
    // =============================================================

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

    event ContractsUpdated(
        address nftContract,
        address ronContract,
        address rdlnToken,
        address compositionValidator
    );

    // =============================================================
    //                        ERRORS
    // =============================================================

    error InvalidGroupState(GroupState current, GroupState required);
    error NotGroupCreator(address caller, address creator);
    error NotGroupMember(address caller, uint256 groupId);
    error AlreadyGroupMember(address member, uint256 groupId);
    error GroupFull(uint256 groupId, uint256 maxSize);
    error GroupTooSmall(uint256 groupId, uint256 minSize);
    error InvalidCostAcknowledgement(uint256 acknowledged, uint256 required);
    error MaxActiveGroupsReached(address user, uint256 maxAllowed);
    error InvalidContract(address contractAddress);
    error GroupExpired(uint256 groupId, uint256 deadline);
    error InsufficientBalance(address user, uint256 required, uint256 available);

    // =============================================================
    //                        CONSTRUCTOR
    // =============================================================

    constructor(
        address _admin,
        address _nftContract,
        address _ronContract,
        address _rdlnToken,
        address _compositionValidator
    ) {
        require(_admin != address(0), "Invalid admin");
        require(_nftContract != address(0), "Invalid NFT contract");
        require(_ronContract != address(0), "Invalid RON contract");
        require(_rdlnToken != address(0), "Invalid RDLN token");
        require(_compositionValidator != address(0), "Invalid validator");

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);
        _grantRole(NFT_CONTRACT_ROLE, _nftContract);

        nftContract = _nftContract;
        ronContract = _ronContract;
        rdlnToken = _rdlnToken;
        compositionValidator = _compositionValidator;
    }

    // =============================================================
    //                        GROUP CREATION
    // =============================================================

    /**
     * @dev Create group from converted NFT - called by RiddleNFT contract
     * @param creator Address of group creator
     * @param nftId NFT being converted to group
     * @param riddleId Target riddle ID
     * @param mintEra Era when NFT was minted
     * @param baseAttemptCost Locked attempt cost from NFT
     * @param baseSubmissionCost Locked submission cost from NFT
     */
    function createGroupFromNFT(
        address creator,
        uint256 nftId,
        uint256 riddleId,
        uint256 mintEra,
        uint256 baseAttemptCost,
        uint256 baseSubmissionCost
    ) external onlyRole(NFT_CONTRACT_ROLE) whenNotPaused returns (uint256) {
        require(creator != address(0), "Invalid creator");

        uint256 groupId = nextGroupId++;

        Group storage group = groups[groupId];
        group.groupId = groupId;
        group.creator = creator;
        group.state = GroupState.FORMING;
        group.targetRiddleId = riddleId;
        group.linkedNFTId = nftId;
        group.createdAt = block.timestamp;

        // Lock costs from NFT (immutable for this group)
        group.lockedMintEra = mintEra;
        group.lockedAttemptCost = baseAttemptCost;
        group.lockedSubmissionCost = baseSubmissionCost;

        // Creator auto-joins
        group.members.push(creator);
        isGroupMember[groupId][creator] = true;
        group.memberCount = 1;

        // Track for RON dilution
        _incrementActiveGroups(creator, groupId);

        emit GroupCreatedFromNFT(
            groupId,
            creator,
            nftId,
            riddleId,
            mintEra,
            baseAttemptCost
        );

        return groupId;
    }

    // =============================================================
    //                        GROUP MEMBERSHIP
    // =============================================================

    /**
     * @dev Join group - must acknowledge locked costs
     * @param groupId Group to join
     * @param acknowledgedCost Member confirms understanding of attempt cost
     */
    function joinGroup(uint256 groupId, uint256 acknowledgedCost)
        external
        nonReentrant
        whenNotPaused
    {
        Group storage group = groups[groupId];

        // Validate state
        if (group.state != GroupState.FORMING) {
            revert InvalidGroupState(group.state, GroupState.FORMING);
        }

        // Check timeout
        if (block.timestamp > group.createdAt + GROUP_FORMATION_TIMEOUT) {
            revert GroupExpired(groupId, group.createdAt + GROUP_FORMATION_TIMEOUT);
        }

        // Validate not already member
        if (isGroupMember[groupId][msg.sender]) {
            revert AlreadyGroupMember(msg.sender, groupId);
        }

        // Check group not full
        if (group.memberCount >= MAX_GROUP_SIZE) {
            revert GroupFull(groupId, MAX_GROUP_SIZE);
        }

        // CRITICAL: Must acknowledge NFT's locked costs
        if (acknowledgedCost != group.lockedAttemptCost) {
            revert InvalidCostAcknowledgement(acknowledgedCost, group.lockedAttemptCost);
        }

        // Check can join more groups (based on RON tier)
        uint256 maxGroups = _getMaxConcurrentGroups(msg.sender);
        if (activeGroupCount[msg.sender] >= maxGroups) {
            revert MaxActiveGroupsReached(msg.sender, maxGroups);
        }

        // Add member
        group.members.push(msg.sender);
        isGroupMember[groupId][msg.sender] = true;
        group.memberCount++;

        // Track for RON dilution
        _incrementActiveGroups(msg.sender, groupId);

        // Cache effective RON at join time
        memberEffectiveRON[groupId][msg.sender] = _getEffectiveRON(msg.sender);

        emit MemberJoined(
            groupId,
            msg.sender,
            acknowledgedCost,
            memberEffectiveRON[groupId][msg.sender]
        );
    }

    /**
     * @dev Leave group before it's finalized
     * @param groupId Group to leave
     */
    function leaveGroup(uint256 groupId)
        external
        nonReentrant
        whenNotPaused
    {
        Group storage group = groups[groupId];

        // Can only leave during FORMING
        if (group.state != GroupState.FORMING) {
            revert InvalidGroupState(group.state, GroupState.FORMING);
        }

        // Must be member
        if (!isGroupMember[groupId][msg.sender]) {
            revert NotGroupMember(msg.sender, groupId);
        }

        // Creator cannot leave (must disband instead)
        if (msg.sender == group.creator) {
            revert("Creator must disband group");
        }

        // Remove member
        _removeMember(groupId, msg.sender);

        // Release RON dilution
        _decrementActiveGroups(msg.sender, groupId);

        emit MemberLeft(groupId, msg.sender, "Voluntary leave");
    }

    // =============================================================
    //                        GROUP LIFECYCLE
    // =============================================================

    /**
     * @dev Finalize group and validate composition
     * @param groupId Group to finalize
     */
    function finalizeGroup(uint256 groupId)
        external
        nonReentrant
        whenNotPaused
    {
        Group storage group = groups[groupId];

        // Only creator can finalize
        if (msg.sender != group.creator) {
            revert NotGroupCreator(msg.sender, group.creator);
        }

        // Must be in FORMING state
        if (group.state != GroupState.FORMING) {
            revert InvalidGroupState(group.state, GroupState.FORMING);
        }

        // Check minimum size
        if (group.memberCount < MIN_GROUP_SIZE) {
            revert GroupTooSmall(groupId, MIN_GROUP_SIZE);
        }

        // Validate composition (tier distribution)
        if (compositionValidator != address(0)) {
            (bool success, bytes memory result) = compositionValidator.staticcall(
                abi.encodeWithSignature("validateComposition(address[])", group.members)
            );
            require(success && result.length > 0, "Composition validation failed");
            (bool valid, string memory reason) = abi.decode(result, (bool, string));
            require(valid, reason);
        }

        // Calculate pooled RON for visibility
        uint256 pooledRON = _calculatePooledRON(group.members);

        // Change state to RESERVED
        group.state = GroupState.RESERVED;
        group.finalizedAt = block.timestamp;

        emit GroupFinalized(groupId, group.memberCount, pooledRON, block.timestamp);
    }

    /**
     * @dev Activate group when riddle session starts (called by NFT contract)
     * @param groupId Group to activate
     */
    function activateGroup(uint256 groupId)
        external
        onlyRole(NFT_CONTRACT_ROLE)
        whenNotPaused
    {
        Group storage group = groups[groupId];

        if (group.state != GroupState.RESERVED) {
            revert InvalidGroupState(group.state, GroupState.RESERVED);
        }

        group.state = GroupState.ACTIVE;

        emit GroupActivated(groupId, block.timestamp);
    }

    /**
     * @dev Complete group (called by NFT contract after solve attempt)
     * @param groupId Group to complete
     * @param success Whether group solved the riddle
     */
    function completeGroup(uint256 groupId, bool success)
        external
        onlyRole(NFT_CONTRACT_ROLE)
        whenNotPaused
    {
        Group storage group = groups[groupId];

        if (group.state != GroupState.ACTIVE) {
            revert InvalidGroupState(group.state, GroupState.ACTIVE);
        }

        group.state = GroupState.COMPLETED;
        group.success = success;
        group.completedAt = block.timestamp;

        // Release RON dilution for all members
        for (uint256 i = 0; i < group.members.length; i++) {
            _decrementActiveGroups(group.members[i], groupId);
        }

        emit GroupCompleted(groupId, success, block.timestamp);
    }

    /**
     * @dev Disband group before activation (emergency)
     * @param groupId Group to disband
     * @param reason Reason for disbanding
     */
    function disbandGroup(uint256 groupId, string calldata reason)
        external
        nonReentrant
        whenNotPaused
    {
        Group storage group = groups[groupId];

        // Only creator can disband
        if (msg.sender != group.creator) {
            revert NotGroupCreator(msg.sender, group.creator);
        }

        // Can only disband before ACTIVE
        require(
            group.state == GroupState.FORMING || group.state == GroupState.RESERVED,
            "Cannot disband active group"
        );

        // Charge disband fee (burns RDLN)
        if (disbandFee > 0) {
            (bool success, bytes memory result) = rdlnToken.staticcall(
                abi.encodeWithSignature("balanceOf(address)", msg.sender)
            );
            require(success, "Balance check failed");
            uint256 balance = abi.decode(result, (uint256));

            if (balance < disbandFee) {
                revert InsufficientBalance(msg.sender, disbandFee, balance);
            }

            // Burn disband fee
            (success, ) = rdlnToken.call(
                abi.encodeWithSignature("burnFrom(address,uint256)", msg.sender, disbandFee)
            );
            require(success, "Disband fee burn failed");
        }

        group.state = GroupState.DISBANDED;

        // Release RON dilution for all members
        for (uint256 i = 0; i < group.members.length; i++) {
            _decrementActiveGroups(group.members[i], groupId);
        }

        emit GroupDisbanded(groupId, msg.sender, reason, block.timestamp);
    }

    // =============================================================
    //                        VIEW FUNCTIONS
    // =============================================================

    /**
     * @dev Get group's locked costs (for UI display)
     * @param groupId Group ID
     * @return era Mint era of linked NFT
     * @return baseAttemptCost Base attempt cost (multiply by attempts+1)
     * @return baseSubmissionCost Base submission cost
     * @return nextAttemptCost Cost for next attempt based on current NFT attempts
     */
    function getGroupCosts(uint256 groupId)
        external
        view
        returns (
            uint256 era,
            uint256 baseAttemptCost,
            uint256 baseSubmissionCost,
            uint256 nextAttemptCost
        )
    {
        Group storage group = groups[groupId];

        era = group.lockedMintEra;
        baseAttemptCost = group.lockedAttemptCost;
        baseSubmissionCost = group.lockedSubmissionCost;

        // Get current attempts from NFT (would need to call NFT contract in production)
        // For now, return base cost
        nextAttemptCost = baseAttemptCost;
    }

    /**
     * @dev Get all group members
     * @param groupId Group ID
     * @return Array of member addresses
     */
    function getGroupMembers(uint256 groupId)
        external
        view
        returns (address[] memory)
    {
        return groups[groupId].members;
    }

    /**
     * @dev Get group member count
     * @param groupId Group ID
     * @return Number of members
     */
    function getGroupMemberCount(uint256 groupId)
        external
        view
        returns (uint256)
    {
        return groups[groupId].memberCount;
    }

    /**
     * @dev Get group state
     * @param groupId Group ID
     * @return Current group state
     */
    function getGroupState(uint256 groupId)
        external
        view
        returns (GroupState)
    {
        return groups[groupId].state;
    }

    /**
     * @dev Get group creator
     * @param groupId Group ID
     * @return Creator address
     */
    function getGroupCreator(uint256 groupId)
        external
        view
        returns (address)
    {
        return groups[groupId].creator;
    }

    /**
     * @dev Check if address is group leader/creator
     * @param groupId Group ID
     * @param user Address to check
     * @return True if user is creator
     */
    function isGroupLeader(uint256 groupId, address user)
        external
        view
        returns (bool)
    {
        return groups[groupId].creator == user;
    }

    /**
     * @dev Get linked NFT ID
     * @param groupId Group ID
     * @return NFT token ID
     */
    function getGroupNFTId(uint256 groupId)
        external
        view
        returns (uint256)
    {
        return groups[groupId].linkedNFTId;
    }

    /**
     * @dev Get target riddle ID
     * @param groupId Group ID
     * @return Riddle ID
     */
    function getGroupRiddleId(uint256 groupId)
        external
        view
        returns (uint256)
    {
        return groups[groupId].targetRiddleId;
    }

    /**
     * @dev Get user's active groups
     * @param user User address
     * @return Array of group IDs
     */
    function getUserActiveGroups(address user)
        external
        view
        returns (uint256[] memory)
    {
        return userActiveGroups[user];
    }

    /**
     * @dev Get pooled RON for group
     * @param groupId Group ID
     * @return Average effective RON of all members
     */
    function getGroupPooledRON(uint256 groupId)
        external
        view
        returns (uint256)
    {
        Group storage group = groups[groupId];
        return _calculatePooledRON(group.members);
    }

    // =============================================================
    //                        INTERNAL FUNCTIONS
    // =============================================================

    /**
     * @dev Increment active group count for user
     */
    function _incrementActiveGroups(address user, uint256 groupId) internal {
        activeGroupCount[user]++;
        userActiveGroups[user].push(groupId);
    }

    /**
     * @dev Decrement active group count for user
     */
    function _decrementActiveGroups(address user, uint256 groupId) internal {
        if (activeGroupCount[user] > 0) {
            activeGroupCount[user]--;
        }

        // Remove from active groups array
        uint256[] storage userGroups = userActiveGroups[user];
        for (uint256 i = 0; i < userGroups.length; i++) {
            if (userGroups[i] == groupId) {
                userGroups[i] = userGroups[userGroups.length - 1];
                userGroups.pop();
                break;
            }
        }
    }

    /**
     * @dev Remove member from group
     */
    function _removeMember(uint256 groupId, address member) internal {
        Group storage group = groups[groupId];

        isGroupMember[groupId][member] = false;
        group.memberCount--;

        // Remove from members array
        address[] storage members = group.members;
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == member) {
                members[i] = members[members.length - 1];
                members.pop();
                break;
            }
        }
    }

    /**
     * @dev Get max concurrent groups based on RON tier
     */
    function _getMaxConcurrentGroups(address user) internal view returns (uint256) {
        if (ronContract == address(0)) return 2; // Default

        (bool success, bytes memory result) = ronContract.staticcall(
            abi.encodeWithSignature("balanceOf(address)", user)
        );

        if (!success || result.length == 0) return 2;

        uint256 userRON = abi.decode(result, (uint256));

        // Observer: 2, Participant: 3, Delegate: 4, Senator: 5
        if (userRON >= 100_000 * 10**18) return 5; // Senator
        if (userRON >= 10_000 * 10**18) return 4;  // Delegate
        if (userRON >= 1_000 * 10**18) return 3;   // Participant
        return 2; // Observer
    }

    /**
     * @dev Get effective RON (diluted by active groups)
     */
    function _getEffectiveRON(address user) internal view returns (uint256) {
        if (ronContract == address(0)) return 0;

        (bool success, bytes memory result) = ronContract.staticcall(
            abi.encodeWithSignature("balanceOf(address)", user)
        );

        if (!success || result.length == 0) return 0;

        uint256 baseRON = abi.decode(result, (uint256));
        uint256 groups = activeGroupCount[user];

        return groups == 0 ? baseRON : baseRON / groups;
    }

    /**
     * @dev Calculate pooled (average) effective RON for group
     */
    function _calculatePooledRON(address[] memory members)
        internal
        view
        returns (uint256)
    {
        if (members.length == 0) return 0;

        uint256 totalEffectiveRON = 0;
        for (uint256 i = 0; i < members.length; i++) {
            totalEffectiveRON += _getEffectiveRON(members[i]);
        }

        return totalEffectiveRON / members.length;
    }

    // =============================================================
    //                        ADMIN FUNCTIONS
    // =============================================================

    /**
     * @dev Update contract addresses
     */
    function setContracts(
        address _nftContract,
        address _ronContract,
        address _rdlnToken,
        address _compositionValidator
    ) external onlyRole(ADMIN_ROLE) {
        if (_nftContract == address(0)) revert InvalidContract(_nftContract);
        if (_ronContract == address(0)) revert InvalidContract(_ronContract);
        if (_rdlnToken == address(0)) revert InvalidContract(_rdlnToken);
        if (_compositionValidator == address(0)) revert InvalidContract(_compositionValidator);

        nftContract = _nftContract;
        ronContract = _ronContract;
        rdlnToken = _rdlnToken;
        compositionValidator = _compositionValidator;

        emit ContractsUpdated(_nftContract, _ronContract, _rdlnToken, _compositionValidator);
    }

    /**
     * @dev Update disband fee
     */
    function setDisbandFee(uint256 newFee) external onlyRole(ADMIN_ROLE) {
        disbandFee = newFee;
    }

    /**
     * @dev Pause contract
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // =============================================================
    //                        ERC721 RECEIVER
    // =============================================================

    /**
     * @dev Required for receiving NFTs
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}