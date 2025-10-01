# 🏗️ RiddleNFTAdvancedV2 - Complete Architecture

**Date**: 2025-09-30
**Version**: v2-comprehensive
**Status**: 🔧 **IN DESIGN**

---

## Executive Summary

The comprehensive V2 upgrade integrates THREE major systems:

1. **Era-Locked Cost System** (from RiddleNFTv3)
2. **User Submission System** (from RiddleNFTv3)
3. **Group Mechanics** (already deployed)
4. **Oracle/Curator System** (from RiddleSubmissionManager - separate contract)

---

## 🎯 Complete Feature Set

### System 1: Era-Locked Costs (NFT-Level Economics)

**Purpose**: Each NFT locks its economic parameters at mint time based on era.

```solidity
struct NFTCostData {
    uint256 mintEra;              // Era when minted (0, 1, 2...)
    uint256 mintCost;             // Cost to mint this NFT (locked forever)
    uint256 baseAttemptCost;      // Base cost for attempts (locked forever)
    uint256 baseSubmissionCost;   // Base cost for submissions (locked forever)
    uint256 attemptCount;         // Number of attempts made (progressive)
    uint256 submissionCount;      // Number of submissions (progressive)
}
```

**Why This Matters**:
- Early adopters pay more, get premium economics
- Late adopters pay less, more accessible
- Groups inherit era costs from founding NFT
- Fair economics for all participants

---

### System 2: Progressive Cost Calculation

**Purpose**: Prevent spam by increasing costs with usage.

```solidity
function calculateAttemptCost(uint256 tokenId) public view returns (uint256) {
    NFTCostData storage nft = nftCostData[tokenId];

    // Base cost from NFT's era
    uint256 baseCost = nft.baseAttemptCost;

    // Progressive multiplier (increases every 5 attempts)
    uint256 multiplier = 1 + (nft.attemptCount / 5);

    return baseCost * multiplier;
}

function calculateSubmissionCost(uint256 tokenId) public view returns (uint256) {
    NFTCostData storage nft = nftCostData[tokenId];

    uint256 baseCost = nft.baseSubmissionCost;

    // Progressive multiplier (increases every 3 submissions)
    uint256 multiplier = 1 + (nft.submissionCount / 3);

    return baseCost * multiplier;
}
```

**Economic Pressure**:
- Attempt 1-5: 1x base cost
- Attempt 6-10: 2x base cost
- Attempt 11-15: 3x base cost
- Encourages thoughtful solving

---

### System 3: User Question Submission (NFT-Level)

**Purpose**: NFT holders can submit questions for their NFT to solve.

**IMPORTANT**: This is DIFFERENT from the curator system!

```solidity
function submitQuestion(
    uint256 tokenId,
    bytes32 questionHash,
    string memory questionIPFS
) external nonReentrant {
    require(ownerOf(tokenId) == msg.sender, "Not owner");

    // Initialize cost data if needed
    if (nftCostData[tokenId].mintEra == 0) {
        _initializeNFTCostData(tokenId);
    }

    NFTCostData storage nft = nftCostData[tokenId];
    uint256 submissionCost = calculateSubmissionCost(tokenId);

    // Collect cost
    rdlnToken.transferFrom(msg.sender, address(this), submissionCost);

    // Increment counter
    nft.submissionCount++;

    // Distribute costs (50% burn, 25% grand prize, 25% devops)
    _distributeSubmissionCost(submissionCost);

    emit QuestionSubmitted(tokenId, msg.sender, questionHash, submissionCost);
}
```

