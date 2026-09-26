# Riddlen Source Map

Where everything about Riddlen lives, and which sources to trust. Compiled 2026-09-26.

## Specifications: what to trust

| Priority | Source | Notes |
|----------|--------|-------|
| 1 | `contracts/research/docs/white-paper-v5.2` | Newest whitepaper (Oct 1 2025). Stated product intent. |
| 2 | `contracts/research/docs/Riddlen-White-Paper-v5.1.md` | Superseded by v5.2. Contains presale pricing and vesting: regulatory-sensitive, don't republish. |
| 3 | `contracts/audits/game-core-audit-2026-09-26.md` | What the contracts actually do today, and what's broken. |
| — | `docs/` (riddlen.org) | Public docs written against Oct 2025 code. **Stale.** Promises 2x/1x/0.5x prize tiers that no contract implements. |
| — | `contracts/CONTRACTS_OVERVIEW.md`, `contracts/RIDDLEN_OWNERS_MANUAL_2025.md` | Describe an Oct 2025 redesign. They conflict with the whitepaper and with each other. |

### Where the code and the whitepaper disagree (needs an owner decision)

- **Penalty and mint split:** v5.2 says 25% burn / 25% grand prize / 25% dev-ops / 25% contributors.
  - The deployed RDLN does 50% burn / 25% grand prize / 25% dev-ops.
  - The working-tree RDLN does 0% burn / 10 / 30 / 30 / 30.
- **Winner payouts:**
  - The whitepaper splits prizes equally.
  - The code pays equal shares plus a 1.5x first solver bonus, funded from within the pool.
  - riddlen.org claims 2x/1x/0.5x tiers.
- **RON tiers:**
  - Whitepaper: Novice / Solver 1K / Expert 10K / Oracle 100K.
  - Working-tree code: Seeker 1K / Solver 10K / Validator 25K / Oracle 50K.
- **Voting:**
  - Whitepaper: a merit formula.
  - riddlen.org: 1 RON = 1 vote.
  - Working-tree code: √RON.
- **Failed-attempt penalty counter:**
  - Whitepaper: tracked per NFT.
  - Code: a global per-user counter that never resets.
- **Airdrop:**
  - Whitepaper: 2 phases (50M/50M).
  - Code: 3 phases (33M/33M/34M).

## Deployed contracts (Polygon Amoy, chain 80002)

Deployer `0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040`. **Verified on-chain 2026-09-26** (implementation
slots, bytecode sizes, layout sanity reads). There is no OpenZeppelin upgrades manifest; the upgrade
script force-imports the proxy against `contracts/mocks/deployed/`.

The official `rpc-amoy.polygon.technology` no longer resolves. Use
`https://polygon-amoy-bor-rpc.publicnode.com` (CORS-enabled) or `https://polygon-amoy.drpc.org`.
The frontends and docs were switched over; **update `AMOY_RPC_URL` in your local `contracts/.env`**.

