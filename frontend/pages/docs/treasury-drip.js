import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';
import Link from 'next/link';

export default function TreasuryDrip() {
  const dripFeatures = [
    {
      title: 'Daily Release',
      value: '0.25%',
      icon: 'calendar-day',
      description: 'Controlled daily treasury distribution'
    },
    {
      title: 'Sustainability',
      value: '400+ Days',
      icon: 'infinity',
      description: 'Long-term reward funding'
    },
    {
      title: 'Auto-Compound',
      value: 'Continuous',
      icon: 'sync-alt',
      description: 'New fees extend runway'
    },
    {
      title: 'Transparency',
      value: '100%',
      icon: 'eye',
      description: 'On-chain verifiable'
    }
  ];

  return (
    <>
      <Head>
        <title>Treasury Drip System - Riddlen Docs</title>
        <meta name="description" content="How the treasury drip mechanism ensures sustainable solver rewards" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/treasury-drip">
        <div className="docs-content">
          <h1 className="docs-title">Treasury Drip System</h1>

          <div className="docs-highlight">
            <h3><i className="fas fa-droplet"></i> Sustainable Reward Distribution</h3>
            <p>Controlled 0.25% daily treasury release ensures long-term economic stability</p>
          </div>

          <h2 className="section-title">System Overview</h2>
          <p className="section-description">
            The treasury drip mechanism is the heart of Riddlen's sustainable economics. By releasing only 0.25%
            of the treasury balance daily, the system ensures solver rewards can be funded for 400+ days even
            without new mint fees, while new fees continuously extend this runway.
          </p>

          <div className="tokenomics-grid">
            {dripFeatures.map((feature) => (
              <div key={feature.title} className="tokenomics-card">
                <div className="card-icon">
                  <i className={`fas fa-${feature.icon}`}></i>
                </div>
                <h3>{feature.title}</h3>
                <div className="token-value">{feature.value}</div>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>

          <h2 className="section-title"><i className="fas fa-chart-line"></i> How It Works</h2>

          <div className="step-card">
            <h3><i className="fas fa-1"></i> Treasury Collection</h3>
            <p>
              The RDLN treasury automatically collects fees from ecosystem activities:
            </p>
            <ul style={{ color: '#ffffff', lineHeight: '2', marginLeft: '2rem', marginTop: '1rem' }}>
              <li><strong>80% of mint fees</strong> - When users mint new riddle NFTs</li>
              <li><strong>100% of solve fees</strong> - When users submit riddle solutions</li>
              <li><strong>Initial allocation</strong> - 250M RDLN (25% of supply) at launch</li>
            </ul>
          </div>

          <div className="step-card">
            <h3><i className="fas fa-2"></i> Daily Drip Release</h3>
            <p>
              Every 24 hours, the contract calculates and releases exactly 0.25% of the current treasury balance:
            </p>
            <div className="code-example" style={{ marginTop: '1rem' }}>
              <pre><code>{`function dripToRewards() external returns (uint256) {
    require(block.timestamp >= lastDripTime + 1 days, "Too soon");

    uint256 dripAmount = (treasuryBalance * 25) / 10000; // 0.25%
    treasuryBalance -= dripAmount;
    rewardPool += dripAmount;
    lastDripTime = block.timestamp;

    emit DripExecuted(dripAmount, treasuryBalance);
    return dripAmount;
}`}</code></pre>
            </div>
          </div>

          <div className="step-card">
            <h3><i className="fas fa-3"></i> Reward Distribution</h3>
            <p>
              The dripped RDLN tokens are added to the reward pool and distributed to riddle solvers based on the
              tiered reward system. Higher-tier solvers earn 2x rewards, while newcomers earn 0.5x.
            </p>
          </div>

          <h2 className="section-title"><i className="fas fa-calculator"></i> Economic Model</h2>

          <div className="grand-prize-banner">
            <h3><i className="fas fa-coins"></i> Treasury Mathematics</h3>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              The 0.25% daily drip rate creates a sustainable decay curve
            </p>
            <div className="network-config">
              <div className="config-row">
                <span className="config-label">Starting Treasury:</span>
                <span className="config-value">250,000,000 RDLN</span>
              </div>
              <div className="config-row">
                <span className="config-label">Day 1 Drip:</span>
                <span className="config-value">625,000 RDLN (0.25%)</span>
              </div>
              <div className="config-row">
                <span className="config-label">Day 100 Balance:</span>
                <span className="config-value">~194,500,000 RDLN</span>
              </div>
              <div className="config-row">
                <span className="config-label">Day 400 Balance:</span>
                <span className="config-value">~91,800,000 RDLN</span>
              </div>
              <div className="config-row">
                <span className="config-label">Half-Life:</span>
                <span className="config-value">~277 days</span>
              </div>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-shield-alt"></i> Rug-Proof Design</h2>

          <div className="security-card">
            <h3><i className="fas fa-lock"></i> No Admin Withdrawal</h3>
            <p>
              The treasury has NO admin withdrawal function. Tokens can ONLY exit through the automated
              0.25% daily drip mechanism. This makes the system completely rug-proof - even the contract
              owner cannot drain the treasury.
            </p>
            <div className="security-features">
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>No owner withdrawal function</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Automated 24-hour timelock</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>On-chain verifiable code</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Community-controlled parameters</span>
              </div>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-sync-alt"></i> Self-Sustaining Loop</h2>

          <div className="burn-mechanism">
            <h3>Continuous Treasury Growth</h3>
            <p>
              While the drip releases 0.25% daily, mint and solve fees continuously replenish the treasury.
              This creates a self-sustaining economic loop where active participation extends the reward runway indefinitely.
            </p>
            <div className="burn-stats">
              <div className="stat-item">
                <i className="fas fa-arrow-down"></i>
                <div>
                  <div className="stat-label">Daily Outflow</div>
                  <div className="stat-value">0.25%</div>
                </div>
              </div>
              <div className="stat-item">
                <i className="fas fa-arrow-up"></i>
                <div>
                  <div className="stat-label">Daily Inflow</div>
                  <div className="stat-value">Variable</div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-code"></i> Implementation</h2>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Reading Treasury Balance</h3>
          <div className="code-example">
            <pre><code>{`import { useReadContract } from 'wagmi';
import { CONTRACTS, RDLN_ABI } from '@/lib/wagmi';

const { data: treasuryBalance } = useReadContract({
  address: CONTRACTS.RDLN,
  abi: RDLN_ABI,
  functionName: 'treasuryBalance',
});

const { data: lastDripTime } = useReadContract({
  address: CONTRACTS.RDLN,
  abi: RDLN_ABI,
  functionName: 'lastDripTime',
});

// Calculate time until next drip
const nextDripTime = lastDripTime + 86400; // 24 hours in seconds
const timeUntilDrip = nextDripTime - Math.floor(Date.now() / 1000);`}</code></pre>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Triggering Drip</h3>
          <div className="code-example">
            <pre><code>{`import { useWriteContract } from 'wagmi';

const { writeContract } = useWriteContract();

const triggerDrip = async () => {
  writeContract({
    address: CONTRACTS.RDLN,
    abi: RDLN_ABI,
    functionName: 'dripToRewards',
  });
};

// Anyone can call this function once per day
// It's a permissionless public function`}</code></pre>
          </div>

          <h2 className="section-title"><i className="fas fa-lightbulb"></i> Key Benefits</h2>

          <div className="step-card">
            <h3><i className="fas fa-infinity"></i> Long-Term Sustainability</h3>
            <p>
              The 0.25% rate ensures rewards can be distributed for 400+ days without new fees.
              This gives the ecosystem time to grow organically while maintaining consistent rewards.
            </p>
          </div>

          <div className="step-card">
            <h3><i className="fas fa-balance-scale"></i> Economic Stability</h3>
            <p>
              By preventing large treasury dumps, the drip system creates stable, predictable reward
              distribution. This protects token price from treasury-induced volatility.
            </p>
          </div>

          <div className="step-card">
            <h3><i className="fas fa-users"></i> Community Trust</h3>
            <p>
              The rug-proof design builds trust with users. They can verify on-chain that the treasury
              can only release funds through the automated drip mechanism, never through admin withdrawal.
            </p>
          </div>

          <div className="cta-buttons">
            <Link href="/docs/rdln-contract" className="btn-primary">
              <i className="fas fa-coins"></i> RDLN Contract
            </Link>
            <Link href="/docs/ron-contract" className="btn-secondary">
              <i className="fas fa-medal"></i> RON Contract
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
            gap: 1.5rem;
            margin: 2rem 0;
          }

          .tokenomics-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease;
          }

          .tokenomics-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 215, 0, 0.4);
          }

          .card-icon {
            font-size: 2.5rem;
            color: #FFD700;
            margin-bottom: 1rem;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
          }

          .tokenomics-card h3 {
            color: #ffffff;
            font-size: 1.2rem;
            margin-bottom: 1rem;
            font-weight: 700;
          }

          .tokenomics-card p {
            color: #cccccc;
            line-height: 1.6;
          }

          .token-value {
            font-size: 1.8rem;
            font-weight: 800;
            color: #FFD700;
            margin: 0.5rem 0;
          }

          .step-card {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
            border: 2px solid rgba(16, 185, 129, 0.3);
            border-radius: 20px;
            padding: 2rem;
            margin: 1.5rem 0;
          }

          .step-card h3 {
            color: #10b981;
            font-size: 1.3rem;
            margin-bottom: 1rem;
          }

          .step-card p {
            color: #ffffff;
            line-height: 1.8;
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
          }

          .network-config {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .config-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 215, 0, 0.1);
          }

          .config-row:last-child {
            border-bottom: none;
          }

          .config-label {
            color: #cccccc;
            font-weight: 600;
          }

          .config-value {
            color: #ffffff;
            font-family: monospace;
          }

          .security-card {
            background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(124, 58, 237, 0.1));
            border: 2px solid rgba(147, 51, 234, 0.3);
            border-radius: 20px;
            padding: 2rem;
            margin: 2rem 0;
          }

          .security-card h3 {
            color: #9333ea;
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }

          .security-card p {
            color: #ffffff;
            line-height: 1.8;
            margin-bottom: 1.5rem;
          }

          .security-features {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .feature-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            color: #ffffff;
          }

          .feature-item i {
            color: #10b981;
            font-size: 1.2rem;
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
            margin-bottom: 1.5rem;
            line-height: 1.8;
          }

          .burn-stats {
            display: flex;
            justify-content: center;
            gap: 3rem;
            margin-top: 2rem;
            flex-wrap: wrap;
          }

          .stat-item {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .stat-item i {
            font-size: 2.5rem;
            color: #10b981;
          }

          .stat-label {
            color: #cccccc;
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
          }

          .stat-value {
            color: #ffffff;
            font-size: 1.3rem;
            font-weight: 700;
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

            .burn-stats {
              flex-direction: column;
              gap: 1.5rem;
            }
          }
        `}</style>
      </DocsLayout>
    </>
  );
}