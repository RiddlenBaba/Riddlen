import { getAddress, isAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonAmoy } from 'viem/chains';
import { CONTRACTS } from '../../../lib/wagmi';
import { nullifierToHumanId, sessionAction, signHumanEntry } from '../../../lib/humanity/attestation';

/**
 * POST /api/humanity/attest
 * body: { player, sessionId, idkitResult }
 *
 * 1. Verifies the World ID proof with World's v4 verify endpoint (payload forwarded as-is)
 * 2. Records the nullifier for this session in Supabase (unique per human per session)
 * 3. Returns an EIP-712 entry pass for RiddleNFTAdvanced.enterAsHuman
 *
 * Environment (server only, set in Vercel):
 *   WORLD_RP_ID, WORLD_ENVIRONMENT ("production" | "staging"),
 *   ATTESTER_PRIVATE_KEY (address must hold ATTESTER_ROLE on the gate),
 *   HUMANITY_GATE_ADDRESS, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Not yet wired: IDKit 4.0 requests also need a server-signed rp_context, and the proof's
 * signal should be bound to the player's wallet. Both need World's SDK and portal keys; see
 * research/HUMAN_ONLY_DESIGN.md.
 */

const REQUIRED_ENV = [
  'WORLD_RP_ID', 'WORLD_ENVIRONMENT', 'ATTESTER_PRIVATE_KEY',
  'HUMANITY_GATE_ADDRESS', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY',
];

function fail(res, status, error) {
  return res.status(status).json({ error });
}

async function recordNullifier({ action, nullifier, player, sessionId }) {
  const base = `${process.env.SUPABASE_URL}/rest/v1/humanity_nullifiers`;
  const headers = {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    'content-type': 'application/json',
  };
  const row = { action, nullifier: BigInt(nullifier).toString(), player: player.toLowerCase(), session_id: sessionId.toString() };

  const insert = await fetch(base, { method: 'POST', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify(row) });
  if (insert.ok) return { ok: true };
  if (insert.status !== 409) throw new Error(`Supabase insert failed (${insert.status})`);

  // Same human asking again: allow a re-issue to the same wallet (e.g. their entry tx failed),
  // never to a different one. The contract still admits them only once.
  const query = `${base}?action=eq.${encodeURIComponent(action)}&nullifier=eq.${row.nullifier}&select=player`;
  const existing = await (await fetch(query, { headers })).json();
  return { ok: existing?.[0]?.player === row.player };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'POST only');
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length) return fail(res, 503, 'Human verification is not configured');

  const { player, sessionId, idkitResult } = req.body ?? {};
  if (!isAddress(player ?? '')) return fail(res, 400, 'Invalid player address');
  let session;
  try { session = BigInt(sessionId); } catch { return fail(res, 400, 'Invalid session id'); }
  if (session <= 0n) return fail(res, 400, 'Invalid session id');
  if (!idkitResult || typeof idkitResult !== 'object') return fail(res, 400, 'Missing World ID proof');

  const action = sessionAction({ chainId: polygonAmoy.id, gameContract: CONTRACTS.RIDDLE_NFT, sessionId: session });
  if (idkitResult.action !== action) return fail(res, 400, 'Proof is for a different riddle');
  if (idkitResult.environment !== process.env.WORLD_ENVIRONMENT) return fail(res, 400, 'Proof is from the wrong World ID environment');
  const nullifier = idkitResult.responses?.[0]?.nullifier;
  if (!nullifier) return fail(res, 400, 'Proof has no nullifier');

  const verify = await fetch(`https://developer.world.org/api/v4/verify/${process.env.WORLD_RP_ID}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(idkitResult),
  });
  if (!verify.ok) return fail(res, 400, 'World ID verification failed');

  let humanId;
  try { humanId = nullifierToHumanId(nullifier); } catch { return fail(res, 400, 'Invalid nullifier'); }

  try {
    const recorded = await recordNullifier({ action, nullifier, player, sessionId: session });
    if (!recorded.ok) return fail(res, 409, 'This person has already entered this riddle');
  } catch (err) {
    console.error(err);
    return fail(res, 502, 'Could not record verification');
  }

  const account = privateKeyToAccount(process.env.ATTESTER_PRIVATE_KEY);
  const { proof, deadline } = await signHumanEntry({
    account, chainId: polygonAmoy.id, gate: getAddress(process.env.HUMANITY_GATE_ADDRESS),
    player: getAddress(player), humanId, sessionId: session,
  });
  return res.status(200).json({ proof, deadline: deadline.toString(), humanId });
}
