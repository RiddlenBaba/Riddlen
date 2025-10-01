import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';
import Link from 'next/link';

export default function FrontendIntegration() {
  return (
    <>
      <Head>
        <title>Frontend Integration - Riddlen Docs</title>
        <meta name="description" content="Complete guide to integrating Riddlen contracts into your frontend" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/frontend-integration">
        <div className="docs-content">
          <h1 className="docs-title">Frontend Integration Guide</h1>

          <div className="docs-highlight">
            <h3><i className="fas fa-plug"></i> Wagmi v2 + Viem Integration</h3>
            <p>Learn how to integrate Riddlen smart contracts into your React/Next.js application</p>
          </div>

          <h2 className="section-title"><i className="fas fa-rocket"></i> Quick Start</h2>

          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Install Dependencies</h4>
              <div className="code-example">
                <pre><code>{`npm install wagmi viem @tanstack/react-query`}</code></pre>
              </div>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Configure Wagmi</h4>
              <p>Create <code>lib/wagmi.js</code> with the following configuration:</p>
              <div className="code-example">
                <pre><code>{`import { http, createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [injected()],
  transports: {
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology/'),
  },
});

export const CONTRACTS = {
  RDLN: "0x133029184EC460F661d05b0dC57BFC916b4AB0eB",
  RON: "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635",
  RIDDLE_NFT: "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3",
  AIRDROP: "0x330275259AfCeC8822A861ecbbdfD026dB1B0A13"
};`}</code></pre>
              </div>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Setup Providers</h4>
              <p>Wrap your app in <code>_app.js</code>:</p>
              <div className="code-example">
                <pre><code>{`import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../lib/wagmi';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}`}</code></pre>
              </div>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-code"></i> Common Operations</h2>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Connect Wallet</h3>
          <div className="code-example">
            <pre><code>{`import { useAccount, useConnect, useDisconnect } from 'wagmi';

function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        <p>Connected: {address}</p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <button onClick={() => connect({ connector: connectors[0] })}>
      Connect Wallet
    </button>
  );
}`}</code></pre>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Read Contract Data</h3>
          <div className="code-example">
            <pre><code>{`import { useReadContract } from 'wagmi';
import { CONTRACTS, RDLN_ABI } from '@/lib/wagmi';

function TokenBalance() {
  const { address } = useAccount();

  const { data: balance, isLoading } = useReadContract({
    address: CONTRACTS.RDLN,
    abi: RDLN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>Balance: {balance?.toString()} RDLN</div>;
}`}</code></pre>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Write to Contract</h3>
          <div className="code-example">
            <pre><code>{`import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

function TransferTokens() {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const handleTransfer = () => {
    writeContract({
      address: CONTRACTS.RDLN,
      abi: RDLN_ABI,
      functionName: 'transfer',
      args: [recipientAddress, parseEther('1.0')],
    });
  };

  return (
    <div>
      <button onClick={handleTransfer} disabled={isConfirming}>
        {isConfirming ? 'Confirming...' : 'Transfer'}
      </button>
      {isSuccess && <div>Transaction successful!</div>}
    </div>
  );
}`}</code></pre>
          </div>

          <h2 className="section-title"><i className="fas fa-gamepad"></i> Riddle Game Integration</h2>

          <div className="tokenomics-grid">
            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              <h3>Mint Riddle NFT</h3>
              <p>Create new riddles with custom difficulty and prize amounts</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-paper-plane"></i>
              </div>
              <h3>Submit Solution</h3>
              <p>Solve riddles and earn tiered rewards based on speed</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-medal"></i>
              </div>
              <h3>Check RON Tier</h3>
              <p>View user progression through the 4-tier reputation system</p>
            </div>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Mint Riddle NFT</h3>
          <div className="code-example">
            <pre><code>{`function MintRiddle() {
  const { writeContract } = useWriteContract();

  const mintRiddle = () => {
    writeContract({
      address: CONTRACTS.RIDDLE_NFT,
      abi: RIDDLE_NFT_ABI,
      functionName: 'mintRiddleNFT',
      args: [difficulty, prizeAmount],
    });
  };

  return <button onClick={mintRiddle}>Mint Riddle NFT</button>;
}`}</code></pre>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Submit Solution</h3>
          <div className="code-example">
            <pre><code>{`function SubmitSolution({ tokenId, solution }) {
  const { writeContract } = useWriteContract();

  const submitAnswer = () => {
    writeContract({
      address: CONTRACTS.RIDDLE_NFT,
      abi: RIDDLE_NFT_ABI,
      functionName: 'solveRiddle',
      args: [tokenId, solution],
    });
  };

  return <button onClick={submitAnswer}>Submit Solution</button>;
}`}</code></pre>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.8rem' }}>Check RON Tier</h3>
          <div className="code-example">
            <pre><code>{`function UserTier() {
  const { address } = useAccount();

  const { data: tier } = useReadContract({
    address: CONTRACTS.RON,
    abi: RON_ABI,
    functionName: 'getUserTier',
    args: [address],
  });

  const tierNames = ['NEWCOMER', 'SOLVER', 'EXPERT', 'ORACLE'];

  return <div>Your Tier: {tierNames[tier]}</div>;
}`}</code></pre>
          </div>

          <h2 className="section-title"><i className="fas fa-shield-alt"></i> Best Practices</h2>

          <div className="security-card">
            <h3><i className="fas fa-exclamation-triangle"></i> Important Considerations</h3>
            <ul>
              <li><i className="fas fa-check"></i> Always check if user is connected before calling contract functions</li>
              <li><i className="fas fa-check"></i> Handle loading states during transaction confirmation</li>
              <li><i className="fas fa-check"></i> Display clear error messages for failed transactions</li>
              <li><i className="fas fa-check"></i> Show transaction hashes with links to PolygonScan</li>
              <li><i className="fas fa-check"></i> Validate user inputs before submitting to contracts</li>
              <li><i className="fas fa-check"></i> Use proper gas estimation for complex transactions</li>
            </ul>
          </div>

          <h2 className="section-title"><i className="fas fa-bug"></i> Error Handling</h2>
          <div className="code-example">
            <pre><code>{`import { useWriteContract } from 'wagmi';
import { useEffect } from 'react';

function SafeTransaction() {
  const { writeContract, error } = useWriteContract();

  useEffect(() => {
    if (error) {
      if (error.message.includes('user rejected')) {
        toast.error('Transaction cancelled');
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient MATIC for gas');
      } else {
        toast.error('Transaction failed: ' + error.message);
      }
    }
  }, [error]);

  // ... rest of component
}`}</code></pre>
          </div>

          <h2 className="section-title"><i className="fas fa-flask"></i> Testing on Amoy</h2>

          <div className="grand-prize-banner">
            <h3><i className="fas fa-vial"></i> Testnet Testing Checklist</h3>
            <div className="checklist">
              <div className="checklist-item">
                <i className="fas fa-check-circle"></i>
                <span>Get testnet MATIC from <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer">Polygon Faucet</a></span>
              </div>
              <div className="checklist-item">
                <i className="fas fa-check-circle"></i>
                <span>Add Polygon Amoy network to MetaMask (Chain ID: 80002)</span>
              </div>
              <div className="checklist-item">
                <i className="fas fa-check-circle"></i>
                <span>Test all contract interactions thoroughly before mainnet</span>
              </div>
              <div className="checklist-item">
                <i className="fas fa-check-circle"></i>
                <span>Monitor transactions on <a href="https://amoy.polygonscan.com/" target="_blank" rel="noopener noreferrer">PolygonScan</a></span>
              </div>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-network-wired"></i> Network Configuration</h2>
          <div className="code-example">
            <pre><code>{`// Add to MetaMask manually or programmatically
const amoyNetwork = {
  chainId: '0x13882', // 80002 in hex
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/']
};

// Request to add network
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [amoyNetwork],
});`}</code></pre>
          </div>

          <h2 className="section-title"><i className="fas fa-lightbulb"></i> Pro Tips</h2>

          <div className="tokenomics-grid">
            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>Optimize Performance</h3>
              <p>Use React Query's caching to minimize RPC calls and improve UX</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Mobile-First</h3>
              <p>Design responsive interfaces that work seamlessly on mobile wallets</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-bell"></i>
              </div>
              <h3>User Feedback</h3>
              <p>Show toast notifications for all transaction states and events</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-code"></i>
              </div>
              <h3>Type Safety</h3>
              <p>Use TypeScript with Viem for compile-time type checking</p>
            </div>
          </div>

          <div className="cta-buttons">
            <Link href="/docs/deployed-contracts" className="btn-primary">
              <i className="fas fa-file-contract"></i> View Contract Addresses
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
            margin: 0 0 1rem 0;
          }

          .step-content p {
            color: #cccccc;
            line-height: 1.6;
            margin-bottom: 1rem;
          }

          .step-content code {
            color: #a78bfa;
            background: rgba(0, 0, 0, 0.3);
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.9rem;
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

          .tokenomics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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

          .checklist {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .checklist-item {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            color: #ffffff;
            font-size: 1.05rem;
          }

          .checklist-item i {
            color: #22c55e;
            font-size: 1.2rem;
            margin-top: 0.2rem;
            flex-shrink: 0;
          }

          .checklist-item a {
            color: #FFD700;
            text-decoration: underline;
          }

          .checklist-item a:hover {
            color: #FFA500;
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

            .step-card {
              flex-direction: column;
            }

            .tokenomics-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </DocsLayout>
    </>
  );
}