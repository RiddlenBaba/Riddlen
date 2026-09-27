# Game Core Security Audit Report

**Contracts:** RiddleNFTAdvanced, RONUpgradeable, RDLNUpgradeable, RiddlenDAO (plus RiddlenGameNFT review)
**Audit Date:** September 26, 2026
**Auditor:** Claude Code Security Analysis
**Solidity Version:** ^0.8.22 (compiled with 0.8.24, OpenZeppelin 5.4.0)
**Commit:** Uncommitted working tree on `main` (after 1b14764)
**Method:** Manual review, Slither, Hardhat PoCs, Foundry invariant fuzzing, targeted mutation testing

## Executive Summary

**Overall Risk Level (before fixes):** 🔴 CRITICAL. The deployed game could not be won, charged
players twice, and would lock out regular players.
**Overall Risk Level (after fixes):** 🟡 MEDIUM. The open items are trust and economics issues,
not broken core flows.
**Testnet Ready:** YES, after upgrading RiddleNFTAdvanced and RONUpgradeable
**Mainnet Ready:** NO. RDLN exceeds the contract size limit, and admin burn powers need review.

### Risk Distribution
| Severity | Found | Fixed | Open |
|----------|-------|-------|------|
| 🔴 Critical | 3 | 3 | 0 |
| 🟠 High | 5 | 3 | 2 |
| 🟡 Medium | 6 | 1 | 5 |
| 🟢 Low / ℹ️ Info | 5 | 1 | 4 |

---

## 🔴 Critical

### C-1: No riddle can ever be solved — FIXED
`RiddleNFTAdvanced.submitAnswer` compared the submitted hash against `session.correctAnswerHashes`,
which nothing ever wrote. Every call reverted with panic 0x32, correct answers included. Even if
the array had been populated, on-chain answer hashes can be read from storage, and short answers
fall to a dictionary attack.

**Fix:** a commit-reveal flow replaces `submitAnswer`:
1. The game master commits `keccak256(abi.encode(nft, sessionId, answers, salt))` before the start
   (`commitSolution`). Starting a session requires it.
2. Players commit `keccak256(abi.encode(nft, player, sessionId, answers, nonce))` before `endTime`
   (`commitAnswer`). Binding the player's address makes a copied commitment worthless.
3. After `endTime` the game master reveals the answers and salt (`revealSolution`), and players
   reveal within `REVEAL_WINDOW` (2 days, `revealAnswer`).
4. Anyone calls `finalizeSession` (paginated). The first `winnerSlots` correct commits by commit
   time win. Wrong or unrevealed commits pay the failed-attempt penalty, so staying silent to
   dodge it doesn't work.

New state lives in ERC-7201 namespaced storage, so the deployed proxy's layout is unchanged.
**Frontend impact:** solving now takes two transactions, commit and later reveal, and answers
must be normalized the same way (case, whitespace) by the game master and by players.

### C-2: Mint charged twice, half stranded — FIXED
`mintRiddleAccess` ran `transferFrom(player → NFT, cost)` and then `rdlnToken.burnNFTMint(player, cost)`,
which pulls `cost` from the player a second time. The first payment was stuck in the NFT contract,
which has no withdraw function. PoC: a 1,000 RDLN mint cost 2,000 RDLN.

### C-3: RON governance recorded no votes — FIXED
`RONUpgradeable._updateVotingPower` moved votes from a user to the same user, which OpenZeppelin
Votes treats as a no-op. `getPastVotes` and `getPastTotalSupply` were always 0, so the DAO saw no
votes at all. Re-delegating after earning more RON reverted. The √ scale was also off by 1e9.
**Fix:** mint/burn vote semantics, auto self-delegation on first award, correct √RON × 1e18 scale.

---

## 🟠 High

### H-1: Prize promises could exceed the session pool — FIXED
The 1.5x first-solver bonus was added on top of `prizePool / winnerSlots`, so a full session
promised `pool + 0.5 share`. With `winnerSlots = 1`, a 6.67M RDLN pool promised 10.0M. Payouts
come from the shared contract balance, so this spends other sessions' money. Found by Foundry
(`test_fullSlotsStayWithinPool`).
**Fix:** `share = 2·pool / (2·slots + 1)`, first solver gets 1.5 shares. A full session pays at
most `prizePool`.

### H-2: Honest players locked out by the "device fingerprint" — FIXED
The fingerprint `keccak(user, day, tx.origin)` always matches the same user's own earlier
actions. After 5 same-day actions every call reverted with "Suspicious activity detected", and
the score never decays. Removed; the 30-second action spacing remains.

### H-3: Wrong-answer penalty charged twice — FIXED
`_applyBurnPenalty` pulled the amount with `transferFrom` and then called `burnFailedAttempt`,
which charges it again.

