import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';
import { useState } from 'react';

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs/introduction' },
      { title: 'How to Play', href: '/docs/how-to-play' },
      { title: 'Frontend Integration', href: '/docs/frontend-integration' },
    ]
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Tokenomics', href: '/docs/tokenomics' },
      { title: 'NFT Mechanics', href: '/docs/nft-mechanics' },
      { title: 'Burning Protocol', href: '/docs/burning-protocol' },
      { title: 'RON Reputation System', href: '/docs/ron-reputation' },
    ]
  },
  {
    title: 'Smart Contracts',
    items: [
      { title: 'Deployed Contracts', href: '/docs/deployed-contracts' },
      { title: 'RDLN Specification', href: '/docs/rdln-contract' },
      { title: 'Airdrop Contract', href: '/docs/airdrop-contract' },
      { title: 'Treasury Drip', href: '/docs/treasury-drip' },
    ]
  },
  {
    title: 'Testnet & Development',
    items: [
      { title: 'Testnet Deployment', href: '/docs/testnet-deployment' },
      { title: 'Development Log', href: '/docs/development-log' },
      { title: 'API Reference', href: '/docs/api-reference' },
    ]
  },
  {
    title: 'Security & Community',
    items: [
      { title: 'Security Fixes', href: '/docs/security-fixes' },
      { title: 'Audit Report', href: '/docs/audit-report' },
      { title: 'Contributing', href: '/docs/contributing' },
    ]
  }
];

