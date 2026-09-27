# 🚀 RiddlenOracleNetwork - Deployment Guide

**Date**: 2025-09-30
**Contract**: RiddlenOracleNetwork.sol
**Status**: ✅ **READY FOR DEPLOYMENT**

---

## 📋 Pre-Deployment Checklist

### Contract Verification
- ✅ Follows Riddlen Security Standards 2025
- ✅ UUPS upgradeable pattern
- ✅ Role-based access control (4 roles)
- ✅ Reentrancy protection on all state-changing functions
- ✅ Pausable functionality
- ✅ Circuit breakers for critical operations
- ✅ Emergency functions with limits
- ✅ Comprehensive event logging (11 event types)
- ✅ Input validation on all functions
- ✅ Immutable constants for limits
- ✅ Rate limiting (validator cooldown)
- ✅ Transparent fee distribution
- ✅ No hardcoded costs (dynamic pricing)
- ✅ No admin backdoors

### Required Information

**Existing Contract Addresses** (from ecosystem):
```solidity
RDLN Token: 0x[deployed_address]
RON Token: 0x[deployed_address]
```

**Wallet Addresses**:
```solidity
Treasury Wallet: 0x[your_address]
Buyback Wallet: 0x[your_address]
Admin Address: 0x[your_address]
```

**Initial Configuration**:
```solidity
Protocol Fee: 1000 (10%)
Slash Percent: 5000 (50%)
Slash Burn Percent: 5000 (50% of slashed amount)
```

---

## 🔧 Deployment Steps

### Step 1: Compile Contract

```bash
cd /var/www/riddlen/contracts
npx hardhat compile
```

**Expected Output**:
```
Compiled 1 Solidity file successfully
```

### Step 2: Create Deployment Script

Create `scripts/deployOracle.js`:

```javascript
const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("Deploying RiddlenOracleNetwork...");

    // Get contract factory
    const RiddlenOracleNetwork = await ethers.getContractFactory("RiddlenOracleNetwork");

    // Configuration
    const RDLN_ADDRESS = "0x[deployed_rdln_address]";
    const RON_ADDRESS = "0x[deployed_ron_address]";
    const TREASURY_WALLET = "0x[your_treasury_wallet]";
    const BUYBACK_WALLET = "0x[your_buyback_wallet]";
    const ADMIN_ADDRESS = "0x[your_admin_address]";

    // Deploy proxy
    const oracle = await upgrades.deployProxy(
        RiddlenOracleNetwork,
        [
            RDLN_ADDRESS,
            RON_ADDRESS,
            TREASURY_WALLET,
            BUYBACK_WALLET,
            ADMIN_ADDRESS
        ],
        {
            initializer: "initialize",
            kind: "uups"
        }
    );

    await oracle.waitForDeployment();
    const address = await oracle.getAddress();

    console.log("✅ RiddlenOracleNetwork deployed to:", address);
    console.log("📝 Save this address for verification and frontend integration");

    // Verify initial state
    console.log("\nVerifying deployment...");
    console.log("RDLN Token:", await oracle.rdlnToken());
    console.log("RON Token:", await oracle.ronToken());
    console.log("Treasury:", await oracle.treasuryWallet());
    console.log("Buyback:", await oracle.buybackWallet());
    console.log("Protocol Fee:", await oracle.protocolFeePercent(), "/ 10000");
    console.log("Max Daily Requests:", await oracle.MAX_DAILY_REQUESTS());
    console.log("Max Single Reward:", ethers.formatEther(await oracle.MAX_SINGLE_REWARD()), "RDLN");

    // Check roles
    const ADMIN_ROLE = await oracle.ADMIN_ROLE();
    const UPGRADER_ROLE = await oracle.UPGRADER_ROLE();
    const PAUSER_ROLE = await oracle.PAUSER_ROLE();

    console.log("\nRole Assignments:");
    console.log("Admin has ADMIN_ROLE:", await oracle.hasRole(ADMIN_ROLE, ADMIN_ADDRESS));
    console.log("Admin has UPGRADER_ROLE:", await oracle.hasRole(UPGRADER_ROLE, ADMIN_ADDRESS));
    console.log("Admin has PAUSER_ROLE:", await oracle.hasRole(PAUSER_ROLE, ADMIN_ADDRESS));

    console.log("\n✅ Deployment complete!");
    console.log("🔗 Implementation address will be shown by hardhat-upgrades");

    return address;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

### Step 3: Deploy to Testnet (Amoy)

```bash
npx hardhat run scripts/deployOracle.js --network amoy
```

**Expected Output**:
```
Deploying RiddlenOracleNetwork...
✅ RiddlenOracleNetwork deployed to: 0x[proxy_address]
📝 Save this address for verification and frontend integration

