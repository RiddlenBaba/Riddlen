# Riddlen Airdrop v6.0 - Complete User Journey

## 📋 Overview

**Total Airdrop Pool:** 100,000,000 RDLN
- Phase 1: 33M RDLN (Social Proof)
- Phase 2: 33M RDLN (RON Reputation)
- Phase 3: 34M RDLN (Validation Earning)

**Global Maximum:** 15,000 RDLN per wallet across ALL phases

---

## 🎯 User Journey: Meet Alice

Alice wants to maximize her RDLN earnings from the airdrop. Here's her complete journey:

---

## Phase 1: Social Proof Airdrop (Easy Entry)

### Step 1: Social Proof Submission
**What Alice does:**
1. Connects wallet to Riddlen platform
2. Clicks "Claim Phase 1 Airdrop"
3. Enters her Twitter handle: `@AliceCrypto`
4. Enters her Telegram handle: `@alice_tg`
5. Clicks "Submit Proof"

**What happens on-chain:**
```solidity
airdrop.submitSocialProof("@AliceCrypto", "@alice_tg")
```

**Status:** ⏳ Waiting for operator verification

---

### Step 2: Complete Social Tasks
**What Alice must do:**
1. ✅ Follow Riddlen on Twitter
2. ✅ Join Riddlen Telegram group
3. ✅ Share Riddlen post on Twitter

**Platform shows:** "Complete these tasks to qualify for verification"

---

### Step 3: Operator Verification
**What the operator does:**
- Checks Alice completed all 3 tasks
- Verifies handles are real
- Approves Alice

**What happens on-chain:**
```solidity
airdrop.verifySocialProof(alice.address, true, true, true)
```

**Alice's Status:** ✅ Verified! Ready to claim

---

### Step 4: Claim Phase 1
**What Alice does:**
1. Sees "You're verified! Claim 5,000 RDLN"
2. Clicks "Claim Phase 1"
3. Confirms transaction

**What happens on-chain:**
```solidity
airdrop.claimPhase1()
```

**Result:**
- ✅ Alice receives **5,000 RDLN**
- 📊 Total claimed: **5,000 / 15,000 RDLN** (33% of max)
- 💰 Alice's wallet: **5,000 RDLN**

---

## Phase 2: RON Reputation Airdrop (Passive Rewards)

### Step 5: Earn RON Tokens
**What Alice does:**
- Participates in Riddlen ecosystem:
  - Solves riddles
  - Completes challenges
  - Earns reputation points

**Result:** Alice earns **5,500 RON tokens** over time

---

### Step 6: Wait for Snapshot
**What happens:**
- Admin takes RON balance snapshot at specific block
- Alice has 5,500 RON at snapshot time

**What happens on-chain:**
```solidity
airdrop.takeRONSnapshot([alice.address, bob.address, ...])
```

**Alice's RON balance frozen:** 5,500 RON (qualifies for Tier 2)

---

### Step 7: Check Phase 2 Eligibility
**What Alice sees on dashboard:**
```
Phase 2 Status:
✅ Snapshot taken
✅ Your RON: 5,500
✅ Your Tier: Tier 2
💰 Your Reward: 3,000 RDLN
🎯 Status: Ready to claim!
```

**Tier Breakdown:**
- Tier 1 (1K-5K RON): 2,000 RDLN
- Tier 2 (5K-10K RON): 3,000 RDLN ← **Alice is here**
- Tier 3 (10K-25K RON): 4,000 RDLN
- Tier 4 (25K+ RON): 5,000 RDLN

---

### Step 8: Claim Phase 2
**What Alice does:**
1. Clicks "Claim Phase 2"
2. Confirms transaction

**What happens on-chain:**
```solidity
airdrop.claimPhase2()
```

**Result:**
- ✅ Alice receives **3,000 RDLN**
- 📊 Total claimed: **8,000 / 15,000 RDLN** (53% of max)
- 💰 Alice's wallet: **8,000 RDLN** (5K from Phase 1 + 3K from Phase 2)