export default function Docs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Riddlen Documentation - Web3 Riddle Economy</title>
        <meta name="description" content="Complete documentation for the Riddlen Proof-of-Solve blockchain platform. Learn how to integrate, play, and earn." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">📚</div>
        <div className="floating-riddle">🔐</div>
        <div className="floating-riddle">💎</div>
      </div>

      <Header currentPage="docs" />

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="sidebar-toggle"
      >
        <i className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
      </button>

      {/* Sidebar Navigation */}
      <aside className={`docs-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <h3 className="sidebar-title">📚 Documentation</h3>
          <nav className="sidebar-nav">
            {navigation.map((section) => (
              <div key={section.title} className="nav-section">
                <h4 className="section-title">{section.title}</h4>
                <ul className="section-links">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <a href={item.href}>{item.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <main style={{ paddingTop: '100px', minHeight: '100vh', marginLeft: '0' }}>
        <section className="docs-section">
          <div className="container">
            <div className="docs-content">
              <h1 className="docs-title">Riddlen Documentation</h1>

              <div className="docs-highlight">
                <h3>🚀 Welcome to Riddlen</h3>
                <p>The world's first Proof-of-Solve blockchain where human intellect powers the economy. Our platform is live on Polygon Amoy testnet with full functionality.</p>
              </div>

              <h2 className="section-title">🎮 Quick Start</h2>
              <p className="section-description">Ready to start solving riddles and earning tokens? Here's how to get started:</p>

              <div className="steps-grid">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <div className="step-icon"><i className="fas fa-wallet"></i></div>
                  <h3>Connect Wallet</h3>
                  <p>Connect your MetaMask or compatible wallet to Polygon Amoy testnet. Get testnet MATIC from the faucet.</p>
                  <a href="https://faucet.polygon.technology/" target="_blank" className="btn-secondary">
                    Get Testnet MATIC
                  </a>
                </div>

                <div className="step-card">
                  <div className="step-number">2</div>
                  <div className="step-icon"><i className="fas fa-gamepad"></i></div>
                  <h3>Play the Game</h3>
                  <p>Visit our game interface to mint riddle NFTs, solve puzzles, and experience the full RON tier progression system.</p>
                  <a href="/game" className="btn-primary">
                    Play Demo
                  </a>
                </div>
              </div>

              <h2 className="section-title">📜 Smart Contracts</h2>
              <p className="section-description">Our platform consists of three main smart contracts deployed on Polygon Amoy testnet:</p>

              <div className="tokenomics-grid">
                <div className="tokenomics-card contract-card">
                  <h4>RDLN Token</h4>
                  <div className="contract-type">Main Utility Token</div>
                  <p>Used for minting riddle NFTs and solving puzzles. Deflationary with 50% burn rate.</p>
                  <code className="contract-address">0x133029184EC460F661d05b0dC57BFC916b4AB0eB</code>
                  <a href="https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB" target="_blank" className="btn-tertiary">
                    <i className="fas fa-external-link-alt"></i> View Contract
                  </a>
                </div>

                <div className="tokenomics-card contract-card">
                  <h4>RON Token</h4>
                  <div className="contract-type">Progression System</div>
                  <p>Merit-based tier system with 4 levels (0.5x-2x rewards). Progress by solving riddles.</p>
                  <code className="contract-address">0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635</code>
                  <a href="https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635" target="_blank" className="btn-tertiary">
                    <i className="fas fa-external-link-alt"></i> View Contract
                  </a>
                </div>

                <div className="tokenomics-card contract-card">
                  <h4>Riddle NFT</h4>
                  <div className="contract-type">Game Mechanics</div>
                  <p>NFT contract for riddle storage, solving mechanics, and reward distribution.</p>
                  <code className="contract-address">0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3</code>
                  <a href="https://amoy.polygonscan.com/address/0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3" target="_blank" className="btn-tertiary">
                    <i className="fas fa-external-link-alt"></i> View Contract
                  </a>
                </div>
              </div>

              <h2 className="section-title">🏆 RON Tier System</h2>
              <p className="section-description">Progress through our merit-based tier system to unlock higher reward multipliers:</p>

              <div className="ron-tiers-grid">
                <div className="ron-tier newcomer">
                  <div className="tier-icon">🌱</div>
                  <h4>NEWCOMER</h4>
                  <div className="tier-multiplier">0.5x rewards</div>
                  <p>Starting tier for all new players</p>
                </div>

                <div className="ron-tier solver">
                  <div className="tier-icon">🧩</div>
                  <h4>SOLVER</h4>
                  <div className="tier-multiplier">1.0x rewards</div>
                  <p>Unlock after solving 10+ riddles</p>
                </div>

                <div className="ron-tier expert">
                  <div className="tier-icon">🎯</div>
                  <h4>EXPERT</h4>
                  <div className="tier-multiplier">1.5x rewards</div>
                  <p>Unlock after solving 50+ riddles</p>
                </div>

                <div className="ron-tier oracle">
                  <div className="tier-icon">👑</div>
                  <h4>ORACLE</h4>
                  <div className="tier-multiplier">2.0x rewards</div>
                  <p>Unlock after solving 100+ riddles</p>
                </div>
              </div>

              <div className="burn-mechanism">
                <h3>🔥 Progressive Burn Protocol</h3>
                <p>Failed solve attempts burn progressively, creating permanent scarcity:</p>
                <div className="burn-split">
                  <div className="burn-item">
                    <div className="percentage">1st</div>
                    <div className="label">1 RDLN Burned</div>
                  </div>
                  <div className="burn-item">
                    <div className="percentage">2nd</div>
                    <div className="label">2 RDLN Burned</div>
                  </div>
                  <div className="burn-item">
                    <div className="percentage">Nth</div>
                    <div className="label">N RDLN Burned</div>
                  </div>
                </div>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#aaa' }}>
                  Minting costs 1000 RDLN (halves every 2 years). Prize pool is pre-allocated (700M RDLN). Only failed attempts create permanent burns.
                </p>
              </div>

              <h2 className="section-title">🛡️ Security Features</h2>
              <div className="security-grid">
                <div className="security-card">
                  <div className="security-icon"><i className="fas fa-shield-alt"></i></div>
                  <h4>Anti-Cheat Timer</h4>
                  <p>30-second cooldown between solve attempts prevents automation</p>
                </div>
                <div className="security-card">
                  <div className="security-icon"><i className="fas fa-lock"></i></div>
                  <h4>Wallet Integration</h4>
                  <p>Secure MetaMask and WalletConnect support with multi-wallet options</p>
                </div>
                <div className="security-card">
                  <div className="security-icon"><i className="fas fa-check-circle"></i></div>
                  <h4>Contract Verification</h4>
                  <p>All smart contracts verified and open-source on Polygon Explorer</p>
                </div>
                <div className="security-card">
                  <div className="security-icon"><i className="fas fa-eye"></i></div>
                  <h4>Transparent Treasury</h4>
                  <p>Real-time visibility into all fund allocations and transactions</p>
                </div>
              </div>

              <div className="grand-prize-banner">
                <h3>🎯 Need Help Getting Started?</h3>
                <p>Having trouble? Here are the most common solutions:</p>
                <ul>
                  <li><strong>No testnet MATIC?</strong> Get free tokens from the <a href="https://faucet.polygon.technology/" target="_blank">Polygon faucet</a></li>
                  <li><strong>Wrong network?</strong> Switch to Polygon Amoy testnet (Chain ID: 80002)</li>
                  <li><strong>Wallet issues?</strong> Try refreshing and reconnecting your wallet</li>
                  <li><strong>Transaction failed?</strong> Ensure you have enough MATIC for gas fees</li>
                </ul>
              </div>

              <div className="cta-buttons">
                <a href="/game" className="btn-primary">
                  <i className="fas fa-rocket"></i> Launch Demo
                </a>
                <a href="https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB" target="_blank" className="btn-secondary">
                  <i className="fas fa-code"></i> View Contracts
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Riddlen Economy</h3>
              <p>The world's first Proof-of-Solve blockchain where human intellect powers decentralized finance through cryptographic riddles and NFT gaming.</p>
            </div>
            <div className="footer-section">
              <h3>Platform</h3>
              <a href="/game">Play Demo</a>
              <a href="/">Home</a>
              <a href="/#how-it-works">How It Works</a>
              <a href="/#tokenomics">Tokenomics</a>
              <a href="https://github.com/riddlen" target="_blank">GitHub</a>
            </div>
            <div className="footer-section">
              <h3>Smart Contracts</h3>
              <a href="https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB" target="_blank">RDLN Token</a>
              <a href="https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635" target="_blank">RON Token</a>
              <a href="https://amoy.polygonscan.com/address/0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3" target="_blank">Riddle NFT</a>
              <a href="https://amoy.polygonscan.com/" target="_blank">Polygon Explorer</a>
            </div>
            <div className="footer-section">
              <h3>Network</h3>
              <a href="https://polygon.technology/" target="_blank">Polygon</a>
              <a href="https://faucet.polygon.technology/" target="_blank">Testnet Faucet</a>
              <a href="https://metamask.io/" target="_blank">MetaMask</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Riddlen. The Web3 Riddle Economy. Built on Polygon with Proof-of-Solve.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Sidebar Toggle Button */
        .sidebar-toggle {
          position: fixed;
          top: 180px;
          left: 20px;
          z-index: 999;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          border: none;
          border-radius: 50%;
          width: 55px;
          height: 55px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }

        .sidebar-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
        }

        /* Sidebar */
        .docs-sidebar {
          position: fixed;
          left: -320px;
          top: 80px;
          width: 300px;
          height: calc(100vh - 80px);
          background: linear-gradient(180deg, rgba(10, 10, 10, 0.98), rgba(26, 10, 46, 0.98));
          backdrop-filter: blur(20px);
          border-right: 3px solid rgba(255, 215, 0, 0.4);
          box-shadow: 4px 0 30px rgba(255, 215, 0, 0.3);
          z-index: 900;
          overflow-y: auto;
          transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .docs-sidebar.open {
          left: 0;
        }

        .sidebar-content {
          padding: 2rem 1.5rem 2rem;
        }

        .sidebar-title {
          color: #FFD700;
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 2rem;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
          border-bottom: 2px solid rgba(255, 215, 0, 0.3);
          padding-bottom: 0.75rem;
        }

        .nav-section {
          margin-bottom: 1.5rem;
        }

        .nav-section .section-title {
          color: #FFD700;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.75rem;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .section-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .section-links li {
          margin: 0;
        }

        .section-links a {
          display: block;
          padding: 0.6rem 1rem;
          color: #ccc;
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .section-links a:hover {
          background: rgba(255, 215, 0, 0.15);
          color: #FFD700;
          transform: translateX(5px);
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
        }

        .sidebar-overlay {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 899;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Desktop adjustments */
        @media (min-width: 1024px) {
          .sidebar-toggle {
            top: 150px;
          }
        }

        .docs-section {
          padding: 4rem 0;
          min-height: calc(100vh - 100px);
        }

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

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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
          margin-bottom: 1.5rem;
        }

        .tokenomics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
        }

        .tokenomics-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.4);
        }

        .contract-card {
          text-align: center;
        }

        .contract-card h4 {
          color: #FFD700;
          margin-bottom: 0.5rem;
          font-weight: 700;
          font-size: 1.3rem;
        }

        .contract-type {
          color: #FFA500;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .contract-card p {
          color: #cccccc;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .contract-address {
          display: block;
          background: rgba(31, 41, 55, 0.5);
          border: 1px solid rgba(75, 85, 99, 1);
          border-radius: 0.5rem;
          padding: 0.75rem;
          color: #10b981;
          font-size: 0.75rem;
          word-break: break-all;
          margin-bottom: 1rem;
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

        .burn-mechanism {
          background: linear-gradient(45deg, rgba(255, 99, 71, 0.1), rgba(255, 215, 0, 0.1));
          border: 2px solid rgba(255, 99, 71, 0.3);
          border-radius: 20px;
          padding: 2rem;
          margin: 2rem 0;
          text-align: center;
        }

        .burn-mechanism h3 {
          color: #FF6347;
          margin-bottom: 1rem;
          font-size: 1.5rem;
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
          font-size: 1.5rem;
          font-weight: bold;
          color: #FF6347;
        }

        .burn-item .label {
          font-size: 0.9rem;
          color: #cccccc;
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

        .grand-prize-banner a {
          color: #FFD700;
          text-decoration: none;
        }

        .grand-prize-banner a:hover {
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
          border: none;
          cursor: pointer;
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

        .btn-tertiary {
          background: transparent;
          color: #cccccc;
          padding: 0.8rem 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .btn-tertiary:hover {
          background: rgba(255, 215, 0, 0.05);
          border-color: rgba(255, 215, 0, 0.3);
          color: #FFD700;
          transform: translateY(-1px);
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

          .ron-tiers-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </>
  );
}