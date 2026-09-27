---
layout: default
title: "Running the game master"
description: "What the Riddlen game master does, how to run it by hand or unattended, and what it costs."
permalink: /game-master/
---

# Running the game master

The game master is the off-chain half of Riddlen. It does four things and nothing else: screens
new submissions, runs the AI panel and seals the result, opens riddles, and reveals the panel
after close. It cannot touch pots, answers or winnings.

## What it needs

In `contracts/.env`:

- `PRIVATE_KEY` for a wallet holding `GAME_MASTER_ROLE` and a little test POL for gas
- `AMOY_RPC_URL` (optional; a public RPC is the default)
- `AI_GATEWAY_API_KEY` from Vercel AI Gateway, which bills the panel

## By hand

```bash
cd contracts
npx hardhat run scripts/stump/status.js --network amoy            # everything at a glance
npx hardhat run scripts/stump/open-challenge.js --network amoy    # list pending submissions
ID=3 npx hardhat run scripts/stump/open-challenge.js --network amoy            # run the panel, dry run
CONFIRM=yes ID=3 DURATION=86400 npx hardhat run scripts/stump/open-challenge.js --network amoy
CONFIRM=yes ID=4 REJECT="not a riddle" npx hardhat run scripts/stump/open-challenge.js --network amoy
npx hardhat run scripts/stump/reveal-panel.js --network amoy      # reveal every closed riddle's panel
FINALIZE=yes npx hardhat run scripts/stump/reveal-panel.js --network amoy   # and settle what's ready
```

## Unattended

`scripts/stump/cron.js` does one complete pass: screen, panel, open (at most 6 open at once, at
most 2 pending per author), reveal, settle. Run it every 15 minutes:

```bash
CONFIRM=yes npx hardhat run scripts/stump/cron.js --network amoy
```

The repository ships a GitHub Actions workflow that does exactly this. It needs two repository
secrets, `GAME_MASTER_PRIVATE_KEY` and `AI_GATEWAY_API_KEY`, and one line removed
(`if: false`).

## The secrets you must not lose

Every panel run writes `contracts/game-master/<network>-stump-<id>.json`: the panel's guesses,
the salt, and the transcripts. Without that file the panel for that riddle can never be
revealed and the riddle can never settle. Back the folder up. The workflow caches it between
runs; that is not a backup.

## Trying a riddle without staking

```bash
RIDDLE="What has keys but no locks?" npx hardhat run scripts/stump/panel-dry-run.js
```

## Cost

Only the panel bills: about $0.10 to $0.20 per riddle at typical lengths, under $0.50 worst case.
Screening is a fraction of a cent. Amoy gas is free.

## Rehearsing

`scripts/stump/rehearse-local.sh` starts a local node with copies of the live RDLN and RON,
deploys the game, and plays a full round through the real scripts with a stub panel. Run it
after any change to the scripts or the contract.
