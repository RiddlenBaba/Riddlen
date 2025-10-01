import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';
import Link from 'next/link';

export default function APIReference() {
  const rdlnFunctions = [
    {
      name: 'balanceOf',
      params: 'address account',
      returns: 'uint256',
      description: 'Get RDLN token balance for an address'
    },
    {
      name: 'transfer',
      params: 'address to, uint256 amount',
      returns: 'bool',
      description: 'Transfer RDLN tokens to another address'
    },
    {
      name: 'approve',
      params: 'address spender, uint256 amount',
      returns: 'bool',
      description: 'Approve another address to spend tokens'
    },
    {
      name: 'getSupplyProtectionInfo',
      params: 'none',
      returns: 'struct',
      description: 'Get treasury protection status and limits'
    },
    {
      name: 'releaseOperationsFunds',
      params: 'none',
      returns: 'void',
      description: 'Release monthly operations funding (1M RDLN)'
    }
  ];

  const ronFunctions = [
    {
      name: 'getUserTier',
      params: 'address user',
      returns: 'uint8',
      description: 'Get RON tier (0=NEWCOMER, 1=SOLVER, 2=EXPERT, 3=ORACLE)'
    },
    {
      name: 'balanceOf',
      params: 'address account',
      returns: 'uint256',
      description: 'Get RON token balance for an address'
    },
    {
      name: 'mint',
      params: 'address to, uint256 amount',
      returns: 'void',
      description: 'Mint RON tokens (restricted to authorized contracts)'
    }
  ];

  const riddleFunctions = [
    {
      name: 'mintRiddleNFT',
      params: 'uint256 difficulty, uint256 prizeAmount',
      returns: 'uint256',
      description: 'Mint a new riddle NFT with specified difficulty and prize'
    },
    {
      name: 'solveRiddle',
      params: 'uint256 tokenId, string solution',
      returns: 'bool',
      description: 'Submit solution for a riddle (subject to 30s delay)'
    },
    {
      name: 'getRiddleInfo',
      params: 'uint256 tokenId',
      returns: 'struct',
      description: 'Get full riddle details including prize and winner info'
    },
    {
      name: 'calculateRewardTier',
      params: 'uint256 position, uint256 totalWinners',
      returns: 'uint256',
      description: 'Calculate reward multiplier (2x/1x/0.5x) for position'
    }
  ];

  const airdropFunctions = [
    {
      name: 'claimPhase1',
      params: 'none',
      returns: 'void',
      description: 'Claim 10K RDLN in Phase 1 (social proof required)'
    },
    {
      name: 'claimPhase2',
      params: 'none',
      returns: 'void',
      description: 'Claim 5K-20K RDLN based on RON holdings'
    },
    {
      name: 'hasClaimed',
      params: 'address user, uint8 phase',
      returns: 'bool',
      description: 'Check if user has claimed a specific phase'
    }
  ];

  return (
    <>
      <Head>
        <title>API Reference - Riddlen Docs</title>
        <meta name="description" content="Complete API reference for all Riddlen smart contract functions" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/api-reference">
        <div className="docs-content">
          <h1 className="docs-title">API Reference</h1>

          <div className="docs-highlight">
            <h3><i className="fas fa-book-open"></i> Smart Contract Functions</h3>
            <p>Complete reference for all smart contract functions and integration methods</p>
          </div>

          <h2 className="section-title"><i className="fas fa-coins"></i> RDLN Token Contract</h2>
          <p className="section-description">
            ERC-20 token with built-in treasury protection and rug-proof economics.
          </p>

          <div className="function-grid">
            {rdlnFunctions.map((func, index) => (
              <div key={index} className="function-card">
                <div className="function-header">
                  <h3>{func.name}</h3>
                  <span className="function-badge">Function</span>
                </div>
                <div className="function-signature">
                  <code>{func.params}</code>
                </div>
                <div className="function-returns">
                  <span className="label">Returns:</span>
                  <code>{func.returns}</code>
                </div>
                <p className="function-description">{func.description}</p>
              </div>
            ))}
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Usage Example - RDLN</h3>
          <div className="code-example">
            <pre><code>{`import { useReadContract } from 'wagmi';
import { CONTRACTS, RDLN_ABI } from '@/lib/wagmi';

function RDLNBalance() {
  const { address } = useAccount();

  const { data: balance } = useReadContract({
    address: CONTRACTS.RDLN,
    abi: RDLN_ABI,
    functionName: 'balanceOf',
    args: [address],
  });

  return <div>Balance: {balance?.toString()} RDLN</div>;
}`}</code></pre>
          </div>

          <h2 className="section-title"><i className="fas fa-medal"></i> RON Token Contract</h2>
          <p className="section-description">
            Reputation system with four-tier progression and anti-Sybil protection.
          </p>

          <div className="function-grid">
            {ronFunctions.map((func, index) => (
              <div key={index} className="function-card">
                <div className="function-header">
                  <h3>{func.name}</h3>
                  <span className="function-badge">Function</span>
                </div>
                <div className="function-signature">
                  <code>{func.params}</code>
                </div>
                <div className="function-returns">
                  <span className="label">Returns:</span>
                  <code>{func.returns}</code>
                </div>
                <p className="function-description">{func.description}</p>
              </div>
            ))}
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>RON Tier System</h3>
          <div className="tokenomics-grid">
            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-seedling"></i>
              </div>
              <h3>Tier 0: NEWCOMER</h3>
              <p>0 RON - Access to EASY riddles only</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-user"></i>
              </div>
              <h3>Tier 1: SOLVER</h3>
              <p>100+ RON - Access to MEDIUM riddles</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
              <h3>Tier 2: EXPERT</h3>
              <p>500+ RON - Access to HARD riddles</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-crown"></i>
              </div>
              <h3>Tier 3: ORACLE</h3>
              <p>2000+ RON - Governance voting power</p>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-cube"></i> Riddle NFT Contract</h2>
          <p className="section-description">
            ERC-721 NFT with tiered rewards, progressive difficulty, and anti-cheat mechanisms.
          </p>

          <div className="function-grid">
            {riddleFunctions.map((func, index) => (
              <div key={index} className="function-card">
                <div className="function-header">
                  <h3>{func.name}</h3>
                  <span className="function-badge">Function</span>
                </div>
                <div className="function-signature">
                  <code>{func.params}</code>
                </div>
                <div className="function-returns">
                  <span className="label">Returns:</span>
                  <code>{func.returns}</code>
                </div>
                <p className="function-description">{func.description}</p>
              </div>
            ))}
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Tiered Reward System</h3>
          <div className="grand-prize-banner">
            <h3><i className="fas fa-trophy"></i> Revolutionary Rewards</h3>
            <div className="tier-breakdown">
              <div className="tier-row tier-1">
                <span className="tier-label">First 25%</span>
                <span className="tier-multiplier">2.0x Reward</span>
              </div>
              <div className="tier-row tier-2">
                <span className="tier-label">Middle 50%</span>
                <span className="tier-multiplier">1.0x Reward</span>
              </div>
              <div className="tier-row tier-3">
                <span className="tier-label">Last 25%</span>
                <span className="tier-multiplier">0.5x Reward</span>
              </div>
            </div>
            <p className="tier-explanation">This prevents NFT hoarding and incentivizes quick solving!</p>
          </div>

          <h2 className="section-title"><i className="fas fa-gift"></i> Airdrop Contract</h2>
          <p className="section-description">
            Two-phase airdrop distribution with 51M RDLN total allocation.
          </p>

          <div className="function-grid">
            {airdropFunctions.map((func, index) => (
              <div key={index} className="function-card">
                <div className="function-header">
                  <h3>{func.name}</h3>
                  <span className="function-badge">Function</span>
                </div>
                <div className="function-signature">
                  <code>{func.params}</code>
                </div>
                <div className="function-returns">
                  <span className="label">Returns:</span>
                  <code>{func.returns}</code>
                </div>
                <p className="function-description">{func.description}</p>
              </div>
            ))}
          </div>

          <h2 className="section-title"><i className="fas fa-code"></i> Integration Setup</h2>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>1. Install Dependencies</h3>
          <div className="code-example">
            <pre><code>{`npm install wagmi viem @tanstack/react-query`}</code></pre>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>2. Configure Contract Addresses</h3>
          <div className="code-example">
            <pre><code>{`// lib/wagmi.js
export const CONTRACTS = {
  RDLN: "0x133029184EC460F661d05b0dC57BFC916b4AB0eB",
  RON: "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635",
  RIDDLE_NFT: "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3",
  AIRDROP: "0x330275259AfCeC8822A861ecbbdfD026dB1B0A13"
};`}</code></pre>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>3. Setup Wagmi Provider</h3>
          <div className="code-example">
            <pre><code>{`import { WagmiProvider } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { config } from '../lib/wagmi';

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <Component {...pageProps} />
    </WagmiProvider>
  );
}`}</code></pre>
          </div>

          <div className="security-card">
            <h3><i className="fas fa-shield-alt"></i> Security Best Practices</h3>
            <ul>
              <li><i className="fas fa-check"></i> Always validate user inputs before contract calls</li>
              <li><i className="fas fa-check"></i> Handle transaction errors gracefully with user-friendly messages</li>
              <li><i className="fas fa-check"></i> Show transaction status (pending, confirmed, failed)</li>
              <li><i className="fas fa-check"></i> Never hardcode private keys - use environment variables</li>
              <li><i className="fas fa-check"></i> Test all interactions thoroughly on Amoy testnet first</li>
              <li><i className="fas fa-check"></i> Implement proper loading states during blockchain operations</li>
            </ul>
          </div>

          <div className="cta-buttons">
            <Link href="/docs/frontend-integration" className="btn-primary">
              <i className="fas fa-plug"></i> Full Integration Guide
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

          .function-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            margin: 2rem 0;
          }

          .function-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 15px;
            padding: 1.5rem;
            transition: all 0.3s ease;
          }

          .function-card:hover {
            transform: translateY(-3px);
            border-color: rgba(255, 215, 0, 0.4);
          }

          .function-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .function-header h3 {
            color: #ffffff;
            font-size: 1.2rem;
            font-weight: 700;
            margin: 0;
            font-family: 'Courier New', monospace;
          }

          .function-badge {
            background: rgba(255, 215, 0, 0.2);
            color: #FFD700;
            padding: 0.25rem 0.75rem;
            border-radius: 50px;
            font-size: 0.7rem;
            font-weight: 600;
          }

          .function-signature {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            padding: 0.75rem;
            margin-bottom: 0.75rem;
          }

          .function-signature code {
            color: #10b981;
            font-size: 0.9rem;
            font-family: 'Courier New', monospace;
          }

          .function-returns {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            margin-bottom: 0.75rem;
          }

          .function-returns .label {
            color: #94a3b8;
            font-size: 0.85rem;
            font-weight: 600;
          }

          .function-returns code {
            color: #a78bfa;
            font-size: 0.85rem;
            font-family: 'Courier New', monospace;
          }

          .function-description {
            color: #cccccc;
            line-height: 1.6;
            font-size: 0.95rem;
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
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-radius: 10px;
            font-weight: 600;
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

          .tier-label {
            color: #ffffff;
            font-size: 1.1rem;
          }

          .tier-multiplier {
            color: #FFD700;
            font-size: 1.2rem;
          }

          .tier-explanation {
            text-align: center;
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

            .tier-row {
              flex-direction: column;
              text-align: center;
              gap: 0.5rem;
            }
          }
        `}</style>
      </DocsLayout>
    </>
  );
}