---
layout: default
title: "Mainnet, airdrop, gasless"
description: "What changes between the testnet hunt and mainnet: the commitments made real, how people get RDLN, how the airdrop is spent, how play becomes gasless, and how the house shrinks."
permalink: /roadmap/
redirect_from:
  - /airdrop.html
  - /airdrop-guide.html
  - /governance.html
  - /archive/2025/airdrop.html
  - /archive/2025/governance.html
---

# Mainnet, airdrop, gasless

The hunt runs on the Polygon Amoy testnet today, and the testnet is where the game gets played
and argued with before anything is worth money. This page is what has to happen between here
and mainnet, and the plan for the three questions that decide whether mainnet works: how people
get RDLN, how the airdrop is spent, and how someone who scans a sticker is playing within a
minute without knowing what gas is.

## Before mainnet

In the order they must happen:

1. **The map and the prize.** The real map is split into a thousand fragments once, offline; only
   its root goes on chain. The grand prize is chosen, its location sealed as a hash on chain and
   in full with a successor who can open it if the founder cannot. Nothing about the hunt can be
   trusted in year fifteen unless this is checkable in year one.
2. **A keyless grand prize wallet.** A contract, not an address, receives the quarter of every
   payment that funds the prize.
3. **The schedule.** The minimum time between releases set to the real cadence, about a week,
   and a sealed reserve of riddles so the schedule survives a bad month.
4. **Verifiable randomness** for the NFT count roll, Chainlink VRF or equivalent, so nobody can
   influence how many NFTs a riddle gets.
5. **A successor house.** A person or a multisig who can release riddle 500 if the founder
   cannot, before any DAO exists.
6. **Legal review** of the placement rules in each jurisdiction where caches go, and of
   pay-to-attempt with a prize for skill.
7. **A slimmer token.** The RDLN contract is 30.9 KiB, over the mainnet limit.
8. **The open decisions** in the whitepaper: the guess step, the ticker, more finders before the
   first release on large pots, several caches per riddle.

## How people get RDLN on mainnet

**A starter dose.** The sticker promise stays true: a new player gets enough RDLN for a first
ticket and a few guesses, from the airdrop allocation, once. On the testnet the faucet is one
claim per wallet; on mainnet wallets are free to create, so the dose needs a cost that bots feel
and people don't. The plan is one dose per verified human, using the humanity gate already in
the repository (a signed pass from a service that checks World ID or a similar proof), with a
plain per-wallet fallback where verification isn't available. The dose is small enough that
farming it isn't worth the verification.

**Earn it.** Find riddles. Pots come from the 700M prize-pool allocation, released to the hunt
contract as riddles are released, so the pool lasts the twenty years. Later, write riddles and be
paid from the riddles' own sales.

**Buy it.** The 100M liquidity allocation seeds a market, and the liquidity quarter of every
payment deepens it from then on. No presale.

## The airdrop

The 100M airdrop allocation is not a snapshot drop. It is spent three ways, each rewarding the
behaviour the game needs:

| Use | Share | Mechanism |
|---|---|---|
| Starter doses | about 40M | One dose per verified human, on the Free Riddlen page |
| Merit drops | about 40M | Periodic distributions to RON holders in proportion to RON. RON cannot be bought or transferred and is earned only by finding, so this reaches only people who played |
| Early finders | about 20M | Bonuses on the first riddles found on mainnet, while the board is new |

The 2025 design had a social-proof phase (follow, join, post). It is gone. Social proof is the
easiest thing in the world for a bot.

## Gasless play

Someone always pays gas: validators are paid in POL. "Gasless" means the player never has to
think about it. Three shapes, from simplest to largest:

**The player pays in RDLN.** A paymaster accepts RDLN from the player and pays the POL itself.
The player holds one token, never buys gas, and the house is not out of pocket. On Polygon a
transaction costs a fraction of a cent, so the RDLN charged can be tiny and can take the four-way
split like every other payment. This is the preferred shape.

**The house sponsors.** A relayer pays gas for calls to the hunt contract, rate-limited per
address, funded from the treasury quarter. Cheap at testnet scale, and the repository already
holds a forwarder and gasless manager from 2025; the hunt contract would need `ERC2771Context`.

**Wallets people don't have to install.** For the sticker crowd, a passkey-backed smart account
created in the browser with Face ID or a fingerprint, plus a paymaster policy ("only calls to
the hunt, at most N per hour"). The account is theirs and works on any device with the same
passkey.

An app chain with RDLN as the gas token is possible if volume ever justifies it. Not before the
game has players.

## Shrinking the house

The house releases riddles and hides caches. Everything else on chain runs without it, and the
steps that make even that matter less are in the whitepaper, section 10: proposals from RON
holders, review without the founder, then a DAO holding the prize wallet, the sealed reserve and
the successor process. RON accrues from every find on the testnet today, so the first candidates
for authorship are already being counted.
