import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';
import LiveStats from '../components/LiveStats';
import AirdropEligibility from '../components/AirdropEligibility';

export default function Airdrop() {
  return (
    <>
      <Head>
        <title>RDLN Airdrop - Get Free Tokens | Riddlen</title>
        <meta name="description" content="Join the Riddlen airdrop and claim your RDLN tokens. Early adopters, contributors, and community members eligible for rewards." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">💎</div>
        <div className="floating-riddle">🎁</div>
        <div className="floating-riddle">⚡</div>
      </div>

      <Header currentPage="airdrop" />

      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <section className="airdrop-section">
          <div className="container">
            <div className="airdrop-hero">
              <h1 className="airdrop-title">🎁 RDLN Token Airdrop</h1>
              <p className="airdrop-subtitle">Join the Proof-of-Solve revolution and claim your tokens</p>

              <div className="airdrop-stats">
                <div className="stat-item">
                  <div className="stat-value">100M</div>
                  <div className="stat-label">Total Airdrop Pool</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">10%</div>
                  <div className="stat-label">Of Total Supply</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">Live</div>
                  <div className="stat-label">Status</div>
                </div>
              </div>

              <div className="contract-info">
                <span>Airdrop Contract:</span>
                <a
                  href="https://amoy.polygonscan.com/address/0x330275259AfCeC8822A861ecbbdfD026dB1B0A13"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contract-link"
                >
                  0x3302...0A13 <i className="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>

            <LiveStats />

            <AirdropEligibility />

            <div className="ways-to-get">
              <h2 className="section-heading">How to Get RDLN Tokens</h2>

              <div className="methods-grid">
                <div className="method-card featured">
                  <div className="method-icon">🎁</div>
                  <h3>Community Airdrop</h3>
                  <p>100M RDLN tokens distributed to early adopters, contributors, and active community members across multiple waves.</p>
                  <div className="method-details">
                    <div className="detail-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Early adopter rewards</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Social engagement bonuses</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Community contribution rewards</span>
                    </div>
                  </div>
                  <button
                    onClick={() => document.querySelector('.eligibility-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    className="claim-btn"
                  >
                    <i className="fas fa-gift"></i> Check Eligibility
                  </button>
                </div>

                <div className="method-card">
                  <div className="method-icon">💧</div>
                  <h3>Testnet Faucet</h3>
                  <p>Get free testnet RDLN to try out the platform on Polygon Amoy testnet.</p>
                  <div className="method-details">
                    <div className="detail-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Instant claim (10 RDLN)</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Once per 24 hours</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Test platform features</span>
                    </div>
                  </div>
                  <a
                    href="https://faucet.polygon.technology/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="faucet-btn"
                  >
                    <i className="fas fa-faucet"></i> Claim from Faucet
                  </a>
                </div>

                <div className="method-card">
                  <div className="method-icon">💱</div>
                  <h3>DEX Swap (Coming Soon)</h3>
                  <p>Trade MATIC for RDLN on decentralized exchanges once liquidity pools are live.</p>
                  <div className="method-details">
                    <div className="detail-item">
                      <i className="fas fa-info-circle"></i>
                      <span>100M RDLN liquidity pool</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-info-circle"></i>
                      <span>Locked for up to 10 years</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-info-circle"></i>
                      <span>Permanent market depth</span>
                    </div>
                  </div>
                  <button className="swap-btn disabled">
                    <i className="fas fa-exchange-alt"></i> Coming Soon
                  </button>
                </div>

                <div className="method-card">
                  <div className="method-icon">🧩</div>
                  <h3>Solve Riddles</h3>
                  <p>Earn RDLN by solving cryptographic riddles. First solvers get the largest rewards!</p>
                  <div className="method-details">
                    <div className="detail-item">
                      <i className="fas fa-check-circle"></i>
                      <span>700M RDLN in prize pools</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Tiered reward multipliers</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Progress through RON tiers</span>
                    </div>
                  </div>
                  <a href="/game" className="play-btn">
                    <i className="fas fa-play"></i> Play Now
                  </a>
                </div>
              </div>
            </div>

            <div className="eligibility-section">
              <h2 className="section-heading">Airdrop Eligibility Criteria</h2>
              <div className="eligibility-grid">
                <div className="eligibility-card">
                  <div className="eligibility-icon">👥</div>
                  <h4>Early Adopters</h4>
                  <p>Users who join during testnet phase and actively participate in platform testing.</p>
                </div>
                <div className="eligibility-card">
                  <div className="eligibility-icon">🔧</div>
                  <h4>Contributors</h4>
                  <p>Community members who contribute code, riddles, documentation, or platform improvements.</p>
                </div>
                <div className="eligibility-card">
                  <div className="eligibility-icon">📢</div>
                  <h4>Social Engagement</h4>
                  <p>Active followers on X, Telegram community participants, and content creators.</p>
                </div>
                <div className="eligibility-card">
                  <div className="eligibility-icon">🎯</div>
                  <h4>Riddle Solvers</h4>
                  <p>Users who solve riddles and demonstrate engagement with the core game mechanics.</p>
                </div>
              </div>
            </div>

            <div className="airdrop-timeline">
              <h2 className="section-heading">Airdrop Timeline</h2>
              <div className="timeline">
                <div className="timeline-item completed">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Wave 1: Testnet Launch</h4>
                    <p className="timeline-status">✅ Completed</p>
                    <p>Early adopters who test the platform during Polygon Amoy testnet phase.</p>
                  </div>
                </div>
                <div className="timeline-item active">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Wave 2: Community Growth</h4>
                    <p className="timeline-status">🟢 Active Now</p>
                    <p>Social engagement rewards for X followers, Telegram members, and content creators.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Wave 3: Mainnet Launch</h4>
                    <p className="timeline-status">⚪ Planned</p>
                    <p>Rewards for users who helped test and improve the platform before mainnet.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="cta-section">
              <h2>Ready to Get Started?</h2>
              <p>Connect your wallet and join the Riddlen community today!</p>
              <div className="cta-buttons">
                <a href="/game" className="btn-primary">
                  <i className="fas fa-gamepad"></i> Play Demo
                </a>
                <a href="https://t.me/RiddlenCommunity" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <i className="fab fa-telegram"></i> Join Community
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

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
        .airdrop-section {
          padding: 2rem 0 4rem;
        }

        .airdrop-hero {
          text-align: center;
          margin-bottom: 4rem;
        }

        .airdrop-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #FFD700, #FFA500, #FF6347);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .airdrop-subtitle {
          font-size: 1.3rem;
          color: #cccccc;
          margin-bottom: 3rem;
        }

        .airdrop-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #FFD700;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
        }

        .stat-label {
          font-size: 0.9rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .contract-info {
          text-align: center;
          margin-top: 2rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .contract-info span {
          color: #aaaaaa;
          font-size: 0.9rem;
        }

        .contract-link {
          color: #FFD700;
          text-decoration: none;
          font-family: monospace;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .contract-link:hover {
          color: #FFA500;
          transform: translateX(2px);
        }

        .section-heading {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 2rem;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ways-to-get {
          margin: 4rem 0;
        }

        .methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .method-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .method-card.featured {
          border: 2px solid rgba(255, 215, 0, 0.5);
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
        }

        .method-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.4);
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
        }

        .method-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .method-card h3 {
          color: #FFD700;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .method-card p {
          color: #cccccc;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .method-details {
          margin: 1.5rem 0;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0.75rem 0;
          color: #aaaaaa;
          font-size: 0.9rem;
        }

        .detail-item i {
          color: #FFD700;
        }

        .claim-btn, .faucet-btn, .swap-btn, .play-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .claim-btn {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
        }

        .claim-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4);
        }

        .faucet-btn {
          background: linear-gradient(45deg, #3b82f6, #2563eb);
          color: #fff;
        }

        .faucet-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
        }

        .swap-btn {
          background: rgba(100, 100, 100, 0.3);
          color: #999;
          cursor: not-allowed;
        }

        .swap-btn.disabled {
          opacity: 0.6;
        }

        .play-btn {
          background: linear-gradient(45deg, #10b981, #059669);
          color: #fff;
        }

        .play-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
        }

        .eligibility-section {
          margin: 4rem 0;
        }

        .eligibility-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .eligibility-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.15);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .eligibility-card:hover {
          border-color: rgba(255, 215, 0, 0.3);
          transform: translateY(-5px);
        }

        .eligibility-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .eligibility-card h4 {
          color: #FFD700;
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
        }

        .eligibility-card p {
          color: #aaaaaa;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .airdrop-timeline {
          margin: 4rem 0;
        }

        .timeline {
          max-width: 800px;
          margin: 2rem auto;
          position: relative;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 20px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #FFD700, rgba(255, 215, 0, 0.2));
        }

        .timeline-item {
          position: relative;
          padding-left: 60px;
          margin-bottom: 3rem;
        }

        .timeline-marker {
          position: absolute;
          left: 11px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(100, 100, 100, 0.5);
          border: 2px solid rgba(255, 215, 0, 0.3);
        }

        .timeline-item.completed .timeline-marker {
          background: #10b981;
          border-color: #10b981;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
        }

        .timeline-item.active .timeline-marker {
          background: #FFD700;
          border-color: #FFD700;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
          animation: pulse-timeline 2s ease-in-out infinite;
        }

        @keyframes pulse-timeline {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
          50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.9); }
        }

        .timeline-content {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 15px;
          padding: 1.5rem;
        }

        .timeline-item.active .timeline-content {
          border-color: rgba(255, 215, 0, 0.4);
        }

        .timeline-content h4 {
          color: #FFD700;
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }

        .timeline-status {
          color: #aaaaaa;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .timeline-content p {
          color: #cccccc;
          line-height: 1.6;
        }

        .cta-section {
          text-align: center;
          margin: 4rem 0;
          padding: 3rem;
          background: linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 99, 71, 0.1));
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
        }

        .cta-section h2 {
          font-size: 2rem;
          color: #FFD700;
          margin-bottom: 1rem;
        }

        .cta-section p {
          font-size: 1.1rem;
          color: #cccccc;
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(255, 215, 0, 0.4);
        }

        .btn-secondary {
          background: transparent;
          color: #FFD700;
          padding: 1rem 2rem;
          border: 2px solid #FFD700;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-secondary:hover {
          background: rgba(255, 215, 0, 0.1);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .airdrop-title {
            font-size: 2.5rem;
          }

          .airdrop-stats {
            gap: 2rem;
          }

          .methods-grid {
            grid-template-columns: 1fr;
          }

          .eligibility-grid {
            grid-template-columns: 1fr;
          }

          .timeline::before {
            left: 10px;
          }

          .timeline-item {
            padding-left: 50px;
          }

          .timeline-marker {
            left: 1px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.2);
          color: #FFD700;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .social-links a:hover {
          background: rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
        }

        .social-links i {
          font-size: 1.1rem;
        }
      `}</style>
    </>
  );
}