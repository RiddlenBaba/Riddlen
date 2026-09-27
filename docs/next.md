---
layout: default
title: "The next rules (v2)"
description: "Riddlen v2, as designed and not yet built: riddles that stand until solved, seats you buy and trade, attempts that cost more each time, random pots with jackpots."
permalink: /next/
---

# The next rules

This is the game as designed on 2026-09-27 and **not yet built**. The live game follows
[Rules and payouts](/rules/). Read this to know where it is going, and argue with it.

## Why change

The live game gives every riddle a deadline, usually a day. With few players, a riddle closes
unsolved, the author's stake is gone, and nobody is paid. That punishes the people we most want:
writers. v2 lets a riddle stand, brings back the original Riddlen idea that the riddle and the
right to attempt it are things you own, and keeps everything v1 got right: riddles written by
people, the machines going first and gating the payout, sealed answers, reputation, burns.

## The riddle is a thing you own

You write a riddle, list up to eight accepted answers (sealed), pick a difficulty, and pick how
long it stands: **7 days, 30 days, 90 days, or until solved** (180 days at most). Submitting
mints the **riddle NFT** to you. It carries the riddle text and, later, the machines' guesses and
the names of the people who beat them. It is transferable: whoever holds it when the riddle
settles is paid the author's share.

The stake is unchanged: 1 RDLN for your first riddle, 2 for the next, 3 for the next, burned
through the token's game protocol, never returned.

## The machines go first

Unchanged. Claude, GPT and Gemini each try the riddle twice; every distinct guess is sealed on
chain before the riddle opens. If any of them had it, the author earns nothing.

## Seats: the right to attempt

When the riddle opens, the contract **rolls how many seats exist**, from 10 to 1,000, weighted
so most riddles are scarce:

| Seats | Share of riddles |
|---|---|
| 10 to 50 | 50% |
| 50 to 200 | 25% |
| 200 to 600 | 20% |
| 600 to 1,000 | 5% |

A seat is an NFT. You buy it for the difficulty's seat price (10, 25, 50 or 100 RDLN). Half of
every seat sale goes into that riddle's pot; the other half goes through the game burn. Seats
are transferable: if a riddle stands unsolved for months, a seat on it is worth what someone
will pay for one of forty remaining chances at something the machines provably failed.

Your first attempt comes with the seat. Each further attempt on the same seat costs 1 RDLN,
then 2, then 3, and so on, burned. A bot spraying guesses pays a rising price on a capped
number of seats. A person who thinks hard rarely needs a third try.

## Pots: random, with jackpots

The difficulty sets the base pot: 10,000 / 25,000 / 60,000 / 150,000 RDLN. When the riddle
opens, a multiplier is rolled:

| Multiplier | Share of riddles |
|---|---|
| ×1 | 70% |
| ×2 | 20% |
| ×5 | 8% |
| ×20 (jackpot) | 2% |

A Legendary jackpot is 3,000,000 RDLN. If the treasury can't cover the roll, it steps down
until it can, so a pot is never promised that isn't held. The pot then grows with every seat
sold. The roll is seeded from the sealed panel and the block it opened in, so the author can't
steer it; on mainnet it moves to Chainlink VRF so nobody can.

## How a riddle stands without revealing its answer

Each attempt is sealed, then revealed by the solver within two days. Revealed attempts are
public: the riddle page shows every guess anyone has tried. The author then judges each one,
without giving the answer away:

- **Dismiss:** "not my answer". No proof needed.
- **Hold:** "correct, but the pot needs more independent solvers before I can confirm".
- **Confirm:** reveals the answer. The contract checks it against the author's seal and marks
  every revealed attempt that matches.

Three rules keep this honest:

1. **Lying is caught and slashed.** If any attempt the author dismissed turns out to match the
   revealed answer, the author lied. Their 40% goes to the solvers they wronged, and they earn
   no reputation. Because confirming always reveals the truth about every earlier dismissal,
   there is no profitable lie.
2. **Silence pauses the riddle.** If a revealed attempt gets no response for two days, seat
   sales and new attempts stop until the author responds. An author can't sit on a correct
   guess while seats keep selling. Paused for 14 days, the riddle retires.
3. **Copying doesn't count.** A correct guess is public between its reveal and the author's
   confirmation. Only attempts **sealed before the first reveal of any matching guess** count as
   solves. Someone who saw the reveal and then sealed the same words gets nothing; someone who
   sealed it earlier and revealed later still counts.

**Minimum solvers.** Small pots need one correct solver. Pots over twice the base need two;
over five times, three. The author holds correct attempts until the count is met. This is what
stops one friend who was told the answer from taking a jackpot.

## Settlement

| Case | Author (riddle NFT holder) | Solvers who counted | Rest of pot |
|---|---|---|---|
| Machines missed, humans solved | 40% | split 60%, plus RON | — |
| A machine had it | nothing | split 25% | back to treasury |
| Timer ran out, or paused 14 days | nothing | — | back to treasury |
| Author lied | nothing; their 40% goes to the wronged solvers | as above | — |

Winning seats become **achievement seats**. Every other seat on that riddle becomes a dead
collectible: proof you held a chance. Winnings collect on the Winnings page and are withdrawn
in one transaction.

## What is burned, and when

| Event | RDLN |
|---|---|
| Author submits | Stake 1, 2, 3… per wallet: 50% burned, 25% grand prize wallet, 25% operations. Never returned, even if declined or never solved. |
| Someone buys a seat | 50% into the riddle's pot. 50% through the game burn: 25% of the price burned, 12.5% grand prize, 12.5% operations. Never refunded. |
| Extra attempt on a seat | 1, 2, 3… RDLN, all through the game burn. |
| Riddle stands | The pot grows with seat sales. Nothing is burned by time. |
| Solved | Payouts as above. Withdrawals may carry the token's 1% transfer burn. |
| Retired unsolved | Nothing refunded. Pot back to the treasury. Seats and the riddle NFT remain. |

Burning is always tied to something someone did: writing, buying a seat, guessing again. Never
to waiting.

## Riddles no stranger could solve

"What's my dog's favourite hike" is not a riddle, it's a secret. Submissions are screened
before opening and declined when the text shows private knowledge; the stake stays burned. If
one slips through, it stands, sells few seats because the guess ledger is public, and retires
with its pot back to the treasury. The author paid a stake and earned nothing. Collusion on
big pots is bounded by the minimum-solvers rule and the copy rule.

## Open questions

- **Should an unsolved riddle pay its author?** A riddle nobody, machine or person, could crack
  is valuable, but "nobody solved it" is exactly what a nonsense riddle with an arbitrary answer
  would farm, and time stamps can't tell hard from meaningless. Two candidates: authors earn a
  cut of every seat sold on their riddle whether or not it is solved (people keep buying seats
  on riddles they believe are fair), and a fairness verdict at expiry, where the author reveals
  the answer and reputation holders vote whether it was a real riddle, paying a hard-riddle
  bonus on a "fair" verdict.
- Should seats be resellable inside the site, or only on open NFT markets?
- Should an author be allowed to raise their own pot?
- Should the riddle NFT pay the author a royalty on seat resales?
- Should very long timers cost a larger stake?
