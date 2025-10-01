# TreasuryDrip Contract Specification

## Overview

The `RiddlenTreasuryDripAutomated` contract is a production-ready automated treasury distribution system designed for gaming protocols. It provides secure, automated monthly token releases with comprehensive monitoring and failsafe mechanisms.

## Core Features

### 🔄 Automated Distribution
- **Monthly Releases**: 1M RDLN base amount every 30 days
- **Dynamic Scaling**: Configurable release multiplier (1.0x to 5.0x)
- **Automation Compatible**: Chainlink Automation and Gelato integration
- **Safety Caps**: Maximum 10M RDLN per release period

### 🛡️ Security Features
- **Circuit Breaker**: Automatic pause after 3 consecutive failures
- **Timelock**: 7-day delay for critical changes
- **Emergency Safeguards**: Low balance monitoring and emergency procedures
- **Access Control**: Owner-only functions with two-step ownership transfer
- **Reentrancy Protection**: Full ReentrancyGuard implementation

### 📊 Monitoring & Analytics
- **Comprehensive Events**: Full audit trail of all operations
- **Health Checks**: Automated system status monitoring
- **Failure Tracking**: Detailed failure analysis and recovery metrics
- **Treasury Monitoring**: Balance alerts and sustainability tracking

## Technical Architecture

### State Variables

#### Core Configuration
```solidity
IERC20 public immutable rdlnToken;        // RDLN token contract
address public treasuryWallet;            // Source of funds
address public operationsWallet;          // Destination for releases
```

#### Distribution Parameters
```solidity
uint256 public constant MONTHLY_RELEASE = 1_000_000 * 10**18;  // Base amount
uint256 public constant MONTH_IN_SECONDS = 30 days;            // Release interval
uint256 public releaseMultiplier = 100;                       // Scaling factor (100 = 1.0x)
```

#### Safety Limits
```solidity
uint256 public constant MIN_TREASURY_BALANCE = 3 * MONTHLY_RELEASE;  // 3-month minimum
uint256 public constant MAX_RELEASE_PER_PERIOD = 10 * MONTHLY_RELEASE; // 10M max
uint256 public constant TIMELOCK_DELAY = 7 days;                    // Change delay
```

### Key Functions

#### Primary Operations
- `releaseMonthlyTokens()`: Manual release trigger (owner only)
- `performUpkeep()`: Automation-compatible release function
- `checkUpkeep()`: Chainlink Automation compatibility check

#### Administration
- `updateReleaseMultiplier()`: Adjust release scaling (1.0x to 5.0x)
- `setAutomationEnabled()`: Enable/disable automation
- `setAutomationService()`: Authorize automation services

#### Emergency Functions
- `pause()/unpause()`: Emergency contract suspension
- `emergencyDrain()`: Emergency fund extraction (when paused)
- `resetCircuitBreaker()`: Reset failure counter

#### Wallet Management (Timelock Protected)
- `proposeTreasuryWalletUpdate()`: Propose treasury wallet change
- `proposeOperationsWalletUpdate()`: Propose operations wallet change
- `executeTreasuryWalletUpdate()`: Execute treasury change (after 7 days)
- `executeOperationsWalletUpdate()`: Execute operations change (after 7 days)

## Security Model

### Access Control Hierarchy
1. **Owner**: Full administrative control
2. **Authorized Automation Services**: Can trigger releases only
3. **Public**: Can view state and perform health checks

### Protection Mechanisms

#### Circuit Breaker Pattern
```
Normal Operation → Failure Detected → Increment Counter →
3 Failures Reached → Auto-Pause → Manual Reset Required
```

#### Timelock Protection
All critical changes require 7-day delay:
- Treasury wallet updates
- Operations wallet updates
- (Release multiplier changes are immediate for operational flexibility)

#### Emergency Procedures
- **Low Balance Warning**: Alert when <3 months of funds remain
- **Emergency Release**: If treasury critically low, release only 5% instead of full amount
- **Complete Drain**: When paused, owner can extract all funds

### Failure Handling

The contract implements comprehensive failure handling:

1. **Pre-flight Checks**: Verify allowance and balance before transfer
2. **Transfer Protection**: Try-catch for transfer operations
3. **State Reversion**: Safely revert state on failure (with underflow protection)
4. **Escalation**: Pause contract after repeated failures
5. **Monitoring**: Emit detailed failure events for analysis

## Integration Guide

### Chainlink Automation Setup

1. Register contract with Chainlink Automation
2. Configure `checkUpkeep()` monitoring
3. Set appropriate gas limits for `performUpkeep()`

```solidity
// The contract automatically handles:
checkUpkeep() → returns (true, "") when release needed
performUpkeep() → executes the release
```

### Monitoring Integration

Key events for monitoring systems:

```solidity
// Successful operations
event TokensReleased(uint256 amount, uint256 timestamp, address to, string releaseType);

// Health monitoring
event AutomationHealthCheck(bool healthy, uint256 timestamp);
event TreasuryLowBalance(uint256 remainingBalance, uint256 monthsRemaining);

// Security events
event UnauthorizedAutomationAttempt(address caller, uint256 timestamp);
event CircuitBreakerActivated(uint256 consecutiveFailures, uint256 timestamp);
event EmergencyTriggered(string trigger, uint256 timestamp);
```

## Deployment Checklist

### Pre-Deployment
- [ ] Deploy RDLN token contract
- [ ] Set up treasury wallet with sufficient funds
- [ ] Set up operations wallet for receiving funds
- [ ] Prepare automation service addresses

### Deployment Parameters
```solidity
constructor(
    address _rdlnToken,      // RDLN token contract address
    address _treasuryWallet, // Multi-sig wallet with funds
    address _operationsWallet, // Operations receiving wallet
    address _owner           // Contract owner (preferably multi-sig)
)
```

### Post-Deployment Setup
1. **Fund Treasury**: Transfer RDLN tokens to treasury wallet
2. **Set Allowance**: Treasury must approve contract for transfers
3. **Configure Automation**: Add authorized automation services
4. **Test Release**: Perform initial manual release test
5. **Monitor**: Set up event monitoring and alerting

## Risk Assessment

### Low Risk ✅
- Contract follows established DeFi patterns
- Comprehensive testing and audit completed
- Multiple layers of security protection
- Gradual failure escalation

### Operational Considerations
- **Treasury Management**: Ensure adequate funding
- **Allowance Management**: Maintain sufficient approvals
- **Monitoring**: Set up alerting for health events
- **Backup Procedures**: Maintain manual release capability

## Security Audit Summary

**Status**: ✅ PASSED (Grade A)
**Issues Fixed**: 3 (2 Medium, 1 Low)
**Deployment Ready**: YES

See `audits/TreasuryDrip-audit-2025-09-25.md` for complete audit report.

---

**Contract Version**: 1.0.0
**Last Updated**: September 25, 2025
**Audit Date**: September 25, 2025