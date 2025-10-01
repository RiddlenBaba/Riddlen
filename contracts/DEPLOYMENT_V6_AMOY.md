# RiddlenAirdrop v6.0 - Amoy Testnet Deployment

**Deployment Date:** 2025-10-01
**Network:** Polygon Amoy Testnet (Chain ID: 80002)
**Deployer:** 0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040

---

## 📋 Deployed Contract Addresses

### Core Contracts

| Contract | Address | Type | Status |
|----------|---------|------|--------|
| **RDLN Token** | `0x133029184EC460F661d05b0dC57BFC916b4AB0eB` | ERC20 | ✅ Active |
| **RON Token** | `0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635` | Soul-bound | ✅ Active |
| **Oracle Network** | `0xBd005201294984eFf3c353c32c9E5a96Fd640493` | UUPS Proxy | ✅ Deployed |
| **Airdrop v6.0** | `0x4f3f2202f3F865074f534aA324a259DF962C6FBA` | UUPS Proxy | ✅ Deployed |

### Implementation Contracts

| Contract | Implementation Address |
|----------|------------------------|
| Oracle Network | `0xDD7431210ff102b0ff335ddd674C0938AE814BDf` |
| Airdrop v6.0 | *Check PolygonScan* |

---

## 🔗 PolygonScan Links

### Proxy Contracts (User Interaction)
- **RDLN Token:** https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB
- **RON Token:** https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635
- **Oracle Network:** https://amoy.polygonscan.com/address/0xBd005201294984eFf3c353c32c9E5a96Fd640493
- **Airdrop v6.0:** https://amoy.polygonscan.com/address/0x4f3f2202f3F865074f534aA324a259DF962C6FBA

### Implementation Contracts
- **Oracle Network Implementation:** https://amoy.polygonscan.com/address/0xDD7431210ff102b0ff335ddd674C0938AE814BDf

---

## 📊 Airdrop Configuration

### Phase Allocations

| Phase | Allocation | Per Wallet | Mechanism |
|-------|-----------|------------|-----------|
| **Phase 1** | 33M RDLN | 5,000 RDLN | Social proof verification |
| **Phase 2** | 33M RDLN | 2K-5K RDLN | RON reputation tiers |
| **Phase 3** | 34M RDLN | Up to 5K RDLN | Validation-based earning |
| **Total** | **100M RDLN** | **15K max** | All phases can run simultaneously |

### Phase 2 Tier Rewards

| Tier | RON Balance | Reward |
|------|-------------|--------|
| Tier 1 | 1,000 - 4,999 | 2,000 RDLN |
| Tier 2 | 5,000 - 9,999 | 3,000 RDLN |
| Tier 3 | 10,000 - 24,999 | 4,000 RDLN |
| Tier 4 | 25,000+ | 5,000 RDLN |

### Phase 3 Configuration

- **Reward Per Validation:** 500 RDLN
- **Max Per Wallet (Phase 3):** 5,000 RDLN
- **Min Validations Required:** 3
- **Min RON Balance Required:** 1,000 RON
- **Bonus Tier:** 25% extra at 10+ validations

### Global Limits

- **Max Per Wallet (All Phases):** 15,000 RDLN
- **Phase 1 Max Participants:** 6,600 wallets

---

## 🔐 Access Control

### Admin Address
**0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040**

### Roles

| Role | Hash | Purpose |
|------|------|---------|
| DEFAULT_ADMIN_ROLE | `0x0000...` | Full admin access |
| UPGRADER_ROLE | `0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3` | Contract upgrades |
| PAUSER_ROLE | `0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a` | Emergency pause |
| OPERATOR_ROLE | `0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929` | Social proof verification |

---

## ✅ Deployment Verification

### Airdrop Contract State
- ✅ RDLN Token Address: Correct
- ✅ RON Token Address: Correct
- ✅ Oracle Network Address: Correct
- ✅ Phase 1 Active: `false` (not activated yet)
- ✅ Phase 2 Active: `false` (not activated yet)
- ✅ Phase 3 Active: `false` (not activated yet)
- ✅ Admin Roles: Correctly assigned

### Oracle Network State
- ✅ RDLN Token: Connected
- ✅ RON Token: Connected
- ✅ Treasury Wallet: Set to deployer
- ✅ Buyback Wallet: Set to deployer
- ✅ Validator Bonus Pool: Set to deployer
- ✅ Protocol Fee: 10%
- ✅ Circuit Breakers: Active

