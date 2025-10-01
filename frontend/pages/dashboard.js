import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';
import { useAccount } from 'wagmi';
import { useRDLN, useRON, useRiddleNFT, useTreasury } from '../hooks/useContracts';
import { usePlatformStats } from '../hooks/usePlatformStats';
import { useLeaderboard } from '../hooks/useLeaderboard';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const rdln = useRDLN(address);
  const ron = useRON(address);
  const riddleNFT = useRiddleNFT(address);

  // Fetch live blockchain data
  const platformStats = usePlatformStats();
  const treasury = useTreasury();
  const { topSolvers } = useLeaderboard(5);

  // Recent activity requires event indexing - coming soon
  const [recentActivity, setRecentActivity] = useState([]);

  return (
    <>
      <Head>
        <title>Dashboard - Riddlen | Live Platform Statistics</title>
        <meta name="description" content="Riddlen Dashboard: Real-time platform statistics, leaderboards, treasury status, and marketplace overview." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">📊</div>
        <div className="floating-riddle">🏆</div>
        <div className="floating-riddle">💎</div>
      </div>

      <Header currentPage="dashboard" />

      <main className="dashboard-main">
        <div className="container">
          {/* Page Header */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">
              <i className="fas fa-chart-line"></i> Platform Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Real-time statistics from the Riddlen Proof-of-Solve network
            </p>
            <div className="live-indicator">
              <span className="pulse-dot"></span>
              <span>LIVE ON POLYGON AMOY TESTNET</span>
            </div>
          </div>

          {/* User Stats Section (if connected) */}
          {isConnected && (
            <div className="section-card user-stats-section">
              <h2 className="section-title">
                <i className="fas fa-user-circle"></i> Your Stats
              </h2>
              <div className="stats-grid">
                <div className="stat-card stat-gold">
                  <div className="stat-icon"><i className="fas fa-coins"></i></div>
                  <div className="stat-content">
                    <div className="stat-label">RDLN Balance</div>
                    <div className="stat-value">{rdln.balance}</div>
                    <div className="stat-subtext">Utility Token</div>
                  </div>
                </div>

                <div className="stat-card stat-purple">
                  <div className="stat-icon"><i className="fas fa-crown"></i></div>
                  <div className="stat-content">
                    <div className="stat-label">RON Tier</div>
                    <div className="stat-value">{ron.tierName}</div>
                    <div className="stat-subtext">{ron.tierMultiplier}x Rewards</div>
                  </div>
                </div>

                <div className="stat-card stat-green">
                  <div className="stat-icon"><i className="fas fa-brain"></i></div>
                  <div className="stat-content">
                    <div className="stat-label">Riddles Solved</div>
                    <div className="stat-value">{ron.riddlesSolved}</div>
                    <div className="stat-subtext">Total Completed</div>
                  </div>
                </div>

                <div className="stat-card stat-blue">
                  <div className="stat-icon"><i className="fas fa-gem"></i></div>
                  <div className="stat-content">
                    <div className="stat-label">NFTs Owned</div>
                    <div className="stat-value">{riddleNFT.balance}</div>
                    <div className="stat-subtext">Active Riddles</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Platform Statistics */}
          <div className="section-card">
            <h2 className="section-title">
              <i className="fas fa-globe"></i> Platform Statistics
            </h2>
            <div className="stats-grid">
              <div className="stat-card stat-gold">
                <div className="stat-icon"><i className="fas fa-coins"></i></div>
                <div className="stat-content">
                  <div className="stat-label">Total RDLN Supply</div>
                  <div className="stat-value">
                    {platformStats.isLoading ? 'Loading...' : platformStats.totalRDLNSupply}
                  </div>
                  <div className="stat-subtext">Maximum Supply</div>
                </div>
              </div>

              <div className="stat-card stat-red">
                <div className="stat-icon"><i className="fas fa-fire"></i></div>
                <div className="stat-content">
                  <div className="stat-label">Total Burned</div>
                  <div className="stat-value">
                    {treasury.isLoading ? 'Loading...' : treasury.totalBurned}
                  </div>
                  <div className="stat-subtext">Deflationary Mechanism</div>
                </div>
              </div>

              <div className="stat-card stat-green">
                <div className="stat-icon"><i className="fas fa-trophy"></i></div>
                <div className="stat-content">
                  <div className="stat-label">Grand Prize Pool</div>
                  <div className="stat-value">
                    {treasury.isLoading ? 'Loading...' : treasury.grandPrizeBalance}
                  </div>
                  <div className="stat-subtext">25% of All Fees</div>
                </div>
              </div>

              <div className="stat-card stat-blue">
                <div className="stat-icon"><i className="fas fa-vault"></i></div>
                <div className="stat-content">
                  <div className="stat-label">Treasury Balance</div>
                  <div className="stat-value">
                    {treasury.isLoading ? 'Loading...' : treasury.treasuryBalance}
                  </div>
                  <div className="stat-subtext">Development Fund</div>
                </div>
              </div>

              <div className="stat-card stat-purple">
                <div className="stat-icon"><i className="fas fa-puzzle-piece"></i></div>
                <div className="stat-content">
                  <div className="stat-label">Total Riddles Solved</div>
                  <div className="stat-value">
                    {platformStats.isLoading ? 'Loading...' : platformStats.totalRiddlesSolved}
                  </div>
                  <div className="stat-subtext">Proof-of-Solve Network</div>
                </div>
              </div>

              <div className="stat-card stat-orange">
                <div className="stat-icon"><i className="fas fa-users"></i></div>
                <div className="stat-content">
                  <div className="stat-label">Total Players</div>
                  <div className="stat-value">
                    {platformStats.isLoading ? 'Loading...' : platformStats.totalPlayers}
                  </div>
                  <div className="stat-subtext">Active Community</div>
                </div>
              </div>

              <div className="stat-card stat-cyan">
                <div className="stat-icon"><i className="fas fa-clock"></i></div>
                <div className="stat-content">
                  <div className="stat-label">Avg. Solve Time</div>
                  <div className="stat-value">
                    {platformStats.isLoading ? 'Loading...' : platformStats.avgSolveTime}
                  </div>
                  <div className="stat-subtext">Per Riddle</div>
                </div>
              </div>

              <div className="stat-card stat-pink">
                <div className="stat-icon"><i className="fas fa-gem"></i></div>
                <div className="stat-content">
                  <div className="stat-label">NFTs Minted</div>
                  <div className="stat-value">
                    {platformStats.isLoading ? 'Loading...' : platformStats.totalNFTsMinted}
                  </div>
                  <div className="stat-subtext">Total Supply</div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="dashboard-grid">
            {/* Leaderboard */}
            <div className="section-card">
              <h2 className="section-title">
                <i className="fas fa-trophy"></i> Top Solvers
              </h2>
              <div className="leaderboard">
                {riddleNFT.totalSupply === 0 || topSolvers.length === 0 ? (
                  <div className="coming-soon">
                    <i className="fas fa-trophy" style={{ fontSize: '2rem', color: '#FFD700', marginBottom: '1rem' }}></i>
                    <h3 style={{ color: '#FFD700', marginBottom: '0.5rem' }}>No Solvers Yet</h3>
                    <p style={{ color: '#aaa', textAlign: 'center' }}>
                      The leaderboard will populate once riddles are minted and solved.
                      Be the first to compete for the top spot!
                    </p>
                  </div>
                ) : (
                  topSolvers.map((solver) => (
                    <div key={solver.rank} className="leaderboard-item">
                      <div className="leaderboard-rank">
                        {solver.rank === 1 && <span className="rank-medal gold">🥇</span>}
                        {solver.rank === 2 && <span className="rank-medal silver">🥈</span>}
                        {solver.rank === 3 && <span className="rank-medal bronze">🥉</span>}
                        {solver.rank > 3 && <span className="rank-number">#{solver.rank}</span>}
                      </div>
                      <div className="leaderboard-content">
                        <div className="leaderboard-address">{solver.address}</div>
                        <div className="leaderboard-stats">
                          <span className="leaderboard-stat">
                            <i className="fas fa-brain"></i> {solver.solved} solved
                          </span>
                          <span className="leaderboard-stat">
                            <i className="fas fa-crown"></i> {solver.ron} RON
                          </span>
                        </div>
                      </div>
                      <div className="leaderboard-tier">
                        <span className={`tier-badge tier-${solver.tier.toLowerCase()}`}>
                          {solver.tier}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="section-footer">
                <Link href="/leaderboard" className="btn-link">
                  View Full Leaderboard <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="section-card">
              <h2 className="section-title">
                <i className="fas fa-stream"></i> Recent Activity
              </h2>
              <div className="activity-feed">
                {recentActivity.length === 0 ? (
                  <div className="coming-soon">
                    <i className="fas fa-clock" style={{ fontSize: '2rem', color: '#FFD700', marginBottom: '1rem' }}></i>
                    <h3 style={{ color: '#FFD700', marginBottom: '0.5rem' }}>Coming Soon</h3>
                    <p style={{ color: '#aaa', textAlign: 'center' }}>
                      Real-time activity feed will display once blockchain event indexing is implemented.
                      This will show mints, solves, and tier upgrades as they happen.
                    </p>
                  </div>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className={`activity-icon activity-${activity.type}`}>
                        {activity.type === 'solve' && <i className="fas fa-check-circle"></i>}
                        {activity.type === 'mint' && <i className="fas fa-plus-circle"></i>}
                        {activity.type === 'tier' && <i className="fas fa-arrow-up"></i>}
                      </div>
                      <div className="activity-content">
                        <div className="activity-text">
                          {activity.type === 'solve' && (
                            <>
                              <span className="activity-user">{activity.user}</span> solved{' '}
                              <span className="activity-highlight">{activity.riddle}</span>
                              {activity.reward && (
                                <span className="activity-reward"> +{activity.reward}</span>
                              )}
                            </>
                          )}
                          {activity.type === 'mint' && (
                            <>
                              <span className="activity-user">{activity.user}</span> minted{' '}
                              <span className="activity-highlight">{activity.riddle}</span>
                            </>
                          )}
                          {activity.type === 'tier' && (
                            <>
                              <span className="activity-user">{activity.user}</span> reached{' '}
                              <span className="activity-highlight">{activity.tier}</span> tier
                            </>
                          )}
                        </div>
                        <div className="activity-time">{activity.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="section-footer">
                <Link href="/activity" className="btn-link">
                  View All Activity <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Contract Information */}
          <div className="section-card">
            <h2 className="section-title">
              <i className="fas fa-file-contract"></i> Smart Contracts
            </h2>
            <div className="contracts-grid">
              <div className="contract-card">
                <div className="contract-icon">
                  <i className="fas fa-coins"></i>
                </div>
                <h3>RDLN Token</h3>
                <p className="contract-address">0x1330...B0eB</p>
                <div className="contract-links">
                  <a
                    href="https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contract-link"
                  >
                    <i className="fas fa-external-link-alt"></i> View on PolygonScan
                  </a>
                </div>
              </div>

              <div className="contract-card">
                <div className="contract-icon">
                  <i className="fas fa-crown"></i>
                </div>
                <h3>RON Token</h3>
                <p className="contract-address">0xD86b...b635</p>
                <div className="contract-links">
                  <a
                    href="https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contract-link"
                  >
                    <i className="fas fa-external-link-alt"></i> View on PolygonScan
                  </a>
                </div>
              </div>

              <div className="contract-card">
                <div className="contract-icon">
                  <i className="fas fa-gem"></i>
                </div>
                <h3>Riddle NFT</h3>
                <p className="contract-address">0x529e...e9E3</p>
                <div className="contract-links">
                  <a
                    href="https://amoy.polygonscan.com/address/0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contract-link"
                  >
                    <i className="fas fa-external-link-alt"></i> View on PolygonScan
                  </a>
                </div>
              </div>

              <div className="contract-card">
                <div className="contract-icon">
                  <i className="fas fa-parachute-box"></i>
                </div>
                <h3>Airdrop Contract</h3>
                <p className="contract-address">0x3302...B0A13</p>
                <div className="contract-links">
                  <a
                    href="https://amoy.polygonscan.com/address/0x330275259AfCeC8822A861ecbbdfD026dB1B0A13"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contract-link"
                  >
                    <i className="fas fa-external-link-alt"></i> View on PolygonScan
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2 className="quick-actions-title">
              <i className="fas fa-rocket"></i> Quick Actions
            </h2>
            <div className="quick-actions-grid">
              <a href="/game" className="quick-action-card play-card">
                <div className="quick-action-icon play-icon">
                  <i className="fas fa-play-circle"></i>
                </div>
                <h3 className="play-title">Play Game</h3>
                <p className="play-text">Mint and solve riddles to earn RDLN tokens</p>
                <div className="quick-action-arrow play-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </a>

              <a href="/airdrop" className="quick-action-card airdrop-card">
                <div className="quick-action-icon airdrop-icon">
                  <i className="fas fa-parachute-box"></i>
                </div>
                <h3 className="airdrop-title">Claim Airdrop</h3>
                <p className="airdrop-text">Check eligibility and claim your RDLN</p>
                <div className="quick-action-arrow airdrop-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </a>

              <a href="/docs" className="quick-action-card docs-card">
                <div className="quick-action-icon docs-icon">
                  <i className="fas fa-book-open"></i>
                </div>
                <h3 className="docs-title">Documentation</h3>
                <p className="docs-text">Learn about Riddlen's Proof-of-Solve</p>
                <div className="quick-action-arrow docs-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </a>

              <a
                href="https://github.com/RiddlenBaba/riddlen/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="quick-action-card community-card"
              >
                <div className="quick-action-icon community-icon">
                  <i className="fab fa-github"></i>
                </div>
                <h3 className="community-title">Community</h3>
                <p className="community-text">Join discussions and contribute ideas</p>
                <div className="quick-action-arrow community-arrow">
                  <i className="fas fa-external-link-alt"></i>
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Riddlen Economy</h3>
              <p>The world's first Proof-of-Solve blockchain where human intellect powers decentralized finance through cryptographic riddles and NFT gaming.</p>
              <div className="social-links">
                <a href="https://x.com/RiddlenToken" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="https://t.me/RiddlenToken" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><i className="fab fa-telegram"></i></a>
                <a href="https://t.me/RiddlenCommunity" target="_blank" rel="noopener noreferrer" aria-label="Community"><i className="fas fa-users"></i></a>
                <a href="https://github.com/RiddlenBaba/riddlen/discussions" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
              </div>
            </div>
            <div className="footer-section">
              <h3>Platform</h3>
              <a href="/game">Play Demo</a>
              <a href="/docs">Documentation</a>
              <a href="/dashboard">Dashboard</a>
              <a href="/airdrop">Airdrop</a>
              <a href="https://github.com/RiddlenBaba/riddlen" target="_blank">GitHub</a>
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
              <a href="/docs" target="_blank">Integration Guide</a>
              <a href="https://metamask.io/" target="_blank">MetaMask</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Riddlen. The Web3 Riddle Economy. Built on Polygon with Proof-of-Solve.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .dashboard-main {
          padding-top: 100px;
          padding-bottom: 4rem;
          min-height: 100vh;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .dashboard-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dashboard-title i {
          color: #FFD700;
          -webkit-text-fill-color: #FFD700;
        }

        .dashboard-subtitle {
          font-size: 1.2rem;
          color: #cccccc;
          margin-bottom: 1rem;
        }

        .live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 25px;
          padding: 0.5rem 1rem;
          color: #10b981;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 5px #10b981;
          }
          50% {
            opacity: 0.5;
            box-shadow: 0 0 15px #10b981;
          }
        }

        .section-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
        }

        .user-stats-section {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #FFD700;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-title i {
          font-size: 1.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 15px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.4);
        }

        .stat-gold { border-color: rgba(255, 215, 0, 0.3); }
        .stat-purple { border-color: rgba(168, 85, 247, 0.3); }
        .stat-green { border-color: rgba(16, 185, 129, 0.3); }
        .stat-blue { border-color: rgba(59, 130, 246, 0.3); }
        .stat-red { border-color: rgba(239, 68, 68, 0.3); }
        .stat-orange { border-color: rgba(251, 146, 60, 0.3); }
        .stat-cyan { border-color: rgba(34, 211, 238, 0.3); }
        .stat-pink { border-color: rgba(236, 72, 153, 0.3); }

        .stat-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .stat-gold .stat-icon { color: #FFD700; }
        .stat-purple .stat-icon { color: #a855f7; }
        .stat-green .stat-icon { color: #10b981; }
        .stat-blue .stat-icon { color: #3b82f6; }
        .stat-red .stat-icon { color: #ef4444; }
        .stat-orange .stat-icon { color: #fb923c; }
        .stat-cyan .stat-icon { color: #22d3ee; }
        .stat-pink .stat-icon { color: #ec4899; }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #aaaaaa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.25rem;
        }

        .stat-subtext {
          font-size: 0.85rem;
          color: #888888;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .leaderboard {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .leaderboard-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.15);
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .leaderboard-item:hover {
          background: rgba(255, 215, 0, 0.05);
          border-color: rgba(255, 215, 0, 0.3);
        }

        .leaderboard-rank {
          flex-shrink: 0;
          width: 50px;
          text-align: center;
        }

        .rank-medal {
          font-size: 2rem;
        }

        .rank-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFD700;
        }

        .leaderboard-content {
          flex: 1;
        }

        .leaderboard-address {
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .leaderboard-stats {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .leaderboard-stat {
          font-size: 0.9rem;
          color: #aaaaaa;
        }

        .leaderboard-stat i {
          color: #FFD700;
          margin-right: 0.25rem;
        }

        .leaderboard-tier {
          flex-shrink: 0;
        }

        .tier-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .tier-oracle {
          background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
          border: 1px solid rgba(255, 215, 0, 0.4);
          color: #FFD700;
        }

        .tier-expert {
          background: linear-gradient(45deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2));
          border: 1px solid rgba(168, 85, 247, 0.4);
          color: #a855f7;
        }

        .activity-feed {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.1);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: rgba(255, 215, 0, 0.05);
          border-color: rgba(255, 215, 0, 0.2);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .activity-solve {
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #10b981;
        }

        .activity-mint {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.4);
          color: #3b82f6;
        }

        .activity-tier {
          background: rgba(168, 85, 247, 0.2);
          border: 1px solid rgba(168, 85, 247, 0.4);
          color: #a855f7;
        }

        .activity-content {
          flex: 1;
        }

        .activity-text {
          color: #cccccc;
          margin-bottom: 0.25rem;
        }

        .activity-user {
          color: #FFD700;
          font-weight: 600;
        }

        .activity-highlight {
          color: #FFA500;
          font-weight: 600;
        }

        .activity-reward {
          color: #10b981;
          font-weight: 700;
        }

        .activity-time {
          font-size: 0.85rem;
          color: #888888;
        }

        .coming-soon {
          padding: 3rem 2rem;
          text-align: center;
          background: rgba(255, 215, 0, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 15px;
        }

        .coming-soon p {
          max-width: 400px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .section-footer {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 215, 0, 0.1);
          text-align: center;
        }

        .btn-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #FFD700;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-link:hover {
          color: #FFA500;
          gap: 0.75rem;
        }

        .contracts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .contract-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .contract-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.4);
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.15);
        }

        .contract-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 1rem;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          color: #FFD700;
        }

        .contract-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .contract-address {
          font-family: 'Courier New', monospace;
          color: #888888;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .contract-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .contract-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 8px;
          color: #FFD700;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .contract-link:hover {
          background: rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.5);
        }

        /* Quick Actions Section */
        .quick-actions-section {
          margin-top: 3rem;
          padding: 3rem;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.03), rgba(255, 165, 0, 0.03));
          border: 2px solid rgba(255, 215, 0, 0.2);
          border-radius: 25px;
          backdrop-filter: blur(10px);
        }

        .quick-actions-title {
          font-size: 2rem;
          font-weight: 800;
          color: #FFD700;
          margin-bottom: 2rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .quick-action-card {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3));
          border: 2px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          text-decoration: none;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* Color-coded card borders and backgrounds */
        .play-card {
          border: 2px solid rgba(255, 215, 0, 0.4);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
        }

        .airdrop-card {
          border: 2px solid rgba(16, 185, 129, 0.4);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05));
        }

        .docs-card {
          border: 2px solid rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.05));
        }

        .community-card {
          border: 2px solid rgba(139, 92, 246, 0.4);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(124, 58, 237, 0.05));
        }

        .quick-action-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.6s ease;
        }

        .quick-action-card:hover::before {
          left: 100%;
        }

        .play-card:hover {
          transform: translateY(-10px);
          border-color: rgba(255, 215, 0, 0.8);
          box-shadow: 0 20px 50px rgba(255, 215, 0, 0.3);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1));
        }

        .airdrop-card:hover {
          transform: translateY(-10px);
          border-color: rgba(16, 185, 129, 0.8);
          box-shadow: 0 20px 50px rgba(16, 185, 129, 0.3);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1));
        }

        .docs-card:hover {
          transform: translateY(-10px);
          border-color: rgba(59, 130, 246, 0.8);
          box-shadow: 0 20px 50px rgba(59, 130, 246, 0.3);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1));
        }

        .community-card:hover {
          transform: translateY(-10px);
          border-color: rgba(139, 92, 246, 0.8);
          box-shadow: 0 20px 50px rgba(139, 92, 246, 0.3);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1));
        }

        .quick-action-icon {
          width: 80px;
          height: 80px;
          margin-bottom: 1.5rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          transition: all 0.4s ease;
          position: relative;
          z-index: 1;
        }

        .play-icon {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
          border: 2px solid rgba(255, 215, 0, 0.4);
          color: #FFD700;
        }

        .airdrop-icon {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
          border: 2px solid rgba(16, 185, 129, 0.4);
          color: #10b981;
        }

        .docs-icon {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2));
          border: 2px solid rgba(59, 130, 246, 0.4);
          color: #3b82f6;
        }

        .community-icon {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.2));
          border: 2px solid rgba(139, 92, 246, 0.4);
          color: #8b5cf6;
        }

        .quick-action-card:hover .quick-action-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .quick-action-card h3 {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          position: relative;
          z-index: 1;
        }

        /* Color-coded titles */
        .play-title {
          color: #FFD700;
        }

        .airdrop-title {
          color: #10b981;
        }

        .docs-title {
          color: #3b82f6;
        }

        .community-title {
          color: #8b5cf6;
        }

        .quick-action-card p {
          color: #cccccc;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        /* Color-coded text */
        .play-text {
          color: rgba(255, 215, 0, 0.8);
        }

        .airdrop-text {
          color: rgba(16, 185, 129, 0.8);
        }

        .docs-text {
          color: rgba(59, 130, 246, 0.8);
        }

        .community-text {
          color: rgba(139, 92, 246, 0.8);
        }

        .quick-action-arrow {
          position: absolute;
          bottom: 1.5rem;
          right: 1.5rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        /* Color-coded arrows */
        .play-arrow {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          color: #FFD700;
        }

        .airdrop-arrow {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
        }

        .docs-arrow {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #3b82f6;
        }

        .community-arrow {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #8b5cf6;
        }

        .play-card:hover .play-arrow {
          background: rgba(255, 215, 0, 0.3);
          transform: translateX(5px);
        }

        .airdrop-card:hover .airdrop-arrow {
          background: rgba(16, 185, 129, 0.3);
          transform: translateX(5px);
        }

        .docs-card:hover .docs-arrow {
          background: rgba(59, 130, 246, 0.3);
          transform: translateX(5px);
        }

        .community-card:hover .community-arrow {
          background: rgba(139, 92, 246, 0.3);
          transform: translateX(5px);
        }

        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .dashboard-title {
            font-size: 2rem;
          }

          .dashboard-subtitle {
            font-size: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-icon {
            font-size: 2rem;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .section-card {
            padding: 1.5rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .contracts-grid, .quick-actions-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions-section {
            padding: 1.5rem;
            margin-top: 2rem;
          }

          .quick-actions-title {
            font-size: 1.5rem;
          }

          .quick-action-card {
            padding: 1.5rem;
          }

          .quick-action-icon {
            width: 60px;
            height: 60px;
            font-size: 2rem;
          }

          .quick-action-card h3 {
            font-size: 1.1rem;
          }

          .quick-action-card p {
            font-size: 0.9rem;
          }

          .quick-action-arrow {
            width: 35px;
            height: 35px;
            font-size: 0.9rem;
          }
        }

        .footer {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          padding: 4rem 0 2rem;
          margin-top: 4rem;
          border-top: 1px solid rgba(255, 215, 0, 0.1);
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-section h3 {
          color: #FFD700;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .footer-section p, .footer-section a {
          color: #cccccc;
          text-decoration: none;
          margin-bottom: 0.5rem;
          display: block;
        }

        .footer-section a:hover {
          color: #FFD700;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-links a {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 215, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFD700;
          transition: all 0.3s ease;
        }

        .social-links a:hover {
          background: rgba(255, 215, 0, 0.3);
          transform: translateY(-2px);
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 215, 0, 0.1);
          color: #888;
        }
      `}</style>
    </>
  );
}