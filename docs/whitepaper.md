---
layout: default
title: "Riddlen whitepaper"
description: "The design of Riddlen: a twenty-year scavenger hunt across the real world, riddles you buy as NFTs and go out and find, every guess burned, shares released by the next finder, and a map to one grand prize scattered across every solved riddle."
permalink: /whitepaper/
redirect_from:
  - /next/
  - /rules/
  - /write/
  - /machines/
  - /whitepaper.html
  - /tokenomics.html
  - /tokenomics-deep.html
---

# Riddlen

*Version 6, 2026-09-27. This document is the design. Where the code, the site or another page
disagrees with it, this page wins and the other is a bug.*

## 1. What it is

A scavenger hunt for the whole world, run on a blockchain, that lasts about twenty years and
then ends.

The house releases a riddle. The contract rolls how many NFTs exist for it and puts them on
sale. An NFT is one person's right to attempt that riddle. You solve the riddle, and the
answer unlocks a place. You go there, find what was hidden, scan it, and you have found it.
Every finder gets a share of the riddle's pot, larger the earlier you were, released when the
next person finds it too. Every finder also gets a piece of one map. When the thousandth
riddle has been released, the map is complete and the final hunt for the grand prize begins.

Every attempt costs Riddlen (RDLN). Every payment is split four ways: a quarter is burned, a
quarter feeds the grand prize, a quarter runs the game, a quarter builds the market the prize
is paid in. Nothing is refunded. Nothing expires.

The founder writes and hides the first riddles alone. Players earn the right to write them
through reputation. A DAO finishes the hunt.

## 2. The rules that do not move

These are the rules every other decision is checked against. If a proposed mechanic breaks one,
the mechanic is wrong.

1. **Nothing expires.** No deadlines, no windows, no fuses, no settlement step. A riddle is alive
   until every NFT on it has found it, or forever. An NFT is a live claim on its riddle's pot for
   as long as it is held.
2. **Every guess costs.** Each guess on an NFT is paid, more each time, whether it is right or
   wrong. The site never checks an answer for free.
3. **Everyone who finds is paid, earlier finders more.** Shares are set by finishing order and
   scaled to the riddle's NFT count. There is no cap on how many finders share the pot.
4. **A share is released by the next finder.** The first finder is paid when the second person
   scans, the second when the third does, and so on. The last is paid when the riddle completes.
   The code stays at the place because taking it away costs the taker.
5. **The answer lives in the world.** No machine is in the loop. The hunt's difficulty comes from
   places, not from wordplay a model can crack.
6. **The treasury pays only for the house's riddles.** Player-written riddles, when they come,
   fund their own pots.
7. **The commitments are immutable.** The map root, the prize commitment, the launch, the
   schedule and the price floor are fixed before the first riddle and held in a contract with
   no owner and no upgrade path.

## 3. The commitments

Held in `HuntCommitments`, a plain contract of immutables.

| Commitment | Value |
|---|---|
| Riddles | 1,000, released on a published schedule, about one a week |
| The end | When riddle 1,000 is released. Not when it is solved. |
| Map root | Merkle root over the hashes of the 1,000 map fragments |
| Prize commitment | `keccak256(location, salt)` of the grand prize, sealed off chain with a successor |
| Launch | The moment the mint-price clock starts |
| Mint price floor | The least an NFT can cost. Halves every two years from launch. |
| Release spacing | Minimum time between releases (zero on testnet) |

## 4. The loop

| Step | Who | What |
|---|---|---|
| Release | The house | Posts the riddle text, the sealed answer roots, the address of a key hidden at a place, the location clue encrypted with the answer, and this riddle's map fragment encrypted with a secret that exists only at the place. Reserves the pot. |
| Open | Anyone, a few blocks later | Rolls how many NFTs exist from a future block hash: 50% of riddles get 10 to 50, 25% get 50 to 200, 20% get 200 to 600, 5% get 600 to 1,000. Fixes the share schedule. |
| Buy | A player | Mints an NFT: one right to attempt this riddle. |
| Guess | The holder | Submits an answer on chain for that NFT. Charged whether right or wrong; the chain says which. The right answer unlocks the location for that NFT. |
| Go | The holder | Reads the location clue, decrypted in the browser with the answer, and goes there. |
| Find | The holder, at the place | Scans the code and leaves it. The code's key signs the claim in the browser and is never sent anywhere. The finder's share is booked, RON is awarded, the map fragment is revealed. The previous finder's share is released. |
| Withdraw | Anyone owed | Pulls everything owed, from every riddle, in one transaction. |

