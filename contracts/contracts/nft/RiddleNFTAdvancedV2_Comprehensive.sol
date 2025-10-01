// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./RiddleNFTAdvanced.sol";
import "../groups/interfaces/IRiddleGroupManager.sol";

/**
 * @title RiddleNFTAdvancedV2_Comprehensive
 * @dev Comprehensive V2 upgrade integrating ALL systems:
 *      1. Era-locked cost system (from RiddleNFTv3)
 *      2. Progressive cost calculations (from RiddleNFTv3)
 *      3. User question submission (from RiddleNFTv3)
 *      4. Group mechanics integration (new)
 *
 * Storage Safety:
 * - Consumes 3 slots from V1's 50-slot gap
 * - No modifications to existing V1 structures
 * - 47 slots remain for future upgrades
 *
 * Era System:
 * - Each NFT locks costs at mint time based on current era
 * - Era 0: 2025-2027 (1000 RDLN mint, 1 RDLN attempts)
 * - Era 1: 2027-2029 (500 RDLN mint, 0.5 RDLN attempts)
 * - Era 2: 2029-2031 (250 RDLN mint, 0.25 RDLN attempts)
 * - Costs halve every 2 years (730 days)
 *
 * Progressive Costs:
 * - Attempt costs increase with usage: base * (attempts + 1)
 * - Submission costs increase with usage: base * (submissions + 1)
 * - Prevents spam, encourages thoughtful solving
 *
 * Backward Compatibility:
 * - All V1 functions work exactly the same
 * - Existing NFTs calculate era from mint timestamp
 * - Solo play unchanged
 * - Groups are optional
 */
