import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';

const GROUP_STATES = {
  0: { label: 'FORMING', color: '#FFD700', desc: 'Accepting members' },
  1: { label: 'RESERVED', color: '#FFA500', desc: 'Locked for riddle' },
  2: { label: 'ACTIVE', color: '#FF6347', desc: 'Solving in progress' },
  3: { label: 'COMPLETED', color: '#90EE90', desc: 'Finished' },
  4: { label: 'DISBANDED', color: '#888', desc: 'Cancelled' }
};

const RON_TIERS = {
  0: { label: 'NOVICE', min: 0, max: 999, color: '#999', icon: '🌱' },
  1: { label: 'SOLVER', min: 1000, max: 9999, color: '#4169E1', icon: '⚡' },
  2: { label: 'EXPERT', min: 10000, max: 99999, color: '#9370DB', icon: '🔥' },
  3: { label: 'ORACLE', min: 100000, max: Infinity, color: '#FFD700', icon: '🌟' }
};

export default function GroupMechanics({ userNFTs = [], onGroupCreated }) {
  const { address, isConnected } = useAccount();
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [activeGroups, setActiveGroups] = useState([]);
  const [joinGroupId, setJoinGroupId] = useState('');

  // Get user's RON balance
  const { data: userRON } = useReadContract({
    address: process.env.NEXT_PUBLIC_RON_ADDRESS,
    abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }] }],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const getUserTier = (ronBalance) => {
    const ron = parseFloat(formatEther(ronBalance || 0n));
    if (ron >= 100000) return RON_TIERS[3];
    if (ron >= 10000) return RON_TIERS[2];
    if (ron >= 1000) return RON_TIERS[1];
    return RON_TIERS[0];
  };

  const userTier = getUserTier(userRON);

  return (
    <div className="group-mechanics">
      {/* Header */}
      <div className="gm-header">
        <div className="gm-title">
          <h2>👥 Group Riddle Mechanics</h2>
          <p>Team up with other solvers to tackle harder riddles and share rewards</p>
        </div>
        <div className="user-tier-badge">
          <span className="tier-icon">{userTier.icon}</span>
          <span className="tier-label">{userTier.label}</span>
          <span className="tier-ron">{userRON ? formatEther(userRON).slice(0, 8) : '0'} RON</span>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="gm-benefits">
        <h3>Why Join a Group?</h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🎯</div>
            <h4>Higher Tier Access</h4>
            <p>Pool your RON to access riddles your individual tier can't reach</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💰</div>
            <h4>Locked Era Costs</h4>
            <p>Groups inherit the NFT's era costs - solve at Era 0 prices even in Era 3!</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚖️</div>
            <h4>Fair RON-Weighted Rewards</h4>
            <p>Rewards distributed by your effective RON (1%-70% share limits)</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🛡️</div>
            <h4>Tier Diversity Required</h4>
            <p>Balanced groups: Need low, mid, and high tier members (3-11 total)</p>
          </div>
        </div>
      </div>

      {/* Create Group Section */}
      {isConnected && userNFTs.length > 0 && (
        <div className="gm-create-section">
          <h3>Convert Your NFT to Group Riddle</h3>
          <p>Transform your solo NFT into a collaborative group challenge</p>

          <div className="nft-selector">
            {userNFTs.map((nft) => (
              <div
                key={nft.id}
                className={`nft-card ${selectedNFT?.id === nft.id ? 'selected' : ''}`}
                onClick={() => setSelectedNFT(nft)}
              >
                <div className="nft-id">NFT #{nft.id}</div>
                <div className="nft-riddle">Riddle #{nft.riddleId}</div>
                <div className="nft-era">Era {nft.era} Costs Locked</div>
                <div className="nft-cost">{formatEther(nft.attemptCost)} RDLN/attempt</div>
              </div>
            ))}
          </div>

          {selectedNFT && (
            <div className="create-group-panel">
              <div className="locked-costs-info">
                <h4>🔒 Locked Costs (Era {selectedNFT.era})</h4>
                <div className="cost-row">
                  <span>Attempt Cost:</span>
                  <strong>{formatEther(selectedNFT.attemptCost)} RDLN</strong>
                </div>
                <div className="cost-row">
                  <span>Submission Cost:</span>
                  <strong>{formatEther(selectedNFT.submissionCost)} RDLN</strong>
                </div>
                <p className="cost-note">
                  All group members will solve at these locked costs, no matter what era it is when they join!
                </p>
              </div>

              <button
                className="btn-create-group"
                onClick={() => setShowCreateGroup(true)}
              >
                <i className="fas fa-users-plus"></i> Create Group from NFT #{selectedNFT.id}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Group Composition Requirements */}
      <div className="gm-requirements">
        <h3>Group Composition Rules</h3>
        <div className="requirements-grid">
          <div className="req-card">
            <div className="req-header">
              <i className="fas fa-users"></i>
              <h4>Size Requirements</h4>
            </div>
            <div className="req-detail">
              <div className="req-item">
                <span>Minimum:</span>
                <strong>3 members</strong>
              </div>
              <div className="req-item">
                <span>Maximum:</span>
                <strong>11 members</strong>
              </div>
            </div>
          </div>

          <div className="req-card">
            <div className="req-header">
              <i className="fas fa-layer-group"></i>
              <h4>Tier Diversity</h4>
            </div>
            <div className="req-detail">
              <div className="req-item">
                <span>Must have:</span>
                <strong>Low, Mid, and High tiers</strong>
              </div>
              <div className="req-note">
                At least 1 from each tier category
              </div>
            </div>
          </div>

          <div className="req-card">
            <div className="req-header">
              <i className="fas fa-balance-scale"></i>
              <h4>Tier Limits</h4>
            </div>
            <div className="req-detail">
              <div className="req-item">
                <span>High/Oracle:</span>
                <strong>Max 2</strong>
              </div>
              <div className="req-item">
                <span>Mid-tier:</span>
                <strong>Max 4</strong>
              </div>
              <div className="req-item">
                <span>Low-tier:</span>
                <strong>Max 5</strong>
              </div>
            </div>
          </div>

          <div className="req-card">
            <div className="req-header">
              <i className="fas fa-coins"></i>
              <h4>Reward Shares</h4>
            </div>
            <div className="req-detail">
              <div className="req-item">
                <span>Minimum:</span>
                <strong>1% per member</strong>
              </div>
              <div className="req-item">
                <span>Maximum:</span>
                <strong>70% per member</strong>
              </div>
              <div className="req-note">
                RON-weighted distribution
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="gm-how-it-works">
        <h3>How Group Solving Works</h3>
        <div className="steps-timeline">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Convert NFT to Group</h4>
              <p>Creator converts their solo NFT into a group riddle, locking in the NFT's era costs</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Members Join (7-day window)</h4>
              <p>Solvers join the forming group, acknowledging the locked costs. Need 3-11 members with tier diversity</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Group Finalization</h4>
              <p>Creator finalizes when composition is valid. System calculates pooled RON to determine access tier</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Collaborative Solving</h4>
              <p>Group members solve together at the locked NFT costs. RON is diluted across your active groups</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h4>RON-Weighted Rewards</h4>
              <p>Success! Rewards distributed proportionally to each member's effective RON (1%-70% limits)</p>
            </div>
          </div>
        </div>
      </div>

      {/* RON Dilution Explained */}
      <div className="gm-dilution-info">
        <h3>⚠️ RON Dilution Mechanic</h3>
        <div className="dilution-panel">
          <p className="dilution-desc">
            Your RON is diluted across all active groups you're in. This prevents RON farming by being in multiple groups simultaneously.
          </p>
          <div className="dilution-example">
            <h4>Example:</h4>
            <div className="example-row">
              <span>You have:</span>
              <strong>10,000 RON (EXPERT tier)</strong>
            </div>
            <div className="example-row">
              <span>Active in:</span>
              <strong>2 groups</strong>
            </div>
            <div className="example-row">
              <span>Effective RON:</span>
              <strong>5,000 RON per group (SOLVER tier)</strong>
            </div>
          </div>
          <div className="dilution-limits">
            <h4>Max Concurrent Groups by Tier:</h4>
            <div className="limit-grid">
              <div className="limit-item">
                <span className="tier-icon">🌱</span>
                <span>NOVICE:</span>
                <strong>2 groups</strong>
              </div>
              <div className="limit-item">
                <span className="tier-icon">⚡</span>
                <span>SOLVER:</span>
                <strong>3 groups</strong>
              </div>
              <div className="limit-item">
                <span className="tier-icon">🔥</span>
                <span>EXPERT:</span>
                <strong>5 groups</strong>
              </div>
              <div className="limit-item">
                <span className="tier-icon">🌟</span>
                <span>ORACLE:</span>
                <strong>8 groups</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .group-mechanics {
          padding: 2rem 0;
        }

        .gm-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
        }

        .gm-title h2 {
          font-size: 2rem;
          color: #FFD700;
          margin-bottom: 0.5rem;
        }

        .gm-title p {
          color: #cccccc;
          font-size: 1.1rem;
        }

        .user-tier-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
        }

        .tier-icon {
          font-size: 2rem;
        }

        .tier-label {
          font-weight: 700;
          color: #FFD700;
          font-size: 1.1rem;
        }

        .tier-ron {
          color: #FFA500;
          font-size: 0.9rem;
        }

        /* Benefits */
        .gm-benefits {
          margin-bottom: 3rem;
        }

        .gm-benefits h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .benefit-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 15px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .benefit-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.4);
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
        }

        .benefit-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .benefit-card h4 {
          color: #FFD700;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .benefit-card p {
          color: #cccccc;
          line-height: 1.6;
        }

        /* Requirements */
        .gm-requirements {
          margin-bottom: 3rem;
        }

        .gm-requirements h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .requirements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .req-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
        }

        .req-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }

        .req-header i {
          font-size: 1.5rem;
          color: #FFA500;
        }

        .req-header h4 {
          color: #FFD700;
          font-size: 1.1rem;
          margin: 0;
        }

        .req-detail {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .req-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .req-item span {
          color: #999;
        }

        .req-item strong {
          color: #FFD700;
        }

        .req-note {
          color: #FFA500;
          font-size: 0.85rem;
          font-style: italic;
          margin-top: 0.5rem;
        }

        /* How It Works */
        .gm-how-it-works {
          margin-bottom: 3rem;
        }

        .gm-how-it-works h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .steps-timeline {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .step {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .step-number {
          flex-shrink: 0;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .step-content {
          flex: 1;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 15px;
          padding: 1.5rem;
        }

        .step-content h4 {
          color: #FFD700;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .step-content p {
          color: #cccccc;
          line-height: 1.6;
        }

        /* Dilution Info */
        .gm-dilution-info {
          margin-bottom: 3rem;
        }

        .gm-dilution-info h3 {
          color: #FF6347;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .dilution-panel {
          background: linear-gradient(135deg, rgba(255, 99, 71, 0.1), rgba(255, 165, 0, 0.05));
          border: 2px solid rgba(255, 99, 71, 0.3);
          border-radius: 20px;
          padding: 2rem;
        }

        .dilution-desc {
          color: #FFD700;
          font-size: 1.1rem;
          text-align: center;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .dilution-example {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .dilution-example h4 {
          color: #FFA500;
          margin-bottom: 1rem;
        }

        .example-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .example-row:last-child {
          border-bottom: none;
        }

        .example-row span {
          color: #999;
        }

        .example-row strong {
          color: #FFD700;
        }

        .dilution-limits h4 {
          color: #FFD700;
          margin-bottom: 1rem;
        }

        .limit-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }

        .limit-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 10px;
        }

        .limit-item span {
          color: #999;
        }

        .limit-item strong {
          color: #FFD700;
          margin-left: auto;
        }

        @media (max-width: 768px) {
          .gm-header {
            flex-direction: column;
            gap: 1.5rem;
          }

          .benefits-grid,
          .requirements-grid {
            grid-template-columns: 1fr;
          }

          .limit-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
