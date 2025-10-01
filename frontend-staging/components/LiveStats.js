import { useRDLNStats, useRiddleStats, formatNumber, formatPercentage } from '../hooks/useContractStats';

export default function LiveStats() {
  const rdlnStats = useRDLNStats();
  const riddleStats = useRiddleStats();

  return (
    <div className="live-stats-container">
      <div className="stats-header">
        <h3>📊 Live Blockchain Data</h3>
        <div className="live-indicator">
          <span className="pulse-dot"></span>
          <span>Live</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-label">Total Burned</div>
            <div className="stat-value">
              {rdlnStats.isLoading ? '...' : formatNumber(rdlnStats.totalBurned)} RDLN
            </div>
            <div className="stat-subtext">
              {rdlnStats.isLoading ? '' : formatPercentage(rdlnStats.totalBurned, rdlnStats.totalSupply) + ' of supply'}
            </div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Prize Pool</div>
            <div className="stat-value">
              {rdlnStats.isLoading ? '...' : formatNumber(rdlnStats.prizePool)} RDLN
            </div>
            <div className="stat-subtext">Locked in riddles</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">🧩</div>
          <div className="stat-content">
            <div className="stat-label">Riddles Minted</div>
            <div className="stat-value">
              {riddleStats.isLoading ? '...' : riddleStats.totalMinted}
            </div>
            <div className="stat-subtext">NFTs created</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-label">Circulating Supply</div>
            <div className="stat-value">
              {rdlnStats.isLoading ? '...' : formatNumber(rdlnStats.circulatingSupply)} RDLN
            </div>
            <div className="stat-subtext">
              {rdlnStats.isLoading ? '' : formatPercentage(rdlnStats.circulatingSupply, rdlnStats.totalSupply) + ' of supply'}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .live-stats-container {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          margin: 2rem 0;
          backdrop-filter: blur(10px);
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .stats-header h3 {
          color: #FFD700;
          font-size: 1.5rem;
          margin: 0;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #10b981;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse-live 2s ease-in-out infinite;
        }

        @keyframes pulse-live {
          0%, 100% { opacity: 1; box-shadow: 0 0 5px #10b981; }
          50% { opacity: 0.5; box-shadow: 0 0 15px #10b981; }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .stat-box {
          background: rgba(255, 215, 0, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.15);
          border-radius: 15px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .stat-box:hover {
          transform: translateY(-3px);
          border-color: rgba(255, 215, 0, 0.3);
          box-shadow: 0 10px 25px rgba(255, 215, 0, 0.15);
        }

        .stat-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #aaaaaa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFD700;
          margin-bottom: 0.25rem;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .stat-subtext {
          font-size: 0.75rem;
          color: #888888;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .stat-value {
            font-size: 1.2rem;
          }

          .stat-icon {
            font-size: 1.5rem;
          }

          .live-stats-container {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}