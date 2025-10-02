# 🎯 RON Token - Adjustable Reward System

**Date**: 2025-09-30
**Contract**: RONUpgradeable.sol
**Status**: ✅ **IMPLEMENTED - Ready for Deployment**

---

## 🔄 Changes Made

### Problem
RON reward amounts were hardcoded as `constant` values:
```solidity
uint256 public constant EASY_RON_MIN = 10;
uint256 public constant EASY_RON_MAX = 25;
uint256 public constant MEDIUM_RON_MIN = 50;
// ... etc
```

**Issue**: These values cannot be adjusted as RDLN token value fluctuates in the market.

---

## ✅ Solution

### Changed Constants to Storage Variables

```solidity
// BEFORE (constants - cannot change):
uint256 public constant EASY_RON_MIN = 10;
uint256 public constant EASY_RON_MAX = 25;

// AFTER (storage - adjustable via governance):
uint256 public easyRONMin;
uint256 public easyRONMax;
```

### All Reward Ranges Now Adjustable

| Difficulty | Default Min | Default Max | Adjustable |
|------------|-------------|-------------|------------|
| **Easy** | 10 RON | 25 RON | ✅ |
| **Medium** | 50 RON | 100 RON | ✅ |
| **Hard** | 200 RON | 500 RON | ✅ |
| **Legendary** | 1,000 RON | 10,000 RON | ✅ |

---

## 📋 New Admin Functions

### 1. Update Single Difficulty Range

```solidity
function updateRewardRange(
    RiddleDifficulty difficulty,
    uint256 newMin,
    uint256 newMax
) external onlyRole(DEFAULT_ADMIN_ROLE)
```

**Example Usage**:
```solidity
// If RDLN price increases, reduce RON rewards
ronToken.updateRewardRange(
    RiddleDifficulty.EASY,
    5,   // newMin: 5 RON (was 10)
    15   // newMax: 15 RON (was 25)
);
```

**Validations**:
- ✅ newMin > 0
- ✅ newMax > newMin
- ✅ newMax <= MAX_SINGLE_RON_AWARD (circuit breaker: 50K RON)

**Emits**: `RewardRangeUpdated(difficulty, oldMin, oldMax, newMin, newMax)`

---

### 2. Batch Update All Ranges

```solidity
function updateAllRewardRanges(
    uint256[8] calldata ranges
) external onlyRole(DEFAULT_ADMIN_ROLE)
```

**Array Format**:
```solidity
[
    easyMin, easyMax,
    mediumMin, mediumMax,
    hardMin, hardMax,
    legendaryMin, legendaryMax
]
```

**Example Usage**:
```solidity
// Update all ranges at once (e.g., due to market conditions)
ronToken.updateAllRewardRanges([
    5, 15,        // Easy: 5-15 RON
    25, 50,       // Medium: 25-50 RON
    100, 250,     // Hard: 100-250 RON
    500, 5000     // Legendary: 500-5K RON
]);
```

**Emits**: `AllRewardRangesUpdated(newRanges)`

---

## 🎭 Use Cases

### Scenario 1: RDLN Price Increases 10x

**Current**: 1 RDLN = $0.10
**New**: 1 RDLN = $1.00

**Action**: Reduce RON rewards to maintain value equilibrium

```solidity
// Before: Easy riddles award 10-25 RON
ronToken.updateRewardRange(RiddleDifficulty.EASY, 1, 3);
// After: Easy riddles award 1-3 RON (same dollar value)
```

---

### Scenario 2: RDLN Price Decreases

**Current**: 1 RDLN = $0.10
**New**: 1 RDLN = $0.01

**Action**: Increase RON rewards to maintain incentive

```solidity
// Before: Easy riddles award 10-25 RON
ronToken.updateRewardRange(RiddleDifficulty.EASY, 100, 250);
// After: Easy riddles award 100-250 RON (same dollar value)
```

---

### Scenario 3: Platform Growth

**Phase 1: Launch** (Few users, need high incentives)
```solidity
updateAllRewardRanges([
    20, 50,       // Easy: Higher rewards
    100, 200,     // Medium
    400, 1000,    // Hard
    2000, 20000   // Legendary
]);
```

**Phase 2: Maturity** (Many users, can reduce rewards)
```solidity
updateAllRewardRanges([
    5, 10,        // Easy: Lower rewards
    25, 50,       // Medium
    100, 250,     // Hard
    500, 5000     // Legendary
]);
```

---

## 🔐 Security & Safety

### Circuit Breaker Protection

All reward updates are constrained by the circuit breaker:

```solidity
uint256 public constant MAX_SINGLE_RON_AWARD = 50_000; // 50K RON max
```

