import { encodeAbiParameters, keccak256 } from 'viem';

// Must stay identical to contracts/scripts/game/riddleAnswers.js — the game master
// commits the solution with that copy, players commit with this one. Both are checked
// against contracts/test/fixtures/answer-vectors.json.

/**
 * Canonical answer form: Unicode NFKC, lowercase, trimmed, internal whitespace collapsed,
 * surrounding quotes, trailing sentence punctuation and a leading article (a/an/the) removed.
 * "  The Statue of LIBERTY! " -> "statue of liberty";  "An echo." -> "echo"
 */
export function normalizeAnswer(raw) {
  return String(raw)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
    .replace(/[.!?]+$/g, '')
    .replace(/^(a|an|the) (?=\S)/, '')
    .trim();
}

/** The exact strings committed and later sent to revealAnswer / revealSolution */
export function canonicalAnswers(answers) {
  return answers.map(normalizeAnswer);
}

/**
 * Message a player signs to derive their commitment nonce. Signing the same message with
 * the same wallet reproduces the nonce, so a reveal works from any device.
 */
export function nonceMessage({ chainId, contract, sessionId }) {
  return [
    'Riddlen answer commitment',
    `Chain: ${chainId}`,
    `Contract: ${contract.toLowerCase()}`,
    `Session: ${sessionId}`,
    '',
    'Signing is free and sends no transaction. It creates the secret that seals your answer.',
  ].join('\n');
}

export function nonceFromSignature(signature) {
  return keccak256(signature);
}

/** keccak256(abi.encode(address(this), msg.sender, sessionId, answers, nonce)) */
export function playerCommitment({ contract, player, sessionId, answers, nonce }) {
  return keccak256(
    encodeAbiParameters(
      [{ type: 'address' }, { type: 'address' }, { type: 'uint256' }, { type: 'string[]' }, { type: 'bytes32' }],
      [contract, player, BigInt(sessionId), canonicalAnswers(answers), nonce],
    ),
  );
}

/** keccak256(abi.encode(address(this), sessionId, answers, salt)) — game master side */
export function solutionCommitment({ contract, sessionId, answers, salt }) {
  return keccak256(
    encodeAbiParameters(
      [{ type: 'address' }, { type: 'uint256' }, { type: 'string[]' }, { type: 'bytes32' }],
      [contract, BigInt(sessionId), canonicalAnswers(answers), salt],
    ),
  );
}

// Local convenience copy of the answer so players don't have to retype it at reveal time.
// Losing it is fine: the nonce can be re-derived by signing again, and the answer retyped.
function storageKey({ chainId, contract, sessionId, player }) {
  return `riddlen:commit:${chainId}:${contract.toLowerCase()}:${sessionId}:${player.toLowerCase()}`;
}

export function saveCommit(ids, record) {
  try {
    localStorage.setItem(storageKey(ids), JSON.stringify(record));
  } catch {}
}

export function loadCommit(ids) {
  try {
    const raw = localStorage.getItem(storageKey(ids));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
