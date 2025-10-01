import { useState, useEffect } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useRDLN, useRON, useRiddleNFT } from '../hooks/useContracts';
import { CONTRACTS } from '../lib/wagmi';

export default function WalletPanel({ isOpen, onClose }) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState('assets');

  // Get native MATIC balance
  const { data: maticBalance } = useBalance({
    address,
  });

  // Get token balances
  const { balance: rdlnBalance, refetchBalance: refetchRDLN } = useRDLN(address);
  const { balance: ronBalance, userTier, tierName, riddlesSolved, tierMultiplier, refetchBalance: refetchRON } = useRON(address);
  const { balance: nftBalance } = useRiddleNFT(address);

  // Auto-refresh balances every 10 seconds
  useEffect(() => {
    if (isOpen && address) {
      const interval = setInterval(() => {
        refetchRDLN();
        refetchRON();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen, address, refetchRDLN, refetchRON]);

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    alert('Address copied to clipboard!');
  };

  const viewOnExplorer = () => {
    window.open(`https://amoy.polygonscan.com/address/${address}`, '_blank');
  };

  if (!isOpen) return null;

  const formatBalance = (balance) => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.0001) return '< 0.0001';
    return num.toLocaleString('en-US', { maximumFractionDigits: 4 });
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 0: return '#8B8B8B'; // NEWCOMER - Gray
      case 1: return '#4169E1'; // SOLVER - Blue
      case 2: return '#9370DB'; // EXPERT - Purple
      case 3: return '#FFD700'; // ORACLE - Gold
      default: return '#8B8B8B';
    }
  };

  return (
    <>
      <div className="wallet-overlay" onClick={onClose}></div>
      <div className="wallet-panel">
        {/* Header */}
        <div className="wallet-header">
          <div className="wallet-address-section">
            <div className="wallet-indicator"></div>
            <div className="address-info">
              <span className="address-label">Connected</span>
              <span className="address-text">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="action-btn" onClick={copyAddress}>
            <i className="fas fa-copy"></i>
            <span>Copy</span>
          </button>
          <button className="action-btn" onClick={viewOnExplorer}>
            <i className="fas fa-external-link-alt"></i>
            <span>Explorer</span>
          </button>
          <button className="action-btn disconnect-action" onClick={handleDisconnect}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Disconnect</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="wallet-tabs">
          <button
            className={`tab ${activeTab === 'assets' ? 'active' : ''}`}
            onClick={() => setActiveTab('assets')}
          >
            <i className="fas fa-coins"></i> Assets
          </button>
          <button
            className={`tab ${activeTab === 'reputation' ? 'active' : ''}`}
            onClick={() => setActiveTab('reputation')}
          >
            <i className="fas fa-trophy"></i> Reputation
          </button>
        </div>

        {/* Content */}
        <div className="wallet-content">
          {activeTab === 'assets' && (
            <div className="assets-view">
              <div className="asset-item native">
                <div className="asset-icon">
                  <i className="fas fa-gem"></i>
                </div>
                <div className="asset-info">
                  <div className="asset-name">MATIC</div>
                  <div className="asset-network">Polygon Amoy</div>
                </div>
                <div className="asset-balance">
                  <div className="balance-amount">{formatBalance(maticBalance?.formatted || '0')}</div>
                  <div className="balance-symbol">MATIC</div>
                </div>
              </div>

              <div className="asset-item token">
                <div className="asset-icon rdln">
                  <i className="fas fa-puzzle-piece"></i>
                </div>
                <div className="asset-info">
                  <div className="asset-name">Riddlen Token</div>
                  <div className="asset-network">RDLN</div>
                </div>
                <div className="asset-balance">
                  <div className="balance-amount">{formatBalance(rdlnBalance)}</div>
                  <div className="balance-symbol">RDLN</div>
                </div>
              </div>

              <div className="asset-item token">
                <div className="asset-icon ron" style={{ background: `linear-gradient(135deg, ${getTierColor(userTier)}, rgba(255, 215, 0, 0.3))` }}>
                  <i className="fas fa-medal"></i>
                </div>
                <div className="asset-info">
                  <div className="asset-name">Reputation Token</div>
                  <div className="asset-network">RON • {tierMultiplier}x Rewards</div>
                </div>
                <div className="asset-balance">
                  <div className="balance-amount">{formatBalance(ronBalance)}</div>
                  <div className="balance-symbol">RON</div>
                </div>
              </div>

              <div className="asset-item nft">
                <div className="asset-icon">
                  <i className="fas fa-scroll"></i>
                </div>
                <div className="asset-info">
                  <div className="asset-name">Riddle NFTs</div>
                  <div className="asset-network">Collectibles</div>
                </div>
                <div className="asset-balance">
                  <div className="balance-amount">{nftBalance}</div>
                  <div className="balance-symbol">NFTs</div>
                </div>
              </div>

              <div className="contract-links">
                <h4>Contract Addresses</h4>
                <a href={`https://amoy.polygonscan.com/address/${CONTRACTS.RDLN}`} target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-external-link-alt"></i> RDLN Contract
                </a>
                <a href={`https://amoy.polygonscan.com/address/${CONTRACTS.RON}`} target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-external-link-alt"></i> RON Contract
                </a>
                <a href={`https://amoy.polygonscan.com/address/${CONTRACTS.RIDDLE_NFT}`} target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-external-link-alt"></i> Riddle NFT Contract
                </a>
              </div>
            </div>
          )}

          {activeTab === 'reputation' && (
            <div className="reputation-view">
              <div className="tier-card" style={{ borderColor: getTierColor(userTier) }}>
                <div className="tier-header">
                  <div className="tier-icon" style={{ background: `linear-gradient(135deg, ${getTierColor(userTier)}, rgba(255, 215, 0, 0.3))` }}>
                    <i className="fas fa-crown"></i>
                  </div>
                  <div className="tier-info">
                    <h3>{tierName}</h3>
                    <p>Tier {userTier}</p>
                  </div>
                </div>

                <div className="tier-stats">
                  <div className="stat">
                    <div className="stat-label">Reward Multiplier</div>
                    <div className="stat-value">{tierMultiplier}x</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Riddles Solved</div>
                    <div className="stat-value">{riddlesSolved}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">RON Balance</div>
                    <div className="stat-value">{formatBalance(ronBalance)}</div>
                  </div>
                </div>

                <div className="tier-description">
                  <p>
                    {userTier === 0 && 'Solve 10 riddles to reach SOLVER tier and unlock 1x rewards!'}
                    {userTier === 1 && 'Solve 50 riddles to reach EXPERT tier and unlock 1.5x rewards!'}
                    {userTier === 2 && 'Solve 100 riddles to reach ORACLE tier and unlock 2x rewards!'}
                    {userTier === 3 && 'You\'ve reached the highest tier! Enjoy maximum 2x rewards!'}
                  </p>
                </div>
              </div>

              <div className="governance-info">
                <h4><i className="fas fa-vote-yea"></i> Governance Rights</h4>
                <p>As a RON holder, you can vote on:</p>
                <ul>
                  <li>Reward structure changes</li>
                  <li>Grand Prize unlock conditions</li>
                  <li>Platform expansion proposals</li>
                  <li>Treasury fund allocation</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .wallet-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 9998;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .wallet-panel {
          position: fixed;
          top: 70px;
          right: 20px;
          width: 420px;
          max-width: calc(100vw - 40px);
          max-height: calc(100vh - 100px);
          background: linear-gradient(135deg, rgba(10, 10, 10, 0.98), rgba(26, 10, 46, 0.98));
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.2);
          z-index: 9999;
          overflow: hidden;
          animation: slideIn 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .wallet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
          background: rgba(255, 215, 0, 0.05);
        }

        .wallet-address-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .wallet-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #00FF00;
          box-shadow: 0 0 10px #00FF00;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .address-info {
          display: flex;
          flex-direction: column;
        }

        .address-label {
          font-size: 0.75rem;
          color: #00FF00;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .address-text {
          font-size: 1rem;
          color: #FFD700;
          font-weight: 700;
          font-family: 'Courier New', monospace;
        }

        .close-btn {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          color: #FFD700;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .close-btn:hover {
          background: rgba(255, 99, 71, 0.2);
          border-color: rgba(255, 99, 71, 0.5);
          color: #FF6347;
          transform: rotate(90deg);
        }

        .quick-actions {
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .action-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          padding: 0.75rem;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 12px;
          color: #FFD700;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.85rem;
        }

        .action-btn i {
          font-size: 1.2rem;
        }

        .action-btn:hover {
          background: rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.4);
          transform: translateY(-2px);
        }

        .disconnect-action {
          background: rgba(255, 99, 71, 0.1);
          border-color: rgba(255, 99, 71, 0.3);
          color: #FF6347;
        }

        .disconnect-action:hover {
          background: rgba(255, 99, 71, 0.2);
          border-color: rgba(255, 99, 71, 0.5);
        }

        .wallet-tabs {
          display: flex;
          padding: 0 1.5rem;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
          background: rgba(0, 0, 0, 0.2);
        }

        .tab {
          flex: 1;
          padding: 1rem;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          color: #888;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .tab:hover {
          color: #FFD700;
          background: rgba(255, 215, 0, 0.05);
        }

        .tab.active {
          color: #FFD700;
          border-bottom-color: #FFD700;
        }

        .wallet-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .wallet-content::-webkit-scrollbar {
          width: 6px;
        }

        .wallet-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }

        .wallet-content::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.3);
          border-radius: 3px;
        }

        .wallet-content::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 215, 0, 0.5);
        }

        .assets-view {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .asset-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 215, 0, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .asset-item:hover {
          background: rgba(255, 215, 0, 0.1);
          border-color: rgba(255, 215, 0, 0.3);
          transform: translateX(4px);
        }

        .asset-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
          border: 2px solid rgba(255, 215, 0, 0.3);
          color: #FFD700;
        }

        .asset-icon.rdln {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.3));
        }

        .asset-icon.ron {
          background: linear-gradient(135deg, rgba(147, 112, 219, 0.3), rgba(255, 215, 0, 0.3));
        }

        .asset-info {
          flex: 1;
        }

        .asset-name {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .asset-network {
          font-size: 0.85rem;
          color: #888;
        }

        .asset-balance {
          text-align: right;
        }

        .balance-amount {
          font-size: 1.1rem;
          font-weight: 700;
          color: #FFD700;
          font-family: 'Courier New', monospace;
        }

        .balance-symbol {
          font-size: 0.8rem;
          color: #888;
          margin-top: 0.25rem;
        }

        .contract-links {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          border: 1px solid rgba(255, 215, 0, 0.1);
        }

        .contract-links h4 {
          color: #FFD700;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .contract-links a {
          display: block;
          padding: 0.5rem;
          color: #888;
          text-decoration: none;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          border-radius: 6px;
        }

        .contract-links a:hover {
          color: #FFD700;
          background: rgba(255, 215, 0, 0.1);
          padding-left: 0.75rem;
        }

        .contract-links a i {
          margin-right: 0.5rem;
        }

        .reputation-view {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .tier-card {
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 16px;
          padding: 1.5rem;
        }

        .tier-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .tier-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          border: 2px solid rgba(255, 215, 0, 0.5);
          color: #FFD700;
        }

        .tier-info h3 {
          color: #FFD700;
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .tier-info p {
          color: #888;
          font-size: 0.9rem;
        }

        .tier-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .stat {
          text-align: center;
          padding: 1rem;
          background: rgba(255, 215, 0, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 215, 0, 0.2);
        }

        .stat-label {
          font-size: 0.75rem;
          color: #888;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: #FFD700;
        }

        .tier-description {
          padding: 1rem;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 12px;
          border-left: 3px solid #FFD700;
        }

        .tier-description p {
          color: #ccc;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
        }

        .governance-info {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .governance-info h4 {
          color: #FFD700;
          font-size: 1.1rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .governance-info p {
          color: #ccc;
          margin-bottom: 1rem;
        }

        .governance-info ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .governance-info li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          color: #888;
          position: relative;
        }

        .governance-info li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #FFD700;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .wallet-panel {
            right: 10px;
            top: 60px;
            width: calc(100vw - 20px);
            max-height: calc(100vh - 80px);
          }

          .tier-stats {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            flex-wrap: wrap;
          }

          .action-btn {
            flex: 1 1 calc(33.333% - 0.5rem);
            min-width: 90px;
          }
        }
      `}</style>
    </>
  );
}