**Prevents**:
- ❌ Setting rewards above 50K RON
- ❌ Accidental typos (e.g., 100000000 instead of 100)
- ❌ Malicious inflation attacks

---

### Access Control

**Only** `DEFAULT_ADMIN_ROLE` can update rewards:
```solidity
function updateRewardRange(...) external onlyRole(DEFAULT_ADMIN_ROLE)
```

**Future**: Can transfer admin role to DAO contract for decentralized governance

---

### Validation Checks

```solidity
require(newMin > 0 && newMax > newMin, "Invalid reward range");
require(newMax <= MAX_SINGLE_RON_AWARD, "Exceeds circuit breaker");
```

---

## 📊 Governance Integration

### Phase 1: Manual Admin Control (Current)

Admin wallet controls reward updates based on market conditions.

---

### Phase 2: DAO Governance (Future)

Transfer admin role to RiddlenDAO:

```solidity
// Transfer control to DAO
ronToken.grantRole(DEFAULT_ADMIN_ROLE, address(riddlenDAO));
ronToken.revokeRole(DEFAULT_ADMIN_ROLE, founderAddress);
```

**DAO can then propose**:
```solidity
// Create proposal to update rewards
dao.propose(
    [address(ronToken)],
    [0],
    [abi.encodeWithSignature(
        "updateRewardRange(uint8,uint256,uint256)",
        RiddleDifficulty.EASY,
        5,
        15
    )],
    "Reduce Easy rewards due to RDLN price increase"
);
```

---

## 📈 Events & Monitoring

### RewardRangeUpdated Event

```solidity
event RewardRangeUpdated(
    RiddleDifficulty indexed difficulty,
    uint256 oldMin,
    uint256 oldMax,
    uint256 newMin,
    uint256 newMax
);
```

**Example**:
```
RewardRangeUpdated(
    difficulty: EASY (0),
    oldMin: 10,
    oldMax: 25,
    newMin: 5,
    newMax: 15
)
```

---

### AllRewardRangesUpdated Event

```solidity
event AllRewardRangesUpdated(
    uint256[8] newRanges
);
```

**Frontend Integration**:
```javascript
ronToken.on("RewardRangeUpdated", (difficulty, oldMin, oldMax, newMin, newMax) => {
    console.log(`${difficulty} rewards changed: ${oldMin}-${oldMax} → ${newMin}-${newMax}`);
    // Update UI to show new reward ranges
});
```

---

## 🚀 Deployment Notes

### Existing Deployment

RON is already deployed at: `0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635` (Amoy)

**Since RON is UUPS upgradeable**, these changes can be applied via upgrade:

```solidity
// 1. Deploy new implementation
RONUpgradeable newImplementation = new RONUpgradeable();

// 2. Upgrade proxy
await upgrades.upgradeProxy(
    "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635",
    RONUpgradeable
);

// 3. Reward ranges automatically initialized to default values
// (10-25, 50-100, 200-500, 1000-10000)
```

---

### Post-Upgrade Verification

```solidity
// Check current ranges
uint256 easyMin = ronToken.easyRONMin(); // 10
uint256 easyMax = ronToken.easyRONMax(); // 25

// Test update
ronToken.updateRewardRange(RiddleDifficulty.EASY, 5, 15);

// Verify
assert(ronToken.easyRONMin() == 5);
assert(ronToken.easyRONMax() == 15);
```

---

## ✅ Benefits

### For Platform

✅ **Market Responsive**: Adjust rewards as RDLN value changes
✅ **Growth Phases**: High rewards early, reduce as platform matures
✅ **Governance Ready**: Admin role can be transferred to DAO
✅ **Circuit Breaker**: Max 50K RON per reward (safety)

### For Users

✅ **Stable Value**: Rewards maintain dollar-equivalent value
✅ **Fair Competition**: Rewards adjust based on difficulty + market
✅ **Transparency**: All changes emit events (on-chain audit trail)

### For DAO

✅ **Decentralized Control**: DAO can vote to adjust rewards
✅ **Community Input**: RON holders decide reward economics
✅ **Data-Driven**: Adjust based on platform metrics

---

## 📝 Summary

| Before | After |
|--------|-------|
| ❌ Hardcoded constants | ✅ Adjustable storage variables |
| ❌ Cannot respond to market | ✅ Market-responsive rewards |
| ❌ Requires contract redeploy | ✅ Update via admin function |
| ❌ Fixed forever | ✅ DAO-governable (future) |

**Status**: ✅ **COMPLETE - Ready for Upgrade**

---

**Created**: 2025-09-30
**Compiled**: ✅ Successfully
**Gas Impact**: Minimal (reward calculation uses storage reads instead of constants)
**Backward Compatible**: ✅ Default values match previous constants
