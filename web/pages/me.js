import Link from 'next/link';
import { useAccount } from 'wagmi';
import Layout from '../components/Layout';
import { Pill } from '../components/Board';
import { ConnectInline, useWalletTotals, short } from '../components/Wallet';
import { AddTokenButton, GasButton } from '../components/Onboard';
import { countdown, deadline, rdln } from '../components/format';
import { DIFFICULTY, useActions, useChallenges, useMe, useMyActivity, useNow } from '../hooks/useStump';
import { EXPLORER } from '../lib/wagmi';

const NEEDS = {
  'awaiting-author': 'Reveal your answer',
  reveal: 'Reveal your guess',
  finalizing: 'Settle',
  'void-ready': 'Settle',
};

function Row({ c, revealWindow, now, who }) {
  const dl = deadline(c, revealWindow);
  let need = null;
  if (who === 'author' && c.phase === 'awaiting-author') need = NEEDS[c.phase];
  if (who === 'solver' && c.phase === 'reveal' && c.sealed && !c.entry?.revealed) need = NEEDS.reveal;
  if (c.phase === 'finalizing' || c.phase === 'void-ready') need = NEEDS[c.phase];
  return (
    <Link href={`/r/${c.id}`} legacyBehavior>
      <a className="row">
        <span className="mono num">#{c.id.toString()}</span>
        <span className="text riddle-text">{c.riddle}</span>
        <span className="meta">
          <Pill c={c} />
          {need && <span className="pill accent">{need}</span>}
          <span className="mono muted">{DIFFICULTY[c.difficulty]}{c.pool > 0n ? ` · ${rdln(c.pool)} RDLN` : ''}{dl ? ` · ${dl.label} ${countdown(dl.at - now)}` : ''}</span>
          {who === 'solver' && c.entry?.revealed && <span className={`mono ${c.entry.correct ? 'ok' : 'muted'}`}>{c.entry.correct ? 'correct' : 'wrong'}</span>}
        </span>
        <style jsx>{`
          .row { display: grid; grid-template-columns: 48px 1fr; gap: 4px 12px; padding: 14px 0; border-top: 1px solid var(--line); text-decoration: none; }
          .row:hover .text { color: var(--accent); }
          .num { color: var(--ink-3); padding-top: 2px; }
          .text { font-size: 17px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          .meta { grid-column: 2; display: flex; flex-wrap: wrap; gap: 6px 12px; align-items: center; font-size: 13px; }
          .ok { color: var(--human); }
        `}</style>
      </a>
    </Link>
  );
}

export default function Me() {
  const { address, isConnected, connector } = useAccount();
  const now = useNow();
  const { challenges, revealWindow } = useChallenges(now);
  const me = useMe(undefined, address);
  const totals = useWalletTotals(address);
  const actions = useActions(address);
  const { written, entered } = useMyActivity(address, challenges);
  const busy = !!actions.pending;
  const lowGas = isConnected && totals.gas < 10n ** 16n;

  return (
    <Layout title="Dashboard">
      <div className="wrap">
        <header>
          <h1 className="display">{isConnected ? short(address) : 'Your dashboard'}</h1>
          {isConnected && <p className="muted">Connected with {connector?.name || 'your wallet'} · <a href={`${EXPLORER}/address/${address}`} target="_blank" rel="noreferrer">explorer</a></p>}
        </header>

        {!isConnected && (
          <div className="card empty">
            <p>Connect a wallet to see your balances, the riddles you wrote, the ones you entered, and what you can withdraw.</p>
            <ConnectInline className="btn primary" />
          </div>
        )}

        {isConnected && (
          <>
            <div className="tiles">
              <div className="tile">
                <span className="eyebrow">Owed to you</span>
                <strong className="display">{rdln(me.owed)} <span className="unit">RDLN</span></strong>
                <button className="btn primary small" disabled={me.owed === 0n || busy} onClick={() => actions.withdraw().then((ok) => ok && me.refetch())}>
                  {actions.pending === 'Withdrawing' ? 'Withdrawing…' : 'Withdraw'}
                </button>
              </div>
              <div className="tile">
                <span className="eyebrow">RDLN</span>
                <strong className="display">{rdln(totals.rdln)}</strong>
                {me.faucet.available
                  ? <button className="btn accent small" disabled={busy} onClick={() => actions.claimFaucet().then((ok) => ok && me.refetch())}>{actions.pending === 'Claiming testnet RDLN' ? 'Claiming…' : `Get ${rdln(me.faucet.amount)} free`}</button>
                  : <AddTokenButton className="btn small" />}
              </div>
              <div className="tile">
                <span className="eyebrow">RON reputation</span>
                <strong className="display">{rdln(totals.ron)}</strong>
                <span className="muted small">Earned by stumping machines and solving. Not transferable.</span>
              </div>
              <div className={`tile ${lowGas ? 'warn' : ''}`}>
                <span className="eyebrow">Gas (test POL)</span>
                <strong className="display">{Number(totals.gas) / 1e18 < 0.001 ? '0' : (Number(totals.gas) / 1e18).toFixed(3)}</strong>
                {lowGas
                  ? <GasButton address={address} className="btn accent small" />
                  : <span className="muted small">Every transaction needs a little.</span>}
              </div>
            </div>
            {actions.error && <p className="notice warn">{actions.error}</p>}

            <section>
              <div className="sechead"><h2 className="display">Riddles you entered</h2><span className="muted">{entered.length}</span></div>
              {entered.length === 0 && <p className="muted">None yet. <Link href="/">Pick one from the board.</Link></p>}
              {entered.map((c) => <Row key={c.id.toString()} c={c} revealWindow={revealWindow} now={now} who="solver" />)}
            </section>

            <section>
              <div className="sechead"><h2 className="display">Riddles you wrote</h2><span className="muted">{written.length}</span></div>
              {written.length === 0 && <p className="muted">None yet. <Link href="/write">Write one the machines can&apos;t crack.</Link></p>}
              {written.map((c) => <Row key={c.id.toString()} c={c} revealWindow={revealWindow} now={now} who="author" />)}
            </section>
          </>
        )}
      </div>
      <style jsx>{`
        .wrap { display: flex; flex-direction: column; gap: 32px; max-width: 900px; }
        header { display: flex; flex-direction: column; gap: 4px; }
        h1 { font-size: clamp(30px, 5vw, 44px); margin: 0; }
        header p { margin: 0; font-size: 14px; }
        .empty { padding: 28px; display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
        .empty p { margin: 0; }
        .tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (min-width: 760px) { .tiles { grid-template-columns: repeat(4, 1fr); } }
        .tile { display: flex; flex-direction: column; gap: 8px; padding: 18px; border: 1px solid var(--line); border-radius: 14px; min-height: 130px; }
        .tile.warn { border-color: var(--warn); }
        .tile strong { font-size: 30px; font-weight: 500; }
        .unit { font-size: 14px; font-family: var(--mono); color: var(--ink-3); }
        .small { font-size: 12px; }
        .tile .btn { align-self: flex-start; margin-top: auto; }
        section { display: flex; flex-direction: column; }
        .sechead { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
        h2 { font-size: 24px; margin: 0; }
      `}</style>
    </Layout>
  );
}