**Use Cases**:
- Practice questions for NFT holder
- Custom challenges
- Group training exercises
- NOT for adding to main riddle pool (that's curator system)

---

### System 4: Group Conversion with Era Costs

**Purpose**: Convert individual NFT to collaborative group.

```solidity
function convertToGroupNFT(uint256 tokenId) external returns (uint256 groupId) {
    require(ownerOf(tokenId) == msg.sender, "Not owner");
    require(nftGroupIds[tokenId] == 0, "Already a group");

    // Initialize cost data if needed
    if (nftCostData[tokenId].mintEra == 0) {
        _initializeNFTCostData(tokenId);
    }

    NFTCostData memory costData = nftCostData[tokenId];
    NFTMetadata memory nftMeta = nftMetadata[tokenId];

    // Create group via GroupManager (passes era costs)
    groupId = groupManager.createGroupFromNFT(
        msg.sender,
        tokenId,
        nftMeta.sessionId,
        costData.mintEra,           // ← Era-locked economics
        costData.baseAttemptCost,   // ← Group inherits these
        costData.baseSubmissionCost // ← From founding NFT
    );

    // Track conversion
    nftGroupIds[tokenId] = groupId;

    // Transfer NFT to GroupManager for custody
    _transfer(msg.sender, address(groupManager), tokenId);

    emit NFTConvertedToGroup(tokenId, groupId, msg.sender);
}
```

**Benefits**:
- Groups share NFT's era costs
- Early NFTs create premium groups
- Later NFTs create accessible groups
- Fair economics

---

### System 5: Oracle/Curator System (SEPARATE CONTRACT)

**Purpose**: Community submits NEW riddles for approval.

**Contract**: `RiddleSubmissionManager.sol` (already designed)

**Flow**:
```
User submits riddle (5 RDLN fee)
    ↓
Curators review (3 of 5 must approve)
    ↓
Approved → Goes live in main system
    ↓
Submitter gets 10% of prize pool
```

**Key Differences from NFT Submissions**:
| Feature | NFT Submission | Curator System |
|---------|---------------|----------------|
| **Purpose** | Practice/custom questions | New riddles for everyone |
| **Who** | NFT owner only | Anyone |
| **Cost** | Progressive (increases) | Fixed 5 RDLN |
| **Approval** | Automatic | Curator vote |
| **Reward** | None (it's for practice) | 10% of prize pool |
| **Storage** | On NFT | Separate contract |

---

## 📊 Complete Storage Layout

### V1 Storage (Inherited, UNCHANGED):
```solidity
// Slots 0-43: All V1 variables (preserved)
IRDLN public rdlnToken;
IRON public ronToken;
mapping(uint256 => RiddleSession) riddleSessions;
mapping(uint256 => Question) questions;
mapping(uint256 => ParticipantData) participantData;
mapping(uint256 => NFTMetadata) nftMetadata;
uint256 public currentSessionId;
uint256 public deploymentTime;
// ... all other V1 storage ...

// Slot 44-93: Storage gap [50]
uint256[50] private __gap;
```

### V2 Storage (NEW - Consumes from gap):
```solidity
// Slot 44: Group Manager
IRiddleGroupManager public groupManager;              // -1 slot

// Slot 45: NFT → Group ID mapping
mapping(uint256 => uint256) public nftGroupIds;       // -1 slot

// Slot 46: NFT → Cost Data mapping
mapping(uint256 => NFTCostData) public nftCostData;   // -1 slot

// Slot 47-93: Remaining gap [47 slots]
```

**Total Gap Usage**: 3 slots (47 remain for future upgrades)

---

## 🔄 Complete Integration Flow

### Scenario 1: Solo Play (Traditional)
```
User mints NFT (era costs locked)
    ↓
Makes attempts (progressive costs)
    ↓
Solves riddle → Wins prize
    ↓
NFT remains in user's wallet
```

### Scenario 2: Group Play
```
User mints NFT (era costs locked)
    ↓
Converts to group (passes era costs to GroupManager)
    ↓
Others join group
    ↓
Group makes attempts (progressive costs from founding NFT)
    ↓
Solves riddle → Rewards distributed
```

### Scenario 3: Custom Practice Questions
```
User owns NFT
    ↓
Submits practice question (progressive cost)
    ↓
Costs distributed (burn/treasury/devops)
    ↓
User or group can attempt question
```

### Scenario 4: Community Riddle Submission (Separate System)
```
User submits NEW riddle to RiddleSubmissionManager (5 RDLN)
    ↓
Curators vote (3 of 5 required)
    ↓
Approved → Admin adds to live riddle pool
    ↓
Submitter earns 10% of prize pool when riddle goes live
```

---

## 🏗️ V2 Implementation Strategy

### Phase 1: Core Storage & Era System
**Add to V2**:
```solidity
// Storage
mapping(uint256 => NFTCostData) public nftCostData;

// Era calculation
function getCurrentEra() public view returns (uint256);
function getEraForTimestamp(uint256 timestamp) public view returns (uint256);

// Migration for existing NFTs
function _initializeNFTCostData(uint256 tokenId) internal;
```

### Phase 2: Progressive Cost System
**Add to V2**:
```solidity
function calculateAttemptCost(uint256 tokenId) public view returns (uint256);
function calculateSubmissionCost(uint256 tokenId) public view returns (uint256);
```

### Phase 3: User Submission System
**Add to V2**:
```solidity
function submitQuestion(uint256 tokenId, bytes32 questionHash, string memory ipfs) external;
function _distributeSubmissionCost(uint256 amount) internal;
```

### Phase 4: Group Integration
**Add to V2**:
```solidity
function convertToGroupNFT(uint256 tokenId) external returns (uint256 groupId);
function isGroupNFT(uint256 tokenId) external view returns (bool);
function getGroupInfo(uint256 tokenId) external view returns (...);
```

---

## ✅ Success Criteria

V2 is complete when:

1. ✅ **Era-locked costs work**
   - New NFTs lock era at mint
   - Existing NFTs calculate era from timestamp
   - Costs halve every 2 years

2. ✅ **Progressive costs work**
   - Attempts get more expensive
   - Submissions get more expensive
   - Economic pressure functional

3. ✅ **User submissions work**
   - NFT owners can submit questions
   - Costs collected and distributed
   - Progressive pricing prevents spam

4. ✅ **Group conversion works**
   - NFTs convert to groups
   - Era-locked costs pass to GroupManager
   - Groups inherit founding NFT economics

5. ✅ **Backward compatibility maintained**
   - All V1 functions work
   - Existing NFTs functional
   - Solo play unchanged

6. ✅ **Oracle system ready** (separate contract)
   - RiddleSubmissionManager deployed
   - Curators appointed
   - Community can submit riddles

---

## 🔐 Security Considerations

### Storage Safety
- ✅ Only 3 new storage variables
- ✅ Consumes from V1's 50-slot gap
- ✅ No modifications to existing structures
- ✅ 47 slots remain for future upgrades

### Economic Safety
- ✅ Era costs locked at mint (cannot be manipulated)
- ✅ Progressive costs prevent spam
- ✅ Groups inherit era costs (fair economics)
- ✅ Submission costs distributed properly

### Integration Safety
- ✅ NFT submissions ≠ Curator submissions (separate systems)
- ✅ GroupManager handles group logic
- ✅ Clean separation of concerns

---

## 🚀 Deployment Plan

### Step 1: Deploy V2 Upgrade
- Compile RiddleNFTAdvancedV2_Comprehensive
- Run storage layout validation
- Upgrade proxy on Amoy
- Initialize V2 with GroupManager

### Step 2: Test All Systems
- Test era calculations
- Test progressive costs
- Test user submissions
- Test group conversion
- Test end-to-end flow

### Step 3: Deploy Oracle System (Parallel)
- Deploy RiddleSubmissionManager
- Appoint initial curators
- Test riddle submission flow
- Grant necessary roles

### Step 4: Frontend Integration
- Update UI for user submissions
- Add group conversion flow
- Add curator dashboard
- Add riddle submission form

---

## 📝 Contract Files

### To Create:
1. **RiddleNFTAdvancedV2_Comprehensive.sol** - Main upgrade
2. **RiddleSubmissionManager.sol** - Oracle/curator system
3. **upgrade-nft-to-v2-comprehensive.js** - Deployment script
4. **RiddleNFTAdvancedV2_Comprehensive.test.js** - Test suite

### Already Have:
- ✅ GroupManager (deployed)
- ✅ GroupValidator (deployed)
- ✅ RONGroupExtension (deployed)
- ✅ RIDDLE_SUBMISSION_DESIGN.md (spec)

---

## 🎯 Next Steps

1. Create RiddleNFTAdvancedV2_Comprehensive.sol
2. Implement all 4 systems
3. Test storage layout
4. Test all functions
5. Deploy to Amoy
6. Deploy RiddleSubmissionManager
7. Integrate with frontend

---

**Conclusion**: The comprehensive V2 creates a complete ecosystem:
- **NFT-level**: Era costs, progressive pricing, user submissions, group conversion
- **System-level**: Curator approval for community riddles
- **Economics**: Fair, spam-resistant, decentralized

This is the FULL vision for Riddlen v2.