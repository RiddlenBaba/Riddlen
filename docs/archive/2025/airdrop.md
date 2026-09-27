---
layout: default
title: "RiddlenAirdrop v6.0 - Three-Phase Token Distribution"
description: "Complete guide to the Riddlen Airdrop system - earn RDLN through social proof, RON reputation, and validation work. 100M RDLN total allocation with fair 15K per-wallet cap."
keywords: "riddlen airdrop, rdln tokens, three phase airdrop, social proof rewards, ron reputation, validation earning, merit based distribution, crypto airdrop"
sitemap:
  priority: 0.9
  changefreq: 'weekly'
  lastmod: 2025-10-01
schema_type: "TechArticle"
---

# 🎁 Riddlen Airdrop v6.0 - Three-Phase Earning System

**Total Pool**: 100,000,000 RDLN
**Global Cap**: 15,000 RDLN maximum per wallet
**Status**: ✅ Live on Amoy Testnet
**Contract**: `0x4f3f2202f3F865074f534aA324a259DF962C6FBA`

---

## 🎯 Overview

The Riddlen Airdrop is a revolutionary **three-phase earning system** that rewards users through:

1. **Phase 1: Social Proof** - Instant 5K RDLN for community engagement
2. **Phase 2: RON Reputation** - Passive rewards based on reputation holdings (2K-5K RDLN)
3. **Phase 3: Validation Work** - Active earning through Oracle Network (500 RDLN per validation)

**Unlike traditional airdrops**, all three phases run **simultaneously**, giving users maximum flexibility to earn based on their preferred participation style.

---

## 📊 Three-Phase Breakdown

### Phase 1: Social Proof Airdrop
**Allocation**: 33,000,000 RDLN
**Per Wallet**: 5,000 RDLN
**Max Participants**: 6,600 users

#### How It Works

