---
layout: default
title: "Playing the hunt (testnet)"
description: "How the hunt works as deployed on Polygon Amoy: buy a riddle NFT, solve it, go to the place, scan the code, claim, collect. Fees, shares, addresses and the cryptography."
permalink: /hunt/
---

# Playing the hunt

The hunt is Riddlen v2, running on the Polygon Amoy testnet since 2026-09-27 alongside the
first game. The design is on [The hunt](/next/); this page is what the contract does today and
how to play it. Everything here is enforced by `RiddlenHunt`, not by the site.

Play at [riddlen-staging.vercel.app/hunt](https://riddlen-staging.vercel.app/hunt) while it is
in testing. Testnet tokens: no value.

## The loop

| Step | Who | What | Costs |
|---|---|---|---|
| Release | The house | Posts the riddle text, sealed answer roots, the address of a key hidden at a place, the location clue encrypted with the answer, and this riddle's map fragment encrypted with a secret that exists only at the place. Reserves the pot. | — |
| Open | Anyone, 10 blocks later | Rolls how many NFTs exist for it from a future block hash. Half of riddles get 10 to 50, a quarter 50 to 200, a fifth 200 to 600, one in twenty 600 to 1,000. | gas |
| Buy | You | Mint an NFT. It is the right to attempt this riddle. | the mint price, through the token's split |
| Check | You | Type an answer. Your browser hashes it slowly and checks it against the sealed roots. Nothing is sent. | free |
| Submit | You | Record the answer on chain for that NFT. Right or wrong, it is charged. The right one unlocks the location for that NFT. | 1 RDLN, then 2, then 3… per NFT |
| Go | You | Read the location clue (decrypted in your browser with the answer) and go there. | shoes |
| Claim | You, at the place | Scan the code. It holds a key that signs your claim in the browser and is never sent anywhere. The signature is bound to your NFT and your wallet. | 5 RDLN |
| Settle | Anyone, 14 days after the first claim | Fixes the shares. No loops, so it cannot get too big to run. | gas |
| Collect | Anyone, per claimed NFT | Books the share to whoever holds that NFT now, and awards RON once the riddle has two finders. | gas |
| Withdraw | You | Pulls everything you are owed, from every riddle, in one transaction. | gas |

Nothing expires. A riddle nobody finds keeps its pot. Every counter is on the NFT, not the
wallet: sell an NFT after 20 tries and the buyer's next try costs 21; sell one that is solved
and the buyer can claim.

## The numbers as deployed

| Setting | Value | Fixed? |
|---|---|---|
| Mint price at launch | 100 RDLN, halving every 730 days | fixed in `HuntCommitments` |
| Riddles in the hunt | 1,000 | fixed |
| Pot by difficulty | 10,000 / 25,000 / 60,000 / 150,000 RDLN | tunable, snapshotted per riddle at release |
| Attempt step | 1 RDLN per NFT per try | tunable, snapshotted |
| Claim fee | 5 RDLN | tunable, snapshotted |
| First finder | 50% of the pot | tunable, snapshotted |
| Finisher window | 14 days after the first claim; finishers split the other 50% equally | tunable, snapshotted |
| Blocks before open | 10 | tunable |

Every RDLN payment in the hunt goes through the token's game protocol: 25% burned, 25% to the
grand prize wallet, 25% to the treasury, 25% to the liquidity reserve. On this testnet the grand
prize and treasury wallets are the deployer's address and the liquidity reserve is
`0xa9Cd5a6b1726436d144dF0FF583Ff72a7CF05abD`; on mainnet the grand prize wallet is a contract
nobody holds keys to. The token was upgraded to this split on 2026-09-27 (implementation
`0xe5A4e3EbaE1878b860cC440744442D5718Beb014`, `protocolVersion() == 2`).

## What is committed and cannot change

`HuntCommitments` is a plain contract with immutables and no owner:

| | Amoy |
|---|---|
| `mapRoot` | `0xaf55cae06f4edef4903243be02eade25e9cccd2a7ae283f7e356e24111b926dd` (placeholder map) |
| `prizeCommitment` | `0x9da21311e3a6599dc963a6c39d8cb45b4c76c6c14fa75bdbf3f1ce929f310528` (placeholder) |
| `launchAt` | 2026-09-27 |
| `basePrice` | 100 RDLN |
| `halvingPeriod` | 730 days |
| `totalRiddles` | 1,000 |

The testnet map and prize are placeholders. Before mainnet the real map is split into 1,000
fragments once, offline, and only its root goes on chain; the prize location is sealed with a
successor.

## Addresses (Polygon Amoy)

| Contract | Address |
|---|---|
| RiddlenHunt (UUPS proxy) | [`0x18aDc55283A50CdE6BEbC4C76Eb6517010151902`](https://amoy.polygonscan.com/address/0x18aDc55283A50CdE6BEbC4C76Eb6517010151902) |
| HuntNFT (UUPS proxy, ERC-721 "HUNT") | [`0xC80347a45e674Ea318a384C510a4d22279D818Be`](https://amoy.polygonscan.com/address/0xC80347a45e674Ea318a384C510a4d22279D818Be) |
| HuntCommitments (immutable) | [`0x9094f32D38C5a6a5993C2b7308ee398EBf8fcC19`](https://amoy.polygonscan.com/address/0x9094f32D38C5a6a5993C2b7308ee398EBf8fcC19) |

RDLN and RON are the same tokens as the first game; the hunt holds `GAME_ROLE` on both.

## How the cryptography works

**The answer never goes on chain.** For each accepted answer the house computes
`H = PBKDF2-SHA256(canonical answer, salt = chainId‖hunt‖riddleId, 600,000 rounds)`. The slow
hash is deliberate: checking a guess offline is always possible on a public chain, so each
guess is made to cost real compute. From `H` the house builds a 1,024-leaf Merkle tree whose
leaf at position `i` is `keccak256(abi.encode(riddleId, i, H))`, and stores the root. Up to
eight accepted answers give up to eight roots; unused slots hold random roots so the count
does not show.

**A proof works for one NFT only.** NFT number `i` on a riddle submits its own leaf and the ten
siblings from position `i` to the root. The contract recomputes the root positionally, so the
calldata of a solved NFT cannot be replayed by another NFT, and a leaf reveals nothing about
`H`.

**The location is encrypted with the answer.** The location clue is sealed under a random key,
and that key is wrapped once per accepted answer with a key derived from `H`. Whoever knows any
accepted answer can read the clue in the browser; nobody else can.

**The place holds a key.** The code hidden at the place is `riddlen://cache?v=1&r=<riddle>&k=<signing key>&s=<fragment secret>`.
To claim, the browser signs EIP-712 `Claim(uint256 riddleId,uint256 tokenId,address owner)`
under the hunt's domain with that key and sends only the signature. The key is never on chain,
so the fragment secret next to it stays private to people who stood there. A destroyed or
stolen cache can be re-keyed by the house; the answer roots never change.

**The map fragment** for a riddle is sealed under a key derived from the fragment secret and
stored as a hash on chain, with the full ciphertext in the release event. `verifyFragment`
checks any revealed fragment against the committed `mapRoot`.

The reference implementation of all of this is `contracts/scripts/hunt/lib/huntCrypto.js`,
kept identical to `web/lib/hunt.js` by a cross-check test.

## For the house

```bash
cd contracts
PLACEHOLDER=yes node scripts/hunt/mapmaker.js                 # once per hunt; real map: MAP=<file> PRIZE_LOCATION="…"
CONFIRM=yes npx hardhat run scripts/hunt/deploy.js --network amoy
CONFIRM=yes RIDDLE=riddle.json npx hardhat run scripts/hunt/release.js --network amoy   # prints the QR to hide
CONFIRM=yes npx hardhat run scripts/hunt/cron.js --network amoy    # opens and settles; also .github/workflows/hunt-cron.yml
npx hardhat run scripts/hunt/status.js --network amoy
./scripts/hunt/rehearse-local.sh                                    # the whole loop on a local node
```

Secrets (answers, cache keys, fragment secrets, the map) live in `contracts/game-master/hunt/`,
which is never committed. Losing a riddle's file means its cache cannot be reprinted.

## Placement rules

Every hide follows the rules on [The hunt](/next/#in-the-world): public, reachable and legal
places, nothing buried, nothing near infrastructure, photo proof at placement, a maintenance
duty on the hider. Nobody should ever be hurt looking for a riddle.
