import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { RON_ABI } from '../lib/abis';
import { CONTRACTS } from '../lib/wagmi';

/**
 * Hook for fetching top solvers leaderboard
 * Returns sorted array of top players with their stats
 *
 * Note: This is a simplified version that uses mock data structure
 * In production, you would need to:
 * 1. Query blockchain events to get all unique solvers
 * 2. Fetch their RON balances and riddles solved
 * 3. Sort by performance
 *
 * For now, we'll return a structure that can be populated by the contract
 */
export function useLeaderboard(limit = 5) {
  // In a full implementation, you would need to:
  // 1. Listen to Transfer/RiddleSolved events to build a list of addresses
  // 2. Query each address for their stats
  // 3. Sort and return top performers

  // For this implementation, we'll create a hook that fetches data for known addresses
  // The contract would need a getTopSolvers() function, or we'd need to index events

  // Mock addresses for demonstration (in production, fetch from events)
  const mockTopAddresses = [
    '0x1234567890123456789012345678901234567890',
    '0xabcdef0123456789abcdef0123456789abcdef01',
    '0x9876543210987654321098765432109876543210',
    '0x4567890123456789012345678901234567890123',
    '0xfedcba9876543210fedcba9876543210fedcba98',
  ];

  // Fetch data for first address as example
  const { data: balance1 } = useReadContract({
    address: CONTRACTS.RON,
    abi: RON_ABI,
    functionName: 'balanceOf',
    args: [mockTopAddresses[0]],
  });

  const { data: solved1 } = useReadContract({
    address: CONTRACTS.RON,
    abi: RON_ABI,
    functionName: 'getRiddlesSolved',
    args: [mockTopAddresses[0]],
  });

  const { data: tier1 } = useReadContract({
    address: CONTRACTS.RON,
    abi: RON_ABI,
    functionName: 'getUserTier',
    args: [mockTopAddresses[0]],
  });

  const { data: tierName1 } = useReadContract({
    address: CONTRACTS.RON,
    abi: RON_ABI,
    functionName: 'getTierName',
    args: [tier1 || 0],
    enabled: tier1 !== undefined,
  });

  // Helper to get tier name from number
  const getTierName = (tierNum) => {
    const tiers = ['NEWCOMER', 'SOLVER', 'EXPERT', 'ORACLE'];
    return tiers[Number(tierNum)] || 'NEWCOMER';
  };

  // Helper to format address
  const formatAddress = (address) => {
    if (!address) return '0x0000...0000';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Build leaderboard array
  // In production, you would fetch all addresses and their stats
  const topSolvers = [
    {
      rank: 1,
      address: formatAddress(mockTopAddresses[0]),
      fullAddress: mockTopAddresses[0],
      solved: solved1 ? Number(solved1) : 312,
      ron: balance1 ? Math.floor(Number(formatEther(balance1))) : 156,
      tier: tierName1 || getTierName(tier1) || 'ORACLE',
    },
    // Mock data for other positions (would fetch from blockchain in production)
    {
      rank: 2,
      address: formatAddress(mockTopAddresses[1]),
      fullAddress: mockTopAddresses[1],
      solved: 287,
      ron: 143,
      tier: 'ORACLE',
    },
    {
      rank: 3,
      address: formatAddress(mockTopAddresses[2]),
      fullAddress: mockTopAddresses[2],
      solved: 234,
      ron: 117,
      tier: 'EXPERT',
    },
    {
      rank: 4,
      address: formatAddress(mockTopAddresses[3]),
      fullAddress: mockTopAddresses[3],
      solved: 198,
      ron: 99,
      tier: 'EXPERT',
    },
    {
      rank: 5,
      address: formatAddress(mockTopAddresses[4]),
      fullAddress: mockTopAddresses[4],
      solved: 176,
      ron: 88,
      tier: 'EXPERT',
    },
  ];

  return {
    topSolvers: topSolvers.slice(0, limit),
    isLoading: false, // Set based on actual queries in production
    hasError: false,
  };
}

/**
 * Hook to get user's rank on the leaderboard
 * @param {string} userAddress - User's wallet address
 */
export function useUserRank(userAddress) {
  const { data: userSolved } = useReadContract({
    address: CONTRACTS.RON,
    abi: RON_ABI,
    functionName: 'getRiddlesSolved',
    args: [userAddress || '0x0000000000000000000000000000000000000000'],
    enabled: !!userAddress,
  });

  const { data: userBalance } = useReadContract({
    address: CONTRACTS.RON,
    abi: RON_ABI,
    functionName: 'balanceOf',
    args: [userAddress || '0x0000000000000000000000000000000000000000'],
    enabled: !!userAddress,
  });

  // In production, would need to query all users and calculate rank
  // For now, return estimated rank based on solved count
  const estimateRank = (solved) => {
    if (solved > 250) return 'Top 10';
    if (solved > 100) return 'Top 50';
    if (solved > 50) return 'Top 100';
    if (solved > 10) return 'Top 500';
    return 'Unranked';
  };

  return {
    rank: userSolved ? estimateRank(Number(userSolved)) : 'Unranked',
    solved: userSolved ? Number(userSolved) : 0,
    ron: userBalance ? Math.floor(Number(formatEther(userBalance))) : 0,
  };
}