contract RiddleNFTAdvancedV2_Comprehensive is RiddleNFTAdvanced {
    // =============================================================
    //                        V2 STRUCTS
    // =============================================================

    /**
     * @dev Era-locked cost data for each NFT
     * @notice These costs are locked at mint time and never change
     * @notice This enables fair economics: early NFTs have premium costs,
     *         later NFTs have accessible costs
     */
    struct NFTCostData {
        uint256 mintEra;              // Era when NFT was minted (0, 1, 2...)
        uint256 mintCost;             // Original mint cost (locked forever)
        uint256 baseAttemptCost;      // Base attempt cost for this era (locked)
        uint256 baseSubmissionCost;   // Base submission cost for this era (locked)
        uint256 attemptCount;         // Progressive attempt counter
        uint256 submissionCount;      // Progressive submission counter
    }

    // =============================================================
    //                        V2 STORAGE
    // =============================================================

    // Group mechanics (2 slots from gap)
    IRiddleGroupManager public groupManager;
    mapping(uint256 => uint256) public nftGroupIds; // tokenId => groupId

    // Era-locked cost system (1 slot from gap)
    mapping(uint256 => NFTCostData) public nftCostData; // tokenId => cost data

    // Total slots used: 3
    // Remaining gap: 47 slots

    // =============================================================
    //                        V2 CONSTANTS
    // =============================================================

    // Era system constants (aligned with v3)
    uint256 public constant BIENNIAL_PERIOD = 730 days; // 2 years
    uint256 public constant INITIAL_ATTEMPT_COST = 1e18; // 1 RDLN
    uint256 public constant INITIAL_SUBMISSION_COST = 1e18; // 1 RDLN

    // =============================================================
    //                        V2 EVENTS
    // =============================================================

    event GroupManagerUpdated(address indexed oldManager, address indexed newManager);
    event NFTConvertedToGroup(
        uint256 indexed tokenId,
        uint256 indexed groupId,
        uint256 mintEra,
        address indexed creator,
        uint256 baseAttemptCost
    );
    event QuestionSubmitted(
        uint256 indexed tokenId,
        address indexed submitter,
        bytes32 questionHash,
        uint256 cost,
        uint256 submissionNumber
    );
    event NFTCostDataInitialized(
        uint256 indexed tokenId,
        uint256 mintEra,
        uint256 baseAttemptCost,
        uint256 baseSubmissionCost
    );

    // =============================================================
    //                        V2 ERRORS
    // =============================================================

    error InvalidGroupManager();
    error AlreadyGroupNFT();
    error NotNFTOwner();
    error NFTAlreadyUsed();
    error InsufficientBalance();
    error CostCalculationFailed();
    error SubmissionFailed();

    // =============================================================
    //                        V2 INITIALIZATION
    // =============================================================

    /**
     * @dev Initialize V2 with GroupManager
     * @param _groupManager Address of deployed GroupManager contract
     */
    function initializeV2(address _groupManager)
        external
        reinitializer(2)
        onlyRole(ADMIN_ROLE)
    {
        require(_groupManager != address(0), "Zero address");

        // Validate interface
        try IRiddleGroupManager(_groupManager).activeGroupCount(address(this)) returns (uint256) {
            groupManager = IRiddleGroupManager(_groupManager);
            emit GroupManagerUpdated(address(0), _groupManager);
        } catch {
            revert InvalidGroupManager();
        }
    }

    // =============================================================
    //                        ERA SYSTEM
    // =============================================================

    /**
     * @dev Get current era based on time elapsed since deployment
     * @return Current era number (0, 1, 2, 3...)
     */
    function getCurrentEra() public view returns (uint256) {
        if (block.timestamp < deploymentTime) return 0;
        return (block.timestamp - deploymentTime) / BIENNIAL_PERIOD;
    }

    /**
     * @dev Calculate era from a specific timestamp
     * @param timestamp The timestamp to calculate era for
     * @return Era number at that timestamp
     */
    function getEraForTimestamp(uint256 timestamp) public view returns (uint256) {
        if (timestamp < deploymentTime) return 0;
        return (timestamp - deploymentTime) / BIENNIAL_PERIOD;
    }

    /**
     * @dev Calculate cost for a specific era
     * @param initialCost The base cost at era 0
     * @param era The era to calculate cost for
     * @return Cost at the specified era (halves each era)
     */
    function calculateEraCost(uint256 initialCost, uint256 era)
        public
        pure
        returns (uint256)
    {
        if (era == 0) return initialCost;
        if (era > 10) era = 10; // Cap at era 10 (20 years, ~0.1% of original)

        // Calculate: initialCost / (2^era)
        uint256 divisor = 2 ** era;
        return initialCost / divisor;
    }

    /**
     * @dev Get current mint cost for new NFTs
     * @return Mint cost at current era
     */
    function getCurrentMintCostV2() public view returns (uint256) {
        uint256 currentEra = getCurrentEra();
        return calculateEraCost(INITIAL_MINT_COST, currentEra);
    }

    // =============================================================
    //                        NFT COST DATA MANAGEMENT
    // =============================================================

    /**
     * @dev Initialize cost data for existing NFT (lazy initialization)
     * @param tokenId The NFT to initialize
     * @notice Called automatically when NFT is first used in V2 features
     * @notice Calculates era retroactively from mint timestamp
     */
    function _initializeNFTCostData(uint256 tokenId) internal {
        // Skip if already initialized
        if (nftCostData[tokenId].mintEra != 0) return;

        // Get existing metadata
        NFTMetadata memory meta = nftMetadata[tokenId];
        require(meta.mintTimestamp != 0, "NFT doesn't exist");

        // Calculate era from mint timestamp
        uint256 era = getEraForTimestamp(meta.mintTimestamp);

        // Calculate what costs would have been at that era
        uint256 mintCost = calculateEraCost(INITIAL_MINT_COST, era);
        uint256 baseAttemptCost = calculateEraCost(INITIAL_ATTEMPT_COST, era);
        uint256 baseSubmissionCost = calculateEraCost(INITIAL_SUBMISSION_COST, era);

        // Store cost data
        nftCostData[tokenId] = NFTCostData({
            mintEra: era,
            mintCost: mintCost,
            baseAttemptCost: baseAttemptCost,
            baseSubmissionCost: baseSubmissionCost,
            attemptCount: 0,
            submissionCount: 0
        });

        emit NFTCostDataInitialized(tokenId, era, baseAttemptCost, baseSubmissionCost);
    }

    /**
     * @dev Manually initialize cost data for an NFT (public function)
     * @param tokenId The NFT to initialize
     * @notice Useful for pre-initializing NFTs before group conversion
     */
    function initializeNFTCostData(uint256 tokenId) external {
        require(ownerOf(tokenId) != address(0), "NFT doesn't exist");
        _initializeNFTCostData(tokenId);
    }

    /**
     * @dev Batch initialize cost data for multiple NFTs
     * @param tokenIds Array of token IDs to initialize
     */
    function batchInitializeNFTCostData(uint256[] calldata tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (ownerOf(tokenIds[i]) != address(0)) {
                _initializeNFTCostData(tokenIds[i]);
            }
        }
    }

    // =============================================================
    //                        PROGRESSIVE COST SYSTEM
    // =============================================================

    /**
     * @dev Calculate attempt cost for an NFT (progressive)
     * @param tokenId The NFT to calculate cost for
     * @return Cost for next attempt
     * @notice Cost increases with usage: base * (attempts + 1)
     */
    function calculateAttemptCost(uint256 tokenId) public view returns (uint256) {
        // Check if cost data exists
        NFTCostData memory costData = nftCostData[tokenId];

        // If not initialized, calculate from timestamp
        if (costData.mintEra == 0) {
            NFTMetadata memory meta = nftMetadata[tokenId];
            require(meta.mintTimestamp != 0, "NFT doesn't exist");

            uint256 era = getEraForTimestamp(meta.mintTimestamp);
            uint256 baseCost = calculateEraCost(INITIAL_ATTEMPT_COST, era);

            // Return base cost for first attempt
            return baseCost;
        }

        // Progressive cost: base * (attempts + 1)
        return costData.baseAttemptCost * (costData.attemptCount + 1);
    }

    /**
     * @dev Calculate submission cost for an NFT (progressive)
     * @param tokenId The NFT to calculate cost for
     * @return Cost for next submission
     * @notice Cost increases with usage: base * (submissions + 1)
     */
    function calculateSubmissionCost(uint256 tokenId) public view returns (uint256) {
        // Check if cost data exists
        NFTCostData memory costData = nftCostData[tokenId];

        // If not initialized, calculate from timestamp
        if (costData.mintEra == 0) {
            NFTMetadata memory meta = nftMetadata[tokenId];
            require(meta.mintTimestamp != 0, "NFT doesn't exist");

            uint256 era = getEraForTimestamp(meta.mintTimestamp);
            uint256 baseCost = calculateEraCost(INITIAL_SUBMISSION_COST, era);

            // Return base cost for first submission
            return baseCost;
        }

        // Progressive cost: base * (submissions + 1)
        return costData.baseSubmissionCost * (costData.submissionCount + 1);
    }

    // =============================================================
    //                        USER SUBMISSION SYSTEM
    // =============================================================

    /**
     * @dev Submit a custom question for this NFT
     * @param tokenId The NFT to submit question for
     * @param questionHash Hash of the question
     * @param questionIPFS IPFS hash of encrypted question content
     * @notice Cost increases progressively with each submission
     * @notice 50% burned, 25% to grand prize, 25% to devops
     */
    function submitQuestion(
        uint256 tokenId,
        bytes32 questionHash,
        string memory questionIPFS
    ) external nonReentrant whenNotPaused {
        // Validate ownership
        if (ownerOf(tokenId) != msg.sender) revert NotNFTOwner();
        require(questionHash != bytes32(0), "Invalid question hash");
        require(bytes(questionIPFS).length > 0, "Invalid IPFS hash");

        // Initialize cost data if needed
        _initializeNFTCostData(tokenId);

        // Get cost data
        NFTCostData storage costData = nftCostData[tokenId];
        uint256 submissionCost = calculateSubmissionCost(tokenId);

        // Collect cost
        bool success = rdlnToken.transferFrom(msg.sender, address(this), submissionCost);
        if (!success) revert InsufficientBalance();

        // Increment counter
        costData.submissionCount++;

        // Distribute costs
        _distributeSubmissionCost(submissionCost);

        emit QuestionSubmitted(
            tokenId,
            msg.sender,
            questionHash,
            submissionCost,
            costData.submissionCount
        );
    }

    /**
     * @dev Distribute submission costs (50% burn, 25% grand prize, 25% devops)
     * @param amount Total cost to distribute
     */
    function _distributeSubmissionCost(uint256 amount) internal {
        uint256 burnAmount = (amount * 50) / 100;
        uint256 grandPrizeAmount = (amount * 25) / 100;
        uint256 devOpsAmount = (amount * 25) / 100;

        // Burn 50% (transfer to dead address)
        rdlnToken.transfer(address(0xdead), burnAmount);

        // Transfer 25% to grand prize wallet
        rdlnToken.transfer(grandPrizeWallet, grandPrizeAmount);

        // Transfer 25% to devops wallet
        rdlnToken.transfer(devOpsWallet, devOpsAmount);
    }

    // =============================================================
    //                        GROUP CONVERSION
    // =============================================================

    /**
     * @dev Convert individual NFT to group NFT
     * @param tokenId The NFT to convert
     * @return groupId The created group ID
     * @notice NFT is transferred to GroupManager for custody
     * @notice Era-locked costs are passed to group
     * @notice One-way conversion (cannot revert to solo)
     */
    function convertToGroupNFT(uint256 tokenId)
        external
        nonReentrant
        whenNotPaused
        returns (uint256 groupId)
    {
        // Validate ownership
        if (ownerOf(tokenId) != msg.sender) revert NotNFTOwner();

        // Check not already a group
        if (nftGroupIds[tokenId] != 0) revert AlreadyGroupNFT();

        // Initialize cost data if needed
        _initializeNFTCostData(tokenId);

        // Get cost and metadata
        NFTCostData memory costData = nftCostData[tokenId];
        NFTMetadata memory meta = nftMetadata[tokenId];

        // Validate NFT hasn't been used (for fair group economics)
        ParticipantData memory participant = participantData[tokenId];
        if (participant.attemptCount > 0 || participant.successful) {
            revert NFTAlreadyUsed();
        }

        // Create group via GroupManager
        groupId = groupManager.createGroupFromNFT(
            msg.sender,
            tokenId,
            meta.sessionId,
            costData.mintEra,
            costData.baseAttemptCost,
            costData.baseSubmissionCost
        );

        // Track conversion
        nftGroupIds[tokenId] = groupId;

        // Transfer NFT to GroupManager for custody
        _transfer(msg.sender, address(groupManager), tokenId);

        emit NFTConvertedToGroup(
            tokenId,
            groupId,
            costData.mintEra,
            msg.sender,
            costData.baseAttemptCost
        );
    }

    // =============================================================
    //                        GROUP VIEW FUNCTIONS
    // =============================================================

    /**
     * @dev Check if an NFT is a group
     * @param tokenId The NFT to check
     * @return True if NFT is a group
     */
    function isGroupNFT(uint256 tokenId) external view returns (bool) {
        return nftGroupIds[tokenId] != 0;
    }

    /**
     * @dev Get group ID for an NFT
     * @param tokenId The NFT to check
     * @return Group ID (0 if not a group)
     */
    function getGroupIdForNFT(uint256 tokenId) external view returns (uint256) {
        return nftGroupIds[tokenId];
    }

    /**
     * @dev Get comprehensive info about an NFT's group status
     * @param tokenId The NFT to check
     * @return groupId The group ID (0 if not a group)
     * @return isGroup True if NFT is a group
     * @return memberCount Number of members in group
     * @return state Group state
     * @return mintEra Era when NFT was minted
     * @return baseAttemptCost Base attempt cost for this NFT/group
     */
    function getGroupInfo(uint256 tokenId)
        external
        view
        returns (
            uint256 groupId,
            bool isGroup,
            uint256 memberCount,
            uint8 state,
            uint256 mintEra,
            uint256 baseAttemptCost
        )
    {
        groupId = nftGroupIds[tokenId];
        isGroup = groupId != 0;

        if (isGroup) {
            state = uint8(groupManager.getGroupState(groupId));
            memberCount = groupManager.getGroupMemberCount(groupId);
        } else {
            state = 0;
            memberCount = 0;
        }

        // Get cost data (may need initialization)
        NFTCostData memory costData = nftCostData[tokenId];
        if (costData.mintEra == 0 && ownerOf(tokenId) != address(0)) {
            // Calculate from timestamp for uninitialized NFTs
            NFTMetadata memory meta = nftMetadata[tokenId];
            mintEra = getEraForTimestamp(meta.mintTimestamp);
            baseAttemptCost = calculateEraCost(INITIAL_ATTEMPT_COST, mintEra);
        } else {
            mintEra = costData.mintEra;
            baseAttemptCost = costData.baseAttemptCost;
        }
    }

    /**
     * @dev Check if an NFT can be converted to a group
     * @param tokenId The NFT to check
     * @param user The user attempting conversion
     * @return canConvert True if conversion is allowed
     * @return reason Reason if conversion is not allowed
     */
    function canConvertToGroup(uint256 tokenId, address user)
        external
        view
        returns (bool canConvert, string memory reason)
    {
        // Check NFT exists
        if (ownerOf(tokenId) == address(0)) {
            return (false, "NFT doesn't exist");
        }

        // Check ownership
        if (ownerOf(tokenId) != user) {
            return (false, "Not NFT owner");
        }

        // Check not already a group
        if (nftGroupIds[tokenId] != 0) {
            return (false, "Already a group");
        }

        // Check NFT hasn't been used
        ParticipantData memory participant = participantData[tokenId];
        if (participant.attemptCount > 0 || participant.successful) {
            return (false, "NFT already used (has attempts or solved)");
        }

        // Check GroupManager is set
        if (address(groupManager) == address(0)) {
            return (false, "GroupManager not initialized");
        }

        return (true, "");
    }

    // =============================================================
    //                        ADMIN FUNCTIONS
    // =============================================================

    /**
     * @dev Update GroupManager address
     * @param _groupManager New GroupManager address
     */
    function updateGroupManager(address _groupManager)
        external
        onlyRole(ADMIN_ROLE)
    {
        require(_groupManager != address(0), "Zero address");

        // Validate interface
        try IRiddleGroupManager(_groupManager).activeGroupCount(address(this)) returns (uint256) {
            address oldManager = address(groupManager);
            groupManager = IRiddleGroupManager(_groupManager);
            emit GroupManagerUpdated(oldManager, _groupManager);
        } catch {
            revert InvalidGroupManager();
        }
    }

    /**
     * @dev Emergency function to clear stuck group mapping
     * @param tokenId The NFT to clear mapping for
     */
    function emergencyClearGroupMapping(uint256 tokenId)
        external
        onlyRole(ADMIN_ROLE)
    {
        uint256 oldGroupId = nftGroupIds[tokenId];
        nftGroupIds[tokenId] = 0;
        emit NFTConvertedToGroup(tokenId, 0, 0, msg.sender, 0);
    }

    // =============================================================
    //                        OVERRIDE FUNCTIONS
    // =============================================================

    // =============================================================
    //                        INHERITED OVERRIDES
    // =============================================================

    // Note: All standard overrides (_update, _increaseBalance, tokenURI,
    // supportsInterface, _authorizeUpgrade) are inherited from RiddleNFTAdvanced
    // No need to re-override them here
}