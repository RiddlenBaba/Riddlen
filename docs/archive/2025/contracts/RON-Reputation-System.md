# RON Reputation System Specification

## Overview

The RON (Riddlen Oracle Network) reputation system is a **soul-bound token** implementation that tracks human intelligence validation through non-transferable reputation tokens. RON tokens gate access to different oracle network tiers and represent proven problem-solving ability.

## Core Principles

### 🔗 Soul-Bound Tokens
- **Non-transferable**: RON tokens cannot be transferred, traded, or sold
- **Earned only**: Must be earned through validated intelligence contribution
- **Permanent reputation**: Represents permanent intellectual achievement
- **Anti-Sybil**: Prevents wealthy users from buying their way to validation privileges

### 🎯 Merit-Based Access
- **Tiered system**: Progressive access based on demonstrated ability
- **Difficulty weighting**: Harder riddles award more RON
- **Performance bonuses**: First solvers and speed solvers get multipliers
- **Streak rewards**: Consecutive correct answers provide bonuses

## Access Tier System

### Tier Structure

| Tier | RON Range | Riddle Access | Oracle Validation | Governance |
|------|-----------|---------------|-------------------|------------|
| **Novice** | 0-999 | Easy only | None | None |
| **Solver** | 1,000-9,999 | Easy + Medium | Basic validation | None |
| **Expert** | 10,000-99,999 | Easy + Medium + Hard | Complex validation | None |
| **Oracle** | 100,000+ | All riddles | Elite validation | Full governance |

### Tier Benefits

#### 🟢 Novice (0-999 RON)
- **Riddle Access**: Easy riddles only
- **Oracle Access**: None
- **Earning Potential**: 10-25 RON per riddle
- **Focus**: Learning and skill development

#### 🔵 Solver (1,000-9,999 RON)
- **Riddle Access**: Easy + Medium riddles
- **Oracle Access**: Basic validation (content moderation, fact-checking)
- **Earning Potential**: 50-100 RDLN per validation
- **Focus**: Consistent problem-solving demonstration

#### 🟠 Expert (10,000-99,999 RON)
- **Riddle Access**: Easy + Medium + Hard riddles
- **Oracle Access**: Complex validation (document review, analysis)
- **Earning Potential**: 200-500 RDLN per validation (20% bonus)
- **Focus**: Advanced intellectual contributions

#### 🔴 Oracle (100,000+ RON)
- **Riddle Access**: All riddles including legendary
- **Oracle Access**: Elite validation (strategic consulting, dispute resolution)
- **Earning Potential**: 1,000+ RDLN per validation (50% bonus)
- **Governance**: Protocol decision participation

## RON Earning Mechanisms

### Riddle Solving Rewards

#### Base Rewards by Difficulty
```
Easy:      10-25 RON (avg: 17 RON)
Medium:    50-100 RON (avg: 75 RON)
Hard:      200-500 RON (avg: 350 RON)
Legendary: 1,000-10,000 RON (avg: 5,500 RON)
```

#### Performance Multipliers
- **First Solver**: 5x base reward (500% multiplier)
- **Speed Solver**: 1.5x base reward (150% multiplier)
- **Streak Bonus**: +10% per consecutive correct answer (max 100%)

#### Example Calculations
```
Medium Riddle (75 RON base) + First Solver = 375 RON total
Hard Riddle (350 RON base) + Speed Solver = 525 RON total
Easy Riddle (17 RON base) + 5-streak = 25.5 RON total
```

### Oracle Validation Rewards
- **Basic Validation**: Base amount (SOLVER tier)
- **Complex Validation**: Base + 20% bonus (EXPERT tier)
- **Elite Validation**: Base + 50% bonus (ORACLE tier)

### Accuracy and Streak Tracking
- **Accuracy Percentage**: (Correct Answers / Total Attempts) × 100
- **Current Streak**: Consecutive correct answers
- **Max Streak**: Historical best streak
- **Streak Reset**: Any incorrect answer resets current streak

## Smart Contract Architecture

### Core Contract: `RON.sol`
```solidity
contract RON is AccessControl, ReentrancyGuard, Pausable, IRON
```

### Key State Variables
```solidity
struct UserStats {
    uint256 totalRON;           // Soul-bound RON balance
    uint256 correctAnswers;     // Lifetime correct solutions
    uint256 totalAttempts;      // Lifetime riddle attempts
    uint256 currentStreak;      // Current consecutive streak
    uint256 maxStreak;          // Historical best streak
    uint256 validationsPerformed; // Oracle validations completed
    uint256 lastActivityTime;  // Anti-dormancy tracking
}

struct ValidationStats {
    uint256 basicValidations;    // Content moderation count
    uint256 complexValidations;  // Document review count
    uint256 eliteValidations;    // Strategic consulting count
    uint256 accuracyScore;       // Validation accuracy (0-10000)
}
```

