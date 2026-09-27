import { useMemo, useState } from 'react';
import { useChainId, useConfig, useReadContract, useReadContracts, useSignMessage, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { STUMP_ABI } from '../lib/stumpAbi';
import { ERC20_ABI } from '../lib/abis';
import { CONTRACTS } from '../lib/wagmi';
import { friendlyError as baseFriendly } from './useRiddleGame';
import {
  authorCommitment, authorSaltMessage, canonicalAnswers, guessCommitment, guessNonceMessage,
  loadLocal, nonceFromSignature, saveLocal,
} from '../lib/stumpAnswers';

const game = { address: CONTRACTS.STUMP, abi: STUMP_ABI };
const FAUCET_ABI = [
  { type: 'function', name: 'claim', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { type: 'function', name: 'canClaim', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'bool' }] },
  { type: 'function', name: 'claimAmount', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'error', name: 'AlreadyClaimed', inputs: [] },
  { type: 'error', name: 'FaucetEmpty', inputs: [{ type: 'uint256' }] },
];
const faucet = { address: CONTRACTS.FAUCET, abi: FAUCET_ABI };

const FRIENDLY = {
  NotAuthor: 'Only the author can do that.',
  NotOpen: 'This riddle is not open.',
  EntriesClosed: 'Entries have closed.',
  EntriesOpen: 'Entries are still open.',
  AlreadyEntered: 'You already entered.',
  NotEntered: "You haven't entered this riddle.",
  AuthorCannotPlay: "You wrote this one. You can't play your own riddle.",
  TooSoon: 'Give it at least 30 seconds after entering before sealing.',
  CommitmentMismatch: "That doesn't match what you sealed. Check the spelling and sign with the same wallet.",
  AlreadyRevealed: 'Already revealed.',
  NotRevealable: 'Nothing to reveal yet.',
  RevealWindowClosed: 'The reveal window has closed.',
  RevealWindowOpen: 'The reveal window is still open.',
  PanelRevealMissing: "The game master hasn't revealed the panel yet.",
  PoolUnderfunded: 'The prize pool is underfunded. Try again later.',
  NothingOwed: 'Nothing to withdraw.',
  AlreadyClaimed: 'This wallet already claimed from the faucet.',
  FaucetEmpty: 'The faucet is empty. Tell the team.',
  BadRiddle: 'Riddle or answer is empty or too long.',
  InsufficientBalance: "You don't have enough RDLN for this.",
};
function friendlyError(err) {
  const name = err?.walk?.((e) => e?.data?.errorName)?.data?.errorName;
  return (name && FRIENDLY[name]) || baseFriendly(err);
}
const REFRESH_MS = 15_000;
const MAX_SHOWN = 30;

export const STATUS = { NONE: 0, SUBMITTED: 1, OPEN: 2, VOID: 3, REJECTED: 4, FINALIZED: 5 };
export const OUTCOME = ['pending', 'stumped', 'machine-solved', 'unsolved', 'voided'];
export const DIFFICULTY = ['Easy', 'Medium', 'Hard', 'Legendary'];

export const isConfigured = () => /^0x[0-9a-fA-F]{40}$/.test(CONTRACTS.STUMP || '');

/**
 * pending -> open -> awaiting-author -> reveal -> finalizing -> complete
 * 'void-ready': author missed the reveal window, anyone can finalize as voided
 * 'awaiting-panel': reveal window passed but the game master hasn't revealed the panel yet
 */
export function derivePhase(c, now, revealWindow) {
  if (!c) return 'loading';
  const t = BigInt(now);
  if (c.status === STATUS.REJECTED) return 'rejected';
  if (c.status === STATUS.FINALIZED) return 'complete';
  if (c.status === STATUS.SUBMITTED) return 'pending';
  if (c.status !== STATUS.OPEN) return 'loading';
  if (t < c.endTime) return 'open';
  if (c.authorRevealedAt === 0n) return t <= c.endTime + revealWindow ? 'awaiting-author' : 'void-ready';
  if (t <= c.authorRevealedAt + revealWindow) return 'reveal';
  return c.panelRevealed ? 'finalizing' : 'awaiting-panel';
}

function toChallenge(id, r) {
  const [author, status, difficulty, outcome, endTime, authorRevealedAt, entrants, correct,
    panelRevealed, panelSolved, pool, entryCost, riddle] = r;
  return {
    id, author, status: Number(status), difficulty: Number(difficulty), outcome: Number(outcome),
    endTime, authorRevealedAt, entrants: Number(entrants), correct: Number(correct),
    panelRevealed, panelSolved, pool, entryCost, riddle,
  };
}

export function useChallenges(now) {
  const enabled = isConfigured();
  const { data: count } = useReadContract({
    ...game, functionName: 'challengeCount', query: { enabled, refetchInterval: REFRESH_MS },
  });
  const { data: revealWindow } = useReadContract({ ...game, functionName: 'REVEAL_WINDOW', query: { enabled } });

  const ids = useMemo(() => {
    if (!count) return [];
    const out = [];
    for (let id = count; id >= 1n && out.length < MAX_SHOWN; id--) out.push(id);
    return out;
  }, [count]);

  const { data, isLoading, refetch } = useReadContracts({
    contracts: ids.map((id) => ({ ...game, functionName: 'getChallenge', args: [id] })),
    query: { enabled: ids.length > 0, refetchInterval: REFRESH_MS },
  });

  const challenges = useMemo(() => {
    if (!data || revealWindow === undefined) return [];
    return ids.map((id, i) => {
      const r = data[i]?.result;
      if (!r) return null;
      const c = toChallenge(id, r);
      return { ...c, phase: derivePhase(c, now, revealWindow) };
    }).filter(Boolean);
  }, [data, ids, now, revealWindow]);

  return { challenges, revealWindow, isLoading: enabled && (isLoading || count === undefined), refetch };
}