## 5. The NFT

- **It is the riddle.** Its text is the clue people buy. Its metadata shows its state.
- **It never expires.** A riddle stands until it is solved, however long that takes. An NFT bought
  in year three is a live claim in year nineteen.
- **Its counter is its own.** A riddle with a hundred NFTs has a hundred independent counters.
  Other people's guesses never change what your next guess costs.
- **Everything travels with it.** Sell an NFT after 20 tries and the buyer's next try costs 21.
  Sell one whose riddle you cracked and the buyer can claim, if they have the answer to read the
  location. Sell one that has found and its unreleased share goes to the new holder when it is
  released. The token carries its cost, its progress and its claim; the wallet carries nothing.
- **Enough of them that it is a race.** The count is random with a floor of ten, so people always
  compete for the same find.
- **Two markets, one token.** Before a find, an NFT trades on its chance at the next share. After,
  it trades on the share it is owed and the map fragment it can read.

## 6. Money

### 6.1 The split

Every RDLN payment in the game goes through the token's game protocol:

| Share | Goes to |
|---|---|
| 25% | Burned, gone from supply |
| 25% | The grand prize wallet |
| 25% | The treasury, which runs the game |
| 25% | The liquidity reserve, which seeds the market RDLN trades in |

This applies to every mint, every guess and every claim. It was 50% burn / 25% / 25% until
2026-09-27; the token was upgraded in place. The reason for the change is in 6.5.

### 6.2 What is paid

| Event | Cost |
|---|---|
| Mint an NFT | The mint price at that moment (section 7) |
| Guess | 1 RDLN, then 2, then 3… per NFT, rising by one each time until that NFT solves |
| Claim | A fixed fee, so the last step cannot be brute-forced |
| Player submits a riddle (later phase) | 1, 2, 3… RDLN per wallet |

Nothing is refunded, ever. Nothing is burned by time.

### 6.3 The pot

Each riddle's pot is set by its difficulty and reserved from the game contract's balance when
the riddle is released. Testnet pots: 10,000 / 25,000 / 60,000 / 150,000 RDLN. The pot is funded
from the token's prize-pool allocation. It belongs to that riddle for as long as the riddle
stands; it never rolls anywhere.

### 6.4 Shares: who gets what

On a riddle with N NFTs, the k-th finder's share is proportional to 1/k, scaled so that if all N
find it the pot is exactly emptied:

    share(k) = pot × (1 / k) ÷ (1 + 1/2 + 1/3 + … + 1/N)

Every finder is paid. Earlier finders are paid more. The first finder on a scarce riddle is paid
far more than the first finder on a crowded one, so the roll matters:

| NFTs on the riddle | 1st finder | 2nd | 10th | last |
|---|---|---|---|---|
| 12 | 32.2% | 16.1% | 3.2% | 2.7% |
| 50 | 22.2% | 11.1% | 2.2% | 0.45% |
| 100 | 19.3% | 9.6% | 1.9% | 0.19% |
| 376 | 15.4% | 7.7% | 1.5% | 0.04% |
| 800 | 13.8% | 6.9% | 1.4% | 0.02% |

A share is **booked** at the scan and **released** when the next finder scans. The last finder
on a riddle is released by the riddle completing, which is every NFT on it having found. A
finder whose riddle attracts nobody after them waits, with their share booked, for as long as
it takes. That is the cost of being last and the reason the code stays where it is.

Late shares are small in RDLN today. The hunt runs twenty years; what a share is worth in year
twelve is not for today's numbers to decide.

### 6.5 What the burn actually does

Simulated over the full thousand riddles with the deployed pricing (section 7), the random NFT
counts, the testnet pots and the 10 RDLN floor halving every two years:

| Scenario | Through the protocol | Burned (25%) | Share of 1B supply | Grand prize | Liquidity |
|---|---|---|---|---|---|
| Quiet: 30% of NFTs sell, 1.2 guesses each | 1.8M | 0.46M | 0.05% | 0.46M | 0.46M |
| Busy: 80% sell, 2 guesses, 4 finders | 5.1M | 1.27M | 0.13% | 1.27M | 1.27M |

