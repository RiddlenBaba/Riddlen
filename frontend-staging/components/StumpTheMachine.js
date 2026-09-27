import { useEffect, useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { formatEther } from 'viem';
import { polygonAmoy } from 'wagmi/chains';
import { useNow } from '../hooks/useRiddleGame';
import {
  DIFFICULTY, OUTCOME, isConfigured, useChallenges, useEconomics, useFaucet, useMe, useReveals, useStumpActions,
} from '../hooks/useStump';

const PHASE = {
  pending: 'Machines thinking',
  open: 'Open',
  'awaiting-author': 'Waiting for the author',
  'void-ready': 'Author missed the reveal',
  reveal: 'Reveal your guess',
  'awaiting-panel': 'Waiting for the panel reveal',
  finalizing: 'Ready to settle',
  complete: 'Settled',
  rejected: 'Declined',
  loading: '…',
};

const OUTCOME_COPY = {
  stumped: { title: 'Stumped the machine', body: 'The panel missed it and humans got it. Author and solvers are paid.' },
  'machine-solved': { title: 'The machine solved it', body: 'A panel model found the answer. Correct humans split a reduced pot; the author earns nothing.' },
  unsolved: { title: 'Nobody solved it', body: 'The machines missed, but so did every human. Nothing is paid.' },
  voided: { title: 'Voided', body: 'The author never revealed the answer. Entrants can claim their entry cost back.' },
  pending: { title: 'Pending', body: '' },
};

const rdln = (v) => Number(formatEther(v ?? 0n)).toLocaleString(undefined, { maximumFractionDigits: 2 });
const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '');

function countdown(seconds) {
  if (seconds <= 0) return '0s';
  const d = Math.floor(seconds / 86400), h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
}

function deadline(c, revealWindow) {
  if (c.phase === 'open') return { label: 'Closes in', at: Number(c.endTime) };
  if (c.phase === 'awaiting-author') return { label: 'Author must reveal within', at: Number(c.endTime + revealWindow) };
  if (c.phase === 'reveal') return { label: 'Reveals close in', at: Number(c.authorRevealedAt + revealWindow) };
  return null;
}