Verifying deployment...
RDLN Token: 0x[rdln_address]
RON Token: 0x[ron_address]
Treasury: 0x[treasury_address]
Buyback: 0x[buyback_address]
Protocol Fee: 1000 / 10000
Max Daily Requests: 1000
Max Single Reward: 1000000.0 RDLN

Role Assignments:
Admin has ADMIN_ROLE: true
Admin has UPGRADER_ROLE: true
Admin has PAUSER_ROLE: true

✅ Deployment complete!
```

### Step 4: Verify Contract on PolygonScan

```bash
npx hardhat verify --network amoy 0x[proxy_address]
```

---

## 🔑 Post-Deployment Configuration

### 1. Grant Additional Roles (Optional)

If you want separate addresses for different roles:

```javascript
// scripts/configureRoles.js
const oracleAddress = "0x[deployed_proxy_address]";
const oracle = await ethers.getContractAt("RiddlenOracleNetwork", oracleAddress);

// Grant OPERATOR_ROLE for day-to-day operations
await oracle.grantRole(
    await oracle.OPERATOR_ROLE(),
    "0x[operator_address]"
);

// Grant PAUSER_ROLE to security multisig
await oracle.grantRole(
    await oracle.PAUSER_ROLE(),
    "0x[security_multisig_address]"
);

console.log("✅ Roles configured");
```

### 2. Approve RDLN Spending (For Companies)

Companies need to approve the oracle to spend RDLN:

```javascript
const rdln = await ethers.getContractAt("RDLNUpgradeable", RDLN_ADDRESS);
await rdln.approve(oracleAddress, ethers.MaxUint256);
```

### 3. Test Request Creation

```javascript
// scripts/testRequest.js
const oracle = await ethers.getContractAt("RiddlenOracleNetwork", oracleAddress);

// Create test request
const dataHash = ethers.keccak256(ethers.toUtf8Bytes("BTC price at timestamp X"));
const tx = await oracle.createValidationRequest(
    dataHash,
    "What was BTC/USD at 2025-09-30 12:00 UTC?",
    "Price Data",
    7,  // requiredValidators
    5,  // consensusThreshold (5 of 7)
    ethers.parseEther("1000"),  // 1000 RDLN reward
    86400,  // 24 hours deadline
    0  // ValidatorTier.Bronze
);

const receipt = await tx.wait();
console.log("✅ Test request created:", receipt.hash);
```

---

## 📊 Integration Points

### For Frontend

**Get Open Requests**:
```javascript
const requests = await oracle.getOpenRequests(0, 10);
// Returns array of request IDs
```

**Get Request Details**:
```javascript
const request = await oracle.getValidationRequest(requestId);
console.log("Question:", request.question);
console.log("Category:", request.category);
console.log("Reward Pool:", ethers.formatEther(request.rewardPool));
console.log("Required Validators:", request.requiredValidators);
console.log("Deadline:", new Date(Number(request.deadline) * 1000));
```

**Get Validator Profile**:
```javascript
const profile = await oracle.getValidatorProfile(userAddress);
console.log("Total Validations:", profile.totalValidations);
console.log("Accuracy:", profile.accuracy, "%");
console.log("Total Earned:", ethers.formatEther(profile.totalEarned));
console.log("Tier:", profile.tier); // 0=Bronze, 1=Silver, 2=Gold, 3=Platinum
```

**Submit Validation**:
```javascript
// User stakes RON
const ron = await ethers.getContractAt("IRON", RON_ADDRESS);
await ron.approve(oracleAddress, stakeAmount);

// Submit validation
await oracle.submitValidation(
    requestId,
    answerHash,
    "ipfs://QmProofHash...",
    stakeAmount
);
```

### Event Listening

```javascript
// Listen for new requests
oracle.on("ValidationRequestCreated", (requestId, requester, category, reward) => {
    console.log(`New ${category} request: ${requestId} with ${ethers.formatEther(reward)} RDLN`);
});

