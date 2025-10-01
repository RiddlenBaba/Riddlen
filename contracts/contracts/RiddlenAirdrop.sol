// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IRON.sol";

interface IRiddlenOracleNetwork {
    function getValidatorProfile(address validator) external view returns (
        uint8 tier,
        uint256 totalValidations,
        uint256 correctValidations,
        uint256 accuracy,
        uint256 totalEarned,
        uint256 totalSlashed,
        bool isSuspended
    );
}

/**
 * @title RiddlenAirdrop
 * @dev Three-phase airdrop system for Riddlen Protocol v6.0
 *
 * Phase 1: Early Adoption Incentive (33M RDLN)
 * - 10,000 RDLN per wallet
 * - First 3,300 wallets only
 * - Social proof requirements
 * - One-time claim per wallet
 *
 * Phase 2: Merit-Based RON Airdrop (33M RDLN)
 * - Tiered rewards based on RON reputation
 * - 1,000 RON minimum requirement
 * - Performance-based allocation
 * - Single claim per qualified wallet
 *
 * Phase 3: Validation-Based Earning (34M RDLN)
 * - Earn RDLN by completing validations in Oracle Network
 * - Requirements: 3+ validations AND 1,000+ RON balance
 * - 500 RDLN per validation completed
 * - 25% bonus for 10+ validations
 * - Can claim multiple times as validations increase
 * - Max 5,000 RDLN per wallet from Phase 3
 * - All three phases can run simultaneously
 */
