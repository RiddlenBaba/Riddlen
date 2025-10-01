import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRDLN, useRON, useRiddleNFT, useRewardCalculator } from '../hooks/useContracts';

export default function RiddleGame() {
  const { address, isConnected } = useAccount();
  const [selectedRiddleId, setSelectedRiddleId] = useState(null);
  const [solution, setSolution] = useState('');
  const [showRewardCalculator, setShowRewardCalculator] = useState(false);
  const [antiCheatTimer, setAntiCheatTimer] = useState(0);

  const rdln = useRDLN(address);
  const ron = useRON(address);
  const riddleNFT = useRiddleNFT(address);
  const rewardCalculator = useRewardCalculator();

  // Anti-cheat timer (30 seconds between attempts)
  useEffect(() => {
    if (antiCheatTimer > 0) {
      const timer = setTimeout(() => setAntiCheatTimer(antiCheatTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [antiCheatTimer]);

  const handleMintRiddle = async () => {
    try {
      await riddleNFT.mintRiddle();
      riddleNFT.refetchBalance();
      rdln.refetchBalance();
    } catch (error) {
      alert('Failed to mint riddle: ' + error.message);
    }
  };

  const handleSubmitSolution = async () => {
    if (!selectedRiddleId || !solution.trim()) return;

    if (antiCheatTimer > 0) {
      alert(`Please wait ${antiCheatTimer} seconds before next attempt`);
      return;
    }

    try {
      await riddleNFT.submitSolution(selectedRiddleId, solution);
      setAntiCheatTimer(30); // Start 30-second cooldown
      setSolution('');
      riddleNFT.refetchBalance();
      rdln.refetchBalance();
      ron.refetchBalance();
    } catch (error) {
      alert('Failed to submit solution: ' + error.message);
    }
  };

  if (!isConnected) {
    return (
      <>
        <div className="connect-wallet-container">
          <div className="connect-wallet-card">
            <div className="connect-icon">
              <i className="fas fa-wallet"></i>
            </div>
            <h2>Connect Your Wallet</h2>
            <p>Connect your wallet to start solving riddles and earning RDLN tokens!</p>
            <div className="connect-features">
              <div className="connect-feature">
                <i className="fas fa-brain"></i>
                <span>Solve Riddles</span>
              </div>
              <div className="connect-feature">
                <i className="fas fa-coins"></i>
                <span>Earn RDLN</span>
              </div>
              <div className="connect-feature">
                <i className="fas fa-chart-line"></i>
                <span>Climb Tiers</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .connect-wallet-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 2rem;
          }

          .connect-wallet-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
            border: 2px solid rgba(255, 215, 0, 0.3);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            backdrop-filter: blur(10px);
          }

          .connect-icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 2rem;
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
            border: 2px solid rgba(255, 215, 0, 0.4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: #FFD700;
            animation: float-icon 3s ease-in-out infinite;
          }

          @keyframes float-icon {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          .connect-wallet-card h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #FFD700;
            margin-bottom: 1rem;
          }

          .connect-wallet-card p {
            font-size: 1.1rem;
            color: #cccccc;
            margin-bottom: 2rem;
            line-height: 1.6;
          }

          .connect-features {
            display: flex;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
          }

          .connect-feature {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }

          .connect-feature i {
            font-size: 2rem;
            color: #FFA500;
          }

          .connect-feature span {
            color: #aaaaaa;
            font-size: 0.9rem;
            font-weight: 600;
          }

          @media (max-width: 768px) {
            .connect-wallet-container {
              padding: 1rem;
            }

            .connect-wallet-card {
              padding: 2rem 1.5rem;
            }

            .connect-icon {
              width: 80px;
              height: 80px;
              font-size: 2.5rem;
            }

            .connect-wallet-card h2 {
              font-size: 1.5rem;
            }

            .connect-wallet-card p {
              font-size: 1rem;
            }

            .connect-features {
              gap: 1.5rem;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="riddle-game-container">
        {/* Header with User Stats */}
        <div className="stats-grid">
          <div className="stat-card stat-rdln">
            <div className="stat-icon">
              <i className="fas fa-coins"></i>
            </div>
            <h3>RDLN Balance</h3>
            <p className="stat-value">{rdln.balance}</p>
          </div>

          <div className="stat-card stat-ron">
            <div className="stat-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <h3>RON Tier</h3>
            <p className="stat-tier">{ron.tierName}</p>
            <p className="stat-multiplier">{ron.tierMultiplier}x rewards</p>
          </div>

          <div className="stat-card stat-solved">
            <div className="stat-icon">
              <i className="fas fa-brain"></i>
            </div>
            <h3>Riddles Solved</h3>
            <p className="stat-value">{ron.riddlesSolved}</p>
          </div>

          <div className="stat-card stat-nft">
            <div className="stat-icon">
              <i className="fas fa-puzzle-piece"></i>
            </div>
            <h3>My Riddles</h3>
            <p className="stat-value">{riddleNFT.balance}</p>
          </div>
        </div>

        {/* RON Tier Progress */}
        <div className="section-card">
          <h3 className="section-title">
            <i className="fas fa-chart-line"></i> RON Progression System
          </h3>

          <div className="tier-cards-grid">
            {['NEWCOMER', 'SOLVER', 'EXPERT', 'ORACLE'].map((tier, index) => (
              <div
                key={tier}
                className={`tier-card ${
                  ron.userTier === index
                    ? 'tier-current'
                    : ron.userTier > index
                    ? 'tier-completed'
                    : 'tier-locked'
                }`}
              >
                <div className="tier-icon-large">
                  {index === 0 && '🌱'}
                  {index === 1 && '🧩'}
                  {index === 2 && '🎯'}
                  {index === 3 && '👑'}
                </div>
                <h4>{tier}</h4>
                <p className="tier-multiplier">{[0.5, 1.0, 1.5, 2.0][index]}x rewards</p>
              </div>
            ))}
          </div>

          {!ron.tierProgress.isMaxTier && (
            <div className="progress-section">
              <div className="progress-header">
                <span>Progress to next tier</span>
                <span className="progress-percentage">{ron.tierProgress.progress.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${ron.tierProgress.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tiered Reward Calculator */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">
              <i className="fas fa-calculator"></i> Tiered Reward Calculator
            </h3>
            <button
              onClick={() => setShowRewardCalculator(!showRewardCalculator)}
              className="btn-toggle"
            >
              {showRewardCalculator ? 'Hide' : 'Show'} Calculator
            </button>
          </div>

          {showRewardCalculator && (
            <div className="reward-cards-grid">
              <div className="reward-card reward-high">
                <div className="reward-icon">
                  <i className="fas fa-fire"></i>
                </div>
                <h4>Low Tier (2x)</h4>
                <p className="reward-amount">
                  {(100 * 2 * ron.tierMultiplier).toFixed(0)} RDLN
                </p>
                <p className="reward-description">High reward, high risk</p>
              </div>

              <div className="reward-card reward-mid">
                <div className="reward-icon">
                  <i className="fas fa-balance-scale"></i>
                </div>
                <h4>Mid Tier (1x)</h4>
                <p className="reward-amount">
                  {(100 * 1 * ron.tierMultiplier).toFixed(0)} RDLN
                </p>
                <p className="reward-description">Balanced risk/reward</p>
              </div>

              <div className="reward-card reward-low">
                <div className="reward-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h4>High Tier (0.5x)</h4>
                <p className="reward-amount">
                  {(100 * 0.5 * ron.tierMultiplier).toFixed(0)} RDLN
                </p>
                <p className="reward-description">Low risk, steady rewards</p>
              </div>
            </div>
          )}
        </div>

        {/* Riddle Actions */}
        <div className="actions-grid">
          {/* Mint New Riddle */}
          <div className="section-card">
            <h3 className="section-title">
              <i className="fas fa-plus-circle"></i> Mint New Riddle
            </h3>
            <p className="section-description">
              Pay {riddleNFT.currentMintCost} RDLN to mint a new riddle NFT. 50% burned, 25% to Grand Prize, 25% to Treasury.
            </p>

            <button
              onClick={handleMintRiddle}
              disabled={riddleNFT.isTransactionLoading || parseFloat(rdln.balance) < parseFloat(riddleNFT.currentMintCost)}
              className="btn-primary"
            >
              {riddleNFT.isTransactionLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Minting...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i> Mint Riddle ({riddleNFT.currentMintCost} RDLN)
                </>
              )}
            </button>

            {parseFloat(rdln.balance) < parseFloat(riddleNFT.currentMintCost) && (
              <p className="error-message">
                <i className="fas fa-exclamation-circle"></i> Insufficient RDLN balance (need {riddleNFT.currentMintCost} RDLN)
              </p>
            )}
          </div>

          {/* Solve Riddle */}
          <div className="section-card">
            <h3 className="section-title">
              <i className="fas fa-unlock"></i> Solve Riddle
            </h3>

            <div className="form-group">
              <label>Riddle ID:</label>
              <input
                type="number"
                value={selectedRiddleId || ''}
                onChange={(e) => setSelectedRiddleId(e.target.value)}
                className="form-input"
                placeholder="Enter riddle ID to solve"
              />
            </div>

            <div className="form-group">
              <label>Your Solution:</label>
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="form-textarea"
                placeholder="Enter your solution here..."
              />
            </div>

            {antiCheatTimer > 0 && (
              <div className="warning-box">
                <i className="fas fa-clock"></i> Anti-cheat cooldown: {antiCheatTimer}s
              </div>
            )}

            <button
              onClick={handleSubmitSolution}
              disabled={
                riddleNFT.isTransactionLoading ||
                !selectedRiddleId ||
                !solution.trim() ||
                antiCheatTimer > 0 ||
                parseFloat(rdln.balance) < parseFloat(riddleNFT.currentMintCost)
              }
              className="btn-secondary"
            >
              {riddleNFT.isTransactionLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Submit Solution ({riddleNFT.currentMintCost} RDLN)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Treasury Status */}
        <div className="section-card">
          <h3 className="section-title">
            <i className="fas fa-landmark"></i> Treasury Transparency
          </h3>

          <div className="treasury-grid">
            <div className="treasury-card treasury-prize">
              <div className="treasury-icon">
                <i className="fas fa-trophy"></i>
              </div>
              <h4>Grand Prize</h4>
              <p className="treasury-value">Growing...</p>
              <p className="treasury-description">25% of all transactions</p>
            </div>

            <div className="treasury-card treasury-vault">
              <div className="treasury-icon">
                <i className="fas fa-vault"></i>
              </div>
              <h4>Treasury</h4>
              <p className="treasury-value">Secured</p>
              <p className="treasury-description">Development & Operations</p>
            </div>

            <div className="treasury-card treasury-burn">
              <div className="treasury-icon">
                <i className="fas fa-fire-alt"></i>
              </div>
              <h4>Total Burned</h4>
              <p className="treasury-value">Deflationary</p>
              <p className="treasury-description">50% of all transactions</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .riddle-game-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent, rgba(255, 215, 0, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.4);
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #FFD700;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }

        .stat-card h3 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #FFD700;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .stat-tier {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0.5rem 0 0.25rem;
        }

        .stat-multiplier {
          font-size: 0.9rem;
          color: #cccccc;
          margin: 0;
        }

        .stat-rdln {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
          border-color: rgba(255, 215, 0, 0.3);
        }

        .stat-ron {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(219, 39, 119, 0.1));
          border-color: rgba(147, 51, 234, 0.3);
        }

        .stat-ron .stat-icon {
          color: #a855f7;
          text-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
        }

        .stat-ron h3 {
          color: #a855f7;
        }

        .stat-solved {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
          border-color: rgba(34, 197, 94, 0.3);
        }

        .stat-solved .stat-icon {
          color: #22c55e;
          text-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
        }

        .stat-solved h3 {
          color: #22c55e;
        }

        .stat-nft {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(255, 165, 0, 0.1));
          border-color: rgba(239, 68, 68, 0.3);
        }

        .stat-nft .stat-icon {
          color: #ef4444;
          text-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
        }

        .stat-nft h3 {
          color: #ef4444;
        }

        /* Section Card */
        .section-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(10px);
          margin-bottom: 2rem;
          transition: all 0.3s ease;
        }

        .section-card:hover {
          border-color: rgba(255, 215, 0, 0.3);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFD700;
          margin: 0 0 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-title i {
          font-size: 1.3rem;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .section-description {
          color: #cccccc;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }

        /* Tier Cards Grid */
        .tier-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .tier-card {
          padding: 1.5rem;
          border-radius: 15px;
          text-align: center;
          transition: all 0.3s ease;
          border: 2px solid;
        }

        .tier-card:hover {
          transform: translateY(-5px);
        }

        .tier-locked {
          background: rgba(75, 85, 99, 0.1);
          border-color: rgba(75, 85, 99, 0.3);
        }

        .tier-current {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.15));
          border-color: #FFD700;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .tier-completed {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15));
          border-color: #22c55e;
        }

        .tier-icon-large {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        .tier-card h4 {
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-size: 1rem;
          color: #ffffff;
        }

        .tier-multiplier {
          font-size: 0.85rem;
          color: #cccccc;
        }

        /* Progress Section */
        .progress-section {
          margin-top: 2rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #cccccc;
          margin-bottom: 0.75rem;
        }

        .progress-percentage {
          font-weight: 700;
          color: #FFD700;
        }

        .progress-bar {
          background: rgba(75, 85, 99, 0.5);
          border-radius: 10px;
          height: 10px;
          overflow: hidden;
        }

        .progress-fill {
          background: linear-gradient(90deg, #FFD700, #FFA500);
          height: 100%;
          border-radius: 10px;
          transition: width 0.5s ease;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        /* Reward Cards Grid */
        .reward-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .reward-card {
          text-align: center;
          padding: 2rem 1.5rem;
          border-radius: 15px;
          transition: all 0.3s ease;
          border: 2px solid;
        }

        .reward-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .reward-high {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(255, 165, 0, 0.15));
          border-color: rgba(239, 68, 68, 0.4);
        }

        .reward-mid {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.15));
          border-color: rgba(255, 215, 0, 0.4);
        }

        .reward-low {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15));
          border-color: rgba(34, 197, 94, 0.4);
        }

        .reward-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .reward-high .reward-icon {
          color: #ef4444;
          text-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
        }

        .reward-mid .reward-icon {
          color: #FFD700;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }

        .reward-low .reward-icon {
          color: #22c55e;
          text-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
        }

        .reward-card h4 {
          font-weight: 700;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .reward-high h4 { color: #ef4444; }
        .reward-mid h4 { color: #FFD700; }
        .reward-low h4 { color: #22c55e; }

        .reward-amount {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .reward-description {
          font-size: 0.85rem;
          color: #cccccc;
        }

        /* Actions Grid */
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        /* Form Elements */
        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: #cccccc;
          margin-bottom: 0.5rem;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          background: rgba(31, 41, 55, 0.5);
          border: 1px solid rgba(75, 85, 99, 0.5);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #FFD700;
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }

        .form-textarea {
          height: 100px;
          resize: none;
          font-family: inherit;
        }

        /* Buttons */
        .btn-primary,
        .btn-secondary,
        .btn-toggle {
          padding: 0.875rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
        }

        .btn-primary {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: linear-gradient(45deg, rgba(147, 51, 234, 0.8), rgba(219, 39, 119, 0.8));
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3);
        }

        .btn-secondary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(147, 51, 234, 0.4);
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-toggle {
          width: auto;
          background: transparent;
          color: #FFD700;
          border: 1px solid rgba(255, 215, 0, 0.3);
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }

        .btn-toggle:hover {
          background: rgba(255, 215, 0, 0.1);
          border-color: rgba(255, 215, 0, 0.5);
        }

        /* Warning Box */
        .warning-box {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(255, 165, 0, 0.15));
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
          color: #ef4444;
          font-weight: 600;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        /* Error Message */
        .error-message {
          color: #ef4444;
          font-size: 0.9rem;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        /* Treasury Grid */
        .treasury-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .treasury-card {
          text-align: center;
          padding: 2rem 1.5rem;
          border-radius: 15px;
          transition: all 0.3s ease;
          border: 2px solid;
        }

        .treasury-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .treasury-prize {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
          border-color: rgba(34, 197, 94, 0.3);
        }

        .treasury-vault {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
          border-color: rgba(59, 130, 246, 0.3);
        }

        .treasury-burn {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(255, 165, 0, 0.1));
          border-color: rgba(239, 68, 68, 0.3);
        }

        .treasury-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .treasury-prize .treasury-icon {
          color: #22c55e;
          text-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
        }

        .treasury-vault .treasury-icon {
          color: #3b82f6;
          text-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }

        .treasury-burn .treasury-icon {
          color: #ef4444;
          text-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
        }

        .treasury-card h4 {
          font-weight: 700;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .treasury-prize h4 { color: #22c55e; }
        .treasury-vault h4 { color: #3b82f6; }
        .treasury-burn h4 { color: #ef4444; }

        .treasury-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .treasury-description {
          font-size: 0.85rem;
          color: #cccccc;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .riddle-game-container {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .stat-card {
            padding: 1rem;
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
            font-size: 1.2rem;
          }

          .tier-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .reward-cards-grid {
            grid-template-columns: 1fr;
          }

          .treasury-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .btn-toggle {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .tier-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}