### H-4: RDLNUpgradeable exceeds the 24 KiB contract size limit — OPEN
34.4 KiB deployed. Polygon will reject both a fresh deploy and an upgrade to this implementation.
Split the creator-economy and treasury logic into separate contracts or libraries.

### H-5: Admin can burn any holder's tokens — OPEN
`emergencyBurn` (BURNER_ROLE, only while paused) burns from any account, and the admin holds
PAUSER, BURNER and DEFAULT_ADMIN. Pause, burn, unpause is a rug vector that contradicts the
"rug-proof treasury" claim. Recommend removing it, or limiting it to a timelocked DAO.

---

## 🟡 Medium

### M-1: RON reward size is chosen by whoever finalizes — OPEN
`_calculateRONReward` uses `min + block.timestamp % range`, and anyone can call `finalizeSession`.
A winner can simulate it and submit only when their LEGENDARY roll is near 10,000 instead of 1,000.
Derive the roll from `solutionHash` and the player instead, since that is fixed at reveal.

### M-2: DAO proposal threshold on the wrong scale — OPEN
The threshold is `10_000e18` votes, while √RON voting gives 100e18 for 10K RON, so proposing takes
100M RON. The docs also still say "1 RON = 1 vote".

### M-3: DAO rising quorum schedule never applies — OPEN
`RiddlenDAO` overrides the no-argument `quorumNumerator()`, but `quorum(timepoint)` calls the
`quorumNumerator(timepoint)` overload.

### M-4: RDLN supply can exceed the 1B cap — OPEN
`initialize` mints 1M RDLN outside any allocation.

### M-5: Zero-RON accounts had basic validation access — FIXED
SEEKER is the floor tier, so `getOracleAccess` granted basic validation to empty addresses.
It now requires `totalRON >= SEEKER_THRESHOLD`.

### M-6: RiddlenGameNFT accepts any non-empty solution — OPEN
`_validateSolution` returns `bytes(solutionIPFS).length > 0`. It is a placeholder, but it must not
ship. Reuse the commit-reveal pattern from C-1.

---

## 🟢 Low / ℹ️ Info

- **Fixed:** `_getTokenIdForUser` scanned every NFT ever minted (gas grew without bound). Replaced
  by a per-session mapping.
- `RDLNUpgradeable.gameplayBurned` is never written, so `getBurnStats()` always reports 0.
- Session parameters use `block.timestamp`/`prevrandao` PRNG. Low risk, since the game master
  already controls session creation.
- The DAO voting delay assumes 12-second blocks. On Polygon (~2 s) "1 day" is about 4 hours.
- The game master must not also play: they know the answers. Use a separate key or multisig.

---

## Deployment Notes

- **RiddleNFTAdvanced upgrade:** storage layout is preserved (new state is namespaced). Sessions
  created before the upgrade have `endTime = 0` and can't take mints; nobody could solve them
  anyway. Fund prizes explicitly with `RDLN.mintPrizePool(nft, amount)`, since stranded
  double-charges will no longer build up in the contract.
- **RON:** the deployed RON (`0xD86b…`) is **`RONAdvanced`**, not `RONUpgradeable`, and the storage
  layouts are incompatible. The C-3 voting fix and M-5 therefore apply to a contract that is not
  deployed. `RONUpgradeable` can only ship as a fresh deployment plus a reputation migration.
  The game upgrade does not need it: `RONAdvanced` exposes the same `getUserTier` and `awardRON`
  selectors.
- **RDLN:** the working-tree `RDLNUpgradeable` changes the deployed storage layout
  (`_trustedForwarderAddress` inserted first; 12 creator-economy variables inserted mid-layout).
  **Upgrading the live proxy to it would corrupt balances and accounting.** New state must be
  appended or namespaced. The game upgrade does not need a new RDLN: the deployed version's
  `burnNFTMint`, `burnFailedAttempt` and `mintPrizePool` are compatible.
- **Upgrade script:** `scripts/upgrades/upgrade-nft-commit-reveal.js` (dry run by default, local
  fork rehearsal via `SIMULATE_AS`, real upgrade only with `CONFIRM_UPGRADE=yes`). It is proven
  against the deployed-source copies by `test/RiddleNFTAdvanced.upgradeFromDeployed.test.js`.
  **Not yet verified on-chain:** run the dry run against Amoy first. It checks that `rdlnToken` and
  `ronToken` read back at the deployed layout's slots before validating.
- **Compiler:** `RiddleNFTAdvanced.sol` builds with a `runs: 1` override to stay under 24 KiB.

## Verification

See `AUDIT_RUNBOOK.md`. Summary at time of writing:
| Layer | Result |
|-------|--------|
| Slither | 68 results, core items triaged above |
| Hardhat (core suites) | 31/31 |
| Foundry invariants | 7/7, 25,600 calls per invariant, settlement reached |
| Mutation (commit-reveal guards) | 7/7 killed |
