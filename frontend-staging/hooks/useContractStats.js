import { useReadContract, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACTS } from '../lib/wagmi';
import { RDLN_ABI, RON_ABI, RIDDLE_NFT_ABI } from '../lib/abis';

// Hook to get RDLN token stats
export function useRDLNStats() {
  const { data, isError, isLoading } = useReadContracts({
    contracts: [
      {
        address: CONTRACTS.RDLN,
        abi: RDLN_ABI,
        functionName: 'totalSupply',
      },
      {
        address: CONTRACTS.RDLN,
        abi: RDLN_ABI,
        functionName: 'balanceOf',
        args: ['0x000000000000000000000000000000000000dEaD'], // Burn address
      },
      {
        address: CONTRACTS.RDLN,
        abi: RDLN_ABI,
        functionName: 'balanceOf',
        args: [CONTRACTS.RIDDLE_NFT], // Prize pool
      },
    ],
    watch: true,
    cacheTime: 30_000, // Cache for 30 seconds
  });

  if (isLoading || isError || !data) {
    return {
      totalSupply: '1000000000',
      totalBurned: '0',
      prizePool: '700000000',
      circulatingSupply: '300000000',
      isLoading,
      isError,
    };
  }

  const totalSupply = data[0]?.result ? formatUnits(data[0].result, 18) : '1000000000';
  const totalBurned = data[1]?.result ? formatUnits(data[1].result, 18) : '0';
  const prizePool = data[2]?.result ? formatUnits(data[2].result, 18) : '700000000';
  const circulatingSupply = (parseFloat(totalSupply) - parseFloat(totalBurned)).toFixed(0);

  return {
    totalSupply,
    totalBurned,
    prizePool,
    circulatingSupply,
    isLoading,
    isError,
  };
}

// Hook to get Riddle NFT stats
export function useRiddleStats() {
  const { data, isError, isLoading } = useReadContracts({
    contracts: [
      {
        address: CONTRACTS.RIDDLE_NFT,
        abi: RIDDLE_NFT_ABI,
        functionName: 'totalSupply',
      },
      {
        address: CONTRACTS.RIDDLE_NFT,
        abi: RIDDLE_NFT_ABI,
        functionName: 'riddleCount',
      },
    ],
    watch: true,
    cacheTime: 30_000,
  });

  if (isLoading || isError || !data) {
    return {
      totalMinted: '0',
      totalRiddles: '0',
      totalSolved: '0',
      isLoading,
      isError,
    };
  }

  const totalMinted = data[0]?.result ? data[0].result.toString() : '0';
  const totalRiddles = data[1]?.result ? data[1].result.toString() : '0';

  return {
    totalMinted,
    totalRiddles,
    totalSolved: '0', // Can add a solvedCount function to contract
    isLoading,
    isError,
  };
}

// Hook to get RON stats
export function useRONStats() {
  const { data, isError, isLoading } = useReadContracts({
    contracts: [
      {
        address: CONTRACTS.RON,
        abi: RON_ABI,
        functionName: 'totalSupply',
      },
    ],
    watch: true,
    cacheTime: 30_000,
  });

  if (isLoading || isError || !data) {
    return {
      totalRON: '0',
      isLoading,
      isError,
    };
  }

  const totalRON = data[0]?.result ? formatUnits(data[0].result, 18) : '0';

  return {
    totalRON,
    isLoading,
    isError,
  };
}

// Hook to get Grand Prize wallet balance
export function useGrandPrize() {
  const { data, isError, isLoading } = useReadContract({
    address: CONTRACTS.RDLN,
    abi: RDLN_ABI,
    functionName: 'balanceOf',
    args: [CONTRACTS.RIDDLE_NFT], // Assuming grand prize is held in Riddle NFT contract
    watch: true,
    cacheTime: 30_000,
  });

  if (isLoading || isError || !data) {
    return {
      grandPrize: '0',
      isLoading,
      isError,
    };
  }

  const grandPrize = formatUnits(data, 18);

  return {
    grandPrize,
    isLoading,
    isError,
  };
}

// Hook to get Treasury balance
export function useTreasury() {
  const TREASURY_ADDRESS = '0x0000000000000000000000000000000000000001'; // Replace with actual treasury address

  const { data, isError, isLoading } = useReadContract({
    address: CONTRACTS.RDLN,
    abi: RDLN_ABI,
    functionName: 'balanceOf',
    args: [TREASURY_ADDRESS],
    watch: true,
    cacheTime: 30_000,
  });

  if (isLoading || isError || !data) {
    return {
      treasury: '100000000',
      isLoading,
      isError,
    };
  }

  const treasury = formatUnits(data, 18);

  return {
    treasury,
    isLoading,
    isError,
  };
}

// Format large numbers for display
export function formatNumber(num) {
  const n = parseFloat(num);
  if (n >= 1_000_000_000) {
    return (n / 1_000_000_000).toFixed(2) + 'B';
  }
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(2) + 'M';
  }
  if (n >= 1_000) {
    return (n / 1_000).toFixed(2) + 'K';
  }
  return n.toFixed(2);
}

// Format percentage
export function formatPercentage(part, total) {
  const percentage = (parseFloat(part) / parseFloat(total)) * 100;
  return percentage.toFixed(2) + '%';
}