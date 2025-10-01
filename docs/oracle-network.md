---
layout: default
title: "Riddlen Oracle Network - Enterprise Data Validation"
description: "Earn RDLN by validating data for enterprises. RON-based validator tiers, consensus mechanism, and sustainable income through human intelligence verification."
keywords: "oracle network, data validation, riddlen validators, ron staking, consensus mechanism, earn rdln, blockchain oracle"
sitemap:
  priority: 0.9
  changefreq: 'weekly'
  lastmod: 2025-10-01
---

# 🔮 Riddlen Oracle Network

**Enterprise data validation powered by human intelligence**

**Contract**: `0xBd005201294984eFf3c353c32c9E5a96Fd640493` (Amoy Testnet)
**Status**: ✅ Live and Operational

---

## 🎯 Overview

The **Riddlen Oracle Network** transforms high-reputation users into **paid validators** who verify data for external companies. Unlike traditional oracles that rely on algorithms, we leverage **human intelligence** for complex validation tasks.

### Key Concept

```
Company → Validation Request + RDLN Reward
    ↓
Riddlen Network → Assigns to Qualified Validators
    ↓
Validators → Stake RON + Submit Answers
    ↓
Consensus → Majority Determines Truth (e.g., 5 of 7)
    ↓
Distribution → Correct validators split reward
    ↓
Riddlen → Takes 10% protocol fee
```

---

## 💰 Validator Tiers

Access to validation requests is tiered based on **RON balance and accuracy**:

| Tier | RON Required | Min Accuracy | Max Stake | Request Access | Typical Rewards |
|------|--------------|--------------|-----------|----------------|-----------------|
| **Bronze** | 100 RON | None | 10 RON | Basic validation | 100-500 RDLN |
| **Silver** | 1,000 RON | 70%+ | 100 RON | Medium complexity | 500-2,000 RDLN |
| **Gold** | 10,000 RON | 85%+ | 1,000 RON | High-value requests | 2,000-10,000 RDLN |
| **Platinum** | 100,000 RON | 95%+ | 10,000 RON | Enterprise premium | 10,000+ RDLN |

**Progression**: Start Bronze → Build accuracy → Earn RON → Unlock higher tiers → Access better-paying requests

---

## 🔄 Validation Lifecycle

### Step 1: Request Creation (By Company)

```javascript
const request = await oracleNetwork.createValidationRequest({
  dataHash: "0x123...",
  question: "What was BTC/USD price at 2025-10-01 12:00 UTC?",
  requiredValidators: 7,
  consensusThreshold: 5, // 5 of 7 must agree (71%)
  rewardPool: ethers.parseEther("1000"), // 1000 RDLN
  deadline: timestamp + 86400, // 24 hours
  category: "PRICE_DATA"
});

// Company pays: 1000 RDLN + 100 RDLN fee (10%) = 1100 RDLN total
```

### Step 2: Validator Participation

```javascript
// Browse available requests
const openRequests = await oracleNetwork.getOpenRequests();

// Submit validation (stake RON as collateral)
await oracleNetwork.submitValidation(
  requestId,
  answerHash, // keccak256 of answer
  proofURI,   // IPFS link to evidence
  stakeAmount // RON to stake
);
```

### Step 3: Consensus Determination

**Automatic when threshold reached or deadline passes**:

1. Count submissions per unique answer
2. Determine majority answer
3. Check if majority ≥ threshold
4. If yes: Consensus reached ✅
5. If no: No consensus ❌ (refund - 5% fee)

### Step 4: Reward Distribution

**If Consensus Reached**:
```
For each CORRECT validator:
  - Reward share = (their stake / total correct stake) × reward pool
  - Transfer RDLN reward
  - Return staked RON
  - Update reputation (+10 points)

For each INCORRECT validator:
  - Slash 50% of staked RON
  - Burn 50% of slashed amount
  - Distribute other 50% to correct validators (bonus)
  - Update reputation (-20 points)
```

---

## 📊 Economics & Earning Potential

### For Validators

**Bronze Validator Example** (10 validations/week):
```
Average reward: 500 RDLN per validation
Weekly earnings: 5,000 RDLN
Monthly earnings: 20,000 RDLN
Plus Airdrop Phase 3: +500 RDLN per validation
```

