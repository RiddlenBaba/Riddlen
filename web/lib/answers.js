import { encodeAbiParameters, keccak256, toHex } from 'viem';

// Must stay identical to contracts/scripts/game/riddleAnswers.js. Checked by
// contracts/test/stumpAnswers.crosscheck.test.js against the same vectors.

/**
 * Canonical answer form: Unicode NFKC, lowercase, trimmed, internal whitespace collapsed,
 * surrounding quotes, trailing sentence punctuation and a leading article (a/an/the) removed.
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

export function canonicalAnswers(answers) {
  return answers.map(normalizeAnswer);
}

/** "keyboard / computer keyboard" -> ["keyboard", "computer keyboard"], deduplicated */
export function splitAlternatives(text) {
  return [...new Set(canonicalAnswers(String(text).split('/')).filter(Boolean))];
}

export function nonceFromSignature(signature) {
  return keccak256(signature);
}

/** keccak256(abi.encode(address(this), author, answers, salt)) */
export function authorCommitment({ contract, author, answers, salt }) {
  return keccak256(encodeAbiParameters(
    [{ type: 'address' }, { type: 'address' }, { type: 'string[]' }, { type: 'bytes32' }],
    [contract, author, canonicalAnswers(answers), salt],
  ));
}

/** keccak256(abi.encode(address(this), solver, id, answers, nonce)) */
export function guessCommitment({ contract, solver, id, answers, nonce }) {
  return keccak256(encodeAbiParameters(
    [{ type: 'address' }, { type: 'address' }, { type: 'uint256' }, { type: 'string[]' }, { type: 'bytes32' }],
    [contract, solver, BigInt(id), canonicalAnswers(answers), nonce],
  ));
}

/**
 * The author's salt comes from signing a message that includes the riddle text, so it can be
 * re-derived at reveal time from what's on chain. Same wallet + same riddle = same salt.
 */
export function authorSaltMessage({ chainId, contract, riddle }) {
  return [
    'Riddlen: seal your riddle answer',
    `Chain: ${chainId}`,
    `Contract: ${contract.toLowerCase()}`,
    `Riddle: ${keccak256(toHex(riddle))}`,
    '',
    'Signing is free and sends no transaction. It creates the secret that seals your answer.',
  ].join('\n');
}

export function guessNonceMessage({ chainId, contract, id }) {
  return [
    'Riddlen: seal your guess',
    `Chain: ${chainId}`,
    `Contract: ${contract.toLowerCase()}`,
    `Riddle: ${id}`,
    '',
    'Signing is free and sends no transaction. It creates the secret that seals your guess.',
  ].join('\n');
}

// Per-viewer convenience: remember what was typed so reveals don't need retyping.
function key(kind, { chainId, contract, id, who }) {
  return `riddlen:stump:${kind}:${chainId}:${contract.toLowerCase()}:${id}:${who.toLowerCase()}`;
}
export function saveLocal(kind, ids, record) {
  try { localStorage.setItem(key(kind, ids), JSON.stringify(record)); } catch {}
}
export function loadLocal(kind, ids) {
  try { const raw = localStorage.getItem(key(kind, ids)); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
