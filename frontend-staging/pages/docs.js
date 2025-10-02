import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';

export default function Docs() {
  return (
    <>
      <Head>
        <title>Learn About Riddlen - The Merit-Based Blockchain Game</title>
        <meta name="description" content="Discover how Riddlen works, why it's different, and how you can start earning through intelligence. No luck, no bots—just smart play." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">📚</div>
        <div className="floating-riddle">🔐</div>
        <div className="floating-riddle">💎</div>
      </div>

      <Header currentPage="docs" />

      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <section className="docs-hero">
          <div className="container">
            <h1 className="docs-title">Learn About Riddlen</h1>
            <p className="docs-subtitle">The world's first blockchain game where intelligence becomes currency</p>
          </div>
        </section>

        <section className="docs-content">
          <div className="container">
            <div className="docs-grid">
              {/* Quick Start */}
              <div className="doc-card featured">
                <div className="card-icon">🚀</div>
                <h3>Quick Start Guide</h3>
                <p>New to Riddlen? Get started in 5 minutes. Connect your wallet, claim testnet tokens, and start solving your first riddle.</p>
                <a href="/quick-start" className="doc-link">Start Playing →</a>
              </div>

              {/* How It Works */}
              <div className="doc-card">
                <div className="card-icon">🧠</div>
                <h3>How Riddlen Works</h3>
                <p>Understand the core mechanics: mint riddle NFTs, solve puzzles, earn RDLN rewards, and build RON reputation.</p>
                <a href="/how-it-works" className="doc-link">Learn the Basics →</a>
              </div>

              {/* Airdrop */}
              <div className="doc-card">
                <div className="card-icon">🎁</div>
                <h3>100M RDLN Airdrop</h3>
                <p>Earn through social proof, reputation building, or validation work. Three ways to get your share of 100M RDLN.</p>
                <a href="/airdrop-guide" className="doc-link">Join Airdrop →</a>
              </div>

              {/* Tokenomics */}
              <div className="doc-card">
                <div className="card-icon">💰</div>
                <h3>Tokenomics Explained</h3>
                <p>Learn about RDLN and RON tokens, tiered rewards, deflationary mechanics, and the rug-proof treasury system.</p>
                <a href="/tokenomics-deep" className="doc-link">View Tokenomics →</a>
              </div>

              {/* Oracle Network */}
              <div className="doc-card">
                <div className="card-icon">🔮</div>
                <h3>Become a Validator</h3>
                <p>Build RON reputation to access the Oracle Network. Earn RDLN by validating data for enterprises using human intelligence.</p>
                <a href="/oracle-guide" className="doc-link">Oracle Network →</a>
              </div>

              {/* Governance */}
              <div className="doc-card">
                <div className="card-icon">🏛️</div>
                <h3>DAO Governance</h3>
                <p>Earn RON to gain voting power. Shape the future of the protocol through merit-based governance. 1 RON = 1 Vote.</p>
                <a href="/dao-guide" className="doc-link">Learn About DAO →</a>
              </div>
            </div>

            {/* Technical Docs CTA */}
            <div className="technical-docs-banner">
              <div className="banner-content">
                <h2>Looking for Technical Documentation?</h2>
                <p>Complete developer documentation, API references, smart contract guides, and integration examples are available on our dedicated docs site.</p>
                <a href="https://riddlen.org" target="_blank" className="btn-tech-docs">
                  <i className="fas fa-code"></i> Visit Technical Docs Site →
                </a>
                <div className="tech-links">
                  <a href="https://riddlen.org/FRONTEND_INTEGRATION.html" target="_blank">
                    <i className="fas fa-laptop-code"></i> Frontend Integration
                  </a>
                  <a href="https://riddlen.org/api/" target="_blank">
                    <i className="fas fa-cogs"></i> API Reference
                  </a>
                  <a href="https://riddlen.org/contracts/" target="_blank">
                    <i className="fas fa-file-contract"></i> Smart Contracts
                  </a>
                  <a href="https://riddlen.org/testnet/" target="_blank">
                    <i className="fas fa-flask"></i> Testnet Guide
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Link Card */}
            <div className="faq-card-section">
              <div className="faq-big-card">
                <div className="faq-icon">❓</div>
                <h2>Have Questions?</h2>
                <p>Find answers to 30+ common questions about Riddlen, tokenomics, airdrop, Oracle Network, and more</p>
                <a href="/faq" className="btn-faq">
                  <i className="fas fa-question-circle"></i> View All FAQs
                </a>
              </div>
            </div>

            {/* Community CTA */}
            <div className="community-cta">
              <h2>Join the Riddlen Community</h2>
              <p>Connect with other players, get support, and stay updated on the latest developments</p>
              <div className="community-links">
                <a href="https://t.me/RiddlenToken" target="_blank" className="community-btn">
                  <i className="fab fa-telegram"></i> Telegram
                </a>
                <a href="https://twitter.com/RiddlenToken" target="_blank" className="community-btn">
                  <i className="fab fa-twitter"></i> Twitter
                </a>
                <a href="https://github.com/RiddlenBaba/riddlen" target="_blank" className="community-btn">
                  <i className="fab fa-github"></i> GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .docs-hero {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          padding: 4rem 0 3rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }

        .docs-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .docs-subtitle {
          font-size: 1.3rem;
          color: #cccccc;
        }

        .docs-content {
          padding: 4rem 0;
        }

        .docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .doc-card {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.03));
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2.5rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .doc-card.featured {
          border-color: rgba(255, 215, 0, 0.5);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
        }

        .doc-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.5);
          box-shadow: 0 20px 40px rgba(255, 215, 0, 0.1);
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .doc-card h3 {
          color: #FFD700;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .doc-card p {
          color: #cccccc;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .doc-link {
          color: #FFD700;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .doc-link:hover {
          color: #FFA500;
          transform: translateX(5px);
        }

        .technical-docs-banner {
          background: linear-gradient(45deg, rgba(75, 0, 130, 0.3), rgba(138, 43, 226, 0.2));
          border: 2px solid rgba(138, 43, 226, 0.5);
          border-radius: 20px;
          padding: 3rem;
          margin: 4rem 0;
          text-align: center;
        }

        .technical-docs-banner h2 {
          color: #FFD700;
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .technical-docs-banner p {
          color: #cccccc;
          font-size: 1.1rem;
          margin-bottom: 2rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .btn-tech-docs {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(45deg, #8A2BE2, #9370DB);
          color: #ffffff;
          padding: 1.2rem 2.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
        }

        .btn-tech-docs:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(138, 43, 226, 0.4);
        }

        .tech-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .tech-links a {
          color: #9370DB;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .tech-links a:hover {
          color: #FFD700;
        }

        .faq-card-section {
          margin: 4rem 0;
        }

        .faq-big-card {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1));
          border: 2px solid rgba(255, 215, 0, 0.4);
          border-radius: 25px;
          padding: 4rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .faq-big-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.6);
        }

        .faq-icon {
          font-size: 5rem;
          margin-bottom: 1.5rem;
        }

        .faq-big-card h2 {
          color: #FFD700;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .faq-big-card p {
          color: #cccccc;
          font-size: 1.2rem;
          margin-bottom: 2rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .btn-faq {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 1.2rem 3rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .btn-faq:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(255, 215, 0, 0.5);
        }

        .community-cta {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
          margin-top: 4rem;
        }

        .community-cta h2 {
          color: #FFD700;
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .community-cta p {
          color: #cccccc;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .community-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .community-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid rgba(255, 215, 0, 0.3);
          color: #FFD700;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .community-btn:hover {
          background: rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.5);
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(255, 215, 0, 0.2);
        }

        @media (max-width: 768px) {
          .docs-title {
            font-size: 2rem;
          }

          .docs-grid {
            grid-template-columns: 1fr;
          }

          .tech-links {
            flex-direction: column;
            align-items: center;
          }

          .community-links {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </>
  );
}
