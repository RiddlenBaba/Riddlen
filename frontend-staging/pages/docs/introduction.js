import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';

export default function Introduction() {
  return (
    <>
      <Head>
        <title>Introduction - Riddlen Docs</title>
        <meta name="description" content="Learn about Riddlen, the Web3 riddle economy platform" />
      </Head>

      <DocsLayout currentPath="/docs/introduction">
        <div className="docs-content">
          <h1 className="docs-title">Welcome to Riddlen</h1>

          <div className="docs-highlight">
            <h3>🎯 Getting Started</h3>
            <p>The world's first Proof-of-Solve blockchain where human intellect powers decentralized finance through cryptographic riddles and NFT gaming.</p>
          </div>

          <div className="tokenomics-grid" style={{ marginBottom: '3rem' }}>
            <div className="tokenomics-card">
              <div className="step-icon"><i className="fas fa-puzzle-piece"></i></div>
              <h3>Solve Riddles</h3>
              <p>Mint riddle NFTs and use your intellect to solve cryptographic puzzles and earn RDLN tokens.</p>
            </div>

            <div className="tokenomics-card">
              <div className="step-icon"><i className="fas fa-fire"></i></div>
              <h3>Deflationary Economy</h3>
              <p>Every transaction burns 50% of tokens while growing the Grand Prize jackpot.</p>
            </div>
          </div>

          <h2 className="section-title">What is Riddlen?</h2>
          <p className="section-description">
            Riddlen transforms traditional crypto participation into a puzzle-based experience where <strong>your mind is your miner</strong>.
            Instead of energy-intensive proof-of-work or stake-based validation, Riddlen introduces <strong>Proof-of-Solve</strong> -
            a novel consensus mechanism powered by human intelligence.
          </p>

          <h2 className="section-title">🧠 Core Concept</h2>
          <div className="burn-mechanism">
            <h3>"Every riddle is an NFT. Every solution unlocks value. Every transaction burns supply."</h3>
            <p>This creates a sustainable economy where intellectual effort directly correlates to economic value.</p>
          </div>

          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Mint Riddle NFTs</h3>
              <p>Pay 1000 RDLN to mint an NFT containing a cryptographic riddle. Win from the 700M RDLN pre-allocated prize pool.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Solve Puzzles</h3>
              <p>Use your intellect to crack the riddle. Failed attempts burn progressively: 1st = 1 RDLN, 2nd = 2 RDLN, Nth = N RDLN.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Earn Rewards</h3>
              <p>First solvers get the largest rewards from locked prize vaults. Unclaimed tokens remain locked until solved.</p>
            </div>
          </div>

          <div className="security-grid" style={{ marginTop: '3rem' }}>
            <div className="security-card">
              <div className="security-icon"><i className="fas fa-bolt"></i></div>
              <h4>Proof-of-Solve Network</h4>
              <p>Unlike energy-intensive mining or capital-based staking, Riddlen's consensus relies on human cognitive abilities.</p>
            </div>
          </div>

          <h2 className="section-title">Why Riddlen?</h2>
          <div className="tokenomics-grid">
            <div className="tokenomics-card">
              <h4 style={{ color: '#FFD700', marginBottom: '1rem' }}><i className="fas fa-chart-line"></i> Sustainable Economics</h4>
              <p>Deflationary tokenomics with permanent supply reduction</p>
            </div>

            <div className="tokenomics-card">
              <h4 style={{ color: '#FFD700', marginBottom: '1rem' }}><i className="fas fa-brain"></i> Human-Centric</h4>
              <p>No energy waste, no capital requirements - just pure intellect</p>
            </div>

            <div className="tokenomics-card">
              <h4 style={{ color: '#FFD700', marginBottom: '1rem' }}><i className="fas fa-trophy"></i> Growing Rewards</h4>
              <p>Every transaction increases the ultimate Grand Prize jackpot</p>
            </div>

            <div className="tokenomics-card">
              <h4 style={{ color: '#FFD700', marginBottom: '1rem' }}><i className="fas fa-infinity"></i> Long-term Vision</h4>
              <p>1,000 riddles over 20 years ensures sustainable growth</p>
            </div>
          </div>

          <div className="grand-prize-banner">
            <h3>🚀 Ready to Start?</h3>
            <p>Begin your Proof-of-Solve journey today!</p>
          </div>

          <div className="cta-buttons">
            <a href="/docs/how-to-play" className="btn-primary">
              <i className="fas fa-book"></i> Learn How to Play
            </a>
            <a href="/game" className="btn-secondary">
              <i className="fas fa-gamepad"></i> Play Demo
            </a>
          </div>
        </div>

        <style jsx>{`
          .docs-content {
            max-width: 900px;
            margin: 0 auto;
          }

          .docs-title {
            text-align: center;
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 2rem;
            background: linear-gradient(45deg, #ffffff, #FFD700);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .docs-highlight {
            background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 99, 71, 0.2));
            border: 2px solid rgba(255, 215, 0, 0.5);
            border-radius: 15px;
            padding: 1.5rem;
            margin: 2rem 0;
            text-align: center;
            animation: pulse 3s ease-in-out infinite;
          }

          .docs-highlight h3 {
            color: #FFD700;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
          }

          .docs-highlight p {
            color: #ffffff;
            font-size: 1.1rem;
          }

          .section-title {
            font-size: 2.2rem;
            font-weight: 800;
            margin: 3rem 0 1rem;
            background: linear-gradient(45deg, #ffffff, #FFD700);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .section-description {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            color: #cccccc;
            line-height: 1.8;
          }

          .tokenomics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
          }

          .tokenomics-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            text-align: center;
          }

          .tokenomics-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 215, 0, 0.4);
          }

          .tokenomics-card h3, .tokenomics-card h4 {
            color: #ffffff;
            font-weight: 700;
            font-size: 1.2rem;
          }

          .tokenomics-card p {
            color: #cccccc;
            line-height: 1.6;
          }

          .steps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
          }

          .step-card {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            padding: 2rem;
            transition: all 0.3s ease;
            position: relative;
            text-align: center;
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

          .security-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
          }

          .security-card {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 15px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
          }

          .security-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 215, 0, 0.4);
          }

          .security-icon {
            font-size: 2rem;
            color: #FFD700;
            margin-bottom: 1rem;
          }

          .security-card h4 {
            color: #ffffff;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }

          .security-card p {
            color: #cccccc;
            font-size: 0.9rem;
            line-height: 1.5;
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
            color: #FFD700;
            margin-bottom: 1rem;
            font-size: 1.5rem;
            font-style: italic;
          }

          .burn-mechanism p {
            color: #ffffff;
            font-size: 1.1rem;
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
            margin-bottom: 1rem;
          }

          .grand-prize-banner p {
            color: #ffffff;
            font-size: 1.1rem;
          }

          .cta-buttons {
            display: flex;
            gap: 1rem;
            margin: 3rem 0;
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
            color: #000;
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
            color: #FFD700;
          }

          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
            50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
          }

          @media (max-width: 768px) {
            .docs-title {
              font-size: 2.2rem;
            }

            .section-title {
              font-size: 1.8rem;
            }

            .steps-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </DocsLayout>
    </>
  );
}