import { useState } from 'react';
import Header from './Header';
import GlobalStyles from './GlobalStyles';
import Link from 'next/link';
import Head from 'next/head';

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

export default function DocsLayout({ children, currentPath = '' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Flatten navigation for prev/next
  const allPages = navigation.flatMap(section => section.items);
  const currentIndex = allPages.findIndex(page => page.href === currentPath);
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

  return (
    <>
      <Head>
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
                      <a
                        href={item.href}
                        className={currentPath === item.href ? 'active' : ''}
                      >
                        {item.title}
                      </a>
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

      <div className="docs-layout-wrapper" style={{ paddingTop: '100px', minHeight: '100vh' }}>

        {/* Main content */}
        <main style={{ paddingTop: '100px', minHeight: '100vh', marginLeft: '0' }}>
          <section className="docs-section">
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
              {children}

              {/* Prev/Next Navigation */}
              {(prevPage || nextPage) && (
                <div className="doc-navigation">
                  {prevPage && (
                    <Link href={prevPage.href} className="nav-link prev-link">
                      <i className="fas fa-arrow-left"></i>
                      <div>
                        <div className="nav-label">Previous</div>
                        <div className="nav-title">{prevPage.title}</div>
                      </div>
                    </Link>
                  )}
                  {nextPage && (
                    <Link href={nextPage.href} className="nav-link next-link">
                      <div>
                        <div className="nav-label">Next</div>
                        <div className="nav-title">{nextPage.title}</div>
                      </div>
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
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
              <a href="https://github.com/RiddlenBaba/Riddlen" target="_blank">GitHub</a>
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
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          z-index: 999;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(255, 165, 0, 0.95));
          color: #000;
          border: none;
          border-radius: 0 8px 8px 0;
          width: 32px;
          height: 60px;
          cursor: pointer;
          box-shadow: 2px 0 10px rgba(255, 215, 0, 0.3);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          border-left: 3px solid rgba(255, 215, 0, 0.6);
        }

        .sidebar-toggle:hover {
          width: 40px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 1), rgba(255, 165, 0, 1));
          box-shadow: 3px 0 15px rgba(255, 215, 0, 0.5);
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

        .section-links a:hover,
        .section-links a.active {
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

        .floating-riddle:nth-child(1) {
          position: absolute;
          top: 20%;
          left: 10%;
          animation: float 8s ease-in-out infinite;
          z-index: 1;
        }
        .floating-riddle:nth-child(2) {
          position: absolute;
          top: 60%;
          right: 80%;
          animation: float 8s ease-in-out infinite 2s;
          z-index: 1;
        }
        .floating-riddle:nth-child(3) {
          position: absolute;
          bottom: 20%;
          left: 20%;
          animation: float 8s ease-in-out infinite 4s;
          z-index: 1;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.3; }
        }

        /* Prev/Next Navigation */
        .doc-navigation {
          display: flex;
          justify-content: space-between;
          gap: 1.5rem;
          margin-top: 4rem;
          padding-top: 3rem;
          border-top: 3px solid rgba(255, 215, 0, 0.3);
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 2rem 2.5rem;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
          border: 2px solid rgba(255, 215, 0, 0.5);
          border-radius: 20px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex: 1;
          max-width: 48%;
          box-shadow: 0 4px 20px rgba(255, 215, 0, 0.2);
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.15));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .nav-link:hover::before {
          opacity: 1;
        }

        .nav-link:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.8);
          box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4);
        }

        .prev-link {
          justify-content: flex-start;
        }

        .next-link {
          justify-content: flex-end;
          margin-left: auto;
        }

        .nav-link i {
          font-size: 2rem;
          color: #FFD700;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
          z-index: 1;
          transition: all 0.3s ease;
        }

        .nav-link:hover i {
          filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
          transform: scale(1.15);
        }

        .nav-link > div {
          z-index: 1;
        }

        .nav-label {
          font-size: 0.85rem;
          text-transform: uppercase;
          color: #FFD700;
          margin-bottom: 0.5rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .nav-title {
          font-size: 1.2rem;
          color: #ffffff;
          font-weight: 700;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 768px) {
          .doc-navigation {
            flex-direction: column;
          }

          .nav-link {
            max-width: 100%;
          }

          .next-link {
            margin-left: 0;
          }
        }

        /* Footer Styles */
        .footer {
          background: linear-gradient(180deg, rgba(10, 10, 10, 0.95), rgba(0, 0, 0, 0.98));
          border-top: 2px solid rgba(255, 215, 0, 0.2);
          padding: 3rem 0 1rem;
          margin-top: 4rem;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-section h3 {
          color: #FFD700;
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .footer-section p {
          color: #cccccc;
          line-height: 1.6;
          font-size: 0.9rem;
        }

        .footer-section a {
          display: block;
          color: #999999;
          text-decoration: none;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .footer-section a:hover {
          color: #FFD700;
          transform: translateX(5px);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 215, 0, 0.1);
          padding-top: 1.5rem;
          text-align: center;
        }

        .footer-bottom p {
          color: #666666;
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer {
            padding: 2rem 0 1rem;
          }
        }
      `}</style>
    </>
  );
}