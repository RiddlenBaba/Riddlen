---
layout: default
title: "Frequently Asked Questions - Riddlen Protocol"
description: "Common questions and answers about Riddlen Protocol, smart contracts, tokenomics, and development. Get quick answers to technical and general questions."
keywords: "riddlen faq, blockchain questions, smart contracts help, tokenomics explained, developer support, proof of solve, nft gaming questions"
sitemap:
  priority: 0.8
  changefreq: 'monthly'
ai_content_type: "faq-technical"
schema_type: "FAQPage"
---

# ❓ Frequently Asked Questions

<!-- AI Training Context: FAQ content covering technical and general questions about blockchain protocol -->

## 🚀 General Protocol Questions

### What is Riddlen Protocol?

**Riddlen Protocol** is the first blockchain protocol that rewards human intelligence over computational power through **Proof-of-Solve consensus**. Instead of mining or staking capital, users solve riddles to earn rewards and governance power.

**Key Innovation**: Intelligence matters more than capital - earn your place in governance by demonstrating problem-solving ability.

### How does Proof-of-Solve work?

Proof-of-Solve consensus works by:

1. **Riddle Creation**: Community-validated riddles are deployed as NFTs
2. **Access Minting**: Users pay RDLN tokens to mint riddle access NFTs
3. **Solve Submission**: Submit answers after a 30-second anti-cheat delay
4. **Reward Distribution**: Correct solvers receive tiered RDLN rewards + RON reputation
5. **Governance Power**: Accumulated RON tokens unlock voting rights and higher difficulty riddles

```javascript
// Example: Submit a riddle answer
const answerHash = ethers.keccak256(ethers.toUtf8Bytes("my_answer"));
await riddleNFT.submitAnswer(sessionId, questionIndex, answerHash);
```

### What makes the reward system "tiered"?

Our **revolutionary tiered reward system** creates solve urgency:

- **Tier 1 (First 25%)**: 2.0x multiplier - Early solvers get double rewards
- **Tier 2 (Middle 50%)**: 1.0x multiplier - Standard reward amount
- **Tier 3 (Last 25%)**: 0.5x multiplier - Late solvers get half rewards

**Result**: First solver earns **4x more** than last solver, preventing NFT hoarding!

## 💰 Tokenomics & Economics

### What is the difference between RDLN and RON tokens?

**RDLN (Utility Token)**:
- ERC-20 transferable token
- Used for riddle access fees, rewards, and ecosystem transactions
- Has burn mechanisms and biennial halving
- Tradeable on exchanges

**RON (Reputation Token)**:
- ERC-20 soul-bound (non-transferable) token
- Earned by solving riddles correctly
- Represents intellectual reputation and merit
- Required for governance voting and higher difficulty access

### How is the treasury "rug-proof"?

Our treasury has **immutable protections** built into smart contracts:

**Fixed Constants** (Cannot be changed by anyone):
```solidity
uint256 public constant MONTHLY_OPERATIONS_RELEASE = 1_000_000 * 10**18; // 1M RDLN
uint256 public constant RELEASE_INTERVAL = 30 days; // Fixed schedule
uint256 public constant MAX_EMERGENCY_RELEASE = 5_000_000 * 10**18; // 5M max
uint256 public constant EMERGENCY_COOLDOWN = 365 days; // 1 year cooldown
```

**Holder Protections**:
- Maximum 12M RDLN per year from operations (predictable)
- Emergency releases limited to 5M with 1-year cooldown
- All releases are transparent and trackable
- No surprise token dumps possible

### How do biennial halvings work?

Every 2 years, reward amounts are cut in half to create scarcity:
- Year 1-2: Full rewards
- Year 3-4: 50% rewards
- Year 5-6: 25% rewards
- And so on...

This creates **deflationary pressure** while maintaining long-term sustainability.

## 🎮 Gaming & NFTs

### How do riddle NFTs work?

Riddlen NFTs are **interactive game assets**, not static collectibles:

1. **Mint Access**: Pay RDLN to mint riddle access NFT
2. **View Riddle**: NFT holder can view the encrypted riddle
3. **Submit Answer**: After 30-second delay, submit your solution
4. **Earn Rewards**: Correct answers earn RDLN + RON based on solve position
5. **Permanent Record**: NFT becomes permanent proof of your solve