export default function StumpTheMachine() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const now = useNow();
  const { challenges, revealWindow, isLoading, refetch } = useChallenges(now);
  const [tab, setTab] = useState('play');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (selectedId === null && challenges.length) setSelectedId(challenges[0].id);
  }, [challenges, selectedId]);

  const selected = challenges.find((c) => c.id === selectedId);

  if (!isConfigured()) {
    return (
      <div className="notice">
        Stump the Machine isn&apos;t deployed on this environment yet. Deploy it with
        <code> scripts/stump/deploy.js</code> and set <code>NEXT_PUBLIC_STUMP_ADDRESS</code>.
        <style jsx>{`.notice { padding: 1rem 1.25rem; border-radius: 12px; background: rgba(255,165,0,0.12); border: 1px solid rgba(255,165,0,0.4); } code { color: #ffd700; }`}</style>
      </div>
    );
  }

  return (
    <div className="stm">
      {isConnected && chainId !== polygonAmoy.id && (
        <div className="notice">
          Riddlen runs on Polygon Amoy.{' '}
          <button className="link" onClick={() => switchChain({ chainId: polygonAmoy.id })}>Switch network</button>
        </div>
      )}

      <Faucet player={address} isConnected={isConnected} />

      <div className="tabs">
        <button className={tab === 'play' ? 'on' : ''} onClick={() => setTab('play')}>Solve</button>
        <button className={tab === 'write' ? 'on' : ''} onClick={() => setTab('write')}>Write a riddle</button>
        <button className={tab === 'wallet' ? 'on' : ''} onClick={() => setTab('wallet')}>Winnings</button>
      </div>

      {tab === 'write' && <WriteRiddle player={address} isConnected={isConnected} onDone={() => { refetch(); setTab('play'); }} />}
      {tab === 'wallet' && <Winnings player={address} isConnected={isConnected} />}

      {tab === 'play' && (
        <div className="layout">
          <aside className="list">
            <h2>Riddles</h2>
            {isLoading && <p className="muted">Loading…</p>}
            {!isLoading && challenges.length === 0 && <p className="muted">No riddles yet. Be the first to write one.</p>}
            {challenges.map((c) => {
              const dl = deadline(c, revealWindow);
              return (
                <button key={c.id.toString()} className={`card ${c.id === selectedId ? 'active' : ''}`} onClick={() => setSelectedId(c.id)}>
                  <span className={`badge ${c.phase}`}>{c.phase === 'complete' ? OUTCOME_COPY[OUTCOME[c.outcome]].title : PHASE[c.phase]}</span>
                  <strong>Riddle #{c.id.toString()}</strong>
                  <span className="meta">
                    {DIFFICULTY[c.difficulty]} · {rdln(c.pool)} RDLN pot · {c.entrants} in
                    {dl && ` · ${dl.label.toLowerCase()} ${countdown(dl.at - now)}`}
                  </span>
                </button>
              );
            })}
          </aside>
          <section className="detail">
            {selected
              ? <Challenge c={selected} revealWindow={revealWindow} player={address} isConnected={isConnected} now={now} onChange={refetch} />
              : !isLoading && <p className="muted">Select a riddle.</p>}
          </section>
        </div>
      )}

      <HowItWorks />
      <style jsx>{`
        .stm { display: flex; flex-direction: column; gap: 1.5rem; }
        .notice { padding: 0.9rem 1.2rem; border-radius: 12px; background: rgba(255,165,0,0.12); border: 1px solid rgba(255,165,0,0.4); }
        .link { background: none; border: none; color: #ffd700; text-decoration: underline; cursor: pointer; font: inherit; }
        .tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .tabs button { padding: 0.6rem 1.1rem; border-radius: 999px; border: 1px solid rgba(255,215,0,0.25); background: rgba(255,255,255,0.03); color: inherit; cursor: pointer; font: inherit; font-weight: 600; }
        .tabs button.on { background: rgba(255,215,0,0.15); border-color: #ffd700; color: #ffd700; }
        .layout { display: grid; grid-template-columns: minmax(260px, 340px) 1fr; gap: 1.5rem; }
        @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } }
        .list { display: flex; flex-direction: column; gap: 0.75rem; }
        h2 { font-size: 1.25rem; margin: 0 0 0.25rem; color: #ffd700; }
        .card { display: flex; flex-direction: column; align-items: flex-start; gap: 0.35rem; text-align: left; padding: 1rem; border-radius: 14px; border: 1px solid rgba(255,215,0,0.15); background: rgba(255,255,255,0.03); color: inherit; cursor: pointer; font: inherit; }
        .card:hover { border-color: rgba(255,215,0,0.4); }
        .card.active { border-color: #ffd700; background: rgba(255,215,0,0.06); }
        .meta { font-size: 0.85rem; opacity: 0.7; }
        .muted { opacity: 0.65; }
        .badge { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; padding: 0.15rem 0.55rem; border-radius: 999px; background: rgba(255,255,255,0.08); }
        .badge.open { background: rgba(34,197,94,0.18); color: #4ade80; }
        .badge.reveal, .badge.finalizing, .badge.void-ready { background: rgba(255,215,0,0.18); color: #ffd700; }
        .badge.pending, .badge.awaiting-author, .badge.awaiting-panel { background: rgba(96,165,250,0.18); color: #93c5fd; }
        .detail { padding: 1.75rem; border-radius: 18px; border: 1px solid rgba(255,215,0,0.2); background: rgba(255,255,255,0.02); min-height: 320px; }
      `}</style>
    </div>
  );
}

