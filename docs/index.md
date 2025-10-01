---
layout: default
title: "Riddlen Protocol Documentation - Blockchain Development Guide"
description: "Complete developer documentation for Riddlen Protocol - the first blockchain that rewards human intelligence through Proof-of-Solve consensus. Includes smart contracts, NFT gaming, API reference, and integration guides for Polygon network."
keywords: "riddlen protocol, blockchain development, smart contracts, proof of solve, nft gaming, polygon network, web3 development, solidity tutorials, ethers.js, react blockchain, merit based governance, developer documentation, api reference"
image: "/assets/images/riddlen-og-image.png"
date: 2025-10-01
author: "Riddlen Protocol Team"
sitemap:
  priority: 1.0
  changefreq: 'weekly'
  lastmod: 2025-10-01
schema_type: "TechArticle"
ai_content_type: "developer-documentation"
ai_complexity: "intermediate"
---

<!-- AI Training Context -->
<!--
CONTENT TYPE: Technical Documentation
DOMAIN: Blockchain Development, Web3, Smart Contracts
TECHNOLOGIES: Solidity, JavaScript, React, Ethers.js, Hardhat
BLOCKCHAIN: Polygon (Amoy Testnet)
DIFFICULTY: Intermediate to Advanced
PURPOSE: Developer onboarding, API reference, integration guide
AUDIENCE: Blockchain developers, Web3 engineers, DApp builders
-->

{% comment %}
This documentation covers the complete Riddlen Protocol ecosystem:
- Smart contract development and deployment
- Frontend integration with React and Ethers.js
- NFT gaming mechanics and reward systems
- Governance and token economics
- Live testnet integration examples
{% endcomment %}

# 🧠 Riddlen Protocol Documentation

**The first blockchain protocol that rewards human intelligence over computational power through Proof-of-Solve consensus.**