---

## 📝 Next Steps (IMPORTANT)

### 1. Fund the Airdrop Contract

The airdrop contract needs 100M RDLN tokens to distribute rewards.

**Using mintAirdrop (recommended):**
```javascript
// Connect to RDLN contract at 0x133029184EC460F661d05b0dC57BFC916b4AB0eB
const rdln = await ethers.getContractAt("RDLN", "0x133029184EC460F661d05b0dC57BFC916b4AB0eB");
await rdln.mintAirdrop("0x4f3f2202f3F865074f534aA324a259DF962C6FBA", ethers.parseEther("100000000"));
```

**OR using transfer (if already minted):**
```javascript
await rdln.transfer("0x4f3f2202f3F865074f534aA324a259DF962C6FBA", ethers.parseEther("100000000"));
```

### 2. Grant OPERATOR_ROLE for Social Proof Verification

```javascript
// Connect to Airdrop contract
const airdrop = await ethers.getContractAt("RiddlenAirdrop", "0x4f3f2202f3F865074f534aA324a259DF962C6FBA");

// Grant OPERATOR_ROLE to verification wallet
const OPERATOR_ROLE = "0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929";
await airdrop.grantRole(OPERATOR_ROLE, "OPERATOR_WALLET_ADDRESS");
```

### 3. Activate Phases

**Activate Phase 1 (Social Proof):**
```javascript
await airdrop.setPhaseActive(1, true);
```

**Activate Phase 2 (RON Snapshot):**
```javascript
await airdrop.setPhaseActive(2, true);
```

**Activate Phase 3 (Validation Earning):**
```javascript
await airdrop.setPhaseActive(3, true);
```

**Note:** All three phases can run simultaneously!

### 4. Set Up Social Proof Verification

- Configure Twitter API integration for handle verification
- Configure Telegram bot for handle verification
- Set up backend service to call `verifySocialProof()` function

### 5. Fund Oracle Network (Optional)

If you want validators to earn RDLN from validation requests:

```javascript
// Transfer RDLN to Oracle Network for rewards
const oracle = await ethers.getContractAt("RiddlenOracleNetwork", "0xBd005201294984eFf3c353c32c9E5a96Fd640493");
await rdln.transfer(await oracle.getAddress(), ethers.parseEther("AMOUNT"));
```

### 6. Verify Contracts on PolygonScan (Optional)

```bash
# Verify Oracle Network
npx hardhat verify --network amoy 0xBd005201294984eFf3c353c32c9E5a96Fd640493

# Verify Airdrop
npx hardhat verify --network amoy 0x4f3f2202f3F865074f534aA324a259DF962C6FBA
```

---

## 🧪 Testing Checklist

Before activating on mainnet, test these scenarios on Amoy:

### Phase 1 Testing
- [ ] User submits social proof
- [ ] Operator verifies social proof
- [ ] User claims Phase 1 (5K RDLN)
- [ ] Global limit enforced (cannot exceed 15K total)

### Phase 2 Testing
- [ ] Give test users RON tokens
- [ ] Take RON snapshot with test addresses
- [ ] Users claim Phase 2 based on tier
- [ ] Tier calculations correct (2K, 3K, 4K, 5K)
- [ ] Global limit enforced

### Phase 3 Testing
- [ ] User becomes validator (requires 1,000+ RON)
- [ ] User completes validations via Oracle Network
- [ ] User claims Phase 3 rewards (500 RDLN per validation)
- [ ] Multiple claims work correctly
- [ ] 25% bonus applies at 10+ validations
- [ ] 5K Phase 3 max enforced
- [ ] Global 15K limit enforced

### Integration Testing
- [ ] User claims all 3 phases
- [ ] Total claimed correctly tracked
- [ ] getRemainingClaimable() returns correct value
- [ ] View functions return accurate data

### Security Testing
- [ ] Reentrancy protection working
- [ ] Pause mechanism works
- [ ] Upgrade mechanism works (UPGRADER_ROLE only)
- [ ] Only OPERATOR can verify social proof
- [ ] Suspended validators cannot claim Phase 3

---

## 🔧 Maintenance & Monitoring

### Contract Upgrades

Both contracts use UUPS upgradeable pattern:

```javascript
// Upgrade Oracle Network
await oracle.upgradeToAndCall(newImplementationAddress, "0x");

// Upgrade Airdrop
await airdrop.upgradeToAndCall(newImplementationAddress, "0x");
```

