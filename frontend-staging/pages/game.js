import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';
import RiddleGame from '../components/RiddleGame';

export default function Game() {
  return (
    <>
      <Head>
        <title>Riddlen Game - Solve Riddles, Earn RDLN | Proof-of-Solve</title>
        <meta name="description" content="Play Riddlen: Solve cryptographic riddles, earn RDLN tokens, and progress through RON tiers in the world's first Proof-of-Solve economy." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">🧩</div>
        <div className="floating-riddle">🔐</div>
        <div className="floating-riddle">💎</div>
      </div>

      <Header currentPage="game" />

      {/* Main Game Content */}
      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <section className="game-section">
          <div className="container">
            {/* Hero Section */}
            <div className="game-hero">
              <h1 className="game-title">The Riddlen Game</h1>
              <p className="game-subtitle">
                Solve cryptographic riddles, earn RDLN tokens, and climb the RON tier system
              </p>
              <div className="proof-of-solve-badge">
                <span className="text-yellow-400 font-semibold">⚡ Proof-of-Solve Network</span>
              </div>
            </div>

            {/* Game Interface */}
            <RiddleGame />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Riddlen Economy</h3>
              <p>The world's first Proof-of-Solve blockchain where human intellect powers decentralized finance through cryptographic riddles and NFT gaming.</p>
              <div className="social-links">
                <a href="https://x.com/RiddlenToken" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="https://t.me/RiddlenToken" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><i className="fab fa-telegram"></i></a>
                <a href="https://t.me/RiddlenCommunity" target="_blank" rel="noopener noreferrer" aria-label="Community"><i className="fas fa-users"></i></a>
                <a href="https://github.com/RiddlenBaba/riddlen/discussions" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
              </div>
            </div>
            <div className="footer-section">
              <h3>Platform</h3>
              <a href="/">Home</a>
              <a href="/game">Play Demo</a>
              <a href="/docs">Documentation</a>
              <a href="/dashboard">Dashboard</a>
              <a href="/airdrop">Airdrop</a>
              <a href="https://github.com/RiddlenBaba/riddlen" target="_blank">GitHub</a>
            </div>
            <div className="footer-section">
              <h3>Smart Contracts</h3>
              <a href="https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB" target="_blank">RDLN Token</a>
              <a href="https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635" target="_blank">RON Token</a>
              <a href="https://amoy.polygonscan.com/address/0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3" target="_blank">Riddle NFT</a>
              <a href="https://amoy.polygonscan.com/" target="_blank">Polygon Explorer</a>
            </div>
            <div className="footer-section">
              <h3>Network</h3>
              <a href="https://polygon.technology/" target="_blank">Polygon</a>
              <a href="https://faucet.polygon.technology/" target="_blank">Testnet Faucet</a>
              <a href="/docs" target="_blank">Integration Guide</a>
              <a href="https://metamask.io/" target="_blank">MetaMask</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Riddlen. The Web3 Riddle Economy. Built on Polygon with Proof-of-Solve.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .game-section {
          padding: 2rem 0 4rem;
          min-height: calc(100vh - 100px);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .game-hero {
          text-align: center;
          margin-bottom: 3rem;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .game-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
        }

        .game-subtitle {
          font-size: 1.3rem;
          color: #cccccc;
          margin-bottom: 1.5rem;
          line-height: 1.8;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .proof-of-solve-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.4);
          border-radius: 25px;
          padding: 0.75rem 1.5rem;
          margin-bottom: 1rem;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .game-hero {
            padding: 2rem 1rem;
          }

          .game-title {
            font-size: 2.2rem;
          }

          .game-subtitle {
            font-size: 1rem;
          }

          .proof-of-solve-badge {
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
          }
        }

        .footer {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          padding: 4rem 0 2rem;
          margin-top: 4rem;
          border-top: 1px solid rgba(255, 215, 0, 0.1);
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-section h3 {
          color: #FFD700;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .footer-section p, .footer-section a {
          color: #cccccc;
          text-decoration: none;
          margin-bottom: 0.5rem;
          display: block;
        }

        .footer-section a:hover {
          color: #FFD700;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-links a {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 215, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFD700;
          transition: all 0.3s ease;
        }

        .social-links a:hover {
          background: rgba(255, 215, 0, 0.3);
          transform: translateY(-2px);
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 215, 0, 0.1);
          color: #888;
        }
      `}</style>
    </>
  );
}