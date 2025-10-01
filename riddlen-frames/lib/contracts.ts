import { createPublicClient, http, formatEther } from 'viem';
import { polygonAmoy } from 'viem/chains';
import { createCachedFetcher, fetchParallel, performanceMonitor } from './cache';

// Contract addresses from environment
export const CONTRACTS = {
  RDLN: process.env.NEXT_PUBLIC_RDLN_CONTRACT as `0x${string}`,
  RON: process.env.NEXT_PUBLIC_RON_CONTRACT as `0x${string}`,
  RIDDLE_NFT: process.env.NEXT_PUBLIC_RIDDLE_NFT_CONTRACT as `0x${string}`,
};

// Create public client for reading blockchain data
export const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC),
  batch: {
    multicall: true,
  },
});

// Basic ABIs for reading data
const RIDDLE_NFT_ABI = [
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'getCurrentMintCost',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'getRiddleData',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [
      { type: 'string' },
      { type: 'uint256' },
      { type: 'bool' },
      { type: 'address' }
    ],
  },
  {
    name: 'riddles',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'riddleId', type: 'uint256' },
      { name: 'weekNumber', type: 'uint256' },
      { name: 'creationTime', type: 'uint256' },
      { name: 'totalMinted', type: 'uint256' },
      { name: 'maxMintRate', type: 'uint256' },
      { name: 'prizePool', type: 'uint256' },
      { name: 'winnerSlots', type: 'uint256' },
      { name: 'totalSolved', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
      { name: 'prizeDistributed', type: 'bool' },
      { name: 'riddleHash', type: 'bytes32' },
      { name: 'answerHash', type: 'bytes32' }
    ],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const;

const ERC20_ABI = [
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const;

const RON_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'getUserTier',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint8' }],
  },
] as const;

// Fetch current riddle data from blockchain (with caching)
async function _getCurrentRiddleData() {
  return performanceMonitor.measure('getCurrentRiddleData', async () => {
    try {
    // Get total supply of NFTs (this is also the current riddle ID)
    const totalSupply = await publicClient.readContract({
      address: CONTRACTS.RIDDLE_NFT,
      abi: RIDDLE_NFT_ABI,
      functionName: 'totalSupply',
    });

    const currentRiddleId = Number(totalSupply);

    // Get mint cost
    const mintCost = await publicClient.readContract({
      address: CONTRACTS.RIDDLE_NFT,
      abi: RIDDLE_NFT_ABI,
      functionName: 'getCurrentMintCost',
    });

    // Get RDLN total supply for prize pool estimation
    const rdlnSupply = await publicClient.readContract({
      address: CONTRACTS.RDLN,
      abi: ERC20_ABI,
      functionName: 'totalSupply',
    });

    // If we have riddles, get the latest one's data
    let riddleData = null;
    if (currentRiddleId > 0) {
      riddleData = await publicClient.readContract({
        address: CONTRACTS.RIDDLE_NFT,
        abi: RIDDLE_NFT_ABI,
        functionName: 'getRiddleData',
        args: [BigInt(currentRiddleId - 1)],
      });
    }

    // Calculate estimated prize pool (25% of all RDLN minted goes to treasury/prizes)
    const estimatedPrizePool = Number(formatEther(rdlnSupply)) * 0.25;

    return {
      riddleId: currentRiddleId,
      mintPrice: formatEther(mintCost),
      prizePool: Math.floor(estimatedPrizePool).toLocaleString('en-US'),
      totalNFTs: currentRiddleId,
      nftsAvailable: 999 - currentRiddleId, // Max supply is 999
      isLive: riddleData ? !riddleData[2] : true, // Not solved = live
      difficulty: 'Medium', // Default difficulty
      currentWinners: riddleData && riddleData[2] ? 1 : 0,
      totalWinners: 50, // Placeholder for multiple winners feature
    };
  } catch (error) {
    console.error('Error fetching riddle data:', error);
    // Return fallback data
    return {
      riddleId: 0,
      mintPrice: '1000',
      prizePool: '0',
      totalNFTs: 0,
      nftsAvailable: 999,
      isLive: true,
      difficulty: 'Medium',
      currentWinners: 0,
      totalWinners: 50,
    };
    }
  });
}

