---
layout: default
title: "Riddlen DAO Governance - Progressive Decentralization"
description: "Complete guide to Riddlen's DAO governance system with transferable Founder Role, RON-based voting, and three-phase progression to full decentralization. 1 RON = 1 vote, earned not bought."
keywords: "riddlen dao, blockchain governance, founder role, ron voting, progressive decentralization, dao governance, merit based voting, biennial halving"
sitemap:
  priority: 0.9
  changefreq: 'weekly'
  lastmod: 2025-10-01
schema_type: "TechArticle"
---

# 🏛️ Riddlen DAO Governance

**Progressive Decentralization with Transferable Founder Role**

**Status**: ✅ Contract Complete, Ready for Deployment
**Voting Power**: 1 RON = 1 Vote (soul-bound, earned only)
**Governance Model**: Three-phase progression to full DAO control

---

## 🎯 Overview

Riddlen implements a **revolutionary governance system** that solves the founder dilemma: how to maintain control during early development while ensuring a clear path to full decentralization.

### The Elegant Solution: FOUNDER_ROLE

Instead of pre-mining governance tokens, Riddlen uses a **smart contract role** that:
- ✅ Gives founder executive powers initially
- ✅ Can be transferred to another person or the DAO itself
- ✅ Can be dissolved permanently (after 1 year minimum)
- ✅ Separates power (role) from reputation (tokens)
- ✅ Ensures fair token distribution (all RON is earned)

**Key Insight**: You don't need tokens to have power. You need a ROLE.

---

## 🗳️ Voting Power: RON Tokens

### 1 RON = 1 Vote

**Voting power is based on RON balance**, not RDLN holdings:

```javascript
// Your voting power
const votingPower = await ron.balanceOf(userAddress);
// If you have 5,000 RON → 5,000 votes
```

### Why RON?

- **Soul-Bound**: Cannot be transferred or traded (prevents vote buying)
- **Earned Only**: Acquired through solving riddles, validation work, and curation
- **Proportional**: More contribution = more reputation = more voting power
- **Fair**: No founder pre-mine, no insider allocations

### How to Earn RON

1. **Solve Riddles**: Earn RON for correct answers
2. **Validate Data**: Earn RON through Oracle Network work
3. **Curate Content**: Earn RON for quality curation
4. **Participate**: Earn RON for ecosystem contributions

See [FAQ](faq.html) for detailed RON earning mechanics.

---

## 👑 The Transferable Founder Role

### Three Phases of Governance

#### Phase 1: Builder Control (Launch Period)

**Founder has full executive powers**:
- ✅ Execute decisions instantly (no DAO vote needed)
- ✅ Veto any DAO proposal
- ✅ Emergency pause/unpause
- ✅ Update protocol parameters
- ✅ Upgrade contracts
- ✅ Control treasury spending

**Community role**:
- Can propose via DAO (advisory only)
- Can vote (founder sees preferences)
- Cannot execute (founder has final say)
- Learning governance

**Duration**: As long as needed to prove product-market fit

```solidity
// Founder executes instantly
function executeAsFounder(
    address target,
    bytes calldata data,
    string calldata description
) external onlyFounder {
    // Execute immediately, no vote needed
    target.call(data);
}
```

---

#### Phase 2: Shared Governance (Transition Period)

**Founder transfers role to DAO contract**:
- Community proposes and votes
- Founder role now belongs to DAO itself
- Proposals execute via normal governance
- No more veto power

**How to transition**:
```javascript
// Transfer founder role to the DAO
await dao.transferFounderRoleToDAO();
// Now DAO has "founder powers" via proposals
```

**Alternative**: Transfer to trusted person or multisig
```javascript
// Transfer to another address
await dao.transferFounderRole(trustedAddress);
```

**When to do this**: After 12-18 months of proven community governance maturity

---

#### Phase 3: Full Decentralization (Final Form)

**Founder role dissolved permanently**:
- Role ceases to exist (irreversible)
- DAO fully controls all protocol functions
- Complete community ownership
- Cleaner code (role logic removed)

**How to dissolve**:
```javascript
// Permanently dissolve founder role (after 1 year minimum)
await dao.dissolveFounderRole();
// This is IRREVERSIBLE
```

