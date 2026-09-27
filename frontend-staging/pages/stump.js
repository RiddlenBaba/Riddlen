import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';
import StumpTheMachine from '../components/StumpTheMachine';

export default function Stump() {
  return (
    <>
      <Head>
        <title>Stump the Machine | Riddlen</title>
        <meta name="description" content="Write riddles frontier AI can't solve. Machines try first, sealed. Humans who beat them get paid in RDLN." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>
      <GlobalStyles />
      <Header currentPage="stump" />
      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <section className="game-section">
          <div className="container">
            <div className="game-hero">
              <h1 className="game-title">Stump the Machine</h1>
              <p className="game-subtitle">
                Riddles written by humans. Tried by frontier AI first. Paid only when the machines lose.
              </p>
              <div className="proof-of-solve-badge">
                <span className="text-yellow-400 font-semibold">🧠 Human-only by construction</span>
              </div>
            </div>
            <StumpTheMachine />
          </div>
        </section>
      </main>
    </>
  );
}
