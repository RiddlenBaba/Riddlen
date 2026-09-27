import { useAccount } from 'wagmi';
import Layout from '../components/Layout';
import { useActions, useMe } from '../hooks/useStump';
import { rdln } from '../components/format';

export default function Winnings() {
  const { address, isConnected } = useAccount();
  const me = useMe(undefined, address);
  const actions = useActions(address);
  const busy = !!actions.pending;

  return (
    <Layout title="Winnings">
      <div className="wrap">
        <h1 className="display">Winnings</h1>
        {!isConnected && <p className="muted">Connect a wallet to see your balance and what you&apos;re owed.</p>}
        {isConnected && (
          <>
            <div className="tiles">
              <div className="tile">
                <span className="eyebrow">Owed to you</span>
                <strong className="display">{rdln(me.owed)} <span className="unit">RDLN</span></strong>
                <p className="muted">Payouts and refunds collect here. Withdraw pulls everything in one transaction. The token may apply its usual small transfer burn.</p>
                <button className="btn primary" disabled={me.owed === 0n || busy} onClick={() => actions.withdraw().then((ok) => ok && me.refetch())}>
                  {actions.pending === 'Withdrawing' ? 'Withdrawing…' : 'Withdraw'}
                </button>
              </div>
              <div className="tile">
                <span className="eyebrow">Wallet balance</span>
                <strong className="display">{rdln(me.rdln)} <span className="unit">RDLN</span></strong>
                {me.faucet.available ? (
                  <>
                    <p className="muted">This is the Amoy testnet. Every wallet can take {rdln(me.faucet.amount)} free RDLN once, enough for plenty of riddles.</p>
                    <button className="btn accent" disabled={busy} onClick={() => actions.claimFaucet().then((ok) => ok && me.refetch())}>
                      {actions.pending === 'Claiming testnet RDLN' ? 'Claiming…' : `Get ${rdln(me.faucet.amount)} testnet RDLN`}
                    </button>
                  </>
                ) : (
                  <p className="muted">Entries cost 10 to 100 RDLN depending on difficulty. Win riddles to earn more.</p>
                )}
              </div>
            </div>
            {actions.error && <p className="notice warn">{actions.error}</p>}
          </>
        )}
      </div>
      <style jsx>{`
        .wrap { display: flex; flex-direction: column; gap: 24px; max-width: 820px; }
        h1 { font-size: clamp(32px, 5vw, 48px); margin: 0; }
        .tiles { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 680px) { .tiles { grid-template-columns: 1fr 1fr; } }
        .tile { display: flex; flex-direction: column; gap: 10px; padding: 24px; border: 1px solid var(--line); border-radius: 16px; }
        .tile strong { font-size: 40px; font-weight: 500; }
        .unit { font-size: 16px; font-family: var(--mono); color: var(--ink-3); }
        .tile p { margin: 0; font-size: 14px; }
        .btn { align-self: flex-start; margin-top: 6px; }
      `}</style>
    </Layout>
  );
}
