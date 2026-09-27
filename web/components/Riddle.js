import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { DIFFICULTY, OUTCOME, useActions, useMe, useReveals } from '../hooks/useStump';
import { short } from './Layout';
import { Pill } from './Board';
import { countdown, deadline, OUTCOME_LABEL, rdln } from './format';

const STAGES = ['Written', 'Machines', 'Humans', 'Reveal', 'Settled'];
function stageIndex(phase) {
  if (phase === 'pending') return 1;
  if (phase === 'open') return 2;
  if (phase === 'complete' || phase === 'rejected') return 4;
  return 3;
}

function Timeline({ phase }) {
  const at = stageIndex(phase);
  return (
    <ol className="tl">
      {STAGES.map((s, i) => <li key={s} className={i < at ? 'done' : i === at ? 'now' : ''}><span className="n">{i + 1}</span>{s}</li>)}
      <style jsx>{`
        .tl { list-style: none; margin: 0; padding: 0; display: flex; gap: 0; }
        li { flex: 1; display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--ink-3); padding: 10px 0; border-top: 2px solid var(--line); }
        li.done { color: var(--ink-2); border-top-color: var(--ink-2); }
        li.now { color: var(--ink); border-top-color: var(--accent); }
        .n { display: none; }
        @media (max-width: 560px) { li { font-size: 10px; gap: 4px; } }
      `}</style>
    </ol>
  );
}

function Machines({ c, reveals }) {
  const revealed = c.panelRevealed && reveals?.panelAnswers?.length;
  const notYet = c.phase === 'pending' || c.phase === 'rejected';
  return (
    <div className="mach">
      <div className="head">
        <span className="eyebrow">The machines</span>
        {!revealed && <span className={`pill machine ${notYet ? '' : ''}`}>{c.phase === 'pending' ? 'not tried yet' : c.phase === 'rejected' ? 'never ran' : 'guesses sealed'}</span>}
      </div>
      {c.phase === 'pending' ? (
        <p className="muted">Waiting for the game master. Claude, GPT and Gemini will each get this riddle cold, their guesses will be sealed on chain, and then it opens to people.</p>
      ) : c.phase === 'rejected' ? (
        <p className="muted">The riddle was declined before the machines saw it.</p>
      ) : !revealed ? (
        <p className="muted">Three frontier models (Claude, GPT and Gemini) tried this riddle before it opened. Every guess they made is sealed on chain and revealed after entries close.</p>
      ) : (
        <ul className="guesses">
          {reveals.panelAnswers.map((g) => {
            const hit = reveals.answers.includes(g);
            return <li key={g} className={hit ? 'hit' : 'miss'}>{g}</li>;
          })}
        </ul>
      )}
      <style jsx>{`
        .mach { display: flex; flex-direction: column; gap: 10px; padding: 18px 20px; border-radius: 14px; background: var(--machine-bg); }
        .head { display: flex; justify-content: space-between; align-items: center; }
        p { margin: 0; font-size: 14px; }
        .guesses { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
        li { font-family: var(--display); font-size: 18px; padding: 4px 12px; border-radius: 8px; background: var(--paper); border: 1px solid var(--line); }
        li.miss { text-decoration: line-through; color: var(--ink-3); }
        li.hit { color: var(--machine); border-color: var(--machine); font-weight: 600; }
      `}</style>
    </div>
  );
}

