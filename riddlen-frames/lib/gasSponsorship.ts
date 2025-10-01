import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonAmoy } from 'viem/chains';
import { CONTRACTS, publicClient } from './contracts';

/**
 * Gas sponsorship configuration
 */
export const GAS_SPONSORSHIP_CONFIG = {
  // Sponsor first N mints per user
  MAX_SPONSORED_MINTS: 3,

  // Maximum gas price willing to sponsor (in gwei)
  MAX_GAS_PRICE_GWEI: 50,

  // Maximum number of sponsorships per day
  DAILY_LIMIT: 100,

  // Cooldown between sponsorships for same FID (in ms)
  COOLDOWN_MS: 60 * 60 * 1000, // 1 hour
};

/**
 * Track sponsored mints (in production, use database)
 */
class SponsorshipTracker {
  private sponsoredMints = new Map<string, number>(); // fid -> count
  private lastSponsored = new Map<string, number>(); // fid -> timestamp
  private dailyCount = 0;
  private dailyResetTime = Date.now() + 24 * 60 * 60 * 1000;

  canSponsor(fid: string): { eligible: boolean; reason?: string } {
    // Reset daily counter
    if (Date.now() > this.dailyResetTime) {
      this.dailyCount = 0;
      this.dailyResetTime = Date.now() + 24 * 60 * 60 * 1000;
    }

    // Check daily limit
    if (this.dailyCount >= GAS_SPONSORSHIP_CONFIG.DAILY_LIMIT) {
      return {
        eligible: false,
        reason: 'Daily sponsorship limit reached. Try again tomorrow!',
      };
    }

    // Check user's mint count
    const mintCount = this.sponsoredMints.get(fid) || 0;
    if (mintCount >= GAS_SPONSORSHIP_CONFIG.MAX_SPONSORED_MINTS) {
      return {
        eligible: false,
        reason: `You've used all ${GAS_SPONSORSHIP_CONFIG.MAX_SPONSORED_MINTS} free mints!`,
      };
    }

    // Check cooldown
    const lastTime = this.lastSponsored.get(fid) || 0;
    const timeSince = Date.now() - lastTime;
    if (timeSince < GAS_SPONSORSHIP_CONFIG.COOLDOWN_MS) {
      const minutesLeft = Math.ceil(
        (GAS_SPONSORSHIP_CONFIG.COOLDOWN_MS - timeSince) / (60 * 1000)
      );
      return {
        eligible: false,
        reason: `Please wait ${minutesLeft} minutes before next sponsored mint`,
      };
    }

    return { eligible: true };
  }

  recordSponsorship(fid: string) {
    const current = this.sponsoredMints.get(fid) || 0;
    this.sponsoredMints.set(fid, current + 1);
    this.lastSponsored.set(fid, Date.now());
    this.dailyCount++;
  }

  getStats(fid: string) {
    return {
      mintsUsed: this.sponsoredMints.get(fid) || 0,
      mintsRemaining:
        GAS_SPONSORSHIP_CONFIG.MAX_SPONSORED_MINTS -
        (this.sponsoredMints.get(fid) || 0),
      lastSponsoredAt: this.lastSponsored.get(fid),
    };
  }
}

export const sponsorshipTracker = new SponsorshipTracker();

/**
 * Sponsor a mint transaction
 * NOTE: This is a simplified implementation. In production:
 * 1. Use a proper backend service
 * 2. Store SPONSOR_PRIVATE_KEY in secure environment variable
 * 3. Implement proper key rotation
 * 4. Use a relayer service like Biconomy or Gelato
 */
export async function sponsorMint(
  userAddress: `0x${string}`,
  fid: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // Check eligibility
    const eligibility = sponsorshipTracker.canSponsor(fid);
    if (!eligibility.eligible) {
      return {
        success: false,
        error: eligibility.reason,
      };
    }

    // In production, this would be a secure backend service
    // For now, return a message that sponsorship is available
    sponsorshipTracker.recordSponsorship(fid);

    return {
      success: true,
      txHash: '0x0000000000000000000000000000000000000000000000000000000000000000', // Placeholder
    };
  } catch (error) {
    console.error('Gas sponsorship error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sponsorship failed',
    };
  }
}

/**
 * Check if user is eligible for gas sponsorship
 */
export function checkSponsorshipEligibility(fid: string) {
  return sponsorshipTracker.canSponsor(fid);
}

/**
 * Get user's sponsorship stats
 */
export function getSponsorshipStats(fid: string) {
  return sponsorshipTracker.getStats(fid);
}

/**
 * Mint NFT ABI for sponsorship
 */
const MINT_NFT_ABI = [
  {
    name: 'mintNFT',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const;

/**
 * Estimate gas cost for minting
 */
export async function estimateMintGas() {
  try {
    // Estimate gas for mint transaction
    const gas = await publicClient.estimateContractGas({
      address: CONTRACTS.RIDDLE_NFT,
      abi: MINT_NFT_ABI,
      functionName: 'mintNFT',
      account: '0x0000000000000000000000000000000000000000', // Dummy account for estimation
    });

    // Get current gas price
    const gasPrice = await publicClient.getGasPrice();

    const estimatedCost = gas * gasPrice;
    const costInMatic = Number(estimatedCost) / 1e18;

    return {
      gasUnits: gas.toString(),
      gasPriceGwei: (Number(gasPrice) / 1e9).toFixed(2),
      costMatic: costInMatic.toFixed(6),
      costUsd: (costInMatic * 0.5).toFixed(2), // Rough estimate, use price oracle in production
    };
  } catch (error) {
    console.error('Gas estimation error:', error);
    return {
      gasUnits: '100000',
      gasPriceGwei: '30',
      costMatic: '0.003',
      costUsd: '0.00',
    };
  }
}