### Emergency Procedures

**Pause Airdrop:**
```javascript
await airdrop.pause();
```

**Unpause Airdrop:**
```javascript
await airdrop.unpause();
```

**Emergency Withdraw (Admin only):**
```javascript
await airdrop.emergencyWithdraw(tokenAddress, amount);
```

### Monitoring

Monitor these functions regularly:

```javascript
// Airdrop statistics
const [participants, remaining, phase3Distributed, balance] = await airdrop.getAirdropStats();

// User's total claimed
const totalClaimed = await airdrop.getTotalClaimed(userAddress);

// User's remaining claimable
const remaining = await airdrop.getRemainingClaimable(userAddress);

// Phase 3 status
const [eligible, totalValidations, newValidations, estimatedReward, totalClaimed, remainingPhase3] =
    await airdrop.getPhase3Status(userAddress);
```

---

## 📈 Expected Metrics

### Target Distribution
- **Phase 1:** 6,600 users × 5K = 33M RDLN
- **Phase 2:** ~10,000 users × average 3K = 30-33M RDLN
- **Phase 3:** ~2,000 active validators × average 3K = 6-34M RDLN
- **Total:** ~100M RDLN distributed across 10,000-15,000 wallets

### User Earning Potential
- **Passive User:** 5K (Phase 1 only)
- **RON Holder:** 5K + 2-5K = 7-10K RDLN
- **Active Validator:** 5K + 3K + 5K = 13K RDLN
- **Maximum:** 5K + 5K + 5K = 15K RDLN

---

## 🚨 Security Reminders

### Pre-Mainnet Checklist
- [ ] Remove `autoClaimPhase1()` function (testnet only)
- [ ] Remove `resetSnapshot()` function (testnet only)
- [ ] Set up multi-sig for DEFAULT_ADMIN_ROLE
- [ ] Set up multi-sig for UPGRADER_ROLE
- [ ] Implement timelock for upgrades (24-48 hours)
- [ ] Third-party security audit completed
- [ ] Bug bounty program active

### Known Risks
- ⚠️ Oracle Network is trusted source for Phase 3 validations
- ⚠️ Operator role can selectively verify Phase 1 users
- ⚠️ Operator role controls Phase 2 snapshot timing
- ⚠️ Admin roles have significant power (use multi-sig)

### Mitigations
- ✅ Circuit breakers in Oracle Network
- ✅ Global 15K limit prevents whale accumulation
- ✅ ReentrancyGuard on all claim functions
- ✅ CEI pattern implementation
- ✅ Pausable for emergencies
- ✅ Event logging for transparency

---

## 📚 Documentation Links

- **User Journey:** `USER_JOURNEY_AIRDROP.md`
- **Security Audit:** `SECURITY_AUDIT_RiddlenAirdrop_v6.md`
- **Development Log:** `DEVLOG_AIRDROP_V6.md`
- **Git Notes:** `GIT_COMMIT_NOTES.md`

---

## 🎯 Deployment Status

**Overall Status:** ✅ **DEPLOYED TO TESTNET**

**Ready for:**
- ✅ Testing on Amoy
- ⚠️ Funding with RDLN
- ⚠️ Operator role assignment
- ⚠️ Phase activation
- ❌ Mainnet (requires testing + audit)

---

**Deployment completed:** 2025-10-01
**Next action:** Fund airdrop contract with 100M RDLN and begin testing
**Deployed by:** Claude Code AI Assistant

---

## 📞 Quick Commands Reference

```bash
# Connect to contracts
const rdln = await ethers.getContractAt("RDLN", "0x133029184EC460F661d05b0dC57BFC916b4AB0eB");
const ron = await ethers.getContractAt("RON", "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635");
const oracle = await ethers.getContractAt("RiddlenOracleNetwork", "0xBd005201294984eFf3c353c32c9E5a96Fd640493");
const airdrop = await ethers.getContractAt("RiddlenAirdrop", "0x4f3f2202f3F865074f534aA324a259DF962C6FBA");

# Fund airdrop
await rdln.mintAirdrop(await airdrop.getAddress(), ethers.parseEther("100000000"));

# Activate all phases
await airdrop.setPhaseActive(1, true);
await airdrop.setPhaseActive(2, true);
await airdrop.setPhaseActive(3, true);

# Grant operator role
await airdrop.grantRole("0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929", "OPERATOR_ADDRESS");
```

**🎉 Deployment Complete! Ready for Testing!**
