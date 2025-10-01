import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';
import Link from 'next/link';

export default function RDLNContract() {
  const features = [
    {
      title: 'Treasury Integration',
      description: 'Built-in treasury that collects 80% of mint fees and 100% of solve fees',
      icon: 'vault',
      color: '#FFD700'
    },
    {
      title: 'Drip Mechanism',
      description: 'Controlled 0.25% daily treasury release to solver rewards',
      icon: 'droplet',
      color: '#10b981'
    },
    {
      title: 'Burn on Transfer',
      description: '2% burn rate on every transfer to create deflationary pressure',
      icon: 'fire',
      color: '#FF6347'
    },
    {
      title: 'Anti-Whale Protection',
      description: 'Max transaction limit of 1% total supply prevents manipulation',
      icon: 'shield-alt',
      color: '#9333ea'
    }
  ];

  const tokenomics = [
    {
      metric: 'Total Supply',
      value: '1,000,000,000',
      icon: 'coins',
      description: 'Fixed maximum supply'
    },
    {
      metric: 'Initial Treasury',
      value: '250,000,000',
      icon: 'university',
      description: '25% reserved for treasury'
    },
    {
      metric: 'Airdrop Allocation',
      value: '100,000,000',
      icon: 'gift',
      description: '10% for community distribution'
    },
    {
      metric: 'Circulating Supply',
      value: '650,000,000',
      icon: 'chart-line',
      description: '65% available at launch'
    }
  ];

  return (
    <>
      <Head>
        <title>RDLN Token Contract - Riddlen Docs</title>
        <meta name="description" content="Complete technical documentation for the RDLN token smart contract" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/rdln-contract">
        <div className="docs-content">
          <h1 className="docs-title">RDLN Token Contract</h1>

          <div className="docs-highlight">
            <h3><i className="fas fa-coins"></i> Primary Utility Token</h3>
            <p>ERC-20 token with integrated treasury, burn mechanism, and anti-whale protection</p>
          </div>

          <h2 className="section-title">Contract Overview</h2>
          <p className="section-description">
            The RDLN token is the economic backbone of the Riddlen ecosystem. It combines standard ERC-20 functionality
            with advanced tokenomics including treasury management, deflationary burn mechanics, and whale protection.
          </p>

          <div className="contract-card">
            <div className="contract-header">
              <div className="contract-info">
                <div className="contract-icon">
                  <i className="fas fa-file-contract"></i>
                </div>
                <div>
                  <h3>RDLN Token</h3>
                  <span className="contract-type">ERC-20</span>
                </div>
              </div>
              <a
                href="https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB"
                target="_blank"
                rel="noopener noreferrer"
                className="external-link"
              >
                <i className="fas fa-external-link-alt"></i>
              </a>
            </div>

            <p className="contract-description">
              Deployed on Polygon Amoy Testnet with full verification
            </p>

            <div className="contract-address">
              <code>0x133029184EC460F661d05b0dC57BFC916b4AB0eB</code>
              <button
                onClick={() => navigator.clipboard.writeText('0x133029184EC460F661d05b0dC57BFC916b4AB0eB')}
                className="copy-btn"
                title="Copy address"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-star"></i> Key Features</h2>
          <div className="tokenomics-grid">
            {features.map((feature) => (
              <div key={feature.title} className="tokenomics-card">
                <div className="card-icon" style={{ color: feature.color }}>
                  <i className={`fas fa-${feature.icon}`}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>

          <h2 className="section-title"><i className="fas fa-chart-pie"></i> Tokenomics Breakdown</h2>
          <div className="tokenomics-grid">
            {tokenomics.map((item) => (
              <div key={item.metric} className="tokenomics-card">
                <div className="card-icon">
                  <i className={`fas fa-${item.icon}`}></i>
                </div>
                <h3>{item.metric}</h3>
                <div className="token-value">{item.value}</div>
                <p>{item.description}</p>
              </div>
            ))}
          </div>

          <h2 className="section-title"><i className="fas fa-fire"></i> Burn Mechanism</h2>
          <div className="burn-mechanism">
            <h3>2% Burn on Every Transfer</h3>
            <p>
              Every RDLN transfer automatically burns 2% of the transaction amount, creating permanent deflationary pressure.
              This reduces total supply over time and increases scarcity.
            </p>
            <div className="burn-stats">
              <div className="stat-item">
                <i className="fas fa-fire"></i>
                <div>
                  <div className="stat-label">Burn Rate</div>
                  <div className="stat-value">2%</div>
                </div>
              </div>
              <div className="stat-item">
                <i className="fas fa-infinity"></i>
                <div>
                  <div className="stat-label">Burn Destination</div>
                  <div className="stat-value">Dead Address</div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-vault"></i> Treasury System</h2>
          <div className="grand-prize-banner">
            <h3><i className="fas fa-university"></i> Integrated Treasury</h3>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              The RDLN contract includes a built-in treasury that automatically collects and manages ecosystem funds.
            </p>
            <div className="network-config">
              <div className="config-row">
                <span className="config-label">Mint Fee Collection:</span>
                <span className="config-value">80% to treasury</span>
              </div>
              <div className="config-row">
                <span className="config-label">Solve Fee Collection:</span>
                <span className="config-value">100% to treasury</span>
              </div>
              <div className="config-row">
                <span className="config-label">Daily Drip Rate:</span>
                <span className="config-value">0.25% per day</span>
              </div>
              <div className="config-row">
                <span className="config-label">Release Mechanism:</span>
                <span className="config-value">Controlled solver rewards</span>
              </div>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-shield-alt"></i> Anti-Whale Protection</h2>
          <div className="security-card">
            <h3><i className="fas fa-lock"></i> Maximum Transaction Limit</h3>
            <p>
              To prevent market manipulation and ensure fair distribution, the RDLN contract enforces a maximum
              transaction limit of 1% of the total supply per transaction.
            </p>
            <div className="security-features">
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Prevents whale manipulation</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Ensures gradual accumulation</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <span>Protects price stability</span>
              </div>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-code"></i> Core Functions</h2>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Transfer with Burn</h3>
          <div className="code-example">
            <pre><code>{`function transfer(address to, uint256 amount)
    public override returns (bool) {
    require(amount <= maxTransactionAmount, "Exceeds max transaction");

    uint256 burnAmount = (amount * 2) / 100;
    uint256 sendAmount = amount - burnAmount;

    super.transfer(DEAD_ADDRESS, burnAmount);
    super.transfer(to, sendAmount);

    return true;
}`}</code></pre>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Treasury Drip</h3>
          <div className="code-example">
            <pre><code>{`function dripToRewards() external returns (uint256) {
    require(block.timestamp >= lastDripTime + 1 days, "Too soon");

    uint256 dripAmount = (treasuryBalance * 25) / 10000; // 0.25%
    treasuryBalance -= dripAmount;
    rewardPool += dripAmount;
    lastDripTime = block.timestamp;

    return dripAmount;
}`}</code></pre>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Using Wagmi</h3>
          <div className="code-example">
            <pre><code>{`import { useReadContract, useWriteContract } from 'wagmi';
import { CONTRACTS, RDLN_ABI } from '@/lib/wagmi';

// Read balance
const { data: balance } = useReadContract({
  address: CONTRACTS.RDLN,
  abi: RDLN_ABI,
  functionName: 'balanceOf',
  args: [userAddress],
});

// Transfer tokens
const { writeContract } = useWriteContract();

const transfer = () => {
  writeContract({
    address: CONTRACTS.RDLN,
    abi: RDLN_ABI,
    functionName: 'transfer',
    args: [recipientAddress, amount],
  });
};`}</code></pre>
          </div>

          <h2 className="section-title"><i className="fas fa-lightbulb"></i> Key Insights</h2>
          <div className="step-card">
            <h3><i className="fas fa-brain"></i> Deflationary by Design</h3>
            <p>
              The 2% burn on every transfer creates permanent deflationary pressure. As tokens are burned,
              the total supply decreases, making remaining tokens more scarce and potentially more valuable.
            </p>
          </div>

          <div className="step-card">
            <h3><i className="fas fa-balance-scale"></i> Sustainable Treasury</h3>
            <p>
              The 0.25% daily drip rate ensures the treasury can sustainably fund solver rewards for 400 days
              even without new mint fees. This creates long-term economic stability.
            </p>
          </div>

          <div className="step-card">
            <h3><i className="fas fa-users"></i> Fair Distribution</h3>
            <p>
              Anti-whale protection with 1% max transaction limits ensures no single entity can dominate
              the token supply, promoting decentralization and fair participation.
            </p>
          </div>

          <div className="cta-buttons">
            <Link href="/docs/treasury-drip" className="btn-primary">
              <i className="fas fa-droplet"></i> Treasury Drip System
            </Link>
            <Link href="/docs/deployed-contracts" className="btn-secondary">
              <i className="fas fa-network-wired"></i> All Contracts
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

          .contract-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            margin: 2rem 0;
          }

          .contract-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 215, 0, 0.4);
          }

          .contract-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .contract-info {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .contract-icon {
            font-size: 2rem;
            color: #FFD700;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
          }

          .contract-card h3 {
            color: #ffffff;
            font-weight: 700;
            font-size: 1.3rem;
            margin: 0;
          }

          .contract-type {
            background: rgba(255, 215, 0, 0.2);
            color: #FFD700;
            padding: 0.25rem 0.75rem;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 600;
          }

          .external-link {
            color: #FFD700;
            font-size: 1.2rem;
            transition: all 0.3s ease;
          }

          .external-link:hover {
            color: #FFA500;
            transform: scale(1.1);
          }

          .contract-description {
            color: #cccccc;
            line-height: 1.6;
            margin: 1rem 0;
          }

          .contract-address {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
          }

          .contract-address code {
            color: #10b981;
            font-size: 0.9rem;
            word-break: break-all;
          }

          .copy-btn {
            background: transparent;
            border: none;
            color: #cccccc;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .copy-btn:hover {
            color: #ffffff;
            transform: scale(1.1);
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
            color: #FF6347;
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