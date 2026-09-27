# Stump the Machine

Riddlen's game, as of 2026-09-26. Riddles written by humans, tried by frontier AI first, paid
only when the machines lose.

## Why this format

Every earlier Riddlen format had the same hole: proving a player is human doesn't stop them
asking an AI, and single-answer riddles are what AI solves best. Stump the Machine closes the
hole by construction instead of by policing:

- A riddle only pays when a panel of frontier models, answering cold before any human, **got it
  wrong**, and at least one human **got it right**.
- A solver who pastes the riddle into a model gets the same wrong answer the panel already gave.
  AI help is worth nothing on exactly the riddles that pay.
- As models improve, the bar rises on its own. The game doesn't need re-designing every time a
  CAPTCHA falls.
- It needs no Orb-verified users, no World ID app, no attester key. The humanity gate built
  earlier stays available as an optional layer (see `HUMAN_ONLY_DESIGN.md`).
- Side effect: every settled STUMPED riddle is a human-solvable, AI-failing puzzle with the
  machines' wrong answers recorded on chain. That set has value beyond the game.

## Rules

| Step | Who | What happens |
|------|-----|--------------|
| Submit | Author | Writes the riddle (≤ 2000 chars), picks a difficulty, seals `keccak(contract, author, answers, salt)`. Pays RDLN's progressive question-submission burn (1, 2, 3… RDLN). |
| Open | Game master | Runs the AI panel on the riddle text, seals `keccak(contract, id, panelAnswers, salt)`, reserves the pot, opens entries for `duration` (10 min – 30 days). Or rejects spam; the stake stays burned. |
| Enter | Solver | Pays the entry cost via RDLN's game burn (50% burn / 25% grand prize / 25% dev-ops on the live token). Author can't enter. One entry per wallet. |
| Seal | Solver | ≥ 30 s after entering, seals `keccak(contract, solver, id, answers, nonce)`. Can re-seal until close. |
| Close | — | At `endTime` entries stop. Nothing has been revealed yet. |
| Reveal answer | Author | Within 2 days of close. Missing it **voids** the riddle: entrants claim their entry cost back from the pot, the rest of the pot is released. |
| Reveal panel | Game master | After close, verified against the commitment. What the machines said becomes public. |
| Reveal guess | Solver | Within 2 days of the author's reveal. Unrevealed guesses count as wrong. |
| Settle | Anyone | After the reveal window. Outcome and payouts are booked; players pull with `withdraw()`. |

### Outcomes

| Outcome | Condition | Author | Correct solvers |
|---------|-----------|--------|-----------------|
| **STUMPED** | no panel answer matches, ≥ 1 human correct | 40% of pot + RON | split 60% of pot + RON |
| **MACHINE_SOLVED** | any panel answer matches | nothing | split 25% of pot + RON |
| **UNSOLVED** | panel missed, no human correct | nothing | — |
| **VOIDED** | author never revealed | nothing | entry cost refunded to every entrant |

Unspent pot returns to the contract's free balance. Answers are compared in the canonical form
from `contracts/scripts/game/riddleAnswers.js` (NFKC, lowercase, whitespace collapsed, quotes
and trailing `.!?` stripped, leading a/an/the dropped), so "An Echo!" and "echo" match.

### Economics (initial, admin-tunable with `setEconomics`)

| Difficulty | Pot | Entry |
|------------|-----|-------|
| Easy | 10,000 RDLN | 10 RDLN |
| Medium | 25,000 | 25 |
| Hard | 60,000 | 50 |
| Legendary | 150,000 | 100 |

The contract reserves each pot at open time and refuses to open when underfunded, so it can
never promise RDLN it doesn't hold. `sweep` moves only unreserved balance.

## The panel

`contracts/scripts/stump/lib.js` → `runPanel`. Runs through **Vercel AI Gateway**
(`AI_GATEWAY_API_KEY`, OpenAI-compatible endpoint) so one code path covers every lab. Default
panel: `anthropic/claude-opus-5`, `openai/gpt-6-astra`, `google/gemini-3.8-flash`, 2 samples
each, 3 guesses per sample, deduplicated, capped at 32. Three labs make "no AI could solve
this" a real claim and protect the game from one lab's blind spots. Without a gateway key it
falls back to the Anthropic SDK with Claude-only models. `PANEL_MODELS`, `PANEL_SAMPLES` and
`SCREEN_MODEL` override; `PANEL_STUB="a|b"` replaces the API for rehearsals. Transcripts are
saved with the salt in `contracts/game-master/` (gitignored) and can be published after reveal.

Matching is exact on the canonical form. Authors list up to 8 accepted alternatives
("keyboard / computer keyboard"); a solver or a panel guess counts if it equals any of them.

Trust: the game master sees the panel result before humans play and could leak or lie. Same
trust as the existing commit-reveal game master. Mitigations available later: a multi-party or
TEE-run panel, or validators who can dispute using the published transcripts.

## Deployment (Polygon Amoy)

