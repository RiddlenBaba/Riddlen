import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Head from 'next/head';

export default function Landing() {
  const address = useAddress();

  return (
    <>
      <Head>
        <title>Riddlen - The Web3 Riddle Economy | Proof-of-Solve Gaming</title>
        <meta name="description" content="Riddlen: Where human intellect powers the blockchain. Solve riddles, earn RDLN tokens, and participate in the world's first Proof-of-Solve economy." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <div className="floating-riddles">
        <div className="floating-riddle">🧩</div>
        <div className="floating-riddle">🔐</div>
        <div className="floating-riddle">💎</div>
      </div>

      <header className="header">
        <nav className="nav">
          <div className="logo">RIDDLEN</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#tokenomics">Tokenomics</a></li>
            <li><a href="#airdrop">Airdrop</a></li>
            <li><a href="https://riddlen.org" target="_blank">Play Now</a></li>
          </ul>
          <ConnectWallet />
        </nav>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-bg"></div>
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1>The Web3 Riddle Economy</h1>
                <div className="hero-subtitle">Where Human Intellect Powers the Blockchain</div>
                <div className="proof-of-solve">⚡ Proof-of-Solve Network</div>
                <p>Solve cryptographic riddles stored as NFTs to earn RDLN tokens. Join the world's first human-driven blockchain economy where your intelligence creates value.</p>
                
                <div className="grand-prize-banner">
                  <h3>🏆 Growing Grand Prize Wallet</h3>
                  <p>25% of every transaction automatically grows the ultimate jackpot</p>
                </div>
                
                <div className="cta-buttons">
                  <a href="https://riddlen.org" className="btn-primary" target="_blank">
                    <i className="fas fa-play"></i> Start Solving
                  </a>
                  <a href="#airdrop" className="btn-secondary btn-airdrop">
                    <i className="fas fa-gift"></i> Claim Airdrop
                  </a>
                </div>
                
                <div className="whitepaper-link">
                  <a href="#whitepaper" className="btn-tertiary">
                    <i className="fas fa-file-alt"></i> Read Whitepaper
                  </a>
                </div>
              </div>
              <div className="hero-visual">
                <div className="riddle-visual">
                  <div className="riddle-icon">🧩</div>
                  <div className="riddle-text">Solve • Earn • Burn</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="token-stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">1B</div>
                <div className="stat-label">Total Supply (Fixed)</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">700M</div>
                <div className="stat-label">Riddle Rewards Pool</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">1,000</div>
                <div className="stat-label">Total Riddles (20 Years)</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">50%</div>
                <div className="stat-label">Burned Per Transaction</div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="how-it-works">
          <div className="container">
            <h2 className="section-title">How Riddlen Works</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-icon"><i className="fas fa-coins"></i></div>
                <h3>Mint Riddle NFTs</h3>
                <p>Pay 1 RDLN to mint an NFT containing a cryptographic riddle. 50% is burned forever, 25% goes to Grand Prize, 25% to Treasury.</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-icon"><i className="fas fa-brain"></i></div>
                <h3>Solve the Puzzle</h3>
                <p>Use your intellect to crack the riddle. Each attempt costs 1 RDLN with the same burn/prize/treasury split.</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-icon"><i className="fas fa-trophy"></i></div>
                <h3>Earn Rewards</h3>
                <p>First solvers get the largest rewards from locked prize vaults. Unclaimed tokens remain locked until solved.</p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-icon"><i className="fas fa-fire"></i></div>
                <h3>Deflationary Growth</h3>
                <p>Every transaction burns tokens permanently while growing the Grand Prize jackpot and funding development.</p>
              </div>
              <div className="step-card">
                <div className="step-number">5</div>
                <div className="step-icon"><i className="fas fa-users"></i></div>
                <h3>Community Governance</h3>
                <p>Token holders vote on reward structures, Grand Prize unlocks, and platform expansion through DAO governance.</p>
              </div>
              <div className="step-card">
                <div className="step-number">6</div>
                <div className="step-icon"><i className="fas fa-infinity"></i></div>
                <h3>Sustainable Economy</h3>
                <p>With 1,000 riddles over 20 years and locked value mechanics, Riddlen creates long-term sustainable growth.</p>
              </div>
            </div>

            <div className="burn-mechanism">
              <h3>🔥 Deflationary Transaction Split</h3>
              <p>Every 1 RDLN spent (mint or attempt) is automatically split:</p>
              <div className="burn-split">
                <div className="burn-item">
                  <div className="percentage">50%</div>
                  <div className="label">Burned Forever</div>
                </div>
                <div className="burn-item">
                  <div className="percentage">25%</div>
                  <div className="label">Grand Prize</div>
                </div>
                <div className="burn-item">
                  <div className="percentage">25%</div>
                  <div className="label">Treasury</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tokenomics" className="tokenomics">
          <div className="container">
            <h2 className="section-title">Tokenomics</h2>
            <div className="tokenomics-grid">
              <div className="tokenomics-card">
                <h3>Riddle Rewards Pool</h3>
                <div className="percentage">70%</div>
                <p>700,000,000 RDLN locked in prize vaults across 1,000 riddles released over 20 years. Tokens remain locked until riddles are solved.</p>
              </div>
              <div className="tokenomics-card">
                <h3>Treasury Reserve</h3>
                <div className="percentage">10%</div>
                <p>100,000,000 RDLN time-locked with 1M monthly release (~8+ years runway). Funds development, operations, and platform growth.</p>
              </div>
              <div className="tokenomics-card">
                <h3>Community Airdrops</h3>
                <div className="percentage">10%</div>
                <p>100,000,000 RDLN distributed in waves to early adopters, contributors, and community members who help grow the ecosystem.</p>
              </div>
              <div className="tokenomics-card">
                <h3>Liquidity Pool</h3>
                <div className="percentage">10%</div>
                <p>100,000,000 RDLN paired with MATIC/CRO and locked for up to 10 years, ensuring permanent market depth and stability.</p>
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
                <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" aria-label="Discord"><i className="fab fa-discord"></i></a>
                <a href="#" aria-label="Telegram"><i className="fab fa-telegram"></i></a>
                <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
              </div>
            </div>
            <div className="footer-section">
              <h3>Platform</h3>
              <a href="https://riddlen.org" target="_blank">Play Riddles</a>
              <a href="#airdrop">Claim Airdrop</a>
              <a href="#whitepaper">Whitepaper</a>
              <a href="#tokenomics">Tokenomics</a>
              <a href="#how-it-works">How It Works</a>
            </div>
            <div className="footer-section">
              <h3>Community</h3>
              <a href="#">Discord Server</a>
              <a href="#">Telegram Group</a>
              <a href="#">Twitter Updates</a>
              <a href="#">GitHub Repository</a>
              <a href="#">DAO Governance</a>
            </div>
            <div className="footer-section">
              <h3>Resources</h3>
              <a href="#">Smart Contracts</a>
              <a href="#">Polygon Explorer</a>
              <a href="#">Liquidity Pools</a>
              <a href="#">Security Audits</a>
              <a href="#">Developer API</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Riddlen. The Web3 Riddle Economy. Built on Polygon with Proof-of-Solve.</p>
          </div>
        </div>
      </footer>

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

        .floating-riddles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
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

        .header {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(45deg, #FFD700, #FFA500, #FF6347);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
        }

        .nav-links a {
          color: #ffffff;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-links a:hover {
          color: #FFD700;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(45deg, #FFD700, #FF6347);
          transition: width 0.3s ease;
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 99, 71, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 165, 0, 0.05) 0%, transparent 50%);
          z-index: -1;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding: 8rem 0 4rem;
        }

        .hero-text h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: #FFD700;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .hero-text p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: #cccccc;
          line-height: 1.8;
        }

        .proof-of-solve {
          display: inline-block;
          background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 25px;
          padding: 0.5rem 1rem;
          margin: 1rem 0;
          font-weight: 600;
          color: #FFD700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .btn-primary {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
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
        }

        .btn-secondary:hover {
          background: rgba(255, 215, 0, 0.1);
          transform: translateY(-2px);
        }

        .btn-airdrop {
          background: linear-gradient(45deg, #FF6347, #FFD700);
          color: #000;
          border: none;
        }

        .btn-airdrop:hover {
          background: linear-gradient(45deg, #FF4500, #FFA500);
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(255, 99, 71, 0.4);
        }

        .whitepaper-link {
          margin-top: 1rem;
        }

        .btn-tertiary {
          background: transparent;
          color: #cccccc;
          padding: 0.8rem 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-tertiary:hover {
          background: rgba(255, 215, 0, 0.05);
          border-color: rgba(255, 215, 0, 0.3);
          color: #FFD700;
          transform: translateY(-1px);
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .riddle-visual {
          width: 300px;
          height: 300px;
          border-radius: 20px;
          background: linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
          border: 2px solid rgba(255, 215, 0, 0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: glow 4s ease-in-out infinite alternate;
          position: relative;
          backdrop-filter: blur(10px);
        }

        .riddle-visual::before {
          content: '';
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 25px;
          background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.2), transparent);
          animation: rotate 10s linear infinite;
          z-index: -1;
        }

        .riddle-icon {
          font-size: 4rem;
          color: #FFD700;
          margin-bottom: 1rem;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }

        .riddle-text {
          font-size: 1.2rem;
          font-weight: 600;
          color: #FFD700;
          text-align: center;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        @keyframes glow {
          from { box-shadow: 0 0 20px rgba(255, 215, 0, 0.2); }
          to { box-shadow: 0 0 40px rgba(255, 215, 0, 0.4); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .token-stats {
          padding: 4rem 0;
          background: rgba(0, 0, 0, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.4);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #FFD700;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }

        .stat-label {
          font-size: 1rem;
          color: #cccccc;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .how-it-works {
          padding: 6rem 0;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 3rem;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .step-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .step-card:hover {
          transform: translateY(-10px);
          border-color: rgba(255, 215, 0, 0.4);
          box-shadow: 0 20px 40px rgba(255, 215, 0, 0.1);
        }

        .step-number {
          position: absolute;
          top: -15px;
          left: 20px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .step-icon {
          font-size: 3rem;
          color: #FFD700;
          margin-bottom: 1rem;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }

        .step-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .step-card p {
          color: #cccccc;
          line-height: 1.6;
        }

        .burn-mechanism {
          background: linear-gradient(45deg, rgba(255, 99, 71, 0.1), rgba(255, 215, 0, 0.1));
          border: 2px solid rgba(255, 99, 71, 0.3);
          border-radius: 20px;
          padding: 2rem;
          margin: 2rem 0;
          text-align: center;
        }

        .burn-mechanism h3 {
          color: #FF6347;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .burn-split {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1rem;
        }

        .burn-item {
          text-align: center;
        }

        .burn-item .percentage {
          font-size: 1.5rem;
          font-weight: bold;
          color: #FF6347;
        }

        .burn-item .label {
          font-size: 0.9rem;
          color: #cccccc;
        }

        .tokenomics {
          padding: 6rem 0;
          background: rgba(0, 0, 0, 0.2);
        }

        .tokenomics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .tokenomics-card {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .tokenomics-card h3 {
          color: #FFD700;
          margin-bottom: 1rem;
          font-weight: 700;
          font-size: 1.3rem;
        }

        .tokenomics-card .percentage {
          font-size: 2rem;
          font-weight: 800;
          color: #FFD700;
          margin-bottom: 0.5rem;
        }

        .tokenomics-card p {
          color: #cccccc;
          line-height: 1.6;
        }

        .grand-prize-banner {
          background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 99, 71, 0.2));
          border: 2px solid rgba(255, 215, 0, 0.5);
          border-radius: 15px;
          padding: 1.5rem;
          margin: 2rem 0;
          text-align: center;
          animation: pulse 3s ease-in-out infinite;
        }

        .grand-prize-banner h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .grand-prize-banner p {
          color: #ffffff;
          font-size: 1.1rem;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
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

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }

          .hero-text h1 {
            font-size: 2.5rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .riddle-visual {
            width: 250px;
            height: 250px;
          }

          .burn-split {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
