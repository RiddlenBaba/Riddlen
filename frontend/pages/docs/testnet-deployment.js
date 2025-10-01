import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';
import Link from 'next/link';

export default function TestnetDeployment() {
  const contracts = [
    {
      name: 'RDLN Token',
      type: 'ERC-20',
      address: '0x133029184EC460F661d05b0dC57BFC916b4AB0eB',
      features: [
        'Rug-proof treasury with 1M RDLN monthly releases',
        'Emergency limits: Max 5M RDLN per year',
        'Built-in burn mechanisms for gameplay',
        'Biennial halving economics'
      ],
      icon: 'coins'
    },
    {
      name: 'RON Token',
      type: 'ERC-20',
      address: '0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635',
      features: [
        'Tier-based access control (4 tiers)',
        'Governance voting power',
        'Oracle network participation',
        'Anti-Sybil protection'
      ],
      icon: 'medal'
    },
    {
      name: 'Riddle NFT',
      type: 'ERC-721',
      address: '0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3',
      features: [
        'TIERED REWARDS: First 25% get 2x, middle 50% get 1x, last 25% get 0.5x',
        'Progressive difficulty system',
        'Anti-cheat mechanisms (30s solve delay)',
        'Cross-contract RON integration'
      ],
      icon: 'cube'
    },
    {
      name: 'Airdrop',
      type: 'Custom',
      address: '0x330275259AfCeC8822A861ecbbdfD026dB1B0A13',
      features: [
        'Phase 1: 10K RDLN per wallet (social proof)',
        'Phase 2: 5K-20K RDLN based on RON holdings',
        '51M RDLN funded and ready'
      ],
      icon: 'gift'
    }
  ];

  return (
    <>
      <Head>
        <title>Testnet Deployment - Riddlen Docs</title>
        <meta name="description" content="Polygon Amoy testnet deployment information" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/testnet-deployment">
        <div className="docs-content">
          <h1 className="docs-title">Riddlen v5.1 Testnet Deployment</h1>

          <div className="docs-highlight">
            <h3><i className="fas fa-rocket"></i> Live on Polygon Amoy Testnet</h3>
            <p>All contracts deployed, verified, and operational on Chain ID 80002</p>
          </div>

          <div className="deployment-info">
            <div className="info-card">
              <div className="info-label">Deployment Date</div>
              <div className="info-value">September 29, 2024</div>
            </div>
            <div className="info-card">
              <div className="info-label">Network</div>
              <div className="info-value">Polygon Amoy</div>
            </div>
            <div className="info-card">
              <div className="info-label">Chain ID</div>
              <div className="info-value">80002</div>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-file-contract"></i> Deployed Contracts</h2>
          <p className="section-description">
            All Riddlen contracts are fully deployed, verified, and ready for testing on Polygon Amoy.
          </p>

          <div className="contracts-grid">
            {contracts.map((contract) => (
              <div key={contract.address} className="contract-card">
                <div className="contract-header">
                  <div className="contract-info">
                    <div className="contract-icon">
                      <i className={`fas fa-${contract.icon}`}></i>
                    </div>
                    <div>
                      <h3>{contract.name}</h3>
                      <span className="contract-type">{contract.type}</span>
                    </div>
                  </div>
                  <a
                    href={`https://amoy.polygonscan.com/address/${contract.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                  >
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>

                <div className="contract-address">
                  <code>{contract.address}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(contract.address)}
                    className="copy-btn"
                    title="Copy address"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>

                <ul className="features-list">
                  {contract.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check-circle"></i> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="section-title"><i className="fas fa-trophy"></i> Tiered Reward System</h2>
          <p className="section-description">
            Revolutionary player incentives that prevent NFT hoarding
          </p>

          <div className="grand-prize-banner">
            <h3><i className="fas fa-chart-line"></i> Example: 20 Winners Total (1M RDLN Prize Pool)</h3>
            <div className="tier-breakdown">
              <div className="tier-row tier-1">
                <div className="tier-info">
                  <span className="tier-label">Tier 1 (Positions 1-5)</span>
                  <span className="tier-description">First 25% of solvers</span>
                </div>
                <span className="tier-reward">2.0x → ~88,888 RDLN each</span>
              </div>
              <div className="tier-row tier-2">
                <div className="tier-info">
                  <span className="tier-label">Tier 2 (Positions 6-15)</span>
                  <span className="tier-description">Middle 50% of solvers</span>
                </div>
                <span className="tier-reward">1.0x → ~44,444 RDLN each</span>
              </div>
              <div className="tier-row tier-3">
                <div className="tier-info">
                  <span className="tier-label">Tier 3 (Positions 16-20)</span>
                  <span className="tier-description">Last 25% of solvers</span>
                </div>
                <span className="tier-reward">0.5x → ~22,222 RDLN each</span>
              </div>
            </div>
            <div className="tier-summary">
              <p>Result: Players rush to solve quickly instead of sitting on NFTs!</p>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-shield-alt"></i> Rug-Proof Treasury System</h2>
          <p className="section-description">
            Unbreakable holder protections built into smart contracts
          </p>

          <div className="security-card">
            <h3><i className="fas fa-lock"></i> Immutable Constants</h3>
            <div className="code-example">
              <pre><code>{`MONTHLY_OPERATIONS_RELEASE = 1,000,000 RDLN  // Fixed monthly releases
RELEASE_INTERVAL = 30 days                   // Fixed schedule
MAX_EMERGENCY_RELEASE = 5,000,000 RDLN      // Max emergency per year
EMERGENCY_COOLDOWN = 365 days               // 1 year between emergencies`}</code></pre>
            </div>

            <h4>What Holders Can Trust</h4>
            <ul>
              <li><i className="fas fa-check"></i> Predictable supply: Maximum 12M RDLN per year from operations</li>
              <li><i className="fas fa-check"></i> Emergency transparency: Max 5M with detailed reasoning</li>
              <li><i className="fas fa-check"></i> No surprise dumps: All releases are time-locked and limited</li>
              <li><i className="fas fa-check"></i> Full transparency: Real-time tracking via <code>getSupplyProtectionInfo()</code></li>
            </ul>
          </div>

          <h2 className="section-title"><i className="fas fa-users"></i> Player Progression System</h2>

          <div className="tokenomics-grid">
            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-seedling"></i>
              </div>
              <h3>EASY Riddles</h3>
              <p>Open to everyone - perfect entry point for new players</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-user"></i>
              </div>
              <h3>MEDIUM Riddles</h3>
              <p>Requires SOLVER tier RON (earned from EASY riddles)</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
              <h3>HARD Riddles</h3>
              <p>Requires EXPERT tier RON for advanced players</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-crown"></i>
              </div>
              <h3>ORACLE Riddles</h3>
              <p>Requires ORACLE tier RON - governance elite</p>
            </div>
          </div>

          <div className="progression-flow">
            <h3>Progression Flow</h3>
            <div className="code-example">
              <pre><code>{`New Player → EASY Riddles → Earn RON → SOLVER Tier → MEDIUM Riddles
    ↓
Advanced Player → EXPERT Tier → HARD Riddles → ORACLE Tier → Governance`}</code></pre>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-flask"></i> Testing Instructions</h2>

          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Get Testnet MATIC</h4>
              <p>Visit the <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer">Polygon Faucet</a> to get free testnet MATIC</p>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Add Amoy Network</h4>
              <p>Add Polygon Amoy testnet to MetaMask with Chain ID: 80002</p>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Connect Wallet</h4>
              <p>Connect your wallet to the frontend application</p>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Test Contract Interactions</h4>
              <p>Interact with the deployed contracts using the addresses above</p>
            </div>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Network Configuration</h3>
          <div className="grand-prize-banner">
            <h3><i className="fas fa-network-wired"></i> Add to MetaMask</h3>
            <div className="network-config">
              <div className="config-row">
                <span className="config-label">Network Name:</span>
                <span className="config-value">Polygon Amoy Testnet</span>
              </div>
              <div className="config-row">
                <span className="config-label">RPC URL:</span>
                <span className="config-value">https://rpc-amoy.polygon.technology/</span>
              </div>
              <div className="config-row">
                <span className="config-label">Chain ID:</span>
                <span className="config-value">80002</span>
              </div>
              <div className="config-row">
                <span className="config-label">Currency:</span>
                <span className="config-value">MATIC</span>
              </div>
              <div className="config-row">
                <span className="config-label">Explorer:</span>
                <span className="config-value">https://amoy.polygonscan.com/</span>
              </div>
            </div>
          </div>

          <div className="cta-buttons">
            <Link href="/docs/frontend-integration" className="btn-primary">
              <i className="fas fa-plug"></i> Frontend Integration Guide
            </Link>
            <Link href="/docs/deployed-contracts" className="btn-secondary">
              <i className="fas fa-file-contract"></i> Contract Addresses
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

          .deployment-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
          }

          .info-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 15px;
            padding: 1.5rem;
            text-align: center;
          }

          .info-label {
            color: #94a3b8;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }

          .info-value {
            color: #ffffff;
            font-size: 1.3rem;
            font-weight: 700;
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

          .contracts-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin: 2rem 0;
          }

          .contract-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
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

          .contract-address {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            margin-bottom: 1rem;
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

          .features-list {
            list-style: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .features-list li {
            color: #cccccc;
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            line-height: 1.6;
            font-size: 0.95rem;
          }

          .features-list i {
            color: #22c55e;
            margin-top: 0.25rem;
            flex-shrink: 0;
          }

          .grand-prize-banner {
            background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 99, 71, 0.2));
            border: 2px solid rgba(255, 215, 0, 0.5);
            border-radius: 15px;
            padding: 2rem;
            margin: 2rem 0;
            animation: pulse 3s ease-in-out infinite;
          }

          .grand-prize-banner h3 {
            color: #FFD700;
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .tier-breakdown {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          .tier-row {
            padding: 1.5rem;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
          }

          .tier-row.tier-1 {
            background: rgba(34, 197, 94, 0.2);
            border: 1px solid rgba(34, 197, 94, 0.4);
          }

          .tier-row.tier-2 {
            background: rgba(59, 130, 246, 0.2);
            border: 1px solid rgba(59, 130, 246, 0.4);
          }

          .tier-row.tier-3 {
            background: rgba(249, 115, 22, 0.2);
            border: 1px solid rgba(249, 115, 22, 0.4);
          }

          .tier-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .tier-label {
            color: #ffffff;
            font-size: 1.1rem;
            font-weight: 700;
          }

          .tier-description {
            color: #94a3b8;
            font-size: 0.9rem;
          }

          .tier-reward {
            color: #FFD700;
            font-size: 1.2rem;
            font-weight: 700;
            text-align: right;
          }

          .tier-summary {
            text-align: center;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 215, 0, 0.2);
          }

          .tier-summary p {
            color: #ffffff;
            font-size: 1.05rem;
            margin: 0;
          }

          .security-card {
            background: linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
            border: 2px solid rgba(239, 68, 68, 0.3);
            border-radius: 20px;
            padding: 2rem;
            margin: 2rem 0;
          }

          .security-card h3 {
            color: #ef4444;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .security-card h4 {
            color: #FFD700;
            font-size: 1.2rem;
            margin: 1.5rem 0 1rem;
          }

          .security-card ul {
            list-style: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .security-card li {
            color: #e5e5e5;
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            line-height: 1.6;
          }

          .security-card i {
            color: #22c55e;
            margin-top: 0.3rem;
            flex-shrink: 0;
          }

          .security-card code {
            color: #a78bfa;
            background: rgba(0, 0, 0, 0.3);
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.9rem;
          }

          .tokenomics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

          .tokenomics-icon {
            font-size: 3rem;
            color: #FFD700;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
            margin-bottom: 1rem;
          }

          .tokenomics-card h3 {
            color: #ffffff;
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
          }

          .tokenomics-card p {
            color: #cccccc;
            line-height: 1.6;
            font-size: 0.95rem;
          }

          .progression-flow {
            margin: 2rem 0;
          }

          .progression-flow h3 {
            color: #FFD700;
            font-size: 1.5rem;
            margin-bottom: 1rem;
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

          .step-card {
            background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(99, 102, 241, 0.1));
            border: 1px solid rgba(147, 51, 234, 0.3);
            border-radius: 20px;
            padding: 2rem;
            margin: 1.5rem 0;
            display: flex;
            gap: 1.5rem;
            align-items: flex-start;
            transition: all 0.3s ease;
          }

          .step-card:hover {
            transform: translateY(-3px);
            border-color: rgba(147, 51, 234, 0.5);
          }

          .step-number {
            background: linear-gradient(45deg, #9333ea, #7e22ce);
            color: #ffffff;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 800;
            flex-shrink: 0;
          }

          .step-content {
            flex: 1;
          }

          .step-content h4 {
            color: #ffffff;
            font-size: 1.3rem;
            font-weight: 700;
            margin: 0 0 0.5rem 0;
          }

          .step-content p {
            color: #cccccc;
            line-height: 1.6;
            margin: 0;
          }

          .step-content a {
            color: #FFD700;
            text-decoration: underline;
          }

          .step-content a:hover {
            color: #FFA500;
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

            .deployment-info {
              grid-template-columns: 1fr;
            }

            .contract-address code {
              font-size: 0.75rem;
            }

            .tier-row {
              flex-direction: column;
              text-align: center;
            }

            .tier-reward {
              text-align: center;
            }

            .tokenomics-grid {
              grid-template-columns: 1fr;
            }

            .step-card {
              flex-direction: column;
            }

            .config-row {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.5rem;
            }
          }
        `}</style>
      </DocsLayout>
    </>
  );
}