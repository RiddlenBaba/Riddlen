import Link from 'next/link';
import Layout from '../components/Layout';
import { HuntPill } from '../components/HuntRiddle';
import { DIFFICULTY, useCommitments, useMintPrice, useRiddles } from '../hooks/useHunt';
import { useNow } from '../hooks/useFaucet';
import { rdln } from '../components/format';
import { formatEther } from 'viem';

const STEPS = [
  ['A riddle goes live', 'The house releases it. A few blocks later the contract rolls how many NFTs exist for it, and they go on sale.'],
  ['Buy one', 'The NFT is the riddle. It never expires, and it keeps its own count of tries. Sell it and everything goes with it.'],
  ['Solve it', 'Each try on your NFT costs 1 RDLN, then 2, then 3. A quarter is burned, a quarter feeds the grand prize. The right answer unlocks a place.'],
  ['Go there', 'Find what was hidden. Scan it, leave it. Every finder gets a share, biggest for the first, released when the next person finds it. Every solved riddle holds a piece of one map.'],
];

export default function HuntBoard() {
  const now = useNow();
  const { riddles, isLoading } = useRiddles(now);
  const price = useMintPrice();
  const c = useCommitments();
  const open = riddles.filter((r) => r.phase === 'open').length;

  return (
    <Layout description="A scavenger hunt for the whole world. Buy a riddle, solve it, go find what was hidden, get paid in RDLN.">
      <section className="hero">
        <p className="eyebrow">Riddlen · testnet</p>
        <h1 className="display">A scavenger hunt for the whole world.</h1>
        <p className="lede">Riddles you buy, solve, and then go out and find. {c.totalRiddles ? `${c.totalRiddles.toLocaleString()} of them` : 'A thousand of them'} over twenty years, every attempt burned, and a grand prize hidden somewhere real. Every solved riddle is a piece of the map.</p>
        <div className="stats mono">
          <span><b>{riddles.length}</b> released</span>
          <span className="h"><b>{open}</b> on sale</span>
          <span><b>{riddles.reduce((n, r) => n + r.claimCount, 0)}</b> finds</span>
          <span>price now <b>{Number(formatEther(price)).toLocaleString(undefined, { maximumFractionDigits: 2 })}</b> RDLN</span>
        </div>
      </section>

      <section className="sec">
        <div className="sechead"><h2 className="display">The riddles</h2><Link href="/map" legacyBehavior><a className="muted">Your map →</a></Link></div>
        <div className="board">
          {isLoading && <p className="muted">Loading…</p>}
          {!isLoading && riddles.length === 0 && <p className="muted">Nothing released yet. The first riddles are being written and hidden.</p>}
          {riddles.map((r) => (
            <Link key={r.id.toString()} href={`/r/${r.id}`} legacyBehavior>
              <a className="row">
                <span className="num mono">#{r.id.toString()}</span>
                <span className="text riddle-text">{r.text}</span>
                <span className="meta">
                  <HuntPill phase={r.phase} />
                  <span className="mono muted">{DIFFICULTY[r.difficulty]} · {rdln(r.pot)} RDLN</span>
                  {r.opened && <span className="mono muted">{r.nftCount - r.minted} of {r.nftCount} left</span>}
                  {r.claimCount > 0 && <span className="mono ok">{r.claimCount} found it</span>}
                </span>
              </a>
            </Link>
          ))}
        </div>
      </section>

      <section className="sec">
        <h2 className="display">How it works</h2>
        <ol className="steps">
          {STEPS.map(([t, b], i) => (
            <li key={t}><span className="n mono">{String(i + 1).padStart(2, '0')}</span><div><strong>{t}</strong><p>{b}</p></div></li>
          ))}
        </ol>
        <p className="muted small">The whole design, including what never changes: <a href="https://riddlen.org/next/" target="_blank" rel="noreferrer">riddlen.org/next</a>. Map root {c.mapRoot ? `${c.mapRoot.slice(0, 10)}…` : '…'} committed at launch.</p>
      </section>

      <style jsx>{`
        .hero { display: flex; flex-direction: column; gap: 18px; margin-bottom: 40px; max-width: 760px; }
        h1 { font-size: clamp(38px, 6.5vw, 68px); margin: 0; }
        .lede { font-size: 18px; color: var(--ink-2); margin: 0; max-width: 60ch; }
        .stats { display: flex; flex-wrap: wrap; gap: 8px 22px; font-size: 13px; color: var(--ink-3); }
        .stats b { color: var(--ink); font-weight: 500; } .h b { color: var(--human); }
        .sec { margin-top: 56px; display: flex; flex-direction: column; gap: 18px; }
        .sechead { display: flex; justify-content: space-between; align-items: baseline; }
        .sechead a { text-decoration: none; font-size: 14px; }
        h2 { font-size: 30px; margin: 0; }
        .board { display: flex; flex-direction: column; }
        .row { display: grid; grid-template-columns: 48px 1fr; gap: 4px 12px; padding: 16px 0; border-top: 1px solid var(--line); text-decoration: none; }
        .row:hover .text { color: var(--accent); }
        .num { color: var(--ink-3); padding-top: 2px; }
        .text { font-size: 18px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .meta { grid-column: 2; display: flex; flex-wrap: wrap; gap: 6px 12px; align-items: center; font-size: 13px; }
        .ok { color: var(--human); }
        .steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 720px) { .steps { grid-template-columns: repeat(2, 1fr); gap: 28px 40px; } }
        .steps li { display: flex; gap: 14px; }
        .n { color: var(--accent); padding-top: 3px; }
        .steps p { margin: 4px 0 0; color: var(--ink-2); font-size: 15px; }
        .small { font-size: 13px; margin: 0; }
      `}</style>
    </Layout>
  );
}