contract RiddlenAirdrop is
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    // =============================================================
    //                        CONSTANTS
    // =============================================================

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");

    // Phase 1 constants (Social Proof)
    uint256 public constant PHASE1_ALLOCATION = 33_000_000 * 1e18; // 33M RDLN
    uint256 public constant PHASE1_PER_WALLET = 5_000 * 1e18;      // 5K RDLN per wallet
    uint256 public constant PHASE1_MAX_PARTICIPANTS = 6_600;        // 6,600 wallets

    // Phase 2 constants (RON Tiers)
    uint256 public constant PHASE2_ALLOCATION = 33_000_000 * 1e18; // 33M RDLN
    uint256 public constant RON_MINIMUM_THRESHOLD = 1_000;          // 1K RON minimum

    // Phase 3 constants (Validation Earning)
    uint256 public constant PHASE3_ALLOCATION = 34_000_000 * 1e18; // 34M RDLN
    uint256 public constant PHASE3_MIN_VALIDATIONS = 3;             // Min 3 validations required
    uint256 public constant PHASE3_MIN_RON_BALANCE = 1_000;         // Min 1,000 RON balance required
    uint256 public constant PHASE3_REWARD_PER_VALIDATION = 500 * 1e18; // 500 RDLN per validation
    uint256 public constant PHASE3_MAX_PER_PHASE = 5_000 * 1e18;   // Max 5K RDLN per phase
    uint256 public constant PHASE3_BONUS_TIER_THRESHOLD = 10;       // 10+ validations = bonus

    // Global limits across all phases
    uint256 public constant MAX_TOTAL_PER_WALLET = 15_000 * 1e18;  // Max 15K RDLN total across all phases

    // Phase 2 tier thresholds and rewards
    uint256 public constant TIER1_THRESHOLD = 1_000;   // 1K-4.999K RON
    uint256 public constant TIER2_THRESHOLD = 5_000;   // 5K-9.999K RON
    uint256 public constant TIER3_THRESHOLD = 10_000;  // 10K-24.999K RON
    uint256 public constant TIER4_THRESHOLD = 25_000;  // 25K+ RON

    uint256 public constant TIER1_REWARD = 2_000 * 1e18;   // 2K RDLN
    uint256 public constant TIER2_REWARD = 3_000 * 1e18;   // 3K RDLN
    uint256 public constant TIER3_REWARD = 4_000 * 1e18;   // 4K RDLN
    uint256 public constant TIER4_REWARD = 5_000 * 1e18;   // 5K RDLN

    // Social proof constraints
    uint256 public constant MAX_HANDLE_LENGTH = 50;  // Max chars for social handles

    // =============================================================
    //                        STORAGE
    // =============================================================

    IERC20 public rdlnToken;
    IRON public ronToken;
    address public oracleNetwork;

    // Phase 1 state
    bool public phase1Active;
    uint256 public phase1Participants;
    mapping(address => bool) public phase1Claimed;
    mapping(address => bool) public socialProofVerified;

    // Phase 2 state
    bool public phase2Active;
    mapping(address => bool) public phase2Claimed;
    mapping(address => uint256) public phase2ClaimedAmount;
    mapping(address => uint256) public ronBalanceSnapshot;
    uint256 public snapshotTimestamp;
    bool public snapshotTaken;

    // Phase 3 state (Validation-based)
    bool public phase3Active;
    mapping(address => uint256) public phase3TotalClaimed;
    mapping(address => uint256) public phase3LastClaimedValidationCount;
    uint256 public phase3TotalDistributed;

    // Social proof tracking
    mapping(address => SocialProof) public socialProofs;

    struct SocialProof {
        bool twitterVerified;
        bool telegramVerified;
        bool shareVerified;
        string twitterHandle;
        string telegramHandle;
        uint256 verificationTimestamp;
    }

    // =============================================================
    //                        EVENTS
    // =============================================================

    /// @notice Emitted when a user claims Phase 1 airdrop
    /// @param user The address claiming tokens
    /// @param amount The amount of RDLN tokens claimed
    /// @param participantNumber The user's participant number (1-5000)
    event Phase1Claimed(
        address indexed user,
        uint256 amount,
        uint256 participantNumber
    );

    /// @notice Emitted when a user claims Phase 2 airdrop
    /// @param user The address claiming tokens
    /// @param ronBalance The user's RON balance at claim time
    /// @param amount The amount of RDLN tokens claimed
    /// @param tier The tier level (1-4) based on RON balance
    event Phase2Claimed(
        address indexed user,
        uint256 ronBalance,
        uint256 amount,
        uint8 tier
    );

    /// @notice Emitted when a user submits social proof for verification
    /// @param user The address submitting social proof
    /// @param twitterHandle The Twitter handle submitted
    /// @param telegramHandle The Telegram handle submitted
    event SocialProofSubmitted(
        address indexed user,
        string twitterHandle,
        string telegramHandle
    );

    /// @notice Emitted when an operator verifies user's social proof
    /// @param user The address being verified
    /// @param twitterVerified Whether Twitter follow was verified
    /// @param telegramVerified Whether Telegram join was verified
    /// @param shareVerified Whether share post was verified
    event SocialProofVerified(
        address indexed user,
        bool twitterVerified,
        bool telegramVerified,
        bool shareVerified
    );

    /// @notice Emitted when an admin activates or deactivates an airdrop phase
    /// @param phase The phase number (1 or 2)
    /// @param active Whether the phase is being activated or deactivated
    event PhaseActivated(uint8 phase, bool active);

    /// @notice Emitted when admin performs emergency withdrawal of tokens
    /// @param admin The admin address performing the withdrawal
    /// @param recipient The address receiving the withdrawn tokens
    /// @param amount The amount of tokens withdrawn
    /// @param remainingBalance The remaining balance after withdrawal
    /// @param timestamp The timestamp of the withdrawal
    event EmergencyWithdrawal(
        address indexed admin,
        address indexed recipient,
        uint256 amount,
        uint256 remainingBalance,
        uint256 timestamp
    );

    /// @notice Emitted when RON balance snapshot is taken for Phase 2
    /// @param operator The operator who took the snapshot
    /// @param userCount The number of users included in snapshot
    /// @param timestamp The timestamp of the snapshot
    event SnapshotTaken(
        address indexed operator,
        uint256 userCount,
        uint256 timestamp
    );

    /// @notice Emitted when a user claims Phase 3 validation rewards
    /// @param user The address claiming tokens
    /// @param validationCount Total validations completed
    /// @param newValidations New validations since last claim
    /// @param amount The amount of RDLN tokens claimed
    /// @param bonusAmount Bonus amount for high performers
    event Phase3Claimed(
        address indexed user,
        uint256 validationCount,
        uint256 newValidations,
        uint256 amount,
        uint256 bonusAmount
    );

    // =============================================================
    //                        ERRORS
    // =============================================================

    error PhaseNotActive();
    error AlreadyClaimed();
    error Phase1Full();
    error SocialProofNotVerified();
    error InsufficientRON();
    error InvalidRONBalance();
    error InsufficientContractBalance();
    error InvalidSocialProof();
    error UnauthorizedUpgrade();
    error SnapshotNotTaken();
    error SnapshotAlreadyTaken();
    error NoNewValidations();
    error ExceedsMaxPerWallet();
    error InvalidOracleAddress();

    // =============================================================
    //                        INITIALIZER
    // =============================================================

    function initialize(
        address _rdlnToken,
        address _ronToken,
        address _oracleNetwork,
        address _admin
    ) public initializer {
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        require(_rdlnToken != address(0), "Invalid RDLN address");
        require(_ronToken != address(0), "Invalid RON address");
        require(_oracleNetwork != address(0), "Invalid Oracle address");
        require(_admin != address(0), "Invalid admin address");

        // Validate contracts exist
        require(_rdlnToken.code.length > 0, "RDLN not a contract");
        require(_ronToken.code.length > 0, "RON not a contract");
        require(_oracleNetwork.code.length > 0, "Oracle not a contract");

        rdlnToken = IERC20(_rdlnToken);
        ronToken = IRON(_ronToken);
        oracleNetwork = _oracleNetwork;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);
        _grantRole(OPERATOR_ROLE, _admin);
        _grantRole(COMPLIANCE_ROLE, _admin);
    }

    // =============================================================
    //                        PHASE 1 FUNCTIONS
    // =============================================================

    /**
     * @dev Submit social proof for Phase 1 verification
     * @param _twitterHandle Twitter username (without @)
     * @param _telegramHandle Telegram username (without @)
     */
    function submitSocialProof(
        string calldata _twitterHandle,
        string calldata _telegramHandle
    ) external whenNotPaused {
        require(bytes(_twitterHandle).length > 0, "Twitter handle required");
        require(bytes(_telegramHandle).length > 0, "Telegram handle required");
        require(bytes(_twitterHandle).length <= MAX_HANDLE_LENGTH, "Twitter handle too long");
        require(bytes(_telegramHandle).length <= MAX_HANDLE_LENGTH, "Telegram handle too long");

        socialProofs[msg.sender] = SocialProof({
            twitterVerified: false,
            telegramVerified: false,
            shareVerified: false,
            twitterHandle: _twitterHandle,
            telegramHandle: _telegramHandle,
            verificationTimestamp: 0
        });

        emit SocialProofSubmitted(msg.sender, _twitterHandle, _telegramHandle);
    }

    /**
     * @dev Verify social proof for a user (operator only)
     * @param _user User address to verify
     * @param _twitterVerified Twitter follow verification
     * @param _telegramVerified Telegram join verification
     * @param _shareVerified Share post verification
     */
    function verifySocialProof(
        address _user,
        bool _twitterVerified,
        bool _telegramVerified,
        bool _shareVerified
    ) external onlyRole(OPERATOR_ROLE) {
        require(_user != address(0), "Invalid user address");

        SocialProof storage proof = socialProofs[_user];
        require(bytes(proof.twitterHandle).length > 0, "No social proof submitted");

        proof.twitterVerified = _twitterVerified;
        proof.telegramVerified = _telegramVerified;
        proof.shareVerified = _shareVerified;
        proof.verificationTimestamp = block.timestamp;

        // Mark as verified if all requirements met
        if (_twitterVerified && _telegramVerified && _shareVerified) {
            socialProofVerified[_user] = true;
        } else {
            socialProofVerified[_user] = false;
        }

        emit SocialProofVerified(_user, _twitterVerified, _telegramVerified, _shareVerified);
    }

    /**
     * @dev Claim Phase 1 airdrop (10,000 RDLN)
     * Requirements:
     * - Phase 1 must be active
     * - Social proof must be verified
     * - Must be within first 5,000 participants
     * - One claim per wallet
     */
    function claimPhase1() external nonReentrant whenNotPaused {
        // Checks
        if (!phase1Active) revert PhaseNotActive();
        if (phase1Claimed[msg.sender]) revert AlreadyClaimed();
        if (phase1Participants >= PHASE1_MAX_PARTICIPANTS) revert Phase1Full();
        if (!socialProofVerified[msg.sender]) revert SocialProofNotVerified();

        // Check global 15K limit
        uint256 totalClaimed = getTotalClaimed(msg.sender);
        if (totalClaimed + PHASE1_PER_WALLET > MAX_TOTAL_PER_WALLET) {
            revert ExceedsMaxPerWallet();
        }

        uint256 contractBalance = rdlnToken.balanceOf(address(this));
        if (contractBalance < PHASE1_PER_WALLET) {
            revert InsufficientContractBalance();
        }

        // Effects
        phase1Claimed[msg.sender] = true;
        phase1Participants++;

        // Interactions
        require(
            rdlnToken.transfer(msg.sender, PHASE1_PER_WALLET),
            "Transfer failed"
        );

        emit Phase1Claimed(msg.sender, PHASE1_PER_WALLET, phase1Participants);
    }

    /**
     * @dev Auto-verify and claim Phase 1 airdrop (TESTNET ONLY - remove for mainnet)
     * Automatically verifies social proof and claims in one transaction
     * Requirements:
     * - Phase 1 must be active
     * - Must be within first 5,000 participants
     * - One claim per wallet
     */
    function autoClaimPhase1() external nonReentrant whenNotPaused {
        // Checks
        if (!phase1Active) revert PhaseNotActive();
        if (phase1Claimed[msg.sender]) revert AlreadyClaimed();
        if (phase1Participants >= PHASE1_MAX_PARTICIPANTS) revert Phase1Full();

        // Check global 15K limit
        uint256 totalClaimed = getTotalClaimed(msg.sender);
        if (totalClaimed + PHASE1_PER_WALLET > MAX_TOTAL_PER_WALLET) {
            revert ExceedsMaxPerWallet();
        }

        uint256 contractBalance = rdlnToken.balanceOf(address(this));
        if (contractBalance < PHASE1_PER_WALLET) {
            revert InsufficientContractBalance();
        }

        // Auto-verify for testnet (REMOVE THIS FOR MAINNET)
        socialProofVerified[msg.sender] = true;

        // Effects
        phase1Claimed[msg.sender] = true;
        phase1Participants++;

        // Interactions
        require(
            rdlnToken.transfer(msg.sender, PHASE1_PER_WALLET),
            "Transfer failed"
        );

        emit Phase1Claimed(msg.sender, PHASE1_PER_WALLET, phase1Participants);
    }

    // =============================================================
    //                        PHASE 2 FUNCTIONS
    // =============================================================

    /**
     * @dev Calculate Phase 2 reward based on RON balance
     * @param _ronBalance User's RON token balance
     * @return reward RDLN reward amount
     * @return tier Tier level (1-4)
     */
    function calculatePhase2Reward(uint256 _ronBalance)
        public
        pure
        returns (uint256 reward, uint8 tier)
    {
        if (_ronBalance < RON_MINIMUM_THRESHOLD) {
            return (0, 0);
        } else if (_ronBalance < TIER2_THRESHOLD) {
            return (TIER1_REWARD, 1);
        } else if (_ronBalance < TIER3_THRESHOLD) {
            return (TIER2_REWARD, 2);
        } else if (_ronBalance < TIER4_THRESHOLD) {
            return (TIER3_REWARD, 3);
        } else {
            return (TIER4_REWARD, 4);
        }
    }

    /**
     * @dev Claim Phase 2 merit-based airdrop
     * Requirements:
     * - Phase 2 must be active
     * - Snapshot must be taken
     * - Must have minimum 1,000 RON in snapshot
     * - One claim per wallet
     * - Reward based on RON tier from snapshot
     */
    function claimPhase2() external nonReentrant whenNotPaused {
        // Checks
        if (!phase2Active) revert PhaseNotActive();
        if (!snapshotTaken) revert SnapshotNotTaken();
        if (phase2Claimed[msg.sender]) revert AlreadyClaimed();

        // Get user's RON balance from snapshot
        uint256 ronBalance = ronBalanceSnapshot[msg.sender];
        if (ronBalance < RON_MINIMUM_THRESHOLD) revert InsufficientRON();

        // Calculate reward and tier
        (uint256 reward, uint8 tier) = calculatePhase2Reward(ronBalance);
        if (reward == 0) revert InvalidRONBalance();

        // Check global 15K limit
        uint256 totalClaimed = getTotalClaimed(msg.sender);
        uint256 actualReward = reward;
        if (totalClaimed + reward > MAX_TOTAL_PER_WALLET) {
            // Cap reward to respect global limit
            actualReward = MAX_TOTAL_PER_WALLET - totalClaimed;
            if (actualReward == 0) revert ExceedsMaxPerWallet();
        }

        uint256 contractBalance = rdlnToken.balanceOf(address(this));
        if (contractBalance < actualReward) {
            revert InsufficientContractBalance();
        }

        // Effects
        phase2Claimed[msg.sender] = true;
        phase2ClaimedAmount[msg.sender] = actualReward;

        // Interactions
        require(
            rdlnToken.transfer(msg.sender, actualReward),
            "Transfer failed"
        );

        emit Phase2Claimed(msg.sender, ronBalance, actualReward, tier);
    }

    /**
     * @dev Take RON balance snapshot for eligible users (operator only)
     * @param _users Array of user addresses to snapshot
     */
    function takeRONSnapshot(address[] calldata _users)
        external
        onlyRole(OPERATOR_ROLE)
        whenNotPaused
    {
        require(!snapshotTaken, "Snapshot already taken");
        require(_users.length > 0, "Empty user list");

        snapshotTimestamp = block.timestamp;

        for (uint256 i = 0; i < _users.length; i++) {
            address user = _users[i];
            require(user != address(0), "Invalid user address");

            uint256 ronBalance = ronToken.balanceOf(user);
            ronBalanceSnapshot[user] = ronBalance;
        }

        snapshotTaken = true;

        emit SnapshotTaken(msg.sender, _users.length, block.timestamp);
    }

    /**
     * @dev Reset snapshot (admin only, for testnet purposes)
     * WARNING: Should be removed or heavily restricted for mainnet
     */
    function resetSnapshot() external onlyRole(DEFAULT_ADMIN_ROLE) {
        snapshotTaken = false;
        snapshotTimestamp = 0;
    }

    // =============================================================
    //                        PHASE 3 FUNCTIONS
    // =============================================================

    /**
     * @dev Claim Phase 3 validation-based airdrop
     * Requirements:
     * - Phase 3 must be active
     * - Must have completed 3+ validations in Oracle Network
     * - Must have 1,000+ RON balance (serious validator requirement)
     * - Can claim multiple times as validations increase
     * - Rewards based on new validations since last claim
     * - Subject to 5K per phase and 15K global limit
     */
    function claimPhase3() external nonReentrant whenNotPaused {
        // Checks
        if (!phase3Active) revert PhaseNotActive();

        // Get validator profile from Oracle Network
        (
            ,
            uint256 totalValidations,
            ,
            ,
            ,
            ,
            bool isSuspended
        ) = IRiddlenOracleNetwork(oracleNetwork).getValidatorProfile(msg.sender);

        // Check minimum validations
        if (totalValidations < PHASE3_MIN_VALIDATIONS) revert InsufficientRON();

        // Check minimum RON balance (must be serious validator)
        uint256 ronBalance = ronToken.balanceOf(msg.sender);
        if (ronBalance < PHASE3_MIN_RON_BALANCE) revert InsufficientRON();

        // Check not suspended
        if (isSuspended) revert SocialProofNotVerified();

        // Calculate new validations since last claim
        uint256 lastClaimed = phase3LastClaimedValidationCount[msg.sender];
        uint256 newValidations = totalValidations - lastClaimed;

        if (newValidations == 0) revert NoNewValidations();

        // Calculate base reward (500 RDLN per validation)
        uint256 baseReward = newValidations * PHASE3_REWARD_PER_VALIDATION;

        // Calculate bonus for high performers (10+ validations = 25% bonus)
        uint256 bonusAmount = 0;
        if (totalValidations >= PHASE3_BONUS_TIER_THRESHOLD) {
            bonusAmount = (baseReward * 25) / 100; // 25% bonus
        }

        uint256 totalReward = baseReward + bonusAmount;

        // Cap at Phase 3 max (5K RDLN per phase)
        if (totalReward > PHASE3_MAX_PER_PHASE) {
            totalReward = PHASE3_MAX_PER_PHASE;
        }

        // Check Phase 3 max per wallet limit
        uint256 newPhase3Total = phase3TotalClaimed[msg.sender] + totalReward;
        if (newPhase3Total > PHASE3_MAX_PER_PHASE) {
            // Cap at phase 3 max
            totalReward = PHASE3_MAX_PER_PHASE - phase3TotalClaimed[msg.sender];
            if (totalReward == 0) revert ExceedsMaxPerWallet();
        }

        // Check global 15K limit across all phases
        uint256 totalClaimed = getTotalClaimed(msg.sender);
        if (totalClaimed + totalReward > MAX_TOTAL_PER_WALLET) {
            // Cap reward to respect global limit
            totalReward = MAX_TOTAL_PER_WALLET - totalClaimed;
            if (totalReward == 0) revert ExceedsMaxPerWallet();
        }

        // Check contract balance
        uint256 contractBalance = rdlnToken.balanceOf(address(this));
        if (contractBalance < totalReward) {
            revert InsufficientContractBalance();
        }

        // Effects
        phase3TotalClaimed[msg.sender] += totalReward;
        phase3LastClaimedValidationCount[msg.sender] = totalValidations;
        phase3TotalDistributed += totalReward;

        // Interactions
        require(
            rdlnToken.transfer(msg.sender, totalReward),
            "Transfer failed"
        );

        emit Phase3Claimed(
            msg.sender,
            totalValidations,
            newValidations,
            baseReward,
            bonusAmount
        );
    }

    // =============================================================
    //                        HELPER FUNCTIONS
    // =============================================================

    /**
     * @dev Get total amount claimed by user across all phases
     * @param _user User address to check
     * @return total Total RDLN claimed across all phases
     */
    function getTotalClaimed(address _user) public view returns (uint256 total) {
        total = 0;

        // Phase 1
        if (phase1Claimed[_user]) {
            total += PHASE1_PER_WALLET;
        }

        // Phase 2
        total += phase2ClaimedAmount[_user];

        // Phase 3
        total += phase3TotalClaimed[_user];

        return total;
    }

    /**
     * @dev Get remaining claimable amount for user (respecting 15K global limit)
     * @param _user User address to check
     * @return remaining Remaining RDLN user can claim
     */
    function getRemainingClaimable(address _user) public view returns (uint256 remaining) {
        uint256 totalClaimed = getTotalClaimed(_user);

        if (totalClaimed >= MAX_TOTAL_PER_WALLET) {
            return 0;
        }

        return MAX_TOTAL_PER_WALLET - totalClaimed;
    }

    // =============================================================
    //                        ADMIN FUNCTIONS
    // =============================================================

    /**
     * @dev Activate/deactivate airdrop phases
     * @param _phase Phase number (1, 2, or 3)
     * @param _active Whether to activate or deactivate
     */
    function setPhaseActive(uint8 _phase, bool _active) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_phase >= 1 && _phase <= 3, "Invalid phase");

        // Check sufficient balance when activating
        if (_active) {
            uint256 requiredBalance;
            if (_phase == 1) {
                requiredBalance = PHASE1_ALLOCATION;
            } else if (_phase == 2) {
                requiredBalance = PHASE2_ALLOCATION;
            } else {
                requiredBalance = PHASE3_ALLOCATION;
            }

            require(
                rdlnToken.balanceOf(address(this)) >= requiredBalance,
                "Insufficient balance for phase activation"
            );
        }

        if (_phase == 1) {
            phase1Active = _active;
        } else if (_phase == 2) {
            phase2Active = _active;
        } else {
            phase3Active = _active;
        }

        emit PhaseActivated(_phase, _active);
    }

    /**
     * @dev Emergency withdrawal of remaining tokens
     * @param _to Recipient address
     * @param _amount Amount to withdraw
     */
    function emergencyWithdraw(
        address _to,
        uint256 _amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_to != address(0), "Invalid recipient");
        uint256 contractBalance = rdlnToken.balanceOf(address(this));
        require(contractBalance >= _amount, "Insufficient balance");

        require(rdlnToken.transfer(_to, _amount), "Transfer failed");

        emit EmergencyWithdrawal(
            msg.sender,
            _to,
            _amount,
            contractBalance - _amount,
            block.timestamp
        );
    }

    /**
     * @dev Pause/unpause contract
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // =============================================================
    //                        VIEW FUNCTIONS
    // =============================================================

    /**
     * @dev Get user's Phase 1 eligibility status
     * @param _user User address to check
     * @return eligible Whether user is eligible
     * @return claimed Whether user has already claimed
     * @return verified Whether social proof is verified
     */
    function getPhase1Status(address _user)
        external
        view
        returns (bool eligible, bool claimed, bool verified)
    {
        claimed = phase1Claimed[_user];
        verified = socialProofVerified[_user];
        eligible = phase1Active &&
                  !claimed &&
                  verified &&
                  phase1Participants < PHASE1_MAX_PARTICIPANTS;
    }

    /**
     * @dev Get user's Phase 2 eligibility and reward info
     * @param _user User address to check
     * @return eligible Whether user is eligible
     * @return claimed Whether user has already claimed
     * @return ronBalance User's RON balance from snapshot (or current if no snapshot)
     * @return reward Potential RDLN reward
     * @return tier RON tier level
     */
    function getPhase2Status(address _user)
        external
        view
        returns (
            bool eligible,
            bool claimed,
            uint256 ronBalance,
            uint256 reward,
            uint8 tier
        )
    {
        claimed = phase2Claimed[_user];

        // Use snapshot balance if available, otherwise current balance
        ronBalance = snapshotTaken ? ronBalanceSnapshot[_user] : ronToken.balanceOf(_user);
        (reward, tier) = calculatePhase2Reward(ronBalance);

        eligible = phase2Active &&
                  snapshotTaken &&
                  !claimed &&
                  ronBalance >= RON_MINIMUM_THRESHOLD;
    }

    /**
     * @dev Get user's Phase 3 eligibility and reward info
     * @param _user User address to check
     * @return eligible Whether user is eligible to claim
     * @return totalValidations Total validations completed
     * @return newValidations New validations since last claim
     * @return estimatedReward Estimated RDLN reward for new validations
     * @return totalClaimed Total Phase 3 RDLN already claimed
     * @return remainingPhase3 Remaining Phase 3 claimable
     */
    function getPhase3Status(address _user)
        external
        view
        returns (
            bool eligible,
            uint256 totalValidations,
            uint256 newValidations,
            uint256 estimatedReward,
            uint256 totalClaimed,
            uint256 remainingPhase3
        )
    {
        // Get validator profile from Oracle Network
        (
            ,
            uint256 _totalValidations,
            ,
            ,
            ,
            ,
            bool isSuspended
        ) = IRiddlenOracleNetwork(oracleNetwork).getValidatorProfile(_user);

        totalValidations = _totalValidations;
        totalClaimed = phase3TotalClaimed[_user];

        uint256 lastClaimed = phase3LastClaimedValidationCount[_user];
        newValidations = totalValidations > lastClaimed ? totalValidations - lastClaimed : 0;

        // Calculate estimated reward
        uint256 baseReward = newValidations * PHASE3_REWARD_PER_VALIDATION;
        uint256 bonusAmount = 0;
        if (totalValidations >= PHASE3_BONUS_TIER_THRESHOLD) {
            bonusAmount = (baseReward * 25) / 100;
        }
        estimatedReward = baseReward + bonusAmount;

        // Cap at phase 3 max
        if (estimatedReward > PHASE3_MAX_PER_PHASE) {
            estimatedReward = PHASE3_MAX_PER_PHASE;
        }
        if (totalClaimed + estimatedReward > PHASE3_MAX_PER_PHASE) {
            estimatedReward = PHASE3_MAX_PER_PHASE - totalClaimed;
        }

        // Cap at global max
        uint256 globalClaimed = getTotalClaimed(_user);
        if (globalClaimed + estimatedReward > MAX_TOTAL_PER_WALLET) {
            estimatedReward = MAX_TOTAL_PER_WALLET - globalClaimed;
        }

        remainingPhase3 = PHASE3_MAX_PER_PHASE > totalClaimed
            ? PHASE3_MAX_PER_PHASE - totalClaimed
            : 0;

        // Check RON balance requirement
        uint256 ronBalance = ronToken.balanceOf(_user);

        eligible = phase3Active &&
                  !isSuspended &&
                  totalValidations >= PHASE3_MIN_VALIDATIONS &&
                  ronBalance >= PHASE3_MIN_RON_BALANCE &&
                  newValidations > 0 &&
                  estimatedReward > 0;
    }

    /**
     * @dev Get airdrop statistics
     * @return phase1Participants_ Current Phase 1 participant count
     * @return phase1Remaining Remaining Phase 1 slots
     * @return phase3TotalDistributed_ Total Phase 3 RDLN distributed
     * @return contractBalance Current RDLN balance in contract
     */
    function getAirdropStats()
        external
        view
        returns (
            uint256 phase1Participants_,
            uint256 phase1Remaining,
            uint256 phase3TotalDistributed_,
            uint256 contractBalance
        )
    {
        phase1Participants_ = phase1Participants;
        phase1Remaining = PHASE1_MAX_PARTICIPANTS > phase1Participants
            ? PHASE1_MAX_PARTICIPANTS - phase1Participants
            : 0;
        phase3TotalDistributed_ = phase3TotalDistributed;
        contractBalance = rdlnToken.balanceOf(address(this));
    }

    // =============================================================
    //                        UPGRADE AUTHORIZATION
    // =============================================================

    function _authorizeUpgrade(address newImplementation)
        internal
        view
        override
        onlyRole(UPGRADER_ROLE)
    {
        // Additional upgrade validation
        if (newImplementation == address(0)) revert UnauthorizedUpgrade();

        // Add compliance checks if needed
        // emit UpgradeAuthorized(newImplementation, msg.sender);
    }
}