# Claude Code Configuration - Riddlen Frames

This file helps Claude Code understand your Farcaster frames project.

## Project Info
- **Type**: Farcaster Frames Application
- **Framework**: Next.js 14 with frames.js
- **Port**: 3002
- **Domain**: frames.riddlen.com
- **Web3 Integration**: Wagmi v2 + Viem + RainbowKit
- **Styling**: Tailwind CSS

## Commands
- **Dev**: `npm run dev` (runs on port 3002)
- **Build**: `npm run build`
- **Start**: `npm start` (runs on port 3002)
- **Frames Test**: `npm run frames` (opens debugger)

## What are Farcaster Frames?
Frames are interactive, embedded experiences in Farcaster (decentralized social protocol). Users can interact with Web3 apps directly in their social feed.

## Key Features
- Riddle solving within Farcaster
- Frame SDK integration
- Social sharing and interactions
- Web3 wallet connections in frames
- OG image generation for previews

## Security & Best Practices
- Never hardcode private keys - use environment variables
- **NEVER read .env files** - they contain sensitive secrets and API keys
- Validate all frame interactions
- Implement proper error handling
- Test frames in Farcaster debugger

## ⚠️ IMPORTANT: Files to NEVER Access
- **.env files** (all variants: .env, .env.local, .env.production, etc.)
- **Private keys** (*.key, *.pem, id_rsa, etc.)
- **Secrets/credentials** (any file with "secret", "token", "apikey" in name)
- **Database files** (*.db, *.sqlite, etc.)

See `.claudeignore` in project root for complete list.

## Development Workflow
1. Build frames in `app/frames/`
2. Test with Farcaster frame debugger
3. Deploy and verify on frames.riddlen.com

## Frame Structure
Frames are built using frames.js with Next.js App Router.

## Port Configuration
This app runs on **PORT 3002** managed by PM2 as `riddlen-frames`.
See `/var/www/riddlen/PORT_MAPPING.md` for complete port reference.
