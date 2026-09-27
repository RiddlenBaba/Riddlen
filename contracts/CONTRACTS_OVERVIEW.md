# 🏗️ Riddlen Protocol - Smart Contracts Overview

## 📁 Directory Structure

```
contracts/
├── contracts/                 # Active Smart Contracts
│   ├── token/                # Token Contracts
│   │   └── RDLNUpgradeable.sol      # 💰 Primary utility token
│   ├── reputation/           # Reputation System
│   │   └── RONUpgradeable.sol       # 🏆 Reputation & governance token
│   ├── nft/                  # NFT Gaming System
│   │   └── RiddleNFTAdvanced.sol    # 🎮 NFT-as-Game system
│   ├── oracle/               # Oracle Network
│   │   └── RiddlenOracleNetwork.sol # 🔮 Human intelligence validation
│   ├── groups/               # Group Mechanics
│   │   ├── RiddleGroupManager.sol   # 👥 Group management
│   │   └── GroupCompositionValidator.sol # ✅ Group validation
│   ├── governance/           # DAO Governance
│   │   └── RiddlenDAO.sol           # 🗳️ Decentralized governance
│   ├── interfaces/           # Contract Interfaces
│   ├── mocks/               # Testing Contracts
│   └── RiddlenAirdrop.sol   # 🎁 Multi-phase airdrop system
├── research/                # Research & Documentation
│   ├── docs/               # White papers & standards
│   ├── guides/            # Implementation guides
│   ├── analysis/          # Technical analysis
│   ├── deployment/        # Deployment docs
│   └── archived/          # Historical documents
└── archive/               # Archived Contracts
    └── contracts/         # Old/unused contract versions
```

## 🚀 Deployed Contracts (Polygon Amoy Testnet)

| Contract | Address | Type | Status |
|----------|---------|------|--------|
| **RDLN Token** | `0x133029184EC460F661d05b0dC57BFC916b4AB0eB` | ERC-20 | ✅ Live |
| **RON Token** | `0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635` | ERC-20 | ✅ Live |
| **Riddle NFT** | `0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3` | ERC-721 | ✅ Live |
| **Airdrop System** | `0x330275259AfCeC8822A861ecbbdfD026dB1B0A13` | Custom | ✅ Live |
| **Oracle Network** | TBD | Oracle | 🔄 Ready |
| **Group Mechanics** | TBD | System | 🔄 Ready |
| **DAO Governance** | TBD | Governance | 🔄 Ready |

## 📊 Contract Hierarchy

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   RDLN Token    │    │   RON Token     │    │  Riddle NFT     │
│   (Utility)     │    │  (Reputation)   │    │  (Gaming)       │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴───────────┐
                    │                         │
          ┌─────────▼───────┐    ┌─────────▼───────┐
          │ Oracle Network  │    │ Group Mechanics │
          │ (Validation)    │    │ (Collaboration) │
          └─────────────────┘    └─────────────────┘
                    │                         │
                    └─────────────┬───────────┘
                                  │
                        ┌─────────▼───────┐
                        │   DAO System    │
                        │  (Governance)   │
                        └─────────────────┘
```

## 🔧 Core Features by Contract

### 💰 RDLN Token (`RDLNUpgradeable.sol`)
- **Primary utility token** for the Riddlen ecosystem
- **Integrated treasury** with rug-proof protections
- **Monthly operations funding** (1M RDLN automated releases)
- **Burn mechanisms** for gameplay economics
- **Biennial halving** for long-term sustainability

### 🏆 RON Token (`RONUpgradeable.sol`)
- **Reputation scoring** based on puzzle-solving performance
- **Tier-based access control** (NEWCOMER → SOLVER → EXPERT → ORACLE)
- **Governance voting power** for protocol decisions
- **Anti-Sybil protection** through performance tracking
- **Oracle network participation** requirements

### 🎮 Riddle NFT (`RiddleNFTAdvanced.sol`)
- **NFT-as-Game concept** - Interactive experiences, not static collectibles
- **Tiered reward system** - First 25% get 2x, middle 50% get 1x, last 25% get 0.5x
- **Anti-cheat mechanisms** - 30-second solve delay, fingerprinting
- **Progressive difficulty** - Adaptive challenge levels
- **Achievement certificates** - Proof of intellectual accomplishment

### 🔮 Oracle Network (`RiddlenOracleNetwork.sol`)
- **Human intelligence validation** for puzzle solutions
- **Validator reputation tracking** with accuracy scoring
- **Economic incentives** for quality validation
- **Slashing mechanisms** for poor performance
- **Professional validation network** evolution

### 👥 Group Mechanics (`RiddleGroupManager.sol`)
- **Collaborative puzzle solving** in teams
- **Group formation** and management
- **Shared rewards** distribution
- **Team performance tracking**
- **Social aspect** of intellectual challenges

### 🗳️ DAO Governance (`RiddlenDAO.sol`)
- **Decentralized decision making** for protocol evolution
- **RON-weighted voting** based on reputation
- **Proposal creation** and execution
- **Treasury management** oversight
- **Protocol parameter updates**

### 🎁 Airdrop System (`RiddlenAirdrop.sol`)
- **Multi-phase distribution** strategy
- **Merit-based allocation** using RON scores
- **Social proof requirements** for early phases
- **Validation-based earning** for ongoing rewards
- **Anti-gaming mechanisms** to ensure fair distribution

## 🛠️ Development Workflow

### Adding Gasless Transactions
```bash
# 1. Extend existing contracts with meta-transaction support
# 2. Deploy gasless forwarder contract
# 3. Configure OpenZeppelin Defender relayers
# 4. Update frontend to support gasless operations
```

### Testing
```bash
npm test                    # Run all tests
npm run coverage           # Generate coverage report
npm run lint              # Check code quality
```

### Deployment
```bash
npm run deploy:amoy       # Deploy to Amoy testnet
npm run deploy:polygon    # Deploy to Polygon mainnet
```

## 🔐 Security Standards

- **Multi-signature requirements** for admin functions
- **Time-locked upgrades** for protocol changes
- **Comprehensive testing** with >95% coverage
- **External audits** for all major releases
- **Formal verification** for critical components
- **Bug bounty program** for community security research

## 📚 Documentation

- **Research**: Comprehensive analysis in `/research/` directory
- **Guides**: Implementation guides for developers
- **White Papers**: Technical specifications and economics
- **API Reference**: Complete function documentation

## 🌟 Innovation Highlights

1. **NFT-as-Game Revolution** - NFTs become interactive experiences
2. **Tiered Economic Model** - Speed and skill determine rewards
3. **Human Intelligence Oracle** - Validation by human expertise
4. **Merit-Based Progression** - Reputation drives access and rewards
5. **Collaborative Problem Solving** - Group mechanics for teams
6. **Autonomous Treasury** - Self-sustaining protocol economics

---

*Riddlen Protocol: Where Intelligence Meets Innovation* 🧠⚡