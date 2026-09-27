---
layout: default
title: "Smart Contract Specifications - Riddlen Protocol"
description: "Technical specifications for Riddlen Protocol smart contracts including RDLN token, RON reputation system, airdrop mechanics, and treasury management on Polygon blockchain."
keywords: "riddlen smart contracts, solidity contracts, blockchain specifications, RDLN token, RON reputation, airdrop contract, treasury drip, polygon contracts"
image: "/assets/images/riddlen-og-image.png"
date: 2025-10-01
author: "Riddlen Protocol Team"
sitemap:
  priority: 0.8
  changefreq: 'monthly'
  lastmod: 2025-10-01
schema_type: "TechArticle"
ai_content_type: "technical-specification"
ai_complexity: "advanced"
---

# Smart Contract Specifications

Complete technical specifications for the Riddlen Protocol smart contract ecosystem. These documents detail the implementation of the core protocol mechanics including token economics, reputation systems, airdrop distribution, and automated treasury management.

---

## Core Contracts

### [RDLN Token Contract](RDLN-Contract-Specification.html)
**The economic engine of Riddlen Protocol**

The RDLN token implements the core utility token with integrated deflationary mechanics and precise allocation management. This ERC-20 contract features:

- 1 billion total supply with transparent allocation tracking
- Integrated burn mechanisms for deflationary economics
- Prize pool management (700M RDLN / 70%)
- Treasury operations (100M RDLN / 10%)
- Airdrop allocation (100M RDLN / 10%)
- Liquidity provision (100M RDLN / 10%)

**Key Features**: ERC-20 standard, burn tracking, allocation management, gaming integration

---

### [RON Reputation System](RON-Reputation-System.html)
**Soul-bound tokens for merit-based access control**

The RON (Riddlen Oracle Network) reputation system implements non-transferable soul-bound tokens that track earned intelligence and gate access to oracle validation tiers. Features include:

- Soul-bound token mechanics (non-transferable)
- Difficulty-weighted reputation awards
- Progressive tier system (Bronze → Platinum)
- Performance bonuses and streak rewards
- Anti-Sybil protection through earned-only access

**Key Features**: Soul-bound tokens, tiered access, merit-based progression, oracle network integration

---

### [RiddlenAirdrop Contract](RiddlenAirdrop-specification.html)
**Two-phase community distribution system**

The RiddlenAirdrop contract distributes 100M RDLN tokens across two strategic phases targeting different user segments. This upgradeable contract implements:

- Phase 1: Early adoption rewards (50M RDLN)
- Phase 2: RON reputation rewards (50M RDLN)
- 10,000 RDLN per wallet allocation
- Merit-based qualification criteria
- UUPS upgradeable proxy pattern

**Key Features**: UUPS upgradeable, dual-phase distribution, merit-based access, pausable operations

---

### [TreasuryDrip Contract](TreasuryDrip-specification.html)
**Automated treasury distribution with comprehensive safeguards**

The RiddlenTreasuryDripAutomated contract provides secure, automated monthly token releases for protocol operations. Production-ready features include:

- Automated monthly releases (1M RDLN base)
- Dynamic scaling (1.0x to 5.0x multiplier)
- Chainlink Automation and Gelato compatibility
- Circuit breaker and timelock protections
- Emergency safeguards and monitoring

**Key Features**: Automated distribution, security safeguards, automation-ready, failsafe mechanisms

---

## Architecture Overview

### Security Patterns
- **OpenZeppelin Libraries**: Industry-standard security implementations
- **Upgradeable Proxies**: UUPS pattern for future improvements
- **Access Control**: Role-based permissions and ownership management
- **Reentrancy Guards**: Protection against reentrancy attacks
- **Pausable Operations**: Emergency pause functionality

### Testing & Verification
- **200+ Test Cases**: Comprehensive test coverage across all contracts
- **Gas Optimization**: Efficient implementations with gas reporting
- **Contract Verification**: All contracts verified on PolygonScan
- **Integration Testing**: Full ecosystem integration validation

### Network Deployment
- **Polygon Amoy Testnet**: Currently deployed and operational
- **Chain ID**: 80002
- **Verification**: All contracts verified on Amoy PolygonScan

---

## Additional Resources

### Developer Documentation
- [Live Testnet Deployment](../testnet/TESTNET_DEPLOYMENT.html) - Current contract addresses
- [Frontend Integration Guide](../FRONTEND_INTEGRATION.html) - How to integrate with contracts
- [GitHub Repository](https://github.com/RiddlenBaba/riddlen) - Complete source code

### Protocol Guides
- [Tokenomics](../guides/tokenomics.html) - Token economics and distribution
- [Burning Protocol](../guides/burning-protocol.html) - Deflationary mechanics
- [NFT Mechanics](../guides/nft-mechanics.html) - Weekly riddle system

---

*Last updated: October 2025*
