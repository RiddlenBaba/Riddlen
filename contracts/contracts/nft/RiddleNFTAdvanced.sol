// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../interfaces/IRDLN.sol";
import "../interfaces/IRON.sol";

/**
 * @title RiddleNFTAdvanced - Revolutionary NFT-as-Game System
 * @dev Advanced implementation based on 2025 NFT System Guide
 * @notice Revolutionary approach: NFTs as interactive game sessions, not static collectibles
 *
 * Key Innovations from Guide:
 * - NFT-as-Game: Interactive experiences rather than static collectibles
 * - Achievement-Based Ownership: Must demonstrate skill to earn NFTs
 * - Randomized Economics: Each riddle creates unique market dynamics
 * - Oracle Integration: Gaming platform evolves into professional validation network
 *
 * NFT Components:
 * ├── Game Access Token (entry to riddle session)
 * ├── Prize Distribution Mechanism (randomized reward pools)
 * ├── Achievement Certificate (proof of successful solving)
 * └── Collectible Asset (secondary market trading)
 *
 * Revolutionary Aspects:
 * "The future of NFTs is not just ownership—it's achievement, intelligence, and utility combined"
 */
contract RiddleNFTAdvanced is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    // ============ CONSTANTS ============

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant GAME_MASTER_ROLE = keccak256("GAME_MASTER_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant QUESTION_VALIDATOR_ROLE = keccak256("QUESTION_VALIDATOR_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // Randomized Parameter Ranges (from guide)
    uint256 public constant MIN_MAX_MINTS = 10;
    uint256 public constant MAX_MAX_MINTS = 1000;
    uint256 public constant MIN_PRIZE_POOL = 100000 * 10**18; // 100K RDLN
    uint256 public constant MAX_PRIZE_POOL = 10000000 * 10**18; // 10M RDLN
    uint256 public constant MIN_WINNER_SLOTS = 1;
    uint256 public constant MAX_WINNER_SLOTS = 100;

    // Progressive Economics (Biennial Halving)
    uint256 public constant INITIAL_MINT_COST = 1000 * 10**18; // 1000 RDLN
    uint256 public constant HALVING_PERIOD = 730 days; // 2 years
    uint256 public constant MIN_MINT_COST = 15 * 10**17; // 1.5 RDLN (minimum)

    // Anti-Cheating Constants
    uint256 public constant MIN_SOLVE_TIME = 30; // 30 seconds minimum
    uint256 public constant MAX_ATTEMPTS_PER_SESSION = 10;
    uint256 public constant SUSPICIOUS_ACTIVITY_THRESHOLD = 5;

    // Question System
    uint256 public constant MAX_QUESTIONS_PER_RIDDLE = 5;
    uint256 public constant MIN_VALIDATORS_PER_QUESTION = 3;
    uint256 public constant VALIDATION_CONSENSUS_THRESHOLD = 67; // 67%

    // ============ ENUMS ============

    enum RiddleState {
        INACTIVE,     // Not yet started
        ACTIVE,       // Currently accepting participants
        IN_PROGRESS,  // Game session running
        COMPLETED,    // Finished, rewards distributed
        EMERGENCY_STOPPED // Emergency pause
    }

    enum QuestionType {
        MULTIPLE_CHOICE,
        FILL_BLANK,
        IMAGE_RECOGNITION,
        LOGIC_PUZZLE,
        MATHEMATICAL
    }

    enum RiddleDifficulty {
        EASY,         // 10-25 RON reward
        MEDIUM,       // 50-100 RON reward
        HARD,         // 200-500 RON reward
        LEGENDARY     // 1,000-10,000 RON reward
    }

    enum ParticipantStatus {
        NOT_PARTICIPATING,
        MINTED_ACCESS,
        IN_PROGRESS,
        FAILED,
        COMPLETED_SUCCESS,
        COMPLETED_FAILURE
    }

    // ============ ADVANCED STRUCTS ============

    /**
     * @dev Revolutionary NFT-as-Game session structure
     * Each riddle is a unique game with randomized parameters
     */
    struct RiddleSession {
        // Core Parameters (randomized)
        uint256 maxMints;          // 10-1,000 copies available
        uint256 prizePool;         // 100K-10M RDLN total rewards
        uint256 winnerSlots;       // 1-100 potential winners
        uint256 currentMintCost;   // Biennial halving schedule

        // Game State
        RiddleState state;
        RiddleDifficulty difficulty;
        uint256 startTime;
        uint256 endTime;
        uint256 sessionDuration;   // Time limit for solving

        // Progress Tracking
        uint256 totalMinted;
        uint256 totalCompleted;
        uint256 successfulSolvers;
        address[] winners;
        mapping(address => ParticipantStatus) participants;

        // Question System
        uint256[] questionIds;
        bytes32[] correctAnswerHashes;
        mapping(address => bytes32[]) submittedAnswers;
        mapping(address => uint256) attemptCounts;
        mapping(address => uint256) startTimes;

        // Economics
        uint256 totalPrizesDistributed;
        uint256 totalBurned;
        bool prizesDistributed;

        // Metadata
        string title;
        string description;
        string category;
        string ipfsMetadata;
    }

    /**
     * @dev Question structure for decentralized content creation
     */
    struct Question {
        uint256 id;
        address creator;
        string content;
        QuestionType questionType;
        bytes32 correctAnswerHash;
        string[] options; // For multiple choice
        RiddleDifficulty difficulty;

        // Validation
        bool validated;
        uint256 validatorCount;
        mapping(address => bool) validatedBy;
        uint256 positiveVotes;
        uint256 negativeVotes;

        // Usage & Rewards
        uint256 timesUsed;
        uint256 creatorEarnings;
        bool active;
    }

    /**
     * @dev Participant data with anti-cheating measures
     */
    struct ParticipantData {
        address user;
        uint256 sessionId;
        uint256 tokenId;
        uint256 startTime;
        uint256 completionTime;
        uint256 attemptCount;
        bytes32[] answerHashes;
        bool completed;
        bool successful;
        uint256 prizeAmount;
        bool prizeClaimed;

        // Anti-cheating
        bytes32 deviceFingerprint;
        uint256 ipAddressHash;
        uint256[] solveTimes;
        uint256 suspiciousActivityScore;
    }

    /**
     * @dev NFT Achievement metadata
     */
    struct NFTMetadata {
        uint256 sessionId;
        address originalMinter;
        uint256 mintTimestamp;
        uint256 solveTime;
        RiddleDifficulty difficulty;
        string category;
        uint256 prizeWon;
        bool wasFirstSolver;
        bool wasSpeedSolver;
        uint256 finalRanking;
        string achievementLevel; // "Legendary", "Elite", "Standard"
    }

    // ============ STATE VARIABLES ============

    // Core contracts
    IRDLN public rdlnToken;
    IRON public ronToken;

    // Session management
    mapping(uint256 => RiddleSession) public riddleSessions;
    mapping(uint256 => Question) public questions;
    mapping(uint256 => ParticipantData) public participantData;
    mapping(uint256 => NFTMetadata) public nftMetadata;

    uint256 public currentSessionId;
    uint256 public currentQuestionId;
    uint256 public deploymentTime;

    // Economics
    address public treasuryWallet;
    address public devOpsWallet;
    address public grandPrizeWallet;
    uint256 public totalPrizePool;
    uint256 public totalBurned;

    // Anti-cheating
    mapping(address => uint256) public userSessions;
    mapping(bytes32 => bool) public knownDeviceFingerprints;
    mapping(address => uint256) public suspiciousActivityScores;
    mapping(address => uint256) public lastActivityTime;

    // Question validation
    mapping(uint256 => address[]) public questionValidators;
    mapping(address => uint256) public questionSubmissionCosts;

    // Randomization seed
    uint256 private randomNonce;

    // Configuration
    uint256 public targetSolveRate; // Target 15-25% success rate
    bool public emergencyMode;

    // Storage gap for upgradeability
    uint256[50] private __gap;

    // ============ EVENTS ============

    event RiddleSessionCreated(
        uint256 indexed sessionId,
        uint256 maxMints,
        uint256 prizePool,
        uint256 winnerSlots,
        RiddleDifficulty difficulty,
        string category
    );

    event RiddleSessionStarted(
        uint256 indexed sessionId,
        uint256 startTime,
        uint256 endTime
    );

    event RiddleAccessMinted(
        uint256 indexed sessionId,
        uint256 indexed tokenId,
        address indexed participant,
        uint256 mintCost
    );

    event RiddleAttemptSubmitted(
        uint256 indexed sessionId,
        address indexed participant,
        uint256 attemptNumber,
        uint256 timeRemaining
    );

    event RiddleCompleted(
        uint256 indexed sessionId,
        address indexed solver,
        uint256 solveTime,
        uint256 prizeAmount,
        bool wasFirstSolver
    );

    event QuestionSubmitted(
        uint256 indexed questionId,
        address indexed creator,
        RiddleDifficulty difficulty,
        uint256 submissionCost
    );

    event QuestionValidated(
        uint256 indexed questionId,
        address indexed validator,
        bool approved,
        uint256 totalValidators
    );

    event SuspiciousActivityDetected(
        address indexed user,
        uint256 sessionId,
        string reason,
        uint256 riskScore
    );

    event PrizeDistributed(
        uint256 indexed sessionId,
        address indexed winner,
        uint256 amount,
        uint256 totalWinners
    );

    event NFTAchievementMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        uint256 sessionId,
        string achievementLevel
    );

    event ParametersRandomized(
        uint256 indexed sessionId,
        uint256 maxMints,
        uint256 prizePool,
        uint256 winnerSlots,
        bytes32 randomSeed
    );

    event DifficultyAdjusted(
        uint256 oldTargetRate,
        uint256 newTargetRate,
        uint256 recentSolveRate
    );

    event EmergencyModeToggled(
        bool enabled,
        address indexed admin,
        string reason
    );

    event BurnDistribution(
        uint256 totalAmount,
        uint256 burnAmount,
        uint256 grandPrizeAmount,
        uint256 devOpsAmount
    );

    // ============ MODIFIERS ============

    modifier onlyActiveSession(uint256 sessionId) {
        require(riddleSessions[sessionId].state == RiddleState.ACTIVE, "Session not active");
        _;
    }

    modifier onlyParticipant(uint256 sessionId) {
        require(
            riddleSessions[sessionId].participants[msg.sender] != ParticipantStatus.NOT_PARTICIPATING,
            "Not a participant"
        );
        _;
    }

    modifier antiCheat(uint256 sessionId) {
        _checkAntiCheat(msg.sender, sessionId);
        _;
    }

    modifier notEmergencyMode() {
        require(!emergencyMode, "Emergency mode active");
        _;
    }

    // ============ INITIALIZATION ============

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _admin,
        address _rdlnToken,
        address _ronToken,
        address _treasuryWallet,
        address _devOpsWallet,
        address _grandPrizeWallet
    ) public initializer {
        __ERC721_init("Riddlen Achievement NFT", "RIDDLE");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        // Grant roles
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);

        // Initialize contracts
        rdlnToken = IRDLN(_rdlnToken);
        ronToken = IRON(_ronToken);

        // Initialize wallets
        treasuryWallet = _treasuryWallet;
        devOpsWallet = _devOpsWallet;
        grandPrizeWallet = _grandPrizeWallet;

        // Initialize parameters
        deploymentTime = block.timestamp;
        currentSessionId = 1;
        currentQuestionId = 1;
        targetSolveRate = 20; // 20% target solve rate
        totalPrizePool = MIN_PRIZE_POOL * 100; // Initial allocation

        randomNonce = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, _admin)));
    }

    // ============ REVOLUTIONARY NFT-AS-GAME SYSTEM ============

    /**
     * @dev Create a new riddle session with randomized parameters
     * Implementation of revolutionary NFT-as-Game concept
     */
    function createRiddleSession(
        string calldata title,
        string calldata description,
        string calldata category,
        RiddleDifficulty difficulty,
        uint256[] calldata questionIds,
        uint256 sessionDuration
    ) external onlyRole(GAME_MASTER_ROLE) notEmergencyMode returns (uint256) {
        uint256 sessionId = currentSessionId++;

        // Generate randomized parameters
        (uint256 maxMints, uint256 prizePool, uint256 winnerSlots) = _generateRandomizedParameters(difficulty);

        RiddleSession storage session = riddleSessions[sessionId];
        session.maxMints = maxMints;
        session.prizePool = prizePool;
        session.winnerSlots = winnerSlots;
        session.currentMintCost = getCurrentMintCost();
        session.state = RiddleState.INACTIVE;
        session.difficulty = difficulty;
        session.sessionDuration = sessionDuration;
        session.questionIds = questionIds;
        session.title = title;
        session.description = description;
        session.category = category;

        // Validate questions
        require(questionIds.length <= MAX_QUESTIONS_PER_RIDDLE, "Too many questions");
        for (uint256 i = 0; i < questionIds.length; i++) {
            require(questions[questionIds[i]].validated, "Question not validated");
            require(questions[questionIds[i]].difficulty == difficulty, "Question difficulty mismatch");
        }

        emit RiddleSessionCreated(sessionId, maxMints, prizePool, winnerSlots, difficulty, category);
        emit ParametersRandomized(sessionId, maxMints, prizePool, winnerSlots, bytes32(randomNonce));

        return sessionId;
    }

    /**
     * @dev Start a riddle session for participant access
     */
    function startRiddleSession(uint256 sessionId) external onlyRole(GAME_MASTER_ROLE) {
        RiddleSession storage session = riddleSessions[sessionId];
        require(session.state == RiddleState.INACTIVE, "Session already started");

        session.state = RiddleState.ACTIVE;
        session.startTime = block.timestamp;

        emit RiddleSessionStarted(sessionId, session.startTime, session.endTime);
    }

    /**
     * @dev Mint NFT game access token (Revolutionary: NFT grants game access, not just ownership)
     */
    function mintRiddleAccess(uint256 sessionId)
        external
        payable
        nonReentrant
        onlyActiveSession(sessionId)
        antiCheat(sessionId)
        notEmergencyMode
        returns (uint256)
    {
        RiddleSession storage session = riddleSessions[sessionId];

        require(session.totalMinted < session.maxMints, "Max mints reached");
        require(session.participants[msg.sender] == ParticipantStatus.NOT_PARTICIPATING, "Already participating");

        // Check RON access requirements
        IRON.AccessTier userTier = ronToken.getUserTier(msg.sender);
        require(_hasAccessToRiddle(userTier, session.difficulty), "Insufficient access tier");

        // Process payment
        uint256 mintCost = session.currentMintCost;
        require(rdlnToken.transferFrom(msg.sender, address(this), mintCost), "Payment failed");

        // Distribute mint cost according to burn protocol
        _distributeMintCost(mintCost);

        // Mint access NFT
        uint256 tokenId = _mintAccessToken(sessionId, msg.sender);

        // Update session state
        session.totalMinted++;
        session.participants[msg.sender] = ParticipantStatus.MINTED_ACCESS;

        // Initialize participant data
        ParticipantData storage participant = participantData[tokenId];
        participant.user = msg.sender;
        participant.sessionId = sessionId;
        participant.tokenId = tokenId;
        participant.startTime = block.timestamp;
        participant.deviceFingerprint = _generateDeviceFingerprint(msg.sender);

        emit RiddleAccessMinted(sessionId, tokenId, msg.sender, mintCost);

        return tokenId;
    }

    /**
     * @dev Submit answer attempt (Core game interaction)
     */
    function submitAnswer(
        uint256 sessionId,
        uint256 questionIndex,
        bytes32 answerHash
    ) external onlyParticipant(sessionId) antiCheat(sessionId) {
        RiddleSession storage session = riddleSessions[sessionId];
        require(session.state == RiddleState.ACTIVE || session.state == RiddleState.IN_PROGRESS, "Invalid session state");

        ParticipantData storage participant = participantData[_getTokenIdForUser(sessionId, msg.sender)];
        require(!participant.completed, "Already completed");
        require(participant.attemptCount < MAX_ATTEMPTS_PER_SESSION, "Max attempts reached");
        require(questionIndex < session.questionIds.length, "Invalid question index");

        // Time validation
        uint256 timeElapsed = block.timestamp - participant.startTime;
        require(timeElapsed >= MIN_SOLVE_TIME, "Minimum solve time not met");
        require(timeElapsed <= session.sessionDuration, "Session time expired");

        // Record attempt
        participant.attemptCount++;
        participant.answerHashes.push(answerHash);
        participant.solveTimes.push(timeElapsed);

        // Check if answer is correct
        bool isCorrect = (answerHash == session.correctAnswerHashes[questionIndex]);

        if (isCorrect) {
            // Advance to next question or complete if all answered
            if (questionIndex == session.questionIds.length - 1) {
                _completeRiddle(sessionId, msg.sender, timeElapsed);
            }
        } else {
            // Apply burn penalty for incorrect attempt
            uint256 burnAmount = participant.attemptCount * 10**18; // Progressive burn
            _applyBurnPenalty(msg.sender, burnAmount);
        }

        emit RiddleAttemptSubmitted(sessionId, msg.sender, participant.attemptCount, session.sessionDuration - timeElapsed);
    }

    /**
     * @dev Complete riddle and distribute rewards
     */
    function _completeRiddle(uint256 sessionId, address solver, uint256 solveTime) internal {
        RiddleSession storage session = riddleSessions[sessionId];
        ParticipantData storage participant = participantData[_getTokenIdForUser(sessionId, solver)];

        // Mark as completed
        participant.completed = true;
        participant.successful = true;
        participant.completionTime = block.timestamp;
        session.participants[solver] = ParticipantStatus.COMPLETED_SUCCESS;
        session.successfulSolvers++;

        // Check if within winner slots
        bool isWinner = session.successfulSolvers <= session.winnerSlots;

        if (isWinner) {
            session.winners.push(solver);

            // Calculate prize amount
            uint256 prizeAmount = session.prizePool / session.winnerSlots;

            // Apply bonuses
            bool wasFirstSolver = (session.successfulSolvers == 1);
            if (wasFirstSolver) {
                prizeAmount = (prizeAmount * 150) / 100; // 1.5x bonus for first solver
            }

            participant.prizeAmount = prizeAmount;
            session.totalPrizesDistributed += prizeAmount;

            // Award RON reputation
            _awardRONReward(solver, session.difficulty, wasFirstSolver, false);

            emit RiddleCompleted(sessionId, solver, solveTime, prizeAmount, wasFirstSolver);
        }

        // Update total completed
        session.totalCompleted++;

        // Check if session should close
        if (session.successfulSolvers >= session.winnerSlots || session.totalMinted >= session.maxMints) {
            session.state = RiddleState.COMPLETED;
        }
    }

    // ============ QUESTION GENERATION SYSTEM ============

    /**
     * @dev Submit question for community validation
     * Progressive pricing: 1st question = 1 RDLN, Nth question = N RDLN
     */
    function submitQuestion(
        string calldata content,
        QuestionType questionType,
        bytes32 correctAnswerHash,
        string[] calldata options,
        RiddleDifficulty difficulty
    ) external returns (uint256) {
        // Calculate submission cost
        uint256 submissionCount = questionSubmissionCosts[msg.sender] + 1;
        uint256 cost = submissionCount * 10**18; // Progressive pricing

        require(rdlnToken.transferFrom(msg.sender, address(this), cost), "Payment failed");
        questionSubmissionCosts[msg.sender] = submissionCount;

        uint256 questionId = currentQuestionId++;
        Question storage question = questions[questionId];

        question.id = questionId;
        question.creator = msg.sender;
        question.content = content;
        question.questionType = questionType;
        question.correctAnswerHash = correctAnswerHash;
        question.options = options;
        question.difficulty = difficulty;
        question.active = true;

        emit QuestionSubmitted(questionId, msg.sender, difficulty, cost);

        return questionId;
    }

    /**
     * @dev Validate submitted question
     */
    function validateQuestion(uint256 questionId, bool approved)
        external
        onlyRole(QUESTION_VALIDATOR_ROLE)
    {
        Question storage question = questions[questionId];
        require(question.active, "Question not active");
        require(!question.validatedBy[msg.sender], "Already validated");

        question.validatedBy[msg.sender] = approved;
        question.validatorCount++;

        if (approved) {
            question.positiveVotes++;
        } else {
            question.negativeVotes++;
        }

        // Check if consensus reached
        if (question.validatorCount >= MIN_VALIDATORS_PER_QUESTION) {
            uint256 approvalRate = (question.positiveVotes * 100) / question.validatorCount;

            if (approvalRate >= VALIDATION_CONSENSUS_THRESHOLD) {
                question.validated = true;
            } else if (approvalRate < (100 - VALIDATION_CONSENSUS_THRESHOLD)) {
                question.active = false; // Rejected
            }
        }

        emit QuestionValidated(questionId, msg.sender, approved, question.validatorCount);
    }

    // ============ RANDOMIZED PARAMETER SYSTEM ============

    /**
     * @dev Generate randomized parameters for riddle session
     * Creates unique market dynamics for each riddle
     */
    function _generateRandomizedParameters(RiddleDifficulty difficulty)
        internal
        returns (uint256 maxMints, uint256 prizePool, uint256 winnerSlots)
    {
        randomNonce++;
        bytes32 seed = keccak256(abi.encodePacked(block.timestamp, block.difficulty, randomNonce, msg.sender));

        // Generate maxMints (10-1,000 range)
        maxMints = MIN_MAX_MINTS + (uint256(seed) % (MAX_MAX_MINTS - MIN_MAX_MINTS + 1));

        // Generate prizePool based on difficulty
        uint256 basePool = _getBasePrizePool(difficulty);
        uint256 poolVariation = basePool / 2; // ±50% variation
        prizePool = basePool + (uint256(keccak256(abi.encode(seed, "prize"))) % poolVariation) - poolVariation/2;

        // Ensure minimum/maximum bounds
        if (prizePool < MIN_PRIZE_POOL) prizePool = MIN_PRIZE_POOL;
        if (prizePool > MAX_PRIZE_POOL) prizePool = MAX_PRIZE_POOL;

        // Generate winnerSlots (1-100 range, adjusted by difficulty)
        uint256 maxSlots = _getMaxWinnerSlots(difficulty);
        winnerSlots = 1 + (uint256(keccak256(abi.encode(seed, "slots"))) % maxSlots);
    }

    function _getBasePrizePool(RiddleDifficulty difficulty) internal pure returns (uint256) {
        if (difficulty == RiddleDifficulty.EASY) return 500000 * 10**18; // 500K RDLN
        if (difficulty == RiddleDifficulty.MEDIUM) return 2000000 * 10**18; // 2M RDLN
        if (difficulty == RiddleDifficulty.HARD) return 5000000 * 10**18; // 5M RDLN
        return 8000000 * 10**18; // 8M RDLN for Legendary
    }

    function _getMaxWinnerSlots(RiddleDifficulty difficulty) internal pure returns (uint256) {
        if (difficulty == RiddleDifficulty.EASY) return 100;
        if (difficulty == RiddleDifficulty.MEDIUM) return 50;
        if (difficulty == RiddleDifficulty.HARD) return 20;
        return 5; // Legendary
    }

    // ============ PROGRESSIVE ECONOMICS MODEL ============

    /**
     * @dev Calculate current mint cost based on biennial halving schedule
     */
    function getCurrentMintCost() public view returns (uint256) {
        uint256 timeElapsed = block.timestamp - deploymentTime;
        uint256 halvingPeriods = timeElapsed / HALVING_PERIOD;

        uint256 currentCost = INITIAL_MINT_COST;
        for (uint256 i = 0; i < halvingPeriods; i++) {
            currentCost = currentCost / 2;
            if (currentCost < MIN_MINT_COST) {
                currentCost = MIN_MINT_COST;
                break;
            }
        }

        return currentCost;
    }

    /**
     * @dev Distribute mint cost according to burn protocol (50% burn, 25% grand prize, 25% dev/ops)
     */
    function _distributeMintCost(uint256 amount) internal {
        uint256 burnAmount = (amount * 50) / 100;
        uint256 grandPrizeAmount = (amount * 25) / 100;
        uint256 devOpsAmount = amount - burnAmount - grandPrizeAmount;

        // Use the RDLN burn mechanism for NFT minting
        rdlnToken.burnNFTMint(msg.sender, amount);
        totalBurned += burnAmount;

        emit BurnDistribution(amount, burnAmount, grandPrizeAmount, devOpsAmount);
    }

    // ============ ANTI-CHEATING MECHANISMS ============

    /**
     * @dev Comprehensive anti-cheating validation
     */
    function _checkAntiCheat(address user, uint256 sessionId) internal {
        // Check minimum time between actions
        uint256 timeSinceLastActivity = block.timestamp - lastActivityTime[user];
        require(timeSinceLastActivity >= MIN_SOLVE_TIME, "Action too fast");

        // Update activity time
        lastActivityTime[user] = block.timestamp;

        // Check device fingerprint consistency
        bytes32 currentFingerprint = _generateDeviceFingerprint(user);
        if (knownDeviceFingerprints[currentFingerprint]) {
            suspiciousActivityScores[user]++;

            if (suspiciousActivityScores[user] >= SUSPICIOUS_ACTIVITY_THRESHOLD) {
                emit SuspiciousActivityDetected(
                    user,
                    sessionId,
                    "Device fingerprint collision",
                    suspiciousActivityScores[user]
                );
                revert("Suspicious activity detected");
            }
        } else {
            knownDeviceFingerprints[currentFingerprint] = true;
        }
    }

    function _generateDeviceFingerprint(address user) internal view returns (bytes32) {
        // Simplified device fingerprinting (in production, would include more data)
        return keccak256(abi.encodePacked(user, block.timestamp / 1 days, tx.origin));
    }

    // ============ ACHIEVEMENT NFT SYSTEM ============

    /**
     * @dev Mint achievement NFT for successful solver
     * Revolutionary: NFT represents earned achievement, not purchased asset
     */
    function _mintAccessToken(uint256 sessionId, address recipient) internal returns (uint256) {
        uint256 tokenId = totalSupply() + 1;
        _safeMint(recipient, tokenId);

        // Set initial metadata
        NFTMetadata storage metadata = nftMetadata[tokenId];
        metadata.sessionId = sessionId;
        metadata.originalMinter = recipient;
        metadata.mintTimestamp = block.timestamp;
        metadata.difficulty = riddleSessions[sessionId].difficulty;
        metadata.category = riddleSessions[sessionId].category;

        return tokenId;
    }

    /**
     * @dev Claim prize for successful completion
     */
    function claimPrize(uint256 tokenId) external nonReentrant {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not token owner");

        ParticipantData storage participant = participantData[tokenId];
        require(participant.successful, "Not a successful solver");
        require(!participant.prizeClaimed, "Prize already claimed");
        require(participant.prizeAmount > 0, "No prize to claim");

        participant.prizeClaimed = true;

        // Transfer prize
        require(rdlnToken.transfer(msg.sender, participant.prizeAmount), "Prize transfer failed");

        emit PrizeDistributed(participant.sessionId, msg.sender, participant.prizeAmount, riddleSessions[participant.sessionId].winners.length);
    }

    // ============ ORACLE INTEGRATION ============

    /**
     * @dev Award RON reputation for successful solving
     */
    function _awardRONReward(address solver, RiddleDifficulty difficulty, bool isFirstSolver, bool isSpeedSolver) internal {
        // Convert difficulty to RON enum
        IRON.RiddleDifficulty ronDifficulty;
        if (difficulty == RiddleDifficulty.EASY) ronDifficulty = IRON.RiddleDifficulty.EASY;
        else if (difficulty == RiddleDifficulty.MEDIUM) ronDifficulty = IRON.RiddleDifficulty.MEDIUM;
        else if (difficulty == RiddleDifficulty.HARD) ronDifficulty = IRON.RiddleDifficulty.HARD;
        else ronDifficulty = IRON.RiddleDifficulty.LEGENDARY;

        ronToken.awardRON(solver, ronDifficulty, isFirstSolver, isSpeedSolver, "Riddle completion");
    }

    // ============ UTILITY FUNCTIONS ============

    function _hasAccessToRiddle(IRON.AccessTier userTier, RiddleDifficulty difficulty) internal pure returns (bool) {
        // EASY riddles are open to everyone to start earning RON
        if (difficulty == RiddleDifficulty.EASY) return true;
        // MEDIUM riddles require SOLVER tier - earned from completing EASY riddles
        if (difficulty == RiddleDifficulty.MEDIUM) return userTier >= IRON.AccessTier.SOLVER;
        // HARD riddles require EXPERT tier - advanced players
        if (difficulty == RiddleDifficulty.HARD) return userTier >= IRON.AccessTier.EXPERT;
        // ORACLE riddles require ORACLE tier - elite governance access
        return userTier >= IRON.AccessTier.ORACLE;
    }

    function _getTokenIdForUser(uint256 sessionId, address user) internal view returns (uint256) {
        // Simplified lookup - in production would use more efficient mapping
        for (uint256 i = 1; i <= totalSupply(); i++) {
            if (participantData[i].user == user && participantData[i].sessionId == sessionId) {
                return i;
            }
        }
        revert("Token not found");
    }

    function _applyBurnPenalty(address user, uint256 amount) internal {
        require(rdlnToken.transferFrom(user, address(this), amount), "Burn penalty failed");
        rdlnToken.burnFailedAttempt(user);
        totalBurned += amount;
    }

    // ============ ADMIN FUNCTIONS ============

    function toggleEmergencyMode(string calldata reason) external onlyRole(ADMIN_ROLE) {
        emergencyMode = !emergencyMode;
        emit EmergencyModeToggled(emergencyMode, msg.sender, reason);
    }

    function adjustTargetSolveRate(uint256 newRate) external onlyRole(ADMIN_ROLE) {
        uint256 oldRate = targetSolveRate;
        targetSolveRate = newRate;
        emit DifficultyAdjusted(oldRate, newRate, 0);
    }

    function emergencyPauseSession(uint256 sessionId) external onlyRole(ADMIN_ROLE) {
        riddleSessions[sessionId].state = RiddleState.EMERGENCY_STOPPED;
    }

    // ============ VIEW FUNCTIONS ============

    function getRiddleSession(uint256 sessionId) external view returns (
        uint256 maxMints,
        uint256 prizePool,
        uint256 winnerSlots,
        RiddleState state,
        RiddleDifficulty difficulty,
        uint256 totalMinted,
        uint256 successfulSolvers
    ) {
        RiddleSession storage session = riddleSessions[sessionId];
        return (
            session.maxMints,
            session.prizePool,
            session.winnerSlots,
            session.state,
            session.difficulty,
            session.totalMinted,
            session.successfulSolvers
        );
    }

    function getParticipantData(uint256 tokenId) external view returns (
        address user,
        uint256 sessionId,
        bool completed,
        bool successful,
        uint256 prizeAmount,
        bool prizeClaimed
    ) {
        ParticipantData storage participant = participantData[tokenId];
        return (
            participant.user,
            participant.sessionId,
            participant.completed,
            participant.successful,
            participant.prizeAmount,
            participant.prizeClaimed
        );
    }

    function getQuestionData(uint256 questionId) external view returns (
        address creator,
        string memory content,
        QuestionType questionType,
        RiddleDifficulty difficulty,
        bool validated,
        uint256 timesUsed
    ) {
        Question storage question = questions[questionId];
        return (
            question.creator,
            question.content,
            question.questionType,
            question.difficulty,
            question.validated,
            question.timesUsed
        );
    }

    // ============ ERC721 OVERRIDES ============

    function tokenURI(uint256 tokenId) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // ============ UPGRADEABILITY ============

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}