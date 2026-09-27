import Link from 'next/link';
import { DIFFICULTY, OUTCOME } from '../hooks/useStump';
import { countdown, deadline, OUTCOME_LABEL, PHASE, rdln } from './format';

export function Pill({ c }) {
  const p = PHASE[c.phase] || PHASE.loading;
  if (c.phase === 'complete') {
    const o = OUTCOME[c.outcome];
    const tone = o === 'stumped' ? 'human' : o === 'machine-solved' ? 'machine' : '';
    return <span className={`pill ${tone}`}>{OUTCOME_LABEL[o]}</span>;
  }
  return <span className={`pill ${p.tone} ${p.live ? 'live' : ''}`}>{p.live && <span className="dot" />}{p.label}</span>;
}

export default function Board({ challenges, revealWindow, now, isLoading }) {
  return (
    <div className="board">
      {isLoading && <p className="muted">Loading the board…</p>}
      {!isLoading && challenges.length === 0 && (
        <div className="empty">
          <p className="display">No riddles yet.</p>
          <p className="muted">Be the first to write one the machines can&apos;t crack.</p>
          <Link href="/write" legacyBehavior><a className="btn primary">Write a riddle</a></Link>
        </div>
      )}
      {challenges.map((c) => {
        const dl = deadline(c, revealWindow);
        return (
          <Link key={c.id.toString()} href={`/r/${c.id}`} legacyBehavior>
            <a className="row">
              <span className="num mono">#{c.id.toString()}</span>
              <span className="text riddle-text">{c.riddle}</span>
              <span className="meta">
                <Pill c={c} />
                <span className="mono muted">{DIFFICULTY[c.difficulty]}{c.pool > 0n ? ` · ${rdln(c.pool)} RDLN` : ''}</span>
                {dl && <span className="mono muted">{dl.label} {countdown(dl.at - now)}</span>}
                {c.phase === 'complete' && <span className="mono muted">{c.correct} of {c.entrants} solved</span>}
              </span>
            </a>
          </Link>
        );
      })}
      <style jsx>{`
        .board { display: flex; flex-direction: column; }
        .row { display: grid; grid-template-columns: 56px 1fr; gap: 6px 12px; padding: 18px 0; border-top: 1px solid var(--line); text-decoration: none; transition: background 120ms; }
        .row:hover .text { color: var(--accent); }
        .row:last-child { border-bottom: 1px solid var(--line); }
        .num { color: var(--ink-3); padding-top: 3px; }
        .text { font-size: 19px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .meta { grid-column: 2; display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; font-size: 13px; }
        @media (min-width: 720px) {
          .row { grid-template-columns: 56px 1fr 260px; }
          .meta { grid-column: auto; flex-direction: column; align-items: flex-end; gap: 6px; text-align: right; }
          .text { font-size: 21px; }
        }
        .empty { padding: 56px 0; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .empty .display { font-size: 32px; margin: 0; }
        .empty .muted { margin: 0 0 12px; }
      `}</style>
    </div>
  );
}