function Challenge({ c, revealWindow, player, isConnected, now, onChange }) {
  const me = useMe(c.id, player);
  const actions = useStumpActions(player);
  const reveals = useReveals(c.id, c.authorRevealedAt !== 0n || c.panelRevealed);
  const [answer, setAnswer] = useState('');
  const isAuthor = !!player && player.toLowerCase() === c.author.toLowerCase();
  const busy = !!actions.pending;
  const dl = deadline(c, revealWindow);
  const after = async (ok) => { if (ok) { me.refetch(); onChange(); } };
  const solveWait = me.entry ? Math.max(0, Number(me.entry.enteredAt) + 30 - now) : 0;
  const canAfford = me.rdlnBalance >= c.entryCost;

  useEffect(() => { setAnswer(isAuthor ? '' : actions.savedGuess(c.id)); actions.clearError(); }, [c.id, player]); // eslint-disable-line react-hooks/exhaustive-deps

  const outcome = OUTCOME[c.outcome];

  return (
    <div className="ch">
      <header>
        <span className="eyebrow">{DIFFICULTY[c.difficulty]} · by {isAuthor ? 'you' : short(c.author)}</span>
        <h3>Riddle #{c.id.toString()}</h3>
        {dl && <span className="deadline">{dl.label} {countdown(dl.at - now)}</span>}
      </header>

      <blockquote className="riddle">{c.riddle}</blockquote>

      <dl className="stats">
        <div><dt>Pot</dt><dd>{rdln(c.pool)} RDLN</dd></div>
        <div><dt>Entry</dt><dd>{rdln(c.entryCost)} RDLN</dd></div>
        <div><dt>Entrants</dt><dd>{c.entrants}</dd></div>
        <div><dt>Solved by</dt><dd>{c.authorRevealedAt !== 0n ? c.correct : '?'}</dd></div>
      </dl>

      <div className="action">
        {c.phase === 'pending' && <p>The AI panel is trying this riddle now. Its guesses get sealed on-chain before anyone can play.</p>}
        {c.phase === 'rejected' && <p>The game master declined this submission.</p>}
        {!isConnected && c.phase !== 'pending' && c.phase !== 'complete' && <p>Connect your wallet to play.</p>}

        {isConnected && c.phase === 'open' && isAuthor && <p>This is your riddle. Sit tight until entries close, then come back to reveal your answer.</p>}

        {isConnected && c.phase === 'open' && !isAuthor && !me.entry && (
          <>
            <p>Three frontier AI models already took their shot, sealed. Beat them: enter, then seal your guess. Nothing is revealed until the riddle closes.</p>
            {!canAfford && <p className="warn">You need {rdln(c.entryCost)} RDLN (you have {rdln(me.rdlnBalance)}).</p>}
            <button className="primary" disabled={busy || !canAfford} onClick={() => actions.enter(c.id).then(after)}>
              Enter for {rdln(c.entryCost)} RDLN
            </button>
          </>
        )}

        {isConnected && c.phase === 'open' && !isAuthor && me.entry && (
          <>
            {me.sealed && <p className="ok">Your guess is sealed. You can change it until the riddle closes.</p>}
            <label htmlFor="guess">Your answer</label>
            <input id="guess" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer" autoComplete="off" />
            <p className="hint">Case, spacing and trailing punctuation don&apos;t matter. Your wallet asks for a free signature to seal it.</p>
            <button className="primary" disabled={busy || !answer.trim() || solveWait > 0} onClick={() => actions.seal(c.id, answer).then(after)}>
              {solveWait > 0 ? `Wait ${solveWait}s` : me.sealed ? 'Change sealed guess' : 'Seal guess'}
            </button>
          </>
        )}

        {isConnected && c.phase === 'awaiting-author' && isAuthor && (
          <>
            <p>Entries are closed. Reveal your answer now; if you miss the window the riddle is voided and entrants are refunded.</p>
            <label htmlFor="reveal">Your answer, exactly as you sealed it</label>
            <input id="reveal" value={answer} onChange={(e) => setAnswer(e.target.value)} autoComplete="off" />
            <button className="primary" disabled={busy || !answer.trim()} onClick={() => actions.revealAnswer(c, answer).then(after)}>Reveal answer</button>
          </>
        )}
        {isConnected && c.phase === 'awaiting-author' && !isAuthor && (
          <p>{me.sealed ? 'Your guess is sealed. ' : ''}Entries are closed. Waiting for the author to reveal the answer.</p>
        )}

        {isConnected && c.phase === 'reveal' && me.sealed && !me.entry?.revealed && (
          <>
            <p>The answer is out: <strong>{reveals?.answers?.join(', ') ?? '…'}</strong>. Reveal your sealed guess to be counted.</p>
            <label htmlFor="rg">Your guess, exactly as you sealed it</label>
            <input id="rg" value={answer} onChange={(e) => setAnswer(e.target.value)} autoComplete="off" />
            <button className="primary" disabled={busy || !answer.trim()} onClick={() => actions.revealGuess(c.id, answer).then(after)}>Reveal guess</button>
          </>
        )}
        {isConnected && c.phase === 'reveal' && me.entry?.revealed && (
          <p className="ok">Revealed: your guess was {me.entry.correct ? 'correct' : 'wrong'}. Settlement opens when the reveal window closes.</p>
        )}
        {isConnected && c.phase === 'reveal' && !me.sealed && <p>Players are revealing their guesses. The answer: <strong>{reveals?.answers?.join(', ') ?? '…'}</strong></p>}

        {c.phase === 'awaiting-panel' && <p>Waiting for the game master to reveal the machines&apos; sealed guesses. Then anyone can settle.</p>}

        {isConnected && (c.phase === 'finalizing' || c.phase === 'void-ready') && (
          <>
            <p>{c.phase === 'void-ready' ? 'The author never revealed. Settle this riddle as voided so entrants can claim refunds.' : 'All reveals are in. Settle the riddle to pay out.'}</p>
            <button className="primary" disabled={busy} onClick={() => actions.finalize(c.id).then(after)}>Settle</button>
          </>
        )}

        {c.phase === 'complete' && (
          <div className={`outcome ${outcome}`}>
            <h4>{OUTCOME_COPY[outcome].title}</h4>
            <p>{OUTCOME_COPY[outcome].body}</p>
            {reveals && outcome !== 'voided' && (
              <div className="reveal-grid">
                <div><span className="k">Answer</span><span className="v">{reveals.answers.join(', ')}</span></div>
                <div><span className="k">The machines said</span><span className="v">{reveals.panelAnswers.length ? reveals.panelAnswers.join(' · ') : '—'}</span></div>
                <div><span className="k">Humans who solved it</span><span className="v">{reveals.solvers.length ? reveals.solvers.map(short).join(', ') : 'none'}</span></div>
              </div>
            )}
            {isConnected && outcome === 'voided' && me.entry && !me.entry.refunded && (
              <button className="primary" disabled={busy} onClick={() => actions.claimRefund(c.id).then(after)}>Claim refund</button>
            )}
            {isConnected && me.owed > 0n && <p className="ok">You have {rdln(me.owed)} RDLN to withdraw in the Winnings tab.</p>}
          </div>
        )}

        {actions.pending && <p className="hint">{actions.pending}…</p>}
        {actions.error && <p className="warn">{actions.error}</p>}
      </div>

      <style jsx>{`
        .ch { display: flex; flex-direction: column; gap: 1.25rem; }
        header { display: flex; flex-direction: column; gap: 0.25rem; }
        .eyebrow { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.7; }
        h3 { margin: 0; font-size: 1.5rem; color: #ffd700; }
        .deadline { font-size: 0.9rem; opacity: 0.8; }
        .riddle { margin: 0; padding: 1.25rem 1.5rem; border-left: 3px solid #ffd700; background: rgba(255,215,0,0.05); font-size: 1.15rem; line-height: 1.6; white-space: pre-wrap; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.75rem; margin: 0; }
        .stats div { padding: 0.75rem; border-radius: 12px; background: rgba(255,255,255,0.04); }
        dt { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.6; }
        dd { margin: 0.2rem 0 0; font-weight: 700; }
        .action { display: flex; flex-direction: column; gap: 0.75rem; }
        label { font-size: 0.85rem; opacity: 0.8; }
        input { padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid rgba(255,215,0,0.3); background: rgba(0,0,0,0.3); color: inherit; font: inherit; font-size: 1.05rem; }
        .primary { align-self: flex-start; padding: 0.8rem 1.4rem; border-radius: 10px; border: none; background: linear-gradient(135deg, #ffd700, #ff8c00); color: #1a1a1a; font-weight: 700; cursor: pointer; font: inherit; }
        .primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .hint { font-size: 0.85rem; opacity: 0.65; margin: 0; }
        .warn { color: #fca5a5; margin: 0; }
        .ok { color: #86efac; margin: 0; }
        .outcome { padding: 1.25rem; border-radius: 14px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; gap: 0.75rem; }
        .outcome.stumped { border-color: rgba(34,197,94,0.5); background: rgba(34,197,94,0.08); }
        .outcome.machine-solved { border-color: rgba(96,165,250,0.5); background: rgba(96,165,250,0.08); }
        .outcome h4 { margin: 0; font-size: 1.2rem; }
        .outcome p { margin: 0; }
        .reveal-grid { display: flex; flex-direction: column; gap: 0.5rem; }
        .reveal-grid div { display: flex; flex-direction: column; }
        .k { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.6; }
        .v { font-weight: 600; }
      `}</style>
    </div>
  );
}

