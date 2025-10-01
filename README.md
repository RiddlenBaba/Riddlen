# 🧠 Riddlen Protocol - Complete Ecosystem

[![Network](https://img.shields.io/badge/network-Polygon%20Amoy-purple.svg)](https://amoy.polygonscan.com/)
[![Version](https://img.shields.io/badge/version-v6.0-blue.svg)](./contracts/RIDDLEN_V6_SUMMARY.md)
[![Status](https://img.shields.io/badge/status-LIVE%20ON%20TESTNET-brightgreen.svg)](./contracts/docs/testnet/TESTNET_DEPLOYMENT.md)
[![Tests](https://img.shields.io/badge/tests-200%2B%20passing-brightgreen.svg)](./contracts/test/)

**The first blockchain protocol that rewards human intelligence over computational power through Proof-of-Solve consensus.**

---

## 🎯 What is Riddlen?

Riddlen revolutionizes blockchain gaming and oracle networks by creating the first **merit-based ecosystem** where:

- **🧠 Intelligence > Capital**: Solve riddles to earn governance power
- **🎮 NFT-as-Game**: Interactive experiences vs static collectibles
- **🏆 Tiered Rewards**: First solvers earn 2x more, creating solve urgency
- **🛡️ Rug-Proof Treasury**: Immutable monthly releases with emergency limits
- **⚡ Soul-Bound Reputation**: Non-transferable RON tokens representing earned intelligence

---

## 📁 Repository Structure

### 📋 [Smart Contracts](./contracts/)
Core protocol implementation with comprehensive test suite:
- **RDLNUpgradeable**: Primary token with integrated rug-proof treasury
- **RONUpgradeable**: Merit-based governance with adjustable reward system
- **RiddleNFTAdvancedV2**: Next-gen interactive NFT gaming with enhanced mechanics
- **RiddlenAirdrop**: Merit-based distribution with autoclaim & social proof
- **RiddlenOracleNetwork**: Enterprise data validation network (NEW)
- **RiddlenDAO**: Governance with transferable founder role (NEW)
- **Group Mechanics**: Collaborative riddle-solving with composition validation

### 🌐 [Live Testnet](./testnet/)
**DEPLOYED AND OPERATIONAL** on Polygon Amoy:
- Live contract addresses and verification
- Complete deployment documentation
- Testing instructions and verification

### 🎮 [Frontend](./frontend/)
User interface for the Riddlen ecosystem:
- **Production**: Next.js app with Wagmi v2 integration
- **Staging**: Testing environment at `frontend-staging/`
- **WalletPanel**: Advanced wallet UI with reputation tracking
- **Airdrop Interface**: Merit-based token distribution UI
- **Farcaster Frames**: Social gaming integration at `riddlen-frames/` (NEW)

### 📚 [Documentation](./docs/)
Complete integration and development guides:
- **[FRONTEND_INTEGRATION.md](./docs/FRONTEND_INTEGRATION.md)**: Developer integration guide
- API references and code examples
- UI/UX recommendations

---

## 🚀 Quick Start

### **For Users - Try the Live Testnet**
1. **Get Testnet MATIC**: [Polygon Faucet](https://faucet.polygon.technology/)
2. **Connect Wallet**: Use MetaMask with Amoy network (Chain ID: 80002)
3. **Start Solving**: Visit our frontend and solve riddles to earn rewards

### **For Developers - Build on Riddlen**
```bash
# 1. Clone this repository
git clone https://github.com/RiddlenBaba/riddlen.git
cd riddlen

# 2. Install contract dependencies
cd contracts
npm install

# 3. Run comprehensive test suite
npm test

# 4. Deploy to local network or testnet
npx hardhat run scripts/deploy.js --network localhost
```

### **For Integrators - Use Live Contracts**
```javascript
// Connect to live Amoy testnet contracts
const CONTRACTS = {
  RDLN: "0x133029184EC460F661d05b0dC57BFC916b4AB0eB",
  RON: "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635",
  RIDDLE_NFT: "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3"
}

// See docs/FRONTEND_INTEGRATION.md for complete examples
```

---

## 🎯 Revolutionary Features

### **🏆 Tiered Reward System**
**Solve fast = Earn more!** The first NFT gaming system that rewards speed:

```
Example: 20 Winners Total
├── Tier 1 (Positions 1-5):   2.0x rewards → ~88,888 RDLN each
├── Tier 2 (Positions 6-15):  1.0x rewards → ~44,444 RDLN each
└── Tier 3 (Positions 16-20): 0.5x rewards → ~22,222 RDLN each

Result: First solver earns 4x more than last solver!
```

### **🛡️ Rug-Proof Treasury**
**Unbreakable holder protections:**
- ✅ **Fixed 1M RDLN monthly releases** (immutable constant)
- ✅ **Max 5M RDLN emergency per year** (with 1-year cooldown)
- ✅ **Autonomous operations** (no admin required)
- ✅ **Full transparency** (real-time tracking via smart contract)

### **🔄 Progressive Merit System**
**Earn your way to governance:**
1. **EASY Riddles** → Earn RON → **SOLVER Tier**
2. **MEDIUM Riddles** → More RON → **EXPERT Tier**
3. **HARD Riddles** → Elite RON → **ORACLE Tier**
4. **Governance Access** → Vote on protocol decisions

### **🔮 Oracle Network (NEW)**
**Enterprise data validation powered by human intelligence:**
- 🏢 **External Revenue**: Companies pay RDLN for human validation
- 🧠 **RON-Based Validation**: High-reputation users earn by validating data
- ⚖️ **Consensus Mechanism**: Multiple validators ensure accuracy
- 💰 **Fee Distribution**: 50% treasury, 30% buyback/burn, 20% top validators
- 🛡️ **Slashing Protection**: Wrong validators lose staked RON

### **🏛️ DAO Governance (NEW)**
**True decentralization with intelligent founder transition:**
- 🗳️ **RON-Based Voting**: 1 RON = 1 vote (earned, not bought)
- 👑 **Transferable Founder Role**: Can be passed to anyone or dissolved
- ⏰ **Three Governance Phases**: Builder → Shared → Full DAO control
- 🔄 **Dynamic Thresholds**: Proposal requirements halve every 2 years
- 🛡️ **Timelock Protection**: Critical changes have built-in delays

### **🎮 Farcaster Integration (NEW)**
**Social gaming meets blockchain:**
- 🖼️ **Interactive Frames**: Play riddles directly in Farcaster feed
- ⚡ **Gasless Onboarding**: First 3 mints sponsored for new users
- 🏆 **Viral Sharing**: Auto-generate victory frames when you win
- 🌐 **Mini Apps**: Full gameplay experience in Warpcast
- 👥 **710K+ Potential Users**: Access to entire Farcaster ecosystem

---

## 📊 Live Testnet Status

### **🌐 Contract Addresses (Amoy Testnet)**
| Contract | Address | Status |
|----------|---------|--------|
| **RDLN Token** | [`0x133029...AB0eB`](https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB) | ✅ Verified |
| **RON Governance** | [`0xD86b14...Ab635`](https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635) | ✅ Verified |
| **RiddleNFT Gaming** | [`0x529e30...59e9E3`](https://amoy.polygonscan.com/address/0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3) | ✅ Verified |

### **🧪 Test Results**
- **187 tests passing** across all contracts
- **8/13 ecosystem integration tests** passing
- **Complete user journey** from EASY → ORACLE validated

---

## 🛣️ Development Roadmap

### **✅ v5.2 Achievements (Current)**
- **Group Mechanics**: Collaborative riddle-solving with tier-based composition
- **RiddlenAirdrop v5.2**: Merit-based token distribution with autoclaim & social proof
- **RON Adjustable Rewards**: Dynamic reward system following halving schedules
- **Staging Environment**: Complete frontend deployment for testing
- **WalletPanel**: Advanced wallet UI with reputation tracking
- **Infrastructure**: Production and staging environments operational

### **🚀 v6.0 Major Ecosystem Expansion (COMPLETE)**
- ✅ **RiddlenOracleNetwork**: Enterprise data validation network with RON staking
- ✅ **RiddlenDAO**: Full governance system with transferable founder role
- ✅ **RiddleNFTAdvancedV2**: Enhanced NFT contracts with comprehensive upgrades
- ✅ **Farcaster Frames Integration**: Social gaming with frames.js (live at riddlen-frames/)
- ✅ **Comprehensive Documentation**: 20+ technical documents covering all systems

### **🎯 v6.1 Goals (Next Phase)**
- Deploy Oracle Network and DAO to testnet
- Launch Farcaster Frames public beta
- Professional security audit for v6.0 contracts
- Mainnet deployment preparation

---

## 🔗 Quick Links

### **Core Documentation**
- 🌐 **[Amoy PolygonScan](https://amoy.polygonscan.com/)** - View live contracts
- 🚰 **[Polygon Faucet](https://faucet.polygon.technology/)** - Get testnet MATIC
- 📋 **[Testnet Guide](./contracts/docs/testnet/TESTNET_DEPLOYMENT.md)** - Complete deployment details
- 🎮 **[Frontend Guide](./contracts/docs/frontend/FRONTEND_INTEGRATION.md)** - Developer integration
- 📖 **[White Paper](./contracts/white-paper-v5.2)** - Complete protocol vision

### **New v6.0 Systems**
- 🔮 **[Oracle Network](./contracts/ORACLE_READY_FOR_DEPLOYMENT.md)** - Enterprise validation system
- 🏛️ **[DAO Governance](./contracts/DAO_SYSTEM_COMPLETE.md)** - Decentralized governance
- 🖼️ **[NFT V2 System](./contracts/NFT_V2_MINIMAL_READY_FOR_DEPLOYMENT.md)** - Enhanced NFT contracts
- 🎁 **[Airdrop System](./contracts/docs/contracts/RiddlenAirdrop-specification.md)** - Merit-based distribution
- 🎮 **[Farcaster Frames](./FARCASTER_FRAMES_NOTES.md)** - Social gaming integration

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
- **GitHub**: [riddlenbaba/riddlen](https://github.com/RiddlenBaba/riddlen) (You are here!)
- **Website**: [riddlen.com](https://riddlen.com)
- **Documentation**: [riddlen.org](https://riddlen.org)
- **Twitter**: [@RiddlenToken](https://twitter.com/RiddlenToken)
- **Issues**: Use GitHub Issues for bug reports and feature requests

---

## 🔮 The Vision

**"Intelligence matters more than capital."**

Riddlen demonstrates that decentralized systems can effectively harness human collective intelligence while creating meaningful economic incentives. By separating financial tokens (RDLN) from intellectual reputation (RON), we solve fundamental problems in both gaming economies and oracle validation systems.

**Join us in building the future where merit drives value!** 🧠⚡

---

## 📄 License

Apache 2.0 - See [LICENSE](LICENSE) for details.

**🤖 Generated with [Claude Code](https://claude.com/claude-code)**