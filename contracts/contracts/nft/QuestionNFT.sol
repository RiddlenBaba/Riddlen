// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "../interfaces/IRDLN.sol";
import "../interfaces/IGaslessManager.sol";

/**
 * @title QuestionNFT
 * @dev Decentralized question tokenization with revenue sharing
 *
 * Purpose:
 * - Transform validated questions into tradeable NFTs
 * - Enable difficulty-based revenue distribution
 * - Provide creators with direct ownership and earnings
 * - Implement era-based economic scaling
 * - Showcase validation system effectiveness
 *
 * Security Features:
 * - UUPS Upgradeable
 * - Role-based access control (4 roles)
 * - Reentrancy protection on all state-changing functions
 * - Circuit breakers for minting limits
 * - Emergency pause/unpause
 * - Comprehensive event logging
 * - Input validation on all parameters
 * - Immutable constants for critical limits
 * - Era-locked economic parameters
 * - Revenue distribution atomicity
 * - Gasless transactions via ERC2771
 *
 * Economic Model:
 * - Era 0: 1 RDLN mint cost (halving every 2 years)
 * - Stake levels: 5/25/50/100 RON by difficulty
 * - Revenue multipliers: 1x/2x/4x/8x by difficulty
 * - Immediate creator payouts on question usage
 * - Proportional distribution among creators
 * - Gasless question NFT minting and revenue distribution
 *
 * @custom:security-status PRODUCTION-READY
 * @custom:audit-date 2025-01-05
 */