| | Address |
|---|---|
| StumpTheMachine proxy | `0x660cEF782AEc87b0667De610B2077A9A4B81dB14` |
| Implementation | `0x963707Fc16F0c3E3f660654dD906cfA41bf567d3` (upgraded 2026-09-27: authors may list up to 8 accepted answers; solvers reveal one) |
| Game master / admin / upgrader | `0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040` |
| RDLNFaucet (testnet only, 500 RDLN once per wallet, funded 250k) | `0xb6860Af03bb0FbD9b63322a7EbDaC29fd9aB7f7E` |

Deployed 2026-09-26 with `GAME_ROLE` on RDLN and RON and 1,000,000 RDLN prize funding. The
OpenZeppelin manifest is `contracts/.openzeppelin/unknown-80002.json` (gitignored; back it up).

## Runbook (game master)

All commands in `contracts/`. `PRIVATE_KEY`, `AMOY_RPC_URL` and `AI_GATEWAY_API_KEY` in
`contracts/.env` (`ANTHROPIC_API_KEY` works as a Claude-only fallback).

```bash
npx hardhat run scripts/stump/status.js --network amoy                 # funding, roles, every riddle
npx hardhat run scripts/stump/open-challenge.js --network amoy         # list pending submissions
ID=3 npx hardhat run scripts/stump/open-challenge.js --network amoy    # run the panel, dry run
CONFIRM=yes ID=3 DURATION=86400 npx hardhat run scripts/stump/open-challenge.js --network amoy
CONFIRM=yes ID=4 REJECT="not a riddle" npx hardhat run scripts/stump/open-challenge.js --network amoy
npx hardhat run scripts/stump/reveal-panel.js --network amoy           # after close: reveal panels
FINALIZE=yes npx hardhat run scripts/stump/reveal-panel.js --network amoy   # also settle when allowed
RIDDLE="..." npx hardhat run scripts/stump/panel-dry-run.js            # try the panel off-chain
./scripts/stump/rehearse-local.sh                                      # whole flow on a local node
```

Keep `contracts/game-master/*-stump-*.json` safe until the panel is revealed: without the salt
the panel can't be revealed and the riddle can't settle (players would be stuck until an admin
sweeps; there is no escape hatch on purpose, so back the files up).

### Unattended mode

`scripts/stump/cron.js` does one full pass: screens new submissions with a Haiku call (rejects
spam), runs the panel and opens up to `MAX_OPEN` (6) riddles at once with at most 2 pending per
author, reveals panels for closed riddles, and settles anything whose reveal window has passed.
`.github/workflows/stump-game-master.yml` runs it every 15 minutes once the repository secrets
`GAME_MASTER_PRIVATE_KEY` and `AI_GATEWAY_API_KEY` exist and the `if: false` line is removed.
The workflow caches `contracts/game-master/` between runs; keep a second backup of it.

### Running cost

Only the panel bills, on the AI Gateway account: about $0.10–0.20 per riddle at typical
lengths (three flagships, two samples each, 4,000 output-token cap), worst case under $0.50.
The Haiku screening call is a fraction of a cent.
Amoy gas is free; GitHub Actions is free for a public repository.

## Frontend

`web/` is the new Riddlen site (Next.js 14, wagmi v2, no CSS framework). Board with a featured
open riddle, riddle pages (`/r/<id>`) with a stage timeline and the machines' sealed-then-
revealed guesses, `/write` with accepted-answer alternatives, `/winnings`, and `/free`, the
sticker landing for the faucet ("Free Riddlen": scan, connect, take your Riddlen). Old
riddlen.com URLs redirect permanently. Deploy on Vercel with root directory `web`; the
contract addresses are public defaults in `lib/wagmi.js` and `.env.example`. Author salts and
solver nonces are wallet signatures over the riddle hash / riddle id, so reveals work from
any device with the same wallet. `frontend-staging/pages/stump.js` remains as the earlier
proof of flow and can be deleted with the old apps in the repo reorg.

## Tests

- `test/StumpTheMachine.test.js`: 20 tests, every outcome and window.
- `test/StumpTheMachine.deployed.test.js`: full round against `RDLNDeployed` + `RONAdvanced`,
  plus upgrade-safety validation.
- `test/stumpAnswers.crosscheck.test.js`: frontend (viem) and game-master (ethers) seals match.
- `scripts/stump/rehearse-local.sh`: the real scripts, end to end, on a local node.

## Open items

1. ~~RDLN for new players~~: faucet deployed, button on the game page.
2. ~~Panel automation~~: `cron.js` + workflow; needs the two repository secrets.
3. **Sybil solvers.** Entry cost is the only cost of a second wallet. Adding the humanity gate
   (`enterAsHuman` pattern) to `enter` is a small change when a verifier is worth its friction.
4. **Author collusion.** An author can tell a friend the answer. It costs the friend an entry and
   earns the pair at most the pot; larger pots need the human-solver minimum raised above 1 or
   solver-count-scaled payouts.
5. ~~Site redesign~~: `web/`. Next: point riddlen.com at the Vercel project, rewrite riddlen.org docs.
