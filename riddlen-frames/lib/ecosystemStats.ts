import { createPublicClient, http, formatEther } from 'viem';
import { polygonAmoy } from 'viem/chains';
import { createCachedFetcher } from './cache';

// Contract addresses
const CONTRACTS = {
  RDLN: '0x133029184EC460F661d05b0dC57BFC916b4AB0eB' as `0x${string}`,
  RON: '0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635' as `0x${string}`,
  RIDDLE_NFT: '0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3' as `0x${string}`,
  AIRDROP: '0x330275259AfCeC8822A861ecbbdfD026dB1B0A13' as `0x${string}`,
};

const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC),
});

// ABIs
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

const NFT_ABI = [
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const;

// Fetch live ecosystem statistics
async function _getEcosystemStats() {
  try {
    // Fetch all data in parallel
    const [rdlnSupply, nftSupply, burnAddress] = await Promise.all([
      publicClient.readContract({
        address: CONTRACTS.RDLN,
        abi: ERC20_ABI,
        functionName: 'totalSupply',
      }),
      publicClient.readContract({
        address: CONTRACTS.RIDDLE_NFT,
        abi: NFT_ABI,
        functionName: 'totalSupply',
      }),
      publicClient.readContract({
        address: CONTRACTS.RDLN,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: ['0x000000000000000000000000000000000000dEaD'],
      }),
    ]);

    const rdlnTotal = Number(formatEther(rdlnSupply));
    const nftTotal = Number(nftSupply);
    const burned = Number(formatEther(burnAddress));

    // RON is soulbound and doesn't have totalSupply, estimate from riddles solved
    const ronTotal = nftTotal * 100; // Rough estimate: 100 RON per riddle

    // Calculate treasury/grand prize (25% of circulation)
    const grandPrize = Math.floor(rdlnTotal * 0.25);

    // Calculate total value locked (rough estimate)
    const tvl = rdlnTotal + ronTotal;

    return {
      rdln: {
        totalSupply: Math.floor(rdlnTotal).toLocaleString(),
        burned: Math.floor(burned).toLocaleString(),
        circulating: Math.floor(rdlnTotal - burned).toLocaleString(),
      },
      ron: {
        totalSupply: Math.floor(ronTotal).toLocaleString(),
      },
      nft: {
        minted: nftTotal,
        available: 999 - nftTotal,
        maxSupply: 999,
      },
      treasury: {
        grandPrize: grandPrize.toLocaleString(),
        airdropPool: '500,000', // From contract
      },
      metrics: {
        tvl: Math.floor(tvl).toLocaleString(),
        riddlesSolved: Math.floor(ronTotal / 100), // Rough estimate
        activeUsers: nftTotal, // NFT holders
      },
    };
  } catch (error) {
    console.error('Error fetching ecosystem stats:', error);
    return {
      rdln: {
        totalSupply: '10,000,000',
        burned: '0',
        circulating: '10,000,000',
      },
      ron: {
        totalSupply: '0',
      },
      nft: {
        minted: 0,
        available: 999,
        maxSupply: 999,
      },
      treasury: {
        grandPrize: '0',
        airdropPool: '500,000',
      },
      metrics: {
        tvl: '10,000,000',
        riddlesSolved: 0,
        activeUsers: 0,
      },
    };
  }
}

// Cached version - refresh every 2 minutes
export const getEcosystemStats = createCachedFetcher(
  _getEcosystemStats,
  'ecosystem-stats',
  120
);