Against pots of about 29M paid out, 4% of the prize-pool allocation. The burn is real and
permanent, but at these pot sizes it is small against the supply. What shrinks the float is the
slow payout of the prize pool. What gives a share value is a market, which is why a quarter of
every payment builds one. The pot is the lever: because the ticket price is a fifth of the pot
per NFT, mint volume scales with the pots, so raising the pots raises every quarter of the split
with them. The full numbers are on [Tokenomics](/tokens/).

### 6.6 Collusion

A first finder who brings a friend as the second finder collects two shares, 29% of a 100-NFT
riddle's pot between them, and releases the first. Each needs an NFT, guesses and a claim fee.
The design bounds this rather than preventing it: shares fall fast with rank, crowded riddles pay
colluders less, and every extra collaborator pays. If it proves a problem on large pots, the
remedy is a higher number of finders before the first release on Hard and Legendary riddles.
Not built; noted.

## 7. The mint price

An NFT costs a fifth of what one ticket is worth, and never less than the floor:

    price = max(floor, 20% × pot ÷ nftCount)

A 150,000 pot with 12 NFTs prices at 2,500 RDLN; a 10,000 pot with 800 at 12.5 on testnet's
10 RDLN floor. Scarcity and prize are priced automatically, and mint volume scales with the
pot, so the burn does too: a fully sold riddle recycles a fifth of its pot through the split.
The price is quoted once the count is rolled, which the two-step open allows. The 20% is a
tunable snapshotted into each riddle at release; the floor is a commitment and halves every two
years from launch. Decided 2026-09-27.

## 8. Answers, places and codes

**The answer never goes on chain.** For each accepted answer the house computes a deliberately
slow hash, `H = PBKDF2-SHA256(canonical answer, salt = chainId‖hunt‖riddleId, 600,000 rounds)`.
From `H` it builds a 1,024-leaf Merkle tree whose leaf at position `i` is
`keccak256(riddleId, i, H)`, and stores the root. Up to eight accepted answers give up to eight
roots; unused slots hold random roots.

**A proof works for one NFT only.** NFT number `i` submits its own leaf and the ten siblings from
position `i` to the root. The contract recomputes the root positionally, so a solved NFT's
calldata cannot be replayed by another NFT and a leaf reveals nothing about `H`.

**Guessing offline is possible and priced.** On a public chain anyone can run the verifier on
their own machine. The site never does; every guess it sends is paid. The slow hash makes the
offline route cost real compute per candidate instead.

**The location is encrypted with the answer.** The clue is sealed under a random key, wrapped
once per accepted answer. Whoever knows any accepted answer can read it in the browser.

**The place holds a key.** The hidden code carries a signing key and a fragment secret. To claim,
the browser signs `Claim(riddleId, tokenId, owner)` under the hunt's domain with that key and
sends only the signature. The key never touches the chain. The fragment secret next to it stays
private to people who stood there, which is a physical exclusivity, not a cryptographic one. A
destroyed cache can be re-keyed by the house and re-hidden; the answer roots never change and
existing claims stand.

## 9. The map and the grand prize

Every riddle's map fragment is sealed under a key derived from the fragment secret and committed,
as a hash, on chain; the ciphertext lives in the release event. One fragment alone says almost
nothing. Hundreds together say where to go. Fragments belong to the tokens that found, not to the
people, so a found NFT is worth buying for twenty years.

When riddle 1,000 is released, the grand prize hunt begins: one more hunt, played by whoever
holds the most of the map. It is not a payout and not a lottery. Nobody, including the founder,
ever held the whole map: it was split before the first riddle shipped, and the root on chain
proves it. The prize itself is physical, its location sealed with a successor, and its RDLN side
is the grand prize wallet, which receives a quarter of every payment for twenty years.

## 10. How riddles are made

**No one person knows a whole riddle.** A riddle is assembled from pieces: writers submit small
riddles with sealed answers into a pool and never learn if or when one is used; hiders are given
a code, hide it, and never see the riddle; the contract draws pieces at random and combines their
answers. A writer who tells a friend gives away one piece of three. A hider who tells a friend
gives away a code with no riddle. Two writers on one riddle do not know each other.

