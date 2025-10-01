# Deployed Contracts Documentation

## Current Testnet Deployment (v5.2)

### Network: Polygon Amoy Testnet
**Chain ID**: 80002
**Deployer**: `0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040`
**Status**: ✅ Live and operational

---

## Active Contracts (Amoy Testnet)

### RDLN Token (Upgradeable ERC-20)
- **Network**: Polygon Amoy Testnet
- **Address**: `0x133029184EC460F661d05b0dC57BFC916b4AB0eB`
- **PolygonScan**: https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB
- **Contract Type**: ERC-20 Upgradeable with integrated treasury

#### Current Features ✅
- ✅ Rug-proof treasury (1M RDLN monthly, max 5M emergency)
- ✅ Progressive burn mechanics for riddle failures
- ✅ Biennial halving economics
- ✅ Game contract integration (RiddleNFT, Airdrop)
- ✅ RON reputation system integration
- ✅ Upgradeable contract architecture
- ✅ Comprehensive access control

### RON Token (Reputation System)
- **Address**: `0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635`
- **PolygonScan**: https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635
- **Features**:
  - ✅ Soul-bound (non-transferable) reputation
  - ✅ Tier-based access control (NEWCOMER → ORACLE)
  - ✅ Governance voting power
  - ✅ Group mechanics integration

### RiddleNFT (Gaming System)
- **Address**: `0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3`
- **PolygonScan**: https://amoy.polygonscan.com/address/0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3
- **Features**:
  - ✅ Tiered reward system (2x/1x/0.5x)
  - ✅ Progressive difficulty levels
  - ✅ Anti-cheat mechanisms (30s delay)
  - ✅ Cross-contract RON integration

### RiddlenAirdrop (Distribution)
- **Status**: Deployed with security fixes
- **Features**:
  - ✅ Social proof verification (Twitter, Telegram, GitHub)
  - ✅ Anti-Sybil protection with cooldowns
  - ✅ Tiered allocation system
  - ✅ Complete security audit applied

---

## Frontend Infrastructure

### Production Environment
- **Port**: 3000
- **Domain**: riddlen.com
- **Features**: Complete Wagmi v2 integration, WalletPanel UI, Airdrop interface

### Staging Environment
- **Port**: 3001
- **Location**: `frontend-staging/`
- **Purpose**: Testing new features before production deployment
- **Features**: Parallel testing environment with same contract integration

---

## Recent Developments (v5.2)

### ✅ Completed
1. **Group Mechanics Contracts**: Tier-based collaborative solving
2. **RiddlenAirdrop**: Merit-based distribution with social proof
3. **WalletPanel UI**: Advanced wallet interface with reputation tracking
4. **Staging Infrastructure**: Complete testing environment setup
5. **Mobile-First Design**: Responsive bottom navigation and layouts

### 🔄 In Progress
1. Group mechanics testing and deployment
2. Advanced pooled RON calculations
3. Collaborative reward distribution
4. Frontend integration of group features

### 🎯 Next Phase (v5.3)
1. Autonomous AI Agent integration on Akash Network
2. Enterprise Oracle Network for validation services
3. Professional security audit
4. Mainnet deployment preparation

---

## Historical Context

### Legacy Mainnet RDLN (Deprecated)
- **Network**: Polygon Mainnet
- **Address**: `0x683e52ec4a0dF61345172395b700208dd7ACcA53`
- **Status**: ⚠️ Deprecated (Thirdweb version)
- **Note**: Migration to new v5.2 contracts planned for mainnet

---

**Last Updated**: September 30, 2025
**Status**: v5.2 - Active Development on Testnet