| Proxy | Live implementation | Impl size |
|-------|---------------------|-----------|
| RDLN | `0x2f46e735f186ad07b899e5a10b25c12aa09611a3` | 31,762 B (over 24 KiB: Amoy doesn't enforce EIP-170; mainnet will) |
| RON | `0xe38cd0a815384e52076e300c16e94eb227b4e42d` | 16,397 B (matches RONAdvanced) |
| RiddleNFTAdvanced | `0x6b49d51c0c4b80977ce16afcaddf0330500a5c90` | 24,704 B |
| Airdrop | `0xea513e1d3e8b563d5480fca5cc4bccf26d4cf340` | 12,386 B |

Live game state: 0 sessions, 0 questions, 0 NFTs minted. **The game has never been played.**
The NFT holds RON's `GAME_ROLE` but **not RDLN's `GAME_ROLE`**, so mints would revert until it's
granted. The NFT holds 0 RDLN, so prizes are unfunded.

**Fork rehearsal (2026-09-26):** `scripts/upgrades/upgrade-nft-commit-reveal.js` plus
`rehearse-game-on-fork.js` upgraded the live NFT on a local fork and played a full game against the
real RDLN and RON bytecode. Winners were paid (1.5 shares and 1 share) and earned RON; the wrong
answer cost the 1,000 RDLN mint plus a 1 RDLN penalty, each charged once.

| Contract | Address | Deployed source (best evidence) |
|----------|---------|--------------------------------|
| RDLN (UUPS proxy) | `0x133029184EC460F661d05b0dC57BFC916b4AB0eB` | `RDLNUpgradeable` as committed at HEAD. The working tree changes the storage layout; **do not upgrade to it**. |
| RON (UUPS proxy) | `0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635` | **`RONAdvanced`** (`contracts/archive/contracts/reputation/`), not `RONUpgradeable`. The layouts are incompatible. |
| RiddleNFTAdvanced (UUPS proxy) | `0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3` | `RiddleNFTAdvanced` as committed at HEAD. The working-tree commit-reveal version is layout-compatible. |
| Oracle (UUPS proxy) | `0xBd005201294984eFf3c353c32c9E5a96Fd640493` | `RiddlenOracleNetwork`, impl `0xDD7431210ff102b0ff335ddd674C0938AE814BDf` |
| GroupCompositionValidator | `0xC058fdB7b4B5062EC844bF97c45bdD28bdcf6CE6` | `groups/` |
| RiddleGroupManager | `0xEBcEf4745A2514FE61f5847a1e66a9Ced0331899` | `groups/` |
| Airdrop | `0x330275259AfCeC8822A861ecbbdfD026dB1B0A13` (used by all frontends) | `RiddlenAirdrop`. Docs also list `0x8345…4d4b` and `0x4f3f…6FBA`; treat those as stale. |
| Devlog | `0x71b1544C4E0F8a07eeAEbBe72E2368d32bAaA11d` | `RiddlenDevlog` (claimed only in CLAUDE.md) |
| RDLN on Polygon **mainnet** | `0x683e52ec4a0dF61345172395b700208dd7ACcA53` | A Thirdweb ERC20, not Riddlen source |

To verify the implementation behind a proxy:
```bash
cast storage <proxy> 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc \
  --rpc-url https://rpc-amoy.polygon.technology
cast code <implementation> --rpc-url https://rpc-amoy.polygon.technology | wc -c
```

### Live upgrade — 2026-09-26

RiddleNFTAdvanced was upgraded to the commit-reveal implementation and set up for play:

| Step | Result |
|------|--------|
| Upgrade | implementation `0x6b49…5c90` → `0xbf6e16a613f740eccaa6f7b51c03cbbc9c30cfd2` (23,697 B); state verified unchanged |
| RDLN `GAME_ROLE` → NFT | tx `0x6984faad74394fb2bbd189b0a0fbf17a899d2ca96b1753c8798c1a3fc4f85549` (block 48640916) |
| Prize funding: 10,000,000 RDLN minted to NFT | tx `0x85ae4c614fac1cfee05f032f8111532b4e51abe472aab41107bfab23259db210` (block 48640918) |

The OpenZeppelin manifest for this proxy is `contracts/.openzeppelin/unknown-80002.json` (gitignored;
back it up). **Players still need a UI:** riddlen.com's game screen doesn't implement commit/reveal yet.

## Frontends

| App | Path | Domain | Status |
|-----|------|--------|--------|
| Main site | `frontend/` (Next 14, wagmi v2) | riddlen.com | Live. The game UI is broken: it sends the raw answer string as bytes32, and its ABI doesn't match the deployed NFT. |
| Staging | `frontend-staging/` | staging.riddlen.com | Near-copy of `frontend/`. **Build the commit-reveal UI here first.** |
| Frames | `riddlen-frames/` | frames.riddlen.com | Read-only apart from minting; the ABI needs updating. |
| Devlog | `riddlen-devlog/` | devlog.riddlen.com | Devlog contract only |
| Docs | `docs/` (Jekyll) | riddlen.org | Examples use the removed `submitAnswer`; needs a commit-reveal update. |
| riddlen-frontend | separate repo `RiddlenBaba/riddlen-frontend` | none | Stub (thirdweb v4). Not used. |
| riddlen-frontend-old | separate repo `RiddlenBaba/riddlen-frontend-old` | none | Old Vite site with a mocked quiz. `riddlen-backend/` is a Sep 30 2025 snapshot of this monorepo. |

## Imported material

`research/external/abbababa-site/`: public AbbaBaba blog posts and the marketing page about Riddlen.
