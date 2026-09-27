import Link from 'next/link';
import Layout from '../components/Layout';

const FAQ = [
  ['Which machines?', 'Claude Opus 5, GPT-6 and Gemini, each asked twice for their three best guesses. Every distinct guess is sealed on chain before the riddle opens. If any one of them matches the answer, the machines win.'],
  ['Can I use an AI to help me solve?', 'You can, but it will give you the guess it already made and already sealed. The riddles that pay are exactly the ones the machines got wrong.'],
  ['Why is everything "sealed"?', 'So nobody can copy. You commit a fingerprint of your answer while the riddle is open, and reveal the answer itself after it closes. The fingerprint proves you did not change it. The machines and the author work the same way.'],
  ['What do I sign in my wallet?', 'A free signature that creates your secret. It never leaves your device and costs nothing. Signing the same message again recreates the secret, so you can reveal from any device with the same wallet.'],
  ['What if I forget to reveal?', 'An unrevealed guess counts as wrong. Reveals close two days after the author reveals, and the site shows a countdown.'],
  ['What if the author never reveals?', 'The riddle is voided. Everyone who entered gets their entry cost back from the pot. The author lost their stake for nothing.'],
  ['What is RDLN, and what is RON?', 'RDLN is the token you enter with and get paid in. RON is reputation: it cannot be transferred, and you earn it by stumping the machines or solving riddles. Right now this is the Polygon Amoy testnet, so RDLN has no value.'],
  ['Where does the pot come from?', 'From the game treasury on the contract. Entry fees are not the pot: half of each entry is burned and the rest funds the grand prize and operations, the way the RDLN token has always worked.'],
];

