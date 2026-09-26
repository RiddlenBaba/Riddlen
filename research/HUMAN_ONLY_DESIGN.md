# Human-Only Riddlen

Riddlen's reason to exist is a game that humans win and machines don't. If bots or AI agents can
farm it, it loses its point. This document records how the game gets there, what's built, and
what's still open. Written 2026-09-26.

## Threat model

| Threat | Example | Defense |
|--------|---------|---------|
| Answer copying / front-running | Watching the mempool or other players' submissions | **Commit-reveal** (live): answers stay sealed until entries close, and commitments are bound to the wallet |
| Bot farms | One operator entering with 1,000 wallets | **Proof of personhood** (built, not yet enabled): one verified human = one entry per session |
| AI solving | A bot, or a human, pasting the riddle into a model | **Formats AI is bad at** (consensus mode built; more planned) |
| Identity rental | A verified human renting their World ID to a bot operator | Fresh proof per session (the person must be present each time); prizes per human kept below rental value |

No single layer is enough. Personhood decides **who** plays; the format decides whether **AI help**
is worth anything.

## What AI can and can't do (as of September 2026)

Research summary (sources in the linked reports):

- **Solved by AI; retire:** single-answer text riddles (the current format), cryptic clues, image
  and audio CAPTCHAs (free local models pass reCAPTCHA ~93% of the time), "where was this photo
  taken" puzzles.
- **Falling fast:** novel interactive puzzles. ARC-AGI-3 went from under 1% AI success at launch
  (March 2026) to 100% of the public set with memory-carrying agents by August.
- **Holds up:**
  - **Human consensus / cultural salience:** models converge on the same answers and miss
    human focal points.
  - **Tasks tied to the physical world:** with camera-signed (C2PA) photos, e.g. Pixel 10.
  - **Adversarial authoring:** riddles players write specifically to beat a panel of current
    models.

## Formats

| Format | Status | How it works |
|--------|--------|--------------|
| **Exact riddle** | Live | Game master commits a salted solution; exact (normalized) answers win. AI-solvable: fine for onboarding, not for prizes that matter |
| **Read the Room** (consensus) | Built (`enableConsensusMode`) | No hidden answer. Players seal what they think most humans will say; the most common revealed answers (shared by at least 2) win. Bots converge on one model answer and lose to human focal points. Risk: an off-chain group coordinating one answer, which is why large verified pools matter |
| **Stump the Machine** | Planned (separate contract) | Players write riddles; a riddle pays only if a panel of frontier models fails it **and** verified humans solve it. Gets harder for AI as AI improves |
| **Field Riddle** | Planned | Solve, then go there: a camera-signed photo with a code revealed at session start. Durable for years; needs validator review and C2PA verification |

## Proof of personhood

No unique-human verifier contract exists on Polygon PoS or Amoy. World ID 4.0 is only on World
Chain and Arc; zkPassport and Self are on other chains. So Riddlen uses an **attestation gate**:

```
player ── World ID (IDKit) ──▶ /api/humanity/attest (Vercel)
                                  1. verify proof with World's v4 endpoint
                                  2. record nullifier in Supabase (unique per session)
                                  3. sign EIP-712 HumanEntry{player, humanId, sessionId, deadline ≤1h}
player ── enterAsHuman(sessionId, pass) ──▶ RiddleNFTAdvanced
                                  gate.verifyHuman() → humanId; reject a second entry by the same human
```

- **Action per session:** `riddlen:<chainId>:<game>:<sessionId>`. The World ID nullifier is unique
  per human per session, so a verified human must be present for every session.
- **On-chain:** `IHumanityGate` is pluggable. When a native verifier reaches Polygon (or the game
  moves to a chain that has one), replace the attester with an adapter; nothing else changes.
- **No side door:** once a gate is set, plain `mintRiddleAccess` reverts.
- **Supabase** holds only used nullifiers: no names, no biometrics, no wallet history beyond the
  one address per entry pass.

### Built and tested

- `IHumanityGate`, `AttestedHumanityGate`, `RiddleNFTAdvanced.enterAsHuman` (13 tests).
- Consensus mode (10 tests, 5/5 fairness mutants caught).
- `frontend-staging/lib/humanity/attestation.js`: the signer, cross-checked against the on-chain gate.
- `frontend-staging/pages/api/humanity/attest.js`: the verifier route.
- `supabase/migrations/20260926000000_humanity_nullifiers.sql`.

### Still to do before enabling

1. **World developer portal:** create the app, get `app_id` / `rp_id`, and use staging for Amoy.
2. **rp_context signing:** IDKit 4.0 requests need a server-signed request context. The public
   docs don't specify the scheme, so wire it in with World's SDK rather than hand-rolling it.
3. **Signal binding:** bind the proof to the player's wallet, so an intercepted proof can't be
   redeemed for another wallet. Also confirm how the v4 verify endpoint checks the signal.
4. **Deploy and connect:**
   - Deploy `AttestedHumanityGate` on Amoy with a dedicated attester key (a KMS/secret store, never
     the deployer key).
   - Upgrade the game contract, then call `setHumanityGate`.
   - Set the Vercel environment variables and run the Supabase migration.
5. **Frontend:** add the IDKit widget to the entry step, and add consensus-mode copy.

## Residual risks

- **A verified human using AI.** Personhood can't see this. Formats have to make AI help worth
  little, and exact riddles should not carry large prizes.
- **The attester is a trusted key.** Mitigations: short-lived passes, a rotatable `ATTESTER_ROLE`,
  a KMS-held key, and a plan to replace it with native verification.
- **Identity rental** is real (verified identities are sold). Per-session fresh proofs raise the
  cost; keep prize value per human per period modest.
- **World ID coverage** depends on Orb access. A passport-based route (zkPassport/Self) through the
  same attester is the next option for reach, but passports are one per document, not one per person.
- **Consensus collusion:** a coordinated group can pick one answer off-chain. Verified-only
  entry, large pools and rotating prompts limit it.