function WriteRiddle({ player, isConnected, onDone }) {
  const actions = useStumpActions(player);
  const economics = useEconomics();
  const me = useMe(undefined, player);
  const [riddle, setRiddle] = useState('');
  const [answer, setAnswer] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const busy = !!actions.pending;
  const canSubmit = isConnected && riddle.trim().length > 0 && riddle.length <= 2000 && answer.trim().length > 0 && !busy;

  return (
    <div className="write">
      <div className="intro">
        <h3>Write a riddle the machines can&apos;t crack</h3>
        <p>
          When you submit, your answer is sealed and the riddle goes to a panel of frontier AI models
          before any human sees it. Their guesses are sealed too. If they miss and at least one human
          solves it, you earn <strong>40% of the pot</strong> and RON reputation. If a model gets it, you earn nothing.
        </p>
        <ul>
          <li>Puns, misdirection, cultural in-jokes, things you&apos;d only know from living a life: good.</li>
          <li>Well-known riddles, trivia, anything searchable: the panel will get it.</li>
          <li>It must be solvable. If no human gets it, nobody is paid.</li>
          <li>Submitting burns a small, rising stake (1 RDLN, then 2, then 3…). You must come back to reveal your answer after entries close.</li>
        </ul>
      </div>

      <label htmlFor="riddle">Riddle</label>
      <textarea id="riddle" rows={5} value={riddle} onChange={(e) => setRiddle(e.target.value)} maxLength={2000} placeholder="What has keys but opens no locks, and my aunt keeps hers in the freezer?" />
      <span className="hint">{riddle.length}/2000</span>

      <label htmlFor="ans">Answer (one exact answer; case, spacing and trailing punctuation are ignored)</label>
      <input id="ans" value={answer} onChange={(e) => setAnswer(e.target.value)} autoComplete="off" placeholder="piano" />

      <label>Difficulty</label>
      <div className="diff">
        {economics.map((e, d) => (
          <button key={d} className={difficulty === d ? 'on' : ''} onClick={() => setDifficulty(d)}>
            <strong>{DIFFICULTY[d]}</strong>
            <span>{rdln(e.pool)} RDLN pot · {rdln(e.entryCost)} entry</span>
          </button>
        ))}
      </div>

      {!isConnected && <p className="warn">Connect your wallet to submit.</p>}
      <button className="primary" disabled={!canSubmit} onClick={() => actions.submit(riddle.trim(), answer, difficulty).then((ok) => { if (ok) { setRiddle(''); setAnswer(''); me.refetch(); onDone(); } })}>
        {busy ? `${actions.pending}…` : 'Seal answer and submit'}
      </button>
      {actions.error && <p className="warn">{actions.error}</p>}

      <style jsx>{`
        .write { display: flex; flex-direction: column; gap: 0.75rem; padding: 1.75rem; border-radius: 18px; border: 1px solid rgba(255,215,0,0.2); background: rgba(255,255,255,0.02); }
        .intro h3 { margin: 0 0 0.5rem; color: #ffd700; }
        .intro p, .intro li { line-height: 1.6; }
        .intro ul { margin: 0.5rem 0 0; padding-left: 1.2rem; opacity: 0.85; }
        label { font-size: 0.85rem; opacity: 0.8; margin-top: 0.5rem; }
        textarea, input { padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid rgba(255,215,0,0.3); background: rgba(0,0,0,0.3); color: inherit; font: inherit; font-size: 1.05rem; resize: vertical; }
        .hint { font-size: 0.8rem; opacity: 0.6; align-self: flex-end; }
        .diff { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem; }
        .diff button { display: flex; flex-direction: column; gap: 0.2rem; padding: 0.75rem; border-radius: 12px; border: 1px solid rgba(255,215,0,0.2); background: rgba(255,255,255,0.03); color: inherit; cursor: pointer; font: inherit; text-align: left; }
        .diff button span { font-size: 0.8rem; opacity: 0.7; }
        .diff button.on { border-color: #ffd700; background: rgba(255,215,0,0.1); }
        .primary { align-self: flex-start; margin-top: 0.5rem; padding: 0.8rem 1.4rem; border-radius: 10px; border: none; background: linear-gradient(135deg, #ffd700, #ff8c00); color: #1a1a1a; font-weight: 700; cursor: pointer; font: inherit; }
        .primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .warn { color: #fca5a5; margin: 0; }
      `}</style>
    </div>
  );
}

