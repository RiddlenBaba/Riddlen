---
layout: default
title: "Tokenomics: RDLN and RON"
description: "Where every RDLN comes from and goes: the billion-token supply and its allocations, the four-way split on every payment, what the hunt charges, how pots are shared, what the burn adds up to, and RON reputation."
permalink: /tokens/
redirect_from:
  - /tokenomics.html
  - /tokenomics-deep.html
  - /archive/2025/guides/tokenomics.html
  - /archive/2025/guides/burning-protocol.html
  - /archive/2025/contracts/RDLN-Contract-Specification.html
  - /archive/2025/contracts/RON-Reputation-System.html
---

# Tokenomics

Two tokens. **RDLN** is the money of the hunt: what you buy riddles with, guess with, and are
paid in. **RON** is reputation: earned by finding, never transferable, the key to authorship.
Every number on this page is read from the deployed contracts on Polygon Amoy. Where the
testnet differs from the mainnet plan, it says so.

## 1. Supply and allocations

One billion RDLN exist. They are minted by allocation, each with its own cap in the token:

| Allocation | RDLN | Share | What it does |
|---|---|---|---|
| Prize pool | 700,000,000 | 70% | Funds riddle pots. Minted to the hunt contract as pots are needed, never all at once. |
| Treasury | 100,000,000 | 10% | Runs the game. Released to operations at most 1,000,000 a month. |
| Airdrop | 100,000,000 | 10% | Starter doses and merit drops (see [the roadmap](/roadmap/)). Funds the testnet faucet today. |
| Liquidity | 100,000,000 | 10% | Seeds the market once there is one. No presale. |

Nothing outside these allocations can be minted. The token's contract enforces the caps.

## 2. The four-way split

Every RDLN payment made inside the game goes through one function of the token, and that
function splits it the same way every time:

| Quarter | Goes to | Why |
|---|---|---|
| 25% | Burned | Gone from supply, forever |
| 25% | Grand prize wallet | The RDLN side of the prize at the end of the hunt |
| 25% | Treasury | Running the game |
| 25% | Liquidity reserve | Paired with the other side of a pool by the treasury, on a schedule, so a share is worth something |

This applies to every mint, every guess and every claim. Nothing is refunded. The split was
50% burn / 25% / 25% until 2026-09-27, when the token was upgraded in place to add the liquidity
quarter; the reason is in section 6.

On Amoy the grand prize wallet and the treasury are the deployer's address, and the liquidity
reserve is `0xa9Cd5a6b1726436d144dF0FF583Ff72a7CF05abD`. On mainnet the grand prize wallet is a
contract nobody holds keys to.

## 3. What the hunt charges

| Payment | Amount | Set by |
|---|---|---|
| Buy an NFT | 20% of the riddle's pot divided by its NFT count, never below the floor | The 20% is a tunable, snapshotted per riddle. The floor is fixed: 10 RDLN at launch, halving every two years. |
| Guess | 1 RDLN, then 2, then 3… on that NFT, right or wrong | Tunable step, snapshotted per riddle. A per-riddle scaling of the step is under discussion. |
| Claim (the scan at the place) | 5 RDLN | Tunable, snapshotted per riddle |
| Submit a riddle (later phase) | 1, 2, 3… RDLN per wallet | Not live |

Worked examples at today's pots:

| Riddle | Pot | NFTs | Ticket price | Ticket's share of pot if solved first |
|---|---|---|---|---|
| Easy, scarce | 10,000 | 12 | 167 | 32% |
| Easy, crowded | 10,000 | 800 | 10 (floor) | 14% |
| Legendary, scarce | 150,000 | 12 | 2,500 | 32% |
| Legendary, crowded | 150,000 | 800 | 37.5 | 14% |

The counters live on the NFT, not the wallet. A hundred NFTs on one riddle are a hundred
independent guess ladders, and the ladder travels with the token when it is sold.

## 4. Pots and shares

Each riddle's pot is set by its difficulty and reserved from the hunt contract's balance when
the riddle is released. It belongs to that riddle for as long as the riddle stands.

| Difficulty | Pot (testnet) |
|---|---|
| Easy | 10,000 RDLN |
| Medium | 25,000 RDLN |
| Hard | 60,000 RDLN |
| Legendary | 150,000 RDLN |

On a riddle with N NFTs, the k-th finder's share of the pot is

    share(k) = pot × (1 / k) ÷ (1 + 1/2 + 1/3 + … + 1/N)

