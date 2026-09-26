// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./interfaces/IRDLN.sol";
import "./interfaces/IRON.sol";
import "./interfaces/IRiddleNFT_v3.sol";

/**
 * @title RiddleSubmissionManager
 * @dev Community-driven riddle submission with curator approval + biennial halving
 *
 * Era-based cost structure (matches RiddleNFTv3):
 * - Era 0 (2025-2026): 1 RDLN base submission cost
 * - Era 1 (2027-2028): 0.5 RDLN base submission cost
 * - Era 2 (2029-2030): 0.25 RDLN base submission cost
 * - Continues halving every 2 years
 *
 * Progressive cost per user: base * (submissionCount + 1)
 */
contract RiddleSubmissionManager is
    Initializable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    // =============================================================
    //                        ROLES
    // =============================================================

    bytes32 public constant CURATOR_ROLE = keccak256("CURATOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // =============================================================
    //                        CONSTANTS
    // =============================================================

    IRDLN public rdlnToken;
    IRON public ronToken;
    IRiddleNFT_v3 public riddleNFT;

    uint256 public GENESIS_TIME; // Match RiddleNFTv3 (set in initialize)
    uint256 public constant BIENNIAL_PERIOD = 730 days; // 2 years

    // Base costs (Era 0)
    uint256 public constant INITIAL_SUBMISSION_COST = 1e18; // 1 RDLN

    // Curator rewards
    uint256 public constant CURATOR_REWARD = 1e18; // 1 RON per approval vote
    uint256 public constant REQUIRED_APPROVALS = 3; // 3 of 5 curators

    // Submitter rewards (10% of riddle prize pool)
    uint256 public constant SUBMITTER_REWARD_PERCENT = 1000; // 10%

    // =============================================================
    //                        STORAGE
    // =============================================================

    struct RiddleSubmission {
        uint256 submissionId;
        address submitter;
        string riddleIPFSHash; // IPFS hash for encrypted riddle content
        bytes32 answerHash; // Keccak256(answer + salt)
        string category; // "Math", "Logic", "Crypto", "Wordplay", etc.
        uint8 difficulty; // 1-10
        uint256 submittedAt;
        uint256 submissionEra; // Era when submitted (locks cost)
        uint256 submissionCostPaid; // Actual cost paid
        uint256 approvalCount;
        uint256 rejectionCount;
        mapping(address => bool) curatorVotes;
        SubmissionStatus status;
        string rejectionReason;
        uint256 weekAssigned; // Week number when promoted to live
        uint256 riddleId; // NFT riddle ID after going live
    }

    enum SubmissionStatus {
        Pending,      // Awaiting curator votes
        Approved,     // 3+ curators approved
        Rejected,     // 3+ curators rejected
        Live,         // Promoted to active NFT riddle
        Completed     // Riddle solved and completed
    }

    // Mappings
    mapping(uint256 => RiddleSubmission) public submissions;
    uint256 public submissionCounter;

    // Track user submissions for progressive pricing
    mapping(address => uint256) public userSubmissionCount;

    // Era cost tracking (matches RiddleNFTv3)
    mapping(uint256 => uint256) public eraSubmissionCosts;

    // Statistics
    mapping(address => uint256) public submitterTotalEarned;
    mapping(address => uint256) public submitterApprovedCount;
    mapping(address => uint256) public curatorTotalVotes;
    mapping(address => uint256) public curatorApprovalCount;

    // =============================================================
    //                        EVENTS
    // =============================================================

    event RiddleSubmitted(
        uint256 indexed submissionId,
        address indexed submitter,
        string category,
        uint8 difficulty,
        uint256 costPaid,
        uint256 era
    );

    event CuratorVoted(
        uint256 indexed submissionId,
        address indexed curator,
        bool approved
    );

    event RiddleApproved(
        uint256 indexed submissionId,
        address indexed submitter
    );

    event RiddleRejected(
        uint256 indexed submissionId,
        string reason
    );

    event RiddlePromoted(
        uint256 indexed submissionId,
        uint256 indexed riddleId,
        uint256 weekNumber
    );

    event SubmitterRewarded(
        uint256 indexed submissionId,
        address indexed submitter,
        uint256 amount
    );

    event CuratorRewarded(
        address indexed curator,
        uint256 amount
    );

    // =============================================================
    //                        ERRORS
    // =============================================================

    error InvalidSubmission();
    error AlreadyVoted();
    error NotPending();
    error NotApproved();
    error InsufficientPayment();

    // =============================================================
    //                        INITIALIZATION
    // =============================================================

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _rdlnToken,
        address _ronToken,
        address _riddleNFT,
        address _admin,
        uint256 _genesisTime
    ) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        rdlnToken = IRDLN(_rdlnToken);
        ronToken = IRON(_ronToken);
        riddleNFT = IRiddleNFT_v3(_riddleNFT);

        GENESIS_TIME = _genesisTime;

        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);

        // Initialize era costs (halving every 2 years)
        _initializeEraCosts();
    }

    function _initializeEraCosts() internal {
        // Pre-calculate first 10 eras (20 years)
        uint256 cost = INITIAL_SUBMISSION_COST;
        for (uint256 era = 0; era < 10; era++) {
            eraSubmissionCosts[era] = cost;
            cost = cost / 2; // Halve every era
        }
    }

    // =============================================================
    //                        ERA FUNCTIONS
    // =============================================================

    /**
     * @dev Get current era (0, 1, 2, 3...) based on time elapsed
     */
    function getCurrentEra() public view returns (uint256) {
        if (block.timestamp < GENESIS_TIME) return 0;
        return (block.timestamp - GENESIS_TIME) / BIENNIAL_PERIOD;
    }

    /**
     * @dev Get current base submission cost for era
     */
    function getCurrentSubmissionCost() public view returns (uint256) {
        uint256 currentEra = getCurrentEra();
        return eraSubmissionCosts[currentEra];
    }

    /**
     * @dev Calculate submission cost for a specific user
     * Progressive: baseEra * (userSubmissionCount + 1)
     *
     * Example Era 0:
     * - First submission: 1 RDLN * 1 = 1 RDLN
     * - Second submission: 1 RDLN * 2 = 2 RDLN
     * - Third submission: 1 RDLN * 3 = 3 RDLN
     *
     * Example Era 1:
     * - First submission: 0.5 RDLN * 1 = 0.5 RDLN
     * - Second submission: 0.5 RDLN * 2 = 1 RDLN
     */
    function calculateUserSubmissionCost(address user) public view returns (uint256) {
        uint256 baseCost = getCurrentSubmissionCost();
        uint256 userCount = userSubmissionCount[user];
        return baseCost * (userCount + 1);
    }

    // =============================================================
    //                        SUBMISSION FUNCTIONS
    // =============================================================

    /**
     * @dev Submit a riddle for curator review
     * @param riddleIPFSHash IPFS hash of encrypted riddle content
     * @param answerHash Keccak256 hash of the answer + salt
     * @param category Category of riddle
     * @param difficulty Difficulty rating 1-10
     */
    function submitRiddle(
        string memory riddleIPFSHash,
        bytes32 answerHash,
        string memory category,
        uint8 difficulty
    ) external nonReentrant whenNotPaused {
        if (bytes(riddleIPFSHash).length == 0) revert InvalidSubmission();
        if (answerHash == bytes32(0)) revert InvalidSubmission();
        if (difficulty < 1 || difficulty > 10) revert InvalidSubmission();

        // Calculate cost for this user
        uint256 submissionCost = calculateUserSubmissionCost(msg.sender);
        uint256 currentEra = getCurrentEra();

        // Charge submission fee
        require(
            rdlnToken.transferFrom(msg.sender, address(this), submissionCost),
            "Fee payment failed"
        );

        uint256 submissionId = ++submissionCounter;

        RiddleSubmission storage submission = submissions[submissionId];
        submission.submissionId = submissionId;
        submission.submitter = msg.sender;
        submission.riddleIPFSHash = riddleIPFSHash;
        submission.answerHash = answerHash;
        submission.category = category;
        submission.difficulty = difficulty;
        submission.submittedAt = block.timestamp;
        submission.submissionEra = currentEra;
        submission.submissionCostPaid = submissionCost;
        submission.status = SubmissionStatus.Pending;

        // Increment user submission count for progressive pricing
        userSubmissionCount[msg.sender]++;

        emit RiddleSubmitted(
            submissionId,
            msg.sender,
            category,
            difficulty,
            submissionCost,
            currentEra
        );
    }

    /**
     * @dev Curators vote to approve or reject riddle
     * @param submissionId ID of submission
     * @param approve True to approve, false to reject
     * @param reason Reason for rejection (optional, required if rejecting)
     */
    function voteOnSubmission(
        uint256 submissionId,
        bool approve,
        string memory reason
    ) external onlyRole(CURATOR_ROLE) nonReentrant {
        RiddleSubmission storage submission = submissions[submissionId];

        if (submission.status != SubmissionStatus.Pending) revert NotPending();
        if (submission.curatorVotes[msg.sender]) revert AlreadyVoted();

        submission.curatorVotes[msg.sender] = true;

        if (approve) {
            submission.approvalCount++;

            // If reached required approvals, mark as approved
            if (submission.approvalCount >= REQUIRED_APPROVALS) {
                submission.status = SubmissionStatus.Approved;
                submitterApprovedCount[submission.submitter]++;

                emit RiddleApproved(submissionId, submission.submitter);

                // Reward curator with RON
                ronToken.awardValidationRON(msg.sender, CURATOR_REWARD, "curator_approval");
                curatorApprovalCount[msg.sender]++;

                emit CuratorRewarded(msg.sender, CURATOR_REWARD);
            }
        } else {
            submission.rejectionCount++;

            if (bytes(reason).length > 0) {
                submission.rejectionReason = reason;
            }

            // If 3 rejections, mark as rejected and burn fee
            if (submission.rejectionCount >= REQUIRED_APPROVALS) {
                submission.status = SubmissionStatus.Rejected;

                emit RiddleRejected(submissionId, submission.rejectionReason);

                // Burn submission fee as spam prevention (transfer to dead address)
                // Note: IRDLN interface doesn't expose burn(), so we transfer to dead address
                rdlnToken.transfer(address(0xdead), submission.submissionCostPaid);
            }
        }

        curatorTotalVotes[msg.sender]++;
        emit CuratorVoted(submissionId, msg.sender, approve);
    }

    /**
     * @dev Admin promotes approved riddle to live NFT
     * @param submissionId ID of approved submission
     * @param weekNumber Week to assign riddle
     * @param prizePool Prize pool for riddle
     * @param maxMintRate Max NFTs that can be minted
     * @param winnerSlots Number of winners allowed
     */
    function promoteToLive(
        uint256 submissionId,
        uint256 weekNumber,
        uint256 prizePool,
        uint256 maxMintRate,
        uint256 winnerSlots
    ) external onlyRole(ADMIN_ROLE) nonReentrant {
        RiddleSubmission storage submission = submissions[submissionId];

        if (submission.status != SubmissionStatus.Approved) revert NotApproved();

        submission.status = SubmissionStatus.Live;
        submission.weekAssigned = weekNumber;

        // Calculate submitter reward (10% of prize pool)
        uint256 submitterReward = (prizePool * SUBMITTER_REWARD_PERCENT) / 10000;

        // Transfer reward to submitter
        require(
            rdlnToken.transfer(submission.submitter, submitterReward),
            "Reward transfer failed"
        );

        submitterTotalEarned[submission.submitter] += submitterReward;

        emit SubmitterRewarded(submissionId, submission.submitter, submitterReward);

        // Call RiddleNFTv3.createRiddle()
        // Note: This contract needs CREATOR_ROLE on RiddleNFTv3
        uint256 riddleId = riddleNFT.createRiddle(
            weekNumber,
            keccak256(abi.encodePacked(submission.riddleIPFSHash)), // riddleHash
            submission.answerHash,
            prizePool,
            maxMintRate,
            winnerSlots
        );

        submission.riddleId = riddleId;

        emit RiddlePromoted(submissionId, riddleId, weekNumber);
    }

    // =============================================================
    //                        VIEW FUNCTIONS
    // =============================================================

    /**
     * @dev Get submission details
     */
    function getSubmission(uint256 submissionId) external view returns (
        address submitter,
        string memory riddleIPFSHash,
        string memory category,
        uint8 difficulty,
        uint256 submissionEra,
        uint256 costPaid,
        uint256 approvalCount,
        uint256 rejectionCount,
        SubmissionStatus status,
        uint256 weekAssigned
    ) {
        RiddleSubmission storage sub = submissions[submissionId];
        return (
            sub.submitter,
            sub.riddleIPFSHash,
            sub.category,
            sub.difficulty,
            sub.submissionEra,
            sub.submissionCostPaid,
            sub.approvalCount,
            sub.rejectionCount,
            sub.status,
            sub.weekAssigned
        );
    }

    /**
     * @dev Get pending submissions (for curator dashboard)
     */
    function getPendingSubmissions(uint256 limit, uint256 offset)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory pending = new uint256[](limit);
        uint256 count = 0;
        uint256 skipped = 0;

        for (uint256 i = 1; i <= submissionCounter && count < limit; i++) {
            if (submissions[i].status == SubmissionStatus.Pending) {
                if (skipped >= offset) {
                    pending[count] = i;
                    count++;
                } else {
                    skipped++;
                }
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = pending[i];
        }

        return result;
    }

    /**
     * @dev Get user's submission statistics
     */
    function getUserStats(address user) external view returns (
        uint256 totalSubmissions,
        uint256 approvedSubmissions,
        uint256 totalEarned,
        uint256 nextSubmissionCost
    ) {
        return (
            userSubmissionCount[user],
            submitterApprovedCount[user],
            submitterTotalEarned[user],
            calculateUserSubmissionCost(user)
        );
    }

    /**
     * @dev Get curator statistics
     */
    function getCuratorStats(address curator) external view returns (
        uint256 totalVotes,
        uint256 approvalsGiven,
        uint256 reputationScore
    ) {
        uint256 votes = curatorTotalVotes[curator];
        uint256 approvals = curatorApprovalCount[curator];
        uint256 reputation = votes > 0 ? (approvals * 100) / votes : 0;

        return (votes, approvals, reputation);
    }

    // =============================================================
    //                        ADMIN FUNCTIONS
    // =============================================================

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}
}