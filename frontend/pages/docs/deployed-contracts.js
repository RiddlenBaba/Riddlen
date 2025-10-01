import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';
import Link from 'next/link';

export default function DeployedContracts() {
  const contracts = [
    {
      name: 'RDLN Token',
      type: 'ERC-20',
      address: '0x133029184EC460F661d05b0dC57BFC916b4AB0eB',
      description: 'Primary utility token with integrated treasury system',
      icon: 'coins'
    },
    {
      name: 'RON Token',
      type: 'ERC-20',
      address: '0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635',
      description: 'Reputation system with tier-based access control',
      icon: 'medal'
    },
    {
      name: 'Riddle NFT',
      type: 'ERC-721',
      address: '0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3',
      description: 'Game mechanics with tiered rewards and anti-cheat',
      icon: 'cube'
    },
    {
      name: 'Airdrop',
      type: 'Custom',
      address: '0x330275259AfCeC8822A861ecbbdfD026dB1B0A13',
      description: 'Two-phase airdrop distribution system',
      icon: 'gift'
    },
  ];

  return (
    <>
      <Head>
        <title>Deployed Contracts - Riddlen Docs</title>
        <meta name="description" content="All deployed Riddlen smart contracts on Polygon Amoy" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/deployed-contracts">
        <div className="docs-content">
          <h1 className="docs-title">Deployed Smart Contracts</h1>

          <div className="docs-highlight">
            <h3><i className="fas fa-network-wired"></i> Polygon Amoy Testnet</h3>
            <p>All contracts deployed on Chain ID 80002 and verified on PolygonScan</p>
          </div>

          <h2 className="section-title">Live Contract Addresses</h2>
          <p className="section-description">
            All Riddlen contracts are fully deployed, verified, and operational on the Polygon Amoy Testnet.
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

                <p className="contract-description">{contract.description}</p>

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
              </div>
            ))}
          </div>

          <h2 className="section-title"><i className="fas fa-code"></i> Contract Interactions</h2>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Using Wagmi (Recommended)</h3>
          <div className="code-example">
            <pre><code>{`import { useReadContract } from 'wagmi';
import { CONTRACTS, RDLN_ABI } from '@/lib/wagmi';

const { data: balance } = useReadContract({
  address: CONTRACTS.RDLN,
  abi: RDLN_ABI,
  functionName: 'balanceOf',
  args: [userAddress],
});`}</code></pre>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Using Ethers.js</h3>
          <div className="code-example">
            <pre><code>{`import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(
  'https://rpc-amoy.polygon.technology/'
);
const rdlnContract = new ethers.Contract(
  '0x133029184EC460F661d05b0dC57BFC916b4AB0eB',
  RDLN_ABI,
  provider
);`}</code></pre>
          </div>

          <h2 className="section-title">Network Configuration</h2>
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

          <h2 className="section-title"><i className="fas fa-faucet"></i> Get Testnet MATIC</h2>
          <div className="burn-mechanism">
            <h3>Free Testnet Tokens</h3>
            <p>You'll need testnet MATIC to interact with the contracts. Get free tokens from the Polygon faucet.</p>
            <a
              href="https://faucet.polygon.technology/"
              target="_blank"
              rel="noopener noreferrer"
              className="faucet-link"
            >
              <i className="fas fa-external-link-alt"></i> Get Free Testnet MATIC
            </a>
          </div>

          <div className="cta-buttons">
            <Link href="/docs/frontend-integration" className="btn-primary">
              <i className="fas fa-plug"></i> Integration Guide
            </Link>
            <Link href="/docs/api-reference" className="btn-secondary">
              <i className="fas fa-book"></i> API Reference
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
          }

          .faucet-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: linear-gradient(45deg, #9333ea, #7e22ce);
            color: #ffffff;
            padding: 1rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .faucet-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(147, 51, 234, 0.4);
            color: #ffffff;
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

            .contract-address code {
              font-size: 0.75rem;
            }
          }
        `}</style>
      </DocsLayout>
    </>
  );
}