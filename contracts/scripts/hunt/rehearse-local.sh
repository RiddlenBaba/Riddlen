#!/usr/bin/env bash
# Full local rehearsal of the hunt using the real house scripts against a local node running
# copies of the live RDLN and RON. Placeholder map. No API keys.
set -euo pipefail
cd "$(dirname "$0")/../.."

npx hardhat node --port 8545 > /tmp/riddlen-hunt-node.log 2>&1 &
NODE_PID=$!
trap 'kill $NODE_PID 2>/dev/null || true' EXIT INT TERM HUP
for i in $(seq 1 30); do curl -s -o /dev/null http://127.0.0.1:8545 && break; sleep 1; done

npx hardhat run scripts/stump/rehearse-setup.js --network localhost
RDLN=$(node -e "console.log(require('./deployments/stump-the-machine.json').localhost.rdln)")
RON=$(node -e "console.log(require('./deployments/stump-the-machine.json').localhost.ron)")

# Fresh placeholder map for the rehearsal, in its own directory so the real one is never touched
export HUNT_SECRETS_DIR=game-master/hunt-rehearsal
rm -rf "$HUNT_SECRETS_DIR"
PLACEHOLDER=yes TOTAL_RIDDLES=20 node scripts/hunt/mapmaker.js
CONFIRM=yes RDLN_ADDRESS=$RDLN RON_ADDRESS=$RON TOTAL_RIDDLES=20 PRIZE_FUNDING=200000 npx hardhat run scripts/hunt/deploy.js --network localhost

RIDDLE=$(mktemp).json
cat > "$RIDDLE" <<'JSON'
{ "text": "I have keys but no locks, space but no room, and you can enter but not go in. My aunt calls me the beige one.",
  "answers": ["keyboard", "a computer keyboard"], "difficulty": 0,
  "location": "The bench under the big fir at the Elk store, taped under the left armrest." }
JSON
CONFIRM=yes RIDDLE="$RIDDLE" npx hardhat run scripts/hunt/release.js --network localhost
for i in $(seq 1 12); do curl -s -X POST -H 'content-type: application/json' --data '{"jsonrpc":"2.0","id":1,"method":"evm_mine","params":[]}' http://127.0.0.1:8545 > /dev/null; done
CONFIRM=yes npx hardhat run scripts/hunt/cron.js --network localhost
npx hardhat run scripts/hunt/status.js --network localhost
STEP=mint    npx hardhat run scripts/hunt/rehearse-play.js --network localhost
STEP=attempt npx hardhat run scripts/hunt/rehearse-play.js --network localhost
STEP=claim   npx hardhat run scripts/hunt/rehearse-play.js --network localhost
STEP=release npx hardhat run scripts/hunt/rehearse-play.js --network localhost
STEP=check   npx hardhat run scripts/hunt/rehearse-play.js --network localhost
echo "REHEARSAL COMPLETE"