function Winnings({ player, isConnected }) {
  const me = useMe(undefined, player);
  const actions = useStumpActions(player);
  return (
    <div className="win">
      <h3>Winnings</h3>
      {!isConnected && <p>Connect your wallet to see what you&apos;re owed.</p>}
      {isConnected && (
        <>
          <p className="big">{rdln(me.owed)} RDLN</p>
          <p className="hint">Payouts and refunds accumulate here and are pulled in one transaction. RDLN may apply its usual transfer burn on the way out.</p>
          <button className="primary" disabled={me.owed === 0n || !!actions.pending} onClick={() => actions.withdraw().then((ok) => ok && me.refetch())}>
            {actions.pending ? `${actions.pending}…` : 'Withdraw'}
          </button>
          {actions.error && <p className="warn">{actions.error}</p>}
        </>
      )}
      <style jsx>{`
        .win { display: flex; flex-direction: column; gap: 0.75rem; padding: 1.75rem; border-radius: 18px; border: 1px solid rgba(255,215,0,0.2); background: rgba(255,255,255,0.02); }
        h3 { margin: 0; color: #ffd700; }
        .big { font-size: 2rem; font-weight: 800; margin: 0; }
        .hint { font-size: 0.85rem; opacity: 0.65; margin: 0; }
        .primary { align-self: flex-start; padding: 0.8rem 1.4rem; border-radius: 10px; border: none; background: linear-gradient(135deg, #ffd700, #ff8c00); color: #1a1a1a; font-weight: 700; cursor: pointer; font: inherit; }
        .primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .warn { color: #fca5a5; margin: 0; }
      `}</style>
    </div>
  );
}