---

## Phase 3: Validation-Based Earning (Active Work)

### Step 9: Become a Validator
**What Alice does:**
1. Navigates to "Oracle Network"
2. Clicks "Become Validator"
3. System checks: Does Alice have 100+ RON? ✅ Yes (she has 5,500 RON)
4. Alice is now a Bronze Tier Validator

**Bronze Tier Requirements:**
- Minimum: 100 RON balance for Oracle Network
- **Phase 3 Airdrop:** Requires 1,000+ RON balance
- Alice has 5,500 RON ✅ Qualifies for Phase 3!

---

### Step 10: Complete Validations (Earning Mode)

#### Validation #1
**A requester posts a validation request:**
```
Task: "Verify if this data hash matches the document"
Reward Pool: 10,000 RDLN
Required Validators: 3
Consensus: 2 of 3 must agree
```

**What Alice does:**
1. Reviews the validation task
2. Performs the work (checks the data)
3. Submits answer: "YES"
4. Stakes 10 RON as collateral

**What happens on-chain:**
```solidity
oracleNetwork.submitValidation(
    requestId: 1,
    answer: "YES",
    proof: "ipfs://...",
    ronStake: 10 RON
)
```

**Other validators also submit:**
- Validator Bob: "YES" (stakes 10 RON)
- Validator Carol: "YES" (stakes 10 RON)

**Consensus reached:** ✅ 3/3 agree on "YES"

**Result:**
- ✅ Alice earns **~3,333 RDLN** (10K reward ÷ 3 validators)
- ✅ Alice's staked 10 RON returned
- ✅ Alice's validation count: **1**
- 💰 Alice's wallet: **8,000 RDLN** (airdrop) + **3,333 RDLN** (oracle) = **11,333 RDLN**

---

#### Validations #2 and #3
**Alice repeats the process:**
- Completes validation #2 → Earns 3,333 RDLN
- Completes validation #3 → Earns 3,333 RDLN

**Alice's Oracle Stats:**
- ✅ Total Validations: **3**
- ✅ Correct: **3**
- ✅ Accuracy: **100%**
- 💰 Total Oracle Earnings: **~10,000 RDLN**

---

### Step 11: Claim Phase 3 Airdrop (First Time)

**What Alice sees on dashboard:**
```
Phase 3 Status:
✅ Phase 3 Active
✅ Total Validations: 3
✅ RON Balance: 5,500 (requires 1,000+) ✅
✅ New Validations: 3 (since last claim)
💰 Estimated Reward: 1,500 RDLN (3 × 500)
🎯 Your Progress: 0 / 5,000 RDLN claimed this phase
📊 Global Progress: 8,000 / 15,000 RDLN total claimed
```

**How Phase 3 rewards work:**
- **Base Rate:** 500 RDLN per validation
- **Phase 3 Max:** 5,000 RDLN per wallet
- **Bonus:** 25% extra if you've completed 10+ total validations

**What Alice does:**
1. Clicks "Claim Phase 3 Rewards"
2. Confirms transaction

**What happens on-chain:**
```solidity
airdrop.claimPhase3()

Calculations:
- New validations: 3
- Base reward: 3 × 500 = 1,500 RDLN
- Bonus: 0 (needs 10+ validations)
- Total reward: 1,500 RDLN
- Phase 3 claimed so far: 0 + 1,500 = 1,500 RDLN
- Global limit check: 8,000 + 1,500 = 9,500 RDLN ✅ (under 15K)
```

**Result:**
- ✅ Alice receives **1,500 RDLN**
- 📊 Total claimed: **9,500 / 15,000 RDLN** (63% of max)
- 📊 Phase 3 claimed: **1,500 / 5,000 RDLN** (30% of phase max)
- 💰 Alice's total wallet: **~20,833 RDLN** (8K airdrop + 1.5K Phase 3 + 10K oracle direct)

