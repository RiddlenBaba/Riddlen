---
layout: default
title: "The hunt (v2)"
description: "Riddlen v2, as designed and not yet built: a twenty-year scavenger hunt across the real world, riddles nobody wholly knows, NFTs that burn as you try, and a map to one grand prize scattered across every solved riddle."
permalink: /next/
---

# The hunt

This is the game as designed on 2026-09-27. Its first phase is **deployed on the Amoy testnet**
and documented in [Playing the hunt](/hunt/); the first game still runs beside it under
[Rules and payouts](/rules/). Read this to know where it is going, and argue with it.

## What it is

A scavenger hunt for the whole world. People write riddles and hide things. People buy the
right to attempt a riddle, solve it, and go out and find what was hidden. Every attempt burns
Riddlen. Somewhere in the world there is a grand prize. Every solved riddle holds a piece of
the map to it. The game releases one thousand riddles over about twenty years, and when the
last one is out, the map is complete and the final hunt begins.

The founder starts it. The players earn the right to write it. A DAO finishes it.

## What never changes

These are committed before the first riddle ships and cannot be altered by anyone, including
the founder or the DAO. They are the reason a player in year fifteen can trust the game
without trusting the people running it.

| Commitment | Value |
|---|---|
| Riddles | 1,000, released on a published schedule, roughly one a week |
| The end | When riddle 1,000 is released. Not when it is solved. |
| Burn split | Every payment: 50% burned, 25% grand prize, 25% treasury |
| Mint price | Computed at the moment you mint. Halves every two years from launch. |
| The map | The whole map and the prize location are hashed on chain on day one and sealed off chain with a successor. Every fragment ever revealed checks against that hash. |
| The handoff | The founder's authorship rights expire on the schedule, not at the founder's discretion |

Everything else on this page is a parameter the DAO can tune.

## The loop

| Step | Who | What |
|---|---|---|
| Release | The house | A riddle goes live. The contract rolls how many NFTs exist for it. |
| Mint | Player | Buy an NFT. The NFT is the riddle: a poem, a clue, a puzzle. Mint price follows the burn split. |
| Attempt | Holder | Guess the riddle's answer. The first attempt on that NFT costs 1 RDLN, the next 2, then 3. |
| Reveal | Contract | A correct answer unlocks the location. It is encrypted with the answer, so only someone who solved it can read it. |
| Find | Holder | Go there with the clue. Find what was hidden. Read the code on it. |
| Claim | Holder | Enter the code into the NFT. Checked against a seal. This is the solve. |
| Pay | Contract | First finder takes the largest share of the riddle's pot. Finishers inside the window split the rest. RON to every finder once the riddle has two unrelated finders. |
| Fragment | Contract | The solved NFT now carries its piece of the map, encrypted with a secret that exists only at the spot. |

## The NFT

- **It never expires.** A riddle stands until it is solved, however long that takes. An NFT
  bought in year three is a live right to attempt in year nineteen.
- **Its counter is its own.** A riddle with a hundred NFTs has a hundred independent counters.
  Yours at 20, someone else's at 10, a fresh one at 0. Other people's attempts never change
  what your next guess costs.
- **Everything travels with it.** Sell an NFT after 20 attempts and the buyer's next costs 21.
  Sell one whose riddle you cracked and the buyer gets the location. Sell a solved one and the
  buyer gets the map fragment. The token carries its cost and its progress, not the wallet.
- **Two markets, one token.** Unsolved NFTs trade on potential. Solved NFTs trade on the
  fragment, which can only be read with the secret from the spot. That exclusivity is physical:
  whoever stood there holds it. The counter is public, so a sprayed token cannot
  be passed off as fresh.
- **Enough of them that it is a race.** One holder alone is a private puzzle, not a game. The
  count per riddle is random, with a floor high enough that people compete for the same find.

## What is burned, and when

Every payment in the game goes through the same protocol: 50% burned and gone from supply,
25% to the grand prize wallet, 25% to the treasury.

| Event | Cost |
|---|---|
| Mint an NFT | The mint price at that moment. Starts at the launch price and halves every two years. |
| Attempt | 1, 2, 3… RDLN per NFT, rising by one each time until that NFT solves |
| Enter a found code | A fixed fee, so the last step cannot be brute-forced |
| Submit a piece (later phases) | 1, 2, 3… RDLN per wallet |

