import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ERC20_ABI, RIDDLE_NFT_ABI, RON_ABI } from '../lib/abis';
import { CONTRACTS } from '../lib/wagmi';

// Hook for RDLN Token
export function useRDLN(userAddress) {
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.RDLN,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress || '0x0000000000000000000000000000000000000000'],
    enabled: !!userAddress,
  });

  const { data: totalSupply } = useReadContract({
    address: CONTRACTS.RDLN,
    abi: ERC20_ABI,
    functionName: 'totalSupply',
  });

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isTransactionLoading } = useWaitForTransactionReceipt({ hash });

  const transfer = async (to, amount) => {
    try {
      await writeContract({
        address: CONTRACTS.RDLN,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [to, parseEther(amount.toString())],
      });
    } catch (error) {
      console.error('RDLN Transfer failed:', error);
      throw error;
    }
  };

  return {
    balance: balance ? formatEther(balance) : '0',
    totalSupply: totalSupply ? formatEther(totalSupply) : '0',
    transfer,
    refetchBalance,
    isTransactionLoading,
  };
}

// Hook for RON Token with tier system
export function useRON(userAddress) {
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.RON,
    abi: RON_ABI,
    functionName: 'balanceOf',
    args: [userAddress || '0x0000000000000000000000000000000000000000'],
    enabled: !!userAddress,
  });

  const { data: userTier } = useReadContract({
    address: CONTRACTS.RON,
    abi: RON_ABI,
    functionName: 'getUserTier',
    args: [userAddress || '0x0000000000000000000000000000000000000000'],
    enabled: !!userAddress,
  });

  const { data: riddlesSolved } = useReadContract({
    address: CONTRACTS.RON,
    abi: RON_ABI,
    functionName: 'getRiddlesSolved',
    args: [userAddress || '0x0000000000000000000000000000000000000000'],
    enabled: !!userAddress,
  });

  const { data: tierName } = useReadContract({
    address: CONTRACTS.RON,
    abi: RON_ABI,
    functionName: 'getTierName',
    args: [userTier || 0],
    enabled: !!userTier,
  });

  // Tier multipliers for rewards
  const getTierMultiplier = (tier) => {
    switch (Number(tier)) {
      case 0: return 0.5; // NEWCOMER
      case 1: return 1.0; // SOLVER
      case 2: return 1.5; // EXPERT
      case 3: return 2.0; // ORACLE
      default: return 0.5;
    }
  };

  const getTierProgress = (tier, solved) => {
    const tierRequirements = [0, 10, 50, 100]; // Riddles needed for each tier
    const currentTier = Number(tier) || 0;
    const nextTierRequirement = tierRequirements[currentTier + 1];

    if (!nextTierRequirement) return { progress: 100, isMaxTier: true };

    const progress = (Number(solved) / nextTierRequirement) * 100;
    return { progress: Math.min(progress, 100), isMaxTier: false };
  };

  return {
    balance: balance ? formatEther(balance) : '0',
    userTier: Number(userTier) || 0,
    riddlesSolved: Number(riddlesSolved) || 0,
    tierName: tierName || 'NEWCOMER',
    tierMultiplier: getTierMultiplier(userTier),
    tierProgress: getTierProgress(userTier, riddlesSolved),
    refetchBalance,
  };
}