**The right to contribute is earned.** RON is soulbound reputation earned by finding. The tiers
already exist in the token.

| Phase | Who writes | Who decides |
|---|---|---|
| Genesis (now) | The founder writes and hides every riddle | The founder |
| Proposals | Players above a RON threshold submit pieces and pay to submit | The founder picks |
| Review | Higher tiers review pieces, staking RON | The reviewers, without the founder |
| Handoff | The pool | The DAO holds the prize wallet, the sealed reserve and the successor process |

Player-submitted riddles pay to submit, which burns more RDLN. Their pots come from their own
sales and fees, never from the treasury. Not built yet.

**Machines.** No AI is in the loop of the game. If the system ever offers an assistant to writers
or players, its cost must be covered by a fee inside the design, because the house cannot carry
it. Not built.

## 11. In the world

The physical layer follows geocaching practice, adopted whole:

- **Placement.** Nothing buried. Nothing on private land without permission. Nothing near
  infrastructure, nothing that looks like a device, nothing that needs a climb or a swim. Every
  clue leads somewhere public, reachable and legal.
- **Ratings.** Every hide carries a difficulty and a terrain rating.
- **Proof.** The hider posts photo proof at placement.
- **Maintenance.** The hider keeps the cache in place. Anyone can flag it. A hider who does not
  respond loses staked RON, once staking exists.
- **First to find.** The code stays at the spot for everyone, and the contract makes sure of it.
  A physical log book stays in the cache.
- **Trackables.** Objects that move between caches, each its own NFT. Later.

Nobody should ever be hurt looking for a riddle. This section is the first thing the DAO may
not weaken.

## 12. Tokens

The full numbers, allocations, worked examples and the simulation are on
[Tokenomics](/tokens/). In short:

- **RDLN** is the game's currency: one billion minted at genesis, 700 million of it the prize
  pool released to riddles over the hunt. Every game payment goes through the four-way split.
  The token can also burn 1% of ordinary transfers; the switch is off.
- **RON** is reputation: earned by finding, never transferable, the key to authorship.
- **The grand prize wallet** receives a quarter of every payment. On testnet it is the deployer's
  address; on mainnet it is a contract nobody holds keys to.
- **The liquidity reserve** receives a quarter of every payment and is paired with the other
  side of a pool by the treasury on a schedule. On testnet it is
  `0xa9Cd5a6b1726436d144dF0FF583Ff72a7CF05abD`.

## 13. What is deployed, and what changes before mainnet

Deployed on Polygon Amoy since 2026-09-27 and played at riddlen.com; addresses and the play
guide are on [Playing the hunt](/hunt/). The testnet map and prize are placeholders.

Before mainnet: the real map and prize commitment, made once offline and sealed with a
successor; a keyless grand prize wallet; the release spacing set to the real cadence; a sealed
reserve of riddles; verifiable randomness for the NFT count; a successor house; the mint price
decision in section 7; legal review of placements and of pay-to-attempt in each jurisdiction;
and a size diet for the RDLN contract, which is over the mainnet limit.

## 14. Open questions

- Whether large pots should require more finders before the first release (section 6.6).
- Whether seats on a riddle should be tradable inside the site or only on open markets.
- Whether the riddle NFT should pay its original finder a royalty on resale.
- Whether very long-standing riddles should have their pots topped up from the treasury.
- Several caches per riddle, with each NFT assigned to one by its index. Everyone with the
  answer can read every location, but each NFT can only claim at its own place, so every extra
  share costs an extra journey and a lost cache blocks only the NFTs assigned to it. One cache
  per riddle in genesis; the contract should leave room for a list.

## 15. Change log

- **v6, 2026-09-27.** The hunt. Replaces Stump the Machine and the seats design. Rank-based
  shares released by the next finder replace every form of settlement window. Four-way split
  with a liquidity reserve. No machines in the loop.
- **v5.2, 2025.** Stump the Machine: AI panel as payout gate, deadlines, commit-reveal. Retired.
- **v5.1, 2025.** The original: 1,000 riddles over 19 years, progressive burns, biennial halving,
  a grand prize wallet. Most of it is back.
