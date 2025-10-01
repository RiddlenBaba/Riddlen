# Riddlen Smart Contracts Documentation

Welcome to the comprehensive documentation for the Riddlen Protocol smart contract ecosystem. This documentation covers all aspects of the protocol from high-level concepts to detailed technical implementations.

## 📖 Documentation Structure

### 🎯 Core Concepts (`/guides/`)

**Start here if you're new to Riddlen:**

- **[Tokenomics](guides/tokenomics.md)** - Complete economic model, token distribution, and sustainability mechanics
- **[NFT Mechanics](guides/nft-mechanics.md)** - Weekly riddle system, progressive burns, and solving mechanics
- **[Burning Protocol](guides/burning-protocol.md)** - Deflationary mechanisms and game theory analysis

**Development Resources:**

- **[Development Log](guides/DEVELOPMENT-LOG.md)** - Implementation history and decisions

### 🌐 Testnet Documentation (`/testnet/`)

**Live deployment resources:**

- **[TESTNET_DEPLOYMENT.md](testnet/TESTNET_DEPLOYMENT.md)** - Complete Amoy testnet deployment details with live contract addresses
- Revolutionary tiered rewards and rug-proof treasury features
- Testing instructions and verification links

### 🎮 Frontend Integration (`/frontend/`)

**Developer resources:**

- **[FRONTEND_INTEGRATION.md](frontend/FRONTEND_INTEGRATION.md)** - Complete integration guide for building on Riddlen
- React components and JavaScript examples
- UI/UX recommendations and testing workflows

### 🔧 Technical References (`/api/`)

**For developers integrating with Riddlen:**

- **[API Reference](api/api.md)** - Complete smart contract API with examples
  - RDLN Token functions and events
  - RON Reputation system interface
  - RiddleNFT solving and trading mechanics
  - Error codes and integration examples

### 📋 Contract Specifications (`/contracts/`)

**Detailed technical specifications:**

- **[RDLN Contract](contracts/RDLN-Contract-Specification.md)** - Utility token with burn mechanics
- **[RON Reputation System](contracts/RON-Reputation-System.md)** - Soul-bound reputation tokens
- **[TreasuryDrip Contract](contracts/TreasuryDrip-specification.md)** - Automated treasury distribution

### 🚀 Deployment Information (`/deployment/`)

**Network deployment details:**

- **[Deployed Contracts](deployment/DeployedContracts.md)** - Contract addresses and verification info

## 🎮 Quick Start Guide

### For Players
1. Read [Tokenomics](guides/tokenomics.md) to understand the economy
2. Learn [NFT Mechanics](guides/nft-mechanics.md) for riddle solving
3. Understand [Burning Protocol](guides/burning-protocol.md) costs

### For Developers
1. Review [API Reference](api/api.md) for integration patterns
2. Check [Contract Specifications](contracts/) for detailed implementations
3. See [Deployment Information](deployment/) for contract addresses

### For Researchers
1. Start with [Tokenomics](guides/tokenomics.md) economic model
2. Analyze [Burning Protocol](guides/burning-protocol.md) game theory
3. Review contract specifications for technical validation

## 🔗 Key Links

- **Main Repository**: [riddlen-contracts](../)
- **Whitepaper**: [Riddlen Protocol v5.1](https://riddlen.com/whitepaper)
- **Website**: [riddlen.com](https://riddlen.com)
- **Discord**: [Join our community](https://discord.gg/riddlen)

## 📊 Contract Overview

| Contract | Purpose | Documentation | Status |
|----------|---------|---------------|---------|
| **RDLN** | Utility token with burns | [Spec](contracts/RDLN-Contract-Specification.md) • [API](api/api.md#rdln-token-api) | ✅ Complete |
| **RON** | Soul-bound reputation | [Spec](contracts/RON-Reputation-System.md) • [API](api/api.md#ron-reputation-api) | ✅ Complete |
| **RiddleNFT** | Weekly riddle system | [Mechanics](guides/nft-mechanics.md) • [API](api/api.md#riddlenftnft-api) | ✅ Complete |
| **TreasuryDrip** | Automated treasury | [Spec](contracts/TreasuryDrip-specification.md) | ✅ Complete |

## 🎯 Protocol Highlights

### Innovation
- **Proof-of-Solve**: Human intelligence validation through riddle solving
- **Progressive Burns**: Costs increase with failed attempts (1, 2, 3... N RDLN)
- **Soul-Bound Reputation**: Non-transferable merit-based access control
- **Weekly NFT System**: 1000 riddles over 20 years with randomized parameters

### Economics
- **1B RDLN Total Supply**: 70% prizes, 10% treasury, 10% airdrop, 10% liquidity
- **Biennial Halving**: Mint costs reduce 50% every 2 years
- **Merit-Based Tiers**: 4 RON access levels (Novice → Solver → Expert → Oracle)
- **Sustainable Deflation**: Burns eventually exceed prize distributions

### Security
- **OpenZeppelin Standards**: Battle-tested contract foundations
- **Comprehensive Testing**: 100% core functionality coverage
- **Access Control**: Role-based permissions with multi-sig support
- **Audit Ready**: Prepared for external security review

## 📝 Contributing to Documentation

We welcome contributions to improve our documentation:

1. **Found an error?** Submit an issue or pull request
2. **Missing information?** Suggest additions in our Discord
3. **Better examples?** Share integration patterns with the community

## 📄 License

All documentation is released under the [MIT License](../LICENSE), same as the smart contracts.

---

**Documentation Version**: 1.0.0
**Last Updated**: September 28, 2025
**Protocol Version**: v0.3.0