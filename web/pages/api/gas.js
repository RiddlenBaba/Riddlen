import { createPublicClient, createWalletClient, http, isAddress, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonAmoy } from 'viem/chains';

// Testnet gas drip. Sends a little POL to a wallet that has almost none, so a new player can
// claim Riddlen and play without hunting for a faucet. The drip wallet holds only test POL.
// Env: GAS_DRIP_PRIVATE_KEY (required), GAS_DRIP_AMOUNT (POL, default 0.05),
//      GAS_DRIP_THRESHOLD (refuse if the wallet already has more, default 0.02).

const RPC = process.env.NEXT_PUBLIC_AMOY_RPC_URL || 'https://polygon-amoy-bor-rpc.publicnode.com';
const recent = new Map(); // best-effort per-instance rate limit: address|ip -> timestamp

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.GAS_DRIP_PRIVATE_KEY;
  if (!key) return res.status(503).json({ error: 'Gas drip is not configured yet.' });

  const to = (req.body?.address || '').trim();
  if (!isAddress(to)) return res.status(400).json({ error: 'Bad address.' });
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString().split(',')[0].trim();
  const now = Date.now();
  for (const k of [to.toLowerCase(), ip]) {
    if (k && recent.has(k) && now - recent.get(k) < 6 * 3600 * 1000) {
      return res.status(429).json({ error: 'Already dripped recently. Try again in a few hours.' });
    }
  }

  const amount = parseEther(process.env.GAS_DRIP_AMOUNT || '0.05');
  const threshold = parseEther(process.env.GAS_DRIP_THRESHOLD || '0.02');
  const pub = createPublicClient({ chain: polygonAmoy, transport: http(RPC) });
  const account = privateKeyToAccount(key.startsWith('0x') ? key : `0x${key}`);

  try {
    const [have, drip] = await Promise.all([pub.getBalance({ address: to }), pub.getBalance({ address: account.address })]);
    if (have >= threshold) return res.status(400).json({ error: 'That wallet already has gas.' });
    if (drip < amount * 2n) return res.status(503).json({ error: 'The gas drip is empty. Tell the team.', drip: account.address });

    const wallet = createWalletClient({ account, chain: polygonAmoy, transport: http(RPC) });
    const hash = await wallet.sendTransaction({ to, value: amount });
    recent.set(to.toLowerCase(), now);
    if (ip) recent.set(ip, now);
    return res.status(200).json({ hash, amount: (process.env.GAS_DRIP_AMOUNT || '0.05') });
  } catch (err) {
    return res.status(500).json({ error: err.shortMessage || err.message || 'Drip failed.' });
  }
}
