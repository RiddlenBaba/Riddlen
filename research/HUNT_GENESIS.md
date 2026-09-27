# Hunt genesis: the house's checklist

The founder writes and hides the first riddles alone, before anyone is playing. Like the first
blocks of a chain, these are the proof later that the schedule ran from the start. This is the
runbook for one riddle, then the list of what must exist before mainnet.

## One riddle, start to finish

1. **Write it.** A file like `contracts/game-master/hunt/riddles/003.json`:
   text (the clue people buy), `answers` (up to 8 accepted spellings; the site normalizes case,
   articles, punctuation), `difficulty` (0 to 3), `location` (what the solver sees after solving:
   where to go, precise enough to find, vague enough that the riddle still matters).
2. **Pick the place.** Public, reachable, legal. Nothing buried, nothing on private land without
   permission, nothing near infrastructure, nothing that needs a climb or a swim, nothing that
   looks like a device. Ask: would a stranger with a phone and an hour find this without risk?
3. **Release it.** `CONFIRM=yes RIDDLE=… npx hardhat run scripts/hunt/release.js --network amoy`.
   This writes `<network>-hunt-<id>.json` (answers, cache key, fragment secret) and
   `<network>-hunt-<id>-qr.png` under `contracts/game-master/hunt/`. Back that directory up
   somewhere that outlives the laptop before doing anything else.
4. **Print the code.** The PNG at 40 mm or larger, error correction H. Laminate, or a
   weatherproof label on a small container (geocaching "micro" or "small"). Write the riddle
   number on the outside in pen and "Riddlen: leave it here" so a finder who is not playing
   leaves it.
5. **Hide it.** At the place the location clue describes. Take a photo showing the container in
   place (the proof), and note GPS, date and any access notes in a private log.
6. **Open it.** `cron.js` opens released riddles after ten blocks; run it once or let the
   workflow do it. The NFT count is rolled from a future block, not chosen.
7. **Maintain it.** Revisit on a schedule, or when a finder flags it. A lost or destroyed cache
   is re-keyed with `rekey` (new signing key, new fragment secret, same answer roots) and
   re-hidden; holders lose nothing.

## Before mainnet

- **The map.** Made once, offline, with `mapmaker.js` from the real map file. 1,000 fragments,
  each meaningless alone. Only the root goes on chain. The fragments and manifest are backed up
  in at least two places that are not this computer.
- **The prize.** Decided, and its location sealed: `prizeCommitment = keccak256(location, salt)`.
  The location, the salt and the instructions for opening the prize are held by a successor
  (a lawyer, a trust, a sealed envelope with a named executor) so the hunt can end without the
  founder.
- **The grand prize wallet.** A contract nobody holds keys to, receiving the 25% of every
  payment. On the testnet it is the deployer's address.
- **The schedule.** `minReleaseSpacing` set to the real cadence (about a week) in
  `HuntCommitments`. `launchAt` set to the launch.
- **Reserve riddles.** A sealed batch written in advance so the schedule survives a bad month.
- **Verifiable randomness.** The NFT count roll moves to Chainlink VRF on mainnet.
- **Successor house.** Who releases riddle 500 if the founder cannot. RON-earned authorship and
  the DAO handoff are later phases; the successor is a person or a multisig first.
- **Legal.** Pay to attempt with a prize for skill is a skill contest in most places; the design
  has no random pot multipliers for that reason. Check the states and countries where caches
  go. Placement follows geocaching's land-use etiquette.

## Materials

- Small weatherproof containers with a gasket, or heavy laminate for a flat hide.
- Waterproof label stock for the QR; a test scan from a phone before it leaves the house.
- A pencil and a small log book in each container: the first-to-find culture is worth having.
- A private log: riddle number, place, GPS, date placed, photo, last checked.
