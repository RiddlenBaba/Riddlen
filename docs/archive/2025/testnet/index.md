---
layout: default
title: "Testnet Deployment - Riddlen Protocol Live on Polygon Amoy"
description: "Live Riddlen Protocol testnet deployment on Polygon Amoy. Get contract addresses, verify deployments, and start testing the merit-based blockchain gaming platform."
keywords: "riddlen testnet, polygon amoy, testnet deployment, smart contract addresses, blockchain testing, rdln testnet, testnet faucet"
image: "/assets/images/riddlen-og-image.png"
date: 2025-10-01
author: "Riddlen Protocol Team"
sitemap:
  priority: 0.9
  changefreq: 'weekly'
  lastmod: 2025-10-01
schema_type: "TechArticle"
ai_content_type: "deployment-guide"
ai_complexity: "intermediate"
---

# Testnet Deployment

Riddlen Protocol is currently live and fully operational on the Polygon Amoy testnet. This deployment allows developers and users to test all protocol features including riddle solving, token mechanics, reputation systems, and oracle network validation.

---

## Quick Start

### Get Started in 3 Steps

1. **Get Testnet Tokens**
   - Visit [Polygon Faucet](https://faucet.polygon.technology/)
   - Request Amoy testnet MATIC for gas fees
   - Connect to Amoy network (Chain ID: 80002)

2. **Connect Your Wallet**
   - Use MetaMask or any Web3 wallet
   - Add Amoy network configuration
   - Import RDLN and RON token addresses

3. **Start Testing**
   - Visit [riddlen.com](https://riddlen.com) to solve riddles
   - Mint NFTs and earn RDLN rewards
   - Build reputation through RON tokens

---

## Complete Deployment Guide

### [Full Testnet Deployment Documentation](TESTNET_DEPLOYMENT.html)

The complete deployment guide includes:

- **All Contract Addresses**: RDLN, RON, RiddleNFT, Airdrop, Oracle Network, and more
- **Verification Links**: Direct links to verified contracts on PolygonScan
- **Network Configuration**: RPC endpoints, chain ID, and explorer URLs
- **Testing Instructions**: How to interact with each contract
- **Feature Status**: Current features available on testnet
- **Known Issues**: Any limitations or bugs in testnet deployment

**Network Details:**
- **Network**: Polygon Amoy Testnet
- **Chain ID**: 80002
- **Deployment Date**: September 29, 2024
- **Version**: v6.0 (latest)
- **Status**: Fully operational

---

## Core Contract Addresses

### Primary Contracts

| Contract | Address | Description |
|----------|---------|-------------|
| **RDLN Token** | `0x133029184EC460F661d05b0dC57BFC916b4AB0eB` | Primary utility token |
| **RON Reputation** | `0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635` | Soul-bound reputation |
| **RiddleNFT V2** | `0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3` | NFT riddle system |
| **RiddlenAirdrop** | `0x4f3f2202f3F865074f534aA324a259DF962C6FBA` | Airdrop distribution |
| **Oracle Network** | `0xBd005201294984eFf3c353c32c9E5a96Fd640493` | Data validation |
| **Group Manager** | `0xEBcEf4745A2514FE61f5847a1e66a9Ced0331899` | Social mechanics |

All contracts are verified on [Amoy PolygonScan](https://amoy.polygonscan.com/).

---

## Network Configuration

### Add Amoy to MetaMask

```javascript
Network Name: Polygon Amoy Testnet
RPC URL: https://rpc-amoy.polygon.technology/
Chain ID: 80002
Currency Symbol: MATIC
Block Explorer: https://amoy.polygonscan.com/
```

### Import Tokens

Add these token addresses to see your balances:

```javascript
// RDLN Token
0x133029184EC460F661d05b0dC57BFC916b4AB0eB

// RON Reputation (non-transferable)
0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635
```

---

## Developer Integration

### Connect to Testnet Contracts

```javascript
// Ethers.js v6 example
import { ethers } from 'ethers';

const AMOY_RPC = 'https://rpc-amoy.polygon.technology/';
const provider = new ethers.JsonRpcProvider(AMOY_RPC);

const CONTRACTS = {
  RDLN: '0x133029184EC460F661d05b0dC57BFC916b4AB0eB',
  RON: '0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635',
  RIDDLE_NFT: '0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3',
  AIRDROP: '0x4f3f2202f3F865074f534aA324a259DF962C6FBA',
  ORACLE: '0xBd005201294984eFf3c353c32c9E5a96Fd640493'
};

// Connect to RDLN token
const rdlnToken = new ethers.Contract(
  CONTRACTS.RDLN,
  RDLN_ABI,
  provider
);
```

### Testing Resources

- **Full Integration Guide**: [Frontend Integration](../FRONTEND_INTEGRATION.html)
- **Contract Specifications**: [Contracts Documentation](../contracts/)
- **GitHub Repository**: [Complete Source Code](https://github.com/RiddlenBaba/riddlen)

---

## Current Features

### Available on Testnet

- Weekly riddle minting and solving
- RDLN token transfers and burning
- RON reputation earning and tracking
- Tiered reward distribution system
- Airdrop eligibility and claiming
- Oracle network data validation
- Group mechanics and social play
- DAO governance proposals

### Testing Status

- **200+ automated tests** passing
- All contracts verified on PolygonScan
- Full ecosystem integration validated
- Continuous monitoring and updates

---

## Support & Resources

### Getting Help

- **Documentation**: [Main Docs](../index.html)
- **FAQ**: [Common Questions](../faq.html)
- **GitHub Issues**: [Report Bugs](https://github.com/RiddlenBaba/riddlen/issues)
- **Telegram**: [Join Community](https://t.me/RiddlenToken)

### Additional Guides

- [Tokenomics Guide](../guides/tokenomics.html) - Understand the economics
- [NFT Mechanics](../guides/nft-mechanics.html) - How riddles work
- [Burning Protocol](../guides/burning-protocol.html) - Deflationary mechanics

---

**Ready to test? Get testnet MATIC and start solving riddles!**

*Last updated: October 2025*
