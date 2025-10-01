import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACTS } from '../lib/wagmi';
import { AIRDROP_ABI } from '../lib/abis';

// Hook to get Phase 1 status (social proof based)
export function usePhase1Status() {
  const { address } = useAccount();

  const { data: phase1Status, isLoading } = useReadContract({
    address: CONTRACTS.AIRDROP,
    abi: AIRDROP_ABI,
    functionName: 'getPhase1Status',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  const { data: isActive } = useReadContract({
    address: CONTRACTS.AIRDROP,
    abi: AIRDROP_ABI,
    functionName: 'phase1Active',
  });

  return {
    eligible: phase1Status ? phase1Status[0] : false,
    claimed: phase1Status ? phase1Status[1] : false,
    verified: phase1Status ? phase1Status[2] : false,
    isActive: !!isActive,
    isLoading,
  };
}

// Hook to get Phase 2 status (RON merit based)
export function usePhase2Status() {
  const { address } = useAccount();

  const { data: phase2Status, isLoading } = useReadContract({
    address: CONTRACTS.AIRDROP,
    abi: AIRDROP_ABI,
    functionName: 'getPhase2Status',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  const { data: isActive } = useReadContract({
    address: CONTRACTS.AIRDROP,
    abi: AIRDROP_ABI,
    functionName: 'phase2Active',
  });

  return {
    eligible: phase2Status ? phase2Status[0] : false,
    claimed: phase2Status ? phase2Status[1] : false,
    ronBalance: phase2Status ? formatUnits(phase2Status[2], 18) : '0',
    reward: phase2Status ? formatUnits(phase2Status[3], 18) : '0',
    tier: phase2Status ? Number(phase2Status[4]) : 0,
    isActive: !!isActive,
    isLoading,
  };
}

// Hook to get airdrop stats
export function useAirdropStats() {
  const { data: stats } = useReadContract({
    address: CONTRACTS.AIRDROP,
    abi: AIRDROP_ABI,
    functionName: 'getAirdropStats',
  });

  const { data: maxParticipants } = useReadContract({
    address: CONTRACTS.AIRDROP,
    abi: AIRDROP_ABI,
    functionName: 'PHASE1_MAX_PARTICIPANTS',
  });

  const { data: perWallet } = useReadContract({
    address: CONTRACTS.AIRDROP,
    abi: AIRDROP_ABI,
    functionName: 'PHASE1_PER_WALLET',
  });

  return {
    phase1Participants: stats ? Number(stats[0]) : 0,
    phase1Remaining: stats ? Number(stats[1]) : 0,
    contractBalance: stats ? formatUnits(stats[2], 18) : '0',
    maxParticipants: maxParticipants ? Number(maxParticipants) : 5000,
    perWalletAmount: perWallet ? formatUnits(perWallet, 18) : '10000',
  };
}

// Hook to submit social proof
export function useSubmitSocialProof() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const submit = (twitterHandle, telegramHandle) => {
    writeContract({
      address: CONTRACTS.AIRDROP,
      abi: AIRDROP_ABI,
      functionName: 'submitSocialProof',
      args: [twitterHandle, telegramHandle],
    });
  };

  return {
    submit,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// Hook to claim Phase 1 airdrop (auto-verify for testnet)
export function useClaimPhase1() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const claim = () => {
    writeContract({
      address: CONTRACTS.AIRDROP,
      abi: AIRDROP_ABI,
      functionName: 'autoClaimPhase1', // Using auto-claim for testnet
    });
  };

  return {
    claim,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// Hook to claim Phase 2 airdrop
export function useClaimPhase2() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const claim = () => {
    writeContract({
      address: CONTRACTS.AIRDROP,
      abi: AIRDROP_ABI,
      functionName: 'claimPhase2',
    });
  };

  return {
    claim,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}