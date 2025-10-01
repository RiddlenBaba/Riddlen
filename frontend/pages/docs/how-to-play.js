import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';
import Link from 'next/link';

export default function HowToPlay() {
  return (
    <>
      <Head>
        <title>How to Play - Riddlen Docs</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/how-to-play">
        <div className="docs-content">
          <h1 className="docs-title">How to Play Riddlen</h1>

          <div className="docs-highlight">
            <h3>🎮 Master the Art of Proof-of-Solve</h3>
            <p>Learn how to earn RDLN tokens through intelligent gameplay and riddle solving.</p>
          </div>

          <h2 className="section-title">Step-by-Step Guide</h2>
          <p className="section-description">
            Follow these steps to start your Proof-of-Solve journey and begin earning rewards.
          </p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon"><i className="fas fa-wallet"></i></div>
              <h3>Connect Wallet</h3>
              <p>Connect your MetaMask wallet to Polygon Amoy testnet. Get free testnet MATIC from the faucet.</p>
              <a href="https://faucet.polygon.technology/" target="_blank" className="btn-tertiary">
                <i className="fas fa-external-link-alt"></i> Get Testnet MATIC
              </a>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon"><i className="fas fa-coins"></i></div>
              <h3>Acquire RDLN</h3>
              <p>Get RDLN tokens from the airdrop or liquidity pools to start playing.</p>
              <Link href="/airdrop" className="btn-tertiary">
                <i className="fas fa-gift"></i> Claim Airdrop
              </Link>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon"><i className="fas fa-cube"></i></div>
              <h3>Mint Riddle NFT</h3>
              <p>Pay 1000 RDLN to mint an NFT containing a cryptographic riddle to solve.</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon"><i className="fas fa-brain"></i></div>
              <h3>Study & Solve</h3>
              <p>Analyze the riddle carefully. Failed attempts burn progressively (1st = 1 RDLN, 2nd = 2 RDLN, etc.).</p>
            </div>

            <div className="step-card">
              <div className="step-number">5</div>
              <div className="step-icon"><i className="fas fa-trophy"></i></div>
              <h3>Earn Rewards</h3>
              <p>First solvers receive the largest rewards based on your RON tier multiplier.</p>
            </div>

            <div className="step-card">
              <div className="step-number">6</div>
              <div className="step-icon"><i className="fas fa-level-up-alt"></i></div>
              <h3>Progress</h3>
              <p>Build RON reputation through solving to unlock higher reward tiers (0.5x → 2x).</p>
            </div>
          </div>

          <h2 className="section-title">🔥 Progressive Burn Protocol</h2>
          <div className="burn-mechanism">
            <h3>Failed Attempts Burn Progressively</h3>
            <div className="burn-split">
              <div className="burn-item">
                <div className="percentage">1st</div>
                <div className="label">1 RDLN Burned</div>
              </div>
              <div className="burn-item">
                <div className="percentage">2nd</div>
                <div className="label">2 RDLN Burned</div>
              </div>
              <div className="burn-item">
                <div className="percentage">Nth</div>
                <div className="label">N RDLN Burned</div>
              </div>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.95rem' }}>
              Minting fees accumulate as revenue (~20M RDLN over 20 years). Prize rewards come from the pre-allocated 700M RDLN pool. Only failed attempts create permanent burns.
            </p>
          </div>

          <h2 className="section-title">⚡ Anti-Cheat Protection</h2>
          <div className="security-grid">
            <div className="security-card">
              <div className="security-icon"><i className="fas fa-clock"></i></div>
              <h4>30-Second Cooldown</h4>
              <p>Prevents automation and bot attempts, ensuring human intelligence is required</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-user-check"></i></div>
              <h4>Wallet-Based Progress</h4>
              <p>Your RON tier and solve history is tied to your wallet address</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-shield-alt"></i></div>
              <h4>On-Chain Verification</h4>
              <p>All solves are recorded and verified transparently on Polygon blockchain</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-lock"></i></div>
              <h4>Immutable Riddles</h4>
              <p>Riddle content is stored on-chain and cannot be altered after minting</p>
            </div>
          </div>

          <h2 className="section-title">📊 RON Tier System</h2>
          <p className="section-description">
            Progress through four tiers by solving riddles. Higher tiers unlock better reward multipliers.
          </p>

          <div className="ron-tiers-grid">
            <div className="ron-tier newcomer">
              <div className="tier-icon">🌱</div>
              <h4>NEWCOMER</h4>
              <div className="tier-multiplier">0.5x rewards</div>
              <p>Starting tier</p>
            </div>

            <div className="ron-tier solver">
              <div className="tier-icon">🧩</div>
              <h4>SOLVER</h4>
              <div className="tier-multiplier">1.0x rewards</div>
              <p>10+ solves</p>
            </div>

            <div className="ron-tier expert">
              <div className="tier-icon">🎯</div>
              <h4>EXPERT</h4>
              <div className="tier-multiplier">1.5x rewards</div>
              <p>50+ solves</p>
            </div>

            <div className="ron-tier oracle">
              <div className="tier-icon">👑</div>
              <h4>ORACLE</h4>
              <div className="tier-multiplier">2.0x rewards</div>
              <p>100+ solves</p>
            </div>
          </div>

          <div className="grand-prize-banner">
            <h3>💡 Pro Strategy Tips</h3>
            <ul>
              <li><strong>Study first, attempt later:</strong> Failed attempts burn progressively (1st = 1 RDLN, 2nd = 2 RDLN, etc.)</li>
              <li><strong>Work on multiple riddles:</strong> Portfolio approach reduces risk</li>
              <li><strong>Join community:</strong> Discord discussions provide valuable hints</li>
              <li><strong>Think long-term:</strong> Some riddles may take weeks to solve</li>
              <li><strong>Track your RON:</strong> Build reputation to unlock better multipliers</li>
            </ul>
          </div>

          <div className="cta-buttons">
            <a href="/game" className="btn-primary">
              <i className="fas fa-gamepad"></i> Play Demo
            </a>
            <Link href="/docs/ron-reputation" className="btn-secondary">
              <i className="fas fa-chart-line"></i> Learn About RON Tiers
            </Link>
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
            margin-bottom: 1rem;
          }

          .btn-tertiary {
            background: transparent;
            color: #cccccc;
            padding: 0.6rem 1.2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.85rem;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }

          .btn-tertiary:hover {
            background: rgba(255, 215, 0, 0.05);
            border-color: rgba(255, 215, 0, 0.3);
            color: #FFD700;
            transform: translateY(-1px);
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

          .burn-mechanism p {
            color: #ffffff;
          }

          .ron-tiers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
          }

          .ron-tier {
            text-align: center;
            padding: 1.5rem;
            border-radius: 15px;
            transition: all 0.3s ease;
          }

          .ron-tier:hover {
            transform: translateY(-5px);
          }

          .ron-tier.newcomer {
            background: rgba(156, 163, 175, 0.1);
            border: 1px solid rgba(156, 163, 175, 0.2);
          }

          .ron-tier.solver {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.2);
          }

          .ron-tier.expert {
            background: rgba(147, 51, 234, 0.1);
            border: 1px solid rgba(147, 51, 234, 0.2);
          }

          .ron-tier.oracle {
            background: rgba(255, 215, 0, 0.1);
            border: 1px solid rgba(255, 215, 0, 0.2);
          }

          .tier-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }

          .ron-tier h4 {
            font-weight: 700;
            margin-bottom: 0.5rem;
          }

          .ron-tier.newcomer h4 { color: #9ca3af; }
          .ron-tier.solver h4 { color: #3b82f6; }
          .ron-tier.expert h4 { color: #9333ea; }
          .ron-tier.oracle h4 { color: #FFD700; }

          .tier-multiplier {
            font-size: 1.2rem;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 0.5rem;
          }

          .ron-tier p {
            font-size: 0.9rem;
            color: #cccccc;
          }

          .grand-prize-banner {
            background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 99, 71, 0.2));
            border: 2px solid rgba(255, 215, 0, 0.5);
            border-radius: 15px;
            padding: 1.5rem;
            margin: 2rem 0;
            text-align: left;
            animation: pulse 3s ease-in-out infinite;
          }

          .grand-prize-banner h3 {
            color: #FFD700;
            font-size: 1.8rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          .grand-prize-banner ul {
            list-style: none;
            padding: 0;
          }

          .grand-prize-banner li {
            color: #cccccc;
            margin: 0.5rem 0;
            padding-left: 0;
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

            .ron-tiers-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </DocsLayout>
    </>
  );
}