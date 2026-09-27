import { useState } from 'react';
import { useChainId, useConfig, useSwitchChain, useWriteContract } from 'wagmi';
import { getPublicClient, waitForTransactionReceipt } from 'wagmi/actions';
import { BaseError, ContractFunctionRevertedError, parseGwei } from 'viem';
import { CHAIN } from '../lib/wagmi';

// One place for how the site sends transactions: pinned to Amoy, with an explicit priority fee
// (public RPCs estimate just under Amoy's 25 gwei floor and wallets then get rejected), waiting
// for the receipt, and turning contract errors into sentences.

const FRIENDLY = {
  // hunt
  NotOpened: 'This riddle has not opened yet. The NFT count is rolled a few blocks after release.',
  SoldOut: 'Every NFT on this riddle is gone. Look for one on the market, or wait for the next riddle.',
  NotOwner: 'You do not hold this NFT.',
  AlreadyUnlocked: 'This NFT already has the location. Go find it.',
  NotUnlocked: 'Solve the riddle on this NFT first; the location unlocks the claim.',
  AlreadyClaimed: 'This NFT already claimed.',
  NotClaimed: 'This NFT has not claimed yet.',
  BadSigner: 'That code did not sign for this NFT. Scan the code at the place, with the wallet that holds the NFT.',
  BadIndex: 'Bad answer slot.',
  AlreadySettled: 'Already settled.',
  NotSettled: 'The finisher window is still open. Collect once it settles.',
  WindowOpen: 'The finisher window is still open.',
  NothingToSettle: 'Nobody has found this one yet.',
  AlreadyCollected: 'Already collected for this NFT.',
  TooSoon: 'Too soon. Wait a few blocks.',
  PoolUnderfunded: 'The prize pool is underfunded right now.',
  NothingOwed: 'Nothing to withdraw.',
  InsufficientBalance: "You don't have enough RDLN for this.",
  DailyBurnLimitExceeded: 'The token has hit its daily limit for game payments. Try again tomorrow.',
  SingleBurnLimitExceeded: 'That payment is over the token\'s single-transaction limit.',
  EnforcedPause: 'The RDLN token is paused right now.',
  // faucet
  AlreadyClaimed_faucet: 'This wallet already used the faucet.',
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

export function useTx() {
  const config = useConfig();
  const chainId = useChainId();
  const { writeContractAsync: writeRaw } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);

  const write = async (args) => {
    let fees = {};
    try {
      const block = await getPublicClient(config, { chainId: CHAIN.id }).getBlock();
      const tip = parseGwei('30');
      fees = { maxPriorityFeePerGas: tip, maxFeePerGas: (block.baseFeePerGas ?? 0n) * 2n + tip };
    } catch { /* wallet estimates */ }
    return writeRaw({ ...args, ...fees, chainId: CHAIN.id });
  };

  async function run(label, fn) {
    setError(null);
    setPending(label);
    try {
      if (chainId !== CHAIN.id) await switchChainAsync({ chainId: CHAIN.id });
      const hash = await fn(write);
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

  return { pending, error, clearError: () => setError(null), setError, run, write };
}