**Requirements**:
- Minimum 365 days since deployment
- Cannot be undone
- Founder becomes regular RON holder

---

## 📊 Era-Based Economics

Riddlen's governance uses **biennial (2-year) halving** to progressively lower barriers to participation.

### Proposal Threshold Halving

**Cost to create a proposal decreases every 730 days**:

| Era | Time Period | RON Required | Target Users |
|-----|-------------|--------------|--------------|
| **Era 0** | Launch - Year 2 | 10,000 RON | Early builders |
| **Era 1** | Year 2 - Year 4 | 5,000 RON | Active participants |
| **Era 2** | Year 4 - Year 6 | 2,500 RON | Regular users |
| **Era 3** | Year 6+ | 1,250 RON | Broader community |

**Why decreasing?**
- Early: High threshold filters for serious proposals
- Middle: Moderate threshold allows proven contributors
- Mature: Low threshold enables broad participation

```javascript
// Check current proposal threshold
const currentEra = await dao.getCurrentEra();
const threshold = await dao.getCurrentProposalThreshold();
console.log(`Era ${currentEra}: ${ethers.formatEther(threshold)} RON required`);
```

### Progressive Quorum

**Quorum increases over time to ensure participation**:

| Era | Quorum Required | Rationale |
|-----|-----------------|-----------|
| **Era 0** | 5% of total RON | Easy at launch (small supply) |
| **Era 1** | 6% of total RON | Growing participation |
| **Era 2** | 7% of total RON | Mature ecosystem |
| **Era 3** | 8% of total RON | High engagement expected |
| **Maximum** | 15% cap | Prevents impossible thresholds |

**Formula**: Quorum starts at 5% and increases 1% per era, capped at 15%

```javascript
// Check current quorum
const quorumNumerator = await dao.getCurrentQuorumNumerator();
const totalSupply = await ron.totalSupply();
const quorumRequired = (totalSupply * quorumNumerator) / 100;
console.log(`Quorum: ${ethers.formatEther(quorumRequired)} RON required`);
```

---

## 📋 Proposal & Voting Process

### Step 1: Create a Proposal

**Requirements**:
- Have minimum RON balance (era-based threshold)
- Prepare proposal details
- Optional: Discuss in community forums first

```javascript
// Create proposal
const tx = await dao.propose(
    [targetContract],              // Addresses to call
    [0],                           // ETH values to send
    [encodedFunctionData],         // Function calls to make
    "Proposal: Increase oracle validator rewards by 10%"
);

const proposalId = await dao.hashProposal(
    [targetContract],
    [0],
    [encodedFunctionData],
    ethers.keccak256(ethers.toUtf8Bytes("Proposal: Increase oracle validator rewards by 10%"))
);
```

### Step 2: Voting Delay

**1-day delay before voting begins** (7,200 blocks @ 12s):
- Prevents surprise proposals
- Gives community time to review
- Snapshot taken for voting power

### Step 3: Voting Period

**1-week voting period** (50,400 blocks):
- Users cast votes: FOR, AGAINST, or ABSTAIN
- Voting power = RON balance at snapshot block
- Can delegate voting power to another address

```javascript
// Cast vote
await dao.castVote(proposalId, 1); // 0=Against, 1=For, 2=Abstain

// Or vote with reason
await dao.castVoteWithReason(
    proposalId,
    1,
    "This improves validator incentives"
);
```

### Step 4: Quorum & Threshold Check

**Proposal passes if**:
- ✅ Quorum reached (era-based %)
- ✅ More FOR than AGAINST votes
- ✅ No founder veto (Phase 1 only)

### Step 5: Timelock (48 Hours)

**After passing, 48-hour delay before execution**:
- Allows community to review
- Time to react to malicious proposals
- Can be vetoed in Phase 1
- Industry best practice

### Step 6: Execution

**Proposal executes automatically** (if founder role inactive):
```javascript
await dao.execute(
    [targetContract],
    [0],
    [encodedFunctionData],
    ethers.keccak256(ethers.toUtf8Bytes("Proposal: Increase oracle validator rewards by 10%"))
);
```