// Cached version with 60 second revalidation
export const getCurrentRiddleData = createCachedFetcher(
  _getCurrentRiddleData,
  'current-riddle-data',
  60
);

// Fetch user profile data from blockchain
export async function getUserProfile(address: `0x${string}`) {
  try {
    // Get RON balance
    const ronBalance = await publicClient.readContract({
      address: CONTRACTS.RON,
      abi: RON_ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    // Get RDLN balance
    const rdlnBalance = await publicClient.readContract({
      address: CONTRACTS.RDLN,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    // Get NFT balance
    const nftBalance = await publicClient.readContract({
      address: CONTRACTS.RIDDLE_NFT,
      abi: RIDDLE_NFT_ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    // Get user tier
    const userTier = await publicClient.readContract({
      address: CONTRACTS.RON,
      abi: RON_ABI,
      functionName: 'getUserTier',
      args: [address],
    });

    const tierNames = ['NEWCOMER', 'SOLVER', 'EXPERT', 'ORACLE'];
    const tierMultipliers = ['1.0x', '1.5x', '2.0x', '2.5x'];

    // Calculate approximate riddles solved (RON / avg reward ~100)
    const estimatedSolved = Math.floor(Number(formatEther(ronBalance)) / 100);

    return {
      address: `${address.slice(0, 6)}...${address.slice(-4)}`,
      ronBalance: Math.floor(Number(formatEther(ronBalance))).toLocaleString('en-US'),
      rdlnBalance: Math.floor(Number(formatEther(rdlnBalance))).toLocaleString('en-US'),
      nftsOwned: Number(nftBalance),
      riddlesSolved: estimatedSolved,
      tier: tierNames[Number(userTier)] || 'NEWCOMER',
      tierMultiplier: tierMultipliers[Number(userTier)] || '1.0x',
      rank: 0, // Will be calculated from events in production
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      address: `${address.slice(0, 6)}...${address.slice(-4)}`,
      ronBalance: '0',
      rdlnBalance: '0',
      nftsOwned: 0,
      riddlesSolved: 0,
      tier: 'NEWCOMER',
      tierMultiplier: '1.0x',
      rank: 0,
    };
  }
}

// Fetch top solvers for leaderboard (simplified - in production would use events/subgraph)
export async function getLeaderboard() {
  try {
    // In production, this would query Transfer events from RON contract
    // For now, return sample addresses with their balances
    const sampleAddresses = [
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      '0x5555763613a12D8F3e73be831DFf8598089d3dCa',
      '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686fd',
      '0x1234567890123456789012345678901234567890',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    ];

    const leaderboardData = await Promise.all(
      sampleAddresses.map(async (addr, index) => {
        try {
          const balance = await publicClient.readContract({
            address: CONTRACTS.RON,
            abi: RON_ABI,
            functionName: 'balanceOf',
            args: [addr as `0x${string}`],
          });

          const tier = await publicClient.readContract({
            address: CONTRACTS.RON,
            abi: RON_ABI,
            functionName: 'getUserTier',
            args: [addr as `0x${string}`],
          });

          const tierNames = ['NEWCOMER', 'SOLVER', 'EXPERT', 'ORACLE'];

          return {
            rank: index + 1,
            address: `${addr.slice(0, 6)}...${addr.slice(-4)}`,
            score: Math.floor(Number(formatEther(balance))).toLocaleString('en-US'),
            tier: tierNames[Number(tier)] || 'NEWCOMER',
          };
        } catch {
          return {
            rank: index + 1,
            address: `${addr.slice(0, 6)}...${addr.slice(-4)}`,
            score: '0',
            tier: 'NEWCOMER',
          };
        }
      })
    );

    // Sort by score (remove commas for comparison)
    return leaderboardData
      .sort((a, b) => {
        const scoreA = parseInt(a.score.replace(/,/g, ''));
        const scoreB = parseInt(b.score.replace(/,/g, ''));
        return scoreB - scoreA;
      })
      .map((item, index) => ({ ...item, rank: index + 1 }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}
