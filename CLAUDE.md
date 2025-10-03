# Claude Code Configuration - Riddlen Project

This file helps Claude Code understand the overall Riddlen project structure.

## Project Overview
**Riddlen** is a Web3 riddle-solving platform where intelligence matters more than capital. Players solve riddles to earn RDLN tokens, with a tiered reward system and merit-based progression through RON reputation tiers.

## Repository Structure

### Frontend Applications (4 apps on different ports)
- **`frontend/`** - Main production site (Port 3000) → riddlen.com
- **`frontend-staging/`** - Staging environment (Port 3001) → staging.riddlen.com
- **`riddlen-frames/`** - Farcaster frames (Port 3002) → frames.riddlen.com
- **`riddlen-devlog/`** - On-chain blog (Port 3004) → devlog.riddlen.com

### Smart Contracts
- **`contracts/`** - Solidity smart contracts (Hardhat project)
  - RDLN token (ERC20)
  - RON reputation (ERC20)
  - RiddleNFT (ERC721)
  - Airdrop mechanics
  - On-chain devlog contract

### Documentation
- **`docs/`** - Technical documentation and integration guides
- **`PORT_MAPPING.md`** - Server port assignments and troubleshooting
- **`SCALING_GUIDE.md`** - Infrastructure scaling strategies
- **`DEPLOYMENT_README.md`** - Deployment and operations guide

### Infrastructure
- **`docker-compose.yml`** - Multi-container orchestration
- **`ecosystem.config.js`** - PM2 process management
- **`nginx-upstream-example.conf`** - Load balancer configuration
- **`scripts/check-ports.sh`** - Port conflict detection tool

### Configuration
- **`.claudeignore`** - Files Claude should NEVER access
- **`.gitignore`** - Files excluded from Git

## Port Assignments
| Port | App | Domain |
|------|-----|--------|
| 3000 | Main | riddlen.com |
| 3001 | Staging | staging.riddlen.com |
| 3002 | Frames | frames.riddlen.com |
| 3004 | Devlog | devlog.riddlen.com |
| 5000 | API (future) | api.riddlen.com |

**ALWAYS check `PORT_MAPPING.md` before making server-related suggestions.**

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Web3**: Wagmi v2 + Viem + Ethers.js v6
- **Styling**: Tailwind CSS
- **State**: React Query

### Blockchain
- **Network**: Polygon Amoy Testnet (Chain ID: 80002)
- **Language**: Solidity ^0.8.0
- **Framework**: Hardhat
- **Libraries**: OpenZeppelin

### Infrastructure
- **Process Manager**: PM2
- **Web Server**: Nginx
- **Containerization**: Docker + docker-compose
- **Load Balancing**: Nginx upstream pools

## Quick Commands

### Start all apps
```bash
pm2 start ecosystem.config.js
pm2 save
```

### Check port conflicts
```bash
./scripts/check-ports.sh
```

### Docker deployment
```bash
docker-compose up -d
```

### Build contracts
```bash
cd contracts && npx hardhat compile
```

## Security & Best Practices

### ⚠️ CRITICAL: Files to NEVER Access
Claude should **NEVER** read or suggest reading these files:
- **.env files** (all variants: .env, .env.local, .env.production, .env.*)
- **Private keys** (*.key, *.pem, id_rsa, deployment keys, etc.)
- **Secrets/credentials** (any file with "secret", "token", "apikey", "password" in name)
- **Wallet files** (keystore, mnemonic, private keys)
- **Database files** (*.db, *.sqlite, etc.)
- **API tokens** or **service credentials**

**See `.claudeignore` for complete list of restricted files.**

### Why This Matters
- .env files contain sensitive API keys, private keys, and secrets
- Exposing these could compromise the entire platform
- Even in development, these should never be read or logged
- Use environment variables, never hardcode secrets

### If You Need Config Info
- Ask the user to provide specific non-sensitive values
- Reference example files (*.example, *.template)
- Read public configuration only
- Never assume or read actual secret values

## Development Workflow

1. **Check current directory**: Understand which app you're working on
2. **Read app-specific CLAUDE.md**: Each app has its own config file
3. **Check PORT_MAPPING.md**: For server-related tasks
4. **Never read .env files**: Use .claudeignore as reference
5. **Test changes**: Ensure no port conflicts before deployment

## Key Documentation Files by Task

### Infrastructure/DevOps
- `PORT_MAPPING.md` - Port assignments and conflicts
- `SCALING_GUIDE.md` - How to scale to multiple servers
- `DEPLOYMENT_README.md` - Deployment procedures
- `ecosystem.config.js` - PM2 configuration

### Frontend Development
- `frontend/CLAUDE.md` - Main frontend config
- `frontend-staging/CLAUDE.md` - Staging frontend config
- `docs/FRONTEND_INTEGRATION.md` - Web3 integration guide

### Smart Contracts
- `contracts/CLAUDE.md` - Contract development config
- `contracts/white-paper-v5.2` - Tokenomics and mechanics
- `testnet/TESTNET_DEPLOYMENT.md` - Deployed contract addresses

### Farcaster Frames
- `riddlen-frames/CLAUDE.md` - Frames app config

### Devlog
- `riddlen-devlog/CLAUDE.md` - On-chain blog config

## Current Development Phase

**Infrastructure**: Phase 1 (Containerization) - 70% complete
- ✅ Dockerfiles created
- ✅ PM2 ecosystem configured
- ✅ Port management system in place
- ✅ Documentation complete
- ⏳ Multi-server deployment pending

## Project Goals

1. **Rug-Proof Treasury**: Transparent, immutable on-chain management
2. **Merit-Based System**: RON tiers reward consistent solvers
3. **Tiered Rewards**: 2x/1x/0.5x multipliers based on speed
4. **Anti-Cheat**: 30-second minimum solve time
5. **Scalable Infrastructure**: Ready for mainnet launch

## Core Contracts (Amoy Testnet)
- **RDLN Token**: 0x133029184EC460F661d05b0dC57BFC916b4AB0eB
- **RON Token**: 0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635
- **RiddleNFT**: 0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3
- **Devlog**: 0x71b1544C4E0F8a07eeAEbBe72E2368d32bAaA11d

## Important Reminders

1. **Always check `.claudeignore`** before reading files
2. **Never access .env files** under any circumstances
3. **Check `PORT_MAPPING.md`** for port-related questions
4. **Read app-specific CLAUDE.md** when working in subdirectories
5. **Use `./scripts/check-ports.sh`** to diagnose port conflicts
6. **Reference ecosystem.config.js** for PM2 process info

## Getting Help

If you need to:
- **Add new environment variables**: Ask user to add them, never read existing .env
- **Check port assignments**: Read PORT_MAPPING.md
- **Understand contract addresses**: Read testnet/TESTNET_DEPLOYMENT.md (public info)
- **Deploy changes**: Read DEPLOYMENT_README.md
- **Scale infrastructure**: Read SCALING_GUIDE.md

---

**Let's build the future where intelligence matters more than capital! 🧠⚡**
