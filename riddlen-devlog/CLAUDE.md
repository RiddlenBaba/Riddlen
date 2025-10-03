# Claude Code Configuration - Riddlen Devlog

This file helps Claude Code understand your on-chain devlog project.

## Project Info
- **Type**: On-Chain Microblog
- **Framework**: Next.js 14 with App Router
- **Port**: 3004
- **Domain**: devlog.riddlen.com
- **Blockchain**: Polygon Amoy Testnet (Chain ID: 80002)
- **Web3 Integration**: Wagmi v2 + Viem
- **Styling**: Tailwind CSS with typography plugin

## Commands
- **Dev**: `npm run dev` (runs on port 3004)
- **Build**: `npm run build`
- **Start**: `npm start` (runs on port 3004)

## What is the Devlog?
An immutable, on-chain development blog where posts are stored on the blockchain. All development updates, progress reports, and announcements are written to a smart contract.

## Smart Contract
- **Address**: 0x71b1544C4E0F8a07eeAEbBe72E2368d32bAaA11d (Amoy Testnet)
- **Chain**: Polygon Amoy (80002)
- **Contract**: RiddlenDevlog.sol

## Key Features
- On-chain post storage (immutable)
- Category filtering (Infrastructure, Development, Design, Community, etc.)
- Tag-based search
- Wallet-gated posting (requires WRITER_ROLE)
- Public reading (no wallet needed)
- Markdown support for content

## Post Structure
```typescript
{
  id: bigint;
  author: address;
  title: string;
  content: string; // Markdown supported
  category: string;
  tags: string[];
  timestamp: bigint;
  blockNumber: bigint;
}
```

## Categories
- Infrastructure
- Development
- Design
- Community
- Security
- Contracts
- Testing
- Documentation

## Security & Best Practices
- Never hardcode private keys - use environment variables
- **NEVER read .env files** - they contain sensitive contract addresses and API keys
- Only authorized wallets can post (WRITER_ROLE)
- All posts are permanent and immutable once on-chain
- Validate content before posting

## ⚠️ IMPORTANT: Files to NEVER Access
- **.env files** (all variants: .env, .env.local, .env.production, etc.)
- **Private keys** (*.key, *.pem, id_rsa, etc.)
- **Secrets/credentials** (any file with "secret", "token", "apikey" in name)
- **Database files** (*.db, *.sqlite, etc.)

See `.claudeignore` in project root for complete list.

## Development Workflow
1. Connect wallet with WRITER_ROLE
2. Write post with title, content (markdown), category, and tags
3. Submit transaction to write to blockchain
4. Post appears immediately after confirmation

## Architecture
- Next.js App Router (`app/`)
- Components in `components/`
- Contract ABI and config in `lib/contract.ts`
- Wagmi hooks for contract interactions

## Port Configuration
This app runs on **PORT 3004** managed by PM2 as `riddlen-devlog`.
See `/var/www/riddlen/PORT_MAPPING.md` for complete port reference.

## On-Chain Benefits
- Immutable record of development progress
- Transparent and verifiable timeline
- Cannot be censored or taken down
- Cryptographically signed by authors
