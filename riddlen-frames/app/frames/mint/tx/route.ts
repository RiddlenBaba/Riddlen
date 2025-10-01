import { TransactionTargetResponse } from "frames.js";
import { CONTRACTS } from "../../../../lib/contracts";
import { encodeFunctionData } from "viem";
import { NextRequest, NextResponse } from "next/server";

// ABI for mintNFT function
const MINT_ABI = [{
  name: 'mintNFT',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [],
  outputs: [{ type: 'uint256' }],
}] as const;

// Transaction data handler
export async function POST(req: NextRequest): Promise<NextResponse<TransactionTargetResponse>> {
  // Encode the transaction data
  const calldata = encodeFunctionData({
    abi: MINT_ABI,
    functionName: 'mintNFT',
  });

  // Return transaction request
  return NextResponse.json({
    chainId: 'eip155:80002', // Polygon Amoy testnet
    method: 'eth_sendTransaction',
    params: {
      abi: MINT_ABI,
      to: CONTRACTS.RIDDLE_NFT,
      data: calldata,
      value: '0', // Minting cost is handled by RDLN token approval
    },
  });
}
