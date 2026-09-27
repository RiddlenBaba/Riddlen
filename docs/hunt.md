---
layout: default
title: "Playing the hunt"
description: "How the hunt works as deployed on Polygon Amoy: buy a riddle NFT, guess, go to the place, scan the code, get your share when the next person finds it. Fees, shares, addresses, the cryptography and the house tooling."
permalink: /hunt/
redirect_from:
  - /play/
  - /game-master/
  - /quick-start.html
  - /faq.html
  - /how-it-works.html
---

# Playing the hunt

The hunt runs on the Polygon Amoy testnet. The design is the [whitepaper](/whitepaper/); this
page is what the contract does today and how to play it. Everything here is enforced by
`RiddlenHunt`, not by the site. Play at [riddlen.com](https://riddlen.com). Testnet tokens have
no value.

## Getting set up

1. **A wallet.** Any browser or phone wallet that speaks Ethereum: MetaMask, Rabby, Coinbase
   Wallet. The site asks it to switch to Polygon Amoy.
2. **A little test POL for gas.** The [Free Riddlen](https://riddlen.com/free) page sends some,
   or use [Polygon's faucet](https://faucet.polygon.technology/).
3. **Some RDLN.** The same page gives every wallet 500 RDLN once.

## The loop

| Step | Who | What | Costs |
|---|---|---|---|
| Release | The house | Posts the riddle text, the sealed answer roots, the address of a key hidden at a place, the location clue encrypted with the answer, and this riddle's map fragment encrypted with a secret that exists only at the place. Reserves the pot. | — |
| Open | Anyone, 10 blocks later | Rolls how many NFTs exist from a future block hash: half of riddles get 10 to 50, a quarter 50 to 200, a fifth 200 to 600, one in twenty 600 to 1,000. Fixes the price and the share schedule. | gas |
| Buy | You | Mint an NFT: your right to attempt this riddle. | 20% of the pot per NFT, floored, through the split |
| Guess | You | Submit an answer on chain for that NFT. Charged right or wrong; the chain tells you which. Spelling, case and articles don't matter; the words do. | 2% of the ticket price for the first guess, 4% for the second, 6% for the third… |
| Go | You | The right answer lets your browser decrypt the location clue. Go there. | shoes |
| Find | You, at the place | Scan the code and leave it. It holds a key that signs your claim in the browser and is never sent anywhere. Your share is booked by your finishing rank, RON is awarded, your map fragment is revealed, and an earlier finder's share is released. | 5 RDLN |
| Withdraw | You | Pull everything you are owed, from every riddle, in one transaction. | gas |

Nothing expires. A riddle nobody completes keeps its pot. A finder nobody follows waits with
their share booked. Every counter is on the NFT, not the wallet: sell an NFT after 20 tries and
the buyer's next try costs 21; sell one that has found and its unreleased share goes to the new
holder when it is released.

## What you are paid

The k-th finder on a riddle with N NFTs gets `pot × (1/k) ÷ (1 + 1/2 + … + 1/N)`. First finder on
a 12-NFT riddle: 32% of the pot. On 100: 19%. On 800: 14%. Every finder gets something; the pot
is exactly emptied if every NFT finds it. The full table is on [Tokenomics](/tokens/#4-pots-and-shares).

Your share is **released when enough people find it after you**: one more on Easy and Medium
riddles, two on Hard, three on Legendary. Completion releases everyone still waiting. That is
why the code stays where you found it. The dashboard shows what is pending and what is ready to withdraw.

## The numbers as deployed

| Setting | Value | Fixed? |
|---|---|---|
| Pot by difficulty | 10,000 / 25,000 / 60,000 / 150,000 RDLN | tunable, snapshotted per riddle at release |
| Mint price | 20% of the pot divided by the NFT count, never below the floor | the 20% is tunable, snapshotted |
| Price floor | 10 RDLN at launch, halving every 730 days | fixed in `HuntCommitments` |
| Guess step | 2% of the ticket price; the k-th guess on an NFT costs k steps | tunable, snapshotted |
| Finders before a release | 1 / 1 / 2 / 3 by difficulty | tunable, snapshotted |
| Claim fee | 5 RDLN | tunable, snapshotted |
| Blocks before open | 10 | tunable |
| Riddles in the hunt | 1,000 | fixed |

Every payment goes through the token's split: 25% burned, 25% grand prize, 25% treasury, 25%
liquidity reserve. See [Tokenomics](/tokens/).

## What is committed and cannot change

`HuntCommitments` is a plain contract with immutables and no owner:

| | Amoy |
|---|---|
| `mapRoot` | `0xaf55cae06f4edef4903243be02eade25e9cccd2a7ae283f7e356e24111b926dd` (placeholder map) |
| `prizeCommitment` | `0x9da21311e3a6599dc963a6c39d8cb45b4c76c6c14fa75bdbf3f1ce929f310528` (placeholder) |
| `launchAt` | 2026-09-27 |
| `basePrice` (the floor) | 10 RDLN |
| `halvingPeriod` | 730 days |
| `totalRiddles` | 1,000 |

Before mainnet the real map is split once, offline, and only its root goes on chain; the prize
location is sealed with a successor.

## Addresses (Polygon Amoy)

| Contract | Address |
|---|---|
| RiddlenHunt (UUPS proxy) | [`0xa5a36d589B122d0306FEEa7422e3c7f7d8edf009`](https://amoy.polygonscan.com/address/0xa5a36d589B122d0306FEEa7422e3c7f7d8edf009) |
| HuntNFT (UUPS proxy, ERC-721 "HUNT") | [`0x992eDCea80fb82dEa0B05bD749938f6c3A0fA782`](https://amoy.polygonscan.com/address/0x992eDCea80fb82dEa0B05bD749938f6c3A0fA782) |
| HuntCommitments (immutable) | [`0x3af3f98189c8622Db6E03105932652C78bAeD1D1`](https://amoy.polygonscan.com/address/0x3af3f98189c8622Db6E03105932652C78bAeD1D1) |

RDLN and RON are on [Contracts](/contracts/); the hunt holds the game role on both.

## How the cryptography works

**The answer never goes on chain.** For each accepted answer the house computes a deliberately
slow hash, `H = PBKDF2-SHA256(canonical answer, salt = chainId‖hunt‖riddleId, 600,000 rounds)`.
From `H` it builds a 1,024-leaf Merkle tree whose leaf at position `i` is
`keccak256(riddleId, i, H)`, and stores the root. Up to eight accepted answers give up to eight
roots; unused slots hold random roots so the count does not show.

**A proof works for one NFT only.** NFT number `i` submits its own leaf and the ten siblings from
position `i` to the root. The contract recomputes the root positionally, so a solved NFT's
calldata cannot be replayed by another NFT, and a leaf reveals nothing about `H`.

**Guessing offline is possible, and priced in compute.** Anything a public contract can verify,
a script can verify on a laptop without paying. The site never offers that; every guess it sends
costs RDLN. The slow hash makes the offline route cost real seconds per candidate instead. The
money and the finding are untouched by it: nobody can skip the NFT, the claim, or standing at the
place.

**The location is encrypted with the answer.** The clue is sealed under a random key, wrapped
once per accepted answer. Whoever knows any accepted answer can read it in the browser; nobody
else can.

**The place holds a key.** The code hidden at the place is
`riddlen://cache?v=1&r=<riddle>&k=<signing key>&s=<fragment secret>`. To claim, the browser signs
`Claim(riddleId, tokenId, owner)` under the hunt's EIP-712 domain with that key and sends only the
signature. The key never touches the chain, so the fragment secret next to it stays private to
people who stood there. A destroyed cache can be re-keyed by the house and re-hidden; the answer
roots never change and existing claims stand.

**The map fragment** is sealed under a key derived from the fragment secret and stored as a hash
on chain, with the full ciphertext in the release event. `verifyFragment` checks any revealed
fragment against the committed map root.

The reference implementation is `contracts/scripts/hunt/lib/huntCrypto.js`, kept identical to
`web/lib/hunt.js` by a cross-check test. The full contract surface is on
[For developers](/developers/).

## For the house

```bash
cd contracts
PLACEHOLDER=yes node scripts/hunt/mapmaker.js                       # once per hunt; real map: MAP=<file> PRIZE_LOCATION="…"
CONFIRM=yes npx hardhat run scripts/hunt/deploy.js --network amoy
CONFIRM=yes RIDDLE=riddle.json npx hardhat run scripts/hunt/release.js --network amoy   # prints the QR to hide
CONFIRM=yes npx hardhat run scripts/hunt/cron.js --network amoy      # opens released riddles; also .github/workflows/hunt-cron.yml
npx hardhat run scripts/hunt/status.js --network amoy
./scripts/hunt/rehearse-local.sh                                      # the whole loop on a local node
```

Secrets (answers, cache keys, fragment secrets, the map) live in `contracts/game-master/hunt/`,
which is never committed. Losing a riddle's file means its cache cannot be reprinted. The
placement checklist is `research/HUNT_GENESIS.md` in the repository.

## Placement rules

Every hide follows the rules in the [whitepaper](/whitepaper/#11-in-the-world): public,
reachable and legal places, nothing buried, nothing near infrastructure, photo proof at
placement, a maintenance duty on the hider. Nobody should ever be hurt looking for a riddle.
