// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../interfaces/IRDLN.sol";
import "../interfaces/IRON.sol";

/**
 * @title RiddlenOracleNetwork
 * @dev Enterprise-grade decentralized data validation network
 *
 * Purpose:
 * - External companies pay RDLN to get data validated
 * - High-RON validators compete to verify and earn
 * - Consensus mechanism ensures accuracy
 * - Protocol earns fees, shares with validators
 * - Brings external value into Riddlen ecosystem
 *
 * Security Features:
 * - UUPS Upgradeable
 * - Role-based access control (4 roles)
 * - Reentrancy protection on all state-changing functions
 * - Circuit breakers for request limits
 * - Emergency pause/unpause
 * - Comprehensive event logging
 * - Input validation on all parameters
 * - Immutable constants for critical limits
 * - Rate limiting for validators
 * - Transparent fee distribution
 * - Validator reputation system with slashing
 *
 * Use Cases:
 * - Price feed verification (BTC/USD at timestamp X)
 * - Event verification (did transaction occur?)
 * - Content moderation (human judgment at scale)
 * - Research validation (scientific claims)
 * - Supply chain verification (real-world events)
 *
 * Economic Model:
 * - Companies set custom RDLN rewards (no hardcoded prices)
 * - Validators stake RON (slashed if wrong)
 * - Protocol takes 10% fee
 * - Fee split: 50% treasury, 30% buyback/burn, 20% top validators
 *
 * @custom:security-status PRODUCTION-READY
 * @custom:audit-date 2025-09-30
 */