// Listen for consensus
oracle.on("ConsensusReached", (requestId, answer, validatorCount) => {
    console.log(`Consensus reached for ${requestId}: ${answer} (${validatorCount} validators)`);
});

// Listen for rewards
oracle.on("RewardDistributed", (requestId, validator, amount, bonus) => {
    console.log(`${validator} earned ${ethers.formatEther(amount)} RDLN`);
});
```

---

## 🛡️ Security Operations

### Emergency Pause

If suspicious activity detected:

```javascript
const oracle = await ethers.getContractAt("RiddlenOracleNetwork", oracleAddress);
await oracle.pause();
console.log("✅ Contract paused");
```

### Emergency Unpause

After issue resolved:

```javascript
await oracle.unpause();
console.log("✅ Contract unpaused");
```

### Emergency Withdrawal

Only when paused, max 3 times, 30-day cooldown:

```javascript
await oracle.emergencyWithdraw(
    ethers.parseEther("10000"),
    "Security incident - moving funds to safe wallet"
);
```

### Update Configuration

```javascript
// Change protocol fee (1000 = 10%)
await oracle.updateProtocolFee(800); // 8%

// Update wallets
await oracle.updateTreasuryWallet("0x[new_treasury]");
await oracle.updateBuybackWallet("0x[new_buyback]");
```

---

## 📈 Monitoring

### Key Metrics to Track

**Daily Operations**:
```javascript
const today = Math.floor(Date.now() / 1000 / 86400);
const requestCount = await oracle.dailyRequestCount(today);
console.log("Requests today:", requestCount, "/ 1000");
```

**Protocol Revenue**:
```javascript
// Track ProtocolFeeDistributed events
const filter = oracle.filters.ProtocolFeeDistributed();
const events = await oracle.queryFilter(filter);
const totalFees = events.reduce((sum, e) => sum + e.args.amount, 0n);
console.log("Total protocol fees:", ethers.formatEther(totalFees), "RDLN");
```

**Validator Statistics**:
```javascript
const stats = await oracle.getValidatorStats(validatorAddress);
console.log("Accuracy:", stats.accuracy, "%");
console.log("Total earned:", ethers.formatEther(stats.totalEarned));
console.log("Total slashed:", ethers.formatEther(stats.totalSlashed));
```

### Alerts to Set Up

1. **Circuit Breaker Triggered**: Monitor `CircuitBreakerTriggered` events
2. **High Slash Rate**: Alert if >20% of validators being slashed
3. **Low Consensus Rate**: Alert if <80% of requests reach consensus
4. **Emergency Actions**: Immediate notification on any `EmergencyAction` event
5. **Daily Limit Approaching**: Alert at 80% of MAX_DAILY_REQUESTS

---

## 🧪 Testing Checklist

Before mainnet deployment:

### Functional Tests
- [ ] Create validation request with various parameters
- [ ] Submit validations from multiple validators
- [ ] Reach consensus (majority agreement)
- [ ] Verify reward distribution
- [ ] Test slash mechanism (incorrect validators)
- [ ] Test no consensus scenario
- [ ] Test request cancellation
- [ ] Test finalization before deadline
- [ ] Test finalization after deadline

### Security Tests
- [ ] Circuit breaker triggers at daily limit
- [ ] Circuit breaker triggers at single reward limit
- [ ] Cannot create request with invalid parameters
- [ ] Cannot submit validation without RON balance
- [ ] Cannot submit validation below tier requirement
- [ ] Cannot submit validation during cooldown
- [ ] Suspended validators cannot validate
- [ ] Cannot finalize request twice
- [ ] Cannot claim rewards twice
- [ ] Pause prevents all operations
- [ ] Only pauser can pause
- [ ] Only admin can unpause
- [ ] Emergency withdrawal only when paused
- [ ] Emergency withdrawal limited to 3 times
- [ ] Emergency withdrawal respects cooldown

### Access Control Tests
- [ ] Only UPGRADER_ROLE can upgrade
- [ ] Only ADMIN_ROLE can update configuration
- [ ] Only PAUSER_ROLE can pause
- [ ] Only DEFAULT_ADMIN_ROLE can unpause
- [ ] Only OPERATOR_ROLE can force finalize

### Integration Tests
- [ ] RDLN transfers work correctly
- [ ] RON balance checks work correctly
- [ ] Profile updates persist
- [ ] Events emit correctly
- [ ] View functions return correct data

---

## 🌐 Mainnet Deployment

### Additional Steps for Mainnet

1. **Security Audit**: Recommend professional audit before mainnet
2. **Multisig Setup**: Use Gnosis Safe for admin roles
3. **Time Lock**: Consider adding 24-48h timelock for upgrades
4. **Insurance Fund**: Reserve RDLN for emergency situations
5. **Gradual Rollout**:
   - Week 1: 10 requests/day limit (lower MAX_DAILY_REQUESTS)
   - Week 2: 50 requests/day
   - Week 3: 100 requests/day
   - Month 2+: Full 1000 requests/day

### Mainnet Configuration

```javascript
// More conservative limits for initial mainnet launch
const INITIAL_MAX_DAILY_REQUESTS = 10;
const INITIAL_MAX_SINGLE_REWARD = 100_000; // Lower than 1M

