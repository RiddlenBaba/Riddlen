---
layout: default
title: "Rules and payouts"
description: "The exact lifecycle, timing, outcomes and payouts enforced by the Riddlen game contract."
permalink: /rules/
redirect_from:
  - /faq.html
  - /how-it-works.html
  - /archive/2025/guides/nft-mechanics.html
---

# Rules and payouts

Everything on this page is enforced by the `StumpTheMachine` contract, not by the site. The
site can only show you what the contract allows.

## Lifecycle

| Step | Who | What | When |
|---|---|---|---|
| Submit | Author | Riddle text, difficulty, sealed answer. Stake burned. | Any time |
| Open | Game master | Seals the panel's guesses, reserves the pot, starts the clock. Or declines. | After the panel runs |
| Enter | Solver | Pays the entry cost. One entry per wallet. Author can't enter. | While open |
| Seal | Solver | Stores a fingerprint of one answer. Can be replaced. | 30 s after entering, while open |
| Close | — | Entries and seals stop. | At the deadline (10 minutes to 30 days, set at open; usually a day) |
| Reveal answer | Author | Reveals the accepted answers; checked against the seal. | Within 2 days of close |
| Reveal panel | Game master | Reveals the machines' guesses; checked against the seal. | After close |
| Reveal guess | Solver | Reveals one answer; checked against the seal. | Within 2 days of the author's reveal |
| Settle | Anyone | Decides the outcome, books payouts. | After the reveal window |
| Withdraw | Anyone owed | Pulls all winnings and refunds in one transaction. | Any time after settle |

## Outcomes

| Outcome | Condition | Author | Each correct solver |
|---|---|---|---|
| **Stumped** | No panel guess matches any accepted answer, and at least 1 solver is correct | 40% of pot | 60% of pot ÷ number correct |
| **Machine solved** | Any panel guess matches any accepted answer | 0 | 25% of pot ÷ number correct |
| **Unsolved** | Panel missed, no solver correct | 0 | — |
| **Voided** | Author never revealed | 0 | Every entrant refunded their entry cost |

Unpaid remainder of a pot returns to the contract's free balance for future riddles.

## Pots and entries

| Difficulty | Pot | Entry |
|---|---|---|
| Easy | 10,000 RDLN | 10 RDLN |
| Medium | 25,000 | 25 |
| Hard | 60,000 | 50 |
| Legendary | 150,000 | 100 |

The pot is reserved from the contract's balance when the riddle opens. If the balance can't
cover it, the riddle can't open; the contract never promises RDLN it doesn't hold.

## Money flows

- **Entry cost and author stake** go through the RDLN token's game protocol: 50% burned, 25%
  to the grand prize wallet, 25% to the operations wallet. They do not fund the pot.
- **Pots** come from RDLN allocated to the game contract from the prize pool allocation.
- **Wrong or unrevealed guesses** pay the RDLN failed-attempt penalty: 1 RDLN, then 2, then
  3, per wallet, for life.
- **Withdrawals** are plain RDLN transfers. If the token's transfer burn is on, 1% is burned on
  the way out.
- **RON** (reputation, non-transferable) is awarded to the author of a stumping riddle and to
  every correct solver of a settled riddle, scaled by difficulty.

## Answers and matching

Every answer is normalized before it is sealed or compared: Unicode NFKC, lowercase, whitespace
collapsed, surrounding quotes removed, trailing `.`, `!` or `?` removed, and a leading `a`,
`an` or `the` removed. Then it must match one of the author's accepted answers exactly. There is
no fuzzy matching, on purpose: fuzzy rules are a place for arguments and for machines.

## Seals

A seal is `keccak256` of the contract address, your address, the riddle id, your normalized
answers and a secret. The secret is derived from a wallet signature over a fixed message, so
the same wallet always reproduces it and it never leaves your device. The author's seal and the
panel's seal work the same way. The chain stores only the hash; the answer is revealed later and
the hash is recomputed. If it doesn't match, the reveal is rejected.

## Trust

The game master is a trusted role today: it sees the panel result before humans play. It cannot
change a sealed answer, take a pot, or pay itself, but it could leak the machines' guesses or
lie about them. The panel transcripts are saved and can be published after each reveal. See
[Mainnet, airdrop, gasless](/roadmap/) for how this trust shrinks over time.
