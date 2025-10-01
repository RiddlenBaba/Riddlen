import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';
import Link from 'next/link';

export default function NFTMechanics() {
  return (
    <>
      <Head>
        <title>NFT Mechanics - Riddlen Docs</title>
        <meta name="description" content="How Riddlen NFTs work" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/nft-mechanics">
        <div className="docs-content">
          <h1 className="docs-title">Riddle NFT Mechanics</h1>

          <div className="docs-highlight">
            <h3><i className="fas fa-cube"></i> ERC-721 Riddle NFTs</h3>
            <p>Every riddle is a unique, tradeable NFT with on-chain properties and tiered reward mechanics</p>
          </div>

          <h2 className="section-title">NFT Structure</h2>
          <p className="section-description">
            Each Riddle NFT is a complete on-chain puzzle system with built-in reward distribution.
          </p>

          <div className="security-grid">
            <div className="security-card">
              <div className="security-icon"><i className="fas fa-file-code"></i></div>
              <h4>Riddle Content</h4>
              <p>The puzzle itself (encrypted on-chain)</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-signal"></i></div>
              <h4>Difficulty Level</h4>
              <p>EASY, MEDIUM, HARD, ORACLE</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-coins"></i></div>
              <h4>Prize Pool</h4>
              <p>Accumulated rewards for solvers</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-history"></i></div>
              <h4>Solver History</h4>
              <p>List of all successful solvers</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-clock"></i></div>
              <h4>Creation Time</h4>
              <p>When the riddle was minted</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-chart-line"></i></div>
              <h4>Tier Progress</h4>
              <p>Track reward multiplier stages</p>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-layer-group"></i> Tiered Reward System</h2>
          <p className="section-description">
            Revolutionary tiered distribution rewards early solvers while ensuring late participants still benefit.
          </p>

          <div className="tokenomics-grid">
            <div className="tokenomics-card">
              <div className="step-icon"><i className="fas fa-trophy"></i></div>
              <h3>First 25%</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981', margin: '1rem 0' }}>2.0x</div>
              <p>Early solver bonus - Double rewards for being first</p>
            </div>

            <div className="tokenomics-card">
              <div className="step-icon"><i className="fas fa-equals"></i></div>
              <h3>Middle 50%</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6', margin: '1rem 0' }}>1.0x</div>
              <p>Standard rewards for mid-range solvers</p>
            </div>

            <div className="tokenomics-card">
              <div className="step-icon"><i className="fas fa-hourglass-half"></i></div>
              <h3>Last 25%</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#f59e0b', margin: '1rem 0' }}>0.5x</div>
              <p>Late solver rewards - Still profitable to solve</p>
            </div>
          </div>

          <h2 className="section-title">Minting Process</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon"><i className="fas fa-dollar-sign"></i></div>
              <h3>Pay Mint Fee</h3>
              <p>Current era cost (starts at 1000 RDLN, halves biennially)</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon"><i className="fas fa-sliders-h"></i></div>
              <h3>Choose Difficulty</h3>
              <p>Based on your RON tier and experience</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon"><i className="fas fa-gift"></i></div>
              <h3>Set Prize Pool</h3>
              <p>Optionally add bonus rewards to attract solvers</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon"><i className="fas fa-certificate"></i></div>
              <h3>Receive NFT</h3>
              <p>Get your unique Riddle NFT token ID</p>
            </div>
          </div>

          <h2 className="section-title">Solving Mechanics</h2>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}><i className="fas fa-shield-alt"></i> Anti-Cheat System</h3>
          <p className="section-description">
            To prevent automated solving and ensure fair play, Riddlen implements multiple security layers.
          </p>

          <div className="security-grid">
            <div className="security-card">
              <div className="security-icon"><i className="fas fa-stopwatch"></i></div>
              <h4>30-Second Delay</h4>
              <p>Minimum time between solve attempts prevents brute force</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-coins"></i></div>
              <h4>Progressive Burns</h4>
              <p>Failed attempts burn progressively (1, 2, 3... N RDLN) - think before you try</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-user-shield"></i></div>
              <h4>RON Requirements</h4>
              <p>Higher difficulties need reputation tokens</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-robot"></i></div>
              <h4>Bot Protection</h4>
              <p>On-chain verification prevents automation</p>
            </div>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}><i className="fas fa-check-circle"></i> Solution Verification</h3>
          <div className="burn-mechanism">
            <h3>When you submit a solution:</h3>
            <div style={{ textAlign: 'left', marginTop: '1.5rem' }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ margin: '1rem 0', color: '#ffffff' }}>
                  <i className="fas fa-check" style={{ color: '#10b981', marginRight: '0.5rem' }}></i>
                  <strong>Answer is hashed</strong> and compared on-chain
                </li>
                <li style={{ margin: '1rem 0', color: '#ffffff' }}>
                  <i className="fas fa-check" style={{ color: '#10b981', marginRight: '0.5rem' }}></i>
                  <strong>If correct</strong>, rewards are calculated based on your position
                </li>
                <li style={{ margin: '1rem 0', color: '#ffffff' }}>
                  <i className="fas fa-check" style={{ color: '#10b981', marginRight: '0.5rem' }}></i>
                  <strong>RON tokens are minted</strong> to increase your tier
                </li>
                <li style={{ margin: '1rem 0', color: '#ffffff' }}>
                  <i className="fas fa-check" style={{ color: '#10b981', marginRight: '0.5rem' }}></i>
                  <strong>NFT is updated</strong> with solver information
                </li>
              </ul>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-exchange-alt"></i> NFT Ownership</h2>
          <div className="grand-prize-banner">
            <h3>Trading & Value</h3>
            <p>Riddle NFTs can be freely traded on NFT marketplaces, but remember:</p>
            <ul>
              <li><strong>Owning ≠ Solving:</strong> NFT ownership doesn't give you the solution</li>
              <li><strong>Value in Speed:</strong> The real value is being first to solve and claim rewards</li>
              <li><strong>Collectible Aspect:</strong> Solved riddles become historical proof of intelligence</li>
              <li><strong>Prize Pool Visible:</strong> You can see remaining rewards before buying</li>
            </ul>
          </div>

          <div className="cta-buttons">
            <Link href="/docs/burning-protocol" className="btn-primary">
              <i className="fas fa-fire"></i> Burning Protocol
            </Link>
            <Link href="/docs/ron-reputation" className="btn-secondary">
              <i className="fas fa-medal"></i> RON System
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

          .step-card h3, .tokenomics-card h3 {
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #ffffff;
          }

          .step-card p, .tokenomics-card p {
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

          .grand-prize-banner p {
            color: #ffffff;
            font-size: 1.1rem;
            text-align: center;
            margin-bottom: 1rem;
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
          }
        `}</style>
      </DocsLayout>
    </>
  );
}