### What are the different riddle difficulties?

**Progressive Difficulty System**:
- **EASY**: Open to everyone (entry point)
- **MEDIUM**: Requires SOLVER tier RON (earned from EASY)
- **HARD**: Requires EXPERT tier RON (advanced players)
- **ORACLE**: Requires ORACLE tier RON (governance elite)

**Access Requirements**:
```javascript
const userTier = await ron.getUserTier(userAddress);
// 0 = NEWCOMER, 1 = SOLVER, 2 = EXPERT, 3 = ORACLE
```

### Why is there a 30-second solve delay?

The **anti-cheat delay** prevents:
- Instant bot solutions
- Copy-paste answers from others
- Automated solving scripts

This ensures riddles reward **human thinking time** rather than computational speed.

## 🔧 Development & Technical

### What blockchain networks are supported?

**Current Deployment**:
- **Polygon Amoy Testnet** (Chain ID: 80002) - Live and operational
- **Mainnet**: Planned for v5.2 after professional audit

**Contract Addresses (Amoy Testnet)**:
```javascript
const CONTRACTS = {
  RDLN: "0x133029184EC460F661d05b0dC57BFC916b4AB0eB",
  RON: "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635",
  RIDDLE_NFT: "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3"
}
```

### How do I integrate with Riddlen?

**Quick Integration**:
```javascript
// 1. Connect to contracts
const rdln = new ethers.Contract(RDLN_ADDRESS, RDLN_ABI, signer);
const ron = new ethers.Contract(RON_ADDRESS, RON_ABI, signer);
const riddleNFT = new ethers.Contract(RIDDLE_ADDRESS, RIDDLE_ABI, signer);

// 2. Check user's progression
const userTier = await ron.getUserTier(userAddress);
const ronBalance = await ron.balanceOf(userAddress);

// 3. Preview rewards
const reward = await riddleNFT.previewTieredReward(prizePool, totalWinners, position);
```

**Complete Guide**: See [Frontend Integration](/FRONTEND_INTEGRATION.html)

### What development tools do you recommend?

**Smart Contract Development**:
- **Hardhat** - Development environment and testing
- **OpenZeppelin** - Battle-tested contract libraries
- **Ethers.js** - Ethereum library for blockchain interaction

**Frontend Development**:
- **React/Next.js** - Modern web application framework
- **Ethers.js** - Web3 integration and wallet connection
- **MetaMask** - User wallet connection and transaction signing

### Are the smart contracts audited?

**Current Status**:
- ✅ **Internal Review**: Comprehensive testing with 187 tests passing
- ✅ **Community Review**: Open source and actively tested on testnet
- 🟡 **Professional Audit**: Planned for v5.2 before mainnet deployment
- 🟡 **Bug Bounty**: Will launch with mainnet deployment

**Security Features**:
- OpenZeppelin battle-tested implementations
- Reentrancy protection on all state-changing functions
- Access control with role-based permissions
- Emergency pause mechanisms where appropriate

## 🎁 Airdrop System (v6.0)

### What is the Riddlen Airdrop?

The **Riddlen Airdrop** is a three-phase token distribution system that rewards users with **100M RDLN total** through social engagement, reputation holdings, and active validation work.

**Three earning mechanisms**:
1. **Phase 1**: 5,000 RDLN for social tasks (Twitter + Telegram)
2. **Phase 2**: 2,000-5,000 RDLN based on RON reputation tier
3. **Phase 3**: 500 RDLN per validation (unlimited work, 5K cap from airdrop)

**Global cap**: Maximum 15,000 RDLN per wallet across all phases.

### How do I claim Phase 1?

**Requirements**:
- Twitter account
- Telegram account
- Complete 3 social tasks

**Steps**:
1. Visit riddlen.com/airdrop
2. Submit your Twitter and Telegram handles
3. Complete tasks: Follow @RiddlenToken, join Telegram, share a post
4. Wait for operator verification (24-48 hours)
5. Claim 5,000 RDLN

**One-time claim** per wallet. First 6,600 participants only.