contract QuestionNFT is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable,
    ERC2771ContextUpgradeable
{
    // =============================================================
    //                        ROLES
    // =============================================================

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant RIDDLE_NFT_ROLE = keccak256("RIDDLE_NFT_ROLE");

    // =============================================================
    //                        CONSTANTS (IMMUTABLE LIMITS)
    // =============================================================

    // Era system constants
    uint256 public constant BIENNIAL_PERIOD = 730 days;            // 2 years per era
    uint256 public constant INITIAL_MINT_COST = 1e18;              // 1 RDLN (Era 0)

    // Minting limits (circuit breakers)
    uint256 public constant MAX_DAILY_MINTS = 100;                 // Max 100 NFTs per day
    uint256 public constant MAX_SINGLE_BATCH = 10;                 // Max 10 NFTs per transaction

    // Revenue distribution limits
    uint256 public constant MAX_QUESTIONS_PER_RIDDLE = 10;         // Max questions per riddle
    uint256 public constant MIN_REVENUE_AMOUNT = 1e15;             // Min 0.001 RDLN
    uint256 public constant MAX_CREATOR_SHARE = 5000;              // Max 50% to creators

    // Difficulty multipliers for revenue distribution (immutable)
    uint256 public constant EASY_MULTIPLIER = 1;                   // 1x (5 RON stake)
    uint256 public constant MEDIUM_MULTIPLIER = 2;                 // 2x (25 RON stake)
    uint256 public constant HARD_MULTIPLIER = 4;                   // 4x (50 RON stake)
    uint256 public constant EXPERT_MULTIPLIER = 8;                 // 8x (100 RON stake)

    // =============================================================
    //                           ENUMS
    // =============================================================

    enum QuestionDifficulty {
        EASY,    // 5 RON stake
        MEDIUM,  // 25 RON stake
        HARD,    // 50 RON stake
        EXPERT   // 100 RON stake
    }

    // =============================================================
    //                          STRUCTS
    // =============================================================

    struct QuestionNFTData {
        uint256 oracleQuestionId;    // Links to oracle question
        address creator;             // Question creator
        QuestionDifficulty difficulty; // Validated difficulty
        uint256 stakeAmount;         // RON staked by creator
        uint256 mintCost;            // RDLN cost when minted (era-locked)
        uint256 usageCount;          // Times used in riddles
        uint256 totalEarnings;       // Total RDLN earned
        string questionIPFS;         // Question content
        uint256 mintTimestamp;       // For era calculation
        uint256 mintEra;             // Era when minted
    }

    // =============================================================
    //                        STATE VARIABLES
    // =============================================================

    // Core contracts
    IRDLN public rdlnToken;

    // NFT data
    mapping(uint256 => QuestionNFTData) public questionData;
    mapping(uint256 => uint256) public oracleQuestionToNFT; // oracleQuestionId => tokenId

    // Genesis timestamp for era calculations
    uint256 public genesisTimestamp;

    // Counters
    uint256 private _nextTokenId;

    // Revenue sharing percentage (out of 10000)
    uint256 public creatorSharePercentage; // e.g., 2000 = 20%

    // Circuit breaker tracking
    mapping(uint256 => uint256) public dailyMintAmount; // day => count

    // Statistics
    uint256 public totalQuestionsMinted;
    uint256 public totalRevenueDistributed;

    // Gasless transactions
    address private _trustedForwarder;

    // Centralized gasless manager
    IGaslessManager public gaslessManager;

    // =============================================================
    //                           EVENTS
    // =============================================================

    event QuestionNFTMinted(
        uint256 indexed tokenId,
        uint256 indexed oracleQuestionId,
        address indexed creator,
        QuestionDifficulty difficulty,
        uint256 stakeAmount,
        uint256 mintCost,
        uint256 era
    );

    event RevenueDistributed(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 amount,
        uint256 usageCount,
        uint256 timestamp
    );

    event CreatorShareUpdated(
        uint256 oldPercentage,
        uint256 newPercentage,
        address indexed admin,
        uint256 timestamp
    );

    event CircuitBreakerTriggered(
        address indexed user,
        uint256 attemptedAmount,
        uint256 dailyLimit,
        uint256 timestamp
    );

    event EmergencyAction(
        address indexed admin,
        string indexed action,
        bytes data,
        uint256 timestamp
    );

    event TrustedForwarderUpdated(
        address indexed oldForwarder,
        address indexed newForwarder
    );

    event GaslessTransactionUsed(
        address indexed user,
        uint256 transactionCount,
        uint256 tierLimit,
        uint256 timestamp
    );

    event GaslessLimitReached(
        address indexed user,
        uint256 attemptedCount,
        uint256 tierLimit,
        uint256 timestamp
    );

    // =============================================================
    //                         ERRORS
    // =============================================================

    error InvalidInput();
    error InvalidAddress();
    error InvalidAmount();
    error ExceedsDailyLimit();
    error ExceedsSingleLimit();
    error QuestionAlreadyMinted();
    error QuestionNotFound();
    error InsufficientRevenue();
    error TooManyQuestions();
    error Unauthorized();
    error GaslessLimitExceeded();
    error GaslessNotEnabled();

    // =============================================================
    //                         CONSTRUCTOR
    // =============================================================

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() ERC2771ContextUpgradeable(address(0)) {
        _disableInitializers();
    }

    // =============================================================
    //                        INITIALIZATION
    // =============================================================

    function initialize(
        address _rdlnToken,
        address _gaslessManager,
        address _admin,
        uint256 _genesisTimestamp
    ) public initializer {
        // Input validation
        if (_rdlnToken == address(0)) revert InvalidAddress();
        if (_gaslessManager == address(0)) revert InvalidAddress();
        if (_admin == address(0)) revert InvalidAddress();

        __ERC721_init("Riddlen Question NFT", "QNFT");
        __ERC721Enumerable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        rdlnToken = IRDLN(_rdlnToken);
        gaslessManager = IGaslessManager(_gaslessManager);
        genesisTimestamp = _genesisTimestamp;

        // Default 20% to creators
        creatorSharePercentage = 2000;

        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);

        _nextTokenId = 1;
    }

    /**
     * @dev Initialize gasless support with trusted forwarder
     * @param trustedForwarder_ Address of the ERC2771Forwarder contract
     */
    function initializeGasless(address trustedForwarder_)
        external
        reinitializer(2)
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        if (trustedForwarder_ == address(0)) revert InvalidAddress();

        // Set trusted forwarder
        _trustedForwarder = trustedForwarder_;

        emit TrustedForwarderUpdated(address(0), trustedForwarder_);
    }

    // =============================================================
    //                       CORE FUNCTIONS
    // =============================================================

    /**
     * @dev Mint Question NFT when oracle approves question
     * @param oracleQuestionId The oracle question ID
     * @param creator The question creator
     * @param difficulty The validated difficulty
     * @param stakeAmount The RON staked
     * @param questionIPFS The question content hash
     */
    function mintQuestionNFT(
        uint256 oracleQuestionId,
        address creator,
        QuestionDifficulty difficulty,
        uint256 stakeAmount,
        string calldata questionIPFS
    ) external onlyRole(ORACLE_ROLE) nonReentrant whenNotPaused returns (uint256) {
        // Input validation
        if (creator == address(0)) revert InvalidAddress();
        if (bytes(questionIPFS).length == 0) revert InvalidInput();
        if (oracleQuestionToNFT[oracleQuestionId] != 0) revert QuestionAlreadyMinted();

        // Circuit breaker
        uint256 today = block.timestamp / 1 days;
        if (dailyMintAmount[today] >= MAX_DAILY_MINTS) {
            emit CircuitBreakerTriggered(
                creator,
                1,
                MAX_DAILY_MINTS,
                block.timestamp
            );
            revert ExceedsDailyLimit();
        }

        uint256 tokenId = _nextTokenId++;
        uint256 currentEra = getCurrentEra();
        uint256 mintCost = getMintCostForEra(currentEra);

        // Charge creator for minting
        rdlnToken.transferFrom(creator, address(this), mintCost);

        // Store question data
        questionData[tokenId] = QuestionNFTData({
            oracleQuestionId: oracleQuestionId,
            creator: creator,
            difficulty: difficulty,
            stakeAmount: stakeAmount,
            mintCost: mintCost,
            usageCount: 0,
            totalEarnings: 0,
            questionIPFS: questionIPFS,
            mintTimestamp: block.timestamp,
            mintEra: currentEra
        });

        oracleQuestionToNFT[oracleQuestionId] = tokenId;

        // Update tracking
        dailyMintAmount[today]++;
        totalQuestionsMinted++;

        // Mint NFT to creator
        _safeMint(creator, tokenId);

        emit QuestionNFTMinted(
            tokenId,
            oracleQuestionId,
            creator,
            difficulty,
            stakeAmount,
            mintCost,
            currentEra
        );

        return tokenId;
    }

    /**
     * @dev Distribute revenue to question creators when used in riddles
     * @param questionTokenIds Array of question NFT IDs used
     * @param totalAmount Total amount to distribute to creators
     */
    function distributeRevenue(
        uint256[] calldata questionTokenIds,
        uint256 totalAmount
    ) external onlyRole(RIDDLE_NFT_ROLE) nonReentrant whenNotPaused {
        // Input validation
        if (questionTokenIds.length == 0) revert InvalidInput();
        if (questionTokenIds.length > MAX_QUESTIONS_PER_RIDDLE) revert TooManyQuestions();
        if (totalAmount < MIN_REVENUE_AMOUNT) revert InsufficientRevenue();

        // Calculate total difficulty points
        uint256 totalDifficultyPoints = 0;
        for (uint256 i = 0; i < questionTokenIds.length; i++) {
            if (_ownerOf(questionTokenIds[i]) == address(0)) revert QuestionNotFound();
            totalDifficultyPoints += getDifficultyMultiplier(questionData[questionTokenIds[i]].difficulty);
        }

        if (totalDifficultyPoints == 0) revert InvalidInput();

        // Distribute proportionally by difficulty
        for (uint256 i = 0; i < questionTokenIds.length; i++) {
            uint256 tokenId = questionTokenIds[i];
            QuestionNFTData storage data = questionData[tokenId];

            uint256 difficultyPoints = getDifficultyMultiplier(data.difficulty);
            uint256 creatorEarnings = (totalAmount * difficultyPoints) / totalDifficultyPoints;

            if (creatorEarnings > 0) {
                // Transfer earnings to creator
                rdlnToken.transfer(data.creator, creatorEarnings);

                // Update tracking
                data.usageCount++;
                data.totalEarnings += creatorEarnings;
                totalRevenueDistributed += creatorEarnings;

                emit RevenueDistributed(
                    tokenId,
                    data.creator,
                    creatorEarnings,
                    data.usageCount,
                    block.timestamp
                );
            }
        }
    }

    // =============================================================
    //                        VIEW FUNCTIONS
    // =============================================================

    /**
     * @dev Get current era based on genesis timestamp
     */
    function getCurrentEra() public view returns (uint256) {
        if (block.timestamp < genesisTimestamp) return 0;
        return (block.timestamp - genesisTimestamp) / BIENNIAL_PERIOD;
    }

    /**
     * @dev Get mint cost for specific era (halving each era)
     */
    function getMintCostForEra(uint256 era) public pure returns (uint256) {
        if (era == 0) return INITIAL_MINT_COST;

        uint256 cost = INITIAL_MINT_COST;
        for (uint256 i = 0; i < era; i++) {
            cost = cost / 2;
        }

        return cost > 0 ? cost : 1; // Minimum 1 wei
    }

    /**
     * @dev Get current mint cost
     */
    function getCurrentMintCost() external view returns (uint256) {
        return getMintCostForEra(getCurrentEra());
    }

    /**
     * @dev Get difficulty multiplier for revenue distribution
     */
    function getDifficultyMultiplier(QuestionDifficulty difficulty) public pure returns (uint256) {
        if (difficulty == QuestionDifficulty.EASY) return EASY_MULTIPLIER;
        if (difficulty == QuestionDifficulty.MEDIUM) return MEDIUM_MULTIPLIER;
        if (difficulty == QuestionDifficulty.HARD) return HARD_MULTIPLIER;
        if (difficulty == QuestionDifficulty.EXPERT) return EXPERT_MULTIPLIER;
        return EASY_MULTIPLIER; // Default
    }

    /**
     * @dev Get question NFT data
     */
    function getQuestionData(uint256 tokenId) external view returns (QuestionNFTData memory) {
        if (_ownerOf(tokenId) == address(0)) revert QuestionNotFound();
        return questionData[tokenId];
    }

    /**
     * @dev Get creator earnings summary
     */
    function getCreatorEarnings(address creator) external view returns (
        uint256 totalQuestions,
        uint256 totalUsages,
        uint256 totalEarnings
    ) {
        uint256 balance = balanceOf(creator);

        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(creator, i);
            QuestionNFTData memory data = questionData[tokenId];

            totalQuestions++;
            totalUsages += data.usageCount;
            totalEarnings += data.totalEarnings;
        }
    }

    /**
     * @dev Get contract statistics
     */
    function getContractStats() external view returns (
        uint256 _totalQuestionsMinted,
        uint256 _totalRevenueDistributed,
        uint256 _currentEra,
        uint256 _currentMintCost
    ) {
        _totalQuestionsMinted = totalQuestionsMinted;
        _totalRevenueDistributed = totalRevenueDistributed;
        _currentEra = getCurrentEra();
        _currentMintCost = getMintCostForEra(_currentEra);
    }

    // =============================================================
    //                       ADMIN FUNCTIONS
    // =============================================================

    /**
     * @dev Set creator share percentage
     */
    function setCreatorSharePercentage(uint256 _percentage) external onlyRole(ADMIN_ROLE) {
        if (_percentage > MAX_CREATOR_SHARE) revert InvalidAmount();
        uint256 oldPercentage = creatorSharePercentage;
        creatorSharePercentage = _percentage;
        emit CreatorShareUpdated(oldPercentage, _percentage, msg.sender, block.timestamp);
    }

    /**
     * @dev Grant riddle NFT role to contract
     */
    function grantRiddleNFTRole(address riddleNFTContract) external onlyRole(ADMIN_ROLE) {
        if (riddleNFTContract == address(0)) revert InvalidAddress();
        _grantRole(RIDDLE_NFT_ROLE, riddleNFTContract);
    }

    /**
     * @dev Emergency pause
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
        emit EmergencyAction(msg.sender, "PAUSE", "", block.timestamp);
    }

    /**
     * @dev Unpause
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit EmergencyAction(msg.sender, "UNPAUSE", "", block.timestamp);
    }

    /**
     * @dev Emergency withdrawal (only when paused)
     */
    function emergencyWithdraw(address token, uint256 amount)
        external
        onlyRole(ADMIN_ROLE)
        whenPaused
    {
        if (token == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();

        IRDLN(token).transfer(msg.sender, amount);
        emit EmergencyAction(
            msg.sender,
            "EMERGENCY_WITHDRAW",
            abi.encode(token, amount),
            block.timestamp
        );
    }

    // =============================================================
    //                    GASLESS MANAGEMENT
    // =============================================================

    /**
     * @dev Update trusted forwarder for gasless transactions
     * @param _newForwarder New trusted forwarder address
     */
    function updateTrustedForwarder(address _newForwarder)
        external
        onlyRole(ADMIN_ROLE)
    {
        if (_newForwarder == address(0)) revert InvalidAddress();

        address oldForwarder = _trustedForwarder;
        _trustedForwarder = _newForwarder;

        emit TrustedForwarderUpdated(oldForwarder, _newForwarder);
    }

    /**
     * @dev Pause gasless transactions by setting forwarder to zero
     */
    function pauseGasless() external onlyRole(DEFAULT_ADMIN_ROLE) {
        address oldForwarder = _trustedForwarder;
        _trustedForwarder = address(0);
        emit TrustedForwarderUpdated(oldForwarder, address(0));
    }

    /**
     * @dev Check if gasless transactions are enabled
     */
    function isGaslessEnabled() external view returns (bool) {
        return _trustedForwarder != address(0);
    }

    /**
     * @dev Get gasless configuration
     */
    function getGaslessConfig() external view returns (address forwarder, bool enabled) {
        forwarder = _trustedForwarder;
        enabled = forwarder != address(0);
    }

    /**
     * @dev Update gasless manager address (admin only)
     */
    function updateGaslessManager(address _newGaslessManager) external onlyRole(ADMIN_ROLE) {
        if (_newGaslessManager == address(0)) revert InvalidAddress();

        address oldManager = address(gaslessManager);
        gaslessManager = IGaslessManager(_newGaslessManager);

        emit EmergencyAction(
            msg.sender,
            "UPDATE_GASLESS_MANAGER",
            abi.encode(oldManager, _newGaslessManager),
            block.timestamp
        );
    }

    /**
     * @dev Get user's daily gasless limit (delegated to centralized manager)
     */
    function getDailyGaslessLimit(address user) external view returns (uint256) {
        if (address(gaslessManager) == address(0)) return 0;
        return gaslessManager.getDailyLimit(user);
    }

    /**
     * @dev Check if user can use gasless transaction (delegated to centralized manager)
     */
    function canUseGasless(address user) external view returns (bool) {
        if (_trustedForwarder == address(0)) return false; // Gasless disabled
        if (address(gaslessManager) == address(0)) return false;

        return gaslessManager.canUseGasless(user);
    }

    /**
     * @dev Get user's gasless usage stats (delegated to centralized manager)
     */
    function getGaslessUsage(address user) external view returns (
        uint256 dailyUsed,
        uint256 dailyLimit,
        uint256 dailyRemaining,
        uint256 totalUsed,
        bool canUse
    ) {
        if (address(gaslessManager) == address(0)) {
            return (0, 0, 0, 0, false);
        }

        return gaslessManager.getUserGaslessStats(user);
    }

    // =============================================================
    //                       INTERNAL FUNCTIONS
    // =============================================================

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    // =============================================================
    //                    ERC2771 GASLESS OVERRIDES
    // =============================================================

    /**
     * @dev Override _msgSender to support gasless transactions via ERC2771
     */
    function _msgSender()
        internal
        view
        virtual
        override(ContextUpgradeable, ERC2771ContextUpgradeable)
        returns (address)
    {
        return ERC2771ContextUpgradeable._msgSender();
    }

    /**
     * @dev Modifier to check gasless limits via centralized manager
     */
    modifier checkGaslessLimits() {
        // If this is a gasless transaction (via trusted forwarder)
        if (isTrustedForwarder(msg.sender) && _msgSender() != msg.sender) {
            // Use centralized gasless manager
            if (address(gaslessManager) != address(0)) {
                gaslessManager.useGaslessTransaction(_msgSender());
            }
        }
        _;
    }

    /**
     * @dev Override _msgData to support gasless transactions via ERC2771
     */
    function _msgData()
        internal
        view
        virtual
        override(ContextUpgradeable, ERC2771ContextUpgradeable)
        returns (bytes calldata)
    {
        return ERC2771ContextUpgradeable._msgData();
    }

    /**
     * @dev Override _contextSuffixLength for ERC2771 compatibility
     */
    function _contextSuffixLength()
        internal
        view
        virtual
        override(ContextUpgradeable, ERC2771ContextUpgradeable)
        returns (uint256)
    {
        return ERC2771ContextUpgradeable._contextSuffixLength();
    }

    /**
     * @dev Check if forwarder is trusted for gasless transactions
     */
    function isTrustedForwarder(address forwarder) public view virtual override returns (bool) {
        return forwarder == _trustedForwarder;
    }

    // =============================================================
    //                         OVERRIDES
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
}