---

### Step 12: Complete More Validations

**Alice continues working:**
- Validation #4 → Earns 3,333 RDLN (oracle)
- Validation #5 → Earns 3,333 RDLN (oracle)
- Validation #6 → Earns 3,333 RDLN (oracle)
- Validation #7 → Earns 3,333 RDLN (oracle)

**Alice's Oracle Stats:**
- ✅ Total Validations: **7**
- 💰 Total Oracle Earnings: **~23,000 RDLN** (direct payments)

---

### Step 13: Claim Phase 3 Again

**What Alice sees:**
```
Phase 3 Status:
✅ Total Validations: 7
✅ New Validations: 4 (since last claim)
💰 Estimated Reward: 2,000 RDLN (4 × 500)
🎯 Your Progress: 1,500 / 5,000 RDLN claimed this phase
📊 Global Progress: 9,500 / 15,000 RDLN total claimed
```

**What Alice does:**
Clicks "Claim Phase 3 Rewards" again

**What happens on-chain:**
```solidity
airdrop.claimPhase3()

Calculations:
- New validations: 4 (7 total - 3 previously claimed)
- Base reward: 4 × 500 = 2,000 RDLN
- Bonus: 0 (still under 10 validations)
- Total reward: 2,000 RDLN
- Phase 3 claimed so far: 1,500 + 2,000 = 3,500 RDLN
- Global limit check: 9,500 + 2,000 = 11,500 RDLN ✅ (under 15K)
```

**Result:**
- ✅ Alice receives **2,000 RDLN**
- 📊 Total airdrop claimed: **11,500 / 15,000 RDLN** (77% of max)
- 📊 Phase 3 claimed: **3,500 / 5,000 RDLN** (70% of phase max)
- 💰 Remaining claimable: **3,500 RDLN** (to hit 15K max)

---

### Step 14: Push for Bonus (10+ Validations)

**Alice completes 3 more validations:**
- Validation #8 → Earns 3,333 RDLN (oracle)
- Validation #9 → Earns 3,333 RDLN (oracle)
- Validation #10 → Earns 3,333 RDLN (oracle)

**Alice's Oracle Stats:**
- ✅ Total Validations: **10** 🎉 **BONUS UNLOCKED!**
- 💰 Total Oracle Earnings: **~33,000 RDLN** (direct payments)

---

### Step 15: Claim Phase 3 with Bonus

**What Alice sees:**
```
Phase 3 Status:
✅ Total Validations: 10 🎉 BONUS TIER!
✅ New Validations: 3 (since last claim)
💰 Base Reward: 1,500 RDLN (3 × 500)
🎁 Bonus: 375 RDLN (25% boost!)
💰 Total Reward: 1,875 RDLN
🎯 Your Progress: 3,500 / 5,000 RDLN claimed this phase
📊 Global Progress: 11,500 / 15,000 RDLN total claimed
⚠️ Note: Capped at 3,500 RDLN (global 15K limit)
```

**What happens on-chain:**
```solidity
airdrop.claimPhase3()

Calculations:
- New validations: 3 (10 total - 7 previously claimed)
- Base reward: 3 × 500 = 1,500 RDLN
- Bonus: 1,500 × 25% = 375 RDLN (10+ validations!)
- Calculated reward: 1,875 RDLN
- Phase 3 limit: 3,500 + 1,875 = 5,375 RDLN → Capped at 5,000 RDLN
- Actual Phase 3 reward: 5,000 - 3,500 = 1,500 RDLN
- Global limit check: 11,500 + 1,500 = 13,000 RDLN ✅ (under 15K)
```

**Result:**
- ✅ Alice receives **1,500 RDLN** (capped by Phase 3 max)
- 📊 Total airdrop claimed: **13,000 / 15,000 RDLN** (87% of max)
- 📊 Phase 3 claimed: **5,000 / 5,000 RDLN** ✅ **PHASE 3 MAXED OUT!**
- 💰 Remaining claimable: **2,000 RDLN** (from airdrop)

