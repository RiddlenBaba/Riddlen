import { encodeAbiParameters } from 'viem';

// Server-side only. Signs the EIP-712 HumanEntry that AttestedHumanityGate verifies on-chain.
// Must match contracts/contracts/humanity/AttestedHumanityGate.sol exactly.

export const HUMAN_ENTRY_TYPES = {
  HumanEntry: [
    { name: 'player', type: 'address' },
    { name: 'humanId', type: 'bytes32' },
    { name: 'sessionId', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
};

/** Attestations expire quickly so they can't be stockpiled or resold (contract max: 1 hour) */
export const ATTESTATION_TTL_SECONDS = 600;

/** World ID action for one riddle session: one proof (and one nullifier) per human per session */
export function sessionAction({ chainId, gameContract, sessionId }) {
  return `riddlen:${chainId}:${gameContract.toLowerCase()}:${sessionId}`;
}

/** World ID nullifiers are field elements; left-pad to bytes32 for the on-chain humanId */
export function nullifierToHumanId(nullifier) {
  const value = BigInt(nullifier);
  if (value === 0n || value >= 2n ** 256n) throw new Error('Invalid nullifier');
  return `0x${value.toString(16).padStart(64, '0')}`;
}

/**
 * @param account viem LocalAccount for an address holding ATTESTER_ROLE on the gate
 * @returns the `proof` bytes to pass to RiddleNFTAdvanced.enterAsHuman
 */
export async function signHumanEntry({ account, chainId, gate, player, humanId, sessionId, now }) {
  const deadline = BigInt(now ?? Math.floor(Date.now() / 1000)) + BigInt(ATTESTATION_TTL_SECONDS);
  const signature = await account.signTypedData({
    domain: { name: 'RiddlenHumanityGate', version: '1', chainId, verifyingContract: gate },
    types: HUMAN_ENTRY_TYPES,
    primaryType: 'HumanEntry',
    message: { player, humanId, sessionId: BigInt(sessionId), deadline },
  });
  const proof = encodeAbiParameters(
    [{ type: 'bytes32' }, { type: 'uint256' }, { type: 'bytes' }],
    [humanId, deadline, signature],
  );
  return { proof, deadline };
}
