import Link from 'next/link';
import { useAccount, useReadContract } from 'wagmi';
import Layout from '../components/Layout';
import { HuntPill } from '../components/HuntRiddle';
import { ConnectInline, useWalletTotals, short } from '../components/Wallet';
import { AddTokenButton, GasButton } from '../components/Onboard';
import { rdln } from '../components/format';
import { useFaucet, useNow } from '../hooks/useFaucet';
import { DIFFICULTY, useHuntActions, useHuntOwed, useMyTokens, useRiddles } from '../hooks/useHunt';
import { useTx } from '../hooks/useTx';
import { CONTRACTS, EXPLORER } from '../lib/wagmi';

// The first game (Stump the Machine) is retired from the site. Anyone still owed by it can
// withdraw here; the tile only appears when there is something to take.
const LEGACY = {
  address: CONTRACTS.STUMP,
  abi: [
    { type: 'function', name: 'owed', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }] },
    { type: 'function', name: 'withdraw', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  ],
};

function LegacyTile({ address }) {
  const tx = useTx();
  const { data: owed, refetch } = useReadContract({ ...LEGACY, functionName: 'owed', args: [address], query: { enabled: !!address && !!CONTRACTS.STUMP } });
  if (!owed || owed === 0n) return null;
  return (
    <div className="tile">
      <span className="eyebrow">From the first game</span>
      <strong className="display">{rdln(owed)} <span className="unit">RDLN</span></strong>
      <button className="btn small" disabled={!!tx.pending} onClick={() => tx.run('Withdrawing', (w) => w({ ...LEGACY, functionName: 'withdraw', args: [] })).then((ok) => ok && refetch())}>{tx.pending ? 'Withdrawing…' : 'Withdraw'}</button>
      {tx.error && <span className="muted small">{tx.error}</span>}
      <style jsx>{`
        .tile { display: flex; flex-direction: column; gap: 8px; padding: 18px; border: 1px solid var(--line); border-radius: 14px; min-height: 130px; }
        .tile strong { font-size: 30px; font-weight: 500; }
        .unit { font-size: 14px; font-family: var(--mono); color: var(--ink-3); }
        .small { font-size: 12px; }
        .tile .btn { align-self: flex-start; margin-top: auto; }
      `}</style>
    </div>
  );
}

export default function Me() {
  const { address, isConnected, connector } = useAccount();
  const now = useNow();
  const faucet = useFaucet(address);
  const totals = useWalletTotals(address);
  const hunt = useHuntActions();
  const huntOwed = useHuntOwed(address);
  const { tokens } = useMyTokens(address);
  const { riddles } = useRiddles(now);
  const busy = !!hunt.pending || !!faucet.pending;
  const lowGas = isConnected && totals.gas < 10n ** 16n;
  const collectable = tokens.filter((t) => { const r = riddles.find((x) => Number(x.id) === t.riddleId); return r?.settled && t.claimedAt > 0 && !t.collected; });

  return (
    <Layout title="Dashboard">
      <div className="wrap">
        <header>
          <h1 className="display">{isConnected ? short(address) : 'Your dashboard'}</h1>
          {isConnected && <p className="muted">Connected with {connector?.name || 'your wallet'} · <a href={`${EXPLORER}/address/${address}`} target="_blank" rel="noreferrer">explorer</a></p>}
        </header>

        {!isConnected && (
          <div className="card empty">
            <p>Connect a wallet to see your balances, your riddle NFTs, the pieces of the map you hold, and what you can withdraw.</p>
            <ConnectInline className="btn primary" />
          </div>
        )}

        {isConnected && (
          <>
            <div className="tiles">
              <div className="tile">
                <span className="eyebrow">Winnings</span>
                <strong className="display">{rdln(huntOwed.owed)} <span className="unit">RDLN</span></strong>
                <button className="btn primary small" disabled={huntOwed.owed === 0n || busy} onClick={() => hunt.withdraw().then((ok) => ok && huntOwed.refetch())}>
                  {hunt.pending === 'Withdrawing' ? 'Withdrawing…' : 'Withdraw'}
                </button>
              </div>
              <div className="tile">
                <span className="eyebrow">RDLN</span>
                <strong className="display">{rdln(totals.rdln)}</strong>
                {faucet.available
                  ? <button className="btn accent small" disabled={busy} onClick={() => faucet.claim().then((ok) => ok && faucet.refetch())}>{faucet.pending ? 'Claiming…' : `Get ${rdln(faucet.amount)} free`}</button>
                  : <AddTokenButton className="btn small" />}
              </div>
              <div className="tile">
                <span className="eyebrow">RON reputation</span>
                <strong className="display">{rdln(totals.ron)}</strong>
                <span className="muted small">Earned by finding. Not transferable.</span>
              </div>
              <div className={`tile ${lowGas ? 'warn' : ''}`}>
                <span className="eyebrow">Gas (test POL)</span>
                <strong className="display">{Number(totals.gas) / 1e18 < 0.001 ? '0' : (Number(totals.gas) / 1e18).toFixed(3)}</strong>
                {lowGas ? <GasButton address={address} className="btn accent small" /> : <span className="muted small">Every transaction needs a little.</span>}
              </div>
              <LegacyTile address={address} />
            </div>
            {hunt.error && <p className="notice warn">{hunt.error}</p>}
            {faucet.error && <p className="notice warn">{faucet.error}</p>}

            {collectable.length > 0 && (
              <p className="notice">You have {collectable.length} settled {collectable.length === 1 ? 'find' : 'finds'} to collect. Open the riddle and press Collect.</p>
            )}

            <section>
              <div className="sechead"><h2 className="display">Your riddle NFTs</h2><span className="muted">{tokens.length}</span></div>
              {tokens.length === 0 && <p className="muted">None yet. <Link href="/">Buy one.</Link></p>}
              {tokens.map((t) => {
                const r = riddles.find((x) => Number(x.id) === t.riddleId);
                const state = t.collected ? 'collected' : t.claimedAt ? 'found' : t.unlockedAt ? 'location unlocked' : 'unsolved';
                return (
                  <Link key={t.id.toString()} href={`/r/${t.riddleId}`} legacyBehavior>
                    <a className="row">
                      <span className="mono num">#{t.riddleId}</span>
                      <span className="text riddle-text">{r ? r.text : `Riddle ${t.riddleId}`}</span>
                      <span className="meta">
                        {r && <HuntPill phase={r.phase} />}
                        <span className={`pill ${t.claimedAt ? 'human' : t.unlockedAt ? 'accent' : ''}`}>{state}</span>
                        <span className="mono muted">NFT {t.id.toString()} · {t.attempts} tries{r ? ` · ${DIFFICULTY[r.difficulty]} · ${rdln(r.pot)} RDLN` : ''}</span>
                        {r?.settled && t.claimedAt > 0 && !t.collected && <span className="pill accent">Collect</span>}
                      </span>
                    </a>
                  </Link>
                );
              })}
            </section>

            <p className="muted small">Pieces of the map you hold are on <Link href="/map">the map</Link>.</p>
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
        .row { display: grid; grid-template-columns: 48px 1fr; gap: 4px 12px; padding: 14px 0; border-top: 1px solid var(--line); text-decoration: none; }
        .row:hover .text { color: var(--accent); }
        .num { color: var(--ink-3); padding-top: 2px; }
        .text { font-size: 17px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .meta { grid-column: 2; display: flex; flex-wrap: wrap; gap: 6px 12px; align-items: center; font-size: 13px; }
      `}</style>
    </Layout>
  );
}