**Total timeline**: ~9 days (1 day delay + 7 days voting + 2 days timelock)

---

## 🛡️ Founder Powers (Phase 1 Only)

### Executive Actions

**Instant execution without DAO vote**:
```javascript
await dao.executeAsFounder(
    targetContract,
    encodedFunctionData,
    "Emergency fix for oracle bug"
);
```

**Use cases**:
- Bug fixes
- Emergency responses
- Critical parameter updates
- Fast iteration during early development

### Veto Power

**Founder can veto passed proposals**:
```javascript
await dao.vetoProposal(
    proposalId,
    "Fee too low, hurts protocol sustainability. Let's discuss alternatives."
);
```

**Important**: Veto reasons are public and on-chain (transparent)

### Advisory Execution

**Founder can execute community proposals**:
```javascript
// Community proposal passed
// Founder chooses to execute it
await dao.executeAdvisoryProposal(proposalId);
```

**Shows founder listens to community**, builds trust for eventual transition.

---

## 🎯 Governance Scenarios

### Scenario 1: Phase 1 (Founder Active)

**Community proposes**: "Add new riddle category: Science"
**Community votes**: 80% FOR (1M RON voted)
**Status**: Succeeded (advisory only)

**Founder options**:
1. **Execute it**: Shows responsiveness, builds trust
2. **Veto it**: With public reason if problematic
3. **Ignore it**: Proposal expires

```javascript
// Option 1: Execute
await dao.executeAdvisoryProposal(proposalId);
// "Founder listens to us!" - community trust increases
```

---

### Scenario 2: Phase 2 (Role Transferred to DAO)

**Community proposes**: "Increase oracle fee to 12%"
**Community votes**: 65% FOR (2M RON voted)
**Status**: Succeeded

**What happens**:
- ✅ Quorum reached
- ✅ Majority FOR
- ✅ Goes into 48h timelock
- ✅ Executes automatically
- ❌ No founder veto possible (DAO has role)

---

### Scenario 3: Phase 3 (Role Dissolved)

**Community proposes**: "Allocate 100K RDLN to marketing"
**Community votes**: 55% FOR (3M RON voted)
**Status**: Succeeded

**What happens**:
- Exactly like Scenario 2
- But founder role doesn't exist anymore
- Pure DAO governance
- Cleaner code

---

## 💡 How to Participate

### As a Token Holder

**1. Earn RON**:
- Solve riddles
- Validate data in Oracle Network
- Participate in ecosystem

**2. Stay Informed**:
- Join Telegram community
- Follow forum discussions
- Review proposals before voting

**3. Vote on Proposals**:
```javascript
// Check active proposals
const proposals = await dao.getProposals({ status: 'Active' });

// Vote on important proposals
await dao.castVoteWithReason(proposalId, 1, "I support this because...");
```

**4. Delegate (Optional)**:
```javascript
// Delegate your voting power to trusted address
await ron.delegate(trustedDelegateAddress);
// They vote with your power, you keep your tokens
```

---

### As a Proposal Creator

**Requirements**:
- Minimum RON balance (era-based)
- Clear proposal description
- Understanding of impact

**Best practices**:
1. **Discuss first**: Post in forum for feedback
2. **Be specific**: Clear objectives and implementation
3. **Consider impact**: Think through consequences
4. **Provide reasoning**: Explain the "why"

```javascript
// Example: Proposal to update oracle fee
const targetContract = ORACLE_NETWORK_ADDRESS;
const encodedData = oracleInterface.encodeFunctionData(
    'updateProtocolFee',
    [1200] // 12%
);

await dao.propose(
    [targetContract],
    [0],
    [encodedData],
    "Proposal: Increase oracle protocol fee from 10% to 12% to fund development"
);
```

---

## 🔐 Security & Safety

### Access Control

**Role-based permissions**:
- `DEFAULT_ADMIN_ROLE`: Can grant/revoke roles
- `UPGRADER_ROLE`: Can upgrade DAO contract
- `PROPOSER_ROLE`: Can propose to timelock (DAO only)
- `EXECUTOR_ROLE`: Can execute from timelock (DAO only)

### Upgradeability

