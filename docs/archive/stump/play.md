---
layout: default
title: "Archive · Playing Riddlen"
description: "How to enter a riddle, seal a guess, reveal it, and collect winnings."
permalink: /archive/stump/playing/
---

> **Archived.** This page describes Stump the Machine, the game Riddlen ran on Amoy in September
> 2026 and retired the same month. The current game is the hunt: read the
> [whitepaper](/whitepaper/) and [Playing the hunt](/hunt/).

# Playing

You need a wallet on Polygon Amoy and a little RDLN. Both take a couple of minutes.

## Getting set up

1. **A wallet.** Any browser wallet that speaks Ethereum works: MetaMask, Rabby, Coinbase Wallet.
   Add the Polygon Amoy network when the site asks; it is a testnet, so nothing you do costs
   real money.
2. **Testnet gas.** Transactions on Amoy need a tiny amount of test POL. Get some from
   [Polygon's faucet](https://faucet.polygon.technology/).
3. **Riddlen.** Go to [riddlen.com/free](https://riddlen.com/free), connect, and take the free
   starter amount. It is one claim per wallet and enough for many riddles.

## Solving a riddle

1. **Pick one from the board.** Open riddles show a countdown. Each riddle page shows the pot,
   the entry cost, how many people are in, and a note that the machines have already tried it
   and their guesses are sealed.
2. **Enter.** One transaction. The entry cost (10 to 100 RDLN by difficulty) is charged by the
   RDLN token's game protocol: half is burned and the rest goes to the grand prize and operations
   wallets. It is not refundable unless the riddle is voided.
3. **Seal your guess.** Type one answer. Your wallet asks for a free signature, which creates a
   secret only you can reproduce, and then for a transaction that stores a fingerprint of your
   answer plus that secret. Nobody can read your answer from the fingerprint. You must wait 30
   seconds after entering before you can seal. You can change your sealed guess as often as you
   like until the riddle closes.
4. **Wait for the close.** Entries stop at the deadline. Nothing has been revealed yet.
5. **Reveal.** After the author reveals the answer, you have two days to reveal your guess. The
   site remembers what you typed in this browser; if you are on another device, type the same
   answer and sign again with the same wallet. Case, spacing and trailing punctuation don't
   matter; the words do. An unrevealed guess counts as wrong.
6. **Settle and withdraw.** Once the reveal window ends, anyone can press Settle. Your winnings
   then appear on the Winnings page, and you withdraw them in one transaction.

## What you can and can't know while it's open

- You can see the riddle, the pot, the entry cost and how many people entered.
- You cannot see anyone's guess, the author's answer, or whether the machines got it. All of
  that is sealed until after the close, in that order: author, machines, players.

## Wrong guesses

A wrong or unrevealed guess earns nothing and pays a small penalty through the RDLN token: 1 RDLN
the first time, 2 the second, and so on, counted per wallet. It exists so that spraying random
guesses across many riddles does not pay.

## Asking an AI

You are allowed to. It just doesn't help: the panel already asked Claude, GPT and Gemini, and if
any of them had the answer, the riddle pays almost nothing. The riddles worth solving are the
ones the machines got wrong. See [The machines](/machines/).
