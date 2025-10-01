// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "../interfaces/IRDLN.sol";

/**
 * @title RDLN - Riddlen Token
 * @dev ERC-20 token with integrated deflationary mechanics for the Riddlen ecosystem
 * @notice Features burn mechanisms, prize pool management, and gaming integration
 *
 * Total Supply: 1,000,000,000 RDLN
 * Allocation:
 * - 700M RDLN: Prize pools (70%)
 * - 100M RDLN: Treasury (10%)
 * - 100M RDLN: Community airdrop (10%)
 * - 100M RDLN: Liquidity (10%)
 */
contract RDLN is ERC20, ERC20Burnable, ERC20Permit, ERC20Votes, AccessControl, ReentrancyGuard, Pausable, IRDLN {

    // ============ CONSTANTS ============

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant GAME_ROLE = keccak256("GAME_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Token distribution constants
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion RDLN
    uint256 public constant PRIZE_POOL_ALLOCATION = 700_000_000 * 10**18; // 70%
    uint256 public constant TREASURY_ALLOCATION = 100_000_000 * 10**18; // 10%
    uint256 public constant AIRDROP_ALLOCATION = 100_000_000 * 10**18; // 10%
    uint256 public constant LIQUIDITY_ALLOCATION = 100_000_000 * 10**18; // 10%

    // ============ STATE VARIABLES ============

    // Allocation tracking
    uint256 public prizePoolMinted;
    uint256 public treasuryMinted;
    uint256 public airdropMinted;
    uint256 public liquidityMinted;

    // Burn tracking for deflationary mechanics
    uint256 public totalBurned;
    uint256 public gameplayBurned; // Burns from failed attempts, rejections
    uint256 public transferBurned; // Burns from transfer fees (if enabled)

    // Game mechanics
    mapping(address => uint256) public failedAttempts; // Track failed attempts per user
    mapping(address => uint256) public questionsSubmitted; // Track questions per user

    // Wallets for allocations
    address public treasuryWallet;
    address public liquidityWallet;
    address public airdropWallet;
    address public grandPrizeWallet; // Grand Prize accumulation wallet

    // Deflationary settings
    bool public burnOnTransferEnabled;
    uint256 public transferBurnRate = 100; // 1% burn on transfers (100/10000)
    uint256 public constant MAX_BURN_RATE = 500; // Max 5% burn rate

    // Circuit breaker mechanisms (following best practices)
    uint256 public constant MAX_DAILY_BURN = 10_000_000 * 10**18; // 10M RDLN per day
    uint256 public constant MAX_SINGLE_BURN = 1_000_000 * 10**18; // 1M RDLN per transaction
    mapping(uint256 => uint256) public dailyBurnAmount; // day => amount burned

    // ============ EVENTS ============

    // Enhanced event logging (following 2025 best practices)
    event BurnExecuted(
        address indexed user,
        uint256 indexed burnType, // 0=failed_attempt, 1=question, 2=nft_mint
        uint256 totalAmount,
        uint256 burnedAmount,
        uint256 grandPrizeAmount,
        uint256 devOpsAmount,
        uint256 timestamp
    );

    event CircuitBreakerTriggered(
        address indexed user,
        uint256 attemptedAmount,
        uint256 dailyLimit,
        uint256 singleLimit,
        uint256 timestamp
    );

    event SnapshotCreated(
        uint256 indexed snapshotId,
        address indexed creator,
        uint256 totalSupply,
        uint256 timestamp
    );

    event EmergencyAction(
        address indexed admin,
        string indexed action,
        bytes data,
        uint256 timestamp
    );

    // Legacy events (maintained for backward compatibility)
    event BurnOnTransferToggled(bool enabled);
    event TransferBurnRateUpdated(uint256 oldRate, uint256 newRate);
    event WalletUpdated(string indexed walletType, address indexed oldWallet, address indexed newWallet);

    // ============ ERRORS ============

    error AllocationExceeded(string allocationType, uint256 requested, uint256 remaining);
    error InvalidAddress(address addr);
    error InvalidBurnRate(uint256 rate);
    error InsufficientBalance(address user, uint256 required, uint256 available);
    error GameContractOnly();
    error DailyBurnLimitExceeded(uint256 requested, uint256 dailyLimit);
    error SingleBurnLimitExceeded(uint256 requested, uint256 singleLimit);

    // ============ CONSTRUCTOR ============

    constructor(
        address _admin,
        address _treasuryWallet,
        address _liquidityWallet,
        address _airdropWallet,
        address _grandPrizeWallet
    ) ERC20("Riddlen", "RDLN") ERC20Permit("Riddlen") {
        if (_admin == address(0)) revert InvalidAddress(_admin);
        if (_treasuryWallet == address(0)) revert InvalidAddress(_treasuryWallet);
        if (_liquidityWallet == address(0)) revert InvalidAddress(_liquidityWallet);
        if (_airdropWallet == address(0)) revert InvalidAddress(_airdropWallet);
        if (_grandPrizeWallet == address(0)) revert InvalidAddress(_grandPrizeWallet);

        treasuryWallet = _treasuryWallet;
        liquidityWallet = _liquidityWallet;
        airdropWallet = _airdropWallet;
        grandPrizeWallet = _grandPrizeWallet;

        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _admin);
        _grantRole(BURNER_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);

        // Initial mint for immediate needs (small allocation for initial setup)
        _mint(_admin, 1_000_000 * 10**18); // 1M RDLN for initial setup
    }

    // ============ ALLOCATION MINTING ============

    /**
     * @dev Mint tokens for prize pool allocation
     */
    function mintPrizePool(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        if (prizePoolMinted + amount > PRIZE_POOL_ALLOCATION) {
            revert AllocationExceeded("PRIZE_POOL", amount, PRIZE_POOL_ALLOCATION - prizePoolMinted);
        }

        prizePoolMinted += amount;
        _mint(to, amount);
        emit AllocationMinted("PRIZE_POOL", to, amount);
    }

    /**
     * @dev Mint tokens for treasury allocation
     */
    function mintTreasury(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        if (treasuryMinted + amount > TREASURY_ALLOCATION) {
            revert AllocationExceeded("TREASURY", amount, TREASURY_ALLOCATION - treasuryMinted);
        }

        treasuryMinted += amount;
        _mint(to, amount);
        emit AllocationMinted("TREASURY", to, amount);
    }

    /**
     * @dev Mint tokens for airdrop allocation
     */
    function mintAirdrop(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        if (airdropMinted + amount > AIRDROP_ALLOCATION) {
            revert AllocationExceeded("AIRDROP", amount, AIRDROP_ALLOCATION - airdropMinted);
        }

        airdropMinted += amount;
        _mint(to, amount);
        emit AllocationMinted("AIRDROP", to, amount);
    }

    /**
     * @dev Mint tokens for liquidity allocation
     */
    function mintLiquidity(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        if (liquidityMinted + amount > LIQUIDITY_ALLOCATION) {
            revert AllocationExceeded("LIQUIDITY", amount, LIQUIDITY_ALLOCATION - liquidityMinted);
        }

        liquidityMinted += amount;
        _mint(to, amount);
        emit AllocationMinted("LIQUIDITY", to, amount);
    }

    // ============ CIRCUIT BREAKER MODIFIERS ============

    /**
     * @dev Circuit breaker to prevent excessive burns
     * @param burnAmount Amount to be burned
     */
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

    // ============ GAME MECHANICS INTEGRATION ============

    /**
     * @dev Burn tokens for failed riddle attempts (progressive cost)
     * @param user Address of the user making the attempt
     * @return burnAmount Amount of tokens burned
     */
    function burnFailedAttempt(address user) external onlyRole(GAME_ROLE) whenNotPaused returns (uint256 burnAmount) {
        failedAttempts[user]++;
        burnAmount = failedAttempts[user] * 1 * 10**18; // N RDLN for Nth failed attempt

        if (balanceOf(user) < burnAmount) {
            revert InsufficientBalance(user, burnAmount, balanceOf(user));
        }

        // Apply circuit breaker for security
        if (burnAmount > MAX_SINGLE_BURN) {
            revert SingleBurnLimitExceeded(burnAmount, MAX_SINGLE_BURN);
        }

        uint256 today = block.timestamp / 1 days;
        if (dailyBurnAmount[today] + burnAmount > MAX_DAILY_BURN) {
            revert DailyBurnLimitExceeded(dailyBurnAmount[today] + burnAmount, MAX_DAILY_BURN);
        }

        dailyBurnAmount[today] += burnAmount;

        // Implement burn protocol: 50% burned, 25% Grand Prize, 25% dev/ops
        uint256 actualBurn = (burnAmount * 50) / 100;
        uint256 grandPrizeAmount = (burnAmount * 25) / 100;
        uint256 devOpsAmount = burnAmount - actualBurn - grandPrizeAmount;

        _burn(user, actualBurn);
        _transfer(user, grandPrizeWallet, grandPrizeAmount);
        _transfer(user, treasuryWallet, devOpsAmount); // Using treasury as dev/ops wallet

        gameplayBurned += actualBurn;
        totalBurned += actualBurn;

        // Enhanced event logging
        emit BurnExecuted(
            user,
            0, // failed_attempt type
            burnAmount,
            actualBurn,
            grandPrizeAmount,
            devOpsAmount,
            block.timestamp
        );

        // Legacy events for backward compatibility
        emit FailedAttemptBurn(user, failedAttempts[user], burnAmount);
        emit GameplayBurn(user, actualBurn, "FAILED_ATTEMPT");

        return burnAmount;
    }

    /**
     * @dev Burn tokens for question submission (progressive cost)
     * @param user Address of the user submitting the question
     * @return burnAmount Amount of tokens burned
     */
    function burnQuestionSubmission(address user) external onlyRole(GAME_ROLE) whenNotPaused returns (uint256 burnAmount) {
        questionsSubmitted[user]++;
        burnAmount = questionsSubmitted[user] * 1 * 10**18; // N RDLN for Nth question

        if (balanceOf(user) < burnAmount) {
            revert InsufficientBalance(user, burnAmount, balanceOf(user));
        }

        // Implement burn protocol: 50% burned, 25% Grand Prize, 25% dev/ops
        uint256 actualBurn = (burnAmount * 50) / 100;
        uint256 grandPrizeAmount = (burnAmount * 25) / 100;
        uint256 devOpsAmount = burnAmount - actualBurn - grandPrizeAmount;

        _burn(user, actualBurn);
        _transfer(user, grandPrizeWallet, grandPrizeAmount);
        _transfer(user, treasuryWallet, devOpsAmount); // Using treasury as dev/ops wallet

        gameplayBurned += actualBurn;
        totalBurned += actualBurn;

        emit QuestionSubmissionBurn(user, questionsSubmitted[user], burnAmount);
        emit GameplayBurn(user, actualBurn, "QUESTION_SUBMISSION");

        return burnAmount;
    }

    /**
     * @dev Burn tokens for NFT minting (riddle attempts)
     * @param user Address of the user minting NFT
     * @param cost Cost in RDLN for the NFT mint
     */
    function burnNFTMint(address user, uint256 cost) external onlyRole(GAME_ROLE) whenNotPaused {
        if (balanceOf(user) < cost) {
            revert InsufficientBalance(user, cost, balanceOf(user));
        }

        // Implement burn protocol: 50% burned, 25% Grand Prize, 25% dev/ops
        uint256 actualBurn = (cost * 50) / 100;
        uint256 grandPrizeAmount = (cost * 25) / 100;
        uint256 devOpsAmount = cost - actualBurn - grandPrizeAmount;

        _burn(user, actualBurn);
        _transfer(user, grandPrizeWallet, grandPrizeAmount);
        _transfer(user, treasuryWallet, devOpsAmount); // Using treasury as dev/ops wallet

        gameplayBurned += actualBurn;
        totalBurned += actualBurn;

        emit GameplayBurn(user, actualBurn, "NFT_MINT");
    }

    // ============ DEFLATIONARY MECHANICS ============


    /**
     * @dev Enable/disable burn on transfer mechanism
     */
    function setBurnOnTransfer(bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        burnOnTransferEnabled = enabled;
        emit BurnOnTransferToggled(enabled);
    }

    /**
     * @dev Update transfer burn rate (max 5%)
     */
    function setTransferBurnRate(uint256 newRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newRate > MAX_BURN_RATE) revert InvalidBurnRate(newRate);

        uint256 oldRate = transferBurnRate;
        transferBurnRate = newRate;
        emit TransferBurnRateUpdated(oldRate, newRate);
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @dev Update treasury wallet
     */
    function setTreasuryWallet(address newWallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newWallet == address(0)) revert InvalidAddress(newWallet);
        address oldWallet = treasuryWallet;
        treasuryWallet = newWallet;
        emit WalletUpdated("TREASURY", oldWallet, newWallet);
    }

    /**
     * @dev Update liquidity wallet
     */
    function setLiquidityWallet(address newWallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newWallet == address(0)) revert InvalidAddress(newWallet);
        address oldWallet = liquidityWallet;
        liquidityWallet = newWallet;
        emit WalletUpdated("LIQUIDITY", oldWallet, newWallet);
    }

    /**
     * @dev Update airdrop wallet
     */
    function setAirdropWallet(address newWallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newWallet == address(0)) revert InvalidAddress(newWallet);
        address oldWallet = airdropWallet;
        airdropWallet = newWallet;
        emit WalletUpdated("AIRDROP", oldWallet, newWallet);
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

    // ============ VIEW FUNCTIONS ============

    /**
     * @dev Get remaining allocation amounts
     */
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

    /**
     * @dev Get burn statistics
     */
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

    /**
     * @dev Get user gameplay statistics
     */
    function getUserStats(address user) external view returns (
        uint256 _failedAttempts,
        uint256 _questionsSubmitted,
        uint256 balance
    ) {
        _failedAttempts = failedAttempts[user];
        _questionsSubmitted = questionsSubmitted[user];
        balance = balanceOf(user);
    }

    /**
     * @dev Calculate next burn cost for failed attempt
     */
    function getNextFailedAttemptCost(address user) external view returns (uint256) {
        return (failedAttempts[user] + 1) * 1 * 10**18;
    }

    /**
     * @dev Calculate next burn cost for question submission
     */
    function getNextQuestionCost(address user) external view returns (uint256) {
        return (questionsSubmitted[user] + 1) * 1 * 10**18;
    }

    // ============ EMERGENCY FUNCTIONS ============

    /**
     * @dev Emergency burn function for admin use
     */
    function emergencyBurn(address account, uint256 amount) external onlyRole(BURNER_ROLE) whenPaused {
        _burn(account, amount);
        totalBurned += amount;
        emit GameplayBurn(account, amount, "EMERGENCY_BURN");
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

    /**
     * @dev Gasless approval + transfer in one transaction
     * @notice Enables users to approve and transfer without separate transactions
     */
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

    // ============ OVERRIDE FUNCTIONS ============

    /**
     * @dev Override for _update to handle pause and snapshot functionality
     */
    function _update(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
        whenNotPaused
    {
        // Apply burn on transfer if enabled (exclude minting and burning)
        if (burnOnTransferEnabled && from != address(0) && to != address(0)) {
            uint256 burnAmount = (amount * transferBurnRate) / 10000;
            if (burnAmount > 0) {
                // Burn tokens before the transfer
                ERC20Votes._update(from, address(0), burnAmount);
                transferBurned += burnAmount;
                totalBurned += burnAmount;
                emit TransferBurn(from, burnAmount);

                // Reduce the amount to transfer by the burn amount
                amount -= burnAmount;
            }
        }

        ERC20Votes._update(from, to, amount);
    }

    // ============ COMPATIBILITY ============

    /**
     * @dev Override nonces to resolve conflict between ERC20Permit and ERC20Votes
     */
    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }

    /**
     * @dev Override required by Solidity for multiple inheritance
     */
    function supportsInterface(bytes4 interfaceId) public view override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}