1. **Submit Handles**: Enter your Twitter and Telegram handles on riddlen.com
2. **Complete Tasks**:
   - Follow [@RiddlenToken](https://twitter.com/RiddlenToken) on Twitter
   - Join [Riddlen Telegram](https://t.me/RiddlenToken)
   - Share a Riddlen post
3. **Get Verified**: Operator verifies task completion
4. **Claim 5,000 RDLN**: One-time claim after verification

#### Eligibility
- ✅ Complete all 3 social tasks
- ✅ Real Twitter/Telegram accounts (bot prevention)
- ✅ First 6,600 participants only

```javascript
// Check Phase 1 status
const isVerified = await airdrop.phase1Verified(userAddress);
const hasClaimed = await airdrop.phase1Claimed(userAddress);
```

---

### Phase 2: RON Reputation Tiers
**Allocation**: 33,000,000 RDLN
**Per Wallet**: 2,000 - 5,000 RDLN (tier-based)
**Distribution**: Snapshot-based

#### Tier Structure

| Tier | RON Balance Required | Reward | Target Users |
|------|---------------------|--------|--------------|
| **Tier 1** | 1,000 - 4,999 RON | 2,000 RDLN | New solvers |
| **Tier 2** | 5,000 - 9,999 RON | 3,000 RDLN | Regular users |
| **Tier 3** | 10,000 - 24,999 RON | 4,000 RDLN | Active participants |
| **Tier 4** | 25,000+ RON | 5,000 RDLN | Elite community |

#### How It Works

1. **Earn RON**: Solve riddles, validate data, participate in ecosystem
2. **Snapshot Taken**: Admin captures RON balances at specific block
3. **Automatic Tier**: Your tier is calculated based on snapshot balance
4. **Claim Reward**: One-time claim based on your tier

#### Key Features
- **Snapshot-Based**: Prevents manipulation after snapshot
- **Passive Earning**: No action needed beyond earning RON
- **Progressive Rewards**: Higher reputation = higher rewards

```javascript
// Check Phase 2 eligibility
const ronBalance = await ron.balanceOf(userAddress);
const snapshotBalance = await airdrop.phase2SnapshotBalances(userAddress);
const tier = await airdrop.calculatePhase2Tier(userAddress);
const reward = await airdrop.calculatePhase2Reward(userAddress);
```

---

### Phase 3: Validation-Based Earning ⭐
**Allocation**: 34,000,000 RDLN
**Per Validation**: 500 RDLN
**Max Per Wallet**: 5,000 RDLN (from Phase 3)
**Requirements**: 1,000+ RON balance, 3+ validations

#### How It Works

1. **Qualify**: Earn 1,000+ RON tokens
2. **Become Validator**: Join Oracle Network as Bronze tier or higher
3. **Complete Validations**: Validate data requests from enterprises
4. **Earn RDLN**: Get ~3,333 RDLN directly from Oracle + 500 RDLN from airdrop
5. **Claim Repeatedly**: Claim Phase 3 rewards as validations increase

#### Earnings Breakdown

**Per Validation**:
- 🔮 **Oracle Network**: ~3,333 RDLN (direct payment)
- 🎁 **Phase 3 Airdrop**: 500 RDLN (bonus)
- 💰 **Total**: ~3,833 RDLN per validation

**With 10+ Validations** (Bonus Tier):
- ✅ Base: 10 × 500 = 5,000 RDLN
- ✅ Bonus: 25% extra (1,250 RDLN)
- ⚠️ Capped at 5,000 RDLN (Phase 3 max)
- 🔮 Oracle Direct: ~33,333 RDLN
- 💎 **Total Earnings**: ~38,333 RDLN

#### Requirements
- ✅ Minimum 1,000 RON balance
- ✅ At least 3 completed validations
- ✅ Good accuracy record (not suspended)
- ✅ Multiple claims allowed as validations increase

```javascript
// Check Phase 3 eligibility
const ronBalance = await ron.balanceOf(userAddress);
const validatorProfile = await oracleNetwork.getValidatorProfile(userAddress);
const claimable = await airdrop.calculatePhase3Claimable(userAddress);

console.log(`Validations completed: ${validatorProfile.totalValidations}`);
console.log(`Claimable from Phase 3: ${ethers.formatEther(claimable)} RDLN`);
```

---

## 🎯 User Journey Example: Alice's Path to 46K RDLN

### Starting Point
- **RDLN Balance**: 0
- **RON Balance**: 0
- **Goal**: Maximize airdrop earnings

### Step 1: Phase 1 - Social Engagement (10 minutes)
1. Submits Twitter (@AliceCrypto) and Telegram (@alice_tg)
2. Completes all social tasks
3. Gets operator verification
4. **Claims: 5,000 RDLN** ✅

**Running Total**: 5,000 RDLN

### Step 2: Ecosystem Participation (Over Time)
1. Solves EASY riddles
2. Earns 5,500 RON tokens
3. Waits for Phase 2 snapshot

### Step 3: Phase 2 - RON Snapshot
1. Snapshot captures Alice's 5,500 RON
2. Qualifies for **Tier 2** (5K-10K RON)
3. **Claims: 3,000 RDLN** ✅

**Running Total**: 8,000 RDLN (airdrop)

### Step 4: Phase 3 - Become Validator
1. Has 5,500 RON (exceeds 1,000 minimum) ✅
2. Joins Oracle Network as Bronze Validator
3. Begins validation work

### Step 5: Complete Validations (10 hours of work)
1. **Validation #1-3**: Earns ~10,000 RDLN (Oracle) + eligible for Phase 3
2. **Claims Phase 3 (1st time)**: 1,500 RDLN (3 validations × 500)
3. **Validation #4-7**: Earns ~13,333 RDLN more (Oracle)
4. **Claims Phase 3 (2nd time)**: 2,000 RDLN (4 new validations × 500)
5. **Validation #8-10**: Earns ~10,000 RDLN more (Oracle)
6. **Claims Phase 3 (3rd time)**: 1,500 RDLN (capped at 5K Phase 3 max)

**Phase 3 Total**: 5,000 RDLN (from airdrop)
**Oracle Direct**: ~33,333 RDLN (from validation work)

### Final Tally

| Source | Amount | Details |
|--------|--------|---------|
| Phase 1 | 5,000 RDLN | Social proof |
| Phase 2 | 3,000 RDLN | RON Tier 2 |
| Phase 3 | 5,000 RDLN | 10 validations |
| Oracle Direct | ~33,000 RDLN | 10 validations × ~3,333 |
| **TOTAL** | **~46,000 RDLN** | 🎉 |

**Airdrop Total**: 13,000 RDLN (87% of 15K cap)
**Work Income**: 33,000 RDLN (unlimited)
**Time Investment**: ~10 hours
**Hourly Rate**: ~4,600 RDLN/hour

---

## 🔒 Global Limit: Fair Distribution

### 15,000 RDLN Maximum Per Wallet

The airdrop enforces a **global cap of 15,000 RDLN** across all three phases to ensure fair distribution.

#### Why This Matters
- ✅ More users can participate (5K-10K wallets vs fewer whales)
- ✅ Prevents accumulation by single actors
- ✅ Encourages multiple participation vectors
- ✅ Balances passive and active earning

#### How It Works

```solidity
// Global limit check on every claim
uint256 totalClaimed =
    phase1Claimed[user] +
    phase2Claimed[user] +
    phase3Claimed[user];

require(totalClaimed <= MAX_TOTAL_PER_WALLET, "15K limit reached");
```

#### Example Scenarios

**Scenario 1: Max Airdrop Only**
```
Phase 1: 5,000 RDLN
Phase 2: 5,000 RDLN (Tier 4)
Phase 3: 5,000 RDLN
────────────────────
Total:   15,000 RDLN ✅ At limit
Oracle:  Unlimited! 💰
```

**Scenario 2: Active Validator (Alice)**
```
Phase 1: 5,000 RDLN
Phase 2: 3,000 RDLN (Tier 2)
Phase 3: 5,000 RDLN (maxed)
────────────────────
Airdrop: 13,000 RDLN
Oracle:  33,000+ RDLN
Total:   46,000+ RDLN ✅
```

### Remaining Claimable Helper

```javascript
// Check how much airdrop is left
const remaining = await airdrop.getRemainingClaimable(userAddress);
console.log(`You can still claim ${ethers.formatEther(remaining)} RDLN`);
```

---

## 🚀 How to Participate

### Prerequisites
1. **Polygon Amoy Testnet** wallet setup
2. **MetaMask** or compatible Web3 wallet
3. **Twitter** and **Telegram** accounts (Phase 1)

### Phase 1 Steps

1. **Visit** riddlen.com/airdrop
2. **Connect** your Web3 wallet
3. **Submit** social handles:
   ```javascript
   await airdrop.submitSocialProof("@YourTwitter", "@YourTelegram");
   ```
4. **Complete** all social tasks
5. **Wait** for operator verification
6. **Claim** 5,000 RDLN:
   ```javascript
   await airdrop.claimPhase1();
   ```

### Phase 2 Steps

1. **Earn RON** by solving riddles
2. **Wait** for snapshot announcement
3. **Check tier** after snapshot:
   ```javascript
   const tier = await airdrop.calculatePhase2Tier(userAddress);
   const reward = await airdrop.calculatePhase2Reward(userAddress);
   ```
4. **Claim** tier reward:
   ```javascript
   await airdrop.claimPhase2();
   ```

### Phase 3 Steps

1. **Earn 1,000+ RON** (requirement)
2. **Join** Oracle Network as validator
3. **Complete** validation requests
4. **Claim** after 3+ validations:
   ```javascript
   const claimable = await airdrop.calculatePhase3Claimable(userAddress);
   await airdrop.claimPhase3();
   ```
5. **Repeat** claims as validations increase

---

## 💡 Pro Tips & Strategy

### Maximize Your Earnings

1. **Start with Phase 1** - Easiest 5K RDLN (just social tasks)
2. **Earn RON Early** - Qualify for better Phase 2 tier
3. **Don't Sell RON** - Need 1,000+ for Phase 3 eligibility
4. **Push to 10 Validations** - Unlock 25% bonus in Phase 3
5. **Track Your Limit** - Use `getRemainingClaimable()` to optimize

### Common Mistakes to Avoid

- ❌ **Ignoring Phase 1** - Free 5K RDLN for simple tasks
- ❌ **Selling RON Before Snapshot** - Lose Phase 2 eligibility
- ❌ **Rushing Low-Quality Validations** - Accuracy matters
- ❌ **Forgetting to Claim Phase 3** - Must claim manually after work
- ❌ **Not Monitoring Global Limit** - Know your remaining claimable

### Optimal Strategy

**For Casual Users** (Target: 8K-10K RDLN):
1. Complete Phase 1 (5K RDLN)
2. Earn some RON for Tier 1-2 (2K-3K RDLN)
3. Optional: Do a few validations

**For Active Users** (Target: 15K RDLN):
1. Complete Phase 1 (5K RDLN)
2. Earn 25K+ RON for Tier 4 (5K RDLN)
3. Complete 10+ validations (5K RDLN Phase 3)

**For Power Users** (Target: 40K+ RDLN):
1. Complete all phases (13K-15K airdrop)
2. Become serious validator (30K+ direct Oracle earnings)
3. Multiple wallets if needed (unlimited Oracle work)

---

## 📊 Airdrop Statistics & Transparency

### Real-Time Tracking

```javascript
// Get complete airdrop stats
const stats = await airdrop.getAirdropStatistics();

console.log(`Phase 1 claimed: ${ethers.formatEther(stats.phase1TotalClaimed)}`);
console.log(`Phase 2 claimed: ${ethers.formatEther(stats.phase2TotalClaimed)}`);
console.log(`Phase 3 claimed: ${ethers.formatEther(stats.phase3TotalClaimed)}`);
console.log(`Total distributed: ${ethers.formatEther(stats.totalDistributed)}`);
console.log(`Remaining: ${ethers.formatEther(stats.totalRemaining)}`);
```

### Expected Distribution

**Phase 1 Projections**:
- Target: 6,600 participants
- Allocation: 33M RDLN
- Per wallet: 5,000 RDLN

**Phase 2 Projections**:
- Target: ~10,000 RON holders
- Allocation: 33M RDLN
- Average: ~3,300 RDLN per wallet

**Phase 3 Projections**:
- Target: ~2,000 active validators
- Allocation: 34M RDLN
- Average: ~17,000 validations total

**Total Reach**: 10,000-15,000 unique wallets

---

## 🔐 Security & Trust

### Smart Contract Features

✅ **Access Control**: Role-based permissions (ADMIN, OPERATOR, COMPLIANCE)
✅ **Pausable**: Emergency stop mechanism
✅ **Reentrancy Protection**: All claim functions protected
✅ **UUPS Upgradeable**: Can fix bugs without redeployment
✅ **Event Logging**: All claims recorded on-chain

### Audit Status

- ✅ **Self-Audit**: Complete (see SECURITY_AUDIT_RiddlenAirdrop_v6.md)
- ✅ **Test Coverage**: 20/20 tests passing
- 🟡 **Third-Party Audit**: Recommended before mainnet
- ✅ **Production Ready**: Safe for testnet deployment

### Verified Contract

View and verify on PolygonScan:
**Amoy Testnet**: [`0x4f3f2202f3F865074f534aA324a259DF962C6FBA`](https://amoy.polygonscan.com/address/0x4f3f2202f3F865074f534aA324a259DF962C6FBA)

---

## 🤔 Frequently Asked Questions

### General Questions

**Q: Can I participate in all three phases?**
A: Yes! All phases run simultaneously. You can claim from each phase as you qualify.

**Q: What's the global limit?**
A: 15,000 RDLN maximum per wallet across ALL phases combined.

**Q: Can I earn more than 15K RDLN?**
A: Yes, through direct Oracle Network payments (unlimited). The 15K limit only applies to the airdrop contract.

### Phase 1 Questions

**Q: How long does verification take?**
A: Typically 24-48 hours after completing all social tasks.

**Q: What if I don't have Twitter?**
A: Both Twitter and Telegram are required for Phase 1. However, you can still earn from Phase 2 and 3.

**Q: Can I claim Phase 1 twice?**
A: No, Phase 1 is a one-time claim of 5,000 RDLN per wallet.

### Phase 2 Questions

**Q: When is the snapshot taken?**
A: Admin announces snapshot block in advance. Hold RON before the announced block.

**Q: Can I buy RON for Phase 2?**
A: RON is soul-bound (non-transferable). You must earn it by solving riddles or validating.

**Q: What if my RON balance changed after snapshot?**
A: Only your balance at snapshot block matters. Changes after don't affect Phase 2.

### Phase 3 Questions

**Q: Can I claim Phase 3 multiple times?**
A: Yes! Claim repeatedly as you complete more validations, up to 5K RDLN total.

**Q: Why do I need 1,000 RON?**
A: This filters for serious validators with proven commitment to the ecosystem.

**Q: What's the 25% bonus?**
A: Complete 10+ total validations to unlock 25% extra on Phase 3 rewards.

**Q: What if I get suspended as a validator?**
A: Suspended validators cannot claim Phase 3 rewards until suspension is lifted.

---

## 🔗 Related Documentation

- 📖 **[Oracle Network Guide](oracle-network.md)** - Become a validator
- 🏛️ **[Governance System](governance.md)** - DAO and voting
- 🎮 **[Frontend Integration](FRONTEND_INTEGRATION.md)** - Developer guide
- 📋 **[User Journey](../contracts/USER_JOURNEY_AIRDROP.md)** - Detailed walkthrough
- 🔒 **[Security Audit](../contracts/SECURITY_AUDIT_RiddlenAirdrop_v6.md)** - Full security review

---

## 📞 Support & Community

**Need Help?**
- 💬 **[Telegram Community](https://t.me/RiddlenCommunity)** - Get help from the community
- 🐦 **[Twitter](https://twitter.com/RiddlenToken)** - Latest announcements
- 📋 **[GitHub Issues](https://github.com/RiddlenBaba/riddlen/issues)** - Technical support

**Track Your Progress**:
```javascript
// Complete user dashboard
const phase1Status = await airdrop.phase1Claimed(userAddress);
const phase2Status = await airdrop.phase2Claimed(userAddress);
const phase3Claimed = await airdrop.phase3Claimed(userAddress);
const totalClaimed = await airdrop.getTotalClaimed(userAddress);
const remaining = await airdrop.getRemainingClaimable(userAddress);
```

---

**Ready to start earning? All three phases are LIVE on testnet!** 🚀

The future of fair token distribution is here - earn your way to RDLN wealth through intelligence, participation, and work.

*Contract: 0x4f3f2202f3F865074f534aA324a259DF962C6FBA*
*Last updated: October 2025 • Riddlen Protocol v6.0*
