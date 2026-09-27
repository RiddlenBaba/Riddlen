import { useMemo } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import { HUNT_ABI, HUNT_NFT_ABI, HUNT_COMMITMENTS_ABI } from '../lib/abi';
import { CONTRACTS } from '../lib/wagmi';
import { useTx } from './useTx';

const hunt = { address: CONTRACTS.HUNT, abi: HUNT_ABI };
const nft = { address: CONTRACTS.HUNT_NFT, abi: HUNT_NFT_ABI };
const commitments = { address: CONTRACTS.HUNT_COMMITMENTS, abi: HUNT_COMMITMENTS_ABI };
const REFRESH_MS = 12_000;
const MAX_SHOWN = 60;

export const DIFFICULTY = ['Easy', 'Medium', 'Hard', 'Legendary'];

/** released -> open | sold-out -> found -> complete. Nothing expires. */
export function derivePhase(r) {
  if (!r) return 'loading';
  if (!r.opened) return 'released';
  if (r.complete) return 'complete';
  if (r.claimCount > 0) return r.minted >= r.nftCount ? 'found-sold-out' : 'found';
  if (r.minted >= r.nftCount) return 'sold-out';
  return 'open';
}

function toRiddle(id, r) {
  return {
    id, difficulty: Number(r.difficulty), releasedAt: Number(r.releasedAt), firstClaimAt: Number(r.firstClaimAt),
    nftCount: Number(r.nftCount), minted: Number(r.minted), claimCount: Number(r.claimCount), opened: r.opened, complete: r.complete,
    pot: r.pot, booked: r.booked, claimFee: r.claimFee, stepBps: Number(r.stepBps), priceBps: Number(r.priceBps), releaseGap: Number(r.releaseGap), harmonic: r.harmonic,
    firstTokenId: Number(r.firstTokenId), commitBlock: Number(r.commitBlock), cacheSigner: r.cacheSigner,
    fragmentCipherHash: r.fragmentCipherHash, altRoots: r.altRoots, text: r.text, locationCipher: r.locationCipher,
  };
}

function toToken(id, t) {
  return {
    id, riddleId: Number(t.riddleId), index: Number(t.index), attempts: Number(t.attempts),
    unlockedAt: Number(t.unlockedAt), claimedAt: Number(t.claimedAt), rank: Number(t.rank), released: t.released, share: t.share,
  };
}

export function useRiddles(now) {
  const { data: count } = useReadContract({ ...hunt, functionName: 'riddleCount', query: { refetchInterval: REFRESH_MS } });
  const ids = useMemo(() => {
    if (!count) return [];
    const out = [];
    for (let id = count; id >= 1n && out.length < MAX_SHOWN; id--) out.push(id);
    return out;
  }, [count]);
  const { data, isLoading, refetch } = useReadContracts({
    contracts: ids.map((id) => ({ ...hunt, functionName: 'getRiddle', args: [id] })),
    query: { enabled: ids.length > 0, refetchInterval: REFRESH_MS },
  });
  const riddles = useMemo(() => {
    if (!data) return [];
    return ids.map((id, i) => {
      const r = data[i]?.result;
      if (!r) return null;
      const x = toRiddle(id, r);
      return { ...x, phase: derivePhase(x) };
    }).filter(Boolean);
  }, [data, ids]);
  return { riddles, isLoading: isLoading || count === undefined, refetch, count };
}

export function useRiddle(id, now) {
  const enabled = id !== undefined && id !== null;
  const { data, isLoading, refetch } = useReadContract({ ...hunt, functionName: 'getRiddle', args: [id], query: { enabled, refetchInterval: REFRESH_MS } });
  const riddle = useMemo(() => {
    if (!data || Number(data.releasedAt) === 0) return null;
    const x = toRiddle(id, data);
    return { ...x, phase: derivePhase(x) };
  }, [data, id]);
  return { riddle, isLoading, refetch };
}

/** The halving floor under every mint price */
export function usePriceFloor() {
  const { data } = useReadContract({ ...hunt, functionName: 'priceFloor', query: { refetchInterval: 60_000 } });
  return data ?? 0n;
}