**UUPS pattern**:
- DAO contract can be upgraded
- Fixes bugs without redeployment
- Requires UPGRADER_ROLE
- Maintains state across upgrades

### Timelock Protection

**48-hour delay on critical actions**:
- Treasury spending
- Contract upgrades
- Parameter changes
- Gives community reaction time

### Checks & Balances

- ✅ Quorum prevents minority rule
- ✅ Timelock prevents hasty execution
- ✅ Public proposals ensure transparency
- ✅ On-chain voting prevents manipulation
- ✅ Founder veto (Phase 1) prevents early attacks

---

## 📖 Code Examples

### Check Governance Status

```javascript
// Is founder role still active?
const hasFounder = await dao.hasActiveFounder();

// Current era
const era = await dao.getCurrentEra();

// Proposal threshold for current era
const threshold = await dao.getCurrentProposalThreshold();

// Current quorum requirement
const quorum = await dao.getCurrentQuorumNumerator();

console.log(`Founder active: ${hasFounder}`);
console.log(`Era: ${era}`);
console.log(`Proposal threshold: ${ethers.formatEther(threshold)} RON`);
console.log(`Quorum: ${quorum}%`);
```

### Create and Vote on Proposal

```javascript
// 1. Create proposal
const targets = [oracleNetworkAddress];
const values = [0];
const calldatas = [encodedFunctionCall];
const description = "Increase validator rewards by 10%";

const proposeTx = await dao.propose(targets, values, calldatas, description);
const receipt = await proposeTx.wait();
const proposalId = receipt.events[0].args.proposalId;

// 2. Wait for voting delay (1 day)
await sleep(86400);

// 3. Cast vote
await dao.castVoteWithReason(
    proposalId,
    1, // FOR
    "This helps attract more validators"
);

// 4. Wait for voting period (7 days)
await sleep(7 * 86400);

// 5. Check if passed
const state = await dao.state(proposalId);
if (state === ProposalState.Succeeded) {
    console.log("Proposal passed! Entering 48h timelock...");
}

// 6. Execute after timelock (if Phase 2/3)
await sleep(48 * 3600);
await dao.execute(targets, values, calldatas, ethers.keccak256(ethers.toUtf8Bytes(description)));
```

### Delegate Voting Power

```javascript
// Option 1: Delegate to someone else
await ron.delegate(trustedAddress);
console.log("Voting power delegated");

// Option 2: Self-delegate (activate your own voting power)
await ron.delegate(myAddress);
console.log("Voting power activated");

// Check delegation
const delegatee = await ron.delegates(myAddress);
const votes = await ron.getVotes(myAddress);
console.log(`Delegated to: ${delegatee}`);
console.log(`Current votes: ${ethers.formatEther(votes)}`);
```

---

## 📊 Governance Statistics

### Real-Time Tracking

```javascript
// Proposal stats
const proposalCount = await dao.proposalCount();
const activeProposals = await dao.getProposals({ status: 'Active' });
const executedProposals = await dao.getProposals({ status: 'Executed' });

// Voting participation
const totalRON = await ron.totalSupply();
const avgParticipation = await dao.getAverageParticipation();

console.log(`Total proposals: ${proposalCount}`);
console.log(`Active now: ${activeProposals.length}`);
console.log(`Avg participation: ${avgParticipation}%`);
```

---

## 🎓 Governance Best Practices

### For Voters

✅ **Do**:
- Read full proposal before voting
- Consider long-term impact
- Vote consistently (build reputation)
- Provide reasons when voting
- Discuss in community forums

❌ **Don't**:
- Vote without reading
- Follow others blindly
- Ignore important proposals
- Vote emotionally
- Skip community discussion

### For Proposers

✅ **Do**:
- Start with forum discussion
- Provide clear rationale
- Consider implementation details
- Be open to feedback
- Iterate based on comments

❌ **Don't**:
- Surprise the community
- Make vague proposals
- Ignore technical feasibility
- Rush to vote
- Take rejection personally

### For the Community

✅ **Do**:
- Engage in governance discussions
- Help new members understand
- Share expertise on proposals
- Build consensus before formal vote
- Celebrate successful proposals