---

## 📊 Alice's Final Summary

### Total RDLN Earned

| Source | Amount | Details |
|--------|--------|---------|
| **Phase 1** | 5,000 RDLN | Social proof |
| **Phase 2** | 3,000 RDLN | RON reputation (Tier 2) |
| **Phase 3** | 5,000 RDLN | Validation rewards (maxed out) |
| **Oracle Direct** | ~33,000 RDLN | 10 validations × ~3,333 RDLN each |
| **Total** | **~46,000 RDLN** | 🎉 |

### Airdrop Breakdown
- ✅ **13,000 RDLN** from airdrop contract
- ✅ **33,000 RDLN** earned directly from Oracle Network
- 📊 **15K airdrop limit:** 13,000 / 15,000 used (2K remaining)

### What Alice Could Still Do
Alice could claim **2,000 more RDLN** from the airdrop if she:
- Earns more RON and waits for another Phase 2 snapshot (but she already maxed Phase 2 at 3K)
- ❌ Phase 3 is maxed out at 5K
- ❌ Phase 1 is one-time only at 5K

**Reality:** Alice has effectively maximized her airdrop earnings!

---

## 🎯 Key Takeaways

### For Users:
1. **Phase 1:** Quick 5K RDLN for social engagement
2. **Phase 2:** Passive rewards for holding RON
3. **Phase 3:** Active earning by doing validation work
4. **Bonus Strategy:** Complete 10+ validations for 25% bonus
5. **Global Limit:** 15K RDLN max across all phases

### Multiple Revenue Streams:
- 🎁 **Airdrop:** Up to 15K RDLN (passive + light work)
- 💼 **Oracle Earnings:** Unlimited RDLN (active work)
- 🏆 **Combined Potential:** Massive earnings for active validators

### Time Investment:
- **Phase 1:** 10 minutes (social tasks)
- **Phase 2:** 0 minutes (automatic if you have RON)
- **Phase 3:** ~1 hour per validation × 10 validations = 10 hours work
- **Total Airdrop Earnings:** 13,000 RDLN for ~10 hours = **1,300 RDLN/hour**
- **Plus Oracle Direct:** 33,000 RDLN for same 10 validations = **4,600 RDLN/hour total**

---

## 💡 Pro Tips

### Maximize Your Earnings:
1. ✅ **Start with Phase 1** - Easiest 5K RDLN
2. ✅ **Earn RON early** - Qualify for better Phase 2 tiers
3. ✅ **Become a validator ASAP** - Start earning from both Oracle + Phase 3
4. ✅ **Push to 10 validations** - Unlock 25% bonus
5. ✅ **Track your limits** - Use `getRemainingClaimable()` to see what's left

### Common Mistakes:
- ❌ **Don't ignore Phase 1** - Free 5K RDLN just for social tasks
- ❌ **Don't sell your RON** - Need it for Phase 2 snapshot
- ❌ **Don't rush validations** - Quality over quantity for accuracy
- ❌ **Don't forget to claim Phase 3** - Must manually claim after validations

---

## 🚀 All Three Phases Run Simultaneously!

**Important:** Unlike traditional airdrops, all phases are ACTIVE at the same time:
- You can claim Phase 1 TODAY
- You can claim Phase 2 whenever snapshot is taken
- You can claim Phase 3 MULTIPLE times as you complete validations

**This means:** Maximum flexibility and earning potential!

---

**Questions? Check the smart contract:**
- Phase 1: `contracts/RiddlenAirdrop.sol:354`
- Phase 2: `contracts/RiddlenAirdrop.sol:463`
- Phase 3: `contracts/RiddlenAirdrop.sol:553`

**Ready to start earning? Connect your wallet and begin!** 🎉