export default function Riddle({ c, revealWindow, now, onChange }) {
  const { address, isConnected } = useAccount();
  const me = useMe(c.id, address);
  const actions = useActions(address);
  const reveals = useReveals(c.id, c.authorRevealedAt !== 0n || c.panelRevealed);
  const [answer, setAnswer] = useState('');
  const [copied, setCopied] = useState(false);
  const isAuthor = !!address && address.toLowerCase() === c.author.toLowerCase();
  const busy = !!actions.pending;
  const dl = deadline(c, revealWindow);
  const after = (ok) => { if (ok) { me.refetch(); onChange?.(); } };
  const solveWait = me.entry ? Math.max(0, Number(me.entry.enteredAt) + 30 - now) : 0;
  const canAfford = me.rdln >= c.entryCost;
  const outcome = OUTCOME[c.outcome];

  useEffect(() => {
    setAnswer(isAuthor ? actions.savedAuthorAnswers(c.riddle) : actions.savedGuess(c.id));
    actions.clearError();
  }, [c.id, address]); // eslint-disable-line react-hooks/exhaustive-deps

  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <article className="riddle">
      <div className="top">
        <div className="eyebrow">Riddle #{c.id.toString()} · {DIFFICULTY[c.difficulty]} · by {isAuthor ? 'you' : short(c.author)}</div>
        <div className="tools"><Pill c={c} /><button className="btn small" onClick={share}>{copied ? 'Copied' : 'Share'}</button></div>
      </div>

      <p className="riddle-text big">{c.riddle}</p>

      <Timeline phase={c.phase} />

      <div className="facts">
        <div><span className="eyebrow">Pot</span><strong>{rdln(c.pool)} RDLN</strong></div>
        <div><span className="eyebrow">Entry</span><strong>{rdln(c.entryCost)} RDLN</strong></div>
        <div><span className="eyebrow">Entrants</span><strong>{c.entrants}</strong></div>
        <div><span className="eyebrow">{dl ? dl.label : 'Solved by'}</span><strong>{dl ? countdown(dl.at - now) : c.authorRevealedAt !== 0n ? c.correct : '—'}</strong></div>
      </div>

      <Machines c={c} reveals={reveals} />

      <section className="act">
        {c.phase === 'pending' && <p>The machines are on it. Their sealed guesses go on chain first, then this riddle opens to people. Usually a few minutes.</p>}
        {c.phase === 'rejected' && <p>This submission was declined before opening. Riddles are declined when they read as spam, or as something no stranger could answer, like a fact about the author&apos;s own life. The stake stays burned. Write another one: the best riddles are still personal in flavour, but solvable by anyone clever.</p>}

        {!isConnected && !['pending', 'complete', 'rejected'].includes(c.phase) && <p>Connect a wallet to play. New here? The <Link href="/free">faucet</Link> gives every wallet free testnet RDLN.</p>}

        {isConnected && c.phase === 'open' && isAuthor && <p>Your riddle is open. Come back after it closes to reveal your answer; you have two days.</p>}

        {isConnected && c.phase === 'open' && !isAuthor && !me.entry && (
          <>
            <p>Beat the machines. Enter, then seal your guess. Nothing is revealed until the riddle closes.</p>
            {!canAfford && <p className="notice warn">You need {rdln(c.entryCost)} RDLN and have {rdln(me.rdln)}. {me.faucet.available && <Link href="/free">Get free testnet RDLN.</Link>}</p>}
            <button className="btn accent" disabled={busy || !canAfford} onClick={() => actions.enter(c.id).then(after)}>Enter for {rdln(c.entryCost)} RDLN</button>
          </>
        )}

        {isConnected && c.phase === 'open' && !isAuthor && me.entry && (
          <>
            {me.sealed && <p className="notice human">Your guess is sealed. You can change it until the riddle closes.</p>}
            <div className="field">
              <label htmlFor="g">Your answer</label>
              <input id="g" className="input" value={answer} onChange={(e) => setAnswer(e.target.value)} autoComplete="off" placeholder="One answer, a few words" />
              <span className="help">Case, spacing and trailing punctuation don&apos;t matter. Your wallet asks for a free signature to seal it.</span>
            </div>
            <button className="btn accent" disabled={busy || !answer.trim() || solveWait > 0} onClick={() => actions.seal(c.id, answer).then(after)}>
              {solveWait > 0 ? `Wait ${solveWait}s` : me.sealed ? 'Change sealed guess' : 'Seal guess'}
            </button>
          </>
        )}

        {isConnected && c.phase === 'awaiting-author' && isAuthor && (
          <>
            <p>Entries closed. Reveal your answer now. If you miss the window the riddle is voided and entrants are refunded.</p>
            <div className="field">
              <label htmlFor="ra">Your answer(s), exactly as you sealed them</label>
              <input id="ra" className="input" value={answer} onChange={(e) => setAnswer(e.target.value)} autoComplete="off" placeholder="keyboard / computer keyboard" />
            </div>
            <button className="btn accent" disabled={busy || !answer.trim()} onClick={() => actions.revealAnswer(c, answer).then(after)}>Reveal answer</button>
          </>
        )}
        {isConnected && c.phase === 'awaiting-author' && !isAuthor && <p>{me.sealed ? 'Your guess is sealed. ' : ''}Entries closed. Waiting for the author to reveal the answer.</p>}

        {c.phase === 'reveal' && reveals?.answers && (
          <p className="answer">The answer: <strong className="riddle-text">{reveals.answers.join(' / ')}</strong></p>
        )}
        {isConnected && c.phase === 'reveal' && me.sealed && !me.entry?.revealed && (
          <>
            <div className="field">
              <label htmlFor="rg">Your guess, exactly as you sealed it</label>
              <input id="rg" className="input" value={answer} onChange={(e) => setAnswer(e.target.value)} autoComplete="off" />
            </div>
            <button className="btn accent" disabled={busy || !answer.trim()} onClick={() => actions.revealGuess(c.id, answer).then(after)}>Reveal guess</button>
          </>
        )}
        {isConnected && c.phase === 'reveal' && me.entry?.revealed && (
          <p className={`notice ${me.entry.correct ? 'human' : ''}`}>Revealed. Your guess was {me.entry.correct ? 'correct' : 'wrong'}. Settlement opens when the reveal window closes.</p>
        )}

        {c.phase === 'awaiting-panel' && <p>Waiting for the machines&apos; sealed guesses to be revealed. Then anyone can settle.</p>}

        {isConnected && (c.phase === 'finalizing' || c.phase === 'void-ready') && (
          <>
            <p>{c.phase === 'void-ready' ? 'The author never revealed. Settle this riddle as voided so entrants can claim refunds.' : 'All reveals are in. Settle to pay out.'}</p>
            <button className="btn primary" disabled={busy} onClick={() => actions.finalize(c.id).then(after)}>Settle</button>
          </>
        )}

        {c.phase === 'complete' && (
          <div className={`outcome ${outcome}`}>
            <h3 className="display">{OUTCOME_LABEL[outcome]}</h3>
            {outcome === 'stumped' && <p>Claude, GPT and Gemini all missed. {c.correct} {c.correct === 1 ? 'person' : 'people'} got it. The author takes 40% of the pot and the solvers split 60%.</p>}
            {outcome === 'machine-solved' && <p>A machine found the answer. Correct solvers split a quarter of the pot; the author earns nothing.</p>}
            {outcome === 'unsolved' && <p>The machines missed, but so did every human. Nothing is paid.</p>}
            {outcome === 'voided' && <p>The author never revealed the answer. Entrants can claim their entry cost back.</p>}
            {reveals && outcome !== 'voided' && (
              <dl>
                <div><dt className="eyebrow">Answer</dt><dd className="riddle-text">{reveals.answers.join(' / ')}</dd></div>
                <div><dt className="eyebrow">Solved by</dt><dd className="mono">{reveals.solvers.length ? reveals.solvers.map(short).join(', ') : 'nobody'}</dd></div>
              </dl>
            )}
            {isConnected && outcome === 'voided' && me.entry && !me.entry.refunded && (
              <button className="btn primary" disabled={busy} onClick={() => actions.claimRefund(c.id).then(after)}>Claim refund</button>
            )}
            {isConnected && me.owed > 0n && <p className="notice human">You have {rdln(me.owed)} RDLN waiting. <Link href="/me">Withdraw</Link></p>}
          </div>
        )}

        {actions.pending && <p className="muted">{actions.pending}…</p>}
        {actions.error && <p className="notice warn">{actions.error}</p>}
      </section>

      <style jsx>{`
        .riddle { display: flex; flex-direction: column; gap: 28px; max-width: 760px; }
        .top { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .tools { display: flex; gap: 8px; align-items: center; }
        .big { font-size: clamp(26px, 4.2vw, 40px); margin: 0; }
        .facts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 560px) { .facts { grid-template-columns: repeat(4, 1fr); } }
        .facts div { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 12px; }
        .facts strong { font-family: var(--mono); font-weight: 500; font-size: 16px; }
        .act { display: flex; flex-direction: column; gap: 14px; }
        .act p { margin: 0; }
        .answer { font-size: 18px; }
        .answer strong { font-size: 24px; }
        .outcome { display: flex; flex-direction: column; gap: 12px; padding: 22px 24px; border-radius: 14px; border: 1px solid var(--line); }
        .outcome.stumped { background: var(--human-bg); border-color: transparent; }
        .outcome.machine-solved { background: var(--machine-bg); border-color: transparent; }
        .outcome h3 { margin: 0; font-size: 28px; }
        .outcome dl { margin: 0; display: flex; flex-direction: column; gap: 10px; }
        .outcome dd { margin: 2px 0 0; font-size: 22px; }
        .outcome dd.mono { font-size: 13px; }
        .btn { align-self: flex-start; }
      `}</style>
    </article>
  );
}
