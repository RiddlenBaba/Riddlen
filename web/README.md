# Riddlen web

The Riddlen site: the board, riddle pages, writing, winnings and the Free Riddlen faucet page.
Next.js 14 (pages router), wagmi v2 + viem, no CSS framework.

```bash
npm install
npm run dev        # http://localhost:3005
npm run build
npm run generate:abi   # after `npx hardhat compile` in ../contracts
```

Configuration is public and lives in `.env.example`; override on Vercel only if the contracts
are redeployed. Root directory for the Vercel project: `web`.

Old riddlen.com URLs (`/game`, `/airdrop`, `/docs/...`, …) redirect permanently in
`next.config.js` so a year of indexing isn't lost.

Design: warm paper / ink, Fraunces for riddles and headings, Inter for UI, JetBrains Mono for
numbers. Light and dark from the system setting. Tokens in `styles/globals.css`.
