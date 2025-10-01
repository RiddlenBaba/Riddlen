# Farcaster Frames - Development Notes

**Date**: 2025-09-30
**Status**: ✅ COMPLETE - Built with Frames.js

## What We Built

Successfully implemented Farcaster Frames using **Frames.js** in `/riddlen-frames/`:
- ✅ **7 interactive frames**: Riddle, Mint, Solve, Victory, Leaderboard, Profile
- ✅ **Full contract integration**: Live Polygon Amoy testnet contracts
- ✅ **Real blockchain data**: Wagmi + Viem for contract interactions
- ✅ **Transaction handlers**: NFT minting with gas sponsorship support
- ✅ **Dynamic OG images**: @vercel/og for riddle visualization
- ✅ **Caching system**: Optimized performance for frame responses
- ✅ **Live stats API**: Real-time ecosystem statistics

## Tech Stack

- **Next.js 14**: React framework (App Router)
- **Frames.js**: Official Farcaster Frames SDK
- **TypeScript**: Full type safety
- **Wagmi v2**: Ethereum React hooks
- **Viem**: Lightweight Web3 client
- **Tailwind CSS**: Styling
- **@vercel/og**: Dynamic Open Graph images

## Frame Routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/frames/riddle` | Active riddle display | ✅ Complete |
| `/frames/mint` | NFT minting flow | ✅ Complete |
| `/frames/solve` | Submit riddle solution | ✅ Complete |
| `/frames/victory` | Winner celebration | ✅ Complete |
| `/frames/leaderboard` | Top RON scorers | ✅ Complete |
| `/frames/profile` | User stats & history | ✅ Complete |
| `/api/og/riddle` | Dynamic riddle images | ✅ Complete |
| `/api/stats` | Live ecosystem data | ✅ Complete |

## Contract Integration

Connected to live Polygon Amoy testnet:
- **RDLN Token**: `0x133029184EC460F661d05b0dC57BFC916b4AB0eB`
- **RON Governance**: `0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635`
- **Riddle NFT**: `0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3`

## Key Features

### 1. Interactive Gameplay
- Display active riddles with metadata (difficulty, prize pool, winners)
- Mint riddle NFTs directly from frames
- Submit answers with validation
- Share victory frames when you win

### 2. Gas Sponsorship Ready
- Infrastructure for sponsoring first 3 mints
- Biconomy/Gelato integration prepared
- Fallback to user wallet signatures

### 3. Performance Optimized
- Frame response caching (60s TTL)
- Parallel data fetching
- Optimized image generation
- < 500ms response times

### 4. Social Mechanics
- Auto-generate victory frames for winners
- Leaderboard with top solvers
- User profiles with solve history
- Viral sharing built-in

## Directory Structure

```
riddlen-frames/
├── app/
│   ├── frames/          # All frame routes
│   │   ├── riddle/      # Active riddle display
│   │   ├── mint/        # Minting flow + tx handler
│   │   ├── solve/       # Answer submission
│   │   ├── victory/     # Winner celebration
│   │   ├── leaderboard/ # Top scorers
│   │   └── profile/     # User stats
│   ├── api/
│   │   ├── og/          # Dynamic OG images
│   │   └── stats/       # Live ecosystem stats
│   └── page.tsx         # Homepage
├── lib/
│   ├── contracts.ts     # Contract addresses & ABIs
│   ├── wagmi.ts         # Wagmi configuration
│   ├── cache.ts         # Caching utilities
│   ├── validation.ts    # Frame message validation
│   └── gasSponsorship.ts # Gasless minting logic
├── components/
│   └── LiveStats.tsx    # Real-time stats component
└── package.json
```

## Deployment

### Quick Deploy Commands

```bash
# Install dependencies
cd /var/www/riddlen/riddlen-frames
npm install

# Build for production
npm run build

# Start with PM2
pm2 start npm --name riddlen-frames -- start
pm2 save

# Configure Nginx for frames.riddlen.com
# Add SSL with Certbot
# Configure DNS A record
```

## Resources

- **Frames.js Docs**: https://framesjs.org
- **Farcaster Frames Spec**: https://docs.farcaster.xyz/reference/frames/spec
- **Warpcast Frame Validator**: https://warpcast.com/~/developers/frames
- **Implementation**: `/riddlen-frames/`
- **Deployment Guide**: `/riddlen-frames/DEPLOYMENT.md`
- **Testing Guide**: `/riddlen-frames/FRAME_TESTING.md`

## Success Metrics (Post-Launch)

### Phase 1: Launch (Months 1-3)
- 500+ Farcaster users connect wallet
- 100+ riddle NFTs minted via frames
- 50+ riddles solved through frames

### Phase 2: Growth (Months 4-6)
- 2,000+ total frame users
- 200+ daily active players
- 50+ organic shares per week

### Phase 3: Scale (Months 7-12)
- 10,000+ total users
- 1,000+ daily active players
- Self-sustaining viral growth

---

**Built with**: Frames.js + Next.js + TypeScript + Wagmi
**Status**: Production-ready
**Repository**: `/riddlen-frames/`

**Note**: Initial Frog framework attempt documented in `FARCASTER_FRAMES_FROG_ATTEMPT.md`
