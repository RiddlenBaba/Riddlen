import { useEffect, useMemo, useState } from 'react';
import { useChainId, useReadContract, useReadContracts, useSignMessage, useWriteContract, useConfig } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { BaseError, ContractFunctionRevertedError } from 'viem';
import { RIDDLE_GAME_ABI } from '../lib/gameAbi';
import { ERC20_ABI } from '../lib/abis';
import { CONTRACTS } from '../lib/wagmi';
import {
  canonicalAnswers, loadCommit, nonceFromSignature, nonceMessage, playerCommitment, saveCommit,
} from '../lib/riddleAnswers';

const game = { address: CONTRACTS.RIDDLE_NFT, abi: RIDDLE_GAME_ABI };
const MAX_SESSIONS_SHOWN = 20;
const REFRESH_MS = 15_000;

const STATE = { INACTIVE: 0, ACTIVE: 1, IN_PROGRESS: 2, COMPLETED: 3, EMERGENCY_STOPPED: 4 };

/** Seconds since epoch, ticking once a second so countdowns and phases stay current */
export function useNow() {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/**
 * upcoming -> open -> awaiting-solution -> reveal -> finalizing -> complete
 * 'legacy' marks sessions created before the commit-reveal upgrade (no end time).
 */
export function derivePhase(session, cr, now, revealWindow) {
  if (!session || !cr) return 'loading';
  if (session.state === STATE.EMERGENCY_STOPPED) return 'stopped';
  if (session.state === STATE.INACTIVE) return 'upcoming';
  if (session.endTime === 0n) return 'legacy';
  if (BigInt(now) < session.endTime) return 'open';
  if (cr.solutionRevealedAt === 0n) return 'awaiting-solution';
  if (BigInt(now) <= cr.solutionRevealedAt + revealWindow) return 'reveal';
  if (!cr.finalized) return 'finalizing';
  return 'complete';
}

function toSession(id, r) {
  const [maxMints, prizePool, winnerSlots, currentMintCost, state, difficulty, startTime, endTime,
    sessionDuration, totalMinted, totalCompleted, successfulSolvers, totalPrizesDistributed, totalBurned,
    prizesDistributed, title, description, category] = r;
  return {
    id, maxMints, prizePool, winnerSlots, currentMintCost, state: Number(state), difficulty: Number(difficulty),
    startTime, endTime, sessionDuration, totalMinted, totalCompleted, successfulSolvers,
    totalPrizesDistributed, totalBurned, prizesDistributed, title, description, category,
  };
}

function toCommitReveal(r) {
  const [solutionCommitment, solutionRevealedAt, commitCount, finalizeCursor, winnersAssigned, finalized] = r;
  return { solutionCommitment, solutionRevealedAt, commitCount, finalizeCursor, winnersAssigned, finalized };
}

/** All recent sessions with their commit-reveal state, newest first */
export function useSessions() {
  const now = useNow();
  const { data: current } = useReadContract({
    ...game, functionName: 'currentSessionId', query: { refetchInterval: REFRESH_MS },
  });
  const { data: revealWindow } = useReadContract({ ...game, functionName: 'REVEAL_WINDOW' });

  const ids = useMemo(() => {
    if (!current || current <= 1n) return [];
    const out = [];
    for (let id = current - 1n; id >= 1n && out.length < MAX_SESSIONS_SHOWN; id--) out.push(id);
    return out;
  }, [current]);

  const { data, isLoading, refetch } = useReadContracts({
    contracts: ids.flatMap((id) => [
      { ...game, functionName: 'riddleSessions', args: [id] },
      { ...game, functionName: 'getCommitRevealState', args: [id] },
    ]),
    query: { enabled: ids.length > 0, refetchInterval: REFRESH_MS },
  });

  const sessions = useMemo(() => {
    if (!data || revealWindow === undefined) return [];
    return ids.map((id, i) => {
      const s = data[i * 2]?.result;
      const c = data[i * 2 + 1]?.result;
      if (!s || !c) return null;
      const session = toSession(id, s);
      const cr = toCommitReveal(c);
      return { ...session, cr, phase: derivePhase(session, cr, now, revealWindow) };
    }).filter((s) => s && s.phase !== 'legacy');
  }, [data, ids, now, revealWindow]);

  return { sessions, revealWindow, isLoading: isLoading || current === undefined, refetch };
}

/** The connected player's participation in one session */
export function usePlayerSession(sessionId, player) {
  const enabled = !!player && sessionId !== undefined;

  const { data: nftCount } = useReadContract({
    ...game, functionName: 'balanceOf', args: [player], query: { enabled, refetchInterval: REFRESH_MS },
  });
  const count = nftCount ? Number(nftCount) : 0;

  const { data: tokenIds } = useReadContracts({
    contracts: Array.from({ length: count }, (_, i) => ({
      ...game, functionName: 'tokenOfOwnerByIndex', args: [player, BigInt(i)],
    })),
    query: { enabled: enabled && count > 0 },
  });
  const ids = (tokenIds || []).map((t) => t.result).filter((t) => t !== undefined);

  const { data: participants, refetch: refetchParticipants } = useReadContracts({
    contracts: ids.map((id) => ({ ...game, functionName: 'participantData', args: [id] })),
    query: { enabled: ids.length > 0, refetchInterval: REFRESH_MS },
  });

  const entry = useMemo(() => {
    if (!participants) return null;
    for (let i = 0; i < ids.length; i++) {
      const p = participants[i]?.result;
      if (p && p[1] === sessionId) {
        const [, , tokenId, startTime, completionTime, attemptCount, completed, successful, prizeAmount, prizeClaimed] = p;
        return { tokenId, startTime, completionTime, attemptCount, completed, successful, prizeAmount, prizeClaimed };
      }
    }
    return null;
  }, [participants, ids, sessionId]);

  const { data: commit, refetch: refetchCommit } = useReadContract({
    ...game, functionName: 'getPlayerCommit', args: [sessionId, player],
    query: { enabled, refetchInterval: REFRESH_MS },
  });
  const { data: lastActivity, refetch: refetchActivity } = useReadContract({
    ...game, functionName: 'lastActivityTime', args: [player], query: { enabled },
  });
  const { data: rdlnBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.RDLN, abi: ERC20_ABI, functionName: 'balanceOf', args: [player],
    query: { enabled: !!player, refetchInterval: REFRESH_MS },
  });

  return {
    entry,
    commit: commit ? { commitment: commit[0], committedAt: commit[1], correct: commit[2] } : null,
    hasCommitted: !!commit && commit[0] !== '0x' + '0'.repeat(64),
    lastActivity: lastActivity ?? 0n,
    rdlnBalance: rdlnBalance ?? 0n,
    refetch: () => { refetchParticipants(); refetchCommit(); refetchActivity(); refetchBalance(); },
  };
}

