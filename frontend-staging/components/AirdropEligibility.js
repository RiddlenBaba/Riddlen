import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePhase1Status, useSubmitSocialProof, useClaimPhase1 } from '../hooks/useAirdrop';

export default function AirdropEligibility() {
  const { address, isConnected } = useAccount();
  const phase1 = usePhase1Status();
  const submitProof = useSubmitSocialProof();
  const claimPhase1 = useClaimPhase1();

  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shareStatus, setShareStatus] = useState({
    twitter: false,
    telegram: false,
    telegramCommunity: false,
    github: false
  });

  // Check if user has completed social tasks (stored in localStorage)
  useEffect(() => {
    if (address) {
      const savedStatus = localStorage.getItem(`social_status_${address}`);
      if (savedStatus) {
        setShareStatus(JSON.parse(savedStatus));
      }
    }
  }, [address]);

  const checkEligibility = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first!');
      return;
    }

    setLoading(true);

    // Check eligibility - 2,500 RDLN per social task completed
    setTimeout(() => {
      const points = calculatePoints();
      const isEligible = points >= 2; // Need at least 2 social actions to qualify
      const allocation = points * 2500; // 2,500 RDLN per point

      setEligibility({
        address: address,
        points: points,
        isEligible: isEligible,
        estimatedTokens: allocation, // 2,500 RDLN per task (max 10,000 RDLN)
        tier: points >= 4 ? 'Gold' : points >= 2 ? 'Silver' : 'Bronze'
      });

      setLoading(false);
    }, 1500);
  };

  const calculatePoints = () => {
    let points = 0;
    if (shareStatus.twitter) points += 1;
    if (shareStatus.telegram) points += 1;
    if (shareStatus.telegramCommunity) points += 1;
    if (shareStatus.github) points += 1;
    return points;
  };

  const handleSocialAction = (platform, url) => {
    // Open social link
    window.open(url, '_blank');

    // Mark as completed after 3 seconds
    setTimeout(() => {
      const newStatus = { ...shareStatus, [platform]: true };
      setShareStatus(newStatus);
      if (address) {
        localStorage.setItem(`social_status_${address}`, JSON.stringify(newStatus));
      }
    }, 3000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      '🧠 Just discovered @RiddlenToken - the world\'s first Proof-of-Solve blockchain where intelligence powers the economy!\n\n🎯 Solve riddles, earn $RDLN tokens\n💎 Merit-based rewards\n🔥 Deflationary tokenomics\n\nJoin the riddle revolution! 🚀'
    );
    const url = encodeURIComponent('https://riddlen.com');
    handleSocialAction('twitter', `https://twitter.com/intent/tweet?text=${text}&url=${url}`);
  };

  return (
    <div className="eligibility-container">
      <h3>🎁 Check Your Airdrop Eligibility</h3>

      {!isConnected ? (
        <div className="connect-prompt">
          <p>Connect your wallet to check eligibility</p>
        </div>
      ) : (
        <>
          <div className="social-tasks">
            <h4>Complete Social Tasks (2,500 RDLN each, max 10,000 RDLN):</h4>

            <div className="task-list">
              <div className={`task-item ${shareStatus.twitter ? 'completed' : ''}`}>
                <div className="task-info">
                  <i className="fab fa-twitter"></i>
                  <span>Follow & Share on X (Twitter)</span>
                </div>
                <button
                  onClick={shareOnTwitter}
                  className={shareStatus.twitter ? 'btn-completed' : 'btn-action'}
                  disabled={shareStatus.twitter}
                >
                  {shareStatus.twitter ? '✓ Completed' : 'Share'}
                </button>
              </div>

              <div className={`task-item ${shareStatus.telegram ? 'completed' : ''}`}>
                <div className="task-info">
                  <i className="fab fa-telegram"></i>
                  <span>Join Telegram Channel</span>
                </div>
                <button
                  onClick={() => handleSocialAction('telegram', 'https://t.me/RiddlenToken')}
                  className={shareStatus.telegram ? 'btn-completed' : 'btn-action'}
                  disabled={shareStatus.telegram}
                >
                  {shareStatus.telegram ? '✓ Completed' : 'Join'}
                </button>
              </div>

              <div className={`task-item ${shareStatus.telegramCommunity ? 'completed' : ''}`}>
                <div className="task-info">
                  <i className="fas fa-users"></i>
                  <span>Join Telegram Community</span>
                </div>
                <button
                  onClick={() => handleSocialAction('telegramCommunity', 'https://t.me/RiddlenCommunity')}
                  className={shareStatus.telegramCommunity ? 'btn-completed' : 'btn-action'}
                  disabled={shareStatus.telegramCommunity}
                >
                  {shareStatus.telegramCommunity ? '✓ Completed' : 'Join'}
                </button>
              </div>

              <div className={`task-item ${shareStatus.github ? 'completed' : ''}`}>
                <div className="task-info">
                  <i className="fab fa-github"></i>
                  <span>Star GitHub Repository</span>
                </div>
                <button
                  onClick={() => handleSocialAction('github', 'https://github.com/RiddlenBaba/riddlen')}
                  className={shareStatus.github ? 'btn-completed' : 'btn-action'}
                  disabled={shareStatus.github}
                >
                  {shareStatus.github ? '✓ Completed' : 'Star'}
                </button>
              </div>
            </div>

            <div className="points-display">
              <span>Your Points: {calculatePoints()}/4</span>
              <p className="points-note">Complete at least 2 tasks to qualify for the airdrop!</p>
            </div>
          </div>

          <button
            onClick={checkEligibility}
            className="check-btn"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Check My Eligibility'}
          </button>

          {eligibility && (
            <div className={`eligibility-result ${eligibility.isEligible ? 'eligible' : 'not-eligible'}`}>
              <h4>{eligibility.isEligible ? '🎉 You\'re Eligible!' : '⚠️ Not Eligible Yet'}</h4>

              <div className="result-details">
                <div className="detail-row">
                  <span>Wallet:</span>
                  <span className="address">{eligibility.address.slice(0, 6)}...{eligibility.address.slice(-4)}</span>
                </div>
                <div className="detail-row">
                  <span>Points:</span>
                  <span className="points">{eligibility.points}/4</span>
                </div>
                <div className="detail-row">
                  <span>Tier:</span>
                  <span className={`tier ${eligibility.tier.toLowerCase()}`}>{eligibility.tier}</span>
                </div>
                <div className="detail-row">
                  <span>Est. Allocation:</span>
                  <span className="tokens">{eligibility.estimatedTokens.toLocaleString()} RDLN</span>
                </div>
              </div>

              {eligibility.isEligible ? (
                <div className="success-message">
                  <p>✅ You're eligible for the airdrop!</p>

                  {!phase1.claimed && (
                    <>
                      <button
                        onClick={claimPhase1.claim}
                        className="claim-btn-big"
                        disabled={claimPhase1.isPending || claimPhase1.isConfirming}
                      >
                        {claimPhase1.isPending || claimPhase1.isConfirming ? '⏳ Claiming...' : `🎁 Claim ${eligibility.estimatedTokens.toLocaleString()} RDLN Now`}
                      </button>
                      <p className="note">Click to claim your {eligibility.estimatedTokens.toLocaleString()} RDLN tokens instantly!</p>
                    </>
                  )}

                  {phase1.claimed && (
                    <div className="claimed-success">
                      <p>🎉 Successfully Claimed {eligibility.estimatedTokens.toLocaleString()} RDLN!</p>
                      {claimPhase1.hash && (
                        <a href={`https://amoy.polygonscan.com/tx/${claimPhase1.hash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                          View Transaction ↗
                        </a>
                      )}
                    </div>
                  )}

                  {claimPhase1.error && (
                    <div className="error-message">
                      <p>❌ Claim failed</p>
                      <p className="error-details">
                        {claimPhase1.error.message?.includes('user rejected')
                          ? 'Transaction was rejected in your wallet'
                          : claimPhase1.error.message?.includes('already claimed')
                          ? 'You have already claimed your airdrop'
                          : 'Please make sure you have MATIC for gas fees and try again'}
                      </p>
                    </div>
                  )}

                  {submitProof.error && (
                    <div className="error-message">
                      <p>❌ Submit failed</p>
                      <p className="error-details">
                        {submitProof.error.message?.includes('user rejected')
                          ? 'Transaction was rejected in your wallet'
                          : submitProof.error.message?.includes('already submitted')
                          ? 'You have already submitted your proof'
                          : submitProof.error.message?.includes('not active')
                          ? 'Phase 1 is not currently active. Please check back later.'
                          : submitProof.error.message?.includes('Internal JSON-RPC')
                          ? 'Contract error - Phase 1 may not be active yet, or you may have already submitted. Please contact support if this persists.'
                          : 'Please make sure you have MATIC for gas fees and try again'}
                      </p>
                      <details className="error-technical">
                        <summary>Technical Details</summary>
                        <code>{submitProof.error.message}</code>
                      </details>
                    </div>
                  )}
                </div>
              ) : (
                <div className="info-message">
                  <p>Complete at least 2 social tasks to become eligible!</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .eligibility-container {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2rem;
          margin: 2rem 0;
        }

        .eligibility-container h3 {
          color: #FFD700;
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
        }

        .connect-prompt {
          text-align: center;
          padding: 2rem;
          color: #cccccc;
        }

        .social-tasks h4 {
          color: #ffffff;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .task-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .task-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .task-item.completed {
          border-color: rgba(16, 185, 129, 0.5);
          background: rgba(16, 185, 129, 0.1);
        }

        .task-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #ffffff;
        }

        .task-info i {
          font-size: 1.5rem;
          color: #FFD700;
        }

        .btn-action, .btn-completed {
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-action {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
        }

        .btn-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
        }

        .btn-completed {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.5);
          cursor: default;
        }

        .points-display {
          text-align: center;
          padding: 1rem;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 10px;
          margin: 1rem 0;
          color: #FFD700;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .points-note {
          font-size: 0.75rem;
          color: #aaa;
          margin-top: 0.5rem;
          font-weight: 400;
          font-style: italic;
        }

        .check-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .check-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4);
        }

        .check-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .eligibility-result {
          margin-top: 1.5rem;
          padding: 1.5rem;
          border-radius: 15px;
          animation: slideIn 0.3s ease;
        }

        .eligibility-result.eligible {
          background: rgba(16, 185, 129, 0.1);
          border: 2px solid rgba(16, 185, 129, 0.5);
        }

        .eligibility-result.not-eligible {
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid rgba(239, 68, 68, 0.5);
        }

        .eligibility-result h4 {
          color: #ffffff;
          margin-bottom: 1rem;
          text-align: center;
        }

        .result-details {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin: 1rem 0;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row span:first-child {
          color: #aaaaaa;
        }

        .detail-row span:last-child {
          color: #ffffff;
          font-weight: 600;
        }

        .address {
          font-family: monospace;
          color: #FFD700 !important;
        }

        .tier {
          text-transform: uppercase;
        }

        .tier.gold {
          color: #FFD700 !important;
        }

        .tier.silver {
          color: #C0C0C0 !important;
        }

        .tier.bronze {
          color: #CD7F32 !important;
        }

        .tokens {
          color: #10b981 !important;
        }

        .success-message, .info-message {
          text-align: center;
          padding: 1rem;
          border-radius: 10px;
          margin-top: 1rem;
        }

        .success-message {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .info-message {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .note {
          font-size: 0.85rem;
          margin-top: 0.5rem;
          opacity: 0.8;
        }

        .submit-blockchain-btn, .claim-btn-big {
          width: 100%;
          padding: 1rem 2rem;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }

        .submit-blockchain-btn:hover:not(:disabled),
        .claim-btn-big:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.5);
        }

        .submit-blockchain-btn:disabled,
        .claim-btn-big:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .pending-verification {
          text-align: center;
          padding: 1.5rem;
          background: rgba(255, 165, 0, 0.1);
          border: 2px solid rgba(255, 165, 0, 0.3);
          border-radius: 15px;
          margin-top: 1rem;
        }

        .pending-verification p {
          color: #FFA500;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .tx-link {
          display: inline-block;
          color: #FFD700;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .tx-link:hover {
          background: rgba(255, 215, 0, 0.1);
          border-color: #FFD700;
        }

        .claimed-success {
          text-align: center;
          padding: 1.5rem;
          background: rgba(16, 185, 129, 0.2);
          border: 2px solid rgba(16, 185, 129, 0.5);
          border-radius: 15px;
          margin-top: 1rem;
        }

        .claimed-success p {
          color: #10b981;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .error-message {
          text-align: center;
          padding: 1rem;
          background: rgba(239, 68, 68, 0.2);
          border: 2px solid rgba(239, 68, 68, 0.5);
          border-radius: 10px;
          margin-top: 1rem;
        }

        .error-message p {
          color: #ef4444;
          font-size: 0.9rem;
          word-break: break-word;
          margin: 0;
        }

        .error-details {
          font-size: 0.85rem !important;
          margin-top: 0.5rem !important;
          opacity: 0.9;
        }

        .error-technical {
          margin-top: 1rem;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          font-size: 0.75rem;
        }

        .error-technical summary {
          cursor: pointer;
          color: #aaa;
          font-weight: 600;
          user-select: none;
        }

        .error-technical summary:hover {
          color: #fff;
        }

        .error-technical code {
          display: block;
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 4px;
          color: #ff8888;
          font-size: 0.7rem;
          word-break: break-all;
          white-space: pre-wrap;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .task-item {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .btn-action, .btn-completed {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}