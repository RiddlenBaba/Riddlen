import { createPublicClient, http } from 'viem';
import { CHAIN, CONTRACTS } from '../../../lib/wagmi';
import { HUNT_ABI, HUNT_NFT_ABI } from '../../../lib/abi';

// ERC-721 metadata for hunt NFTs, read straight from the chain so wallets and marketplaces
// show the riddle, its attempt counter and its state. HuntNFT.baseURI points here.
const RPC = process.env.NEXT_PUBLIC_AMOY_RPC_URL || 'https://polygon-amoy-bor-rpc.publicnode.com';
const DIFFICULTY = ['Easy', 'Medium', 'Hard', 'Legendary'];

function svg(text, line2) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const words = esc(text).split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > 34) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; if (lines.length === 9) break; }
  if (cur && lines.length < 10) lines.push(cur.trim());
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="#f5f0e6"/>` +
    `<text x="40" y="70" font-family="Georgia,serif" font-style="italic" font-size="34" fill="#1b1813">Riddlen</text>` +
    lines.map((l, i) => `<text x="40" y="${150 + i * 38}" font-family="Georgia,serif" font-size="26" fill="#1b1813">${l}</text>`).join('') +
    `<text x="40" y="560" font-family="monospace" font-size="16" fill="#5d564c">${esc(line2)}</text></svg>`;
}

export default async function handler(req, res) {
  let id;
  try { id = BigInt(String(req.query.id).replace(/\.json$/, '')); } catch { return res.status(400).json({ error: 'bad id' }); }
  const pub = createPublicClient({ chain: CHAIN, transport: http(RPC) });
  try {
    const t = await pub.readContract({ address: CONTRACTS.HUNT, abi: HUNT_ABI, functionName: 'getToken', args: [id] });
    if (t.riddleId === 0) return res.status(404).json({ error: 'no such token' });
    const [r, owner] = await Promise.all([
      pub.readContract({ address: CONTRACTS.HUNT, abi: HUNT_ABI, functionName: 'getRiddle', args: [BigInt(t.riddleId)] }),
      pub.readContract({ address: CONTRACTS.HUNT_NFT, abi: HUNT_NFT_ABI, functionName: 'ownerOf', args: [id] }).catch(() => null),
    ]);
    const state = t.claimedAt ? (t.released ? `found #${t.rank}, paid` : `found #${t.rank}, share waiting`) : t.unlockedAt ? 'location unlocked' : 'unsolved';
    const meta = {
      name: `Riddlen Hunt #${t.riddleId} · NFT ${id}`,
      description: `${r.text}\n\nRiddle ${t.riddleId}, NFT ${Number(t.index) + 1} of ${r.nftCount}. Attempts on this NFT: ${t.attempts}. State: ${state}. Progress travels with the token.`,
      external_url: `https://riddlen.com/r/${t.riddleId}`,
      image: `data:image/svg+xml;utf8,${encodeURIComponent(svg(r.text, `#${t.riddleId} · ${DIFFICULTY[r.difficulty]} · attempts ${t.attempts} · ${state}`))}`,
      attributes: [
        { trait_type: 'Riddle', value: Number(t.riddleId) },
        { trait_type: 'Difficulty', value: DIFFICULTY[r.difficulty] },
        { trait_type: 'Attempts', value: Number(t.attempts) },
        { trait_type: 'State', value: state },
        { trait_type: 'First finder', value: t.claimedAt && Number(r.firstTokenId) === Number(id) ? 'yes' : 'no' },
        { trait_type: 'NFTs on riddle', value: Number(r.nftCount) },
      ],
      owner,
    };
    res.setHeader('Cache-Control', 'public, max-age=60');
    return res.status(200).json(meta);
  } catch (err) {
    return res.status(500).json({ error: err.shortMessage || err.message });
  }
}