// Upgrade after proving stability
await oracle.connect(upgrader).upgradeTo(newImplementation);
```

---

## 📞 Support and Maintenance

### Upgrade Process

When upgrading to new implementation:

```javascript
const RiddlenOracleNetworkV2 = await ethers.getContractFactory("RiddlenOracleNetworkV2");
const upgraded = await upgrades.upgradeProxy(
    oracleAddress,
    RiddlenOracleNetworkV2
);
console.log("✅ Upgraded to V2");
```

### Storage Layout Verification

Always verify storage layout before upgrade:

```bash
npx hardhat verify-storage-layout
```

---

## 🎯 Success Metrics

### Week 1 Targets
- [ ] 10+ validation requests created
- [ ] 20+ validators registered
- [ ] 80%+ consensus rate
- [ ] 0 emergency interventions

### Month 1 Targets
- [ ] 100+ validation requests
- [ ] 100+ active validators
- [ ] 5+ enterprise clients
- [ ] 10,000+ RDLN in protocol fees

### Month 3 Targets
- [ ] 1,000+ validation requests
- [ ] 500+ active validators
- [ ] 20+ enterprise clients
- [ ] 100,000+ RDLN in protocol fees

---

## 🔗 Quick Reference

**Contract**: `RiddlenOracleNetwork.sol`
**Size**: 1,227 lines
**Dependencies**:
- OpenZeppelin Upgradeable v5.0.0+
- Hardhat Upgrades
- RDLN Token (deployed)
- RON Token (deployed)

**Key Constants**:
- MAX_DAILY_REQUESTS: 1,000
- MAX_SINGLE_REWARD: 1,000,000 RDLN
- MIN_REWARD: 10 RDLN
- VALIDATOR_COOLDOWN: 5 minutes
- MAX_EMERGENCY_WITHDRAWALS: 3
- EMERGENCY_COOLDOWN: 30 days

**Roles**:
- DEFAULT_ADMIN_ROLE: Full control
- ADMIN_ROLE: Configuration updates
- UPGRADER_ROLE: Contract upgrades
- PAUSER_ROLE: Emergency pause
- OPERATOR_ROLE: Operations management

**Fee Structure**:
- Protocol Fee: 10% of reward pool
- Distribution: 50% treasury, 30% buyback/burn, 20% validator bonuses
- Slash: 50% of stake (half burned, half to correct validators)

---

## ✅ Deployment Status

- ✅ Contract code complete
- ✅ Security standards verified
- ✅ Documentation complete
- ✅ Deployment scripts ready
- ⏳ Awaiting testnet deployment
- ⏳ Awaiting security audit
- ⏳ Awaiting mainnet deployment

---

**Created**: 2025-09-30
**Status**: 📋 **READY FOR TESTNET DEPLOYMENT**
**Next Step**: Deploy to Amoy testnet and begin testing

---

**Questions or Issues?**
- Review: `/contracts/oracle/RiddlenOracleNetwork.sol`
- Architecture: `ORACLE_NETWORK_ARCHITECTURE.md`
- Security: `RIDDLEN_SECURITY_STANDARDS_2025.md`
- Integration: `COMPLETE_ECOSYSTEM_WITH_ORACLE_V2.md`