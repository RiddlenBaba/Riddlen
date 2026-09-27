import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAccount, useBalance, useChainId, useConnect, useDisconnect, useReadContract, useSwitchChain } from 'wagmi';
import { formatEther } from 'viem';
import { CHAIN, CONTRACTS, EXPLORER } from '../lib/wagmi';
import { ERC20_ABI, HUNT_ABI } from '../lib/abi';

export const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '');
const fmt = (v, d = 0) => Number(formatEther(v ?? 0n)).toLocaleString(undefined, { maximumFractionDigits: d });

/** Modal listing every wallet the browser offers */
export function WalletPicker({ open, onClose }) {
  const { connect, connectors, isPending, error, variables } = useConnect();
  const { isConnected } = useAccount();
  useEffect(() => { if (isConnected && open) onClose(); }, [isConnected, open, onClose]);
  if (!open) return null;

  // Discovered wallets first; the generic injected connector only when nothing announced itself
  const discovered = connectors.filter((c) => c.type === 'injected' && c.id !== 'injected');
  const list = [
    ...discovered,
    ...(discovered.length === 0 ? connectors.filter((c) => c.id === 'injected') : []),
    ...connectors.filter((c) => c.type !== 'injected'),
  ];

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal card" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Connect a wallet">
        <div className="head"><strong>Connect a wallet</strong><button className="x" onClick={onClose} aria-label="Close">×</button></div>
        <ul>
          {list.map((c) => (
            <li key={c.uid}>
              <button disabled={isPending} onClick={() => connect({ connector: c, chainId: CHAIN.id })}>
                {c.icon ? <img src={c.icon} alt="" /> : <span className="ph" />}
                <span>{c.id === 'injected' ? 'Browser wallet' : c.name}</span>
                {isPending && variables?.connector?.uid === c.uid && <span className="muted">connecting…</span>}
              </button>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className="muted">No wallet found. Install <a href="https://metamask.io" target="_blank" rel="noreferrer">MetaMask</a>, then reload.</p>}
        {error && <p className="notice warn">{error.shortMessage || error.message}</p>}
        <p className="fine muted">Riddlen runs on Polygon Amoy testnet. You will be asked to switch networks.</p>
      </div>
      <style jsx>{`
        .scrim { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; padding: 16px; }
        .modal { width: 100%; max-width: 380px; padding: 18px; display: flex; flex-direction: column; gap: 12px; background: var(--paper); }
        .head { display: flex; justify-content: space-between; align-items: center; }
        .x { border: none; background: none; font-size: 22px; cursor: pointer; line-height: 1; }
        ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        li button { width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 10px; border: 1px solid var(--line-strong); background: transparent; cursor: pointer; font-weight: 500; }
        li button:hover { background: var(--paper-2); }
        li button:disabled { opacity: 0.6; cursor: wait; }
        img, .ph { width: 26px; height: 26px; border-radius: 6px; }
        .ph { background: var(--paper-3); }
        .fine { font-size: 12px; margin: 0; }
        p { margin: 0; }
      `}</style>
    </div>
  );
}

/** Header button: opens the picker, or an account menu once connected */
export function WalletButton() {
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const [picker, setPicker] = useState(false);
  const [menu, setMenu] = useState(false);
  const enabled = isConnected && !!address;

  const { data: rdln } = useReadContract({ address: CONTRACTS.RDLN, abi: ERC20_ABI, functionName: 'balanceOf', args: [address], query: { enabled, refetchInterval: 15000 } });
  const { data: owed } = useReadContract({ address: CONTRACTS.HUNT, abi: HUNT_ABI, functionName: 'owed', args: [address], query: { enabled, refetchInterval: 15000 } });
  const { data: gas } = useBalance({ address, query: { enabled, refetchInterval: 15000 } });

  useEffect(() => { setMenu(false); }, [address]);

  if (!isConnected) {
    return (
      <>
        <button className="btn primary small" onClick={() => setPicker(true)}>Connect wallet</button>
        <WalletPicker open={picker} onClose={() => setPicker(false)} />
      </>
    );
  }
  if (chainId !== CHAIN.id) {
    return <button className="btn accent small" onClick={() => switchChain({ chainId: CHAIN.id })}>Switch to Amoy</button>;
  }
  return (
    <div className="acct">
      <button className="btn small mono" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
        {connector?.icon && <img src={connector.icon} alt="" />}{short(address)}
      </button>
      {menu && (
        <div className="menu card">
          <div className="row"><span className="k">RDLN</span><span className="v mono">{fmt(rdln)}</span></div>
          <div className="row"><span className="k">Owed to you</span><span className="v mono">{fmt(owed)}</span></div>
          <div className="row"><span className="k">Gas (POL)</span><span className="v mono">{gas ? fmt(gas.value, 3) : '…'}</span></div>
          {gas && gas.value < 10n ** 16n && <Link href="/free" legacyBehavior><a className="hint" onClick={() => setMenu(false)}>Low on test POL. Get some →</a></Link>}
          <hr className="rule" />
          <Link href="/me" legacyBehavior><a onClick={() => setMenu(false)}>Dashboard</a></Link>
          <a href={`${EXPLORER}/address/${address}`} target="_blank" rel="noreferrer">View on explorer</a>
          <button className="link" onClick={() => { disconnect(); setMenu(false); }}>Disconnect {connector?.name ? `(${connector.name})` : ''}</button>
        </div>
      )}
      <style jsx>{`
        .acct { position: relative; }
        .acct img { width: 16px; height: 16px; border-radius: 4px; }
        .menu { position: absolute; right: 0; top: calc(100% + 8px); min-width: 240px; padding: 12px; display: flex; flex-direction: column; gap: 8px; background: var(--paper); z-index: 20; box-shadow: 0 16px 40px -20px rgba(0,0,0,0.5); font-size: 14px; }
        .row { display: flex; justify-content: space-between; gap: 12px; }
        .k { color: var(--ink-2); }
        .menu a, .menu .link { text-align: left; text-decoration: none; color: var(--ink); padding: 4px 0; border: none; background: none; cursor: pointer; font: inherit; font-size: 14px; }
        .menu a:hover, .menu .link:hover { color: var(--accent); }
        .hint { color: var(--warn) !important; font-size: 13px; }
      `}</style>
    </div>
  );
}

/** A single connect button for pages that want one inline (e.g. /free) */
export function ConnectInline({ label = 'Connect wallet', className = 'btn accent' }) {
  const [picker, setPicker] = useState(false);
  return (
    <>
      <button className={className} onClick={() => setPicker(true)}>{label}</button>
      <WalletPicker open={picker} onClose={() => setPicker(false)} />
    </>
  );
}

export function useWalletTotals(address) {
  const enabled = !!address;
  const { data: rdln } = useReadContract({ address: CONTRACTS.RDLN, abi: ERC20_ABI, functionName: 'balanceOf', args: [address], query: { enabled, refetchInterval: 15000 } });
  const { data: ron } = useReadContract({ address: CONTRACTS.RON, abi: ERC20_ABI, functionName: 'balanceOf', args: [address], query: { enabled, refetchInterval: 15000 } });
  const { data: gas } = useBalance({ address, query: { enabled, refetchInterval: 15000 } });
  return useMemo(() => ({ rdln: rdln ?? 0n, ron: ron ?? 0n, gas: gas?.value ?? 0n }), [rdln, ron, gas]);
}