// Hook for Riddle NFTs
export function useRiddleNFT(userAddress) {
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.RIDDLE_NFT,
    abi: RIDDLE_NFT_ABI,
    functionName: 'balanceOf',
    args: [userAddress || '0x0000000000000000000000000000000000000000'],
    enabled: !!userAddress,
  });

  const { data: totalSupply } = useReadContract({
    address: CONTRACTS.RIDDLE_NFT,
    abi: RIDDLE_NFT_ABI,
    functionName: 'totalSupply',
  });

  const { data: currentMintCost } = useReadContract({
    address: CONTRACTS.RIDDLE_NFT,
    abi: RIDDLE_NFT_ABI,
    functionName: 'getCurrentMintCost',
  });

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isTransactionLoading } = useWaitForTransactionReceipt({ hash });

  // Get riddle data for a specific token
  const useRiddleData = (tokenId) => {
    const { data: riddleData } = useReadContract({
      address: CONTRACTS.RIDDLE_NFT,
      abi: RIDDLE_NFT_ABI,
      functionName: 'getRiddleData',
      args: [BigInt(tokenId || 0)],
      enabled: !!tokenId,
    });

    const { data: rewardTier } = useReadContract({
      address: CONTRACTS.RIDDLE_NFT,
      abi: RIDDLE_NFT_ABI,
      functionName: 'getRewardTier',
      args: [BigInt(tokenId || 0)],
      enabled: !!tokenId,
    });

    return {
      riddle: riddleData?.[0] || '',
      reward: riddleData?.[1] ? formatEther(riddleData[1]) : '0',
      solved: riddleData?.[2] || false,
      solver: riddleData?.[3] || '0x0000000000000000000000000000000000000000',
      rewardTier: Number(rewardTier) || 1,
    };
  };

  const mintRiddle = async () => {
    try {
      await writeContract({
        address: CONTRACTS.RIDDLE_NFT,
        abi: RIDDLE_NFT_ABI,
        functionName: 'mintNFT',
        // Note: Cost is handled by contract based on getCurrentMintCost()
      });
    } catch (error) {
      console.error('Riddle minting failed:', error);
      throw error;
    }
  };

  const submitSolution = async (tokenId, questionHash) => {
    try {
      await writeContract({
        address: CONTRACTS.RIDDLE_NFT,
        abi: RIDDLE_NFT_ABI,
        functionName: 'submitQuestion',
        args: [BigInt(tokenId), questionHash],
        // Note: Cost is handled by contract
      });
    } catch (error) {
      console.error('Solution submission failed:', error);
      throw error;
    }
  };

  return {
    balance: Number(balance) || 0,
    totalSupply: Number(totalSupply) || 0,
    currentMintCost: currentMintCost ? formatEther(currentMintCost) : '1000',
    mintRiddle,
    submitSolution,
    useRiddleData,
    refetchBalance,
    isTransactionLoading,
  };
}

// Hook for tiered rewards calculation
export function useRewardCalculator() {
  const calculateReward = (baseReward, userTier, riddlesSolved) => {
    const ron = useRON();
    const multiplier = ron.getTierMultiplier(userTier);

    // Additional bonus for solving streaks
    const streakBonus = Math.min(riddlesSolved * 0.01, 0.5); // Max 50% bonus

    return {
      baseReward: Number(baseReward),
      multiplier,
      streakBonus,
      finalReward: Number(baseReward) * multiplier * (1 + streakBonus),
    };
  };

  return { calculateReward };
}

// Hook for Treasury and Grand Prize tracking
export function useTreasury() {
  // Get RDLN total supply
  const { data: rdlnSupply } = useReadContract({
    address: CONTRACTS.RDLN,
    abi: ERC20_ABI,
    functionName: 'totalSupply',
  });

  // Get NFT total supply to estimate treasury
  const { data: nftSupply } = useReadContract({
    address: CONTRACTS.RIDDLE_NFT,
    abi: RIDDLE_NFT_ABI,
    functionName: 'totalSupply',
  });

  // Calculate treasury metrics based on tokenomics
  // Assuming ~2000 RDLN per riddle cycle (1000 mint + 1000 solve)
  const estimatedRevenue = nftSupply ? Number(nftSupply) * 2000 : 0;

  // 25% goes to treasury/grand prize
  const grandPrizeBalance = Math.floor(estimatedRevenue * 0.25).toLocaleString('en-US');

  // 50% gets burned
  const totalBurned = Math.floor(estimatedRevenue * 0.5).toLocaleString('en-US');

  // Treasury balance (same as grand prize in this model)
  const treasuryBalance = grandPrizeBalance;

  return {
    treasuryBalance,
    grandPrizeBalance,
    totalBurned,
    isLoading: !rdlnSupply || !nftSupply,
  };
}