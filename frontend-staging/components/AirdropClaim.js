import { useState } from 'react';
import { useAccount } from 'wagmi';
import { usePhase1Status, usePhase2Status, useAirdropStats, useSubmitSocialProof, useClaimPhase1, useClaimPhase2 } from '../hooks/useAirdrop';

export default function AirdropClaim() {
  const { address, isConnected } = useAccount();
  const [twitterHandle, setTwitterHandle] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');

  const phase1 = usePhase1Status();
  const phase2 = usePhase2Status();
  const stats = useAirdropStats();
  const submitProof = useSubmitSocialProof();
  const claimPhase1 = useClaimPhase1();
  const claimPhase2 = useClaimPhase2();

  // Check if contract is responding
  const isContractActive = !phase1.isLoading && !phase2.isLoading;

  const handleSubmitSocialProof = () => {
    if (!twitterHandle || !telegramHandle) {
      alert('Please enter both Twitter and Telegram handles');
      return;
    }
    submitProof.submit(twitterHandle, telegramHandle);
  };

  const getTierName = (tier) => {
    const tiers = ['None', 'Bronze', 'Silver', 'Gold', 'Platinum'];
    return tiers[tier] || 'Unknown';
  };

  if (!isConnected) {
    return (
      <div className="airdrop-claim-container">
        <div className="connect-prompt">
          <i className="fas fa-wallet"></i>
          <h3>Connect Your Wallet</h3>
          <p>Connect your wallet to check your airdrop eligibility and claim your RDLN tokens.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="airdrop-claim-container">
      <style jsx>{`
        .airdrop-claim-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }

        .connect-prompt {
          text-align: center;
          padding: 60px 40px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
          border-radius: 20px;
          border: 2px solid rgba(255, 215, 0, 0.2);
        }

        .connect-prompt i {
          font-size: 4rem;
          color: #FFD700;
          margin-bottom: 20px;
        }

        .connect-prompt h3 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: #FFD700;
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-box {
          background: rgba(0, 0, 0, 0.3);
          padding: 20px;
          border-radius: 15px;
          border: 2px solid rgba(255, 215, 0, 0.2);
          text-align: center;
        }

        .stat-box .label {
          font-size: 0.9rem;
          color: #aaa;
          margin-bottom: 10px;
        }

        .stat-box .value {
          font-size: 1.8rem;
          font-weight: bold;
          color: #FFD700;
        }

        .phase-section {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
          padding: 30px;
          border-radius: 20px;
          border: 2px solid rgba(255, 215, 0, 0.2);
          margin-bottom: 30px;
        }

        .phase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .phase-title {
          font-size: 1.8rem;
          color: #FFD700;
          margin: 0;
        }

        .phase-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .phase-badge.active {
          background: linear-gradient(45deg, #00ff00, #00aa00);
          color: #000;
        }

        .phase-badge.inactive {
          background: rgba(128, 128, 128, 0.3);
          color: #888;
        }

        .phase-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }

        .status-icon {
          font-size: 1.5rem;
        }

        .status-icon.success {
          color: #00ff00;
        }

        .status-icon.error {
          color: #ff4444;
        }

        .status-text {
          display: flex;
          flex-direction: column;
        }

        .status-label {
          font-size: 0.8rem;
          color: #aaa;
        }

        .status-value {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
        }

        .social-proof-form {
          background: rgba(0, 0, 0, 0.3);
          padding: 25px;
          border-radius: 15px;
          border: 2px solid rgba(255, 215, 0, 0.2);
        }

        .form-title {
          font-size: 1.3rem;
          color: #FFD700;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          color: #aaa;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 215, 0, 0.2);
          border-radius: 10px;
          color: #fff;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #FFD700;
        }

        .action-button {
          width: 100%;
          padding: 15px 30px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .action-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4);
        }

        .action-button:disabled {
          background: rgba(128, 128, 128, 0.3);
          color: #666;
          cursor: not-allowed;
        }

        .action-button.success {
          background: linear-gradient(45deg, #00ff00, #00aa00);
        }

        .info-box {
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 10px;
          padding: 20px;
          margin-top: 20px;
        }

        .info-box h4 {
          color: #FFD700;
          margin-bottom: 10px;
        }

        .info-box ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-box li {
          padding: 8px 0;
          color: #ddd;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .info-box li i {
          color: #FFD700;
        }

        .reward-display {
          background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          margin-bottom: 20px;
        }

        .reward-display .amount {
          font-size: 3rem;
          font-weight: bold;
          color: #FFD700;
          margin-bottom: 10px;
        }

        .reward-display .tier {
          font-size: 1.2rem;
          color: #FFA500;
        }

        .tx-link {
          margin-top: 15px;
          padding: 12px;
          background: rgba(0, 255, 0, 0.1);
          border: 2px solid rgba(0, 255, 0, 0.3);
          border-radius: 10px;
          word-break: break-all;
        }

        .tx-link a {
          color: #00ff00;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .tx-link a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .stats-overview {
            grid-template-columns: 1fr;
          }

          .phase-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .status-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-box">
          <div className="label">Phase 1 Participants</div>
          <div className="value">{stats.phase1Participants} / {stats.maxParticipants}</div>
        </div>
        <div className="stat-box">
          <div className="label">Phase 1 Remaining</div>
          <div className="value">{stats.phase1Remaining}</div>
        </div>
        <div className="stat-box">
          <div className="label">Per Wallet (Phase 1)</div>
          <div className="value">{stats.perWalletAmount} RDLN</div>
        </div>
        <div className="stat-box">
          <div className="label">Contract Balance</div>
          <div className="value">{parseFloat(stats.contractBalance).toLocaleString()} RDLN</div>
        </div>
      </div>

      {/* Phase 1: Social Proof Based */}
      <div className="phase-section">
        <div className="phase-header">
          <h2 className="phase-title">🎁 Phase 1: Social Proof Airdrop</h2>
          <span className={`phase-badge ${phase1.isActive ? 'active' : 'inactive'}`}>
            {phase1.isActive ? '🟢 Active' : '⚪ Inactive'}
          </span>
        </div>

        <div className="phase-content">
          <div className="status-grid">
            <div className="status-item">
              <i className={`fas fa-${phase1.verified ? 'check-circle' : 'times-circle'} status-icon ${phase1.verified ? 'success' : 'error'}`}></i>
              <div className="status-text">
                <span className="status-label">Social Verified</span>
                <span className="status-value">{phase1.verified ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div className="status-item">
              <i className={`fas fa-${phase1.claimed ? 'check-circle' : 'times-circle'} status-icon ${phase1.claimed ? 'success' : 'error'}`}></i>
              <div className="status-text">
                <span className="status-label">Claimed</span>
                <span className="status-value">{phase1.claimed ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {!phase1.verified && phase1.isActive && (
            <div className="social-proof-form">
              <h3 className="form-title">Submit Social Proof</h3>
              <div className="form-group">
                <label>Twitter Handle (without @)</label>
                <input
                  type="text"
                  placeholder="RiddlenToken"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Telegram Username (without @)</label>
                <input
                  type="text"
                  placeholder="yourusername"
                  value={telegramHandle}
                  onChange={(e) => setTelegramHandle(e.target.value)}
                />
              </div>
              <button
                className="action-button"
                onClick={handleSubmitSocialProof}
                disabled={submitProof.isPending || submitProof.isConfirming}
              >
                {submitProof.isPending || submitProof.isConfirming ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Submit Social Proof
                  </>
                )}
              </button>
              {submitProof.isSuccess && (
                <div className="tx-link">
                  <i className="fas fa-check-circle"></i> Submitted! Waiting for operator verification.
                  <a href={`https://amoy.polygonscan.com/tx/${submitProof.hash}`} target="_blank" rel="noopener noreferrer">
                    View Transaction
                  </a>
                </div>
              )}
              <div className="info-box">
                <h4>Requirements:</h4>
                <ul>
                  <li><i className="fas fa-check"></i> Follow @RiddlenToken on Twitter</li>
                  <li><i className="fas fa-check"></i> Join Riddlen Telegram group</li>
                  <li><i className="fas fa-check"></i> Share about Riddlen on social media</li>
                </ul>
              </div>
            </div>
          )}

          {phase1.verified && !phase1.claimed && phase1.isActive && (
            <>
              <div className="reward-display">
                <div className="amount">{stats.perWalletAmount} RDLN</div>
                <div className="tier">Ready to Claim!</div>
              </div>
              <button
                className="action-button success"
                onClick={claimPhase1.claim}
                disabled={claimPhase1.isPending || claimPhase1.isConfirming}
              >
                {claimPhase1.isPending || claimPhase1.isConfirming ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Claiming...
                  </>
                ) : (
                  <>
                    <i className="fas fa-gift"></i>
                    Claim Phase 1 Airdrop
                  </>
                )}
              </button>
              {claimPhase1.isSuccess && (
                <div className="tx-link">
                  <i className="fas fa-check-circle"></i> Claimed successfully!
                  <a href={`https://amoy.polygonscan.com/tx/${claimPhase1.hash}`} target="_blank" rel="noopener noreferrer">
                    View Transaction
                  </a>
                </div>
              )}
            </>
          )}

          {phase1.claimed && (
            <div className="info-box">
              <h4>✅ Phase 1 Already Claimed</h4>
              <p>You have successfully claimed your Phase 1 airdrop of {stats.perWalletAmount} RDLN!</p>
            </div>
          )}
        </div>
      </div>

      {/* Phase 2: Merit Based */}
      <div className="phase-section">
        <div className="phase-header">
          <h2 className="phase-title">💎 Phase 2: Merit-Based Airdrop</h2>
          <span className={`phase-badge ${phase2.isActive ? 'active' : 'inactive'}`}>
            {phase2.isActive ? '🟢 Active' : '⚪ Inactive'}
          </span>
        </div>

        <div className="phase-content">
          <div className="status-grid">
            <div className="status-item">
              <i className={`fas fa-coins status-icon ${phase2.eligible ? 'success' : 'error'}`}></i>
              <div className="status-text">
                <span className="status-label">RON Balance</span>
                <span className="status-value">{parseFloat(phase2.ronBalance).toLocaleString()} RON</span>
              </div>
            </div>
            <div className="status-item">
              <i className={`fas fa-trophy status-icon ${phase2.tier > 0 ? 'success' : 'error'}`}></i>
              <div className="status-text">
                <span className="status-label">Tier</span>
                <span className="status-value">{getTierName(phase2.tier)}</span>
              </div>
            </div>
            <div className="status-item">
              <i className={`fas fa-${phase2.claimed ? 'check-circle' : 'times-circle'} status-icon ${phase2.claimed ? 'success' : 'error'}`}></i>
              <div className="status-text">
                <span className="status-label">Claimed</span>
                <span className="status-value">{phase2.claimed ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {phase2.eligible && !phase2.claimed && phase2.isActive && (
            <>
              <div className="reward-display">
                <div className="amount">{parseFloat(phase2.reward).toLocaleString()} RDLN</div>
                <div className="tier">{getTierName(phase2.tier)} Tier Reward</div>
              </div>
              <button
                className="action-button success"
                onClick={claimPhase2.claim}
                disabled={claimPhase2.isPending || claimPhase2.isConfirming}
              >
                {claimPhase2.isPending || claimPhase2.isConfirming ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Claiming...
                  </>
                ) : (
                  <>
                    <i className="fas fa-gift"></i>
                    Claim Phase 2 Airdrop
                  </>
                )}
              </button>
              {claimPhase2.isSuccess && (
                <div className="tx-link">
                  <i className="fas fa-check-circle"></i> Claimed successfully!
                  <a href={`https://amoy.polygonscan.com/tx/${claimPhase2.hash}`} target="_blank" rel="noopener noreferrer">
                    View Transaction
                  </a>
                </div>
              )}
            </>
          )}

          {!phase2.eligible && phase2.isActive && (
            <div className="info-box">
              <h4>Earn RON to Qualify</h4>
              <ul>
                <li><i className="fas fa-info-circle"></i> Minimum 1,000 RON required</li>
                <li><i className="fas fa-trophy"></i> Tier 1 (1K-5K RON): 5,000 RDLN</li>
                <li><i className="fas fa-trophy"></i> Tier 2 (5K-10K RON): 10,000 RDLN</li>
                <li><i className="fas fa-trophy"></i> Tier 3 (10K-25K RON): 15,000 RDLN</li>
                <li><i className="fas fa-trophy"></i> Tier 4 (25K+ RON): 20,000 RDLN</li>
              </ul>
            </div>
          )}

          {phase2.claimed && (
            <div className="info-box">
              <h4>✅ Phase 2 Already Claimed</h4>
              <p>You have successfully claimed your Phase 2 airdrop of {parseFloat(phase2.reward).toLocaleString()} RDLN!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}