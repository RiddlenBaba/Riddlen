# 🔒 Riddlen Security Standards & Best Practices (2025)

**Date**: 2025-09-30
**Status**: Established Standards - ALL Contracts Must Follow
**Source**: Analyzed from existing contracts (RDLN, RON, NFT, RiddleSubmissionManager)

---

## ✅ Mandatory Security Features

### 1. **OpenZeppelin Upgradeable Patterns**
```solidity
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MyContract is
    Initializable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
}
```

### 2. **Role-Based Access Control**
```solidity
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

function initialize(..., address _admin) public initializer {
    __AccessControl_init();
    __ReentrancyGuard_init();
    __Pausable_init();
    __UUPSUpgradeable_init();

    _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    _grantRole(ADMIN_ROLE, _admin);
    _grantRole(UPGRADER_ROLE, _admin);
    _grantRole(PAUSER_ROLE, _admin);
}

function _authorizeUpgrade(address newImplementation)
    internal
    override
    onlyRole(UPGRADER_ROLE)
{}
```

### 3. **Circuit Breakers**
```solidity
// Maximum limits
uint256 public constant MAX_DAILY_OPERATIONS = X;
uint256 public constant MAX_SINGLE_OPERATION = Y;

// Tracking
mapping(uint256 => uint256) public dailyOperationAmount; // day => amount

modifier circuitBreaker(uint256 amount) {
    uint256 today = block.timestamp / 1 days;

    require(amount <= MAX_SINGLE_OPERATION, "Exceeds single operation limit");
    require(
        dailyOperationAmount[today] + amount <= MAX_DAILY_OPERATIONS,
        "Exceeds daily limit"
    );

    dailyOperationAmount[today] += amount;
    _;
}
```

### 4. **Emergency Functions**
```solidity
// Pause/unpause
function pause() external onlyRole(PAUSER_ROLE) {
    _pause();
    emit EmergencyAction(msg.sender, "PAUSE", "", block.timestamp);
}

function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
    emit EmergencyAction(msg.sender, "UNPAUSE", "", block.timestamp);
}

// Emergency operations (only when paused)
function emergencyOperation(...) external onlyRole(ADMIN_ROLE) whenPaused {
    // Emergency logic
    emit EmergencyAction(msg.sender, "EMERGENCY_OP", abi.encode(...), block.timestamp);
}
```

### 5. **Comprehensive Event Logging**
```solidity
// Detailed events for ALL state changes
event OperationExecuted(
    uint256 indexed operationId,
    address indexed user,
    uint256 amount,
    uint256 timestamp,
    bytes32 dataHash
);

event CircuitBreakerTriggered(
    address indexed user,
    uint256 attemptedAmount,
    uint256 dailyLimit,
    uint256 singleLimit,
    uint256 timestamp
);

event EmergencyAction(
    address indexed admin,
    string indexed action,
    bytes data,
    uint256 timestamp
);

// Log EVERYTHING
emit OperationExecuted(...);
```

### 6. **Reentrancy Protection**
```solidity
// ALL external functions with state changes
function criticalFunction(...)
    external
    nonReentrant  // ✅ ALWAYS
    whenNotPaused // ✅ ALWAYS
{
    // Logic
}
```

### 7. **Input Validation**
```solidity
// Comprehensive checks
require(address != address(0), "Zero address");
require(amount > 0, "Zero amount");
require(amount >= minAmount, "Below minimum");
require(amount <= maxAmount, "Exceeds maximum");
require(bytes(string).length > 0, "Empty string");
require(timestamp > block.timestamp, "Invalid timestamp");

// Custom errors (gas efficient)
error InvalidAddress();
error InvalidAmount();
error BelowMinimum();
error ExceedsMaximum();

if (address == address(0)) revert InvalidAddress();
```

### 8. **Immutable Constants for Limits**
```solidity
// Use constants that cannot be changed
uint256 public constant MAX_LIMIT = 1_000_000 * 10**18;
uint256 public constant MIN_LIMIT = 1_000 * 10**18;
uint256 public constant COOLDOWN_PERIOD = 30 days;
uint256 public constant MAX_EMERGENCY_USES = 5;

// NOT this (can be manipulated):
// uint256 public maxLimit; // ❌ BAD
```

### 9. **Time-Based Rate Limiting**
```solidity
// Cooldown periods
mapping(address => uint256) public lastOperationTime;
uint256 public constant OPERATION_COOLDOWN = 1 hours;

function operationWithCooldown(...) external {
    require(
        block.timestamp >= lastOperationTime[msg.sender] + OPERATION_COOLDOWN,
        "Cooldown active"
    );

    lastOperationTime[msg.sender] = block.timestamp;

    // Operation logic
}
```

