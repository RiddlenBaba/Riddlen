import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';
import Link from 'next/link';

export default function Tokenomics() {
  return (
    <>
      <Head>
        <title>Tokenomics - Riddlen Docs</title>
        <meta name="description" content="Understanding RDLN and RON token economics" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/tokenomics">
        <div className="docs-content">
          <h1 className="docs-title">Riddlen Tokenomics</h1>

          <div className="docs-highlight">
            <h3><i className="fas fa-coins"></i> Dual-Token Economy</h3>
            <p>RDLN utility token with deflationary mechanics + RON soul-bound reputation system</p>
          </div>

          <h2 className="section-title">Token Overview</h2>
          <div className="tokenomics-grid">
            <div className="tokenomics-card">
              <div className="step-icon"><i className="fas fa-coins"></i></div>
              <h3>RDLN Token</h3>
              <p>Primary utility token with integrated burn mechanics and biennial halving schedule</p>
            </div>

            <div className="tokenomics-card">
              <div className="step-icon"><i className="fas fa-medal"></i></div>
              <h3>RON Token</h3>
              <p>Soul-bound reputation tokens for merit-based access control and governance</p>
            </div>
          </div>

          <h2 className="section-title">RDLN Token Economics</h2>
          <p className="section-description">
            The Riddlen ecosystem is powered by RDLN, an ERC-20 token with deflationary mechanics that create permanent scarcity.
          </p>

          <div className="burn-mechanism">
            <h3>Total Supply: 1,000,000,000 RDLN</h3>
            <p>Fixed supply with continuous deflationary pressure through gameplay</p>
          </div>

          <h2 className="section-title">Allocation Structure</h2>
          <div className="tokenomics-grid">
            <div className="tokenomics-card">
              <h4 style={{ color: '#FFD700', marginBottom: '1rem' }}><i className="fas fa-trophy"></i> Prize Pool</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: '1rem 0' }}>700M</div>
              <p>70% - Weekly riddle winner rewards distributed over 20 years</p>
            </div>

            <div className="tokenomics-card">
              <h4 style={{ color: '#FFD700', marginBottom: '1rem' }}><i className="fas fa-vault"></i> Treasury</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: '1rem 0' }}>100M</div>
              <p>10% - Development & operations (1M RDLN monthly releases)</p>
            </div>

            <div className="tokenomics-card">
              <h4 style={{ color: '#FFD700', marginBottom: '1rem' }}><i className="fas fa-gift"></i> Airdrop</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: '1rem 0' }}>100M</div>
              <p>10% - Community rewards and early adoption incentives</p>
            </div>

            <div className="tokenomics-card">
              <h4 style={{ color: '#FFD700', marginBottom: '1rem' }}><i className="fas fa-water"></i> Liquidity</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: '1rem 0' }}>100M</div>
              <p>10% - DEX liquidity pools and market stability</p>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-fire"></i> Deflationary Mechanisms</h2>
          <p className="section-description">
            Riddlen's progressive burn protocol creates permanent scarcity through failed solving attempts, while pre-allocated pools fund prizes and operations.
          </p>

          <div className="burn-mechanism">
            <h3>Progressive Burn Protocol</h3>
            <div className="burn-split">
              <div className="burn-item">
                <div className="percentage">1st Failed</div>
                <div className="label"><i className="fas fa-fire"></i> 1 RDLN Burned</div>
              </div>
              <div className="burn-item">
                <div className="percentage">2nd Failed</div>
                <div className="label"><i className="fas fa-fire"></i> 2 RDLN Burned</div>
              </div>
              <div className="burn-item">
                <div className="percentage">Nth Failed</div>
                <div className="label"><i className="fas fa-fire"></i> N RDLN Burned</div>
              </div>
            </div>
            <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.95rem' }}>
              Minting fees accumulate as revenue. Prize pool is pre-allocated (700M RDLN). Only failed attempts create permanent burns (~650K RDLN over 20 years).
            </p>
          </div>

          <h2 className="section-title">Biennial Halving Schedule</h2>
          <p className="section-description">
            NFT minting costs follow a Bitcoin-inspired halving schedule over 20 years, creating predictable scarcity.
          </p>

          <div className="security-grid">
            <div className="security-card">
              <div className="security-icon"><i className="fas fa-calendar-alt"></i></div>
              <h4>Years 1-2</h4>
              <p>1,000 RDLN per riddle</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-calendar-alt"></i></div>
              <h4>Years 3-4</h4>
              <p>500 RDLN per riddle</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-calendar-alt"></i></div>
              <h4>Years 5-6</h4>
              <p>250 RDLN per riddle</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-calendar-alt"></i></div>
              <h4>Years 7-8</h4>
              <p>125 RDLN per riddle</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-ellipsis-h"></i></div>
              <h4>Continues...</h4>
              <p>Halving every 2 years</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-flag-checkered"></i></div>
              <h4>Years 19-20</h4>
              <p>1.5 RDLN minimum</p>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-chart-line"></i> Grand Prize System</h2>
          <div className="grand-prize-banner">
            <h3>Legendary Riddle Events</h3>
            <p>The Grand Prize system uses pre-allocated funds from the 700M RDLN prize pool, creating massive quarterly and annual jackpots:</p>
            <ul>
              <li><strong>Pre-allocated prize pool</strong> of 700M RDLN distributed over 1,000 riddles</li>
              <li><strong>Quarterly events</strong> with ultra-hard legendary riddles (1,000-10,000 RON rewards)</li>
              <li><strong>Multi-signature security</strong> with 4-of-5 required signatures for Grand Prize vault</li>
              <li><strong>Legendary prizes</strong> up to 10M RDLN for winner-takes-all challenges</li>
            </ul>
          </div>

          <h2 className="section-title">RON Reputation System</h2>
          <p className="section-description">
            RON tokens are soul-bound (non-transferable) reputation earned through solving riddles, unlocking higher reward multipliers.
          </p>

          <div className="ron-tiers-grid">
            <div className="ron-tier newcomer">
              <div className="tier-icon">🌱</div>
              <h4>NEWCOMER</h4>
              <div className="tier-multiplier">0.5x rewards</div>
              <p>Starting tier • 0 RON</p>
            </div>

            <div className="ron-tier solver">
              <div className="tier-icon">🧩</div>
              <h4>SOLVER</h4>
              <div className="tier-multiplier">1.0x rewards</div>
              <p>10+ riddles solved</p>
            </div>

            <div className="ron-tier expert">
              <div className="tier-icon">🎯</div>
              <h4>EXPERT</h4>
              <div className="tier-multiplier">1.5x rewards</div>
              <p>50+ riddles solved</p>
            </div>

            <div className="ron-tier oracle">
              <div className="tier-icon">👑</div>
              <h4>ORACLE</h4>
              <div className="tier-multiplier">2.0x rewards</div>
              <p>100+ riddles solved</p>
            </div>
          </div>

          <h2 className="section-title">RON Benefits</h2>
          <div className="security-grid">
            <div className="security-card">
              <div className="security-icon"><i className="fas fa-chart-line"></i></div>
              <h4>Increased Rewards</h4>
              <p>Higher multipliers on all solved riddles (up to 2x for Oracles)</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-lock-open"></i></div>
              <h4>Access Control</h4>
              <p>Unlock harder riddles with larger prize pools</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-vote-yea"></i></div>
              <h4>Governance Rights</h4>
              <p>Vote on platform decisions and feature development</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-star"></i></div>
              <h4>Status Recognition</h4>
              <p>Visible proof of problem-solving ability</p>
            </div>
          </div>

          <div className="cta-buttons">
            <Link href="/docs/burning-protocol" className="btn-primary">
              <i className="fas fa-fire"></i> Learn About Burning
            </Link>
            <Link href="/docs/ron-reputation" className="btn-secondary">
              <i className="fas fa-medal"></i> RON System Details
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

          .step-icon {
            font-size: 3rem;
            color: #FFD700;
            margin-bottom: 1rem;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
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

          .burn-mechanism p {
            color: #ffffff;
            font-size: 1.1rem;
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
            font-size: 2rem;
            font-weight: bold;
            color: #FF6347;
          }

          .burn-item .label {
            font-size: 0.9rem;
            color: #cccccc;
            margin-top: 0.5rem;
          }

          .security-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

            .tokenomics-grid {
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