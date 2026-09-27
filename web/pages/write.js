import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import Layout from '../components/Layout';
import { DIFFICULTY, useActions, useEconomics, useMe } from '../hooks/useStump';
import { splitAlternatives } from '../lib/answers';
import { rdln } from '../components/format';

export default function Write() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const actions = useActions(address);
  const economics = useEconomics();
  const me = useMe(undefined, address);
  const [riddle, setRiddle] = useState('');
  const [answers, setAnswers] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const alts = splitAlternatives(answers);
  const busy = !!actions.pending;
  const ok = isConnected && riddle.trim().length > 0 && riddle.length <= 2000 && alts.length > 0 && alts.length <= 8 && !busy;

  const submit = async () => {
    const done = await actions.submit(riddle.trim(), answers, difficulty);
    if (done) router.push('/');
  };

  return (
    <Layout title="Write a riddle">
      <div className="grid">
        <section className="form">
          <h1 className="display">Write one they can&apos;t crack.</h1>
          <p className="lede">Your answer is sealed the moment you submit. Then Claude, GPT and Gemini get the riddle cold. If they all miss and at least one person gets it, you take 40% of the pot.</p>

          <div className="field">
            <label htmlFor="r">The riddle</label>
            <textarea id="r" className="input" rows={5} maxLength={2000} value={riddle} onChange={(e) => setRiddle(e.target.value)} placeholder="I have keys but no locks, and my aunt keeps hers in the freezer." />
            <span className="help">{riddle.length} / 2000</span>
          </div>

          <div className="field">
            <label htmlFor="a">Accepted answer(s)</label>
            <input id="a" className="input" value={answers} onChange={(e) => setAnswers(e.target.value)} autoComplete="off" placeholder="keyboard / computer keyboard" />
            <span className="help">
              Separate alternatives with “/”, up to 8. Case, spacing and trailing punctuation are ignored.
              {alts.length > 0 && <> Will accept: <span className="mono">{alts.join(' · ')}</span></>}
            </span>
          </div>

          <div className="field">
            <label>Difficulty</label>
            <div className="diff">
              {economics.map((e, d) => (
                <button key={d} type="button" className={difficulty === d ? 'on' : ''} onClick={() => setDifficulty(d)}>
                  <strong>{DIFFICULTY[d]}</strong>
                  <span className="mono">{rdln(e.pool)} pot · {rdln(e.entryCost)} entry</span>
                </button>
              ))}
            </div>
          </div>

          {!isConnected && <p className="notice">Connect a wallet to submit.</p>}
          {isConnected && me.rdln < 10n ** 18n && <p className="notice warn">Submitting burns a small stake in RDLN and you have {rdln(me.rdln)}. Get free testnet RDLN on the Winnings page.</p>}
          <button className="btn accent" disabled={!ok} onClick={submit}>{busy ? `${actions.pending}…` : 'Seal answer and submit'}</button>
          {actions.error && <p className="notice warn">{actions.error}</p>}
        </section>

        <aside className="tips card">
          <h2 className="eyebrow">What pays</h2>
          <ul>
            <li><strong>Stumped:</strong> every machine misses, a person gets it. You earn 40% of the pot plus reputation. Solvers split the rest.</li>
            <li><strong>Machine solved:</strong> any machine guess matches any of your answers. You earn nothing.</li>
            <li><strong>Nobody solved:</strong> nothing is paid. It has to be solvable.</li>
            <li><strong>You don&apos;t reveal:</strong> voided, entrants refunded. You must come back within two days of the close.</li>
          </ul>
          <h2 className="eyebrow">What beats machines</h2>
          <ul>
            <li>Things you only know from living a life: your town, your family&apos;s words, a joke that needs a body.</li>
            <li>Misdirection that plays on how a model reads, not on trivia.</li>
            <li>Not: famous riddles, anything searchable, pure wordplay from a list.</li>
          </ul>
          <h2 className="eyebrow">The stake</h2>
          <p>Your first riddle burns 1 RDLN, the next 2, then 3. It is never returned. Declined spam still burns.</p>
        </aside>
      </div>

      <style jsx>{`
        .grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
        @media (min-width: 880px) { .grid { grid-template-columns: 1.5fr 1fr; gap: 56px; } }
        .form { display: flex; flex-direction: column; gap: 22px; }
        h1 { font-size: clamp(32px, 5vw, 48px); margin: 0; }
        .lede { margin: 0; color: var(--ink-2); font-size: 17px; }
        .diff { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .diff button { display: flex; flex-direction: column; gap: 3px; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--line-strong); background: transparent; text-align: left; cursor: pointer; }
        .diff button span { font-size: 12px; color: var(--ink-3); }
        .diff button.on { border-color: var(--ink); background: var(--paper-2); }
        .btn { align-self: flex-start; }
        .tips { padding: 24px; display: flex; flex-direction: column; gap: 10px; align-self: start; font-size: 14px; }
        .tips h2 { margin: 8px 0 0; }
        .tips ul { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; }
        .tips p { margin: 0; }
      `}</style>
    </Layout>
  );
}
