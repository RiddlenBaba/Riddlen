import { useEffect, useMemo, useState } from 'react';
import { useChainId, useConfig, useReadContract, useReadContracts, useSignMessage, useSwitchChain, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { CHAIN } from '../lib/wagmi';
import { BaseError, ContractFunctionRevertedError } from 'viem';
import { STUMP_ABI, FAUCET_ABI, ERC20_ABI } from '../lib/abi';
import { CONTRACTS } from '../lib/wagmi';
import {
  authorCommitment, authorSaltMessage, canonicalAnswers, guessCommitment, guessNonceMessage,
  loadLocal, nonceFromSignature, saveLocal, splitAlternatives,
} from '../lib/answers';

const game = { address: CONTRACTS.STUMP, abi: STUMP_ABI };
const faucet = { address: CONTRACTS.FAUCET, abi: FAUCET_ABI };
const REFRESH_MS = 12_000;
const MAX_SHOWN = 40;

export const STATUS = { NONE: 0, SUBMITTED: 1, OPEN: 2, VOID: 3, REJECTED: 4, FINALIZED: 5 };
export const OUTCOME = ['pending', 'stumped', 'machine-solved', 'unsolved', 'voided'];
export const DIFFICULTY = ['Easy', 'Medium', 'Hard', 'Legendary'];

/** Seconds since epoch, ticking once a second */
export function useNow() {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/**
 * pending -> open -> awaiting-author -> reveal -> finalizing -> complete
 * void-ready: the author missed the reveal window; anyone can settle as voided
 * awaiting-panel: window passed but the game master hasn't revealed the panel yet
 */
export function derivePhase(c, now, revealWindow) {
  if (!c || revealWindow === undefined) return 'loading';
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

export function useRevealWindow() {
  const { data } = useReadContract({ ...game, functionName: 'REVEAL_WINDOW' });
  return data;
}

/** Newest challenges first, with phases */
export function useChallenges(now) {
  const { data: count } = useReadContract({ ...game, functionName: 'challengeCount', query: { refetchInterval: REFRESH_MS } });
  const revealWindow = useRevealWindow();
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
    if (!data) return [];
    return ids.map((id, i) => {
      const r = data[i]?.result;
      if (!r) return null;
      const c = toChallenge(id, r);
      return { ...c, phase: derivePhase(c, now, revealWindow) };
    }).filter(Boolean);
  }, [data, ids, now, revealWindow]);
  return { challenges, revealWindow, isLoading: isLoading || count === undefined, refetch, count };
}

/** One challenge by id */
export function useChallenge(id, now) {
  const enabled = id !== undefined && id !== null;
  const revealWindow = useRevealWindow();
  const { data, isLoading, refetch } = useReadContract({
    ...game, functionName: 'getChallenge', args: [id], query: { enabled, refetchInterval: REFRESH_MS },
  });
  const challenge = useMemo(() => {
    if (!data) return null;
    const c = toChallenge(id, data);
    if (c.status === STATUS.NONE) return null;
    return { ...c, phase: derivePhase(c, now, revealWindow) };
  }, [data, id, now, revealWindow]);
  return { challenge, revealWindow, isLoading, refetch };
}

/** Everything the connected wallet has touched: riddles written, riddles entered */
export function useMyActivity(player, challenges) {
  const ids = useMemo(() => challenges.map((c) => c.id), [challenges]);
  const { data } = useReadContracts({
    contracts: ids.map((id) => ({ ...game, functionName: 'getEntry', args: [id, player] })),
    query: { enabled: !!player && ids.length > 0, refetchInterval: REFRESH_MS },
  });
  return useMemo(() => {
    if (!player) return { written: [], entered: [] };
    const written = challenges.filter((c) => c.author.toLowerCase() === player.toLowerCase());
    const entered = challenges.map((c, i) => {
      const e = data?.[i]?.result;
      return e && e.enteredAt !== 0n ? { ...c, entry: e, sealed: e.commitment !== '0x' + '0'.repeat(64) } : null;
    }).filter(Boolean);
    return { written, entered };
  }, [player, challenges, data]);
}

export function useEconomics() {
  const { data } = useReadContracts({
    contracts: [0, 1, 2, 3].flatMap((d) => [
      { ...game, functionName: 'poolByDifficulty', args: [BigInt(d)] },
      { ...game, functionName: 'entryCostByDifficulty', args: [BigInt(d)] },
    ]),
  });
  return useMemo(() => [0, 1, 2, 3].map((d) => ({
    pool: data?.[d * 2]?.result ?? 0n, entryCost: data?.[d * 2 + 1]?.result ?? 0n,
  })), [data]);
}

export function useMe(id, player) {
  const enabled = !!player;
  const { data: entry, refetch: r1 } = useReadContract({
    ...game, functionName: 'getEntry', args: [id, player],
    query: { enabled: enabled && id !== undefined && id !== null, refetchInterval: REFRESH_MS },
  });
  const { data: owed, refetch: r2 } = useReadContract({ ...game, functionName: 'owed', args: [player], query: { enabled, refetchInterval: REFRESH_MS } });
  const { data: rdln, refetch: r3 } = useReadContract({ address: CONTRACTS.RDLN, abi: ERC20_ABI, functionName: 'balanceOf', args: [player], query: { enabled, refetchInterval: REFRESH_MS } });
  const { data: canClaim, refetch: r4 } = useReadContract({ ...faucet, functionName: 'canClaim', args: [player], query: { enabled, refetchInterval: REFRESH_MS } });
  const { data: claimAmount } = useReadContract({ ...faucet, functionName: 'claimAmount', query: { enabled } });
  return {
    entry: entry && entry.enteredAt !== 0n ? entry : null,
    sealed: !!entry && entry.commitment !== '0x' + '0'.repeat(64),
    owed: owed ?? 0n,
    rdln: rdln ?? 0n,
    faucet: { available: !!canClaim, amount: claimAmount ?? 0n },
    refetch: () => { r1(); r2(); r3(); r4(); },
  };
}

export function useReveals(id, enabled) {
  const { data } = useReadContract({ ...game, functionName: 'getReveals', args: [id], query: { enabled: !!enabled, refetchInterval: REFRESH_MS } });
  return data ? { answers: data[0], panelAnswers: data[1], solvers: data[2] } : null;
}

const FRIENDLY = {
  NotAuthor: 'Only the author can do that.',
  NotOpen: 'This riddle is not open.',
  NotSubmitted: 'This riddle is not waiting to open.',
  EntriesClosed: 'Entries have closed.',
  EntriesOpen: 'Entries are still open.',
  AlreadyEntered: 'You already entered this one.',
  NotEntered: "You haven't entered this riddle.",
  AuthorCannotPlay: "You wrote this one. You can't play your own riddle.",
  TooSoon: 'Give it at least 30 seconds after entering before sealing.',
  CommitmentMismatch: "That doesn't match what you sealed. Check the spelling, and sign with the same wallet.",
  AlreadyRevealed: 'Already revealed.',
  NotRevealable: 'Nothing to reveal yet.',
  RevealWindowClosed: 'The reveal window has closed.',
  RevealWindowOpen: 'The reveal window is still open.',
  PanelRevealMissing: "The machines' guesses haven't been revealed yet. Check back soon.",
  PoolUnderfunded: 'The prize pool is underfunded right now.',
  NothingOwed: 'Nothing to withdraw.',
  BadRiddle: 'The riddle or an answer is empty or too long.',
  InsufficientBalance: "You don't have enough RDLN for this.",
  AlreadyClaimed: 'This wallet already used the faucet.',
  FaucetEmpty: 'The faucet is empty.',
};

export function friendlyError(err) {
  if (err instanceof BaseError) {
    const revert = err.walk((e) => e instanceof ContractFunctionRevertedError);
    if (revert instanceof ContractFunctionRevertedError) {
      const name = revert.data?.errorName;
      if (name && FRIENDLY[name]) return FRIENDLY[name];
      if (revert.reason) return revert.reason;
      if (name) return name;
    }
    if (err.shortMessage?.includes('User rejected')) return 'Cancelled in your wallet.';
    return err.shortMessage || err.message;
  }
  return err?.message || String(err);
}

export function useActions(player) {
  const config = useConfig();
  const chainId = useChainId();
  const { writeContractAsync: writeRaw } = useWriteContract();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);
  const contract = CONTRACTS.STUMP;

  // Every write is pinned to Amoy. If the wallet is on another network it is asked to switch
  // first, and if that fails nothing is sent: a call to these addresses on another chain would
  // burn real gas for nothing.
  const writeContractAsync = (args) => writeRaw({ ...args, chainId: CHAIN.id });

  async function run(label, fn) {
    setError(null);
    setPending(label);
    try {
      if (chainId !== CHAIN.id) {
        await switchChainAsync({ chainId: CHAIN.id });
      }
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

  const authorSalt = async (riddle) => nonceFromSignature(await signMessageAsync({ message: authorSaltMessage({ chainId: CHAIN.id, contract, riddle }) }));
  const guessNonce = async (id) => nonceFromSignature(await signMessageAsync({ message: guessNonceMessage({ chainId: CHAIN.id, contract, id }) }));
  const ids = (id) => ({ chainId: CHAIN.id, contract, id: String(id), who: player });

  return {
    pending, error, clearError: () => setError(null),

    submit: (riddle, answersText, difficulty) => run('Sealing and submitting', async () => {
      const answers = splitAlternatives(answersText);
      const salt = await authorSalt(riddle);
      const commitment = authorCommitment({ contract, author: player, answers, salt });
      saveLocal('author', ids(riddle.length), { riddle, answers });
      return writeContractAsync({ ...game, functionName: 'submit', args: [riddle, difficulty, commitment] });
    }),

    savedAuthorAnswers: (riddle) => (player ? loadLocal('author', ids(riddle.length))?.answers?.join(' / ') ?? '' : ''),

    revealAnswer: (c, answersText) => run('Revealing your answer', async () => {
      const salt = await authorSalt(c.riddle);
      return writeContractAsync({ ...game, functionName: 'revealAnswer', args: [c.id, splitAlternatives(answersText), salt] });
    }),

    enter: (id) => run('Entering', () => writeContractAsync({ ...game, functionName: 'enter', args: [id] })),

    seal: (id, answer) => run('Sealing your guess', async () => {
      const answers = canonicalAnswers([answer]);
      const nonce = await guessNonce(id);
      const hash = await writeContractAsync({ ...game, functionName: 'sealGuess', args: [id, guessCommitment({ contract, solver: player, id, answers, nonce })] });
      saveLocal('guess', ids(id), { answers });
      return hash;
    }),

    savedGuess: (id) => (player ? loadLocal('guess', ids(id))?.answers?.[0] ?? '' : ''),

    revealGuess: (id, answer) => run('Revealing your guess', async () => {
      const nonce = await guessNonce(id);
      return writeContractAsync({ ...game, functionName: 'revealGuess', args: [id, canonicalAnswers([answer]), nonce] });
    }),

    finalize: (id) => run('Settling', () => writeContractAsync({ ...game, functionName: 'finalize', args: [id] })),
    claimRefund: (id) => run('Claiming refund', () => writeContractAsync({ ...game, functionName: 'claimRefund', args: [id] })),
    withdraw: () => run('Withdrawing', () => writeContractAsync({ ...game, functionName: 'withdraw', args: [] })),
    claimFaucet: () => run('Claiming testnet RDLN', () => writeContractAsync({ ...faucet, functionName: 'claim', args: [] })),
  };
}