/** price = max(floor, pot * priceBps / 10000 / nftCount). Matches RiddlenHunt._mintPrice. */
export function mintPriceOf(riddle, floor) {
  if (!riddle?.opened || !riddle.nftCount) return 0n;
  const byValue = (riddle.pot * BigInt(riddle.priceBps)) / 10000n / BigInt(riddle.nftCount);
  return byValue > floor ? byValue : floor;
}

/** Every hunt NFT the wallet holds, with its state; optionally only those on one riddle */
export function useMyTokens(player, riddleId) {
  const enabled = !!player;
  const { data: ids, refetch: r1 } = useReadContract({ ...nft, functionName: 'tokensOf', args: [player], query: { enabled, refetchInterval: REFRESH_MS } });
  const list = useMemo(() => (ids ? [...ids] : []), [ids]);
  const { data, refetch: r2 } = useReadContracts({
    contracts: list.map((id) => ({ ...hunt, functionName: 'getToken', args: [id] })),
    query: { enabled: list.length > 0, refetchInterval: REFRESH_MS },
  });
  const tokens = useMemo(() => list.map((id, i) => (data?.[i]?.result ? toToken(id, data[i].result) : null)).filter(Boolean)
    .filter((t) => riddleId === undefined || t.riddleId === Number(riddleId)), [list, data, riddleId]);
  return { tokens, refetch: () => { r1(); r2(); } };
}

export function useHuntOwed(player) {
  const { data, refetch } = useReadContract({ ...hunt, functionName: 'owed', args: [player], query: { enabled: !!player, refetchInterval: REFRESH_MS } });
  return { owed: data ?? 0n, refetch };
}

export function useCommitments() {
  const { data } = useReadContracts({ contracts: ['mapRoot', 'prizeCommitment', 'launchAt', 'basePrice', 'halvingPeriod', 'totalRiddles']
    .map((fn) => ({ ...commitments, functionName: fn })) });
  return useMemo(() => ({
    mapRoot: data?.[0]?.result, prizeCommitment: data?.[1]?.result, launchAt: Number(data?.[2]?.result ?? 0),
    basePrice: data?.[3]?.result ?? 0n, halvingPeriod: Number(data?.[4]?.result ?? 0), totalRiddles: Number(data?.[5]?.result ?? 0),
  }), [data]);
}

export function useHuntActions() {
  const tx = useTx();
  return {
    pending: tx.pending, error: tx.error, clearError: tx.clearError, setError: tx.setError,
    mint: (id) => tx.run('Buying', (w) => w({ ...hunt, functionName: 'mint', args: [id] })),
    attempt: (tokenId, alt, leaf, proof) => tx.run('Submitting your answer', (w) => w({ ...hunt, functionName: 'attempt', args: [tokenId, alt, leaf, proof] })),
    claim: (tokenId, signature) => tx.run('Claiming', (w) => w({ ...hunt, functionName: 'claim', args: [tokenId, signature] })),
    open: (id) => tx.run('Opening', (w) => w({ ...hunt, functionName: 'open', args: [id] })),
    withdraw: () => tx.run('Withdrawing', (w) => w({ ...hunt, functionName: 'withdraw', args: [] })),
  };
}

// Decrypted locations and fragments, per token, kept only in this browser as a convenience.
const key = (what, tokenId) => `riddlen:hunt:${what}:${CONTRACTS.HUNT.toLowerCase()}:${tokenId}`;
export function loadUnlocked(what, tokenId) {
  try { return typeof window === 'undefined' ? null : window.localStorage.getItem(key(what, tokenId)); } catch { return null; }
}
export function saveUnlocked(what, tokenId, value) {
  try { window.localStorage.setItem(key(what, tokenId), value); } catch { /* private mode */ }
}

const ONE = 10n ** 18n;
/** What the finder of the given rank gets: pot * (1/k) / H(N). Matches RiddlenHunt._shareFor. */
export function shareFor(riddle, rank) {
  if (!riddle?.opened || rank < 1 || rank > riddle.nftCount || !riddle.harmonic) return 0n;
  if (rank === riddle.nftCount) return riddle.pot - riddle.booked;
  return (riddle.pot * ONE) / (BigInt(rank) * BigInt(riddle.harmonic));
}

/** One guess step on a riddle: the ticket price times stepBps. Matches RiddlenHunt._step. */
export function stepOf(riddle, floor) {
  return (mintPriceOf(riddle, floor) * BigInt(riddle?.stepBps ?? 0)) / 10000n;
}