function Faucet({ player, isConnected }) {
  const f = useFaucet(player);
  const me = useMe(undefined, player);
  const actions = useStumpActions(player);
  if (!isConnected || !f.available) return null;
  return (
    <div className="faucet">
      <span>This is the Amoy testnet. Grab <strong>{rdln(f.amount)} free RDLN</strong> once per wallet to play.</span>
      <button disabled={!!actions.pending} onClick={() => actions.claimFaucet().then((ok) => { if (ok) { f.refetch(); me.refetch(); } })}>
        {actions.pending ? `${actions.pending}…` : 'Get testnet RDLN'}
      </button>
      {actions.error && <span className="warn">{actions.error}</span>}
      <style jsx>{`
        .faucet { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem 1rem; padding: 0.9rem 1.2rem; border-radius: 12px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.35); }
        button { padding: 0.55rem 1rem; border-radius: 8px; border: none; background: #4ade80; color: #052e16; font-weight: 700; cursor: pointer; font: inherit; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .warn { color: #fca5a5; }
      `}</style>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    ['Write', 'A human writes a riddle and seals the answer on-chain with a small burned stake.'],
    ['Machines go first', 'A panel of frontier AI models tries it cold. Every guess they make is sealed before the riddle opens.'],
    ['Humans play', 'Solvers pay a small entry and seal a guess. Nobody sees anything until the riddle closes.'],
    ['Reveal', 'Author, panel, then players reveal. Everything is checked against what was sealed.'],
    ['Settle', 'Machines missed and a human hit: author takes 40%, solvers split 60%. A machine hit: the author gets nothing. Asking an AI for help gets you the same wrong answer the panel already gave.'],
  ];
  return (
    <section className="how">
      <h2>How it works</h2>
      <ol>{steps.map(([t, b]) => <li key={t}><strong>{t}.</strong> {b}</li>)}</ol>
      <style jsx>{`
        .how { padding: 1.5rem 1.75rem; border-radius: 18px; border: 1px solid rgba(255,255,255,0.08); }
        h2 { font-size: 1.15rem; margin: 0 0 0.75rem; color: #ffd700; }
        ol { margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.5rem; line-height: 1.55; }
      `}</style>
    </section>
  );
}
