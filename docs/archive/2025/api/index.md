---
layout: default
title: "API Reference - Riddlen Protocol Documentation"
description: "API reference documentation for Riddlen Protocol smart contracts. Learn how to interact with RDLN tokens, RON reputation, riddle NFTs, and oracle network programmatically."
keywords: "riddlen api, smart contract api, blockchain api reference, ethers.js, web3 integration, solidity abi, contract methods"
image: "/assets/images/riddlen-og-image.png"
date: 2025-10-01
author: "Riddlen Protocol Team"
sitemap:
  priority: 0.7
  changefreq: 'monthly'
  lastmod: 2025-10-01
schema_type: "TechArticle"
ai_content_type: "api-reference"
ai_complexity: "advanced"
---

# API Reference

Complete API reference documentation for interacting with Riddlen Protocol smart contracts. This section will contain detailed method signatures, parameters, return values, and integration examples for all protocol contracts.

---

## Coming Soon

API reference documentation is currently under development. In the meantime, you can:

### Explore Contract Specifications

Visit our detailed contract specifications for method details:

- [RDLN Token Contract](../contracts/RDLN-Contract-Specification.html)
- [RON Reputation System](../contracts/RON-Reputation-System.html)
- [RiddlenAirdrop Contract](../contracts/RiddlenAirdrop-specification.html)
- [TreasuryDrip Contract](../contracts/TreasuryDrip-specification.html)

### Use Frontend Integration Guide

For practical integration examples with Ethers.js and React:

- [Frontend Integration Guide](../FRONTEND_INTEGRATION.html)

### Access Live Contracts

All contract addresses and verification links:

- [Testnet Deployment](../testnet/TESTNET_DEPLOYMENT.html)

### Review Source Code

Complete contract implementations on GitHub:

- [GitHub Repository](https://github.com/RiddlenBaba/riddlen)
- [Verified Contracts on PolygonScan](https://amoy.polygonscan.com/)

---

## Planned API Sections

The following API documentation sections are planned:

### Core Contracts
- **RDLN Token API** - Transfer, burn, approve, allowance methods
- **RON Reputation API** - Balance queries, earning mechanics
- **RiddleNFT API** - Minting, solving, metadata queries
- **Airdrop API** - Eligibility checks, claiming methods

### Advanced Features
- **Oracle Network API** - Validation submission, consensus queries
- **DAO Governance API** - Proposal creation, voting, execution
- **Group Manager API** - Group operations, social mechanics

### Integration Helpers
- **Event Listeners** - Contract events and filters
- **Error Handling** - Common errors and solutions
- **Gas Optimization** - Best practices for efficient transactions

---

## Current Resources

While we build comprehensive API documentation, use these resources:

### Quick Reference

```javascript
// Connect to Riddlen contracts on Amoy testnet
const CONTRACTS = {
  RDLN: '0x133029184EC460F661d05b0dC57BFC916b4AB0eB',
  RON: '0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635',
  RIDDLE_NFT: '0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3',
  AIRDROP: '0x4f3f2202f3F865074f534aA324a259DF962C6FBA',
  ORACLE: '0xBd005201294984eFf3c353c32c9E5a96Fd640493'
};

// See Frontend Integration Guide for complete examples
```

### Developer Tools

- **Hardhat Tests**: See `/contracts/test/` directory for method usage examples
- **Deployment Scripts**: See `/contracts/scripts/` for initialization patterns
- **ABIs**: Available in compiled contract artifacts

---

## Community Support

Have API questions? Get help from the community:

- **GitHub Discussions**: [Q&A Section](https://github.com/RiddlenBaba/riddlen/discussions/categories/q-a)
- **Telegram**: [Developer Chat](https://t.me/RiddlenCommunity)
- **GitHub Issues**: [Report Documentation Gaps](https://github.com/RiddlenBaba/riddlen/issues)

---

*API documentation is actively being developed. Check back soon for updates!*

*Last updated: October 2025*