export function useEconomics() {
  const enabled = isConfigured();
  const { data } = useReadContracts({
    contracts: [0, 1, 2, 3].flatMap((d) => [
      { ...game, functionName: 'poolByDifficulty', args: [BigInt(d)] },
      { ...game, functionName: 'entryCostByDifficulty', args: [BigInt(d)] },
    ]),
    query: { enabled },
  });
  return useMemo(() => [0, 1, 2, 3].map((d) => ({
    pool: data?.[d * 2]?.result ?? 0n, entryCost: data?.[d * 2 + 1]?.result ?? 0n,
  })), [data]);
}

export function useMe(id, player) {
  const enabled = isConfigured() && !!player;
  const { data: entry, refetch: r1 } = useReadContract({
    ...game, functionName: 'getEntry', args: [id, player], query: { enabled: enabled && id !== undefined, refetchInterval: REFRESH_MS },
  });
  const { data: owed, refetch: r2 } = useReadContract({
    ...game, functionName: 'owed', args: [player], query: { enabled, refetchInterval: REFRESH_MS },
  });
  const { data: rdlnBalance, refetch: r3 } = useReadContract({
    address: CONTRACTS.RDLN, abi: ERC20_ABI, functionName: 'balanceOf', args: [player], query: { enabled, refetchInterval: REFRESH_MS },
  });
  return {
    entry: entry && entry.enteredAt !== 0n ? entry : null,
    sealed: !!entry && entry.commitment !== '0x' + '0'.repeat(64),
    owed: owed ?? 0n,
    rdlnBalance: rdlnBalance ?? 0n,
    refetch: () => { r1(); r2(); r3(); },
  };
}

export function useFaucet(player) {
  const enabled = /^0x[0-9a-fA-F]{40}$/.test(CONTRACTS.FAUCET || '') && !!player;
  const { data: canClaim, refetch } = useReadContract({
    ...faucet, functionName: 'canClaim', args: [player], query: { enabled, refetchInterval: REFRESH_MS },
  });
  const { data: amount } = useReadContract({ ...faucet, functionName: 'claimAmount', query: { enabled } });
  return { available: enabled && !!canClaim, amount: amount ?? 0n, refetch };
}

export function useReveals(id, enabled) {
  const { data } = useReadContract({
    ...game, functionName: 'getReveals', args: [id], query: { enabled: isConfigured() && enabled, refetchInterval: REFRESH_MS },
  });
  return data ? { answers: data[0], panelAnswers: data[1], solvers: data[2] } : null;
}

export function useStumpActions(player) {
  const config = useConfig();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();
  const { signMessageAsync } = useSignMessage();
  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);
  const contract = CONTRACTS.STUMP;

  async function run(label, fn) {
    setError(null);
    setPending(label);
    try {
      const hash = await fn();
      if (hash) {
        const receipt = await waitForTransactionReceipt(config, { hash });
        if (receipt.status !== 'success') throw new Error('Transaction reverted');
      }
      return true;
    } catch (err) {
      setError(friendlyError(err));
      return false;
    } finally {
      setPending(null);
    }
  }

  const authorSalt = async (riddle) =>
    nonceFromSignature(await signMessageAsync({ message: authorSaltMessage({ chainId, contract, riddle }) }));
  const guessNonce = async (id) =>
    nonceFromSignature(await signMessageAsync({ message: guessNonceMessage({ chainId, contract, id }) }));
  const ids = (kind, id) => ({ chainId, contract, id: id.toString(), who: player });

  return {
    pending, error, clearError: () => setError(null),

    submit: (riddle, answer, difficulty) => run('Sealing and submitting your riddle', async () => {
      const answers = canonicalAnswers([answer]);
      const salt = await authorSalt(riddle);
      const commitment = authorCommitment({ contract, author: player, answers, salt });
      saveLocal('author', ids('author', riddle.length), { riddle, answers });
      return writeContractAsync({ ...game, functionName: 'submit', args: [riddle, difficulty, commitment] });
    }),

    revealAnswer: (c, answer) => run('Revealing your answer', async () => {
      const salt = await authorSalt(c.riddle);
      return writeContractAsync({ ...game, functionName: 'revealAnswer', args: [c.id, canonicalAnswers([answer]), salt] });
    }),

    enter: (id) => run('Entering', () => writeContractAsync({ ...game, functionName: 'enter', args: [id] })),

    seal: (id, answer) => run('Sealing your guess', async () => {
      const answers = canonicalAnswers([answer]);
      const nonce = await guessNonce(id);
      const hash = await writeContractAsync({
        ...game, functionName: 'sealGuess', args: [id, guessCommitment({ contract, solver: player, id, answers, nonce })],
      });
      saveLocal('guess', ids('guess', id), { answers });
      return hash;
    }),

    savedGuess: (id) => (player ? loadLocal('guess', ids('guess', id))?.answers?.[0] ?? '' : ''),

    revealGuess: (id, answer) => run('Revealing your guess', async () => {
      const nonce = await guessNonce(id);
      return writeContractAsync({ ...game, functionName: 'revealGuess', args: [id, canonicalAnswers([answer]), nonce] });
    }),

    finalize: (id) => run('Finalizing', () => writeContractAsync({ ...game, functionName: 'finalize', args: [id] })),
    claimRefund: (id) => run('Claiming refund', () => writeContractAsync({ ...game, functionName: 'claimRefund', args: [id] })),
    withdraw: () => run('Withdrawing', () => writeContractAsync({ ...game, functionName: 'withdraw', args: [] })),
    claimFaucet: () => run('Claiming testnet RDLN', () => writeContractAsync({ ...faucet, functionName: 'claim', args: [] })),
  };
}
