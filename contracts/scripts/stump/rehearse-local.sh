#!/usr/bin/env bash
# Full local rehearsal of Stump the Machine using the real game-master scripts against a
# local node running copies of the live RDLN and RON. No API key needed (stub panel).
#   PANEL_STUB="keyboard|piano" to make the machines "solve" it; default panel misses.
set -euo pipefail
cd "$(dirname "$0")/../.."
PANEL_STUB="${PANEL_STUB:-a piano|a typewriter|a map}"
export PANEL_STUB DURATION=3600

npx hardhat node --port 8545 > /tmp/riddlen-rehearsal-node.log 2>&1 &
NODE_PID=$!
trap 'kill $NODE_PID 2>/dev/null || true' EXIT INT TERM HUP
for i in $(seq 1 30); do curl -s -o /dev/null http://127.0.0.1:8545 && break; sleep 1; done

npx hardhat run scripts/stump/rehearse-setup.js --network localhost
ADDR_FILE=deployments/stump-the-machine.json
RDLN=$(node -e "console.log(require('./$ADDR_FILE').localhost.rdln)")
RON=$(node -e "console.log(require('./$ADDR_FILE').localhost.ron)")
CONFIRM=yes RDLN_ADDRESS=$RDLN RON_ADDRESS=$RON PRIZE_FUNDING=200000 npx hardhat run scripts/stump/deploy.js --network localhost
STEP=submit npx hardhat run scripts/stump/rehearse-play.js --network localhost
npx hardhat run scripts/stump/open-challenge.js --network localhost
CONFIRM=yes ALL=yes npx hardhat run scripts/stump/open-challenge.js --network localhost
STEP=play npx hardhat run scripts/stump/rehearse-play.js --network localhost
STEP=reveal npx hardhat run scripts/stump/rehearse-play.js --network localhost
FINALIZE=yes npx hardhat run scripts/stump/reveal-panel.js --network localhost
STEP=check npx hardhat run scripts/stump/rehearse-play.js --network localhost