const FRIENDLY = {
  SessionClosed: 'This session has closed.',
  SessionStillOpen: 'The session is still open.',
  SolutionNotRevealed: "The game master hasn't revealed the solution yet.",
  RevealWindowClosed: 'The reveal window has closed.',
  RevealWindowOpen: 'Players can still reveal; finalizing opens when the reveal window ends.',
  NoCommitment: "You haven't committed an answer in this session.",
  CommitmentMismatch: "That answer doesn't match what you sealed. Check the spelling, or sign with the same wallet you committed from.",
  AlreadyRevealed: 'Already revealed.',
  AlreadyFinalized: 'This session is already finalized.',
  InsufficientBalance: "You don't have enough RDLN for this.",
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
    if (err.shortMessage?.includes('User rejected')) return 'Request cancelled in your wallet.';
    return err.shortMessage || err.message;
  }
  return err?.message || String(err);
}

/** Transactions and signatures for the commit-reveal flow */
export function useGameActions(player) {
  const config = useConfig();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();
  const { signMessageAsync } = useSignMessage();
  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);

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

  async function deriveNonce(sessionId) {
    const signature = await signMessageAsync({
      message: nonceMessage({ chainId, contract: CONTRACTS.RIDDLE_NFT, sessionId }),
    });
    return nonceFromSignature(signature);
  }

  const ids = (sessionId) => ({ chainId, contract: CONTRACTS.RIDDLE_NFT, sessionId: sessionId.toString(), player });

  return {
    pending,
    error,
    clearError: () => setError(null),

    enter: (sessionId) => run('Entering', () =>
      writeContractAsync({ ...game, functionName: 'mintRiddleAccess', args: [sessionId] })),

    commit: (sessionId, answer) => run('Sealing your answer', async () => {
      const nonce = await deriveNonce(sessionId);
      const answers = canonicalAnswers([answer]);
      const commitment = playerCommitment({ contract: CONTRACTS.RIDDLE_NFT, player, sessionId, answers, nonce });
      const hash = await writeContractAsync({ ...game, functionName: 'commitAnswer', args: [sessionId, commitment] });
      saveCommit(ids(sessionId), { answers });
      return hash;
    }),

    savedAnswer: (sessionId) => loadCommit(ids(sessionId))?.answers?.[0] ?? '',

    reveal: (sessionId, answer) => run('Revealing your answer', async () => {
      const nonce = await deriveNonce(sessionId);
      return writeContractAsync({
        ...game, functionName: 'revealAnswer', args: [sessionId, canonicalAnswers([answer]), nonce],
      });
    }),

    finalize: (sessionId) => run('Finalizing', () =>
      writeContractAsync({ ...game, functionName: 'finalizeSession', args: [sessionId, 50n] })),

    claim: (tokenId) => run('Claiming your prize', () =>
      writeContractAsync({ ...game, functionName: 'claimPrize', args: [tokenId] })),
  };
}
