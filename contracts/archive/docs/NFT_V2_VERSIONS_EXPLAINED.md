# 🎯 RiddleNFT V2 Versions - Which One to Use?

**Date**: 2025-09-30
**Status**: Choosing deployment version

---

## 📊 Three V2 Versions Comparison

### 1. RiddleNFTAdvancedV2.sol (553 lines)
**File**: `contracts/nft/RiddleNFTAdvancedV2.sol`

**Purpose**: Group mechanics only (original version)

**Features**:
- ✅ Convert NFTs to group sessions
- ✅ Collaborative riddle solving
- ✅ Group reward distribution
- ✅ Integration with GroupManager
- ✅ Integration with GroupCompositionValidator
- ❌ NO era-locked costs
- ❌ NO progressive pricing
- ❌ NO user question submissions

**Storage**:
- Group manager reference
- Group validator reference
- Group session mappings

**Use Case**: If you ONLY want group mechanics without era system

---

### 2. RiddleNFTAdvancedV2_Minimal.sol (414 lines)
**File**: `contracts/nft/RiddleNFTAdvancedV2_Minimal.sol`

**Purpose**: Minimal group support (safest upgrade)

**Features**:
- ✅ Convert NFTs to groups
- ✅ Delegates ALL group logic to GroupManager
- ✅ Minimal storage (2 slots)
- ✅ Lowest risk upgrade
- ❌ NO era-locked costs
- ❌ NO progressive pricing
- ❌ NO user question submissions
- ❌ NO group validator (delegated)

**Storage**:
- Group manager reference (1 slot)
- NFT to group ID mapping (1 slot)

**Use Case**: If you want SAFEST group upgrade with minimal changes

---

### 3. RiddleNFTAdvancedV2_Comprehensive.sol (596 lines) ⭐
**File**: `contracts/nft/RiddleNFTAdvancedV2_Comprehensive.sol`

**Purpose**: Complete system integration (RECOMMENDED)

**Features**:
- ✅ Era-locked costs (from RiddleNFTv3)
- ✅ Progressive pricing (from RiddleNFTv3)
- ✅ User question submissions (from RiddleNFTv3)
- ✅ Group mechanics integration
- ✅ Backward compatible with V1
- ✅ All V1 NFTs work exactly the same
- ✅ Forward-looking economics

**Storage** (3 slots):
- Group manager reference
- NFT to group ID mapping
- Era-locked cost data per NFT

**Use Case**: If you want the COMPLETE future-proof system

---

## 🎯 Recommendation

### Use: **RiddleNFTAdvancedV2_Comprehensive** ⭐

**Why?**

1. **Future-Proof**: Includes era system for long-term sustainability
2. **Anti-Spam**: Progressive costs prevent abuse
3. **User Engagement**: Question submissions enable UGC
4. **Groups**: Full group support included
5. **Backward Compatible**: All existing NFTs still work
6. **One Upgrade**: Get everything in single upgrade vs multiple later

**Trade-offs**:
- ✅ Slightly more storage (3 slots vs 2)
- ✅ More complex but well-tested patterns (from v3)
- ✅ More features = more value

---

## 🚫 What to Disable

Since we're using **V2_Comprehensive**, we should disable the other two:

### Rename/Disable:
1. `RiddleNFTAdvancedV2.sol` → `RiddleNFTAdvancedV2.sol.unused`
2. `RiddleNFTAdvancedV2_Minimal.sol` → `RiddleNFTAdvancedV2_Minimal.sol.unused`

**Keep**:
- `RiddleNFTAdvancedV2_Comprehensive.sol` (the one we deploy)

---

## 📋 Feature Matrix

| Feature | V2 (Original) | V2 Minimal | V2 Comprehensive ⭐ |
|---------|--------------|------------|---------------------|
| **Group Mechanics** | ✅ | ✅ | ✅ |
| **Era-Locked Costs** | ❌ | ❌ | ✅ |
| **Progressive Pricing** | ❌ | ❌ | ✅ |
| **Question Submissions** | ❌ | ❌ | ✅ |
| **Storage Used** | ~5 slots | 2 slots | 3 slots |
| **Complexity** | Medium | Low | Medium |
| **Future-Proof** | No | No | Yes |
| **Backward Compatible** | Yes | Yes | Yes |

---

## 🔍 Key Differences

### Era System (Only in Comprehensive)

```solidity
// Comprehensive has this:
struct NFTCostData {
    uint256 mintEra;              // 0, 1, 2...
    uint256 mintCost;             // Locked forever
    uint256 baseAttemptCost;      // Locked at mint
    uint256 baseSubmissionCost;   // Locked at mint
    uint256 attemptCount;         // Progressive counter
    uint256 submissionCount;      // Progressive counter
}

// Others don't have this
```

### Progressive Costs (Only in Comprehensive)

```solidity
// Comprehensive calculates costs like this:
attemptCost = baseAttemptCost * (attemptCount + 1)
// Era 0: 1 RDLN → 2 RDLN → 3 RDLN...
// Era 1: 0.5 RDLN → 1 RDLN → 1.5 RDLN...

// Others use fixed costs
```

### Question Submissions (Only in Comprehensive)

```solidity
// Comprehensive allows:
function submitQuestion(
    uint256 tokenId,
    bytes32 questionHash,
    string calldata ipfsHash
) external {
    // NFT owners submit practice questions
}

// Others don't have this
```

---

## 💡 Decision

**Deploy**: `RiddleNFTAdvancedV2_Comprehensive.sol`

**Rename**:
- `RiddleNFTAdvancedV2.sol` → `RiddleNFTAdvancedV2.sol.unused`
- `RiddleNFTAdvancedV2_Minimal.sol` → `RiddleNFTAdvancedV2_Minimal.sol.unused`

**Reason**: Get all features in one upgrade, future-proof economics

---

## 🚀 Next Steps

1. ✅ Rename unused versions
2. ⏳ Compile Comprehensive only
3. ⏳ Run tests
4. ⏳ Deploy to Amoy
5. ⏳ Verify and test

---

**Created**: 2025-09-30
**Decision**: Use RiddleNFTAdvancedV2_Comprehensive
**Reason**: Complete, future-proof, one-time upgrade