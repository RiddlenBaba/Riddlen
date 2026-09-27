---
layout: default
title: "Mainnet, airdrop, gasless"
description: "How people get RDLN when Riddlen reaches mainnet, how the airdrop works, and how play becomes gasless."
permalink: /roadmap/
redirect_from:
  - /airdrop.html
  - /airdrop-guide.html
  - /governance.html
  - /archive/2025/airdrop.html
  - /archive/2025/governance.html
---

# Mainnet, airdrop, gasless

Riddlen runs on a testnet today. This page is the plan for the three questions that decide
whether it works on mainnet: how people get RDLN, how the airdrop is spent, and how someone who
scans a sticker can be playing in a minute without knowing what gas is.

## How people get RDLN on mainnet

Three ways, in the order most people will meet them.

**1. Free Riddlen: a starter dose.** The sticker promise stays true on mainnet. A new player
gets enough RDLN for a handful of entries, from the airdrop allocation, once. The testnet faucet
is one claim per wallet; on mainnet wallets are free to create, so the dose needs a cost that
bots feel and people don't. The plan is one dose per verified human, using the humanity gate
already built into the game contracts (a signed pass from a service that checks World ID or a
similar proof), with a plain per-wallet fallback where verification isn't available. The dose is
small enough that farming it isn't worth the verification.

**2. Earn it.** Solve riddles, or write ones the machines can't. Pots come from the 700M prize
pool allocation, released to the game contract on a schedule so the pool lasts years rather than
months. This is the main faucet and the only one that scales with the thing we want more of.

**3. Buy it.** The 100M liquidity allocation seeds a market once there is something to price.
No presale.

## The airdrop

The 100M airdrop allocation is not a snapshot drop. It is spent in three ways that each reward
the behaviour the game needs:

| Use | Share | Mechanism |
|---|---|---|
| Starter doses | ~40M | One dose per verified human, on the Free Riddlen page |
| Merit drops | ~40M | Periodic distributions to RON holders, proportional to RON. RON can't be bought or transferred; it is earned by stumping machines and solving riddles, so this drop can only reach people who played well |
| Early writers | ~20M | Bonuses on the first riddles that stump the panel on mainnet, when pots are still small and the board is empty |

The 2025 airdrop contract had a social-proof phase (follow, join, post). It is gone. Social proof
is the easiest thing in the world for a bot, and Riddlen's whole point is that the machines
don't get paid.

## Gasless play

A person who scans a sticker should be solving a riddle within a minute, without installing a
wallet extension or buying gas. Two pieces, one we already have half of:

**Sponsored transactions.** Riddlen's own relayer pays gas for game actions. Players already
sign a message to seal an answer; with EIP-2771 meta-transactions they sign the whole action
and the relayer submits it. The game contract verifies the signer, so nothing about trust
changes. The relayer only forwards calls to the game contract and rate-limits per address; the
entry cost in RDLN is still paid by the player, so spam still costs the spammer. On Polygon a
sponsored transaction costs a fraction of a cent, and the contract can charge a few RDLN per
action to make the relayer self-funding. The repository already contains a forwarder and gasless
manager from 2025; the game contract needs `ERC2771Context` and the game master service, which
already runs the panel, becomes the relayer.

**Wallets people don't have to install.** For the sticker crowd, a passkey-backed smart account
(ERC-4337) created in the browser with Face ID or a fingerprint, plus a paymaster that sponsors
its gas under a policy ("only calls to the game contract, at most N per hour"). The account is
theirs, exportable, and works on every device with the same passkey. Riddlen runs the paymaster
policy; a bundler service submits the operations. This is the "own engine": Riddlen decides who
gets sponsored, for what, and how much, and pays for it from operations.

Beyond that, if volume ever justifies it, an app-chain (a Polygon CDK rollup with RDLN as the
gas token, or no gas at all for game calls) makes every transaction free at the protocol level.
Not before the game has players.

## Shrinking the game master

The game master sees the panel result before people play. Steps to make that matter less, in
order:

1. Publish every panel transcript after reveal (the data exists today).
2. Run the panel inside an attested environment so the transcript provably came from the models.
3. Let RON holders above a tier dispute a settled riddle and re-run the panel.
4. Replace the single game master key with a threshold of independent operators.

## What is already built for this

- The humanity gate (`IHumanityGate`, an attester contract, and a World ID verifier service)
  is in the repository, tested, and switched off.
- The failed-attempt penalty and the progressive author stake are live and are the first line
  against spam.
- RON is live and already accrues from the game.