so that if every NFT finds it the pot is exactly emptied. Every finder is paid; earlier finders
are paid more; scarce riddles pay their first finder far more than crowded ones.

| NFTs | 1st finder | 2nd | 10th | last |
|---|---|---|---|---|
| 12 | 32.2% | 16.1% | 3.2% | 2.7% |
| 50 | 22.2% | 11.1% | 2.2% | 0.45% |
| 100 | 19.3% | 9.6% | 1.9% | 0.19% |
| 800 | 13.8% | 6.9% | 1.4% | 0.02% |

A share is booked at the scan and **released when the next finder scans**; the last finder is
released when the riddle completes. A share that is booked but not yet released belongs to
whoever holds the NFT when it is released. Nothing expires: a riddle nobody finishes keeps its
pot, and a finder nobody follows waits with their share booked.

If all 1,000 riddles are released at the testnet pot mix, the pots total about 29,000,000 RDLN,
4% of the prize-pool allocation. Pots can be raised without touching anything else.

## 5. Where the money goes over the hunt

Simulated over the full thousand riddles with the deployed pricing, the random NFT counts, and
the 10 RDLN floor halving every two years:

| Scenario | Through the split | Burned | Share of supply | Grand prize | Liquidity |
|---|---|---|---|---|---|
| Quiet: 30% of NFTs sell, 1.2 guesses each | 1.8M | 0.46M | 0.05% | 0.46M | 0.46M |
| Busy: 80% sell, 2 guesses each, 4 finders | 5.1M | 1.27M | 0.13% | 1.27M | 1.27M |

Against pots of about 29M paid out. The burn is real and permanent, but at these pot sizes it is
small against a billion-token supply. Two things follow, and both are already in the design:

- **The pot is the lever.** Because the ticket price is a fifth of the pot per NFT, mint volume
  scales with the pots. Raise the pots and every quarter of the split, including the burn,
  rises with them.
- **A share needs a market.** Burning tokens does not give a finder anything to do with a share.
  The liquidity quarter does. That is why the split changed from 50/25/25 to four quarters.

## 6. Why the split changed

Under the old 50% burn, the same simulation burned about 0.1% to 0.2% of supply over twenty years
and built no market at all. Moving 25 points from burn to a liquidity reserve costs almost
nothing in scarcity and buys the thing a prize denominated in RDLN cannot do without. The reserve
holds RDLN only; the treasury pairs it with POL or a stable and adds liquidity on a schedule.

## 7. Limits and switches in the token

- No single game payment above 1,000,000 RDLN and no more than 10,000,000 through the split per
  day, across every game contract. A launch-day rush can hit the daily cap; the site says so.
- The token can burn 1% of every ordinary transfer. The switch is off.
- The token can be paused by its admin, which pauses every game payment and withdrawal. It never
  has been.
- Game payments need no approval: the game contract charges the player directly, and only
  contracts holding the token's game role can do so. Two hold it today, the hunt and the retired
  first game.

## 8. RON

RON is reputation. It cannot be transferred, approved or bought; the token reverts on every
attempt. It is minted only by contracts holding its game role, and only when someone finds.

| Tier | RON held |
|---|---|
| Observer (Novice) | 0 to 999 |
| Participant (Solver) | 1,000 to 9,999 |
| Delegate (Expert) | 10,000 to 99,999 |
| Senator (Oracle) | 100,000 and up |

Today every find awards a flat 100 RON, the deployed contract's placeholder amount, so the tiers
are far off for everyone; the thresholds are set to be lowered as the network proves itself. The
tiers are what the [whitepaper](/whitepaper/#10-how-riddles-are-made) hands rights to: proposing
riddle pieces, reviewing them, and eventually sitting as the house. The airdrop's merit drops
are proportional to RON, so they can only reach people who played.

## 9. Testnet versus mainnet

| | Amoy today | Mainnet plan |
|---|---|---|
| RDLN value | none | a market seeded from the liquidity allocation and fed by the liquidity quarter |
| Grand prize wallet | deployer address | keyless contract |
| Treasury and liquidity reserve | deployer and a plain wallet | multisig, then DAO |
| Faucet | 500 RDLN per wallet | one starter dose per verified human |
| Pots | 10k / 25k / 60k / 150k | to be set against the market |
| Map and prize commitments | placeholders | real, sealed with a successor |
| RON per find | flat 100 | scaled by difficulty and rank |
| Token contract | 30.9 KiB, over the mainnet size limit | slimmed before deployment |

Addresses are on [Contracts](/contracts/).