export default function How() {
  return (
    <Layout title="How it works" description="How Riddlen works: people write riddles, the machines try first, humans get paid when the machines lose.">
      <article className="how">
        <header>
          <p className="eyebrow">How it works</p>
          <h1 className="display">People write riddles. Machines go first. When they lose, you get paid.</h1>
          <p className="lede">Riddlen is a riddle game with one rule that makes it different from every other one: a riddle only pays if a panel of frontier AI models tried it and failed. That means the prize money can only ever go to people, for things people can do and machines can&apos;t.</p>
        </header>

        <section>
          <h2 className="display">One riddle, start to finish</h2>
          <ol className="walk">
            <li>
              <strong>Someone writes it.</strong>
              <p>They type the riddle and the answer, pick a difficulty, and submit. The answer is sealed: only a fingerprint of it goes on chain. Submitting burns a small stake in RDLN, which is never returned.</p>
            </li>
            <li>
              <strong>The machines try it, cold.</strong>
              <p>Before any person sees it, the riddle goes to Claude, GPT and Gemini. Their guesses are sealed on chain the same way. Nobody, including the author, is told whether they got it.</p>
            </li>
            <li>
              <strong>The riddle opens.</strong>
              <p>Anyone can enter for a small entry fee, think, and seal a guess. The riddle stays open for a set time, usually a day. You can change your sealed guess until it closes.</p>
            </li>
            <li>
              <strong>Everyone reveals.</strong>
              <p>After it closes, the author reveals the answer. Then the machines&apos; guesses are revealed. Then every player reveals their guess. Each reveal is checked against its seal, so nothing can be changed after the fact.</p>
            </li>
            <li>
              <strong>It settles.</strong>
              <p>The contract compares the machines&apos; guesses and the players&apos; guesses to the answer, decides the outcome, and books the payouts. Anyone can press Settle. Winnings collect on the Winnings page and are withdrawn in one transaction.</p>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="display">The four outcomes</h2>
          <table>
            <thead><tr><th>Outcome</th><th>When</th><th>Author gets</th><th>Correct solvers get</th></tr></thead>
            <tbody>
              <tr className="h"><td>Stumped the machine</td><td>Every machine missed, at least one person got it</td><td>40% of the pot, plus RON</td><td>Split 60% of the pot, plus RON</td></tr>
              <tr className="m"><td>Machine solved it</td><td>Any machine guess matched the answer</td><td>Nothing</td><td>Split 25% of the pot</td></tr>
              <tr><td>Nobody solved it</td><td>Machines missed, so did every person</td><td>Nothing</td><td>Nothing</td></tr>
              <tr><td>Voided</td><td>The author never revealed</td><td>Nothing</td><td>Everyone who entered is refunded</td></tr>
            </tbody>
          </table>
          <p className="muted">Wrong guesses earn nothing and pay a small, rising penalty in RDLN, so guessing at random does not pay.</p>
        </section>

        <section>
          <h2 className="display">Pots and entries</h2>
          <table>
            <thead><tr><th>Difficulty</th><th>Pot</th><th>Entry</th></tr></thead>
            <tbody>
              <tr><td>Easy</td><td>10,000 RDLN</td><td>10 RDLN</td></tr>
              <tr><td>Medium</td><td>25,000</td><td>25</td></tr>
              <tr><td>Hard</td><td>60,000</td><td>50</td></tr>
              <tr><td>Legendary</td><td>150,000</td><td>100</td></tr>
            </tbody>
          </table>
          <p className="muted">The author picks the difficulty. Bigger pots draw more solvers, and more solvers means a smaller share each.</p>
        </section>

        <section>
          <h2 className="display">Writing one that pays</h2>
          <p>The machines are very good at anything that is written down somewhere: classic riddles, wordplay from lists, trivia, logic puzzles. They are bad at things that only exist in a life. Your street, your family&apos;s private words, the thing everyone in your office knows, a joke that needs a body or a season. Write from there. It still has to be solvable by a stranger, though: if nobody gets it, nobody is paid. Riddles you can list several accepted answers for (&quot;keyboard / computer keyboard&quot;) are fairer to solvers.</p>
        </section>

        <section>
          <h2 className="display">Questions</h2>
          <dl className="faq">
            {FAQ.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}
          </dl>
        </section>

        <p className="muted">The full rules, the token, the contracts and where the game is going next are on the docs site: <a href="https://riddlen.org" target="_blank" rel="noreferrer">riddlen.org</a>.</p>

        <p className="ctas">
          <Link href="/free" legacyBehavior><a className="btn accent">Get free Riddlen</a></Link>
          <Link href="/" legacyBehavior><a className="btn">See the board</a></Link>
        </p>
      </article>
      <style jsx>{`
        .how { display: flex; flex-direction: column; gap: 48px; max-width: 760px; }
        header { display: flex; flex-direction: column; gap: 14px; }
        h1 { font-size: clamp(30px, 5vw, 46px); margin: 0; }
        h2 { font-size: 26px; margin: 0 0 16px; }
        .lede { font-size: 18px; color: var(--ink-2); margin: 0; }
        .walk { margin: 0; padding-left: 22px; display: flex; flex-direction: column; gap: 18px; }
        .walk li::marker { font-family: var(--mono); color: var(--accent); }
        .walk p { margin: 4px 0 0; color: var(--ink-2); }
        table { width: 100%; border-collapse: collapse; font-size: 15px; }
        th { text-align: left; font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); font-weight: 500; padding: 0 10px 8px 0; border-bottom: 1px solid var(--line); }
        td { padding: 10px 10px 10px 0; border-bottom: 1px solid var(--line); vertical-align: top; }
        tr.h td:first-child { color: var(--human); font-weight: 600; }
        tr.m td:first-child { color: var(--machine); font-weight: 600; }
        section p { margin: 12px 0 0; }
        .faq { margin: 0; display: flex; flex-direction: column; gap: 18px; }
        dt { font-weight: 600; }
        dd { margin: 4px 0 0; color: var(--ink-2); }
        .ctas { display: flex; gap: 10px; flex-wrap: wrap; margin: 0; }
        @media (max-width: 560px) { table { font-size: 13px; } td, th { padding-right: 6px; } }
      `}</style>
    </Layout>
  );
}
