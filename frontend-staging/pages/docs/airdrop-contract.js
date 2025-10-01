import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';
import Link from 'next/link';

export default function AirdropContract() {
  return (
    <>
      <Head>
        <title>Airdrop Contract - Riddlen Docs</title>
        <meta name="description" content="Two-phase airdrop distribution system" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/airdrop-contract">
        <div className="docs-content">
          <h1 className="docs-title">Riddlen Airdrop Contract</h1>

          <div className="docs-highlight">
            <h3><i className="fas fa-gift"></i> Active Airdrop</h3>
            <p>Two-phase distribution system rewarding early community members and RON holders</p>
          </div>

          <div className="grand-prize-banner">
            <h3><i className="fas fa-address-card"></i> Contract Address</h3>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.9rem', color: '#cccccc', marginBottom: '0.5rem' }}>Polygon Amoy Testnet:</div>
              <code style={{ color: '#10b981', fontSize: '0.9rem' }}>0x330275259AfCeC8822A861ecbbdfD026dB1B0A13</code>
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Total Funded</div>
                  <div style={{ fontSize: '1.2rem', color: '#FFD700', fontWeight: 'bold' }}>51,000,000 RDLN</div>
                </div>
                <a
                  href="https://amoy.polygonscan.com/address/0x330275259AfCeC8822A861ecbbdfD026dB1B0A13"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#FFD700', fontSize: '1.5rem' }}
                >
                  <i className="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-list-ol"></i> Two-Phase Distribution</h2>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Phase 1: Social Proof (ACTIVE)</h3>
          <div className="burn-mechanism">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              <i className="fas fa-check-circle"></i> Active Now
            </div>
            <h4 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Community Engagement Rewards</h4>

            <div className="tokenomics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '1.5rem' }}>
              <div className="tokenomics-card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>10,000 RDLN</div>
                <p style={{ color: '#cccccc', fontSize: '0.9rem', marginTop: '0.5rem' }}>Per wallet</p>
              </div>
              <div className="tokenomics-card" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.05))', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#a855f7' }}>5,000 wallets</div>
                <p style={{ color: '#cccccc', fontSize: '0.9rem', marginTop: '0.5rem' }}>Maximum participants</p>
              </div>
            </div>

            <h5 style={{ color: '#FFD700', fontWeight: '700', marginBottom: '1rem' }}>Requirements:</h5>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
              <li style={{ color: '#cccccc', margin: '0.5rem 0' }}>✅ Follow <a href="https://twitter.com/RiddlenToken" target="_blank" style={{ color: '#FFD700', textDecoration: 'underline' }}>@RiddlenToken</a> on Twitter</li>
              <li style={{ color: '#cccccc', margin: '0.5rem 0' }}>✅ Join <a href="https://t.me/RiddlenCommunity" target="_blank" style={{ color: '#FFD700', textDecoration: 'underline' }}>Riddlen Community</a> on Telegram</li>
              <li style={{ color: '#cccccc', margin: '0.5rem 0' }}>✅ Star <a href="https://github.com/RiddlenBaba/Riddlen" target="_blank" style={{ color: '#FFD700', textDecoration: 'underline' }}>Riddlen GitHub</a> repository</li>
              <li style={{ color: '#cccccc', margin: '0.5rem 0' }}>✅ Submit social proof to blockchain</li>
              <li style={{ color: '#cccccc', margin: '0.5rem 0' }}>✅ Wait for admin verification</li>
              <li style={{ color: '#cccccc', margin: '0.5rem 0' }}>✅ Claim your 10,000 RDLN tokens</li>
            </ul>

            <Link href="/airdrop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', padding: '1rem 2rem', background: 'linear-gradient(45deg, #10b981, #059669)', color: '#000', borderRadius: '50px', textDecoration: 'none', fontWeight: '600', transition: 'all 0.3s ease' }}>
              Participate in Phase 1 <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Phase 2: Merit-Based (Coming Soon)</h3>
          <div className="burn-mechanism" style={{ background: 'linear-gradient(45deg, rgba(156, 163, 175, 0.1), rgba(107, 114, 128, 0.05))', borderColor: 'rgba(156, 163, 175, 0.3)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              <i className="fas fa-clock"></i> Pending RON Snapshot
            </div>
            <h4 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '1rem' }}>RON Holder Rewards</h4>
            <p style={{ color: '#cccccc', fontSize: '1rem', marginBottom: '1.5rem' }}>
              Phase 2 rewards early adopters who have proven their problem-solving ability by earning RON tokens.
              Distribution is tiered based on RON holdings at snapshot time.
            </p>

            <h5 style={{ color: '#FFD700', fontWeight: '700', marginBottom: '1rem' }}>Reward Tiers:</h5>
            <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div className="step-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <div className="step-icon" style={{ color: '#10b981' }}><i className="fas fa-crown"></i></div>
                <h3 style={{ color: '#10b981' }}>ORACLE Tier</h3>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>100+ RON</p>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.5rem' }}>20,000 RDLN</div>
              </div>

              <div className="step-card" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.05))', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                <div className="step-icon" style={{ color: '#a855f7' }}><i className="fas fa-star"></i></div>
                <h3 style={{ color: '#a855f7' }}>EXPERT Tier</h3>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>50-99 RON</p>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a855f7', marginTop: '0.5rem' }}>15,000 RDLN</div>
              </div>

              <div className="step-card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                <div className="step-icon" style={{ color: '#3b82f6' }}><i className="fas fa-puzzle-piece"></i></div>
                <h3 style={{ color: '#3b82f6' }}>SOLVER Tier</h3>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>10-49 RON</p>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginTop: '0.5rem' }}>10,000 RDLN</div>
              </div>

              <div className="step-card" style={{ background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.1), rgba(107, 114, 128, 0.05))', borderColor: 'rgba(156, 163, 175, 0.3)' }}>
                <div className="step-icon" style={{ color: '#9ca3af' }}><i className="fas fa-seedling"></i></div>
                <h3 style={{ color: '#9ca3af' }}>NEWCOMER Tier</h3>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>1-9 RON</p>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9ca3af', marginTop: '0.5rem' }}>5,000 RDLN</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '10px' }}>
              <p style={{ color: '#FFD700', fontSize: '0.95rem' }}>
                <strong><i className="fas fa-lightbulb"></i> Pro Tip:</strong> Start solving riddles now to increase your Phase 2 allocation!
              </p>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-shield-alt"></i> Smart Contract Features</h2>

          <div className="security-grid">
            <div className="security-card">
              <div className="security-icon"><i className="fas fa-level-up-alt"></i></div>
              <h4>UUPS Upgradeable</h4>
              <p>Future-proof contract design for long-term sustainability</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-users-cog"></i></div>
              <h4>Admin Controls</h4>
              <p>Multi-signature protection for maximum security</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-sitemap"></i></div>
              <h4>Merkle Proofs</h4>
              <p>Efficient eligibility verification on-chain</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-toggle-on"></i></div>
              <h4>Phase Activation</h4>
              <p>Admin-controlled phase transitions</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-user-shield"></i></div>
              <h4>Anti-Sybil</h4>
              <p>One claim per wallet per phase</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-eye"></i></div>
              <h4>Full Transparency</h4>
              <p>All transactions verifiable on-chain</p>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-code"></i> Contract Functions</h2>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Check Phase 1 Status</h3>
          <div className="code-example">
            <pre><code>{`const status = await airdropContract.getPhase1Status(userAddress);
// Returns: [eligible, claimed, verified]`}</code></pre>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Submit Social Proof</h3>
          <div className="code-example">
            <pre><code>{`await airdropContract.submitSocialProof(
  "@YourTwitterHandle",
  "@YourTelegramHandle"
);`}</code></pre>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Claim Phase 1 Tokens</h3>
          <div className="code-example">
            <pre><code>{`await airdropContract.claimPhase1();
// Sends 10,000 RDLN to your wallet`}</code></pre>
          </div>

          <h2 className="section-title">Airdrop Statistics</h2>
          <div className="table-container">
            <table className="progression-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Phase 1</th>
                  <th>Phase 2</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Allocation</td>
                  <td>50M RDLN</td>
                  <td>TBD</td>
                  <td>51M+ RDLN</td>
                </tr>
                <tr>
                  <td>Max Participants</td>
                  <td>5,000</td>
                  <td>Unlimited</td>
                  <td>5,000+</td>
                </tr>
                <tr>
                  <td>Per Wallet</td>
                  <td>10,000 RDLN</td>
                  <td>5K-20K RDLN</td>
                  <td>Variable</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td style={{ color: '#10b981', fontWeight: 'bold' }}>ACTIVE</td>
                  <td style={{ color: '#9ca3af' }}>Pending</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="section-title"><i className="fas fa-exclamation-triangle"></i> Important Notes</h2>
          <div className="grand-prize-banner" style={{ background: 'linear-gradient(45deg, rgba(255, 165, 0, 0.2), rgba(255, 99, 71, 0.2))', borderColor: 'rgba(255, 165, 0, 0.5)' }}>
            <h3 style={{ color: '#FFA500' }}>⚠️ Before Participating</h3>
            <ul style={{ textAlign: 'left' }}>
              <li>✅ This is a <strong>testnet airdrop</strong> on Polygon Amoy</li>
              <li>✅ Tokens have no monetary value (testing purposes only)</li>
              <li>✅ Complete all social tasks before submitting proof</li>
              <li>✅ You need testnet MATIC for gas fees</li>
              <li>✅ One claim per wallet address</li>
              <li>✅ Admin verification may take 24-48 hours</li>
            </ul>
          </div>

          <div className="cta-buttons">
            <Link href="/airdrop" className="btn-primary">
              <i className="fas fa-gift"></i> Claim Your Airdrop
            </Link>
            <Link href="/docs/ron-reputation" className="btn-secondary">
              <i className="fas fa-medal"></i> Learn About RON Tiers
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

          .burn-mechanism {
            background: linear-gradient(45deg, rgba(255, 99, 71, 0.1), rgba(255, 215, 0, 0.1));
            border: 2px solid rgba(255, 99, 71, 0.3);
            border-radius: 20px;
            padding: 2rem;
            margin: 2rem 0;
            text-align: center;
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

            .tokenomics-grid,
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