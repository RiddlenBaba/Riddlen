# Audit Runbook

**Working directory for all commands**: `contracts/`

Adapted from the abbababa-platform 8-layer audit stack. Layers marked *not yet set up* have no
Riddlen harness yet.

---

## Environment Setup

```bash
npm install --package-lock=false
# OpenZeppelin must stay on 5.4.x: 5.6 removed ReentrancyGuardUpgradeable
npm install --no-save @openzeppelin/contracts@5.4.0 @openzeppelin/contracts-upgradeable@5.4.0
npx hardhat compile --force   # --force after moving the repo; the cache holds absolute paths
```

---

## Layer 1: Slither (Static Analysis)

```bash
slither . --filter-paths "node_modules|archive|mocks|test|interfaces" \
  --exclude-informational --exclude-low
```

Baseline (2026-09-26): 68 results. Triage of core contracts is in
`game-core-audit-2026-09-26.md`. Known false positives:
- `arbitrary-send-erc20` in `RDLNUpgradeable.claimRewards` (source is admin-set pool wallets)
- `uninitialized-local` in `RONUpgradeable` (difficulty branches are exhaustive)
- `reentrancy-no-eth` in `RiddleNFTAdvanced.finalizeSession` (only calls own RDLN/RON; `nonReentrant`)

---

## Layer 2: Hardhat (Unit Tests)

```bash
npx hardhat test
```

Baseline (2026-09-26): **151 passing, 85 failing**. The failures are stale tests written against
older contract APIs (removed `mint`/`batchMint`, archived `RON`/`RDLN`/`RONAdvanced`, changed
initializers). The suites that cover the current game must stay green:

```bash
npx hardhat test test/RONVoting.test.js \
  test/RiddleNFTAdvanced.commitReveal.test.js \
  test/RiddleNFTAdvanced.payments.test.js \
  test/RiddleNFTAdvanced.upgradeFromDeployed.test.js
```

Expected: **35 passing**.

`contracts/mocks/deployed/` holds test-only copies of the source believed deployed on Amoy
(RDLN and RiddleNFTAdvanced at HEAD, plus the archived RONAdvanced) so upgrades can be tested
against what is actually live.

---

## Layer 3: Foundry (Fuzz + Invariants)

```bash
forge test                       # default: 256 runs x depth 100 per invariant, ~1 min
FOUNDRY_PROFILE=ci forge test    # deeper: 1024 runs x depth 100
```

Expected: **7/7** (`test/foundry/RiddleGameInvariants.t.sol`).

The handler exposes one phase-aware `act()` entry point so random sequences reach settlement.
Check coverage with `-vv`: `afterInvariant` logs commits, correct reveals, finalized-with-winners
and claims. If those drop to zero, the invariants are passing vacuously.

Invariants:
| Invariant | Property |
|-----------|----------|
| `winnersWithinSlots` | never more winners than `winnerSlots` |
| `onlyTrueAnswersCountAsCorrect` | a wrong answer can never be marked correct |
| `prizesOnlyForCorrectReveals` | prizes only go to players who revealed a correct answer |
| `winnersAreEarliestCorrectCommits` | no correct solver loses to a later commit |
| `prizesWithinPool` | a session never promises more than its prize pool |

---

## Layer 4: Medusa — *not yet set up*

Next candidate: RDLN supply and allocation invariants.

## Layer 5: Halmos — *not yet set up*

## Layer 6: Certora — *not yet set up*

Needs `CERTORAKEY`; see the abbababa-platform runbook.

## Layer 7: Mutation Testing

Gambit is not configured yet. Manual targeted mutation of the commit-reveal guards (2026-09-26):
7/7 mutants killed by `RiddleNFTAdvanced.commitReveal.test.js`.

When mutating by hand, always restore with a trap so an interrupted run can't leave a mutant
in place:

```bash
cp contracts/nft/RiddleNFTAdvanced.sol /tmp/good.sol
trap 'cp /tmp/good.sol contracts/nft/RiddleNFTAdvanced.sol' EXIT INT TERM HUP
```

---

## Contract Size

```bash
npx hardhat size-contracts
```

Polygon enforces the 24 KiB limit.
| Contract | Size | Status |
|----------|------|--------|
| RiddleNFTAdvanced | 23.14 KiB | OK (compiled with `runs: 1` override in `hardhat.config.js`) |
| RDLNUpgradeable | 34.43 KiB | **Over limit, cannot be deployed** |
