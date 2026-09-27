import { useEffect, useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { formatEther } from 'viem';
import { polygonAmoy } from 'wagmi/chains';
import { useGameActions, useNow, usePlayerSession, useSessions } from '../hooks/useRiddleGame';

const PHASE_LABEL = {
  upcoming: 'Starting soon',
  open: 'Open',
  'awaiting-solution': 'Awaiting solution',
  reveal: 'Reveal your answer',
  finalizing: 'Ready to finalize',
  complete: 'Complete',
  stopped: 'Stopped',
  loading: '…',
};

const DIFFICULTY = ['Easy', 'Medium', 'Hard', 'Legendary'];

function rdln(value) {
  return Number(formatEther(value ?? 0n)).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function countdown(seconds) {
  if (seconds <= 0) return '0s';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
}

function phaseDeadline(session, revealWindow) {
  if (session.phase === 'open') return { label: 'Closes in', at: Number(session.endTime) };
  if (session.phase === 'reveal') {
    return { label: 'Reveals close in', at: Number(session.cr.solutionRevealedAt + revealWindow) };
  }
  return null;
}

export default function CommitRevealGame() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { sessions, revealWindow, isLoading } = useSessions();
  const [selectedId, setSelectedId] = useState(null);
  const now = useNow();

  useEffect(() => {
    if (selectedId === null && sessions.length) setSelectedId(sessions[0].id);
  }, [sessions, selectedId]);

  const selected = sessions.find((s) => s.id === selectedId);

  return (
    <div className="crg">
      {isConnected && chainId !== polygonAmoy.id && (
        <div className="notice">
          Riddlen runs on Polygon Amoy.{' '}
          <button className="link" onClick={() => switchChain({ chainId: polygonAmoy.id })}>Switch network</button>
        </div>
      )}

      <div className="layout">
        <aside className="list">
          <h2>Riddles</h2>
          {isLoading && <p className="muted">Loading sessions…</p>}
          {!isLoading && sessions.length === 0 && (
            <p className="muted">No riddles are live yet. Check back soon.</p>
          )}
          {sessions.map((s) => {
            const deadline = phaseDeadline(s, revealWindow);
            return (
              <button
                key={s.id.toString()}
                className={`card ${s.id === selectedId ? 'active' : ''}`}
                onClick={() => setSelectedId(s.id)}
              >
                <span className={`badge ${s.phase}`}>{PHASE_LABEL[s.phase]}</span>
                <strong>{s.title || `Riddle #${s.id}`}</strong>
                <span className="meta">
                  {DIFFICULTY[s.difficulty]} · {rdln(s.prizePool)} RDLN pool
                  {deadline && ` · ${deadline.label.toLowerCase()} ${countdown(deadline.at - now)}`}
                </span>
              </button>
            );
          })}
        </aside>

        <section className="detail">
          {selected ? (
            <SessionDetail session={selected} revealWindow={revealWindow} player={address} isConnected={isConnected} now={now} />
          ) : (
            !isLoading && <p className="muted">Select a riddle.</p>
          )}
        </section>
      </div>

      <HowItWorks />
      <style jsx>{`
        .crg { display: flex; flex-direction: column; gap: 1.5rem; }
        .notice { padding: 0.9rem 1.2rem; border-radius: 12px; background: rgba(255, 165, 0, 0.12); border: 1px solid rgba(255, 165, 0, 0.4); }
        .link { background: none; border: none; color: #ffd700; text-decoration: underline; cursor: pointer; font: inherit; }
        .layout { display: grid; grid-template-columns: minmax(260px, 340px) 1fr; gap: 1.5rem; }
        @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } }
        .list { display: flex; flex-direction: column; gap: 0.75rem; }
        h2 { font-size: 1.25rem; margin: 0 0 0.25rem; color: #ffd700; }
        .card { display: flex; flex-direction: column; align-items: flex-start; gap: 0.35rem; text-align: left; padding: 1rem; border-radius: 14px; border: 1px solid rgba(255, 215, 0, 0.15); background: rgba(255, 255, 255, 0.03); color: inherit; cursor: pointer; font: inherit; }
        .card:hover { border-color: rgba(255, 215, 0, 0.4); }
        .card.active { border-color: #ffd700; background: rgba(255, 215, 0, 0.06); }
        .meta { font-size: 0.85rem; opacity: 0.7; }
        .muted { opacity: 0.65; }
        .badge { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; padding: 0.15rem 0.55rem; border-radius: 999px; background: rgba(255, 255, 255, 0.08); }
        .badge.open { background: rgba(34, 197, 94, 0.18); color: #4ade80; }
        .badge.reveal, .badge.finalizing { background: rgba(255, 215, 0, 0.18); color: #ffd700; }
        .badge.awaiting-solution { background: rgba(96, 165, 250, 0.18); color: #93c5fd; }
        .detail { padding: 1.75rem; border-radius: 18px; border: 1px solid rgba(255, 215, 0, 0.2); background: rgba(255, 255, 255, 0.02); min-height: 320px; }
      `}</style>
    </div>
  );
}

function SessionDetail({ session, revealWindow, player, isConnected, now }) {
  const me = usePlayerSession(session.id, player);
  const actions = useGameActions(player);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    setAnswer(player ? actions.savedAnswer(session.id) : '');
    actions.clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.id, player]);

  const after = async (ok) => { if (ok) me.refetch(); };
  const cooldown = Math.max(0, Number(me.lastActivity) + 30 - now);
  const solveWait = me.entry ? Math.max(0, Number(me.entry.startTime) + 30 - now) : 0;
  const wait = Math.max(cooldown, solveWait);
  const canAfford = me.rdlnBalance >= session.currentMintCost;
  const busy = !!actions.pending;
  const deadline = phaseDeadline(session, revealWindow);

  return (
    <div className="sd">
      <header>
        <span className="eyebrow">{DIFFICULTY[session.difficulty]} · {session.category || 'riddle'}</span>
        <h3>{session.title || `Riddle #${session.id}`}</h3>
        {deadline && <span className="deadline">{deadline.label} {countdown(deadline.at - now)}</span>}
      </header>

      {session.description && <blockquote className="riddle">{session.description}</blockquote>}

      <dl className="stats">
        <div><dt>Prize pool</dt><dd>{rdln(session.prizePool)} RDLN</dd></div>
        <div><dt>Winner slots</dt><dd>{session.winnerSlots.toString()}</dd></div>
        <div><dt>Entrants</dt><dd>{session.totalMinted.toString()} / {session.maxMints.toString()}</dd></div>
        <div><dt>Entry cost</dt><dd>{rdln(session.currentMintCost)} RDLN</dd></div>
      </dl>

      <div className="action">
        {!isConnected && <p>Connect your wallet to play.</p>}

        {isConnected && session.phase === 'upcoming' && <p>This riddle hasn&apos;t started yet.</p>}

        {isConnected && session.phase === 'open' && !me.entry && (
          <>
            <p>
              Enter to get your game NFT. Your answer is sealed on-chain and only revealed after the
              riddle closes, so nobody can copy it.
            </p>
            {!canAfford && <p className="warn">You need {rdln(session.currentMintCost)} RDLN (you have {rdln(me.rdlnBalance)}).</p>}
            <button className="primary" disabled={busy || !canAfford || cooldown > 0} onClick={() => actions.enter(session.id).then(after)}>
              {cooldown > 0 ? `Wait ${cooldown}s` : `Enter for ${rdln(session.currentMintCost)} RDLN`}
            </button>
          </>
        )}

        {isConnected && session.phase === 'open' && me.entry && (
          <>
            {me.hasCommitted && (
              <p className="ok">
                Answer sealed at {new Date(Number(me.commit.committedAt) * 1000).toLocaleTimeString()}. Changing it
                moves you behind everyone who sealed before your change.
              </p>
            )}
            <label htmlFor="answer">Your answer</label>
            <input id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer" autoComplete="off" />
            <p className="hint">Case, spacing and trailing punctuation don&apos;t matter. Your wallet will ask for a free signature to seal it.</p>
            <button className="primary" disabled={busy || !answer.trim() || wait > 0} onClick={() => actions.commit(session.id, answer).then(after)}>
              {wait > 0 ? `Wait ${wait}s` : me.hasCommitted ? 'Change sealed answer' : 'Seal answer'}
            </button>
          </>
        )}

        {isConnected && session.phase === 'awaiting-solution' && (
          <p>{me.hasCommitted ? 'Your answer is sealed. ' : ''}The riddle has closed. Waiting for the game master to reveal the solution.</p>
        )}

        {isConnected && session.phase === 'reveal' && me.hasCommitted && !me.commit.correct && (
          <>
            <p>The solution is out. Reveal your sealed answer to be counted. Unrevealed answers count as wrong.</p>
            <label htmlFor="reveal">Your sealed answer</label>
            <input id="reveal" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Retype it if it isn't filled in" autoComplete="off" />
            <button className="primary" disabled={busy || !answer.trim()} onClick={() => actions.reveal(session.id, answer).then(after)}>
              Reveal answer
            </button>
          </>
        )}
        {isConnected && session.phase === 'reveal' && me.hasCommitted && me.commit.correct && (
          <p className="ok">Correct! You&apos;re counted. Rankings are settled once the reveal window ends.</p>
        )}
        {isConnected && session.phase === 'reveal' && !me.hasCommitted && <p>You didn&apos;t seal an answer in this riddle.</p>}

        {session.phase === 'finalizing' && (
          <>
            <p>The reveal window has ended. Anyone can settle the rankings and payouts.</p>
            {isConnected && (
              <button className="primary" disabled={busy} onClick={() => actions.finalize(session.id).then(after)}>
                Finalize results
              </button>
            )}
          </>
        )}

        {isConnected && session.phase === 'complete' && me.entry && (
          me.entry.prizeAmount > 0n ? (
            me.entry.prizeClaimed ? (
              <p className="ok">You won {rdln(me.entry.prizeAmount)} RDLN. Claimed.</p>
            ) : (
              <>
                <p className="ok">You won {rdln(me.entry.prizeAmount)} RDLN!</p>
                <button className="primary" disabled={busy} onClick={() => actions.claim(me.entry.tokenId).then(after)}>
                  Claim prize
                </button>
              </>
            )
          ) : me.entry.successful ? (
            <p>You solved it, but every winner slot was taken by earlier answers.</p>
          ) : (
            <p>Not this time. Better luck on the next riddle.</p>
          )
        )}
        {isConnected && session.phase === 'complete' && !me.entry && (
          <p>This riddle is settled: {session.cr.winnersAssigned.toString()} winner(s).</p>
        )}

        {actions.pending && <p className="pending">{actions.pending}… confirm in your wallet.</p>}
        {actions.error && <p className="error">{actions.error}</p>}
      </div>

      <style jsx>{`
        .sd { display: flex; flex-direction: column; gap: 1.25rem; }
        header { display: flex; flex-direction: column; gap: 0.35rem; }
        .eyebrow { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.65; }
        h3 { font-size: 1.8rem; margin: 0; }
        .deadline { color: #ffd700; font-weight: 600; }
        .riddle { margin: 0; padding: 1.25rem 1.5rem; border-left: 3px solid #ffd700; background: rgba(255, 215, 0, 0.05); border-radius: 0 12px 12px 0; font-size: 1.15rem; line-height: 1.6; white-space: pre-wrap; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; margin: 0; }
        .stats div { padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255, 255, 255, 0.04); }
        dt { font-size: 0.75rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em; }
        dd { margin: 0.2rem 0 0; font-weight: 700; }
        .action { display: flex; flex-direction: column; gap: 0.75rem; }
        .action p { margin: 0; line-height: 1.5; }
        label { font-weight: 600; }
        input { padding: 0.85rem 1rem; border-radius: 12px; border: 1px solid rgba(255, 215, 0, 0.3); background: rgba(0, 0, 0, 0.35); color: inherit; font-size: 1.05rem; }
        input:focus { outline: none; border-color: #ffd700; }
        .hint { font-size: 0.85rem; opacity: 0.65; }
        .primary { align-self: flex-start; padding: 0.8rem 1.6rem; border-radius: 12px; border: none; background: linear-gradient(135deg, #ffd700, #ffa500); color: #111; font-weight: 800; font-size: 1rem; cursor: pointer; }
        .primary:disabled { opacity: 0.45; cursor: not-allowed; }
        .ok { color: #4ade80; }
        .warn { color: #fbbf24; }
        .error { color: #f87171; }
        .pending { color: #ffd700; }
      `}</style>
    </div>
  );
}

function HowItWorks() {
  return (
    <section className="how">
      <h2>How a riddle works</h2>
      <ol>
        <li><strong>Enter.</strong> Pay the entry cost to receive your game NFT.</li>
        <li><strong>Seal your answer.</strong> It&apos;s stored as a sealed hash tied to your wallet, so nobody can read or copy it. The earlier you seal a correct answer, the better your rank.</li>
        <li><strong>Reveal.</strong> After the riddle closes the game master publishes the solution, and you have 2 days to reveal yours.</li>
        <li><strong>Win.</strong> The earliest correct answers take the winner slots. The first solver gets a 1.5× share. Winners earn RON reputation.</li>
      </ol>
      <p className="muted">Wrong or unrevealed answers pay a small failed-attempt fee.</p>
      <style jsx>{`
        .how { padding: 1.5rem 1.75rem; border-radius: 18px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 215, 0, 0.12); }
        h2 { font-size: 1.2rem; margin: 0 0 0.75rem; color: #ffd700; }
        ol { margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.5rem; line-height: 1.5; }
        .muted { opacity: 0.65; margin: 0.75rem 0 0; }
      `}</style>
    </section>
  );
}
