---
layout: default
title: "RDLN and RON"
description: "The two Riddlen tokens as deployed: RDLN, the game token, and RON, non-transferable reputation."
permalink: /tokens/
redirect_from:
  - /tokenomics.html
  - /tokenomics-deep.html
  - /archive/2025/guides/tokenomics.html
  - /archive/2025/guides/burning-protocol.html
  - /archive/2025/contracts/RDLN-Contract-Specification.html
  - /archive/2025/contracts/RON-Reputation-System.html
---

# RDLN and RON

Two tokens, deployed on Polygon Amoy. The numbers here are read from the deployed contracts, not
from a whitepaper.

## RDLN

RDLN is what you enter with and get paid in. Total supply is 1,000,000,000, minted by allocation:

| Allocation | Amount | Purpose |
|---|---|---|
| Prize pool | 700,000,000 (70%) | Funds riddle pots. Minted to game contracts as needed. |
| Airdrop | 100,000,000 (10%) | Distribution to players. Funds the testnet faucet today. |
| Treasury | 100,000,000 (10%) | Operations, released on a schedule. |
| Liquidity | 100,000,000 (10%) | Markets, when there are any. |

### Burns

RDLN is designed to shrink as it is played:

- **Game protocol burns.** Every mint, every guess and every claim in the hunt goes through the token's game
  functions: 25% burned, 25% to the grand prize wallet, 25% to the treasury, 25% to the
  liquidity reserve (`0xa9Cd5a6b1726436d144dF0FF583Ff72a7CF05abD` on Amoy). Until 2026-09-27 the
  split was 50/25/25 with no liquidity share; the token was upgraded in place to change it.
- **Failed attempts.** A wrong or unrevealed guess burns 1 RDLN the first time, 2 the second,
  and so on per NFT in the hunt, through the same four-way split.
- **Riddle submissions.** When players can submit riddles, the stake is 1 RDLN, then 2, then 3, per wallet.
- **Transfer burn.** The token can burn 1% of every ordinary transfer. It is a switch the admin
  controls.
- **Limits.** No single burn above 1,000,000 RDLN and no more than 10,000,000 per day.

### Testnet

On Amoy RDLN has no value. The faucet hands each wallet 500 RDLN once, from the airdrop
allocation. The game contract holds 1,000,000 RDLN for pots.

## RON

RON is reputation. It cannot be transferred or bought. You earn it by finding: every claim on
the hunt awards it. Over time it is the key to authorship: proposing riddle pieces, reviewing them,
and eventually sitting as the house (whitepaper, section 10). Today it is a score. The deployed RON contract is the
an author, or by solving riddles correctly, and the amount scales with difficulty. It carries
tier names (Seeker, Solver, Validator, Oracle) and is meant to gate future roles: validating
riddles, disputing a panel result, voting. Today it is a score. The deployed RON contract is the
one from 2025, unchanged, and awards go through its normal game interface.

## Where the value comes from

Nothing here creates value by itself. The bet is that a growing hunt across the real world
solve, and the people who write and solve them, is worth something: to players as a game, and to
anyone who needs proof of what people can still do that models can't. RDLN is the unit that
routes money to those people. See [Mainnet, airdrop, gasless](/roadmap/) for how it gets there.