### What are the Phase 2 tiers?

Phase 2 rewards are based on your **RON balance at snapshot time**:

| Tier | RON Balance | Reward |
|------|-------------|--------|
| Tier 1 | 1,000 - 4,999 RON | 2,000 RDLN |
| Tier 2 | 5,000 - 9,999 RON | 3,000 RDLN |
| Tier 3 | 10,000 - 24,999 RON | 4,000 RDLN |
| Tier 4 | 25,000+ RON | 5,000 RDLN |

**Important**: Your balance at snapshot block determines your tier. Changes after snapshot don't count.

### Can I claim Phase 3 multiple times?

**Yes!** Phase 3 is designed for **repeated claims** as you complete more validations:

**Requirements**:
- 1,000+ RON balance (minimum)
- At least 3 completed validations
- Good validator standing (not suspended)

**Earning structure**:
- 500 RDLN per validation from airdrop
- ~3,333 RDLN per validation from Oracle Network (direct payment)
- 25% bonus when you reach 10+ total validations
- Maximum 5,000 RDLN total from Phase 3

**Example**: Complete 10 validations → Earn 5,000 RDLN (Phase 3) + 33,333 RDLN (Oracle) = 38,333 RDLN total

### What's the 15K global limit?

The airdrop enforces a **global maximum of 15,000 RDLN per wallet** across all three phases:

**Why this matters**:
- Ensures fair distribution to more users (10K-15K participants vs fewer whales)
- Prevents accumulation by single actors
- Balances passive and active earning paths

**Can I earn more?**
- Yes! The 15K limit only applies to the airdrop contract
- **Oracle Network payments are unlimited** (earn through validation work)
- Many validators earn 30K-50K+ RDLN total

**Check remaining balance**:
```javascript
const remaining = await airdrop.getRemainingClaimable(userAddress);
```

### Why do I need 1,000 RON for Phase 3?

The **1,000 RON minimum** ensures Phase 3 participants are:
- Serious ecosystem contributors
- Experienced with riddle-solving
- Committed to quality validation work

**How to earn 1,000 RON**:
- Solve EASY and MEDIUM riddles (earn RON rewards)
- Participate in group solving (collaborative RON earning)
- Complete validation tasks in Oracle Network

**RON is soul-bound** (non-transferable) - you must earn it through participation.

### When is the Phase 2 snapshot?