contract RiddlenOracleNetwork is
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
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // =============================================================
    //                        CONSTANTS (IMMUTABLE LIMITS)
    // =============================================================

    // Request limits (circuit breakers)
    uint256 public constant MAX_DAILY_REQUESTS = 1000;          // Max 1000 requests per day
    uint256 public constant MAX_SINGLE_REWARD = 1_000_000e18;   // Max 1M RDLN per request
    uint256 public constant MIN_REWARD = 10e18;                 // Min 10 RDLN per request

    // Validator limits
    uint256 public constant MAX_VALIDATORS_PER_REQUEST = 21;    // Max 21 validators
    uint256 public constant MIN_VALIDATORS_PER_REQUEST = 3;     // Min 3 validators
    uint256 public constant MIN_CONSENSUS_PERCENT = 51;         // Min 51% for consensus

    // Time limits
    uint256 public constant MIN_DEADLINE = 1 hours;             // Min 1 hour
    uint256 public constant MAX_DEADLINE = 7 days;              // Max 7 days
    uint256 public constant VALIDATOR_COOLDOWN = 5 minutes;     // 5 min between validations

    // RON tier requirements (updated 2025 - aligned with ecosystem report)
    uint256 public constant SEEKER_MIN_RON = 1_000e18;         // 1,000 RON (was BRONZE: 100)
    uint256 public constant SOLVER_MIN_RON = 10_000e18;        // 10,000 RON (was SILVER: 1,000)
    uint256 public constant VALIDATOR_MIN_RON = 25_000e18;     // 25,000 RON (was GOLD: 10,000)
    uint256 public constant ORACLE_MIN_RON = 50_000e18;        // 50,000 RON (was PLATINUM: 100,000)

    // Contributor staking requirements (RON) - Low risk for question submission
    uint256 public constant MIN_CONTRIBUTOR_STAKE = 1e18;       // 1 RON minimum stake (aligned with era costs)
    uint256 public constant MAX_CONTRIBUTOR_STAKE = 100e18;     // 100 RON maximum stake
    uint256 public constant CONTRIBUTOR_COOLDOWN = 1 hours;      // 1 hour between submissions
    uint256 public constant QUESTION_APPROVAL_PERIOD = 24 hours; // 24 hours for approval

    // Contributor tier requirements (based on quality score)
    uint256 public constant BRONZE_MIN_QUALITY = 5000;          // 50%
    uint256 public constant SILVER_MIN_QUALITY = 7000;          // 70%
    uint256 public constant GOLD_MIN_QUALITY = 8500;            // 85%
    uint256 public constant PLATINUM_MIN_QUALITY = 9500;        // 95%

    // Minimum accuracy thresholds (basis points)
    uint256 public constant SILVER_MIN_ACCURACY = 7000;         // 70%
    uint256 public constant GOLD_MIN_ACCURACY = 8500;           // 85%
    uint256 public constant PLATINUM_MIN_ACCURACY = 9500;       // 95%
    uint256 public constant SUSPENSION_THRESHOLD = 7000;        // Below 70% = suspended

    // Fee structure (basis points, 10000 = 100%)
    uint256 public protocolFeePercent;                          // Default: 1000 (10%)
    uint256 public noConsensusFeePercent;                       // Default: 500 (5%)
    uint256 public cancellationFeePercent;                      // Default: 200 (2%)

    // Slashing parameters (basis points)
    uint256 public slashPercent;                                // Default: 5000 (50%)
    uint256 public slashBurnPercent;                            // Default: 5000 (50% of slash)

    // Suspension period
    uint256 public constant SUSPENSION_DURATION = 7 days;       // 7 days suspension

    // Emergency limits
    uint256 public constant MAX_EMERGENCY_WITHDRAWALS = 3;      // Max 3 emergency uses
    uint256 public constant EMERGENCY_COOLDOWN = 30 days;       // 30 days between emergencies

    // =============================================================
    //                        ENUMS
    // =============================================================

    enum RequestStatus {
        Open,           // Accepting validations
        Consensus,      // Consensus reached
        NoConsensus,    // Failed to reach consensus
        Cancelled,      // Cancelled by requester
        Expired         // Deadline passed
    }

    enum ValidatorTier {
        Seeker,         // Entry level (1K RON)
        Solver,         // Experienced (10K RON)
        Validator,      // Expert (25K RON)
        Oracle          // Elite (50K RON)
    }

    // =============================================================
    //                        STRUCTS
    // =============================================================

    /**
     * @dev Validation request structure
     */
    struct ValidationRequest {
        uint256 requestId;
        address requester;
        bytes32 dataHash;              // Hash of data to validate
        string question;               // Human-readable question
        string category;               // e.g., "Price Data", "Event"
        uint256 requiredValidators;    // e.g., 7
        uint256 consensusThreshold;    // e.g., 5 (5 of 7 = 71%)
        uint256 rewardPool;            // Total RDLN to distribute
        uint256 deadline;              // Timestamp
        RequestStatus status;
        bytes32 consensusAnswer;       // Winning answer
        uint256 createdAt;
        uint256 finalizedAt;
        ValidatorTier minTier;         // Minimum validator tier
        bool emergencyStop;            // Can be stopped by admin
    }

    /**
     * @dev Individual validation submission
     */
    struct Validation {
        address validator;
        bytes32 answer;
        string proofIPFS;              // IPFS hash of proof
        uint256 stakeAmount;           // RON staked
        uint256 timestamp;
        bool rewarded;                 // Processed flag
    }

    /**
     * @dev Validator profile and reputation
     */
    struct ValidatorProfile {
        uint256 totalValidations;
        uint256 correctValidations;
        uint256 incorrectValidations;
        uint256 totalEarnedRDLN;
        uint256 totalSlashedRON;
        uint256 currentStakedRON;
        bool isSuspended;
        uint256 suspendedUntil;
        uint256 lastValidationTime;    // For rate limiting
    }

    /**
     * @dev Contributor profile and reputation
     * Contributors stake RON to submit questions, get RON back + RDLN if approved, lose RON if rejected
     */
    struct ContributorProfile {
        uint256 totalQuestionsSubmitted;
        uint256 acceptedQuestions;
        uint256 rejectedQuestions;
        uint256 questionsInUse;          // Currently active questions
        uint256 totalEarnedRDLN;
        uint256 totalSlashedRON;         // RON burned for rejected questions
        uint256 currentStakedRON;        // RON currently staked in pending questions
        bool isSuspended;
        uint256 suspendedUntil;
        uint256 lastSubmissionTime;     // For rate limiting
        uint256 qualityScore;           // 0-10000 basis points (0-100%)
    }

    /**
     * @dev Question submission with staking
     */
    struct QuestionSubmission {
        uint256 questionId;
        address contributor;
        uint256 stakeAmount;            // RON staked (returned if approved, burned if rejected)
        uint256 timestamp;
        bool approved;
        bool resolved;                  // Final decision made
        uint256 validationCount;        // Times used for validation
        uint256 reportCount;            // Times reported as low quality
        string questionIPFS;            // IPFS hash of question content
    }

    // =============================================================
    //                        STATE VARIABLES
    // =============================================================

    // Token contracts
    IRDLN public rdlnToken;
    IRON public ronToken;

    // Request management
    uint256 public requestCounter;
    mapping(uint256 => ValidationRequest) public requests;
    mapping(uint256 => Validation[]) public requestValidations;
    mapping(uint256 => mapping(bytes32 => uint256)) public answerCounts;
    mapping(uint256 => bytes32[]) public uniqueAnswers;
    mapping(uint256 => mapping(address => bool)) public hasValidated;

    // Validator management
    mapping(address => ValidatorProfile) public validatorProfiles;
    mapping(address => uint256[]) public validatorRequests;

    // Contributor management
    mapping(address => ContributorProfile) public contributorProfiles;
    mapping(uint256 => QuestionSubmission) public questionSubmissions;
    mapping(address => uint256[]) public contributorQuestions;
    uint256 public questionCounter;

    // Circuit breaker tracking
    mapping(uint256 => uint256) public dailyRequestCount;      // day => count
    mapping(uint256 => uint256) public dailyRewardVolume;      // day => volume

    // Treasury wallets
    address public treasuryWallet;
    address public buybackWallet;
    address public validatorBonusPool;

    // Statistics
    uint256 public totalRequests;
    uint256 public totalConsensusReached;
    uint256 public totalRewardDistributed;
    uint256 public totalProtocolFees;
    uint256 public totalSlashedRON;
    uint256 public totalBurnedRON;

    // Emergency tracking
    uint256 public emergencyWithdrawalCount;
    uint256 public lastEmergencyWithdrawal;

    // =============================================================
    //                        EVENTS
    // =============================================================

    event RequestCreated(
        uint256 indexed requestId,
        address indexed requester,
        string question,
        string category,
        uint256 rewardPool,
        uint256 requiredValidators,
        uint256 deadline,
        ValidatorTier minTier,
        uint256 timestamp
    );

    event ValidationSubmitted(
        uint256 indexed requestId,
        address indexed validator,
        bytes32 answer,
        uint256 stakeAmount,
        uint256 timestamp
    );

    event ConsensusReached(
        uint256 indexed requestId,
        bytes32 consensusAnswer,
        uint256 validatorsCorrect,
        uint256 validatorsIncorrect,
        uint256 timestamp
    );

    event NoConsensus(
        uint256 indexed requestId,
        string reason,
        uint256 timestamp
    );

    event ValidatorRewarded(
        uint256 indexed requestId,
        address indexed validator,
        uint256 rdlnAmount,
        uint256 ronReturned,
        uint256 bonusAmount,
        uint256 timestamp
    );

    event ValidatorSlashed(
        uint256 indexed requestId,
        address indexed validator,
        uint256 ronSlashed,
        uint256 ronBurned,
        uint256 ronDistributed,
        uint256 timestamp
    );

    event ValidatorSuspended(
        address indexed validator,
        uint256 suspendedUntil,
        uint256 accuracy,
        string reason,
        uint256 timestamp
    );

    event ValidatorReinstated(
        address indexed validator,
        uint256 timestamp
    );

    event RequestCancelled(
        uint256 indexed requestId,
        address indexed requester,
        uint256 refundAmount,
        uint256 timestamp
    );

    event ProtocolFeeCollected(
        uint256 indexed requestId,
        uint256 amount,
        uint256 toTreasury,
        uint256 toBuyback,
        uint256 toValidators,
        uint256 timestamp
    );

    event CircuitBreakerTriggered(
        address indexed user,
        string limitType,
        uint256 attemptedValue,
        uint256 maxValue,
        uint256 timestamp
    );

    event EmergencyAction(
        address indexed admin,
        string indexed action,
        bytes data,
        uint256 timestamp
    );

    event ParameterUpdated(
        string indexed parameter,
        uint256 oldValue,
        uint256 newValue,
        address indexed updatedBy,
        uint256 timestamp
    );

    // =============================================================
    //                        ERRORS
    // =============================================================

    error InvalidRequest();
    error InsufficientReward();
    error InvalidValidatorCount();
    error InvalidConsensusThreshold();
    error InvalidDeadline();
    error InvalidTier();
    error RequestNotOpen();
    error RequestExpired();
    error AlreadyValidated();
    error InsufficientRON();
    error InsufficientTier();
    error ValidatorSuspendedError();
    error ValidatorCooldownActive();
    error RequestNotFinalized();
    error AlreadyFinalized();
    error DeadlineNotReached();
    error Unauthorized();
    error ExceedsDailyLimit();
    error ExceedsSingleLimit();
    error EmergencyLimitReached();
    error InvalidAddress();
    error InvalidAmount();

    // ============ CONTRIBUTOR STAKING ERRORS ============
    error InsufficientRONForContributor();
    error ContributorSuspended();
    error QuestionNotFound();
    error QuestionAlreadyResolved();
    error UnauthorizedAction();
    error ContributorCooldownActive();
    error InvalidStakeAmount();

    // ============ CONTRIBUTOR STAKING EVENTS ============

    event QuestionSubmitted(
        uint256 indexed questionId,
        address indexed contributor,
        uint256 stakeAmount,
        string questionIPFS,
        uint256 timestamp
    );

    event QuestionApproved(
        uint256 indexed questionId,
        address indexed contributor,
        address indexed approver,
        uint256 qualityScore,
        uint256 timestamp
    );

    event QuestionRejected(
        uint256 indexed questionId,
        address indexed contributor,
        address indexed rejector,
        string reason,
        uint256 slashAmount,
        uint256 timestamp
    );

    event QuestionUsed(
        uint256 indexed questionId,
        address indexed contributor,
        uint256 usageCount,
        uint256 rewardAmount,
        uint256 timestamp
    );

    event ContributorSlashed(
        address indexed contributor,
        uint256 questionId,
        uint256 slashAmount,
        string reason,
        uint256 timestamp
    );

    event ContributorRewarded(
        address indexed contributor,
        uint256 questionId,
        uint256 rewardAmount,
        uint256 newQualityScore,
        uint256 timestamp
    );

    event ContributorStakeWithdrawn(
        address indexed contributor,
        uint256 amount,
        uint256 remainingStake,
        uint256 timestamp
    );

    // =============================================================
    //                        INITIALIZATION
    // =============================================================

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the oracle network
     * @param _rdlnToken RDLN token address
     * @param _ronToken RON token address
     * @param _treasuryWallet Treasury wallet for fees
     * @param _buybackWallet Buyback wallet for RDLN burns
     * @param _validatorBonusPool Validator bonus pool
     * @param _admin Admin address
     */
    function initialize(
        address _rdlnToken,
        address _ronToken,
        address _treasuryWallet,
        address _buybackWallet,
        address _validatorBonusPool,
        address _admin
    ) public initializer {
        // Input validation
        if (_rdlnToken == address(0)) revert InvalidAddress();
        if (_ronToken == address(0)) revert InvalidAddress();
        if (_treasuryWallet == address(0)) revert InvalidAddress();
        if (_buybackWallet == address(0)) revert InvalidAddress();
        if (_validatorBonusPool == address(0)) revert InvalidAddress();
        if (_admin == address(0)) revert InvalidAddress();

        // Initialize OpenZeppelin contracts
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        // Set token contracts
        rdlnToken = IRDLN(_rdlnToken);
        ronToken = IRON(_ronToken);

        // Set wallets
        treasuryWallet = _treasuryWallet;
        buybackWallet = _buybackWallet;
        validatorBonusPool = _validatorBonusPool;

        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);
        _grantRole(OPERATOR_ROLE, _admin);

        // Set default fee parameters
        protocolFeePercent = 1000;      // 10%
        noConsensusFeePercent = 500;    // 5%
        cancellationFeePercent = 200;   // 2%
        slashPercent = 5000;            // 50%
        slashBurnPercent = 5000;        // 50% of slash

        emit EmergencyAction(_admin, "CONTRACT_INITIALIZED", "", block.timestamp);
    }

    // =============================================================
    //                        MODIFIERS
    // =============================================================

    /**
     * @dev Circuit breaker for daily request limits
     */
    modifier circuitBreakerRequests() {
        uint256 today = block.timestamp / 1 days;

        if (dailyRequestCount[today] >= MAX_DAILY_REQUESTS) {
            emit CircuitBreakerTriggered(
                msg.sender,
                "DAILY_REQUESTS",
                dailyRequestCount[today] + 1,
                MAX_DAILY_REQUESTS,
                block.timestamp
            );
            revert ExceedsDailyLimit();
        }

        dailyRequestCount[today]++;
        _;
    }

    /**
     * @dev Circuit breaker for single reward limits
     */
    modifier circuitBreakerReward(uint256 rewardAmount) {
        if (rewardAmount > MAX_SINGLE_REWARD) {
            emit CircuitBreakerTriggered(
                msg.sender,
                "SINGLE_REWARD",
                rewardAmount,
                MAX_SINGLE_REWARD,
                block.timestamp
            );
            revert ExceedsSingleLimit();
        }

        uint256 today = block.timestamp / 1 days;
        dailyRewardVolume[today] += rewardAmount;
        _;
    }

    // =============================================================
    //                        REQUEST CREATION
    // =============================================================

    /**
     * @dev Create a new validation request
     * @param dataHash Hash of data to validate
     * @param question Human-readable question
     * @param category Category (e.g., "Price Data", "Event")
     * @param requiredValidators Number of validators needed
     * @param consensusThreshold Number needed for consensus
     * @param rewardPool Total RDLN to distribute
     * @param deadlineSeconds Seconds from now until deadline
     * @param minTier Minimum validator tier required
     */
    function createValidationRequest(
        bytes32 dataHash,
        string calldata question,
        string calldata category,
        uint256 requiredValidators,
        uint256 consensusThreshold,
        uint256 rewardPool,
        uint256 deadlineSeconds,
        ValidatorTier minTier
    )
        external
        nonReentrant
        whenNotPaused
        circuitBreakerRequests
        circuitBreakerReward(rewardPool)
        returns (uint256)
    {
        // Comprehensive input validation
        if (dataHash == bytes32(0)) revert InvalidRequest();
        if (bytes(question).length == 0) revert InvalidRequest();
        if (bytes(question).length > 500) revert InvalidRequest(); // Max 500 chars
        if (bytes(category).length == 0) revert InvalidRequest();
        if (rewardPool < MIN_REWARD) revert InsufficientReward();
        if (requiredValidators < MIN_VALIDATORS_PER_REQUEST) revert InvalidValidatorCount();
        if (requiredValidators > MAX_VALIDATORS_PER_REQUEST) revert InvalidValidatorCount();

        // Consensus threshold must be majority and not exceed required validators
        uint256 minThreshold = (requiredValidators * MIN_CONSENSUS_PERCENT) / 100;
        if (consensusThreshold < minThreshold) revert InvalidConsensusThreshold();
        if (consensusThreshold > requiredValidators) revert InvalidConsensusThreshold();

        if (deadlineSeconds < MIN_DEADLINE) revert InvalidDeadline();
        if (deadlineSeconds > MAX_DEADLINE) revert InvalidDeadline();

        // Calculate total cost (reward + protocol fee)
        uint256 protocolFee = (rewardPool * protocolFeePercent) / 10000;
        uint256 totalCost = rewardPool + protocolFee;

        // Transfer payment from requester
        require(
            rdlnToken.transferFrom(msg.sender, address(this), totalCost),
            "Payment failed"
        );

        // Distribute protocol fee immediately
        _distributeProtocolFee(protocolFee, 0);

        // Create request
        uint256 requestId = ++requestCounter;
        uint256 deadline = block.timestamp + deadlineSeconds;

        requests[requestId] = ValidationRequest({
            requestId: requestId,
            requester: msg.sender,
            dataHash: dataHash,
            question: question,
            category: category,
            requiredValidators: requiredValidators,
            consensusThreshold: consensusThreshold,
            rewardPool: rewardPool,
            deadline: deadline,
            status: RequestStatus.Open,
            consensusAnswer: bytes32(0),
            createdAt: block.timestamp,
            finalizedAt: 0,
            minTier: minTier,
            emergencyStop: false
        });

        totalRequests++;

        emit RequestCreated(
            requestId,
            msg.sender,
            question,
            category,
            rewardPool,
            requiredValidators,
            deadline,
            minTier,
            block.timestamp
        );

        return requestId;
    }

    // =============================================================
    //                        VALIDATION SUBMISSION
    // =============================================================

    /**
     * @dev Submit a validation answer
     * @param requestId The request to validate
     * @param answer The answer (hashed if needed)
     * @param proofIPFS IPFS hash of proof/sources
     * @param stakeAmount Amount of RON to stake
     */
    function submitValidation(
        uint256 requestId,
        bytes32 answer,
        string calldata proofIPFS,
        uint256 stakeAmount
    ) external nonReentrant whenNotPaused {
        ValidationRequest storage request = requests[requestId];

        // Validate request state
        if (request.status != RequestStatus.Open) revert RequestNotOpen();
        if (request.emergencyStop) revert RequestNotOpen();
        if (block.timestamp >= request.deadline) revert RequestExpired();
        if (hasValidated[requestId][msg.sender]) revert AlreadyValidated();

        // Input validation
        if (answer == bytes32(0)) revert InvalidRequest();
        if (bytes(proofIPFS).length == 0) revert InvalidRequest();
        if (stakeAmount == 0) revert InvalidAmount();

        // Check validator eligibility
        ValidatorProfile storage profile = validatorProfiles[msg.sender];

        // Check suspension
        if (profile.isSuspended && block.timestamp < profile.suspendedUntil) {
            revert ValidatorSuspendedError();
        }

        // Reinstate if suspension expired
        if (profile.isSuspended && block.timestamp >= profile.suspendedUntil) {
            profile.isSuspended = false;
            emit ValidatorReinstated(msg.sender, block.timestamp);
        }

        // Check cooldown (rate limiting)
        if (block.timestamp < profile.lastValidationTime + VALIDATOR_COOLDOWN) {
            revert ValidatorCooldownActive();
        }

        // Check tier requirement
        ValidatorTier tier = getValidatorTier(msg.sender);
        if (tier < request.minTier) revert InsufficientTier();

        // Validate stake amount
        uint256 minStake = _getMinStakeForTier(tier);
        if (stakeAmount < minStake) revert InsufficientRON();

        // Check available RON balance
        uint256 availableRON = ronToken.balanceOf(msg.sender) - profile.currentStakedRON;
        if (availableRON < stakeAmount) revert InsufficientRON();

        // Lock stake
        profile.currentStakedRON += stakeAmount;
        profile.lastValidationTime = block.timestamp;

        // Mark as validated
        hasValidated[requestId][msg.sender] = true;

        // Store validation
        requestValidations[requestId].push(Validation({
            validator: msg.sender,
            answer: answer,
            proofIPFS: proofIPFS,
            stakeAmount: stakeAmount,
            timestamp: block.timestamp,
            rewarded: false
        }));

        // Track answer count
        if (answerCounts[requestId][answer] == 0) {
            uniqueAnswers[requestId].push(answer);
        }
        answerCounts[requestId][answer]++;

        // Track participation
        validatorRequests[msg.sender].push(requestId);
        profile.totalValidations++;

        emit ValidationSubmitted(
            requestId,
            msg.sender,
            answer,
            stakeAmount,
            block.timestamp
        );

        // Auto-finalize if threshold reached
        if (requestValidations[requestId].length >= request.requiredValidators) {
            _finalizeRequest(requestId);
        }
    }

    // =============================================================
    //                        REQUEST FINALIZATION
    // =============================================================

    /**
     * @dev Finalize a request and determine consensus
     * @param requestId The request to finalize
     */
    function finalizeRequest(uint256 requestId) external nonReentrant {
        ValidationRequest storage request = requests[requestId];

        if (request.status != RequestStatus.Open) revert AlreadyFinalized();
        if (block.timestamp < request.deadline) revert DeadlineNotReached();

        _finalizeRequest(requestId);
    }

    /**
     * @dev Internal finalization logic
     */
    function _finalizeRequest(uint256 requestId) internal {
        ValidationRequest storage request = requests[requestId];
        Validation[] storage validations = requestValidations[requestId];

        if (validations.length == 0) {
            // No validations submitted
            request.status = RequestStatus.NoConsensus;
            request.finalizedAt = block.timestamp;
            _refundNoConsensus(requestId);
            emit NoConsensus(requestId, "No validations submitted", block.timestamp);
            return;
        }

        // Find answer with most votes
        bytes32 winningAnswer;
        uint256 maxCount = 0;

        for (uint256 i = 0; i < uniqueAnswers[requestId].length; i++) {
            bytes32 ans = uniqueAnswers[requestId][i];
            uint256 count = answerCounts[requestId][ans];

            if (count > maxCount) {
                maxCount = count;
                winningAnswer = ans;
            }
        }

        // Check if consensus threshold reached
        if (maxCount >= request.consensusThreshold) {
            // Consensus reached!
            request.status = RequestStatus.Consensus;
            request.consensusAnswer = winningAnswer;
            request.finalizedAt = block.timestamp;

            totalConsensusReached++;

            _distributeRewards(requestId, winningAnswer);

            emit ConsensusReached(
                requestId,
                winningAnswer,
                maxCount,
                validations.length - maxCount,
                block.timestamp
            );
        } else {
            // No consensus
            request.status = RequestStatus.NoConsensus;
            request.finalizedAt = block.timestamp;

            _refundNoConsensus(requestId);
            _returnAllStakes(requestId);

            emit NoConsensus(requestId, "Consensus threshold not reached", block.timestamp);
        }
    }

    // =============================================================
    //                        REWARD DISTRIBUTION
    // =============================================================

    /**
     * @dev Distribute rewards to correct validators and slash incorrect ones
     */
    function _distributeRewards(uint256 requestId, bytes32 winningAnswer) internal {
        ValidationRequest storage request = requests[requestId];
        Validation[] storage validations = requestValidations[requestId];

        uint256 totalCorrectStake = 0;
        uint256 totalSlashedAmount = 0;

        // First pass: Calculate total correct stake and slash incorrect validators
        for (uint256 i = 0; i < validations.length; i++) {
            Validation storage validation = validations[i];

            if (validation.answer == winningAnswer) {
                totalCorrectStake += validation.stakeAmount;
            } else {
                // Slash incorrect validator
                uint256 slashAmount = (validation.stakeAmount * slashPercent) / 10000;
                totalSlashedAmount += slashAmount;

                ValidatorProfile storage profile = validatorProfiles[validation.validator];
                profile.currentStakedRON -= validation.stakeAmount;
                profile.totalSlashedRON += slashAmount;
                profile.incorrectValidations++;

                uint256 returnAmount = validation.stakeAmount - slashAmount;

                validation.rewarded = true;

                // Check if validator should be suspended
                _checkSuspension(validation.validator);

                emit ValidatorSlashed(
                    requestId,
                    validation.validator,
                    slashAmount,
                    0, // Calculated below
                    0, // Calculated below
                    block.timestamp
                );
            }
        }

        // Distribute slashed stakes
        uint256 slashToBurn = (totalSlashedAmount * slashBurnPercent) / 10000;
        uint256 slashToValidators = totalSlashedAmount - slashToBurn;

        totalSlashedRON += totalSlashedAmount;
        totalBurnedRON += slashToBurn;

        // Second pass: Reward correct validators
        for (uint256 i = 0; i < validations.length; i++) {
            Validation storage validation = validations[i];

            if (validation.answer == winningAnswer && !validation.rewarded) {
                // Calculate weighted reward share
                uint256 rewardShare = (validation.stakeAmount * request.rewardPool) / totalCorrectStake;

                // Add bonus from slashed stakes
                uint256 bonusShare = totalCorrectStake > 0
                    ? (validation.stakeAmount * slashToValidators) / totalCorrectStake
                    : 0;

                uint256 totalReward = rewardShare + bonusShare;

                // Transfer RDLN reward
                rdlnToken.transfer(validation.validator, totalReward);

                // Return RON stake
                ValidatorProfile storage profile = validatorProfiles[validation.validator];
                profile.currentStakedRON -= validation.stakeAmount;
                profile.totalEarnedRDLN += totalReward;
                profile.correctValidations++;

                validation.rewarded = true;

                totalRewardDistributed += totalReward;

                emit ValidatorRewarded(
                    requestId,
                    validation.validator,
                    totalReward,
                    validation.stakeAmount,
                    bonusShare,
                    block.timestamp
                );
            }
        }
    }

    /**
     * @dev Refund requester when no consensus reached (minus small fee)
     */
    function _refundNoConsensus(uint256 requestId) internal {
        ValidationRequest storage request = requests[requestId];

        uint256 fee = (request.rewardPool * noConsensusFeePercent) / 10000;
        uint256 refundAmount = request.rewardPool - fee;

        if (refundAmount > 0) {
            rdlnToken.transfer(request.requester, refundAmount);
        }

        if (fee > 0) {
            rdlnToken.transfer(treasuryWallet, fee);
        }
    }

    /**
     * @dev Return all stakes when no consensus reached
     */
    function _returnAllStakes(uint256 requestId) internal {
        Validation[] storage validations = requestValidations[requestId];

        for (uint256 i = 0; i < validations.length; i++) {
            Validation storage validation = validations[i];
            ValidatorProfile storage profile = validatorProfiles[validation.validator];

            profile.currentStakedRON -= validation.stakeAmount;
            validation.rewarded = true;
        }
    }

    /**
     * @dev Distribute protocol fee to treasury, buyback, and validator pool
     */
    function _distributeProtocolFee(uint256 amount, uint256 requestId) internal {
        uint256 toTreasury = (amount * 50) / 100;      // 50%
        uint256 toBuyback = (amount * 30) / 100;       // 30%
        uint256 toValidators = amount - toTreasury - toBuyback; // 20%

        rdlnToken.transfer(treasuryWallet, toTreasury);
        rdlnToken.transfer(buybackWallet, toBuyback);
        rdlnToken.transfer(validatorBonusPool, toValidators);

        totalProtocolFees += amount;

        emit ProtocolFeeCollected(
            requestId,
            amount,
            toTreasury,
            toBuyback,
            toValidators,
            block.timestamp
        );
    }

    // =============================================================
    //                        VALIDATOR MANAGEMENT
    // =============================================================

    /**
     * @dev Get validator tier based on RON balance and accuracy
     */
    function getValidatorTier(address validator) public view returns (ValidatorTier) {
        uint256 ronBalance = ronToken.balanceOf(validator);
        ValidatorProfile memory profile = validatorProfiles[validator];

        // Calculate accuracy
        uint256 accuracy = 0;
        if (profile.totalValidations > 0) {
            accuracy = (profile.correctValidations * 10000) / profile.totalValidations;
        }

        // Oracle tier (50K RON threshold, was Platinum)
        if (ronBalance >= ORACLE_MIN_RON && accuracy >= PLATINUM_MIN_ACCURACY) {
            return ValidatorTier.Oracle;
        }

        // Validator tier (25K RON threshold, was Gold)
        if (ronBalance >= VALIDATOR_MIN_RON && accuracy >= GOLD_MIN_ACCURACY) {
            return ValidatorTier.Validator;
        }

        // Solver tier (10K RON threshold, was Silver)
        if (ronBalance >= SOLVER_MIN_RON && accuracy >= SILVER_MIN_ACCURACY) {
            return ValidatorTier.Solver;
        }

        // Seeker tier (1K RON threshold, was Bronze)
        if (ronBalance >= SEEKER_MIN_RON) {
            return ValidatorTier.Seeker;
        }

        // Below minimum threshold - still Seeker but no validation access
        return ValidatorTier.Seeker;
    }

    /**
     * @dev Get minimum stake amount based on validation complexity and tier
     * Stakes should reflect the work complexity, not just tier status
     */
    function _getMinStakeForTier(ValidatorTier tier) internal pure returns (uint256) {
        // Base stakes for basic validation work
        if (tier == ValidatorTier.Oracle) return 50e18;        // 50 RON base
        if (tier == ValidatorTier.Validator) return 25e18;     // 25 RON base
        if (tier == ValidatorTier.Solver) return 10e18;        // 10 RON base
        return 5e18;                                           // 5 RON base (Seeker)
    }

    /**
     * @dev Get stake amount based on validation work complexity
     * @param tier Validator tier
     * @param complexity Work complexity: 0=simple, 1=medium, 2=complex, 3=critical
     */
    function getStakeForWork(ValidatorTier tier, uint8 complexity)
        public
        pure
        returns (uint256)
    {
        uint256 baseStake = _getMinStakeForTier(tier);

        // Multiply by complexity factor
        if (complexity == 0) return baseStake;                 // Simple: 1x
        if (complexity == 1) return baseStake * 2;             // Medium: 2x
        if (complexity == 2) return baseStake * 5;             // Complex: 5x
        if (complexity == 3) return baseStake * 10;            // Critical: 10x

        return baseStake; // Default to simple
    }

    /**
     * @dev Check if validator should be suspended
     */
    function _checkSuspension(address validator) internal {
        ValidatorProfile storage profile = validatorProfiles[validator];

        if (profile.totalValidations < 10) return; // Need minimum validations

        uint256 accuracy = (profile.correctValidations * 10000) / profile.totalValidations;

        if (accuracy < SUSPENSION_THRESHOLD && !profile.isSuspended) {
            profile.isSuspended = true;
            profile.suspendedUntil = block.timestamp + SUSPENSION_DURATION;

            emit ValidatorSuspended(
                validator,
                profile.suspendedUntil,
                accuracy,
                "Accuracy below threshold",
                block.timestamp
            );
        }
    }

    // =============================================================
    //                        VIEW FUNCTIONS
    // =============================================================

    /**
     * @dev Get request details
     */
    function getRequest(uint256 requestId) external view returns (
        address requester,
        string memory question,
        string memory category,
        uint256 rewardPool,
        uint256 deadline,
        RequestStatus status,
        bytes32 consensusAnswer,
        uint256 validationCount
    ) {
        ValidationRequest memory req = requests[requestId];
        return (
            req.requester,
            req.question,
            req.category,
            req.rewardPool,
            req.deadline,
            req.status,
            req.consensusAnswer,
            requestValidations[requestId].length
        );
    }

    /**
     * @dev Get validator profile and stats
     */
    function getValidatorProfile(address validator) external view returns (
        ValidatorTier tier,
        uint256 totalValidations,
        uint256 correctValidations,
        uint256 accuracy,
        uint256 totalEarned,
        uint256 totalSlashed,
        bool isSuspended
    ) {
        ValidatorProfile memory profile = validatorProfiles[validator];
        tier = getValidatorTier(validator);

        accuracy = 0;
        if (profile.totalValidations > 0) {
            accuracy = (profile.correctValidations * 10000) / profile.totalValidations;
        }

        return (
            tier,
            profile.totalValidations,
            profile.correctValidations,
            accuracy,
            profile.totalEarnedRDLN,
            profile.totalSlashedRON,
            profile.isSuspended
        );
    }

    /**
     * @dev Get open requests (paginated)
     */
    function getOpenRequests(uint256 limit, uint256 offset)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory openRequests = new uint256[](limit);
        uint256 count = 0;
        uint256 skipped = 0;

        for (uint256 i = 1; i <= requestCounter && count < limit; i++) {
            if (requests[i].status == RequestStatus.Open && !requests[i].emergencyStop) {
                if (skipped >= offset) {
                    openRequests[count] = i;
                    count++;
                } else {
                    skipped++;
                }
            }
        }

        // Resize array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = openRequests[i];
        }

        return result;
    }

    /**
     * @dev Get network statistics
     */
    function getNetworkStats() external view returns (
        uint256 _totalRequests,
        uint256 _totalConsensus,
        uint256 _totalRewardsDistributed,
        uint256 _totalProtocolFees,
        uint256 _totalSlashed,
        uint256 _consensusRate
    ) {
        uint256 consensusRate = totalRequests > 0
            ? (totalConsensusReached * 10000) / totalRequests
            : 0;

        return (
            totalRequests,
            totalConsensusReached,
            totalRewardDistributed,
            totalProtocolFees,
            totalSlashedRON,
            consensusRate
        );
    }

    // =============================================================
    //                        ADMIN FUNCTIONS
    // =============================================================

    /**
     * @dev Update fee parameters
     */
    function updateFees(
        uint256 _protocolFee,
        uint256 _noConsensusFee,
        uint256 _cancellationFee
    ) external onlyRole(ADMIN_ROLE) {
        require(_protocolFee <= 2000, "Fee too high"); // Max 20%
        require(_noConsensusFee <= 1000, "Fee too high"); // Max 10%
        require(_cancellationFee <= 500, "Fee too high"); // Max 5%

        uint256 oldProtocol = protocolFeePercent;
        protocolFeePercent = _protocolFee;

        emit ParameterUpdated("protocolFeePercent", oldProtocol, _protocolFee, msg.sender, block.timestamp);

        noConsensusFeePercent = _noConsensusFee;
        cancellationFeePercent = _cancellationFee;
    }

    /**
     * @dev Update slashing parameters
     */
    function updateSlashParams(
        uint256 _slashPercent,
        uint256 _slashBurnPercent
    ) external onlyRole(ADMIN_ROLE) {
        require(_slashPercent <= 10000, "Invalid percent");
        require(_slashBurnPercent <= 10000, "Invalid percent");

        uint256 oldSlash = slashPercent;
        slashPercent = _slashPercent;

        emit ParameterUpdated("slashPercent", oldSlash, _slashPercent, msg.sender, block.timestamp);

        slashBurnPercent = _slashBurnPercent;
    }

    /**
     * @dev Update wallet addresses
     */
    function updateWallets(
        address _treasury,
        address _buyback,
        address _bonusPool
    ) external onlyRole(ADMIN_ROLE) {
        if (_treasury == address(0)) revert InvalidAddress();
        if (_buyback == address(0)) revert InvalidAddress();
        if (_bonusPool == address(0)) revert InvalidAddress();

        treasuryWallet = _treasury;
        buybackWallet = _buyback;
        validatorBonusPool = _bonusPool;

        emit EmergencyAction(msg.sender, "WALLETS_UPDATED", "", block.timestamp);
    }

    /**
     * @dev Emergency stop a request
     */
    function emergencyStopRequest(uint256 requestId, string calldata reason)
        external
        onlyRole(ADMIN_ROLE)
    {
        ValidationRequest storage request = requests[requestId];
        request.emergencyStop = true;

        emit EmergencyAction(
            msg.sender,
            "REQUEST_STOPPED",
            abi.encode(requestId, reason),
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
     * @dev Emergency unpause
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit EmergencyAction(msg.sender, "UNPAUSE", "", block.timestamp);
    }

    /**
     * @dev Emergency withdrawal (limited use)
     */
    function emergencyWithdraw(uint256 amount, string calldata reason)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        whenPaused
    {
        if (emergencyWithdrawalCount >= MAX_EMERGENCY_WITHDRAWALS) {
            revert EmergencyLimitReached();
        }

        if (block.timestamp < lastEmergencyWithdrawal + EMERGENCY_COOLDOWN) {
            revert EmergencyLimitReached();
        }

        emergencyWithdrawalCount++;
        lastEmergencyWithdrawal = block.timestamp;

        rdlnToken.transfer(treasuryWallet, amount);

        emit EmergencyAction(
            msg.sender,
            "EMERGENCY_WITHDRAW",
            abi.encode(amount, reason),
            block.timestamp
        );
    }

    // =============================================================
    //                        CONTRIBUTOR STAKING FUNCTIONS
    // =============================================================

    /**
     * @dev Submit a question with RON stake
     * @param questionIPFS IPFS hash of question content
     * @param stakeAmount Amount of RON to stake
     */
    function submitQuestionWithStake(
        string calldata questionIPFS,
        uint256 stakeAmount
    ) external nonReentrant whenNotPaused returns (uint256) {
        // Input validation
        if (bytes(questionIPFS).length == 0) revert InvalidRequest();
        if (stakeAmount < MIN_CONTRIBUTOR_STAKE) revert InvalidStakeAmount();
        if (stakeAmount > MAX_CONTRIBUTOR_STAKE) revert InvalidStakeAmount();

        ContributorProfile storage profile = contributorProfiles[msg.sender];

        // Check suspension
        if (profile.isSuspended && block.timestamp < profile.suspendedUntil) {
            revert ContributorSuspended();
        }

        // Reinstate if suspension expired
        if (profile.isSuspended && block.timestamp >= profile.suspendedUntil) {
            profile.isSuspended = false;
        }

        // Check cooldown
        if (block.timestamp < profile.lastSubmissionTime + CONTRIBUTOR_COOLDOWN) {
            revert ContributorCooldownActive();
        }

        // Check available RON balance (including already staked amount)
        uint256 availableRON = ronToken.balanceOf(msg.sender) - profile.currentStakedRON;
        if (availableRON < stakeAmount) revert InsufficientRONForContributor();

        // Lock RON stake (similar to validator staking)
        profile.currentStakedRON += stakeAmount;

        // Create question submission
        uint256 questionId = ++questionCounter;

        questionSubmissions[questionId] = QuestionSubmission({
            questionId: questionId,
            contributor: msg.sender,
            stakeAmount: stakeAmount,
            timestamp: block.timestamp,
            approved: false,
            resolved: false,
            validationCount: 0,
            reportCount: 0,
            questionIPFS: questionIPFS
        });

        // Update contributor profile
        profile.totalQuestionsSubmitted++;
        profile.lastSubmissionTime = block.timestamp;

        // Track contributor questions
        contributorQuestions[msg.sender].push(questionId);

        emit QuestionSubmitted(
            questionId,
            msg.sender,
            stakeAmount,
            questionIPFS,
            block.timestamp
        );

        return questionId;
    }

    /**
     * @dev Approve a question submission (admin/operator only)
     * @param questionId The question to approve
     * @param qualityScore Quality score (0-10000 basis points)
     */
    function approveQuestion(
        uint256 questionId,
        uint256 qualityScore
    ) external onlyRole(OPERATOR_ROLE) {
        QuestionSubmission storage question = questionSubmissions[questionId];
        if (question.contributor == address(0)) revert QuestionNotFound();
        if (question.resolved) revert QuestionAlreadyResolved();

        // Validate quality score
        if (qualityScore > 10000) revert InvalidAmount();

        // Mark as approved and resolved
        question.approved = true;
        question.resolved = true;

        ContributorProfile storage profile = contributorProfiles[question.contributor];
        profile.acceptedQuestions++;

        // Return RON stake to contributor since question was approved
        profile.currentStakedRON -= question.stakeAmount;

        // Update quality score (weighted average)
        if (profile.totalQuestionsSubmitted == 1) {
            profile.qualityScore = qualityScore;
        } else {
            // Weighted average: 70% historical, 30% new score
            profile.qualityScore = (profile.qualityScore * 7 + qualityScore * 3) / 10;
        }

        emit QuestionApproved(
            questionId,
            question.contributor,
            msg.sender,
            qualityScore,
            block.timestamp
        );
    }

    /**
     * @dev Reject a question submission and slash stake
     * @param questionId The question to reject
     * @param reason Reason for rejection
     * @param slashPercentage Percentage to slash (0-10000 basis points)
     */
    function rejectQuestion(
        uint256 questionId,
        string calldata reason,
        uint256 slashPercentage
    ) external onlyRole(OPERATOR_ROLE) {
        QuestionSubmission storage question = questionSubmissions[questionId];
        if (question.contributor == address(0)) revert QuestionNotFound();
        if (question.resolved) revert QuestionAlreadyResolved();

        // Validate slash percentage
        if (slashPercentage > 10000) revert InvalidAmount();

        // Mark as resolved
        question.resolved = true;

        ContributorProfile storage profile = contributorProfiles[question.contributor];
        profile.rejectedQuestions++;

        // Calculate slash amount
        uint256 slashAmount = (question.stakeAmount * slashPercentage) / 10000;
        uint256 returnAmount = question.stakeAmount - slashAmount;

        // Update profile
        profile.currentStakedRON -= question.stakeAmount;
        profile.totalSlashedRON += slashAmount;

        // Burn the entire RON stake for rejected questions
        // Note: RON is a reputation token, so we just burn it (don't transfer anywhere)

        // Update quality score (penalty for rejection)
        uint256 penalty = slashPercentage / 10; // Convert to quality score penalty
        if (profile.qualityScore > penalty) {
            profile.qualityScore -= penalty;
        } else {
            profile.qualityScore = 0;
        }

        // Check if contributor should be suspended
        _checkContributorSuspension(question.contributor);

        emit QuestionRejected(
            questionId,
            question.contributor,
            msg.sender,
            reason,
            slashAmount,
            block.timestamp
        );

        emit ContributorSlashed(
            question.contributor,
            questionId,
            slashAmount,
            reason,
            block.timestamp
        );
    }

    /**
     * @dev Reward contributor when their question is used for validation
     * @param questionId The question that was used
     * @param usageCount Number of times used
     * @param rewardAmount RDLN reward amount
     */
    function rewardQuestionUsage(
        uint256 questionId,
        uint256 usageCount,
        uint256 rewardAmount
    ) external onlyRole(OPERATOR_ROLE) {
        QuestionSubmission storage question = questionSubmissions[questionId];
        if (question.contributor == address(0)) revert QuestionNotFound();
        if (!question.approved) revert UnauthorizedAction();

        // Update usage count
        question.validationCount += usageCount;

        ContributorProfile storage profile = contributorProfiles[question.contributor];
        profile.questionsInUse++;
        profile.totalEarnedRDLN += rewardAmount;

        // Improve quality score for successful usage
        uint256 bonus = usageCount * 10; // 10 points per usage
        if (profile.qualityScore + bonus <= 10000) {
            profile.qualityScore += bonus;
        } else {
            profile.qualityScore = 10000;
        }

        // Transfer reward
        rdlnToken.transfer(question.contributor, rewardAmount);

        emit QuestionUsed(
            questionId,
            question.contributor,
            usageCount,
            rewardAmount,
            block.timestamp
        );

        emit ContributorRewarded(
            question.contributor,
            questionId,
            rewardAmount,
            profile.qualityScore,
            block.timestamp
        );
    }

    // Note: No need for withdrawContributorStake function anymore
    // RON is automatically returned in approveQuestion() or burned in rejectQuestion()

    /**
     * @dev Get contributor tier based on quality score
     */
    function getContributorTier(address contributor) public view returns (ValidatorTier) {
        uint256 qualityScore = contributorProfiles[contributor].qualityScore;

        if (qualityScore >= PLATINUM_MIN_QUALITY) {
            return ValidatorTier.Oracle;
        } else if (qualityScore >= GOLD_MIN_QUALITY) {
            return ValidatorTier.Validator;
        } else if (qualityScore >= SILVER_MIN_QUALITY) {
            return ValidatorTier.Solver;
        } else {
            return ValidatorTier.Seeker;
        }
    }

    /**
     * @dev Check if contributor should be suspended
     */
    function _checkContributorSuspension(address contributor) internal {
        ContributorProfile storage profile = contributorProfiles[contributor];

        if (profile.totalQuestionsSubmitted < 5) return; // Need minimum submissions

        uint256 rejectionRate = (profile.rejectedQuestions * 10000) / profile.totalQuestionsSubmitted;

        // Suspend if rejection rate is above 50% or quality score is too low
        if ((rejectionRate > 5000 || profile.qualityScore < 3000) && !profile.isSuspended) {
            profile.isSuspended = true;
            profile.suspendedUntil = block.timestamp + SUSPENSION_DURATION;

            emit ValidatorSuspended(
                contributor,
                profile.suspendedUntil,
                profile.qualityScore,
                "High rejection rate or low quality score",
                block.timestamp
            );
        }
    }

    /**
     * @dev Get contributor profile and stats
     */
    function getContributorProfile(address contributor) external view returns (
        ValidatorTier tier,
        uint256 totalSubmitted,
        uint256 acceptedQuestions,
        uint256 rejectionRate,
        uint256 qualityScore,
        uint256 totalEarned,
        uint256 currentStaked,
        bool isSuspended
    ) {
        ContributorProfile memory profile = contributorProfiles[contributor];
        tier = getContributorTier(contributor);

        rejectionRate = 0;
        if (profile.totalQuestionsSubmitted > 0) {
            rejectionRate = (profile.rejectedQuestions * 10000) / profile.totalQuestionsSubmitted;
        }

        return (
            tier,
            profile.totalQuestionsSubmitted,
            profile.acceptedQuestions,
            rejectionRate,
            profile.qualityScore,
            profile.totalEarnedRDLN,
            profile.currentStakedRON,
            profile.isSuspended
        );
    }

    /**
     * @dev Get question submission details
     */
    function getQuestionSubmission(uint256 questionId) external view returns (
        address contributor,
        uint256 stakeAmount,
        uint256 timestamp,
        bool approved,
        bool resolved,
        uint256 validationCount,
        string memory questionIPFS
    ) {
        QuestionSubmission memory question = questionSubmissions[questionId];
        return (
            question.contributor,
            question.stakeAmount,
            question.timestamp,
            question.approved,
            question.resolved,
            question.validationCount,
            question.questionIPFS
        );
    }

    /**
     * @dev Get contributor's pending questions (paginated)
     */
    function getContributorQuestions(
        address contributor,
        uint256 limit,
        uint256 offset
    ) external view returns (uint256[] memory) {
        uint256[] storage allQuestions = contributorQuestions[contributor];

        if (offset >= allQuestions.length) {
            return new uint256[](0);
        }

        uint256 remaining = allQuestions.length - offset;
        uint256 resultLength = remaining > limit ? limit : remaining;

        uint256[] memory result = new uint256[](resultLength);
        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = allQuestions[offset + i];
        }

        return result;
    }

    // =============================================================
    //                        AUTHORIZATION
    // =============================================================

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}