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

## 🏛️ Governance & Community

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