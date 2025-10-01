import { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import WalletPanel from './WalletPanel';

export default function Header({ currentPage = "home" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletPanelOpen, setWalletPanelOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const ConnectWallet = () => {
    if (isConnected) {
      return (
        <>
          <button
            onClick={() => {
              console.log('Wallet button clicked, current state:', walletPanelOpen);
              setWalletPanelOpen(!walletPanelOpen);
            }}
            className="wallet-connected"
            type="button"
          >
            <div className="wallet-indicator"></div>
            <span className="wallet-address">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <i className="fas fa-chevron-down"></i>
          </button>
          <WalletPanel
            isOpen={walletPanelOpen}
            onClose={() => setWalletPanelOpen(false)}
          />
        </>
      );
    }

    return (
      <div className="wallet-connect-wrapper">
        <button
          onClick={() => {
            const connector = connectors[0];
            if (connector) {
              connect({ connector });
            }
          }}
          className="connect-wallet-btn"
        >
          <i className="fas fa-wallet"></i> Connect Wallet
        </button>
      </div>
    );
  };

  const pageLabels = {
    home: "",
    docs: "DOCS",
    game: "GAME",
    airdrop: "AIRDROP",
    dashboard: "DASHBOARD"
  };

  return (
    <header className="header">
      <nav className="nav">
        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

        <div className="logo-container">
          <a href="/" className="logo">RIDDLEN</a>
          {pageLabels[currentPage] && (
            <span className="page-label">{pageLabels[currentPage]}</span>
          )}
        </div>

        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/game">Game</a></li>
          <li><a href="/airdrop">Airdrop</a></li>
          <li><a href="/docs">Docs</a></li>
        </ul>

        <div className="header-right">
          {/* Social Icons */}
          <div className="social-icons-container">
            <a href="https://x.com/RiddlenToken" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://t.me/RiddlenToken" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Telegram">
              <i className="fab fa-telegram"></i>
            </a>
            <a href="https://t.me/RiddlenCommunity" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Community">
              <i className="fas fa-users"></i>
            </a>
            <a href="https://github.com/RiddlenBaba/riddlen/discussions" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
          </div>

          <ConnectWallet />
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-nav-links">
            <li><a href="/" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
            <li><a href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</a></li>
            <li><a href="/game" onClick={() => setMobileMenuOpen(false)}>Game</a></li>
            <li><a href="/airdrop" onClick={() => setMobileMenuOpen(false)}>Airdrop</a></li>
            <li><a href="/docs" onClick={() => setMobileMenuOpen(false)}>Docs</a></li>
          </ul>
        </div>
      )}

      <style jsx>{`
        .logo-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .page-label {
          color: #FFD700;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .mobile-menu-btn {
          display: none;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          color: #FFD700;
          font-size: 1.25rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          order: -1;
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
        }

        .mobile-menu-btn:active {
          transform: translateY(0);
        }

        .mobile-menu {
          position: fixed;
          top: 69px;
          left: 0;
          right: 0;
          background: rgba(10, 10, 10, 0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
          animation: slideDown 0.3s ease;
          z-index: 999;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .mobile-nav-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .mobile-nav-links li {
          margin: 0;
          border-bottom: 1px solid rgba(255, 215, 0, 0.05);
        }

        .mobile-nav-links li:last-child {
          border-bottom: none;
        }

        .mobile-nav-links a {
          display: block;
          padding: 1.25rem 2rem;
          color: #ffffff;
          text-decoration: none;
          font-weight: 500;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
          position: relative;
        }

        .mobile-nav-links a:hover {
          color: #FFD700;
          background: rgba(255, 215, 0, 0.08);
          border-left-color: #FFD700;
          padding-left: 2.5rem;
        }

        .mobile-nav-links a::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0;
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.15), transparent);
          transition: width 0.3s ease;
        }

        .mobile-nav-links a:hover::before {
          width: 100%;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .header-right {
            align-items: center;
          }

          .nav-links {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
            margin-right: 0.75rem;
          }

          .logo-container {
            flex-direction: column;
            gap: 0.25rem;
            align-items: center;
            text-align: center;
          }

          .page-label {
            font-size: 0.75rem;
            display: block;
          }
        }
      `}</style>
    </header>
  );
}