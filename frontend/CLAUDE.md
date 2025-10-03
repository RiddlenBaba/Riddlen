# Claude Code Configuration - Riddlen Frontend

This file helps Claude Code understand your frontend project and integration requirements.

## Project Info
- **Type**: React Frontend Application
- **Framework**: Next.js with React 18
- **Web3 Integration**: Wagmi v2 + Viem + Ethers.js v6
- **Wallet Connection**: Wagmi hooks (no ThirdWeb)
- **Blockchain**: Polygon Amoy Testnet (Chain ID: 80002)
- **Styling**: Tailwind CSS

## Live Contract Addresses (Amoy Testnet)
```javascript
const CONTRACTS = {
  RDLN: "0x133029184EC460F661d05b0dC57BFC916b4AB0eB",
  RON: "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635",
  RIDDLE_NFT: "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3"
}

const NETWORK = {
  chainId: 80002,
  name: 'Polygon Amoy Testnet',
  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
}
```

## Commands
- **Dev**: `npm run dev` or `next dev`
- **Build**: `npm run build` or `next build`
- **Start**: `npm start` or `next start`
- **Install**: `npm install`

## Key Features to Implement
1. **Wallet Connection** - MetaMask integration with Amoy network
2. **Tiered Reward Display** - Show 2x/1x/0.5x reward tiers dynamically
3. **RON Progression** - User tier system (NEWCOMER → SOLVER → EXPERT → ORACLE)
4. **Anti-Cheat Timer** - 30-second solve delay enforcement
5. **Treasury Transparency** - Real-time rug-proof treasury status
6. **Riddle Solving Flow** - Complete user journey from mint to reward claim

## Integration Priorities
1. **Start with Wagmi wallet connection** and Amoy network setup
2. **Implement contract interactions** using Wagmi hooks + Viem
3. **Build tiered reward calculator** - this is the killer feature!
4. **Add RON progression UI** - gamify the experience
5. **Test complete user flow** - mint → solve → earn → progress

## Web3 Stack (No ThirdWeb)
- **Wagmi v2**: React hooks for Ethereum
- **Viem**: TypeScript interface for Ethereum
- **@tanstack/react-query**: Data fetching and caching
- **Ethers.js v6**: Fallback for complex contract interactions
- **MetaMask**: Primary wallet connection

## Security & Best Practices
- Never hardcode private keys - use environment variables
- **NEVER read .env files** - they contain sensitive secrets and API keys
- Validate all user inputs before blockchain interactions
- Implement proper error handling for contract calls
- Use Wagmi hooks for robust wallet connections
- Add loading states for all blockchain operations
- Type-safe contract interactions with Viem

## ⚠️ IMPORTANT: Files to NEVER Access
- **.env files** (all variants: .env, .env.local, .env.production, etc.)
- **Private keys** (*.key, *.pem, id_rsa, etc.)
- **Secrets/credentials** (any file with "secret", "token", "apikey" in name)
- **Database files** (*.db, *.sqlite, etc.)

See `.claudeignore` in project root for complete list.

## Development Workflow
1. **Use the integration guide** at `../docs/FRONTEND_INTEGRATION.md`
2. **Reference live contracts** - all deployed and verified on Amoy
3. **Test with real testnet MATIC** from Polygon faucet
4. **Follow mobile-first responsive design**
5. **Implement proper Web3 error handling**

## Code Style
- Use TypeScript for type safety where possible
- Follow React functional component patterns
- Implement custom hooks for Web3 interactions
- Use Tailwind for consistent styling
- Add proper loading and error states

## Testing Strategy
- Test wallet connection with MetaMask
- Test contract interactions on Amoy testnet
- Verify tiered reward calculations match smart contract
- Test complete riddle solving user journey
- Validate responsive design on mobile devices

## Reference Documentation
- **Complete Integration Guide**: `../docs/FRONTEND_INTEGRATION.md`
- **Live Contracts**: `../testnet/TESTNET_DEPLOYMENT.md`
- **Smart Contract ABIs**: `../contracts/artifacts/contracts/`
- **White Paper**: `../contracts/white-paper-v5.2`

## Current Focus
The main goal is to create a working frontend that connects to your live testnet contracts and demonstrates:
- **Tiered reward system** in action
- **Merit-based progression** through RON tiers
- **Complete riddle solving experience**
- **Professional UI/UX** that builds user confidence

Let's build the future where intelligence matters more than capital! 🧠⚡