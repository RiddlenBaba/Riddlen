---
layout: default
title: "For developers"
description: "Reading and writing the Riddlen game contract from your own code: functions, events, seals and the answer normalization."
permalink: /developers/
redirect_from:
  - /FRONTEND_INTEGRATION.html
  - /archive/2025/FRONTEND_INTEGRATION.html
  - /archive/2025/api/
  - /api/
---

# For developers

The game is one contract with a small surface. Anything the site does, you can do from a script,
a bot that plays badly, or your own front end.

## Reading

```solidity
function challengeCount() external view returns (uint256);
function getChallenge(uint256 id) external view returns (
    address author, Status status, Difficulty difficulty, Outcome outcome,
    uint64 endTime, uint64 authorRevealedAt, uint32 entrants, uint32 correct,
    bool panelRevealed, bool panelSolved, uint256 pool, uint256 entryCost, string riddle);
function getReveals(uint256 id) external view returns (
    string[] answers, string[] panelAnswers, address[] solvers);
function getEntry(uint256 id, address solver) external view returns (Entry);
function isAccepted(uint256 id, string answer) external view returns (bool);
function owed(address who) external view returns (uint256);
function poolByDifficulty(uint256 d) external view returns (uint256);
function entryCostByDifficulty(uint256 d) external view returns (uint256);
```

`Status`: `NONE, SUBMITTED, OPEN, VOID, REJECTED, FINALIZED`. `Difficulty`: `EASY, MEDIUM, HARD,
LEGENDARY`. `Outcome`: `PENDING, STUMPED, MACHINE_SOLVED, UNSOLVED, VOIDED`.

Riddle ids start at 1 and are dense, so `1..challengeCount()` is every riddle. The site derives a
phase from `status`, `endTime`, `authorRevealedAt`, `panelRevealed` and `REVEAL_WINDOW` (2 days).

## Writing

```solidity
function submit(string riddle, Difficulty d, bytes32 answerCommitment) external returns (uint256 id);
function revealAnswer(uint256 id, string[] answers, bytes32 salt) external;   // author
function enter(uint256 id) external;
function sealGuess(uint256 id, bytes32 commitment) external;
function revealGuess(uint256 id, string[] answers, bytes32 nonce) external;   // answers.length == 1
function finalize(uint256 id) external;                                       // anyone
function claimRefund(uint256 id) external;                                    // voided riddles
function withdraw() external;
```

No approvals are needed: the RDLN token's game functions charge the caller directly because the
game holds `GAME_ROLE` on the token.

## Seals

```
answerCommitment = keccak256(abi.encode(game, author, string[] answers, bytes32 salt))
guessCommitment  = keccak256(abi.encode(game, solver, uint256 id, string[] answers, bytes32 nonce))
panelCommitment  = keccak256(abi.encode(game, uint256 id, string[] answers, bytes32 salt))
```

`answers` must be in canonical form (below). The site derives `salt` and `nonce` from a wallet
signature over a fixed message so they can be recreated later; any 32 random bytes work if you
keep them.

## Answer normalization

Implement it exactly or your reveals will fail:

1. Unicode NFKC
2. lowercase
3. collapse runs of whitespace to one space, trim
4. strip surrounding straight or curly quotes
5. strip trailing `.`, `!`, `?`
6. strip one leading `a `, `an ` or `the `
7. trim

Reference implementations: `contracts/scripts/game/riddleAnswers.js` (ethers) and
`web/lib/answers.js` (viem). A test checks they produce identical seals.

## Events

`ChallengeSubmitted(id, author, difficulty, stake)`, `ChallengeOpened(id, endTime, pool,
entryCost)`, `ChallengeRejected(id, reason)`, `Entered(id, solver)`, `GuessSealed(id, solver)`,
`AuthorRevealed(id, answers)`, `PanelRevealed(id, answers)`, `GuessRevealed(id, solver,
correct)`, `ChallengeFinalized(id, outcome, correct, authorPaid, perSolver)`, `Withdrawn(to,
amount)`.

## ABI and addresses

Compile the repository and run `npm run generate:abi` in `web/` to get a trimmed ABI, or take
it from `contracts/artifacts/contracts/nft/StumpTheMachine.sol/StumpTheMachine.json`.
Addresses are on [Contracts and addresses](/contracts/).
