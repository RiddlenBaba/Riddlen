---
layout: default
title: "Riddlen Docs"
description: "Riddlen is a riddle game with one rule that makes it different: a riddle only pays if a panel of frontier AI models tried it first and failed."
permalink: /
redirect_from:
  - /guides/
  - /guides/index.html
---

# Riddlen

**Riddles the machines couldn't solve.** People write riddles. Claude, GPT and Gemini try each
one before any person sees it, and their guesses are sealed on chain. Then people play. A riddle
pays out only when every machine missed and at least one person got it.

That one rule is the whole idea. Prize money can only go to people, for the things people can do
that machines can't. Asking an AI for help gets you the guess it already made and already got
wrong. And as the machines get better, the riddles that pay get harder to write, so the game
never has to be redesigned to stay human.

Play at [riddlen.com](https://riddlen.com). The game runs on the Polygon Amoy testnet today, so
the tokens have no value yet. Every wallet can take a free starter amount at
[riddlen.com/free](https://riddlen.com/free).

## Read this first

| If you want to | Read |
|---|---|
| Solve riddles | [Playing](/play/) |
| Write riddles and get paid for stumping the machines | [Writing riddles](/write/) |
| Know exactly who gets what, and when | [Rules and payouts](/rules/) |
| Know which AIs play and how they are judged | [The machines](/machines/) |
| Understand RDLN and RON | [RDLN and RON](/tokens/) |
| Verify the contracts | [Contracts and addresses](/contracts/) |
| Build on it | [For developers](/developers/) |
| Run a game master | [Running the game master](/game-master/) |
| See the plan for mainnet, the airdrop and gasless play | [Mainnet, airdrop, gasless](/roadmap/) |

## In one paragraph

An author submits a riddle and a sealed answer, burning a small stake. The game master sends
the riddle text to a panel of frontier models, collects every distinct guess, seals them, and
opens the riddle. Solvers pay a small entry and seal a guess. After the riddle closes the author
reveals the answer, the machines' guesses are revealed, and solvers reveal their guesses; every
reveal is checked against its seal. The contract then settles: if the panel missed and a human
hit, the author takes 40% of the pot and the correct solvers split 60%. If a machine hit, the
author gets nothing and correct solvers split a quarter. Winnings are withdrawn from the
contract in one transaction.

## What changed from the 2025 docs

The 2025 documentation described a different game: single-answer riddles with speed tiers,
question validators and an oracle network. That game was never played. The contracts that were
deployed for it still exist and some are reused (the RDLN token and the RON reputation token
are the same contracts), but the game is now Stump the Machine and the numbers on these pages
are the ones the live contracts enforce. The old pages are kept in the [2025 archive](/archive/2025/).