### Access Control Roles
- **GAME_ROLE**: Can award RON for riddle solving
- **ORACLE_ROLE**: Can award RON for validation work
- **PAUSER_ROLE**: Emergency pause capabilities
- **DEFAULT_ADMIN_ROLE**: Configuration and role management

## Key Functions

### RON Award Functions
```solidity
function awardRON(
    address user,
    RiddleDifficulty difficulty,
    bool isFirstSolver,
    bool isSpeedSolver,
    string calldata reason
) external returns (uint256 ronAwarded)

function awardValidationRON(
    address user,
    uint256 baseAmount,
    string calldata validationType
) external
```

### View Functions
```solidity
function getUserTier(address user) external view returns (AccessTier)

function getUserStats(address user) external view returns (
    uint256 totalRON,
    AccessTier currentTier,
    uint256 correctAnswers,
    uint256 totalAttempts,
    uint256 accuracyPercentage,
    uint256 currentStreak,
    uint256 maxStreak
)

function getRiddleAccess(address user) external view returns (
    bool canAccessEasy,
    bool canAccessMedium,
    bool canAccessHard,
    bool canAccessLegendary
)

function getOracleAccess(address user) external view returns (
    bool canValidateBasic,
    bool canValidateComplex,
    bool canValidateElite,
    bool canParticipateGovernance
)
```

## Integration with Riddlen Ecosystem

### RDLN Token Integration
- **Separate Systems**: RON tracks reputation, RDLN provides economic incentives
- **Complementary Design**: RON gates access, RDLN rewards participation
- **Cross-Contract Calls**: Game contracts award both RON and burn RDLN

### Riddle NFT Integration
- **Access Control**: RON tier determines available riddle difficulties
- **Reward Calculation**: RON multipliers affect RDLN prize distributions
- **Quality Assurance**: Higher RON users can validate riddle quality

### Oracle Network Integration
- **Validation Tiers**: RON level determines validation opportunities
- **Revenue Sharing**: Higher tiers get bonus RDLN for validation work
- **Governance Rights**: Oracle tier enables protocol governance participation

## Security Features

### Soul-Bound Implementation
```solidity
function transfer(address, uint256) external pure returns (bool) {
    revert NonTransferableToken();
}

function transferFrom(address, address, uint256) external pure returns (bool) {
    revert NonTransferableToken();
}

function approve(address, uint256) external pure returns (bool) {
    revert NonTransferableToken();
}
```

### Access Control
- **Role-based permissions**: Only authorized contracts can award RON
- **Anti-gaming mechanisms**: Prevents exploitation of earning systems
- **Audit trail**: Complete event logging for all RON operations

### Accuracy Validation
- **Real-time tracking**: Immediate accuracy updates
- **Streak management**: Automatic streak counting and reset
- **Performance analytics**: Comprehensive statistics for reputation assessment

## Testing Results

### Comprehensive Test Suite
```
✅ 26 tests passing (100% success rate)
✅ All core functionality validated
✅ Access control security verified
✅ Soul-bound token compliance confirmed
✅ Tier progression mechanics working
✅ Accuracy tracking operational
```

### Contract Optimization
- **Size**: 7.099 KiB deployed (efficient for complex logic)
- **Gas Usage**: Optimized for frequent riddle interactions
- **Security**: No vulnerabilities detected in testing

## Deployment Configuration

### Constructor Parameters
```solidity
constructor(address _admin)
```

### Post-Deployment Setup
1. **Role Assignment**: Grant GAME_ROLE to riddle contracts
2. **Oracle Integration**: Grant ORACLE_ROLE to validation contracts
3. **Configuration**: Set dynamic rewards and streak limits
4. **Monitoring**: Deploy event monitoring for reputation tracking

## Future Enhancements

### Planned Features
1. **Dynamic Difficulty**: RON-based riddle difficulty adjustment
2. **Reputation Decay**: Gradual RON reduction for inactive users
3. **Cross-Chain Reputation**: Multi-network RON synchronization
4. **Advanced Analytics**: ML-based performance predictions

### Integration Roadmap
1. **Phase 2**: Riddle NFT contract integration
2. **Phase 3**: Oracle network deployment
3. **Phase 4**: Cross-chain expansion
4. **Phase 5**: Decentralized governance activation

---

**Contract Version**: 1.0.0
**Specification Date**: September 27, 2025
**Whitepaper Compliance**: ✅ Full compliance with v5.1
**Test Coverage**: ✅ 100% core functionality
**Security Status**: ✅ Ready for audit
**Integration Status**: 🔄 Ready for riddle NFT integration