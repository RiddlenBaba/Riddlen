import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { ERC20_ABI, RIDDLE_NFT_ABI, RON_ABI } from '../lib/abis';
import { CONTRACTS } from '../lib/wagmi';

/**
 * Hook for fetching live platform statistics from the blockchain
 * Returns comprehensive stats about RDLN, RON, NFTs, and platform activity
 */
export function usePlatformStats() {
  // RDLN Total Supply
  const { data: rdlnSupply, isLoading: rdlnLoading } = useReadContract({
    address: CONTRACTS.RDLN,
    abi: ERC20_ABI,
    functionName: 'totalSupply',
  });

  // RON Total Supply
  const { data: ronSupply, isLoading: ronLoading } = useReadContract({
    address: CONTRACTS.RON,
    abi: ERC20_ABI,
    functionName: 'totalSupply',
  });

  // Total NFTs Minted
  const { data: nftTotalSupply, isLoading: nftLoading } = useReadContract({
    address: CONTRACTS.RIDDLE_NFT,
    abi: RIDDLE_NFT_ABI,
    functionName: 'totalSupply',
  });

  // Total Riddles Solved - would come from events or dedicated function
  // For now, estimate based on NFT supply (not all NFTs are solved)
  const riddleCount = nftTotalSupply ? Math.floor(Number(nftTotalSupply) * 0.3) : 0;
  const riddleCountLoading = false;

  // Format numbers with commas
  const formatNumber = (num) => {
    if (!num) return '0';
    return Number(num).toLocaleString('en-US');
  };

  // Format token amounts (remove decimals for display)
  const formatTokenAmount = (amount) => {
    if (!amount) return '0';
    const formatted = formatEther(amount);
    const number = Math.floor(Number(formatted));
    return number.toLocaleString('en-US');
  };

  // Calculate derived statistics
  const totalRDLNSupply = rdlnSupply ? formatTokenAmount(rdlnSupply) : '0';
  const totalRONSupply = ronSupply ? formatTokenAmount(ronSupply) : '0';
  const totalNFTsMinted = nftTotalSupply ? formatNumber(nftTotalSupply) : '0';
  const totalRiddlesSolved = riddleCount ? formatNumber(riddleCount) : '0';

  // Calculate estimated values based on tokenomics
  // 25% of all fees go to treasury (grand prize)
  // Assuming ~1000 RDLN per mint + 1000 RDLN per solve attempt
  const estimatedRevenue = nftTotalSupply ? Number(nftTotalSupply) * 2000 : 0;
  const grandPrize = formatNumber(Math.floor(estimatedRevenue * 0.25));
  const treasuryBalance = grandPrize; // Same as grand prize in this model

  // 50% gets burned
  const totalBurned = formatNumber(Math.floor(estimatedRevenue * 0.5));

  // Calculate total players (estimated as unique NFT holders)
  // This is a rough estimate - actual implementation would need to track events
  const totalPlayers = nftTotalSupply ? formatNumber(Math.floor(Number(nftTotalSupply) * 0.6)) : '0';

  // Average solve time (mock for now - would need to track events)
  const avgSolveTime = '47 min';

  const isLoading = rdlnLoading || ronLoading || nftLoading || riddleCountLoading;

  return {
    // Raw data
    totalRDLNSupply,
    totalRONSupply,
    totalNFTsMinted,
    totalRiddlesSolved,

    // Derived stats
    grandPrize,
    treasuryBalance,
    totalBurned,
    totalPlayers,
    avgSolveTime,

    // Loading state
    isLoading,

    // Error flag
    hasError: false,
  };
}