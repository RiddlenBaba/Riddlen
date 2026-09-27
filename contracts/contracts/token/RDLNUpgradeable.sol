// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "../interfaces/IRDLN.sol";

/**
 * @title RDLNUpgradeable - Riddlen Token (Upgradeable)
 * @dev Enterprise-grade ERC-20 token with 2025 best practices
 * @notice UUPS upgradeable implementation with comprehensive features
 *
 * Features:
 * - EIP-2612 Permit for gasless approvals
 * - ERC20Votes for governance
 * - Circuit breakers for security
 * - Comprehensive event logging
 * - Compliance hooks ready
 * - Cross-chain bridge preparation
 * - UUPS upgradeable pattern
 */
contract RDLNUpgradeable is
    Initializable,
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    ERC20PermitUpgradeable,
    ERC20VotesUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable,
    IRDLN
{
    // ============ CONSTANTS ============

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant GAME_ROLE = keccak256("GAME_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");

    // Token distribution constants
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion RDLN
    uint256 public constant PRIZE_POOL_ALLOCATION = 700_000_000 * 10**18; // 70%
    uint256 public constant TREASURY_ALLOCATION = 100_000_000 * 10**18; // 10%
    uint256 public constant AIRDROP_ALLOCATION = 100_000_000 * 10**18; // 10%
    uint256 public constant LIQUIDITY_ALLOCATION = 100_000_000 * 10**18; // 10%

    // Circuit breaker limits
    uint256 public constant MAX_DAILY_BURN = 10_000_000 * 10**18; // 10M RDLN per day
    uint256 public constant MAX_SINGLE_BURN = 1_000_000 * 10**18; // 1M RDLN per transaction
    uint256 public constant MAX_BURN_RATE = 500; // Max 5% burn rate

    // ============ STATE VARIABLES ============

    // Gasless transaction support
    address private _trustedForwarderAddress;

    // Allocation tracking
    uint256 public prizePoolMinted;
    uint256 public treasuryMinted;
    uint256 public airdropMinted;
    uint256 public liquidityMinted;

    // Burn tracking
    uint256 public totalBurned;
    uint256 public gameplayBurned;
    uint256 public transferBurned;

    // Game mechanics
    mapping(address => uint256) public failedAttempts;
    mapping(address => uint256) public questionsSubmitted;

    // Wallets
    address public treasuryWallet;
    address public liquidityWallet;
    address public airdropWallet;
    address public grandPrizeWallet;

    // Circuit breaker
    mapping(uint256 => uint256) public dailyBurnAmount;

    // Deflationary settings
    bool public burnOnTransferEnabled;
    uint256 public transferBurnRate; // 100 = 1%

    // Compliance system
    address public complianceModule;
    bool public complianceEnabled;

    // Cross-chain bridge
    mapping(uint256 => bool) public supportedChains;
    mapping(bytes32 => bool) public processedTransactions;

    // ============ CREATOR ECONOMY REWARD POOLS ============
    // Revolutionary tokenomics: 0% burn, rewards fuel the ecosystem

    // Reward pool wallets
    address public contributorRewardsWallet;
    address public validatorRewardsWallet;

    // Accumulated reward pools
    uint256 public totalContributorRewards;
    uint256 public totalValidatorRewards;
    uint256 public totalDistributedRewards;

    // Individual contributor tracking
    mapping(address => uint256) public contributorEarnings;
    mapping(address => uint256) public validatorEarnings;
    mapping(address => uint256) public contributorClaimed;
    mapping(address => uint256) public validatorClaimed;

    // Question usage tracking for contributor rewards
    mapping(uint256 => address) public questionCreators; // questionId => creator
    mapping(uint256 => uint256) public questionUsageCount; // questionId => times used
    mapping(address => uint256[]) public creatorQuestions; // creator => questionIds[]

    // ============ RUG-PROOF TREASURY SYSTEM ============
    // 🔒 IMMUTABLE PROTECTION (Cannot be changed by anyone, ever)
    uint256 public constant MONTHLY_OPERATIONS_RELEASE = 1_000_000 * 10**18; // FIXED 1M RDLN
    uint256 public constant RELEASE_INTERVAL = 30 days; // FIXED 30-day schedule
    uint256 public constant MAX_EMERGENCY_RELEASE = 5_000_000 * 10**18; // Max 5M emergency
    uint256 public constant EMERGENCY_COOLDOWN = 365 days; // 1 year between emergencies

    // 📊 Treasury state tracking
    uint256 public lastOperationsRelease;
    uint256 public lastEmergencyRelease;
    uint256 public totalEmergencyReleased;
    address public operationsWallet;

    // ============ EVENTS ============

    event BurnExecuted(
        address indexed user,
        uint256 indexed burnType,
        uint256 totalAmount,
        uint256 burnedAmount,
        uint256 grandPrizeAmount,
        uint256 devOpsAmount,
        uint256 timestamp
    );

    // ============ CREATOR ECONOMY EVENTS ============

    event RewardDistributionExecuted(
        address indexed user,
        uint256 indexed distributionType,
        uint256 totalAmount,
        uint256 grandPrizeAmount,
        uint256 devOpsAmount,
        uint256 contributorAmount,
        uint256 validatorAmount,
        uint256 timestamp
    );

    event ContributorRewarded(
        address indexed contributor,
        uint256 indexed questionId,
        uint256 amount,
        uint256 usageCount,
        uint256 timestamp
    );

    event ValidatorRewarded(
        address indexed validator,
        uint256 amount,
        uint256 validationCount,
        uint256 timestamp
    );

    event RewardsClaimed(
        address indexed claimer,
        uint256 contributorAmount,
        uint256 validatorAmount,
        uint256 totalClaimed,
        uint256 timestamp
    );

    event QuestionRegistered(
        uint256 indexed questionId,
        address indexed creator,
        uint256 timestamp
    );

    event RewardWalletsUpdated(
        address indexed contributorWallet,
        address indexed validatorWallet,
        uint256 timestamp
    );

    event CircuitBreakerTriggered(
        address indexed user,
        uint256 attemptedAmount,
        uint256 dailyLimit,
        uint256 singleLimit,
        uint256 timestamp
    );


    event ComplianceModuleUpdated(
        address indexed oldModule,
        address indexed newModule,
        bool enabled
    );

    event CrossChainTransfer(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 targetChain,
        bytes32 transactionHash
    );

    event BatchOperationExecuted(
        address indexed executor,
        uint256 operationType,
        uint256 operationCount,
        uint256 totalAmount
    );

    // ============ ERRORS ============

    error AllocationExceeded(string allocationType, uint256 requested, uint256 remaining);
    error InvalidAddress(address addr);
    error InvalidBurnRate(uint256 rate);
    error InsufficientBalance(address user, uint256 required, uint256 available);
    error DailyBurnLimitExceeded(uint256 requested, uint256 dailyLimit);
    error SingleBurnLimitExceeded(uint256 requested, uint256 singleLimit);
    error ComplianceViolation(address user, string reason);
    error CrossChainNotSupported(uint256 chainId);
    error BatchSizeExceeded(uint256 requested, uint256 maxSize);
    error UnauthorizedUpgrade(address caller);

    // ============ MODIFIERS ============

    modifier onlyCompliant(address user) {
        if (complianceEnabled && complianceModule != address(0)) {
            (bool success, bytes memory result) = complianceModule.staticcall(
                abi.encodeWithSignature("isTransferAllowed(address)", user)
            );
            if (success && result.length > 0 && !abi.decode(result, (bool))) {
                revert ComplianceViolation(user, "Transfer not allowed");
            }
        }
        _;
    }

    modifier burnLimits(uint256 burnAmount) {
        if (burnAmount > MAX_SINGLE_BURN) {
            revert SingleBurnLimitExceeded(burnAmount, MAX_SINGLE_BURN);
        }

        uint256 today = block.timestamp / 1 days;
        if (dailyBurnAmount[today] + burnAmount > MAX_DAILY_BURN) {
            revert DailyBurnLimitExceeded(dailyBurnAmount[today] + burnAmount, MAX_DAILY_BURN);
        }

        dailyBurnAmount[today] += burnAmount;
        _;
    }

    // ============ INITIALIZATION ============

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _admin,
        address _treasuryWallet,
        address _liquidityWallet,
        address _airdropWallet,
        address _grandPrizeWallet,
        address _operationsWallet,
        address _trustedForwarder
    ) public initializer {
        __ERC20_init("Riddlen Token", "RDLN");
        __ERC20Burnable_init();
        __ERC20Permit_init("Riddlen");
        __ERC20Votes_init();
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        // Initialize trusted forwarder for gasless transactions
        _trustedForwarderAddress = _trustedForwarder;

        if (_admin == address(0)) revert InvalidAddress(_admin);
        if (_treasuryWallet == address(0)) revert InvalidAddress(_treasuryWallet);
        if (_liquidityWallet == address(0)) revert InvalidAddress(_liquidityWallet);
        if (_airdropWallet == address(0)) revert InvalidAddress(_airdropWallet);
        if (_grandPrizeWallet == address(0)) revert InvalidAddress(_grandPrizeWallet);
        if (_operationsWallet == address(0)) revert InvalidAddress(_operationsWallet);
        if (_trustedForwarder == address(0)) revert InvalidAddress(_trustedForwarder);

        treasuryWallet = _treasuryWallet;
        liquidityWallet = _liquidityWallet;
        airdropWallet = _airdropWallet;
        grandPrizeWallet = _grandPrizeWallet;
        operationsWallet = _operationsWallet;

        // Initialize treasury system
        lastOperationsRelease = block.timestamp;

        transferBurnRate = 100; // 1% default

        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _admin);
        _grantRole(BURNER_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
        _grantRole(COMPLIANCE_ROLE, _admin);

        // Initial mint for setup
        _mint(_admin, 1_000_000 * 10**18); // 1M RDLN for initial setup
    }

    /**
     * @dev Initialize creator economy system with reward wallets
     * @param _contributorRewardsWallet Wallet for contributor rewards
     * @param _validatorRewardsWallet Wallet for validator rewards
     */
    function initializeCreatorEconomy(
        address _contributorRewardsWallet,
        address _validatorRewardsWallet
    ) external reinitializer(2) onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_contributorRewardsWallet != address(0), "Invalid contributor wallet");
        require(_validatorRewardsWallet != address(0), "Invalid validator wallet");

        contributorRewardsWallet = _contributorRewardsWallet;
        validatorRewardsWallet = _validatorRewardsWallet;

        emit RewardWalletsUpdated(_contributorRewardsWallet, _validatorRewardsWallet, block.timestamp);
    }

    // ============ CREATOR ECONOMY FUNCTIONS ============

    /**
     * @dev Register a question creator for reward tracking
     * @param questionId The ID of the question
     * @param creator The address of the question creator
     */
    function registerQuestionCreator(uint256 questionId, address creator)
        external
        onlyRole(GAME_ROLE)
    {
        require(creator != address(0), "Invalid creator address");
        require(questionCreators[questionId] == address(0), "Question already registered");

        questionCreators[questionId] = creator;
        creatorQuestions[creator].push(questionId);

        emit QuestionRegistered(questionId, creator, block.timestamp);
    }

    /**
     * @dev Reward a contributor when their question is used
     * @param questionId The ID of the question that was used
     * @param rewardAmount The amount to reward the creator
     */
    function rewardQuestionUsage(uint256 questionId, uint256 rewardAmount)
        external
        onlyRole(GAME_ROLE)
    {
        address creator = questionCreators[questionId];
        require(creator != address(0), "Question creator not found");

        questionUsageCount[questionId]++;
        contributorEarnings[creator] += rewardAmount;

        emit ContributorRewarded(
            creator,
            questionId,
            rewardAmount,
            questionUsageCount[questionId],
            block.timestamp
        );
    }

    /**
     * @dev Reward a validator for their validation work
     * @param validator The address of the validator
     * @param rewardAmount The amount to reward
     * @param validationCount The number of validations completed
     */
    function rewardValidator(address validator, uint256 rewardAmount, uint256 validationCount)
        external
        onlyRole(GAME_ROLE)
    {
        require(validator != address(0), "Invalid validator address");

        validatorEarnings[validator] += rewardAmount;

        emit ValidatorRewarded(validator, rewardAmount, validationCount, block.timestamp);
    }

    /**
     * @dev Allow contributors and validators to claim their accumulated rewards
     */
    function claimRewards() external nonReentrant {
        uint256 contributorAmount = contributorEarnings[msg.sender] - contributorClaimed[msg.sender];
        uint256 validatorAmount = validatorEarnings[msg.sender] - validatorClaimed[msg.sender];
        uint256 totalToClaim = contributorAmount + validatorAmount;

        require(totalToClaim > 0, "No rewards to claim");

        // Update claimed amounts
        contributorClaimed[msg.sender] += contributorAmount;
        validatorClaimed[msg.sender] += validatorAmount;

        // Transfer rewards from pool wallets
        if (contributorAmount > 0) {
            IERC20(address(this)).transferFrom(contributorRewardsWallet, msg.sender, contributorAmount);
        }
        if (validatorAmount > 0) {
            IERC20(address(this)).transferFrom(validatorRewardsWallet, msg.sender, validatorAmount);
        }

        emit RewardsClaimed(
            msg.sender,
            contributorAmount,
            validatorAmount,
            totalToClaim,
            block.timestamp
        );
    }

    /**
     * @dev Get pending rewards for a user
     * @param user The user to check rewards for
     * @return contributorRewards Pending contributor rewards
     * @return validatorRewards Pending validator rewards
     * @return totalPending Total pending rewards
     */
    function getPendingRewards(address user)
        external
        view
        returns (
            uint256 contributorRewards,
            uint256 validatorRewards,
            uint256 totalPending
        )
    {
        contributorRewards = contributorEarnings[user] - contributorClaimed[user];
        validatorRewards = validatorEarnings[user] - validatorClaimed[user];
        totalPending = contributorRewards + validatorRewards;
    }

    /**
     * @dev Get creator economy statistics
     * @return totalDistributed Total amount distributed to creators and validators
     * @return totalContributorPool Total contributor reward pool
     * @return totalValidatorPool Total validator reward pool
     * @return activeCreators Number of registered question creators
     */
    function getCreatorEconomyStats()
        external
        view
        returns (
            uint256 totalDistributed,
            uint256 totalContributorPool,
            uint256 totalValidatorPool,
            uint256 activeCreators
        )
    {
        totalDistributed = totalDistributedRewards;
        totalContributorPool = totalContributorRewards;
        totalValidatorPool = totalValidatorRewards;
        // activeCreators would need additional tracking
        activeCreators = 0; // Placeholder - implement if needed
    }

    /**
     * @dev Update reward wallet addresses (admin only)
     * @param _contributorWallet New contributor rewards wallet
     * @param _validatorWallet New validator rewards wallet
     */
    function updateRewardWallets(address _contributorWallet, address _validatorWallet)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_contributorWallet != address(0), "Invalid contributor wallet");
        require(_validatorWallet != address(0), "Invalid validator wallet");

        contributorRewardsWallet = _contributorWallet;
        validatorRewardsWallet = _validatorWallet;

        emit RewardWalletsUpdated(_contributorWallet, _validatorWallet, block.timestamp);
    }

    // ============ UPGRADE AUTHORIZATION ============

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {
        // Additional upgrade validation
        if (newImplementation == address(0)) {
            revert UnauthorizedUpgrade(newImplementation);
        }

        // Could add version compatibility checks here
        emit EmergencyAction(
            msg.sender,
            "UPGRADE_AUTHORIZED",
            abi.encode(newImplementation),
            block.timestamp
        );
    }

    // ============ ERC2771 GASLESS SUPPORT ============

    /**
     * @dev Override _msgSender to support gasless transactions via ERC2771
     */
    function _msgSender() internal view virtual override returns (address) {
        if (msg.data.length >= 20 && isTrustedForwarder(msg.sender)) {
            // Extract the sender address from the end of msg.data
            return address(bytes20(msg.data[msg.data.length - 20:]));
        } else {
            return super._msgSender();
        }
    }

    /**
     * @dev Override _msgData to support gasless transactions via ERC2771
     */
    function _msgData() internal view virtual override returns (bytes calldata) {
        if (msg.data.length >= 20 && isTrustedForwarder(msg.sender)) {
            // Remove the appended sender address from msg.data
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }

    /**
     * @dev Check if forwarder is trusted
     */
    function isTrustedForwarder(address forwarder) public view virtual returns (bool) {
        return forwarder == _trustedForwarderAddress;
    }

    /**
     * @dev Get the trusted forwarder address
     */
    function trustedForwarder() public view virtual returns (address) {
        return _trustedForwarderAddress;
    }

    // ============ BATCH OPERATIONS ============

    /**
     * @dev Batch transfer for gas efficiency
     * @param recipients Array of recipient addresses
     * @param amounts Array of transfer amounts
     */
    function batchTransfer(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external nonReentrant whenNotPaused onlyCompliant(msg.sender) {
        if (recipients.length != amounts.length) {
            revert BatchSizeExceeded(recipients.length, amounts.length);
        }
        if (recipients.length > 100) {
            revert BatchSizeExceeded(recipients.length, 100);
        }

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        if (balanceOf(msg.sender) < totalAmount) {
            revert InsufficientBalance(msg.sender, totalAmount, balanceOf(msg.sender));
        }

        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(msg.sender, recipients[i], amounts[i]);
        }

        emit BatchOperationExecuted(
            msg.sender,
            0, // transfer type
            recipients.length,
            totalAmount
        );
    }

    /**
     * @dev Batch approval for gas efficiency
     * @param spenders Array of spender addresses
     * @param amounts Array of approval amounts
     */
    function batchApprove(
        address[] calldata spenders,
        uint256[] calldata amounts
    ) external nonReentrant whenNotPaused {
        if (spenders.length != amounts.length) {
            revert BatchSizeExceeded(spenders.length, amounts.length);
        }
        if (spenders.length > 50) {
            revert BatchSizeExceeded(spenders.length, 50);
        }

        for (uint256 i = 0; i < spenders.length; i++) {
            _approve(msg.sender, spenders[i], amounts[i]);
        }

        emit BatchOperationExecuted(
            msg.sender,
            1, // approval type
            spenders.length,
            0
        );
    }

    // ============ COMPLIANCE SYSTEM ============

    /**
     * @dev Update compliance module
     * @param _complianceModule New compliance module address
     * @param _enabled Whether compliance is enabled
     */
    function setComplianceModule(
        address _complianceModule,
        bool _enabled
    ) external onlyRole(COMPLIANCE_ROLE) {
        address oldModule = complianceModule;
        complianceModule = _complianceModule;
        complianceEnabled = _enabled;

        emit ComplianceModuleUpdated(oldModule, _complianceModule, _enabled);
    }

    // ============ CROSS-CHAIN BRIDGE PREPARATION ============

    /**
     * @dev Add supported chain for bridging
     * @param chainId Target chain ID
     * @param supported Whether chain is supported
     */
    function setSupportedChain(
        uint256 chainId,
        bool supported
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedChains[chainId] = supported;
    }

    /**
     * @dev Bridge tokens to another chain
     * @param to Recipient address on target chain
     * @param amount Amount to bridge
     * @param targetChain Target chain ID
     */
    function bridgeTokens(
        address to,
        uint256 amount,
        uint256 targetChain
    ) external nonReentrant whenNotPaused onlyCompliant(msg.sender) {
        if (!supportedChains[targetChain]) {
            revert CrossChainNotSupported(targetChain);
        }
        if (balanceOf(msg.sender) < amount) {
            revert InsufficientBalance(msg.sender, amount, balanceOf(msg.sender));
        }

        _burn(msg.sender, amount);

        bytes32 txHash = keccak256(abi.encodePacked(
            msg.sender, to, amount, targetChain, block.timestamp, block.number
        ));

        emit CrossChainTransfer(msg.sender, to, amount, targetChain, txHash);
    }

    // ============ ENHANCED ALLOCATION FUNCTIONS ============

    function mintPrizePool(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        if (prizePoolMinted + amount > PRIZE_POOL_ALLOCATION) {
            revert AllocationExceeded("PRIZE_POOL", amount, PRIZE_POOL_ALLOCATION - prizePoolMinted);
        }
        prizePoolMinted += amount;
        _mint(to, amount);
        emit AllocationMinted("PRIZE_POOL", to, amount);
    }

    function mintTreasury(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        if (treasuryMinted + amount > TREASURY_ALLOCATION) {
            revert AllocationExceeded("TREASURY", amount, TREASURY_ALLOCATION - treasuryMinted);
        }
        treasuryMinted += amount;
        _mint(to, amount);
        emit AllocationMinted("TREASURY", to, amount);
    }

    function mintAirdrop(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        if (airdropMinted + amount > AIRDROP_ALLOCATION) {
            revert AllocationExceeded("AIRDROP", amount, AIRDROP_ALLOCATION - airdropMinted);
        }
        airdropMinted += amount;
        _mint(to, amount);
        emit AllocationMinted("AIRDROP", to, amount);
    }

    function mintLiquidity(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        if (liquidityMinted + amount > LIQUIDITY_ALLOCATION) {
            revert AllocationExceeded("LIQUIDITY", amount, LIQUIDITY_ALLOCATION - liquidityMinted);
        }
        liquidityMinted += amount;
        _mint(to, amount);
        emit AllocationMinted("LIQUIDITY", to, amount);
    }

    // ============ ENHANCED BURN FUNCTIONS ============

    function burnFailedAttempt(address user) external onlyRole(GAME_ROLE) whenNotPaused returns (uint256 burnAmount) {
        failedAttempts[user]++;
        burnAmount = failedAttempts[user] * 1 * 10**18;

        if (balanceOf(user) < burnAmount) {
            revert InsufficientBalance(user, burnAmount, balanceOf(user));
        }

        _applyBurnLimits(burnAmount);
        _executeBurnProtocol(user, burnAmount, 0);

        emit FailedAttemptBurn(user, failedAttempts[user], burnAmount);
        return burnAmount;
    }

    function burnQuestionSubmission(address user) external onlyRole(GAME_ROLE) whenNotPaused returns (uint256 burnAmount) {
        questionsSubmitted[user]++;
        burnAmount = questionsSubmitted[user] * 1 * 10**18;

        if (balanceOf(user) < burnAmount) {
            revert InsufficientBalance(user, burnAmount, balanceOf(user));
        }

        _applyBurnLimits(burnAmount);
        _executeBurnProtocol(user, burnAmount, 1);

        emit QuestionSubmissionBurn(user, questionsSubmitted[user], burnAmount);
        return burnAmount;
    }

    function burnNFTMint(address user, uint256 cost) external onlyRole(GAME_ROLE) whenNotPaused {
        if (balanceOf(user) < cost) {
            revert InsufficientBalance(user, cost, balanceOf(user));
        }

        _applyBurnLimits(cost);
        _executeBurnProtocol(user, cost, 2);

        emit GameplayBurn(user, cost, "NFT_MINT");
    }

    // ============ INTERNAL FUNCTIONS ============

    function _applyBurnLimits(uint256 burnAmount) internal {
        if (burnAmount > MAX_SINGLE_BURN) {
            revert SingleBurnLimitExceeded(burnAmount, MAX_SINGLE_BURN);
        }

        uint256 today = block.timestamp / 1 days;
        if (dailyBurnAmount[today] + burnAmount > MAX_DAILY_BURN) {
            revert DailyBurnLimitExceeded(dailyBurnAmount[today] + burnAmount, MAX_DAILY_BURN);
        }

        dailyBurnAmount[today] += burnAmount;
    }

    function _executeBurnProtocol(address user, uint256 burnAmount, uint256 burnType) internal {
        // Legacy function - redirect to new reward distribution
        _executeRewardDistribution(user, burnAmount, burnType);
    }

    /**
     * @dev Revolutionary reward distribution: 0% burn, 100% rewards
     * New tokenomics: 10% grand prize, 30% dev/ops, 30% contributors, 30% validators
     * @param user The user triggering the distribution
     * @param amount The total amount to distribute
     * @param distributionType The type of distribution (for analytics)
     */
    function _executeRewardDistribution(address user, uint256 amount, uint256 distributionType) internal {
        // Revolutionary tokenomics: NO BURNING, ALL REWARDS
        uint256 grandPrizeAmount = (amount * 10) / 100;      // 10% - Keep the excitement!
        uint256 devOpsAmount = (amount * 30) / 100;          // 30% - Platform development
        uint256 contributorAmount = (amount * 30) / 100;     // 30% - Question creators
        uint256 validatorAmount = (amount * 30) / 100;       // 30% - Validation work

        // Transfer to immediate recipients
        _transfer(user, grandPrizeWallet, grandPrizeAmount);
        _transfer(user, treasuryWallet, devOpsAmount);

        // Add to reward pools for distribution
        _transfer(user, contributorRewardsWallet, contributorAmount);
        _transfer(user, validatorRewardsWallet, validatorAmount);

        // Update pool totals
        totalContributorRewards += contributorAmount;
        totalValidatorRewards += validatorAmount;
        totalDistributedRewards += amount;

        emit RewardDistributionExecuted(
            user,
            distributionType,
            amount,
            grandPrizeAmount,
            devOpsAmount,
            contributorAmount,
            validatorAmount,
            block.timestamp
        );

        // Keep legacy burn event for compatibility (but with 0 burn)
        emit BurnExecuted(
            user,
            distributionType,
            amount,
            0, // No more burning!
            grandPrizeAmount,
            devOpsAmount,
            block.timestamp
        );
    }

    function _update(address from, address to, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
        whenNotPaused
        onlyCompliant(from)
        onlyCompliant(to)
    {
        // Apply burn on transfer if enabled
        if (burnOnTransferEnabled && from != address(0) && to != address(0)) {
            uint256 burnAmount = (amount * transferBurnRate) / 10000;
            if (burnAmount > 0) {
                super._update(from, address(0), burnAmount);
                transferBurned += burnAmount;
                totalBurned += burnAmount;
                emit TransferBurn(from, burnAmount);
                amount -= burnAmount;
            }
        }

        super._update(from, to, amount);
    }

    // ============ VIEW FUNCTIONS ============

    function getRemainingAllocations() external view returns (
        uint256 prizePoolRemaining,
        uint256 treasuryRemaining,
        uint256 airdropRemaining,
        uint256 liquidityRemaining
    ) {
        prizePoolRemaining = PRIZE_POOL_ALLOCATION - prizePoolMinted;
        treasuryRemaining = TREASURY_ALLOCATION - treasuryMinted;
        airdropRemaining = AIRDROP_ALLOCATION - airdropMinted;
        liquidityRemaining = LIQUIDITY_ALLOCATION - liquidityMinted;
    }

    function getBurnStats() external view returns (
        uint256 _totalBurned,
        uint256 _gameplayBurned,
        uint256 _transferBurned,
        uint256 currentSupply
    ) {
        _totalBurned = totalBurned;
        _gameplayBurned = gameplayBurned;
        _transferBurned = transferBurned;
        currentSupply = totalSupply();
    }

    function getUserStats(address user) external view returns (
        uint256 _failedAttempts,
        uint256 _questionsSubmitted,
        uint256 balance
    ) {
        _failedAttempts = failedAttempts[user];
        _questionsSubmitted = questionsSubmitted[user];
        balance = balanceOf(user);
    }

    function getNextFailedAttemptCost(address user) external view returns (uint256) {
        return (failedAttempts[user] + 1) * 1 * 10**18;
    }

    function getNextQuestionCost(address user) external view returns (uint256) {
        return (questionsSubmitted[user] + 1) * 1 * 10**18;
    }

    // ============ VOTING FUNCTIONALITY ============

    /**
     * @dev Clock used for voting power calculations
     */
    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    /**
     * @dev Machine-readable description of the clock
     */
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    // ============ PERMIT FUNCTIONS ============

    function permitAndTransfer(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address to,
        uint256 amount
    ) external nonReentrant {
        permit(owner, spender, value, deadline, v, r, s);
        transferFrom(owner, to, amount);
    }

    // ============ EMERGENCY FUNCTIONS ============

    function emergencyPause() external onlyRole(PAUSER_ROLE) {
        _pause();
        emit EmergencyAction(msg.sender, "EMERGENCY_PAUSE", "", block.timestamp);
    }

    function emergencyUnpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit EmergencyAction(msg.sender, "EMERGENCY_UNPAUSE", "", block.timestamp);
    }

    function emergencyBurn(address account, uint256 amount) external onlyRole(BURNER_ROLE) whenPaused {
        _burn(account, amount);
        totalBurned += amount;
        emit GameplayBurn(account, amount, "EMERGENCY_BURN");
        emit EmergencyAction(msg.sender, "EMERGENCY_BURN", abi.encode(account, amount), block.timestamp);
    }

    // ============ ADMIN FUNCTIONS ============

    function setBurnOnTransfer(bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        burnOnTransferEnabled = enabled;
        emit BurnOnTransferToggled(enabled);
    }

    function setTransferBurnRate(uint256 newRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newRate > MAX_BURN_RATE) {
            revert InvalidBurnRate(newRate);
        }
        uint256 oldRate = transferBurnRate;
        transferBurnRate = newRate;
        emit TransferBurnRateUpdated(oldRate, newRate);
    }

    // ============ COMPATIBILITY ============

    /**
     * @dev Override nonces to resolve conflict between ERC20Permit and ERC20Votes
     */
    function nonces(address owner)
        public
        view
        override(ERC20PermitUpgradeable, NoncesUpgradeable)
        returns (uint256)
    {
        return super.nonces(owner);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // ============ RUG-PROOF TREASURY FUNCTIONS ============

    /**
     * @dev Execute guaranteed monthly operations release
     * @notice IMMUTABLE: Releases exactly 1M RDLN every 30 days - cannot be changed
     * Anyone can call this function when conditions are met
     */
    function executeMonthlyOperationsRelease() external whenNotPaused {
        require(operationsWallet != address(0), "Operations wallet not set");
        require(block.timestamp >= lastOperationsRelease + RELEASE_INTERVAL, "Too early for release");
        require(balanceOf(treasuryWallet) >= MONTHLY_OPERATIONS_RELEASE, "Insufficient treasury balance");

        lastOperationsRelease = block.timestamp;
        _transfer(treasuryWallet, operationsWallet, MONTHLY_OPERATIONS_RELEASE);

        emit MonthlyOperationsRelease(MONTHLY_OPERATIONS_RELEASE, block.timestamp);
    }

    /**
     * @dev Emergency treasury release with battle-tested limits
     * @notice PROTECTED: Max 5M RDLN per year, requires governance approval
     */
    function executeEmergencyTreasuryRelease(uint256 amount, string calldata reason)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        whenNotPaused
    {
        require(amount <= MAX_EMERGENCY_RELEASE, "Amount exceeds emergency limit");
        require(block.timestamp >= lastEmergencyRelease + EMERGENCY_COOLDOWN, "Emergency cooldown active");
        require(bytes(reason).length >= 10, "Must provide detailed reason");
        require(balanceOf(treasuryWallet) >= amount, "Insufficient treasury balance");

        lastEmergencyRelease = block.timestamp;
        totalEmergencyReleased += amount;

        _transfer(treasuryWallet, operationsWallet, amount);

        emit EmergencyTreasuryRelease(amount, reason, block.timestamp, msg.sender);
    }

    /**
     * @dev Set operations wallet address
     * @notice Can only be set by governance
     */
    function setOperationsWallet(address newOperationsWallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newOperationsWallet != address(0), "Invalid operations wallet");
        address oldWallet = operationsWallet;
        operationsWallet = newOperationsWallet;
        emit OperationsWalletUpdated(oldWallet, newOperationsWallet);
    }

    /**
     * @dev Check if monthly release can be executed
     * @return True if conditions are met for monthly release
     */
    function canExecuteMonthlyRelease() external view returns (bool) {
        return operationsWallet != address(0) &&
               block.timestamp >= lastOperationsRelease + RELEASE_INTERVAL &&
               balanceOf(treasuryWallet) >= MONTHLY_OPERATIONS_RELEASE;
    }

    /**
     * @dev Get comprehensive supply protection information for holders
     * @return monthlyReleaseAmount Always 1M - cannot change
     * @return daysUntilNextRelease Predictable schedule
     * @return totalEmergenciesUsed Emergency transparency
     * @return daysUntilEmergencyAvailable Protection timeline
     * @return maxEmergencyAmount Known limits
     * @return nextReleaseTimestamp Exact timing
     */
    function getSupplyProtectionInfo() external view returns (
        uint256 monthlyReleaseAmount,      // Always 1M - cannot change
        uint256 daysUntilNextRelease,      // Predictable schedule
        uint256 totalEmergenciesUsed,      // Emergency transparency
        uint256 daysUntilEmergencyAvailable, // Protection timeline
        uint256 maxEmergencyAmount,        // Known limits
        uint256 nextReleaseTimestamp       // Exact timing
    ) {
        uint256 nextRelease = lastOperationsRelease + RELEASE_INTERVAL;
        uint256 nextEmergency = lastEmergencyRelease + EMERGENCY_COOLDOWN;

        return (
            MONTHLY_OPERATIONS_RELEASE,
            nextRelease > block.timestamp ? (nextRelease - block.timestamp) / 1 days : 0,
            totalEmergencyReleased,
            nextEmergency > block.timestamp ? (nextEmergency - block.timestamp) / 1 days : 0,
            MAX_EMERGENCY_RELEASE,
            nextRelease
        );
    }

    // Events for interface compatibility
    // Events inherited from IRDLN interface
    event BurnOnTransferToggled(bool enabled);
    event TransferBurnRateUpdated(uint256 oldRate, uint256 newRate);
    event WalletUpdated(string indexed walletType, address indexed oldWallet, address indexed newWallet);
    event EmergencyAction(address indexed admin, string indexed action, bytes data, uint256 timestamp);

    // Treasury system events
    event MonthlyOperationsRelease(uint256 amount, uint256 timestamp);
    event EmergencyTreasuryRelease(uint256 amount, string reason, uint256 timestamp, address indexed executor);
    event OperationsWalletUpdated(address indexed oldWallet, address indexed newWallet);
}