**Gold Validator Example** (20 validations/week):
```
Average reward: 2,000 RDLN per validation
Weekly earnings: 40,000 RDLN
Monthly earnings: 160,000 RDLN
Plus Airdrop Phase 3: +500 RDLN per validation
```

### For Riddlen Protocol

**Revenue Streams**:
- 10% fee on all validation requests
- 50% of slashed stakes (other 50% burned)

**Fee Distribution**:
```
Protocol Fee Revenue:
├── 50% → Treasury (operations, development)
├── 30% → RDLN Buyback & Burn (deflationary)
└── 20% → Top Validator Bonus Pool (monthly)

Slashed Stakes:
├── 50% → Burned (deflationary)
└── 50% → Distributed to correct validators
```

---

## 🛡️ Security & Trust

### Sybil Attack Prevention
- ✅ Minimum RON balance required (reputation-based)
- ✅ Higher rewards require higher tiers
- ✅ Stake required (economic cost)
- ✅ RON is soul-bound (can't buy reputation)

### Collusion Prevention
- ✅ Validators don't know who else is validating
- ✅ Can't change answer after submission
- ✅ Random selection for high-value requests
- ✅ Time-delayed consensus reveal

### Validator Accountability
- ✅ Reputation scoring (persistent)
- ✅ Economic stake at risk
- ✅ Slashing for incorrect answers
- ✅ Suspension mechanism (<70% accuracy)

### Accuracy Tracking
```
Accuracy = (Correct Validations / Total Validations) × 100

Effects:
  < 70%  → Temporary suspension
  70-85% → Normal access
  85-95% → Premium access
  > 95%  → Elite validator status
```

---

## 🏢 Use Cases

### 1. Financial Data Verification
**Example**: "What was BTC/USD price at specific timestamp?"
- Companies: Trading platforms, DeFi protocols
- Reward: 500-1,000 RDLN
- Validators: Check multiple price feeds
- Consensus: 5 of 7 agreement

### 2. Blockchain Event Confirmation
**Example**: "Did transaction 0x123... occur on Ethereum?"
- Companies: Cross-chain bridges, auditors
- Reward: 300-800 RDLN
- Validators: Verify on blockchain explorers
- Consensus: 3 of 5 agreement

### 3. Content Moderation
**Example**: "Does this image violate community guidelines?"
- Companies: Social platforms, marketplaces
- Reward: 200-500 RDLN per item
- Validators: Human judgment required
- Consensus: 5 of 7 agreement

### 4. Research Validation
**Example**: "Is this scientific claim accurate?"
- Companies: Research institutions
- Reward: 2,000-5,000 RDLN
- Validators: Domain experts (high RON)
- Consensus: 7 of 10 agreement

### 5. Supply Chain Verification
**Example**: "Did shipment arrive at location X?"
- Companies: Logistics, e-commerce
- Reward: 300-600 RDLN
- Validators: Local verification with photos
- Consensus: 3 of 5 agreement

---

## 🚀 How to Become a Validator

### Prerequisites
1. **Earn 100+ RON** (Bronze tier minimum)
2. **Web3 wallet** with Polygon Amoy
3. **RDLN tokens** to cover gas fees

### Steps

**1. Qualify as Validator**:
```javascript
const ronBalance = await ron.balanceOf(userAddress);
// Need: 100 RON minimum for Bronze
```

**2. Browse Requests**:
```javascript
const requests = await oracleNetwork.getOpenRequests({
  tier: ValidatorTier.Bronze,
  category: "PRICE_DATA",
  minReward: 100
});
```

**3. Stake and Submit**:
```javascript
await oracleNetwork.submitValidation(
  requestId,
  ethers.keccak256(ethers.toUtf8Bytes("43250.50")),
  "ipfs://QmProofHash...",
  10 // Stake 10 RON
);
```

**4. Wait for Consensus**:
- Other validators submit answers
- Consensus algorithm determines majority
- Results finalized automatically

**5. Claim Rewards**:
```javascript
const reward = await oracleNetwork.claimValidationReward(requestId);
console.log(`Earned: ${ethers.formatEther(reward)} RDLN`);
```

---

## 📈 Integration with Ecosystem

### Airdrop Phase 3 Connection
- **Every validation earns Oracle payment** (~3,333 RDLN avg)
- **Plus Phase 3 airdrop bonus** (500 RDLN per validation)
- **Total per validation**: ~3,833 RDLN
- **10+ validations**: Unlock 25% Phase 3 bonus

### RON Progression
- Earn RON through validations
- Higher RON → Higher validator tier
- Higher tier → Better request access
- Better requests → More RDLN earned

### DAO Governance
- Validators accumulate RON (voting power)
- 1 RON = 1 vote in governance
- Influence protocol parameters
- Vote on Oracle Network improvements

---

## 💻 Developer Integration

### For Companies (Create Requests)

```javascript
// Web3 Integration
const oracle = new ethers.Contract(
  ORACLE_ADDRESS,
  ORACLE_ABI,
  signer
);

// Create validation request
const tx = await oracle.createValidationRequest(
  dataHash,
  "What was ETH/USD at 12:00 UTC?",
  5,  // validators
  3,  // threshold
  ethers.parseEther("500"), // reward
  Math.floor(Date.now() / 1000) + 86400, // deadline
  "PRICE_DATA"
);

// Wait for consensus
const filter = oracle.filters.ConsensusReached(requestId);
oracle.once(filter, (requestId, answer) => {
  console.log(`Consensus answer: ${answer}`);
});
```

### For Validators (Submit Validations)

```javascript
// Check eligibility
const tier = await oracle.getValidatorTier(validatorAddress);
const canValidate = tier >= ValidatorTier.Bronze;

// Submit validation
if (canValidate) {
  await oracle.submitValidation(
    requestId,
    answerHash,
    proofURI,
    stakeAmount
  );
}

// Track reputation
const profile = await oracle.getValidatorProfile(validatorAddress);
console.log(`Accuracy: ${profile.accuracy}%`);
console.log(`Total earned: ${ethers.formatEther(profile.totalEarned)} RDLN`);
```

---

## 📊 Monitoring & Analytics

### Validator Dashboard

```javascript
// Get complete validator stats
const stats = await oracle.getValidatorProfile(validatorAddress);

console.log(`Tier: ${stats.tier}`);
console.log(`Total Validations: ${stats.totalValidations}`);
console.log(`Correct: ${stats.correctValidations}`);
console.log(`Accuracy: ${stats.accuracy}%`);
console.log(`Total Earned: ${ethers.formatEther(stats.totalEarned)} RDLN`);
console.log(`Total Slashed: ${ethers.formatEther(stats.totalSlashed)} RON`);
console.log(`Suspended: ${stats.isSuspended}`);
```

### Request Status

```javascript
const request = await oracle.getRequest(requestId);

console.log(`Status: ${request.status}`);
console.log(`Validators: ${request.validators.length}/${request.requiredValidators}`);
console.log(`Consensus: ${request.consensusAnswer || 'Pending'}`);
console.log(`Deadline: ${new Date(request.deadline * 1000)}`);
```

---

## 🤝 For Enterprises

### Why Use Riddlen Oracle?

✅ **Cheaper than Chainlink/API3**: Set your own reward amount
✅ **Human Judgment**: Complex data requiring interpretation
✅ **Fast**: 24-hour typical consensus
✅ **Flexible**: Customize validators, threshold, deadline
✅ **Reputation-Backed**: High-quality validators with skin in the game

### Getting Started

1. **Acquire RDLN**: Buy on DEX or earn through ecosystem
2. **Design Request**: Define question, validators needed, consensus threshold
3. **Set Reward**: Higher reward = faster validator participation
4. **Submit Request**: Call `createValidationRequest()` with parameters
5. **Wait for Consensus**: Typically 6-24 hours
6. **Use Result**: Verified data available on-chain

**Contact**: enterprise@riddlen.com for custom integrations

---

## 🔗 Related Documentation

- 🎁 **[Airdrop Guide](airdrop.html)** - Phase 3 validation rewards
- 🏛️ **[Governance](governance.html)** - RON-based voting
- 💻 **[Frontend Integration](FRONTEND_INTEGRATION.html)** - Developer guide
- 📋 **[FAQ](faq.html)** - Common questions

---

## 📞 Support

**Validators**:
- 💬 [Telegram Community](https://t.me/RiddlenCommunity)
- 📖 [Technical Docs](https://github.com/RiddlenBaba/riddlen)

**Enterprises**:
- 📧 enterprise@riddlen.com
- 📞 Schedule demo call

**Contract**: `0xBd005201294984eFf3c353c32c9E5a96Fd640493`

---

*Last updated: October 2025 • Riddlen Protocol v6.0*
