---
layout: default
title: "Riddlen Protocol Documentation - Blockchain Development Guide"
description: "Complete developer documentation for Riddlen Protocol - the first blockchain that rewards human intelligence through Proof-of-Solve consensus. Includes smart contracts, NFT gaming, API reference, and integration guides for Polygon network."
keywords: "riddlen protocol, blockchain development, smart contracts, proof of solve, nft gaming, polygon network, web3 development, solidity tutorials, ethers.js, react blockchain, merit based governance, developer documentation, api reference"
image: "/assets/images/riddlen-og-image.png"
date: 2024-09-29
author: "Riddlen Protocol Team"
sitemap:
  priority: 1.0
  changefreq: 'weekly'
  lastmod: 2024-09-29
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
[![Version](https://img.shields.io/badge/version-v5.1-blue.svg)](../contracts/white-paper-v5.2)
[![Status](https://img.shields.io/badge/status-LIVE%20ON%20TESTNET-brightgreen.svg)](testnet/TESTNET_DEPLOYMENT.md)
[![Tests](https://img.shields.io/badge/tests-187%20passing-brightgreen.svg)](../contracts/test/)

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

---

## 📊 Live Status

### **🌐 Testnet Contracts (Amoy)**
| Contract | Address | Status |
|----------|---------|--------|
| **RDLN Token** | [`0x133029...AB0eB`](https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB) | ✅ Verified |
| **RON Governance** | [`0xD86b14...Ab635`](https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635) | ✅ Verified |
| **RiddleNFT Gaming** | [`0x529e30...59e9E3`](https://amoy.polygonscan.com/address/0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3) | ✅ Verified |

### **🧪 Development Status**
- **187 tests passing** across all smart contracts
- **8/13 ecosystem integration tests** completed
- **Complete user journey** from EASY → ORACLE validated
- **Professional audit** planned for v5.2 mainnet deployment

---

## 🔗 Quick Navigation

- 🌐 **[Main Website](https://riddlen.com)** - Try the live application
- 🚰 **[Get Testnet MATIC](https://faucet.polygon.technology/)** - Testnet tokens
- 📋 **[GitHub Repository](https://github.com/RiddlenBaba/riddlen)** - Complete source code
- 🎮 **[Frontend Integration](FRONTEND_INTEGRATION.html)** - Developer guide
- 🌐 **[Live Contracts](testnet/TESTNET_DEPLOYMENT.html)** - Testnet deployment
- 🐦 **[Twitter Updates](https://twitter.com/RiddlenToken)** - Latest news

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

*Last updated: September 2024 • Riddlen Protocol v5.1*