[![Network](https://img.shields.io/badge/network-Polygon%20Amoy-purple.svg)](https://amoy.polygonscan.com/)
[![Version](https://img.shields.io/badge/version-v6.0-blue.svg)](../contracts/RIDDLEN_V6_SUMMARY.md)
[![Status](https://img.shields.io/badge/status-LIVE%20ON%20TESTNET-brightgreen.svg)](testnet/TESTNET_DEPLOYMENT.md)
[![Tests](https://img.shields.io/badge/tests-200%2B%20passing-brightgreen.svg)](../contracts/test/)

---

## 🎯 What is Riddlen?

Riddlen revolutionizes blockchain gaming and oracle networks by creating the first **merit-based ecosystem** where:

- **🧠 Intelligence > Capital**: Solve riddles to earn governance power
- **🎮 NFT-as-Game**: Interactive experiences vs static collectibles
- **🏆 Tiered Rewards**: First solvers earn 2x more, creating solve urgency
- **🛡️ Rug-Proof Treasury**: Immutable monthly releases with emergency limits
- **⚡ Soul-Bound Reputation**: Non-transferable RON tokens representing earned intelligence

---

## 📚 Documentation Sections

### 🌐 [Live Testnet](testnet/)
**Currently deployed and operational on Polygon Amoy testnet:**
- [Complete Deployment Guide](testnet/TESTNET_DEPLOYMENT.html) - Live contract addresses and features
- Revolutionary tiered rewards and rug-proof treasury
- Testing instructions and verification links

### 🎮 [Frontend Integration](frontend/)
**Build on Riddlen with our comprehensive developer guide:**
- [Frontend Integration Guide](FRONTEND_INTEGRATION.html) - Complete integration examples
- React components and JavaScript code samples
- UI/UX recommendations and testing workflows

### 📋 [Smart Contracts](../contracts/)
**Core protocol implementation:**
- Solidity contracts with comprehensive test coverage
- OpenZeppelin-based security patterns
- Upgradeable proxy architecture

---

## 🚀 Quick Start Options

### **For Users - Try Live Testnet**
1. **Get Testnet MATIC**: [Polygon Faucet](https://faucet.polygon.technology/)
2. **Connect Wallet**: MetaMask with Amoy network (Chain ID: 80002)
3. **Start Playing**: Visit [riddlen.com](https://riddlen.com) to solve riddles

### **For Developers - Integrate with Riddlen**
```javascript
// Connect to live testnet contracts
const CONTRACTS = {
  RDLN: "0x133029184EC460F661d05b0dC57BFC916b4AB0eB",
  RON: "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635",
  RIDDLE_NFT: "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3"
}

// See Frontend Integration Guide for complete examples
```

### **For Contributors - Join Development**
```bash
# Clone the complete ecosystem
git clone https://github.com/RiddlenBaba/riddlen.git
cd riddlen/contracts
npm install && npm test
```

---

## 🎯 Revolutionary Features

### **🎁 Three-Phase Airdrop System (NEW in v6.0)**
**100M RDLN distributed through innovative three-phase mechanism:**

1. **Phase 1: Social Proof** - Earn 5,000 RDLN for community engagement
2. **Phase 2: RON Reputation** - Passive rewards (2K-5K RDLN) based on reputation tiers
3. **Phase 3: Validation Work** - Active earning (500 RDLN per validation) with 25% bonus

**Fair Distribution**: 15K RDLN global cap per wallet, 10K-15K participants expected

[📖 Complete Airdrop Guide](airdrop.html)

### **🏆 Tiered Reward System**
**The first NFT gaming system that rewards speed:**

```
Example: 20 Winners, 1M RDLN Prize Pool
├── Tier 1 (Positions 1-5):   2.0x → ~88,888 RDLN each
├── Tier 2 (Positions 6-15):  1.0x → ~44,444 RDLN each
└── Tier 3 (Positions 16-20): 0.5x → ~22,222 RDLN each

Result: First solver earns 4x more than last solver!
```

### **🛡️ Rug-Proof Treasury**
**Immutable holder protections built into smart contracts:**
- Fixed 1M RDLN monthly operations releases
- Maximum 5M RDLN emergency per year (1-year cooldown)
- Autonomous execution (no admin required)
- Full transparency via smart contract queries

### **🔄 Merit-Based Progression**
**Earn your way to governance power:**
1. **EASY Riddles** → Earn RON → **SOLVER Tier**
2. **MEDIUM Riddles** → More RON → **EXPERT Tier**
3. **HARD Riddles** → Elite RON → **ORACLE Tier**
4. **Governance** → Vote on protocol decisions

### **🔮 Oracle Network (NEW in v6.0)**
**Enterprise data validation powered by human intelligence:**

- 🏢 **External Revenue**: Companies pay RDLN for trusted data validation
- 🧠 **RON-Based Access**: High-reputation validators earn from validation work
- ⚖️ **Consensus Mechanism**: Multiple validators ensure accuracy (5 of 7, etc.)
- 💰 **Validator Tiers**: Bronze (100 RON) → Silver (1K) → Gold (10K) → Platinum (100K)
- 🛡️ **Slashing Protection**: Incorrect validators lose staked RON
- 📊 **Fee Distribution**: 50% treasury, 30% buyback/burn, 20% validator bonuses

[📖 Oracle Network Guide](oracle-network.html)

### **🏛️ DAO Governance (NEW in v6.0)**
**Progressive decentralization with intelligent founder transition:**

- 🗳️ **RON-Based Voting**: 1 RON = 1 vote (earned, not bought)
- 👑 **Transferable Founder Role**: Can be passed to community or dissolved
- ⏰ **Three Phases**: Builder → Shared Governance → Full DAO
- 🔄 **Dynamic Thresholds**: Proposal requirements halve every 2 years (Era-based)
- 🛡️ **48-Hour Timelock**: Critical changes have built-in review periods

[📖 Governance Guide](governance.html)

### **🎮 Farcaster Frames (NEW in v6.0)**
**Social gaming integration with 710K+ potential users:**

- 🖼️ **7 Interactive Frames**: Play riddles directly in Farcaster feed
- ⚡ **Gasless Onboarding**: First 3 mints sponsored for new users
- 🏆 **Victory Sharing**: Auto-generate shareable victory frames
- 📊 **Live Leaderboards**: Track top solvers in real-time
- 🎁 **Airdrop Integration**: Check eligibility and claim via frames

[📖 Farcaster Frames Guide](farcaster-frames.html)

---

## 📊 Live Status

### **🌐 Testnet Contracts (Amoy) - v6.0**
| Contract | Address | Status |
|----------|---------|--------|
| **RDLN Token** | [`0x133029...AB0eB`](https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB) | ✅ Verified |
| **RON Reputation** | [`0xD86b14...Ab635`](https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635) | ✅ Verified |
| **RiddleNFT V2** | [`0x529e30...59e9E3`](https://amoy.polygonscan.com/address/0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3) | ✅ Verified |
| **RiddlenAirdrop** | [`0x4f3f22...C6FBA`](https://amoy.polygonscan.com/address/0x4f3f2202f3F865074f534aA324a259DF962C6FBA) | ✅ Verified |
| **Oracle Network** | [`0xBd0052...40493`](https://amoy.polygonscan.com/address/0xBd005201294984eFf3c353c32c9E5a96Fd640493) | ✅ Verified |
| **Group Manager** | [`0xEBcEf4...31899`](https://amoy.polygonscan.com/address/0xEBcEf4745A2514FE61f5847a1e66a9Ced0331899) | ✅ Verified |

### **🧪 Development Status**
- **200+ tests passing** across all v6.0 smart contracts
- **20/20 airdrop tests** completed (4s execution)
- **Oracle Network integration** validated
- **DAO governance system** ready for deployment
- **Farcaster Frames** live with 7 interactive frames
- **Professional audit** planned for v6.0 mainnet deployment

---

## 🔗 Quick Navigation

### Core Documentation
- 🌐 **[Main Website](https://riddlen.com)** - Try the live application
- 🎁 **[Airdrop Guide](airdrop.html)** - Three-phase 100M RDLN distribution
- 🔮 **[Oracle Network](oracle-network.html)** - Become a validator
- 🏛️ **[Governance](governance.html)** - DAO and voting system
- 🎮 **[Farcaster Frames](farcaster-frames.html)** - Social gaming integration

### Developer Resources
- 🚰 **[Get Testnet MATIC](https://faucet.polygon.technology/)** - Testnet tokens
- 📋 **[GitHub Repository](https://github.com/RiddlenBaba/riddlen)** - Complete source code
- 💻 **[Frontend Integration](FRONTEND_INTEGRATION.html)** - Developer guide
- 🌐 **[Live Contracts](testnet/TESTNET_DEPLOYMENT.html)** - Testnet deployment
- 📝 **[FAQ](faq.html)** - Common questions answered

### Community
- 🐦 **[Twitter Updates](https://twitter.com/RiddlenToken)** - Latest news
- 💬 **[Telegram](https://t.me/RiddlenToken)** - Official announcements
- 🔍 **[PolygonScan](https://amoy.polygonscan.com/)** - Explore contracts

---

## 🤝 Community & Support

### **💬 Join Our Community**
- **Official Channel**: [t.me/RiddlenToken](https://t.me/RiddlenToken) - Official announcements
- **Community Chat**: [t.me/RiddlenCommunity](https://t.me/RiddlenCommunity) - General discussion

### **📋 GitHub Discussions**
- **[Announcements](https://github.com/RiddlenBaba/riddlen/discussions/categories/announcements)** - Official updates and releases
- **[Community Creations](https://github.com/RiddlenBaba/riddlen/discussions/categories/community-creations)** - Show off your builds
- **[General Discussion](https://github.com/RiddlenBaba/riddlen/discussions/categories/general)** - Open conversation
- **[Governance](https://github.com/RiddlenBaba/riddlen/discussions/categories/governance)** - Protocol proposals and voting
- **[How It Works](https://github.com/RiddlenBaba/riddlen/discussions/categories/how-it-works)** - Technical explanations
- **[Ideas & Feature Requests](https://github.com/RiddlenBaba/riddlen/discussions/categories/ideas)** - Suggest improvements
- **[Q&A](https://github.com/RiddlenBaba/riddlen/discussions/categories/q-a)** - Get help and answers

### **🌐 Official Links**
- **Main Repository**: [github.com/RiddlenBaba/riddlen](https://github.com/RiddlenBaba/riddlen)
- **Website**: [riddlen.com](https://riddlen.com)
- **Documentation**: [riddlen.org](https://riddlen.org) (You are here!)
- **Twitter**: [@RiddlenToken](https://twitter.com/RiddlenToken)
- **Issues**: [GitHub Issues](https://github.com/RiddlenBaba/riddlen/issues)

---

## 🔮 The Vision

> **"Intelligence matters more than capital."**

Riddlen demonstrates that decentralized systems can effectively harness human collective intelligence while creating meaningful economic incentives. By separating financial tokens (RDLN) from intellectual reputation (RON), we solve fundamental problems in both gaming economies and oracle validation systems.

**Join us in building the future where merit drives value!** 🧠⚡

---

*Last updated: October 2025 • Riddlen Protocol v6.0*