Nothing is refunded, ever. Nothing is burned by time. A riddle that stands unsolved keeps its
pot; it does not roll anywhere. Supply only goes down. The grand prize wallet only goes up.

## How riddles are made

**No one person knows a whole riddle.** A riddle is assembled by the contract from pieces:

- **Writers** submit small riddles, each with a sealed answer, into a pool. They never learn
  whether or when a piece is used.
- **Hiders** are given a code by the contract, hide it in the world, and submit a sealed clue
  to the place. They never see the riddle it belongs to.
- **The contract** draws pieces at random, say two written and one hidden, and defines the
  riddle's answer as the combination of theirs. On mainnet the draw uses verifiable randomness.

A writer who tells a friend gives away one piece of three. A hider who tells a friend gives
away a code with no riddle attached. Two writers on the same riddle do not know it. No
insider knows enough for a leak to pay.

**The right to contribute is earned.** RON is soulbound reputation, paid only for solving and
only on riddles with more than one unrelated solver. The tiers already exist:

| Phase | Who writes | Who decides |
|---|---|---|
| Genesis | The founder writes and hides every riddle | The founder |
| Proposals | Players above a RON threshold submit pieces | The founder picks |
| Review | Higher tiers review pieces, staking RON | The reviewers, without the founder |
| Handoff | The pool | The DAO holds the prize wallet, the sealed reserve and the successor process. The founder's wallet has no special role. |

Thresholds start high and are lowered by the DAO as the network proves itself. A piece that
fails, a wrong seal, a cache that washes away, a riddle with two answers, expires and is
replaced from the pool, and its writer's stake is lost.

## The map

Every solved NFT carries one fragment of the map to the grand prize. A fragment alone tells
you almost nothing. Hundreds together tell you where to go. The fragments belong to the
tokens, not the people who solved them, so a solved NFT is worth buying for twenty years.

When riddle 1,000 is released, the grand prize hunt begins. It is not a payout and not a
lottery. It is one more hunt, played by whoever holds the most of the map. Nobody, including
the founder, ever held the whole thing: it was scattered across a thousand riddles before the
first one shipped, and the hash on chain proves it.

A fragment is private on a public chain the same way a location is: encrypted with the code
found at the spot, which is checked on chain by its hash and never posted in the clear. When
a solved NFT is sold, the key changes hands through the site's escrow, which releases payment
only when the buyer confirms the fragment decrypts.

## In the world

The physical layer follows thirty years of geocaching practice, adopted whole:

- **Placement.** Nothing buried. Nothing on private land without permission. Nothing near
  infrastructure, nothing that looks like a device, nothing that needs a climb or a swim.
  Every clue leads somewhere public, reachable and legal.
- **Ratings.** Every hide carries a difficulty and a terrain rating, set by the hider,
  adjusted by finders.
- **Proof.** The hider posts photo proof at placement. A hide pays out only after a second,
  unrelated finder confirms it exists.
- **Maintenance.** The hider keeps the cache in place. Anyone can flag it as needing
  maintenance. A hider who does not respond loses staked RON.
- **First to find.** The code stays at the spot for everyone. First finder takes the largest
  share and the honour. A physical log book stays in the cache.
- **Trackables.** Objects that move between caches, each its own NFT.

Nobody should ever be hurt looking for a riddle. The rules above are the first thing the
constitution says and the last thing the DAO may weaken.

## What is gone from v1

- **The machine panel.** A machine cannot play a game whose answer is on a rock. The
  difficulty comes from the world now. The panel survives at most as a cheap off-chain check
  that a written piece is not trivially searchable.
- **Riddles from strangers.** Authorship is earned through RON and split by blind assembly.
- **Deadlines.** Riddles stand until solved.
- **Treasury-seeded pots for anything but the house's own riddles.**

## Open questions

- Should the grand prize wallet also fund periodic events along the way, as the original
  protocol proposed, or only the final hunt?
- Does the live v1 game on Amoy keep running as the genesis phase while this is built?
- What is the floor on NFTs per riddle, and how is the count weighted?
- How large is the finishers' window after first find, and how many finishers can pay out?
- Gambling law: pay to attempt with a prize for skill is a skill contest in most places. The
  design avoids random pot multipliers for that reason. Where else does it need care?

## A note on the token

The RDLN token deployed on Amoy already implements the split above: every payment a game
contract charges through it burns half and sends a quarter each to the grand prize wallet and
the treasury. The hunt charges through that path. No new token is needed.
