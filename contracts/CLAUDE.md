# Claude Code Configuration

This file helps Claude Code understand your project structure and preferences.

## Project Info
- **Type**: Smart Contract Development (Solidity)
- **Framework**: Hardhat
- **Language**: Solidity ^0.8.22
- **Testing**: Hardhat Test (Mocha/Chai)
- **Protocol**: Riddlen - Human Intelligence Validation Network v2025

## Commands
- **Test**: `npm test`
- **Compile**: `npx hardhat compile`
- **Deploy**: `npx hardhat run scripts/deploy.js`
- **Coverage**: `npm run coverage`
- **Lint**: `npm run lint`
- **Size Check**: `npm run size`

## Security Priorities
- All functions should have proper access controls
- Use OpenZeppelin contracts where appropriate
- Implement reentrancy guards for state-changing functions
- Add comprehensive input validation
- Follow CEI (Checks-Effects-Interactions) pattern
- **NEVER read .env files** - they contain sensitive deployment keys and API secrets

## ⚠️ IMPORTANT: Files to NEVER Access
- **.env files** (all variants: .env, .env.local, .env.production, etc.)
- **Private keys** (*.key, *.pem, deployment keys, etc.)
- **Secrets/credentials** (any file with "secret", "token", "apikey" in name)
- **Wallet mnemonics** or **private keys** in any form

See `.claudeignore` in project root for complete list.

## Protocol Architecture (Updated 2025-01-04)

### Core Contracts
- **RONUpgradeable.sol** - Soul-bound reputation tokens (v2025 with new tier system)
- **RDLNUpgradeable.sol** - Utility token with revolutionary creator economy
- **RiddleNFTAdvancedV2_Comprehensive.sol** - Main NFT system with gasless support
- **RiddlenOracleNetwork.sol** - Decentralized validation network (v2025)
- **RiddlenAirdrop.sol** - 3-phase airdrop system with gasless support

### Directory Structure
```
contracts/
├── token/               # RDLN utility token
├── reputation/          # RON reputation system
├── nft/                # Riddle NFT contracts
├── oracle/             # Oracle network for validation
├── groups/             # Group collaboration mechanics
├── governance/         # DAO governance
├── interfaces/         # Contract interfaces
├── mocks/              # Testing mocks
└── archive/            # Legacy/reference contracts
```

### Key Protocol Changes (2025-01-04)
1. **Revolutionary Tokenomics**: 50% burn → 0% burn, 100% creator rewards
2. **New RON Tier System**:
   - SEEKER (1K RON) - was NOVICE
   - SOLVER (10K RON) - unchanged
   - VALIDATOR (25K RON) - was EXPERT
   - ORACLE (50K RON) - reduced from 100K
3. **Gasless Transactions**: EIP-2771 meta-transactions via OpenZeppelin Defender
4. **Purchase Tier-Gating Removed**: Anyone can buy any riddle difficulty
5. **Validation Stakes Reduced**: ORACLE stake 1K RON (was 10K)
6. **Dual Staking System**: Validators stake RON, Contributors stake RON (burn if wrong)

## Code Style
- Use NatSpec documentation for all public functions
- Follow Solidity style guide
- Use meaningful variable names
- Add security considerations to comments
- Maximum line length: 100 characters
- **NEVER add comments unless explicitly requested**