### 10. **Transparent Treasury Management**
```solidity
// Fixed release schedules (no admin discretion)
uint256 public constant MONTHLY_RELEASE = 1_000_000 * 10**18; // FIXED
uint256 public constant RELEASE_INTERVAL = 30 days;           // FIXED
uint256 public lastRelease;

function releaseMonthlyOperations() external {
    require(
        block.timestamp >= lastRelease + RELEASE_INTERVAL,
        "Too early"
    );

    lastRelease = block.timestamp;
    token.transfer(operationsWallet, MONTHLY_RELEASE);

    emit MonthlyRelease(MONTHLY_RELEASE, block.timestamp);
}
```

---

## 📊 Standard Contract Structure

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

// Imports (OpenZeppelin upgradeable)
import "@openzeppelin/contracts-upgradeable/...";

/**
 * @title ContractName
 * @dev Description
 *
 * Security Features:
 * - UUPS Upgradeable
 * - Role-based access control
 * - Reentrancy protection
 * - Circuit breakers
 * - Emergency pause
 * - Comprehensive logging
 * - Input validation
 */
contract ContractName is
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
    //                        CONSTANTS
    // =============================================================

    // Immutable limits
    uint256 public constant MAX_SINGLE_OPERATION = X;
    uint256 public constant MAX_DAILY_OPERATIONS = Y;
    uint256 public constant COOLDOWN_PERIOD = 1 hours;

    // =============================================================
    //                        STATE VARIABLES
    // =============================================================

    // Core state
    // ...

    // Circuit breaker tracking
    mapping(uint256 => uint256) public dailyOperationAmount;

    // Rate limiting
    mapping(address => uint256) public lastOperationTime;

    // Statistics
    uint256 public totalOperations;
    uint256 public totalVolume;

    // =============================================================
    //                        EVENTS
    // =============================================================

    event OperationExecuted(...);
    event CircuitBreakerTriggered(...);
    event EmergencyAction(...);

    // =============================================================
    //                        ERRORS
    // =============================================================

    error InvalidInput();
    error ExceedsLimit();
    error Unauthorized();

    // =============================================================
    //                        INITIALIZATION
    // =============================================================

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(...) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);

        // Initialize state
    }

    // =============================================================
    //                        MAIN FUNCTIONS
    // =============================================================

    function mainOperation(...)
        external
        nonReentrant
        whenNotPaused
        circuitBreaker(amount)
    {
        // Validate inputs
        if (input == 0) revert InvalidInput();

        // Business logic

        // Emit events
        emit OperationExecuted(...);
    }

    // =============================================================
    //                        VIEW FUNCTIONS
    // =============================================================

    function getOperationStatus(...) external view returns (...) {
        // Read-only logic
    }

    // =============================================================
    //                        ADMIN FUNCTIONS
    // =============================================================

    function updateParameter(...)
        external
        onlyRole(ADMIN_ROLE)
    {
        // Parameter updates
        emit ParameterUpdated(...);
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
        emit EmergencyAction(msg.sender, "PAUSE", "", block.timestamp);
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit EmergencyAction(msg.sender, "UNPAUSE", "", block.timestamp);
    }

    // =============================================================
    //                        INTERNAL FUNCTIONS
    // =============================================================

    function _internalLogic(...) internal {
        // Internal operations
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}
```

---

## 🔐 Specific Patterns Used

### From RDLNUpgradeable.sol:

1. **Circuit Breakers on Burns**:
```solidity
uint256 public constant MAX_DAILY_BURN = 10_000_000 * 10**18;
uint256 public constant MAX_SINGLE_BURN = 1_000_000 * 10**18;
mapping(uint256 => uint256) public dailyBurnAmount;
```

2. **Emergency Treasury System**:
```solidity
uint256 public constant MAX_EMERGENCY_RELEASE = 5_000_000 * 10**18;
uint256 public constant EMERGENCY_COOLDOWN = 365 days;
uint256 public lastEmergencyRelease;
```

3. **Comprehensive Burn Tracking**:
```solidity
event BurnExecuted(
    address indexed user,
    uint256 indexed burnType,
    uint256 totalAmount,
    uint256 burnedAmount,
    uint256 grandPrizeAmount,
    uint256 devOpsAmount,
    uint256 timestamp
);
```

### From RiddleSubmissionManager.sol:

1. **Era-Based Immutable Economics**:
```solidity
uint256 public immutable GENESIS_TIME;
uint256 public constant BIENNIAL_PERIOD = 730 days;

function getCurrentEra() public view returns (uint256) {
    if (block.timestamp < GENESIS_TIME) return 0;
    return (block.timestamp - GENESIS_TIME) / BIENNIAL_PERIOD;
}
```

2. **Progressive Anti-Spam**:
```solidity
mapping(address => uint256) public userSubmissionCount;

