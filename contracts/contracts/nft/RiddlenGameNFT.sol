// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../interfaces/IRON.sol";
import "../interfaces/IGaslessManager.sol";

/**
 * @title RiddlenGameNFT
 * @dev Dynamic game NFT system that evolves with the ecosystem
 *
 * Game Concept: "Weekly Riddlen Challenges"
 * - Users submit puzzle solutions/riddles as game content
 * - AI/Algorithm validates difficulty and quality
 * - Every week, system auto-generates new game NFT if conditions met
 * - Difficulty scales with era (gets harder over time)
 * - Players compete to solve, earn RON rewards
 * - NFT evolves based on community engagement
 *
 * Engagement Loop:
 * 1. Community submits content → 2. Validation → 3. Weekly NFT creation
 * 4. Players solve challenges → 5. Earn rewards → 6. Submit more content
 *
 * Era Progression:
 * - Era 0: Simple logic puzzles, basic riddles
 * - Era 1: Math problems, word puzzles
 * - Era 2: Code challenges, complex riddles
 * - Era 3+: Multi-step puzzles, community collaborations
 */
contract RiddlenGameNFT is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    using Math for uint256;

    // =============================================================
    //                        ROLES
    // =============================================================

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant GAME_MASTER_ROLE = keccak256("GAME_MASTER_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // =============================================================
    //                        CONSTANTS
    // =============================================================

    uint256 public constant GENESIS_TIME = 1704067200; // Jan 1, 2024
    uint256 public constant ERA_DURATION = 730 days; // 2 years
    uint256 public constant WEEK_DURATION = 7 days;
    uint256 public constant MAX_SUBMISSIONS_PER_USER = 3; // Per week
    uint256 public constant MIN_SUBMISSIONS_FOR_GENERATION = 10; // Min submissions needed
    uint256 public constant MIN_VALIDATORS_REQUIRED = 3; // Min validators for approval

    // =============================================================
    //                        ENUMS
    // =============================================================

    enum GameType {
        RIDDLE,          // Traditional riddles
        LOGIC_PUZZLE,    // Logic/reasoning puzzles
        MATH_CHALLENGE,  // Mathematical problems
        CODE_PUZZLE,     // Programming challenges
        WORD_GAME,       // Word puzzles, anagrams
        COMMUNITY_QUEST  // Multi-player collaborative
    }

    enum DifficultyLevel {
        BEGINNER,    // Era 0-1
        INTERMEDIATE, // Era 1-2
        ADVANCED,    // Era 2-3
        EXPERT,      // Era 3+
        LEGENDARY    // Community-driven ultra-hard
    }

    enum SubmissionStatus {
        PENDING,     // Awaiting validation
        APPROVED,    // Ready for game generation
        REJECTED,    // Did not meet standards
        USED         // Incorporated into game NFT
    }

    enum GameNFTStatus {
        ACTIVE,      // Currently playable
        COMPLETED,   // All challenges solved
        EXPIRED,     // Time limit reached
        LEGENDARY    // Becomes permanent community artifact
    }

    // =============================================================
    //                        STRUCTS
    // =============================================================

    struct GameSubmission {
        address submitter;           // Who submitted this content
        GameType gameType;          // Type of challenge
        string contentIPFS;         // IPFS hash of challenge content
        string solutionIPFS;        // IPFS hash of solution (encrypted)
        DifficultyLevel difficulty; // Calculated difficulty
        uint256 submissionTime;     // When submitted
        SubmissionStatus status;    // Current status
        uint256 validatorVotes;     // Number of validator approvals
        uint256 qualityScore;       // Algorithmic quality rating (0-100)
        uint256 era;               // Era when submitted
    }

    struct GameNFTData {
        uint256 weekNumber;         // Week since genesis
        uint256 era;               // Era when created
        GameType primaryType;       // Main game type
        DifficultyLevel difficulty; // Overall difficulty
        string gameDataIPFS;        // Complete game data
        uint256 totalChallenges;    // Number of challenges included
        uint256 solvedChallenges;   // Number solved by community
        uint256 creationTime;       // When NFT was minted
        uint256 expiryTime;         // When game expires
        GameNFTStatus status;       // Current game status
        uint256 totalPlayers;       // Unique players who participated
        uint256 totalRewardsDistributed; // RON rewards given out
        address[] topSolvers;       // Top 3 solvers
    }

    struct WeeklyStats {
        uint256 weekNumber;
        uint256 totalSubmissions;
        uint256 approvedSubmissions;
        uint256 uniqueSubmitters;
        bool nftGenerated;
        uint256 nftTokenId;
        GameType dominantType;
    }

    struct PlayerStats {
        uint256 gamesPlayed;
        uint256 challengesSolved;
        uint256 totalRONEarned;
        uint256 submissionsApproved;
        uint256 currentStreak;
        uint256 maxStreak;
        mapping(DifficultyLevel => uint256) solvedByDifficulty;
    }

    // =============================================================
    //                        STATE VARIABLES
    // =============================================================

    // Core contracts
    IRON public ronToken;
    IGaslessManager public gaslessManager;

    // Game state
    uint256 public currentTokenId;
    uint256 public currentWeek;
    uint256 public totalGamesGenerated;

    // Mappings
    mapping(uint256 => GameSubmission) public submissions;
    mapping(uint256 => GameNFTData) public gameNFTs;
    mapping(uint256 => WeeklyStats) public weeklyStats;
    mapping(address => PlayerStats) public playerStats;
    mapping(uint256 => mapping(address => bool)) public hasPlayed; // tokenId => player => played
    mapping(uint256 => address[]) public weekSubmitters; // week => submitters
    mapping(address => mapping(uint256 => uint256)) public userWeeklySubmissions; // user => week => count

    // Arrays
    uint256[] public pendingSubmissions;
    uint256[] public approvedSubmissions;

    uint256 private _submissionCounter;

    // =============================================================
    //                        EVENTS
    // =============================================================

    event GameSubmissionCreated(
        uint256 indexed submissionId,
        address indexed submitter,
        GameType gameType,
        uint256 week,
        uint256 era
    );

    event SubmissionValidated(
        uint256 indexed submissionId,
        address indexed validator,
        bool approved,
        uint256 qualityScore
    );

    event WeeklyGameNFTGenerated(
        uint256 indexed tokenId,
        uint256 indexed weekNumber,
        uint256 era,
        GameType primaryType,
        DifficultyLevel difficulty,
        uint256 totalChallenges
    );

    event ChallengeSolved(
        uint256 indexed tokenId,
        address indexed solver,
        uint256 challengeIndex,
        uint256 ronReward,
        bool gameCompleted
    );

    event GameCompleted(
        uint256 indexed tokenId,
        uint256 completionTime,
        address[] topSolvers,
        uint256 totalRewards
    );

    event GameExpiredEvent(
        uint256 indexed tokenId,
        uint256 solvedChallenges,
        uint256 totalChallenges
    );

    // =============================================================
    //                        ERRORS
    // =============================================================

    error InvalidAddress();
    error InvalidGameType();
    error InvalidDifficulty();
    error SubmissionLimitExceeded();
    error InsufficientSubmissions();
    error GameNotActive();
    error ChallengeAlreadySolved();
    error InvalidSolution();
    error GameExpired();
    error NotEligibleToValidate();

    // =============================================================
    //                        CONSTRUCTOR
    // =============================================================

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // =============================================================
    //                        INITIALIZATION
    // =============================================================

    function initialize(
        address _ronToken,
        address _gaslessManager,
        address _admin
    ) public initializer {
        if (_ronToken == address(0)) revert InvalidAddress();
        if (_gaslessManager == address(0)) revert InvalidAddress();
        if (_admin == address(0)) revert InvalidAddress();

        __ERC721_init("Riddlen Game NFT", "RGAME");
        __ERC721Enumerable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        ronToken = IRON(_ronToken);
        gaslessManager = IGaslessManager(_gaslessManager);

        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(GAME_MASTER_ROLE, _admin);
        _grantRole(VALIDATOR_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);

        // Initialize state
        currentWeek = getCurrentWeek();
        currentTokenId = 1;
    }

    // =============================================================
    //                        CORE GAME FUNCTIONS
    // =============================================================

    /**
     * @dev Submit content for weekly game generation
     * @param gameType Type of game/challenge
     * @param contentIPFS IPFS hash of challenge content
     * @param solutionIPFS IPFS hash of solution (should be encrypted)
     */
    function submitGameContent(
        GameType gameType,
        string calldata contentIPFS,
        string calldata solutionIPFS
    ) external nonReentrant whenNotPaused {
        address user = _msgSender();
        uint256 week = getCurrentWeek();

        // Check submission limits
        if (userWeeklySubmissions[user][week] >= MAX_SUBMISSIONS_PER_USER) {
            revert SubmissionLimitExceeded();
        }

        // Validate inputs
        if (uint256(gameType) > uint256(GameType.COMMUNITY_QUEST)) revert InvalidGameType();

        // Calculate difficulty based on era and game type
        uint256 era = getCurrentEra();
        DifficultyLevel difficulty = _calculateDifficulty(gameType, era);

        // Create submission
        uint256 submissionId = _submissionCounter++;
        submissions[submissionId] = GameSubmission({
            submitter: user,
            gameType: gameType,
            contentIPFS: contentIPFS,
            solutionIPFS: solutionIPFS,
            difficulty: difficulty,
            submissionTime: block.timestamp,
            status: SubmissionStatus.PENDING,
            validatorVotes: 0,
            qualityScore: 0,
            era: era
        });

        // Update tracking
        pendingSubmissions.push(submissionId);
        weekSubmitters[week].push(user);
        userWeeklySubmissions[user][week]++;
        weeklyStats[week].totalSubmissions++;

        // Use gasless transaction if available
        if (address(gaslessManager) != address(0) && gaslessManager.canUseGasless(user)) {
            gaslessManager.useGaslessTransaction(user);
        }

        emit GameSubmissionCreated(submissionId, user, gameType, week, era);
    }

    /**
     * @dev Validate a pending submission (validators only)
     * @param submissionId ID of submission to validate
     * @param approve Whether to approve or reject
     * @param qualityScore Quality score (0-100)
     */
    function validateSubmission(
        uint256 submissionId,
        bool approve,
        uint256 qualityScore
    ) external onlyRole(VALIDATOR_ROLE) {
        GameSubmission storage submission = submissions[submissionId];

        if (submission.status != SubmissionStatus.PENDING) {
            revert InvalidGameType(); // Reusing error for invalid state
        }

        // Update submission
        submission.validatorVotes++;
        submission.qualityScore = (submission.qualityScore + qualityScore) / submission.validatorVotes;

        // Check if enough validators have approved
        if (approve && submission.validatorVotes >= MIN_VALIDATORS_REQUIRED) {
            submission.status = SubmissionStatus.APPROVED;
            approvedSubmissions.push(submissionId);

            uint256 week = getCurrentWeek();
            weeklyStats[week].approvedSubmissions++;
        } else if (!approve && submission.validatorVotes >= MIN_VALIDATORS_REQUIRED) {
            submission.status = SubmissionStatus.REJECTED;
        }

        emit SubmissionValidated(submissionId, _msgSender(), approve, qualityScore);

        // Try to generate weekly NFT if conditions are met
        _tryGenerateWeeklyNFT();
    }

    /**
     * @dev Automatically generate weekly game NFT if conditions are met
     */
    function _tryGenerateWeeklyNFT() internal {
        uint256 week = getCurrentWeek();
        WeeklyStats storage stats = weeklyStats[week];

        // Check if NFT already generated this week
        if (stats.nftGenerated) return;

        // Check if we have enough approved submissions
        if (stats.approvedSubmissions < MIN_SUBMISSIONS_FOR_GENERATION) return;

        // Generate the NFT
        _generateWeeklyGameNFT(week);
    }

    /**
     * @dev Generate weekly game NFT (internal)
     */
    function _generateWeeklyGameNFT(uint256 week) internal {
        uint256 era = getCurrentEra();
        uint256 tokenId = currentTokenId++;

        // Select best submissions for this week's game
        (GameType primaryType, DifficultyLevel difficulty, uint256[] memory selectedSubmissions) =
            _selectSubmissionsForGame(week, era);

        // Create game NFT data
        gameNFTs[tokenId] = GameNFTData({
            weekNumber: week,
            era: era,
            primaryType: primaryType,
            difficulty: difficulty,
            gameDataIPFS: "", // Will be set by game master
            totalChallenges: selectedSubmissions.length,
            solvedChallenges: 0,
            creationTime: block.timestamp,
            expiryTime: block.timestamp + (WEEK_DURATION * 2), // 2 weeks to solve
            status: GameNFTStatus.ACTIVE,
            totalPlayers: 0,
            totalRewardsDistributed: 0,
            topSolvers: new address[](0)
        });

        // Mark selected submissions as used
        for (uint256 i = 0; i < selectedSubmissions.length; i++) {
            submissions[selectedSubmissions[i]].status = SubmissionStatus.USED;
        }

        // Mint NFT to deployer (will transfer to community later if needed)
        _safeMint(_msgSender(), tokenId);

        // Update stats
        WeeklyStats storage stats = weeklyStats[week];
        stats.nftGenerated = true;
        stats.nftTokenId = tokenId;
        stats.dominantType = primaryType;

        totalGamesGenerated++;

        emit WeeklyGameNFTGenerated(tokenId, week, era, primaryType, difficulty, selectedSubmissions.length);
    }

    /**
     * @dev Solve a challenge in a game NFT
     * @param tokenId Game NFT to play
     * @param challengeIndex Which challenge to solve
     * @param solutionIPFS IPFS hash of solution
     */
    function solveChallengeUse(
        uint256 tokenId,
        uint256 challengeIndex,
        string calldata solutionIPFS
    ) external nonReentrant whenNotPaused {
        address player = _msgSender();
        GameNFTData storage game = gameNFTs[tokenId];

        // Validate game state
        if (game.status != GameNFTStatus.ACTIVE) revert GameNotActive();
        if (block.timestamp > game.expiryTime) revert GameExpired();
        if (challengeIndex >= game.totalChallenges) revert InvalidGameType();

        // Check if challenge already solved by this player
        bytes32 solveKey = keccak256(abi.encodePacked(tokenId, challengeIndex, player));
        // Note: We'd need additional mapping to track individual challenge solves

        // Validate solution (simplified - in practice would verify against stored solution)
        bool solutionCorrect = _validateSolution(tokenId, challengeIndex, solutionIPFS);
        if (!solutionCorrect) revert InvalidSolution();

        // Update player stats
        if (!hasPlayed[tokenId][player]) {
            hasPlayed[tokenId][player] = true;
            game.totalPlayers++;
        }

        PlayerStats storage pStats = playerStats[player];
        pStats.challengesSolved++;
        pStats.solvedByDifficulty[game.difficulty]++;

        // Calculate and award RON reward
        uint256 ronReward = _calculateReward(game.difficulty, game.era);
        if (ronReward > 0) {
            // Award RON - using EASY difficulty for game challenges
            ronToken.awardRON(player, IRON.RiddleDifficulty.EASY, false, false, "Game Challenge Solved");
            pStats.totalRONEarned += ronReward;
            game.totalRewardsDistributed += ronReward;
        }

        game.solvedChallenges++;

        // Check if game is completed
        bool gameCompleted = game.solvedChallenges >= game.totalChallenges;
        if (gameCompleted) {
            game.status = GameNFTStatus.COMPLETED;
            _handleGameCompletion(tokenId);
        }

        // Use gasless transaction if available
        if (address(gaslessManager) != address(0) && gaslessManager.canUseGasless(player)) {
            gaslessManager.useGaslessTransaction(player);
        }

        emit ChallengeSolved(tokenId, player, challengeIndex, ronReward, gameCompleted);
    }

    // =============================================================
    //                        VIEW FUNCTIONS
    // =============================================================

    /**
     * @dev Get current era based on time
     */
    function getCurrentEra() public view returns (uint256) {
        if (block.timestamp < GENESIS_TIME) return 0;
        return (block.timestamp - GENESIS_TIME) / ERA_DURATION;
    }

    /**
     * @dev Get current week number
     */
    function getCurrentWeek() public view returns (uint256) {
        if (block.timestamp < GENESIS_TIME) return 0;
        return (block.timestamp - GENESIS_TIME) / WEEK_DURATION;
    }

    /**
     * @dev Get game NFT metadata URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        GameNFTData memory game = gameNFTs[tokenId];

        // Return dynamic metadata based on game state
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _encodeGameMetadata(tokenId, game)
        ));
    }

    /**
     * @dev Get player statistics
     */
    function getPlayerStats(address player) external view returns (
        uint256 gamesPlayed,
        uint256 challengesSolved,
        uint256 totalRONEarned,
        uint256 submissionsApproved,
        uint256 currentStreak,
        uint256 maxStreak
    ) {
        PlayerStats storage stats = playerStats[player];
        return (
            stats.gamesPlayed,
            stats.challengesSolved,
            stats.totalRONEarned,
            stats.submissionsApproved,
            stats.currentStreak,
            stats.maxStreak
        );
    }

    /**
     * @dev Get weekly statistics
     */
    function getWeeklyStats(uint256 week) external view returns (WeeklyStats memory) {
        return weeklyStats[week];
    }

    /**
     * @dev Check if weekly NFT generation is possible
     */
    function canGenerateWeeklyNFT() external view returns (bool) {
        uint256 week = getCurrentWeek();
        WeeklyStats memory stats = weeklyStats[week];

        return !stats.nftGenerated &&
               stats.approvedSubmissions >= MIN_SUBMISSIONS_FOR_GENERATION;
    }

    // =============================================================
    //                        INTERNAL FUNCTIONS
    // =============================================================

    /**
     * @dev Calculate difficulty based on era and game type
     */
    function _calculateDifficulty(GameType gameType, uint256 era) internal pure returns (DifficultyLevel) {
        // Base difficulty increases with era
        if (era == 0) return DifficultyLevel.BEGINNER;
        if (era == 1) return DifficultyLevel.INTERMEDIATE;
        if (era == 2) return DifficultyLevel.ADVANCED;
        if (era >= 3) return DifficultyLevel.EXPERT;

        // Community quests are always high difficulty
        if (gameType == GameType.COMMUNITY_QUEST) return DifficultyLevel.LEGENDARY;

        return DifficultyLevel.EXPERT;
    }

    /**
     * @dev Select best submissions for weekly game
     */
    function _selectSubmissionsForGame(uint256 week, uint256 era) internal view returns (
        GameType primaryType,
        DifficultyLevel difficulty,
        uint256[] memory selectedSubmissions
    ) {
        // Simplified selection - in practice would be more sophisticated
        uint256[] memory approved = approvedSubmissions;
        selectedSubmissions = new uint256[](Math.min(approved.length, 5)); // Max 5 challenges per game

        uint256 selected = 0;
        for (uint256 i = 0; i < approved.length && selected < 5; i++) {
            GameSubmission memory sub = submissions[approved[i]];
            if (sub.era == era) {
                selectedSubmissions[selected] = approved[i];
                selected++;
            }
        }

        // Determine primary type and difficulty
        primaryType = GameType.RIDDLE; // Default
        difficulty = _calculateDifficulty(primaryType, era);

        // Resize array to actual selected count
        uint256[] memory finalSelected = new uint256[](selected);
        for (uint256 i = 0; i < selected; i++) {
            finalSelected[i] = selectedSubmissions[i];
        }

        return (primaryType, difficulty, finalSelected);
    }

    /**
     * @dev Validate solution (simplified)
     */
    function _validateSolution(
        uint256 tokenId,
        uint256 challengeIndex,
        string calldata solutionIPFS
    ) internal pure returns (bool) {
        // Simplified validation - in practice would check against stored solution
        return bytes(solutionIPFS).length > 0;
    }

    /**
     * @dev Calculate RON reward for solving challenge
     */
    function _calculateReward(DifficultyLevel difficulty, uint256 era) internal pure returns (uint256) {
        uint256 baseReward = 10e18; // 10 RON base
        uint256 difficultyMultiplier = uint256(difficulty) + 1;
        uint256 eraMultiplier = era + 1;

        return baseReward * difficultyMultiplier * eraMultiplier;
    }

    /**
     * @dev Handle game completion
     */
    function _handleGameCompletion(uint256 tokenId) internal {
        GameNFTData storage game = gameNFTs[tokenId];

        // Game becomes a legendary community artifact
        game.status = GameNFTStatus.LEGENDARY;

        emit GameCompleted(
            tokenId,
            block.timestamp,
            game.topSolvers,
            game.totalRewardsDistributed
        );
    }

    /**
     * @dev Encode game metadata as base64 JSON
     */
    function _encodeGameMetadata(uint256 tokenId, GameNFTData memory game) internal pure returns (string memory) {
        // Simplified metadata encoding
        return "ewogICJuYW1lIjogIlJpZGRsZW4gR2FtZSBORlQiLAogICJkZXNjcmlwdGlvbiI6ICJEeW5hbWljIGdhbWUgTkZUIGdlbmVyYXRlZCBieSBjb21tdW5pdHkiCn0=";
    }

    /**
     * @dev Get message sender (for ERC2771 compatibility)
     */
    function _msgSender() internal view virtual override returns (address) {
        return super._msgSender();
    }

    // =============================================================
    //                        ADMIN FUNCTIONS
    // =============================================================

    /**
     * @dev Manually trigger weekly NFT generation
     */
    function forceGenerateWeeklyNFT() external onlyRole(GAME_MASTER_ROLE) {
        uint256 week = getCurrentWeek();
        _generateWeeklyGameNFT(week);
    }

    /**
     * @dev Set game data IPFS for generated NFT
     */
    function setGameDataIPFS(uint256 tokenId, string calldata gameDataIPFS)
        external onlyRole(GAME_MASTER_ROLE) {
        gameNFTs[tokenId].gameDataIPFS = gameDataIPFS;
    }

    /**
     * @dev Emergency pause
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // =============================================================
    //                        OVERRIDES
    // =============================================================

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
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}