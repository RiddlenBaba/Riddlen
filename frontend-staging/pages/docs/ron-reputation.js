import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';
import Link from 'next/link';

export default function RONReputation() {
  return (
    <>
      <Head>
        <title>RON Reputation System - Riddlen Docs</title>
        <meta name="description" content="Understanding the Reputation of Novelty tier system" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/ron-reputation">
        <div className="docs-content">
          <h1 className="docs-title">RON Reputation System</h1>

          <div className="docs-highlight">
            <h3><i className="fas fa-medal"></i> Merit-Based Progression</h3>
            <p>RON (Reputation of Novelty) rewards consistent problem-solving with increased multipliers and access to harder riddles</p>
          </div>

          <h2 className="section-title">The Four Tiers</h2>
          <p className="section-description">
            Progress through four reputation tiers, each unlocking better rewards and harder riddles. Your tier is determined by total RON tokens earned.
          </p>

          <div className="tokenomics-grid">
            <div className="tokenomics-card tier-newcomer">
              <div className="tier-emoji">🌱</div>
              <h3>NEWCOMER</h3>
              <div className="multiplier">0.5x</div>
              <div className="tier-stats">
                <div className="stat-item">
                  <div className="stat-label">RON Required</div>
                  <div className="stat-value">0 RON</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Riddles Solved</div>
                  <div className="stat-value">0+</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Access Level</div>
                  <div className="stat-value">EASY riddles only</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Reward Multiplier</div>
                  <div className="stat-value">50% of base rewards</div>
                </div>
              </div>
            </div>

            <div className="tokenomics-card tier-solver">
              <div className="tier-emoji">🧩</div>
              <h3>SOLVER</h3>
              <div className="multiplier solver-color">1.0x</div>
              <div className="tier-stats">
                <div className="stat-item">
                  <div className="stat-label">RON Required</div>
                  <div className="stat-value">10+ RON</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Riddles Solved</div>
                  <div className="stat-value">10+</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Access Level</div>
                  <div className="stat-value">EASY + MEDIUM</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Reward Multiplier</div>
                  <div className="stat-value">100% of base rewards</div>
                </div>
              </div>
            </div>

            <div className="tokenomics-card tier-expert">
              <div className="tier-emoji">🎯</div>
              <h3>EXPERT</h3>
              <div className="multiplier expert-color">1.5x</div>
              <div className="tier-stats">
                <div className="stat-item">
                  <div className="stat-label">RON Required</div>
                  <div className="stat-value">50+ RON</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Riddles Solved</div>
                  <div className="stat-value">50+</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Access Level</div>
                  <div className="stat-value">EASY + MEDIUM + HARD</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Reward Multiplier</div>
                  <div className="stat-value">150% of base rewards</div>
                </div>
              </div>
            </div>

            <div className="tokenomics-card tier-oracle">
              <div className="tier-emoji">👑</div>
              <h3>ORACLE</h3>
              <div className="multiplier oracle-color">2.0x</div>
              <div className="tier-stats">
                <div className="stat-item">
                  <div className="stat-label">RON Required</div>
                  <div className="stat-value">100+ RON</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Riddles Solved</div>
                  <div className="stat-value">100+</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Access Level</div>
                  <div className="stat-value">All + Governance</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Reward Multiplier</div>
                  <div className="stat-value">200% of base rewards</div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-chart-line"></i> How to Earn RON</h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon"><i className="fas fa-puzzle-piece"></i></div>
              <h3>Solve Riddles</h3>
              <p>Earn 1 RON per riddle solved, with difficulty bonuses for harder challenges</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon"><i className="fas fa-bolt"></i></div>
              <h3>Speed Bonus</h3>
              <p>Faster solves may earn additional RON tokens as a performance reward</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon"><i className="fas fa-trophy"></i></div>
              <h3>Difficulty Bonus</h3>
              <p>HARD and EXPERT riddles award more RON than EASY riddles</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon"><i className="fas fa-level-up-alt"></i></div>
              <h3>Tier Up</h3>
              <p>Accumulate RON to unlock higher tiers and better multipliers</p>
            </div>
          </div>

          <h2 className="section-title">Progression Path</h2>
          <div className="burn-mechanism">
            <h3>Your Journey from Newcomer to Oracle</h3>
            <div className="progression-path">
              <div className="progression-step">
                <div className="progression-icon">🌱</div>
                <div className="progression-details">
                  <h4>Start as NEWCOMER</h4>
                  <p>Begin solving EASY riddles (0.5x rewards)</p>
                </div>
              </div>
              <div className="progression-arrow"><i className="fas fa-arrow-down"></i></div>

              <div className="progression-step">
                <div className="progression-icon">🧩</div>
                <div className="progression-details">
                  <h4>Reach SOLVER (10 RON)</h4>
                  <p>Unlock MEDIUM riddles (1.0x rewards)</p>
                </div>
              </div>
              <div className="progression-arrow"><i className="fas fa-arrow-down"></i></div>

              <div className="progression-step">
                <div className="progression-icon">🎯</div>
                <div className="progression-details">
                  <h4>Achieve EXPERT (50 RON)</h4>
                  <p>Unlock HARD riddles (1.5x rewards)</p>
                </div>
              </div>
              <div className="progression-arrow"><i className="fas fa-arrow-down"></i></div>

              <div className="progression-step">
                <div className="progression-icon">👑</div>
                <div className="progression-details">
                  <h4>Become ORACLE (100 RON)</h4>
                  <p>Unlock governance + legendary riddles (2.0x rewards)</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-star"></i> Benefits of Higher Tiers</h2>

          <div className="security-grid">
            <div className="security-card">
              <div className="security-icon"><i className="fas fa-coins"></i></div>
              <h4>Increased Rewards</h4>
              <p>An ORACLE earns 4x more than a NEWCOMER for solving the same riddle!</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-unlock"></i></div>
              <h4>Harder Riddles</h4>
              <p>Access to more difficult riddles with larger prize pools</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-vote-yea"></i></div>
              <h4>Governance Rights</h4>
              <p>ORACLE tier grants voting power on platform decisions</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-certificate"></i></div>
              <h4>Status Recognition</h4>
              <p>Your tier is visible to the community, showcasing your prowess</p>
            </div>
          </div>

          <h2 className="section-title">RON Token Properties</h2>
          <div className="grand-prize-banner">
            <h3><i className="fas fa-lock"></i> Soul-Bound Tokens</h3>
            <p>RON tokens are non-transferable and permanently bound to your wallet</p>
            <ul>
              <li><strong>Non-transferable:</strong> Cannot be sold or traded</li>
              <li><strong>Wallet-bound:</strong> Tied to your address forever</li>
              <li><strong>Merit-only:</strong> Only earned through solving riddles</li>
              <li><strong>Anti-pay-to-win:</strong> Prevents "buying" your way to higher tiers</li>
              <li><strong>True reputation:</strong> Genuine proof of problem-solving ability</li>
            </ul>
          </div>

          <h2 className="section-title"><i className="fas fa-code"></i> Smart Contract Functions</h2>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Check Your Tier</h3>
          <div className="code-example">
            <pre><code>{`const tier = await ronContract.getUserTier(userAddress);
// Returns: 0 (NEWCOMER), 1 (SOLVER), 2 (EXPERT), 3 (ORACLE)`}</code></pre>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Check Your RON Balance</h3>
          <div className="code-example">
            <pre><code>{`const balance = await ronContract.balanceOf(userAddress);
// Returns: Total RON tokens earned`}</code></pre>
          </div>

          <h2 className="section-title">Example Progression</h2>
          <div className="table-container">
            <table className="progression-table">
              <thead>
                <tr>
                  <th>Riddles Solved</th>
                  <th>RON Earned</th>
                  <th>Tier Reached</th>
                  <th>Reward Multiplier</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0-9</td>
                  <td>0-9 RON</td>
                  <td><span className="tier-badge newcomer-badge">NEWCOMER</span></td>
                  <td>0.5x</td>
                </tr>
                <tr>
                  <td>10-49</td>
                  <td>10-49 RON</td>
                  <td><span className="tier-badge solver-badge">SOLVER</span></td>
                  <td>1.0x</td>
                </tr>
                <tr>
                  <td>50-99</td>
                  <td>50-99 RON</td>
                  <td><span className="tier-badge expert-badge">EXPERT</span></td>
                  <td>1.5x</td>
                </tr>
                <tr>
                  <td>100+</td>
                  <td>100+ RON</td>
                  <td><span className="tier-badge oracle-badge">ORACLE</span></td>
                  <td>2.0x</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="cta-buttons">
            <Link href="/game" className="btn-primary">
              <i className="fas fa-play"></i> Start Solving Riddles
            </Link>
            <Link href="/docs/tokenomics" className="btn-secondary">
              <i className="fas fa-coins"></i> View Tokenomics
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

          .tier-newcomer {
            background: linear-gradient(135deg, rgba(156, 163, 175, 0.1), rgba(107, 114, 128, 0.05));
            border-color: rgba(156, 163, 175, 0.3);
          }

          .tier-newcomer:hover {
            border-color: rgba(156, 163, 175, 0.5);
          }

          .tier-solver {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
            border-color: rgba(59, 130, 246, 0.3);
          }

          .tier-solver:hover {
            border-color: rgba(59, 130, 246, 0.5);
          }

          .tier-expert {
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.05));
            border-color: rgba(168, 85, 247, 0.3);
          }

          .tier-expert:hover {
            border-color: rgba(168, 85, 247, 0.5);
          }

          .tier-oracle {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
            border-color: rgba(255, 215, 0, 0.3);
          }

          .tier-oracle:hover {
            border-color: rgba(255, 215, 0, 0.5);
          }

          .tier-emoji {
            font-size: 4rem;
            margin-bottom: 1rem;
          }

          .multiplier {
            font-size: 3rem;
            font-weight: bold;
            color: #9ca3af;
            margin: 1rem 0;
          }

          .solver-color {
            color: #3b82f6;
          }

          .expert-color {
            color: #a855f7;
          }

          .oracle-color {
            color: #FFD700;
          }

          .tier-stats {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 1.5rem;
          }

          .stat-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .stat-item:last-child {
            border-bottom: none;
          }

          .stat-label {
            font-size: 0.8rem;
            color: #9ca3af;
          }

          .stat-value {
            font-size: 0.9rem;
            color: #ffffff;
            font-weight: 600;
          }

          .tokenomics-card h3 {
            color: #ffffff;
            font-weight: 700;
            font-size: 1.4rem;
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
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
          }

          .progression-path {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }

          .progression-step {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 15px;
            padding: 1.5rem;
            width: 100%;
            max-width: 500px;
            transition: all 0.3s ease;
          }

          .progression-step:hover {
            transform: translateX(10px);
          }

          .progression-icon {
            font-size: 3rem;
            flex-shrink: 0;
          }

          .progression-details {
            text-align: left;
          }

          .progression-details h4 {
            color: #FFD700;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
          }

          .progression-details p {
            color: #cccccc;
            font-size: 0.9rem;
          }

          .progression-arrow {
            color: #FFD700;
            font-size: 2rem;
            margin: 0.5rem 0;
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

          .code-example {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 15px;
            padding: 1.5rem;
            margin: 1.5rem 0;
            overflow-x: auto;
          }

          .code-example pre {
            margin: 0;
          }

          .code-example code {
            color: #10b981;
            font-size: 0.9rem;
            line-height: 1.6;
            font-family: 'Courier New', monospace;
          }

          .table-container {
            overflow-x: auto;
            margin: 2rem 0;
          }

          .progression-table {
            width: 100%;
            border-collapse: collapse;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 15px;
            overflow: hidden;
          }

          .progression-table thead {
            background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
          }

          .progression-table th {
            color: #FFD700;
            font-weight: 700;
            padding: 1rem;
            text-align: left;
            border-bottom: 2px solid rgba(255, 215, 0, 0.3);
          }

          .progression-table td {
            color: #ffffff;
            padding: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .progression-table tbody tr:hover {
            background: rgba(255, 215, 0, 0.05);
          }

          .tier-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 600;
            display: inline-block;
          }

          .newcomer-badge {
            background: rgba(156, 163, 175, 0.2);
            color: #9ca3af;
          }

          .solver-badge {
            background: rgba(59, 130, 246, 0.2);
            color: #3b82f6;
          }

          .expert-badge {
            background: rgba(168, 85, 247, 0.2);
            color: #a855f7;
          }

          .oracle-badge {
            background: rgba(255, 215, 0, 0.2);
            color: #FFD700;
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

            .steps-grid {
              grid-template-columns: 1fr;
            }

            .progression-table {
              font-size: 0.85rem;
            }

            .progression-table th,
            .progression-table td {
              padding: 0.75rem 0.5rem;
            }
          }
        `}</style>
      </DocsLayout>
    </>
  );
}