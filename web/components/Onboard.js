import { useState } from 'react';
import { useAccount, useWatchAsset } from 'wagmi';
import { CONTRACTS, EXPLORER } from '../lib/wagmi';

/** "Add RDLN to your wallet" via EIP-747, so the balance shows up in MetaMask and friends */
export function AddTokenButton({ className = 'btn small' }) {
  const { connector } = useAccount();
  const { watchAsset, isPending, isSuccess, error } = useWatchAsset();
  const add = () => watchAsset({
    type: 'ERC20',
    options: { address: CONTRACTS.RDLN, symbol: 'RDLN', decimals: 18 },
  });
  return (
    <span className="add">
      <button className={className} disabled={isPending} onClick={add}>
        {isPending ? 'Check your wallet…' : isSuccess ? 'RDLN added' : `Add RDLN to ${connector?.name || 'wallet'}`}
      </button>
      {error && <span className="muted small"> Your wallet didn&apos;t take it. Add it manually: <code>{CONTRACTS.RDLN}</code></span>}
      <style jsx>{`
        .add { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .small { font-size: 12px; }
        code { font-family: var(--mono); font-size: 11px; }
      `}</style>
    </span>
  );
}

/** Asks the site's gas drip for test POL */
export function GasButton({ address, onDone, className = 'btn small' }) {
  const [state, setState] = useState({ busy: false, msg: null, ok: false });
  const drip = async () => {
    setState({ busy: true, msg: null, ok: false });
    try {
      const r = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Drip failed');
      setState({ busy: false, ok: true, msg: `Sent ${j.amount} POL. It lands in a few seconds.`, hash: j.hash });
      onDone?.();
    } catch (e) {
      setState({ busy: false, ok: false, msg: e.message });
    }
  };
  return (
    <span className="gas">
      <button className={className} disabled={state.busy || !address} onClick={drip}>{state.busy ? 'Sending…' : 'Get test POL for gas'}</button>
      {state.msg && <span className={`small ${state.ok ? 'ok' : 'warn'}`}>{state.msg}{state.hash && <> <a href={`${EXPLORER}/tx/${state.hash}`} target="_blank" rel="noreferrer">tx</a></>}</span>}
      <style jsx>{`
        .gas { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .small { font-size: 12px; }
        .ok { color: var(--human); }
        .warn { color: var(--warn); }
      `}</style>
    </span>
  );
}
