import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { FAUCET_ABI, ERC20_ABI } from '../lib/abi';
import { CONTRACTS } from '../lib/wagmi';
import { useTx } from './useTx';

const faucet = { address: CONTRACTS.FAUCET, abi: FAUCET_ABI };
const REFRESH_MS = 12_000;

/** Seconds since epoch, ticking once a second */
export function useNow() {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/** The testnet RDLN faucet and the wallet's RDLN balance */
export function useFaucet(player) {
  const enabled = !!player;
  const tx = useTx();
  const { data: canClaim, refetch: r1 } = useReadContract({ ...faucet, functionName: 'canClaim', args: [player], query: { enabled, refetchInterval: REFRESH_MS } });
  const { data: amount } = useReadContract({ ...faucet, functionName: 'claimAmount', query: { enabled } });
  const { data: rdln, refetch: r2 } = useReadContract({ address: CONTRACTS.RDLN, abi: ERC20_ABI, functionName: 'balanceOf', args: [player], query: { enabled, refetchInterval: REFRESH_MS } });
  return {
    available: !!canClaim, amount: amount ?? 0n, rdln: rdln ?? 0n,
    pending: tx.pending, error: tx.error,
    refetch: () => { r1(); r2(); },
    claim: () => tx.run('Claiming testnet RDLN', (w) => w({ ...faucet, functionName: 'claim', args: [] })),
  };
}
