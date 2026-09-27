import Link from 'next/link';
import { useAccount } from 'wagmi';
import Layout from '../components/Layout';
import { ConnectInline } from '../components/Wallet';
import { loadUnlocked, useCommitments, useMyTokens } from '../hooks/useHunt';
import { CONTRACTS, EXPLORER } from '../lib/wagmi';
import * as H from '../lib/hunt';

function asText(hex) {
  try { const t = new TextDecoder('utf-8', { fatal: true }).decode(H.unhex(hex)); return /^[\x09\x0a\x0d\x20-\x7e -￿]*$/.test(t) ? t : null; } catch { return null; }
}

export default function MapPage() {
  const { address, isConnected } = useAccount();
  const { tokens } = useMyTokens(address);
  const c = useCommitments();
  const found = tokens.filter((t) => t.claimedAt > 0);
  const byRiddle = new Map();
  for (const t of found) if (!byRiddle.has(t.riddleId)) byRiddle.set(t.riddleId, t);
  const pieces = [...byRiddle.values()].sort((a, b) => a.riddleId - b.riddleId);

  return (
    <Layout title="Your map" description="The pieces of the map you hold.">
      <div className="wrap">
        <header>
          <p className="eyebrow">The map</p>
          <h1 className="display">{pieces.length ? `${pieces.length} of ${c.totalRiddles || '…'} pieces.` : 'Every solved riddle is a piece of one map.'}</h1>
          <p className="lede">When the last riddle is released, the map is complete and the final hunt begins among whoever holds the most of it. The whole map was committed on chain before the first riddle shipped, so nobody, including the house, can change it.</p>
        </header>

        {!isConnected && <div className="card empty"><p>Connect a wallet to see the pieces you hold.</p><ConnectInline className="btn primary" /></div>}

        {isConnected && (
          <section className="grid">
            {pieces.length === 0 && <p className="muted">No pieces yet. Find something on <Link href="/hunt">the hunt</Link>.</p>}
            {pieces.map((t) => {
              const frag = loadUnlocked('fragment', t.id);
              const text = frag ? asText(frag) : null;
              return (
                <Link key={t.riddleId} href={`/hunt/${t.riddleId}`} legacyBehavior>
                  <a className="piece card">
                    <span className="mono muted">Riddle #{t.riddleId}</span>
                    {frag ? (text ? <p className="mono txt">{text}</p> : <p className="muted">{(frag.length - 2) / 2} bytes</p>) : <p className="muted">Piece not in this browser. Scan the code at the place again to read it.</p>}
                  </a>
                </Link>
              );
            })}
          </section>
        )}

        <section className="commit">
          <h2 className="display">What was committed</h2>
          <dl className="mono">
            <dt>Map root</dt><dd>{c.mapRoot || '…'}</dd>
            <dt>Prize</dt><dd>{c.prizeCommitment || '…'}</dd>
            <dt>Riddles</dt><dd>{c.totalRiddles || '…'}</dd>
            <dt>Launch</dt><dd>{c.launchAt ? new Date(c.launchAt * 1000).toISOString().slice(0, 10) : '…'}</dd>
            <dt>Contract</dt><dd><a href={`${EXPLORER}/address/${CONTRACTS.HUNT_COMMITMENTS}`} target="_blank" rel="noreferrer">{CONTRACTS.HUNT_COMMITMENTS}</a></dd>
          </dl>
          <p className="muted small">These are immutables in a contract with no owner and no upgrade path. On this testnet the map and prize are placeholders.</p>
        </section>
      </div>
      <style jsx>{`
        .wrap { display: flex; flex-direction: column; gap: 32px; max-width: 900px; }
        header { display: flex; flex-direction: column; gap: 10px; }
        h1 { font-size: clamp(30px, 5vw, 48px); margin: 0; }
        .lede { margin: 0; color: var(--ink-2); max-width: 62ch; }
        .empty { padding: 28px; display: flex; flex-direction: column; gap: 14px; align-items: flex-start; } .empty p { margin: 0; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
        .piece { display: flex; flex-direction: column; gap: 8px; padding: 16px; text-decoration: none; min-height: 120px; }
        .piece:hover { border-color: var(--accent); }
        .txt { margin: 0; font-size: 12px; white-space: pre-wrap; word-break: break-all; }
        .piece p { margin: 0; font-size: 13px; }
        h2 { font-size: 22px; margin: 0 0 10px; }
        dl { display: grid; grid-template-columns: max-content 1fr; gap: 6px 16px; font-size: 12px; margin: 0; word-break: break-all; }
        dt { color: var(--ink-3); } dd { margin: 0; }
        .small { font-size: 13px; margin: 10px 0 0; }
      `}</style>
    </Layout>
  );
}
