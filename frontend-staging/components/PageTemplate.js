import Head from 'next/head';
import Header from './Header';
import GlobalStyles from './GlobalStyles';

export default function PageTemplate({
  title = "Riddlen - The Web3 Riddle Economy",
  description = "Riddlen: Where human intellect powers the blockchain. Solve riddles, earn RDLN tokens, and participate in the world's first Proof-of-Solve economy.",
  currentPage = "home",
  children,
  showFloatingRiddles = true,
  showFooter = true,
  containerMaxWidth = "1200px"
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      {showFloatingRiddles && (
        <div className="floating-riddles">
          <div className="floating-riddle">🧩</div>
          <div className="floating-riddle">🔐</div>
          <div className="floating-riddle">💎</div>
        </div>
      )}

      <Header currentPage={currentPage} />

      <main className="main-content">
        <div className="container" style={{ maxWidth: containerMaxWidth }}>
          {children}
        </div>
      </main>

      {showFooter && (
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>Riddlen Economy</h3>
                <p>The world's first Proof-of-Solve blockchain where human intellect powers decentralized finance through cryptographic riddles and NFT gaming.</p>
                <div className="social-links">
                  <a href="https://x.com/RiddlenToken" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="https://t.me/RiddlenToken" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                    <i className="fab fa-telegram"></i>
                  </a>
                  <a href="https://t.me/RiddlenCommunity" target="_blank" rel="noopener noreferrer" aria-label="Community">
                    <i className="fas fa-users"></i>
                  </a>
                  <a href="https://github.com/RiddlenBaba/riddlen/discussions" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <i className="fab fa-github"></i>
                  </a>
                </div>
              </div>
              <div className="footer-section">
                <h3>Platform</h3>
                <a href="/game">Play Now</a>
                <a href="/airdrop">Join Airdrop</a>
                <a href="/#why-riddlen">Why Riddlen</a>
                <a href="/#how-it-works">How It Works</a>
                <a href="https://riddlen.org" target="_blank">Technical Docs →</a>
              </div>
              <div className="footer-section">
                <h3>Smart Contracts</h3>
                <a href="https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB" target="_blank">RDLN Token</a>
                <a href="https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635" target="_blank">RON Token</a>
                <a href="https://amoy.polygonscan.com/address/0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3" target="_blank">Riddle NFT</a>
                <a href="https://amoy.polygonscan.com/" target="_blank">Polygon Explorer</a>
              </div>
              <div className="footer-section">
                <h3>Resources</h3>
                <a href="/whitepaper">Whitepaper v6.0</a>
                <a href="https://riddlen.org" target="_blank">Developer Docs</a>
                <a href="https://faucet.polygon.technology/" target="_blank">Get Testnet MATIC</a>
                <a href="https://github.com/RiddlenBaba/riddlen" target="_blank">GitHub</a>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2025 Riddlen. The Web3 Riddle Economy. Built on Polygon with Proof-of-Solve.</p>
            </div>
          </div>
        </footer>
      )}

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 30%, #16213e 70%, #0f0f0f 100%);
          min-height: 100vh;
        }

        #__next {
          min-height: 100vh;
          background: inherit;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #ffffff;
          line-height: 1.6;
          overflow-x: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .main-content {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 4rem;
        }

        .floating-riddles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
          pointer-events: none;
        }

        .floating-riddle {
          position: absolute;
          color: rgba(255, 215, 0, 0.1);
          font-size: 1.5rem;
          animation: float 8s ease-in-out infinite;
        }

        .floating-riddle:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
        .floating-riddle:nth-child(2) { top: 60%; left: 80%; animation-delay: 2s; }
        .floating-riddle:nth-child(3) { top: 80%; left: 20%; animation-delay: 4s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.3; }
        }

        .footer {
          padding: 4rem 0 2rem;
          background: rgba(0, 0, 0, 0.4);
          border-top: 1px solid rgba(255, 215, 0, 0.1);
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .footer-section h3 {
          color: #FFD700;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .footer-section p {
          color: #cccccc;
          margin-bottom: 0.5rem;
        }

        .footer-section a {
          color: #cccccc;
          text-decoration: none;
          margin-bottom: 0.5rem;
          display: block;
          transition: all 0.3s ease;
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

        @media (max-width: 768px) {
          .main-content {
            padding-top: 80px;
          }
        }
      `}</style>
    </>
  );
}
