# Farcaster Frames - Development Notes

**Date**: 2025-09-30
**Status**: Exploration phase - Frog framework attempted, needs Next.js approach

## What We Attempted

Built Farcaster Frames using **Frog framework** in `/riddlen-farcaster-frames/`:
- ✅ 5 interactive frames designed (Active Riddle, Mint, Leaderboard, Profile, Details)
- ✅ Real contract integration (Polygon Amoy testnet)
- ✅ Blockchain data fetching with Viem
- ✅ Transaction handlers for NFT minting

## Technical Issue Encountered

**Problem**: Frog framework uses JSX-in-JS which requires:
- Vercel's edge runtime, OR
- Complex build tooling (Vite/esbuild)

**Error**: `Parse error index.js:55:15` - Node.js couldn't parse JSX without transpilation

**Attempted fixes**:
- tsx runtime (failed - doesn't support Frog's JSX syntax)
- Direct Node execution (failed - JSX not supported)

## Lesson Learned

**Frog framework is designed for Vercel deployment**, not traditional Node.js servers.

## Next Steps - Recommended Approach

### Option 1: Frames.js (RECOMMENDED)
**Why**: Built on Next.js - compatible with your existing infrastructure!

- You already have 2 Next.js apps running successfully (ports 3000, 3001)
- Frames.js is React/Next.js based = works with your PM2/Nginx setup
- No special build tooling needed
- Can run on port 3002 like your other apps

### Option 2: Vercel for Frames Only
- Keep main apps on your server
- Deploy just Frames to Vercel
- Still use frames.riddlen.com subdomain
- Trade-off: One service not on your infrastructure

### Option 3: Frog on Vercel
- Keep the Frog code we built
- Deploy to Vercel (5 min setup)
- Works immediately

## Code Preservation

Frog attempt saved in: `/riddlen-farcaster-frames/` (to be archived/removed)

Contains:
- 5 complete Frame designs
- Contract integration code
- Blockchain queries with Viem
- Transaction handlers

This code can be:
- **Adapted** to Frames.js (similar concepts)
- **Deployed** to Vercel as-is
- **Referenced** for Frame design patterns

## Recommendation

**Use Frames.js** - build as Next.js app like your frontend/frontend-staging:
1. Same stack you already know
2. Runs on your server with PM2
3. Deploy to port 3002
4. Configure Nginx for frames.riddlen.com
5. Done!

## Resources

- **Frames.js**: https://framesjs.org
- **Frog Docs**: https://frog.fm
- **Farcaster Frames Spec**: https://docs.farcaster.xyz/reference/frames/spec

---

## What We Did NOT Break

✅ No changes to existing contracts
✅ No changes to frontend or frontend-staging
✅ No changes to any production code
✅ PM2 processes cleaned up
✅ All existing apps still running

**Impact**: Zero - this was isolated exploration in new directory.
