import Link from 'next/link';
import Layout from '../components/Layout';
import Board, { Pill } from '../components/Board';
import { DIFFICULTY, OUTCOME, useChallenges, useNow } from '../hooks/useStump';
import { countdown, deadline, rdln } from '../components/format';

function Featured({ c, revealWindow, now }) {
  const dl = deadline(c, revealWindow);
  return (
    <Link href={`/r/${c.id}`} legacyBehavior>
      <a className="feat">
        <div className="head">
          <span className="eyebrow">{c.phase === 'open' ? 'Open now' : 'Latest'} · #{c.id.toString()} · {DIFFICULTY[c.difficulty]}</span>
          <Pill c={c} />
        </div>
        <p className="riddle-text q">{c.riddle}</p>
        <div className="foot">
          <span className="mono muted">{c.pool > 0n ? `${rdln(c.pool)} RDLN pot` : 'pot opens with the riddle'}{dl ? ` · ${dl.label} ${countdown(dl.at - now)}` : ''}</span>
          <span className="cta">{c.phase === 'open' ? 'Solve it →' : 'Open →'}</span>
        </div>
        <style jsx>{`
          .feat { display: flex; flex-direction: column; gap: 18px; padding: 28px; border: 1px solid var(--line-strong); border-radius: 18px; text-decoration: none; background: var(--paper); transition: transform 160ms, box-shadow 160ms; }
          .feat:hover { transform: translateY(-2px); box-shadow: 0 12px 40px -20px rgba(0,0,0,0.5); }
          .head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
          .q { font-size: clamp(24px, 3.6vw, 34px); margin: 0; display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden; }
          .foot { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 14px; }
          .cta { font-weight: 600; color: var(--accent); }
        `}</style>
      </a>
    </Link>
  );
}

function Stats({ challenges }) {
  if (!challenges.length) return null;
  const settled = challenges.filter((c) => c.phase === 'complete');
  const stumped = settled.filter((c) => OUTCOME[c.outcome] === 'stumped').length;
  const machine = settled.filter((c) => OUTCOME[c.outcome] === 'machine-solved').length;
  return (
    <div className="stats mono">
      <span><b>{challenges.length}</b> riddles</span>
      <span className="h"><b>{stumped}</b> stumped the machines</span>
      <span className="m"><b>{machine}</b> machine wins</span>
      <style jsx>{`
        .stats { display: flex; flex-wrap: wrap; gap: 8px 22px; font-size: 13px; color: var(--ink-3); }
        b { color: var(--ink); font-weight: 500; }
        .h b { color: var(--human); }
        .m b { color: var(--machine); }
      `}</style>
    </div>
  );
}

const STEPS = [
  ['Someone writes a riddle', 'and seals the answer on chain with a small burned stake.'],
  ['The machines go first', 'Claude, GPT and Gemini try it cold. Every guess is sealed before anyone can play.'],
  ['People play', 'Pay a small entry, seal a guess. Nothing is visible until the riddle closes.'],
  ['Everyone reveals', 'Author, machines, then players, each checked against what was sealed.'],
  ['The machines lose, people get paid', 'Author takes 40% of the pot, solvers split 60%. If a machine had it, the author gets nothing, and asking an AI would only have given you the guess it already got wrong.'],
];

export default function Home() {
  const now = useNow();
  const { challenges, revealWindow, isLoading } = useChallenges(now);
  const featured = challenges.find((c) => c.phase === 'open') || challenges[0];

  return (
    <Layout>
      <section className="hero">
        <h1 className="display">Riddles the machines couldn&apos;t solve.</h1>
        <p className="lede">Every riddle here was tried by Claude, GPT and Gemini before any person saw it. Their guesses are sealed. Beat them and get paid in RDLN. Write one they can&apos;t crack and get paid more.</p>
        <div className="ctas">
          <Link href="/write" legacyBehavior><a className="btn primary">Write a riddle</a></Link>
          <a href="#board" className="btn">See the board</a>
          <Link href="/free" legacyBehavior><a className="btn">Free Riddlen</a></Link>
        </div>
        <Stats challenges={challenges} />
      </section>

      {featured && <Featured c={featured} revealWindow={revealWindow} now={now} />}

      <section id="board" className="sec">
        <div className="sechead">
          <h2 className="display">The board</h2>
          <span className="muted">{challenges.length ? `${challenges.filter((c) => c.phase === 'open').length} open` : ''}</span>
        </div>
        <Board challenges={challenges} revealWindow={revealWindow} now={now} isLoading={isLoading} />
      </section>

      <section className="sec">
        <h2 className="display">How it works</h2>
        <ol className="steps">
          {STEPS.map(([t, b], i) => (
            <li key={t}><span className="n mono">{String(i + 1).padStart(2, '0')}</span><div><strong>{t}</strong><p>{b}</p></div></li>
          ))}
        </ol>
      </section>

      <style jsx>{`
        .hero { display: flex; flex-direction: column; gap: 18px; margin-bottom: 40px; max-width: 760px; }
        h1 { font-size: clamp(38px, 6.5vw, 68px); margin: 0; }
        .lede { font-size: 18px; color: var(--ink-2); margin: 0; max-width: 60ch; }
        .ctas { display: flex; gap: 10px; flex-wrap: wrap; }
        .sec { margin-top: 64px; display: flex; flex-direction: column; gap: 18px; }
        .sechead { display: flex; justify-content: space-between; align-items: baseline; }
        h2 { font-size: 30px; margin: 0; }
        .steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 720px) { .steps { grid-template-columns: repeat(2, 1fr); gap: 28px 40px; } }
        .steps li { display: flex; gap: 14px; }
        .n { color: var(--accent); padding-top: 3px; }
        .steps p { margin: 4px 0 0; color: var(--ink-2); font-size: 15px; }
      `}</style>
    </Layout>
  );
}