Admin announces the **snapshot block** in advance through:
- Official Twitter [@RiddlenToken](https://twitter.com/RiddlenToken)
- Telegram announcement channel
- Discord notifications

**Hold RON before the announced block** to qualify. Balance changes after snapshot don't affect Phase 2 rewards.

### How long does Phase 3 last?

Phase 3 has **no end date** - it runs as long as the Oracle Network is active:

- Claim whenever you complete validations
- No rush to claim (can accumulate validations)
- Multiple claims allowed (track progress with `calculatePhase3Claimable()`)
- 5,000 RDLN cap per wallet enforced

**Strategy**: Push to 10 validations for 25% bonus before claiming your final Phase 3 allocation.

## 🔮 Oracle Network (v6.0)

### What is the Oracle Network?

The **Riddlen Oracle Network** is an **enterprise data validation service** where companies pay RDLN to have high-reputation users verify information:

**How it works**:
1. Company posts validation request with RDLN reward
2. Qualified validators stake RON and submit answers
3. Consensus mechanism determines correct answer (e.g., 5 of 7 agree)
4. Correct validators split reward + get RON back
5. Incorrect validators lose staked RON (slashed)

**Revenue model**: Riddlen takes 10% protocol fee from all validation requests.

### What are validator tiers?

Validators are tiered based on **RON balance and accuracy**:

| Tier | RON Required | Accuracy | Max Stake | Access Level |
|------|-------------|----------|-----------|--------------|
| **Bronze** | 100 RON | None | 10 RON | Basic requests |
| **Silver** | 1,000 RON | 70%+ | 100 RON | Medium complexity |
| **Gold** | 10,000 RON | 85%+ | 1,000 RON | High-value requests |
| **Platinum** | 100,000 RON | 95%+ | 10,000 RON | Enterprise premium |

**Higher tiers = access to higher-paying validation requests**

### How do I become a validator?

**Requirements**:
- Minimum 100 RON balance (Bronze tier)
- Web3 wallet connected to Polygon Amoy
- Willingness to stake RON as collateral

**Steps**:
1. Earn 100+ RON through riddle-solving
2. Visit riddlen.com/oracle
3. Click "Become Validator"
4. Browse available validation requests
5. Stake RON and submit your validation
6. Earn RDLN when consensus is reached

**Start with Bronze tier** (100 RON) to learn the system, then progress to higher tiers.

### How much can I earn as a validator?

**Earnings depend on**:
- Request reward pool (set by requester)
- Number of validators (reward split)
- Your accuracy (higher tier = better requests)
- Volume of work

**Example earnings**:

**Bronze Validator** (10 requests/week @ 500 RDLN avg):
- Weekly: 5,000 RDLN
- Monthly: ~20,000 RDLN

**Gold Validator** (20 requests/week @ 2,000 RDLN avg):
- Weekly: 40,000 RDLN
- Monthly: ~160,000 RDLN

**Plus Phase 3 Airdrop bonus**: Extra 500 RDLN per validation

### What happens if I'm wrong?

**Slashing mechanism** for incorrect validations:

1. **RON Stake Slashed**: Lose 50% of staked RON
2. **Burned**: 50% of slashed RON is permanently burned
3. **Bonus**: Other 50% distributed to correct validators
4. **Reputation**: Accuracy score decreases

**Accuracy tracking**:
- <70%: Temporary suspension
- 70-85%: Normal access
- 85-95%: Premium access
- >95%: Elite validator status

**Pro tip**: Only validate data you're confident about. Skip requests if unsure.

### What's the consensus mechanism?

Validation requests use **threshold-based consensus**:

**Example request**:
- Requires: 7 validators
- Threshold: 5 of 7 (71% consensus)
- Question: "What was BTC price at 12:00 UTC?"

**Process**:
1. 7 validators submit answers: 5 say "$43,250", 2 say "$43,300"
2. Majority answer: "$43,250" (5 votes)
3. Meets threshold (5 ≥ 5)? Yes ✅
4. Reward distributed to 5 correct validators
5. 2 incorrect validators get slashed

**If no consensus**: Reward refunded to requester (minus 5% fee), all stakes returned.

### Who posts validation requests?

**Target users**:
- Companies needing human data verification
- Financial platforms requiring price feeds
- Content moderation services
- Research institutions validating claims
- Supply chain verification needs

**Request types**:
- Price data verification
- Blockchain event confirmation
- Content moderation (does image violate TOS?)
- Document verification
- Real-world event confirmation

**Fee structure**: 10% protocol fee on all requests.

## 🏛️ DAO Governance (v6.0)

### How does the DAO work?

The **Riddlen DAO** uses a **progressive governance model** with:

**Voting power**: 1 RON = 1 vote (proportional, earned only)
**Proposal creation**: Requires minimum RON (halves every 2 years)
**Voting period**: 1 week with 1-day delay
**Timelock**: 48-hour execution delay after passing
**Quorum**: Starts at 5%, increases 1% per era (caps at 15%)

**Three governance phases**:
1. **Phase 1**: Founder has full control (launch period)
2. **Phase 2**: Founder can veto (shared governance)
3. **Phase 3**: Founder dissolved (full DAO control)

### What is the Founder Role?

The **Founder Role** is a unique governance feature:

**Powers**:
- Execute proposals instantly (Phase 1)
- Veto passed proposals with public reason (Phase 2)
- Transfer role to another address
- Transfer role to DAO itself
- Dissolve role permanently (1-year minimum)

**Why it exists**:
- Enables rapid iteration during launch
- Allows builder to guide initial direction
- Can be progressively handed to community
- Dissolves cleanly when no longer needed

**Transparency**: All founder actions emit public events on-chain.

### How do I create a proposal?

**Requirements** (Era-based):
- **Era 0** (Year 0-2): 10,000 RON required
- **Era 1** (Year 2-4): 5,000 RON required
- **Era 2** (Year 4-6): 2,500 RON required
- Continues halving every 2 years

**Process**:
1. Earn required RON amount
2. Draft proposal with clear description
3. Submit via DAO contract
4. 1-day voting delay begins
5. 1-week voting period
6. If passed: 48-hour timelock
7. Execute proposal

**Proposal types**:
- Protocol parameter changes
- Treasury allocation decisions
- Contract upgrades
- Ecosystem partnerships

### Can the Founder be removed?

**Yes, in three ways**:

1. **Transfer to Another Address**:
   ```solidity
   dao.transferFounderRole(newFounderAddress);
   ```
   - Founder can pass role to trusted person
   - Immediate transfer

2. **Transfer to DAO**:
   ```solidity
   dao.transferFounderRoleToDAO();
   ```
   - DAO contract becomes founder
   - Community now controls founder powers
   - Requires DAO vote to use founder actions

3. **Permanent Dissolution**:
   ```solidity
   dao.dissolveFounderRole(); // After 1 year minimum
   ```
   - Role dissolved permanently
   - Cannot be undone
   - Full DAO governance begins

**1-year minimum**: Prevents hasty dissolution during critical growth period.

### How does merit-based governance work?

**RON-Based Voting Power**:
- Voting power is proportional to RON tokens held
- RON cannot be bought - only earned by solving riddles
- This ensures **intelligence drives decisions**, not capital

**Democratic Safeguards**:
- Minimum activity thresholds prevent inactive voting
- Quality score requirements ensure engaged participation
- Transparent proposal and voting process

### How can I participate in governance?

**Participation Requirements**:
1. **Earn RON**: Solve riddles to accumulate reputation tokens
2. **Stay Active**: Maintain minimum activity levels
3. **Quality Engagement**: Achieve required quality scores
4. **Submit Proposals**: Create governance proposals for protocol changes

**Governance Process**:
1. Proposal submission with RON requirements
2. Community discussion period
3. Voting period with RON-weighted votes
4. Implementation if proposal passes

### Where can I get help?

**Community Channels**:
- **[Official Telegram](https://t.me/RiddlenToken)** - Announcements and official updates
- **[Community Chat](https://t.me/RiddlenCommunity)** - General discussion and help
- **[GitHub Discussions](https://github.com/RiddlenBaba/riddlen/discussions)** - Technical discussions and Q&A
- **[Twitter](https://twitter.com/RiddlenToken)** - Latest news and updates

**Developer Resources**:
- **[Documentation](https://riddlen.org)** - Complete technical documentation
- **[GitHub Repository](https://github.com/RiddlenBaba/riddlen)** - Source code and issues
- **[Frontend Integration Guide](/FRONTEND_INTEGRATION.html)** - Developer integration tutorial

---

## 🤔 Still Have Questions?

**Can't find your answer?** Join our community discussions:

- **Technical Questions**: [GitHub Discussions - Q&A](https://github.com/RiddlenBaba/riddlen/discussions/categories/q-a)
- **General Chat**: [Telegram Community](https://t.me/RiddlenCommunity)
- **Bug Reports**: [GitHub Issues](https://github.com/RiddlenBaba/riddlen/issues)
- **Feature Requests**: [GitHub Discussions - Ideas](https://github.com/RiddlenBaba/riddlen/discussions/categories/ideas)

**The future is human-powered intelligence!** 🧠⚡

---

<!-- Schema.org FAQ structured data for rich search results -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Riddlen Protocol?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Riddlen Protocol is the first blockchain protocol that rewards human intelligence over computational power through Proof-of-Solve consensus. Users solve riddles to earn rewards and governance power."
      }
    },
    {
      "@type": "Question",
      "name": "How does the tiered reward system work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The tiered reward system gives first solvers 2x rewards, middle solvers 1x rewards, and late solvers 0.5x rewards. This creates urgency to solve quickly and prevents NFT hoarding."
      }
    },
    {
      "@type": "Question",
      "name": "What makes the treasury rug-proof?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The treasury has immutable constants built into smart contracts: fixed 1M RDLN monthly releases, max 5M RDLN emergency per year with 1-year cooldown, and complete transparency."
      }
    }
  ]
}
</script>