function calculateUserCost(address user) public view returns (uint256) {
    uint256 baseCost = getCurrentCost();
    return baseCost * (userSubmissionCount[user] + 1);
}
```

### From RiddleNFTAdvanced.sol:

1. **Emergency Mode Toggle**:
```solidity
bool public emergencyMode;

function toggleEmergencyMode(string calldata reason) external onlyRole(ADMIN_ROLE) {
    emergencyMode = !emergencyMode;
    emit EmergencyModeToggled(emergencyMode, msg.sender, reason);
}
```

2. **RON Integration** (Reputation System):
```solidity
IRON public ronToken;

function _awardReputation(address user, ...) internal {
    ronToken.awardRON(user, difficulty, isFirst, isSpeed, "context");
}
```

---

## ❌ What to AVOID

1. **Mutable Critical Parameters**:
```solidity
// BAD ❌
uint256 public maxWithdraw; // Admin can change anytime

// GOOD ✅
uint256 public constant MAX_WITHDRAW = 1_000_000 * 10**18;
```

2. **No Input Validation**:
```solidity
// BAD ❌
function transfer(address to, uint256 amount) external {
    _transfer(msg.sender, to, amount);
}

// GOOD ✅
function transfer(address to, uint256 amount) external {
    if (to == address(0)) revert InvalidAddress();
    if (amount == 0) revert InvalidAmount();
    _transfer(msg.sender, to, amount);
}
```

3. **Missing Events**:
```solidity
// BAD ❌
function updateConfig(uint256 newValue) external {
    configValue = newValue;
}

// GOOD ✅
function updateConfig(uint256 newValue) external {
    uint256 oldValue = configValue;
    configValue = newValue;
    emit ConfigUpdated(oldValue, newValue, msg.sender, block.timestamp);
}
```

4. **No Reentrancy Protection**:
```solidity
// BAD ❌
function withdraw(uint256 amount) external {
    token.transfer(msg.sender, amount);
    balance[msg.sender] -= amount;
}

// GOOD ✅
function withdraw(uint256 amount) external nonReentrant {
    balance[msg.sender] -= amount; // Update state first
    token.transfer(msg.sender, amount);
}
```

5. **No Circuit Breakers**:
```solidity
// BAD ❌
function massTransfer(address[] users, uint256[] amounts) external {
    for (uint i = 0; i < users.length; i++) {
        token.transfer(users[i], amounts[i]);
    }
}

// GOOD ✅
function massTransfer(address[] users, uint256[] amounts)
    external
    circuitBreaker(totalAmount)
{
    // Logic
}
```

---

## ✅ Pre-Deployment Checklist

Before deploying ANY contract:

- [ ] Uses OpenZeppelin upgradeable contracts
- [ ] Has UUPS upgradeability
- [ ] Has role-based access control (min 4 roles)
- [ ] Has reentrancy protection on all state-changing functions
- [ ] Has pausable functionality
- [ ] Has circuit breakers for critical operations
- [ ] Has emergency functions (pause/unpause)
- [ ] Has comprehensive event logging
- [ ] Has input validation on all functions
- [ ] Has immutable constants for limits
- [ ] Has rate limiting where appropriate
- [ ] Has transparent treasury management
- [ ] Has constructor with `_disableInitializers()`
- [ ] Has `initialize()` function with proper setup
- [ ] Has `_authorizeUpgrade()` with role check
- [ ] Has detailed NatSpec documentation
- [ ] Follows standard contract structure
- [ ] No hardcoded addresses (passed in initialize)
- [ ] No admin backdoors
- [ ] Clear error messages
- [ ] Tested locally before deployment

---

## 📝 Testing Standards

Every contract must have:

1. **Unit tests** for all functions
2. **Integration tests** with other contracts
3. **Edge case tests** (zero values, max values, etc.)
4. **Access control tests** (unauthorized attempts)
5. **Pause/unpause tests**
6. **Circuit breaker tests**
7. **Reentrancy tests**
8. **Gas profiling**
9. **Upgrade tests** (storage layout preservation)

---

## 🎯 Summary

**Riddlen Security Standards 2025**:
- ✅ OpenZeppelin upgradeable patterns
- ✅ UUPS upgradeability
- ✅ Role-based access control
- ✅ Reentrancy protection
- ✅ Circuit breakers
- ✅ Emergency functions
- ✅ Comprehensive logging
- ✅ Input validation
- ✅ Immutable limits
- ✅ Rate limiting
- ✅ Transparent operations
- ✅ No admin backdoors

**Follow these standards for ALL contracts.**