❌ **Don't**:
- Attack other community members
- Spread misinformation
- Vote brigade
- Create spam proposals
- Ignore founder guidance (Phase 1)

---

## 🔗 Related Documentation

- 🎁 **[Airdrop Guide](airdrop.html)** - Earn RDLN and qualify for governance
- 🔮 **[Oracle Network](oracle-network.html)** - Earn RON through validation work
- 📋 **[FAQ](faq.html)** - Common governance questions
- 💻 **[Frontend Integration](FRONTEND_INTEGRATION.html)** - Developer guide

---

## 🤔 Frequently Asked Questions

### General Questions

**Q: When does governance launch?**
A: After RON token upgrade (add ERC20Votes) and Timelock deployment. Timeline TBD.

**Q: Can I vote with RDLN tokens?**
A: No, only RON tokens count for voting. This prevents wealthy users from buying governance power.

**Q: What happens if I don't vote?**
A: Your RON still counts toward quorum if you're delegated. But active voting helps shape the protocol.

### Founder Role Questions

**Q: Who is the founder?**
A: The initial deployer of the DAO contract. Address will be public on-chain.

**Q: Will the founder role ever be dissolved?**
A: Yes, that's the plan after 1-2 years of proven community governance maturity.

**Q: What if the founder acts maliciously?**
A: Founder actions are transparent on-chain. Community can fork if necessary. But the goal is trust through transparency.

### Proposal Questions

**Q: How much RON do I need to create a proposal?**
A: Depends on current era. Era 0: 10K RON. Era 1: 5K RON. Era 2: 2.5K RON. Decreases over time.

**Q: What can I propose?**
A: Any contract call the DAO has permission for: parameter updates, treasury spending, contract upgrades, etc.

**Q: What if my proposal fails?**
A: Learn from feedback and try again with improvements. Failure is part of the governance learning process.

### Voting Questions

**Q: Can I change my vote?**
A: No, votes are final once cast. Review carefully before voting.

**Q: What if I don't have enough RON to propose?**
A: Ask someone with enough RON to propose on your behalf, or earn more RON through ecosystem participation.

**Q: Can I delegate my voting power?**
A: Yes! Delegate to a trusted address who will vote on your behalf.

---

## 📞 Support & Community

**Get Involved**:
- 💬 **[Telegram Governance Channel](https://t.me/RiddlenGovernance)** - Discuss proposals
- 📋 **[Forum](https://forum.riddlen.org)** - Long-form governance discussions
- 🐦 **[Twitter](https://twitter.com/RiddlenToken)** - Latest announcements

**Developer Resources**:
- 📖 **[GitHub](https://github.com/RiddlenBaba/riddlen)** - Source code
- 🔒 **[Audit Reports](../contracts/DAO_SYSTEM_COMPLETE.md)** - Security review

---

## 🚀 The Path to Full Decentralization

### Timeline (Projected)

**Months 0-6: Phase 1 (Builder Control)**
- Founder has full control
- Community learns governance
- Proposal practice runs
- Building trust

**Months 6-18: Phase 1 → Phase 2 Transition**
- Founder increasingly defers to community votes
- Test DAO maturity
- Prepare for role transfer

**Month 18: Phase 2 (Shared Governance)**
- Founder transfers role to DAO
- Community has full control via proposals
- Founder becomes regular participant

**Year 3+: Phase 3 (Full Decentralization)**
- Option to dissolve founder role
- Pure community governance
- Complete decentralization achieved

---

## 💭 Governance Philosophy

**Progressive Decentralization**: Start with necessary control, end with complete community ownership.

**Merit-Based Power**: Voting power earned through contribution, not purchased with money.

**Transparent Transition**: Clear phases, public actions, predictable timeline.

**Clean Exit**: Founder can transfer or dissolve role, ensuring no permanent power.

**Community First**: All RON fairly distributed, no founder pre-mine or allocation.

---

**Ready to participate in Riddlen governance? Start earning RON today!** 🏛️

Every riddle solved, every validation completed, every contribution made increases your voice in the protocol's future.

*Contract: TBD (pending deployment) • Testnet available for preview*
*Last updated: October 2025 • Riddlen Protocol v6.0*
