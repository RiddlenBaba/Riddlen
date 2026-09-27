---
layout: default
title: "Riddlen Docs"
description: "Riddlen is a scavenger hunt for the whole world: buy a riddle as an NFT, solve it, go to the place, scan what you find, and share the pot with everyone who finds it after you."
permalink: /
redirect_from:
  - /guides/
  - /guides/index.html
---

<h1 class="wordmark">Riddlen</h1>

**A scavenger hunt for the whole world.** The house releases a riddle. The contract rolls how
many NFTs exist for it and puts them on sale. An NFT is one person's right to attempt that
riddle. Solve it and the answer unlocks a place. Go there, find what was hidden, scan it, and you
have found it. Every finder gets a share of the pot, larger the earlier you were, released when
the next person finds it too. Every finder also gets a piece of one map. When the thousandth
riddle has been released, the map is complete and the final hunt for the grand prize begins.

Every guess costs Riddlen (RDLN). Every payment is split four ways: a quarter burned, a quarter
to the grand prize, a quarter to run the game, a quarter to build the market. Nothing is
refunded. Nothing expires.

Play at [riddlen.com](https://riddlen.com). The game runs on the Polygon Amoy testnet today, so
the tokens have no value yet. Every wallet can take a free starter amount at
[riddlen.com/free](https://riddlen.com/free).

## Read this first

| If you want to | Read |
|---|---|
| Play: buy, guess, go, scan, get paid | [Playing the hunt](/hunt/) |
| Know the design and the rules that do not move | [Whitepaper](/whitepaper/) |
| Follow every RDLN: supply, the split, prices, shares, the burn | [Tokenomics](/tokens/) |
| Verify the contracts | [Contracts and addresses](/contracts/) |
| Build on it | [For developers](/developers/) |
| See the plan for mainnet, the airdrop and gasless play | [Mainnet, airdrop, gasless](/roadmap/) |

## In one paragraph

The house posts a riddle with its answers sealed, the address of a key hidden at a place, the
location clue encrypted with the answer, and a map fragment encrypted with a secret that exists
only at the place. A few blocks later anyone opens it, which rolls the NFT count from a block
hash and fixes the share schedule and the price: a fifth of the pot per NFT, never below a
floor that halves every two years. Holders guess on chain, paying 1 RDLN, then 2, then 3 per
NFT; the right answer lets them read the location in their browser. At the place they scan the
code, which signs their claim without ever leaving their phone. The k-th finder's share is
pot × (1/k) ÷ H(N), booked at the scan and released when the next finder scans; the last is
released when every NFT on the riddle has found it. Winnings are withdrawn in one transaction.

## What came before

Riddlen has had three designs. The 2025 design, with speed tiers and an oracle network, was
never played. Stump the Machine, in which a panel of AI models tried each riddle before people
could and payouts depended on the machines failing, ran on Amoy in September 2026 and was retired
the same month; its pages are in the [Stump archive](/archive/stump/). The hunt keeps what both
got right, riddles written by people, sealed answers, reputation, burns, and moves the
difficulty out of the text and into the world.
