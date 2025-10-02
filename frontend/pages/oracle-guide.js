import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';

export default function OracleGuide() {
  return (
    <>
      <Head>
        <title>Become a Riddlen Validator - Oracle Network Guide</title>
        <meta name="description" content="Complete guide to earning RDLN as a validator in the Oracle Network. Learn validator tiers, validation mechanics, consensus systems, and career progression paths." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">🔮</div>
        <div className="floating-riddle">✅</div>
        <div className="floating-riddle">💰</div>
      </div>

      <Header currentPage="docs" />

      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <h1 className="page-title">Become a Validator</h1>
            <p className="page-subtitle">Earn unlimited RDLN by validating data for enterprises. Build reputation, stake RON, and earn through human intelligence verification.</p>

            <div className="hero-badge">
              <div className="badge-icon">🔮</div>
              <div className="badge-content">
                <div className="badge-title">Oracle Network</div>
                <div className="badge-value">Earn Pool Shares + 500 RDLN Bonus</div>
                <div className="badge-subtitle">Variable rewards based on tier (100 RDLN to 10K+ per validation)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Prerequisites */}
        <section className="prerequisites-section">
          <div className="container">
            <h2 className="section-title">Prerequisites to Become a Validator</h2>
            <p className="section-intro">Build 1,000 RON reputation to unlock validator status</p>

            <div className="prerequisites-grid">
              <div className="prerequisite-card">
                <div className="prereq-number">1</div>
                <h3>Earn 1,000 RON</h3>
                <p>Minimum reputation required for Bronze tier validation</p>
                <div className="prereq-path">
                  <div className="path-option">
                    <strong>Path A: Easy Riddles</strong>
                    <p>Solve ~59 EASY riddles (17 RON average each)</p>
                    <p className="time-estimate">Time: 3-4 weeks</p>
                  </div>
                  <div className="path-option">
                    <strong>Path B: Mixed Difficulty</strong>
                    <p>30 EASY (510 RON) + 7 MEDIUM (525 RON)</p>
                    <p className="time-estimate">Time: 2-3 weeks</p>
                  </div>
                </div>
              </div>

              <div className="prerequisite-card">
                <div className="prereq-number">2</div>
                <h3>Web3 Wallet Setup</h3>
                <p>Connect to Polygon Amoy testnet with MetaMask</p>
                <ul className="setup-list">
                  <li>Install MetaMask browser extension</li>
                  <li>Add Polygon Amoy network</li>
                  <li>Get testnet MATIC from faucet</li>
                  <li>Acquire some RDLN for gas fees</li>
                </ul>
              </div>

              <div className="prerequisite-card">
                <div className="prereq-number">3</div>
                <h3>Understanding Validation</h3>
                <p>Learn how the Oracle Network consensus works</p>
                <ul className="understanding-list">
                  <li>Stake RON as collateral</li>
                  <li>Submit answers with proof</li>
                  <li>Consensus determines truth</li>
                  <li>Correct validators earn, wrong ones lose 50% stake</li>
                </ul>
              </div>
            </div>

            <div className="prereq-callout">
              <i className="fas fa-lightbulb"></i>
              <div>
                <strong>Pro Tip:</strong>
                <p>Don't rush to higher RON tiers if you want to be a validator. Stop at 1,000 RON, focus on validations first (better ROI), then come back to grind more RON later for tier upgrades.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Validator Tiers */}
        <section className="tiers-section alt">
          <div className="container">
            <h2 className="section-title">Validator Tier System</h2>
            <p className="section-intro">Higher reputation unlocks better-paying validation requests</p>

            <div className="tiers-grid">
              <div className="tier-card bronze">
                <div className="tier-badge">
                  <div className="badge-icon">🥉</div>
                  <div className="badge-text">Bronze</div>
                </div>
                <div className="tier-requirements">
                  <div className="req-item">
                    <span className="req-label">RON Required</span>
                    <span className="req-value">100 RON</span>
                  </div>
                  <div className="req-item">
                    <span className="req-label">Min Accuracy</span>
                    <span className="req-value">None</span>
                  </div>
                  <div className="req-item">
                    <span className="req-label">Max Stake</span>
                    <span className="req-value">10 RON</span>
                  </div>
                </div>
                <div className="tier-access">
                  <h4>Request Access</h4>
                  <p>Basic validation requests</p>
                </div>
                <div className="tier-rewards">
                  <h4>Typical Rewards</h4>
                  <p className="reward-range">100-500 RDLN</p>
                  <p className="reward-note">Entry-level validations</p>
                </div>
                <div className="tier-examples">
                  <strong>Example Requests:</strong>
                  <ul>
                    <li>Simple price checks</li>
                    <li>Basic transaction verification</li>
                    <li>Content flagging</li>
                  </ul>
                </div>
              </div>

              <div className="tier-card silver">
                <div className="tier-badge">
                  <div className="badge-icon">🥈</div>
                  <div className="badge-text">Silver</div>
                </div>
                <div className="tier-requirements">
                  <div className="req-item">
                    <span className="req-label">RON Required</span>
                    <span className="req-value">1,000 RON</span>
                  </div>
                  <div className="req-item">
                    <span className="req-label">Min Accuracy</span>
                    <span className="req-value">70%+</span>
                  </div>
                  <div className="req-item">
                    <span className="req-label">Max Stake</span>
                    <span className="req-value">100 RON</span>
                  </div>
                </div>
                <div className="tier-access">
                  <h4>Request Access</h4>
                  <p>Medium complexity validation</p>
                </div>
                <div className="tier-rewards">
                  <h4>Typical Rewards</h4>
                  <p className="reward-range">500-2,000 RDLN</p>
                  <p className="reward-note">Standard validations</p>
                </div>
                <div className="tier-examples">
                  <strong>Example Requests:</strong>
                  <ul>
                    <li>Multi-source price aggregation</li>
                    <li>Cross-chain event confirmation</li>
                    <li>Basic content moderation</li>
                  </ul>
                </div>
              </div>

              <div className="tier-card gold">
                <div className="tier-badge">
                  <div className="badge-icon">🥇</div>
                  <div className="badge-text">Gold</div>
                </div>
                <div className="tier-requirements">
                  <div className="req-item">
                    <span className="req-label">RON Required</span>
                    <span className="req-value">10,000 RON</span>
                  </div>
                  <div className="req-item">
                    <span className="req-label">Min Accuracy</span>
                    <span className="req-value">85%+</span>
                  </div>
                  <div className="req-item">
                    <span className="req-label">Max Stake</span>
                    <span className="req-value">1,000 RON</span>
                  </div>
                </div>
                <div className="tier-access">
                  <h4>Request Access</h4>
                  <p>High-value validation requests</p>
                </div>
                <div className="tier-rewards">
                  <h4>Typical Rewards</h4>
                  <p className="reward-range">2,000-10,000 RDLN</p>
                  <p className="reward-note">Premium validations</p>
                </div>
                <div className="tier-examples">
                  <strong>Example Requests:</strong>
                  <ul>
                    <li>Complex research validation</li>
                    <li>Expert content moderation</li>
                    <li>Supply chain verification</li>
                  </ul>
                </div>
              </div>

              <div className="tier-card platinum">
                <div className="tier-badge">
                  <div className="badge-icon">💎</div>
                  <div className="badge-text">Platinum</div>
                </div>
                <div className="tier-requirements">
                  <div className="req-item">
                    <span className="req-label">RON Required</span>
                    <span className="req-value">100,000 RON</span>
                  </div>
                  <div className="req-item">
                    <span className="req-label">Min Accuracy</span>
                    <span className="req-value">95%+</span>
                  </div>
                  <div className="req-item">
                    <span className="req-label">Max Stake</span>
                    <span className="req-value">10,000 RON</span>
                  </div>
                </div>
                <div className="tier-access">
                  <h4>Request Access</h4>
                  <p>Enterprise premium validation</p>
                </div>
                <div className="tier-rewards">
                  <h4>Typical Rewards</h4>
                  <p className="reward-range">10,000+ RDLN</p>
                  <p className="reward-note">Elite-tier requests</p>
                </div>
                <div className="tier-examples">
                  <strong>Example Requests:</strong>
                  <ul>
                    <li>Domain expert validation</li>
                    <li>Mission-critical data</li>
                    <li>High-stakes verification</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="tier-progression-box">
              <h3>Progression Path</h3>
              <div className="progression-flow">
                <div className="progression-step">
                  <strong>Start Bronze</strong>
                  <p>100 RON → Access basic requests</p>
                </div>
                <div className="progression-arrow">→</div>
                <div className="progression-step">
                  <strong>Build Accuracy</strong>
                  <p>Complete validations correctly</p>
                </div>
                <div className="progression-arrow">→</div>
                <div className="progression-step">
                  <strong>Earn RON</strong>
                  <p>Gain reputation through work</p>
                </div>
                <div className="progression-arrow">→</div>
                <div className="progression-step">
                  <strong>Unlock Higher Tiers</strong>
                  <p>Access better-paying requests</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Validation Mechanics */}
        <section className="validation-mechanics-section">
          <div className="container">
            <h2 className="section-title">How Validation Works</h2>
            <p className="section-intro">Step-by-step breakdown of the validation lifecycle</p>

            <div className="lifecycle-flow">
              <div className="lifecycle-step step-1">
                <div className="step-header">
                  <div className="step-number">Step 1</div>
                  <h3>Request Creation</h3>
                </div>
                <div className="step-content">
                  <p><strong>By Company/Enterprise:</strong></p>
                  <div className="request-details">
                    <div className="detail-item">
                      <span className="detail-label">Question:</span>
                      <span className="detail-value">"What was BTC/USD at timestamp?"</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Required Validators:</span>
                      <span className="detail-value">7 validators</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Consensus Threshold:</span>
                      <span className="detail-value">5 of 7 must agree (71%)</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Reward Pool:</span>
                      <span className="detail-value">1,000 RDLN</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Deadline:</span>
                      <span className="detail-value">24 hours</span>
                    </div>
                  </div>
                  <p className="cost-note">Company pays: 1,000 RDLN + 100 RDLN fee (10%) = 1,100 RDLN total</p>
                </div>
              </div>

              <div className="lifecycle-step step-2">
                <div className="step-header">
                  <div className="step-number">Step 2</div>
                  <h3>Validator Participation</h3>
                </div>
                <div className="step-content">
                  <p><strong>Browse & Submit:</strong></p>
                  <ul className="participation-steps">
                    <li>Browse available validation requests</li>
                    <li>Choose requests matching your tier</li>
                    <li>Research the question thoroughly</li>
                    <li>Prepare answer with proof/evidence</li>
                    <li>Submit answer hash + proof URI</li>
                    <li>Stake RON as collateral (risk/reward)</li>
                  </ul>
                  <div className="stake-example">
                    <strong>Staking Example:</strong>
                    <p>You stake 10 RON. If correct, you get it back + RDLN reward. If wrong, you lose 50% (5 RON slashed).</p>
                  </div>
                </div>
              </div>

              <div className="lifecycle-step step-3">
                <div className="step-header">
                  <div className="step-number">Step 3</div>
                  <h3>Consensus Determination</h3>
                </div>
                <div className="step-content">
                  <p><strong>Automatic Processing:</strong></p>
                  <div className="consensus-process">
                    <div className="process-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Count submissions per unique answer</span>
                    </div>
                    <div className="process-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Determine majority answer</span>
                    </div>
                    <div className="process-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Check if majority ≥ threshold (e.g., 5 of 7)</span>
                    </div>
                    <div className="process-item success">
                      <i className="fas fa-trophy"></i>
                      <span>If yes: Consensus reached</span>
                    </div>
                    <div className="process-item failure">
                      <i className="fas fa-times-circle"></i>
                      <span>If no: No consensus (refund - 5% fee)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lifecycle-step step-4">
                <div className="step-header">
                  <div className="step-number">Step 4</div>
                  <h3>Reward Distribution</h3>
                </div>
                <div className="step-content">
                  <p><strong>For Correct Validators:</strong></p>
                  <ul className="reward-distribution">
                    <li>Reward share = (your stake / total correct stake) × reward pool</li>
                    <li>Receive RDLN reward</li>
                    <li>Get staked RON back</li>
                    <li>Reputation +10 points</li>
                    <li>Accuracy % increases</li>
                  </ul>
                  <p><strong>For Incorrect Validators:</strong></p>
                  <ul className="punishment-list">
                    <li>Slash 50% of staked RON</li>
                    <li>Burn 50% of slashed amount</li>
                    <li>Distribute other 50% to correct validators</li>
                    <li>Reputation -20 points</li>
                    <li>Accuracy % decreases</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Economics & Earning */}
        <section className="earnings-section alt">
          <div className="container">
            <h2 className="section-title">Economics & Earning Potential</h2>
            <p className="section-intro">Real numbers on what validators earn across different tiers</p>

            <div className="earnings-grid">
              <div className="earnings-card">
                <h3>Bronze Validator Example</h3>
                <div className="validator-stats">
                  <div className="stat">
                    <span className="stat-label">Activity Level</span>
                    <span className="stat-value">10 validations/week</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Avg Reward</span>
                    <span className="stat-value">500 RDLN each</span>
                  </div>
                </div>
                <div className="earnings-breakdown">
                  <div className="earning-row">
                    <span>Weekly Earnings (Oracle)</span>
                    <span className="amount">5,000 RDLN</span>
                  </div>
                  <div className="earning-row">
                    <span>Monthly Earnings (Oracle)</span>
                    <span className="amount">20,000 RDLN</span>
                  </div>
                  <div className="earning-row bonus">
                    <span>Phase 3 Airdrop Bonus</span>
                    <span className="amount">+500 RDLN/validation</span>
                  </div>
                  <div className="earning-row total">
                    <span>Total per Validation</span>
                    <span className="amount">~1,000 RDLN</span>
                  </div>
                </div>
              </div>

              <div className="earnings-card highlight">
                <h3>Gold Validator Example</h3>
                <div className="validator-stats">
                  <div className="stat">
                    <span className="stat-label">Activity Level</span>
                    <span className="stat-value">20 validations/week</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Avg Reward</span>
                    <span className="stat-value">2,000 RDLN each</span>
                  </div>
                </div>
                <div className="earnings-breakdown">
                  <div className="earning-row">
                    <span>Weekly Earnings (Oracle)</span>
                    <span className="amount">40,000 RDLN</span>
                  </div>
                  <div className="earning-row">
                    <span>Monthly Earnings (Oracle)</span>
                    <span className="amount">160,000 RDLN</span>
                  </div>
                  <div className="earning-row bonus">
                    <span>Phase 3 Airdrop Bonus</span>
                    <span className="amount">+500 RDLN/validation</span>
                  </div>
                  <div className="earning-row total">
                    <span>Total per Validation</span>
                    <span className="amount">~2,500 RDLN</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="validation-earnings-table">
              <h3>Earnings by Validator Tier</h3>
              <div className="earnings-table">
                <div className="table-header">
                  <span>Tier</span>
                  <span>Pool Share Range</span>
                  <span>Phase 3 Bonus</span>
                  <span>Per Validation</span>
                </div>
                <div className="table-row">
                  <span>Bronze (100 RON)</span>
                  <span>100-500 RDLN</span>
                  <span>500 RDLN</span>
                  <span>600-1,000 RDLN</span>
                </div>
                <div className="table-row">
                  <span>Silver (1K RON)</span>
                  <span>500-2,000 RDLN</span>
                  <span>500 RDLN</span>
                  <span>1K-2.5K RDLN</span>
                </div>
                <div className="table-row highlight">
                  <span>Gold (10K RON)</span>
                  <span>2K-10K RDLN</span>
                  <span>500 RDLN</span>
                  <span>2.5K-10.5K RDLN</span>
                </div>
                <div className="table-row bonus">
                  <span>Platinum (100K RON)</span>
                  <span>10K+ RDLN</span>
                  <span>500 RDLN</span>
                  <span>10.5K+ RDLN</span>
                </div>
              </div>
              <p className="table-note">Oracle payments are shares of request pools (variable). Higher tiers access bigger requests. Phase 3 bonus caps at 5K total, but Oracle earnings are UNLIMITED!</p>
            </div>

            <div className="revenue-streams-box">
              <h3>Protocol Revenue Streams</h3>
              <div className="revenue-grid">
                <div className="revenue-item">
                  <h4>10% Fee on All Requests</h4>
                  <p>Riddlen takes 10% protocol fee on all validation rewards</p>
                  <div className="fee-example">
                    <span>1,000 RDLN request</span>
                    <span>→ 100 RDLN fee</span>
                  </div>
                </div>
                <div className="revenue-item">
                  <h4>50% of Slashed Stakes</h4>
                  <p>Other 50% distributed to correct validators as bonus</p>
                  <div className="fee-example">
                    <span>10 RON slashed</span>
                    <span>→ 5 RON burned, 5 RON to validators</span>
                  </div>
                </div>
              </div>
              <div className="fee-distribution">
                <h4>Protocol Fee Distribution:</h4>
                <div className="distribution-bars">
                  <div className="distribution-item">
                    <span>50% → Treasury (ops, dev)</span>
                    <div className="dist-bar" style={{ width: '50%' }}></div>
                  </div>
                  <div className="distribution-item">
                    <span>30% → RDLN Buyback & Burn</span>
                    <div className="dist-bar" style={{ width: '30%' }}></div>
                  </div>
                  <div className="distribution-item">
                    <span>20% → Top Validator Bonus Pool</span>
                    <div className="dist-bar" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Trust */}
        <section className="security-section">
          <div className="container">
            <h2 className="section-title">Security & Trust Mechanisms</h2>
            <p className="section-intro">How Riddlen prevents attacks and ensures data integrity</p>

            <div className="security-grid">
              <div className="security-card">
                <div className="security-icon">🛡️</div>
                <h3>Sybil Attack Prevention</h3>
                <ul className="security-list">
                  <li><i className="fas fa-check"></i> Minimum RON balance required (reputation-based)</li>
                  <li><i className="fas fa-check"></i> Higher rewards require higher tiers</li>
                  <li><i className="fas fa-check"></i> Stake required (economic cost)</li>
                  <li><i className="fas fa-check"></i> RON is soul-bound (can't buy reputation)</li>
                </ul>
              </div>

              <div className="security-card">
                <div className="security-icon">🔒</div>
                <h3>Collusion Prevention</h3>
                <ul className="security-list">
                  <li><i className="fas fa-check"></i> Validators don't know who else is validating</li>
                  <li><i className="fas fa-check"></i> Can't change answer after submission</li>
                  <li><i className="fas fa-check"></i> Random selection for high-value requests</li>
                  <li><i className="fas fa-check"></i> Time-delayed consensus reveal</li>
                </ul>
              </div>

              <div className="security-card">
                <div className="security-icon">⚖️</div>
                <h3>Validator Accountability</h3>
                <ul className="security-list">
                  <li><i className="fas fa-check"></i> Reputation scoring (persistent)</li>
                  <li><i className="fas fa-check"></i> Economic stake at risk</li>
                  <li><i className="fas fa-check"></i> Slashing for incorrect answers</li>
                  <li><i className="fas fa-check"></i> Suspension mechanism (below 70% accuracy)</li>
                </ul>
              </div>

              <div className="security-card">
                <div className="security-icon">📊</div>
                <h3>Accuracy Tracking</h3>
                <div className="accuracy-formula">
                  <p><strong>Accuracy = (Correct Validations / Total Validations) × 100</strong></p>
                </div>
                <div className="accuracy-effects">
                  <div className="accuracy-tier bad">
                    <span>&lt; 70%</span>
                    <span>Temporary suspension</span>
                  </div>
                  <div className="accuracy-tier normal">
                    <span>70-85%</span>
                    <span>Normal access</span>
                  </div>
                  <div className="accuracy-tier good">
                    <span>85-95%</span>
                    <span>Premium access</span>
                  </div>
                  <div className="accuracy-tier elite">
                    <span>&gt; 95%</span>
                    <span>Elite validator status</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="use-cases-section alt">
          <div className="container">
            <h2 className="section-title">Real-World Use Cases</h2>
            <p className="section-intro">Enterprises pay validators to verify data requiring human intelligence</p>

            <div className="use-cases-grid">
              <div className="use-case-card">
                <div className="use-case-number">1</div>
                <h3>Financial Data Verification</h3>
                <div className="use-case-example">
                  <strong>Example:</strong> "What was BTC/USD price at specific timestamp?"
                </div>
                <div className="use-case-details">
                  <div className="detail-row">
                    <span>Companies:</span>
                    <span>Trading platforms, DeFi protocols</span>
                  </div>
                  <div className="detail-row">
                    <span>Reward:</span>
                    <span>500-1,000 RDLN</span>
                  </div>
                  <div className="detail-row">
                    <span>Validators:</span>
                    <span>Check multiple price feeds</span>
                  </div>
                  <div className="detail-row">
                    <span>Consensus:</span>
                    <span>5 of 7 agreement</span>
                  </div>
                </div>
              </div>

              <div className="use-case-card">
                <div className="use-case-number">2</div>
                <h3>Blockchain Event Confirmation</h3>
                <div className="use-case-example">
                  <strong>Example:</strong> "Did transaction 0x123... occur on Ethereum?"
                </div>
                <div className="use-case-details">
                  <div className="detail-row">
                    <span>Companies:</span>
                    <span>Cross-chain bridges, auditors</span>
                  </div>
                  <div className="detail-row">
                    <span>Reward:</span>
                    <span>300-800 RDLN</span>
                  </div>
                  <div className="detail-row">
                    <span>Validators:</span>
                    <span>Verify on blockchain explorers</span>
                  </div>
                  <div className="detail-row">
                    <span>Consensus:</span>
                    <span>3 of 5 agreement</span>
                  </div>
                </div>
              </div>

              <div className="use-case-card">
                <div className="use-case-number">3</div>
                <h3>Content Moderation</h3>
                <div className="use-case-example">
                  <strong>Example:</strong> "Does this image violate community guidelines?"
                </div>
                <div className="use-case-details">
                  <div className="detail-row">
                    <span>Companies:</span>
                    <span>Social platforms, marketplaces</span>
                  </div>
                  <div className="detail-row">
                    <span>Reward:</span>
                    <span>200-500 RDLN per item</span>
                  </div>
                  <div className="detail-row">
                    <span>Validators:</span>
                    <span>Human judgment required</span>
                  </div>
                  <div className="detail-row">
                    <span>Consensus:</span>
                    <span>5 of 7 agreement</span>
                  </div>
                </div>
              </div>

              <div className="use-case-card">
                <div className="use-case-number">4</div>
                <h3>Research Validation</h3>
                <div className="use-case-example">
                  <strong>Example:</strong> "Is this scientific claim accurate?"
                </div>
                <div className="use-case-details">
                  <div className="detail-row">
                    <span>Companies:</span>
                    <span>Research institutions</span>
                  </div>
                  <div className="detail-row">
                    <span>Reward:</span>
                    <span>2,000-5,000 RDLN</span>
                  </div>
                  <div className="detail-row">
                    <span>Validators:</span>
                    <span>Domain experts (high RON)</span>
                  </div>
                  <div className="detail-row">
                    <span>Consensus:</span>
                    <span>7 of 10 agreement</span>
                  </div>
                </div>
              </div>

              <div className="use-case-card">
                <div className="use-case-number">5</div>
                <h3>Supply Chain Verification</h3>
                <div className="use-case-example">
                  <strong>Example:</strong> "Did shipment arrive at location X?"
                </div>
                <div className="use-case-details">
                  <div className="detail-row">
                    <span>Companies:</span>
                    <span>Logistics, e-commerce</span>
                  </div>
                  <div className="detail-row">
                    <span>Reward:</span>
                    <span>300-600 RDLN</span>
                  </div>
                  <div className="detail-row">
                    <span>Validators:</span>
                    <span>Local verification with photos</span>
                  </div>
                  <div className="detail-row">
                    <span>Consensus:</span>
                    <span>3 of 5 agreement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Career Path */}
        <section className="career-path-section">
          <div className="container">
            <h2 className="section-title">Validator Career Path</h2>
            <p className="section-intro">From beginner to elite validator - your complete journey</p>

            <div className="career-timeline">
              <div className="career-stage">
                <div className="stage-marker">Week 1-4</div>
                <div className="stage-content">
                  <h3>Build Foundation</h3>
                  <p>Earn your first 1,000 RON through riddle solving</p>
                  <ul>
                    <li>Solve EASY riddles consistently</li>
                    <li>Learn the riddle mechanics</li>
                    <li>Build solving confidence</li>
                    <li>Reach Bronze validator tier</li>
                  </ul>
                  <div className="stage-milestone">Milestone: 1,000 RON earned</div>
                </div>
              </div>

              <div className="career-stage">
                <div className="stage-marker">Week 5-6</div>
                <div className="stage-content">
                  <h3>First Validations</h3>
                  <p>Join Oracle Network and complete initial validations</p>
                  <ul>
                    <li>Register as Bronze validator</li>
                    <li>Browse basic validation requests</li>
                    <li>Complete 3-5 validations carefully</li>
                    <li>Build 70%+ accuracy rate</li>
                  </ul>
                  <div className="stage-milestone">Milestone: 5 successful validations</div>
                </div>
              </div>

              <div className="career-stage">
                <div className="stage-marker">Week 7-12</div>
                <div className="stage-content">
                  <h3>Build Reputation</h3>
                  <p>Increase validation volume and accuracy</p>
                  <ul>
                    <li>Complete 10-20 validations</li>
                    <li>Maintain 75%+ accuracy</li>
                    <li>Earn more RON from validations</li>
                    <li>Qualify for Phase 3 airdrop bonus</li>
                  </ul>
                  <div className="stage-milestone">Milestone: Silver tier unlocked</div>
                </div>
              </div>

              <div className="career-stage">
                <div className="stage-marker">Month 3-6</div>
                <div className="stage-content">
                  <h3>Scale Up</h3>
                  <p>Access medium complexity validations</p>
                  <ul>
                    <li>Silver tier active (1,000+ RON)</li>
                    <li>Higher paying requests available</li>
                    <li>Build toward 10,000 RON for Gold</li>
                    <li>Maintain 80%+ accuracy</li>
                  </ul>
                  <div className="stage-milestone">Milestone: 50+ validations completed</div>
                </div>
              </div>

              <div className="career-stage">
                <div className="stage-marker">Month 6-12</div>
                <div className="stage-content">
                  <h3>Expert Status</h3>
                  <p>Unlock Gold tier premium validations</p>
                  <ul>
                    <li>10,000+ RON achieved</li>
                    <li>85%+ accuracy maintained</li>
                    <li>Access 2K-10K RDLN requests</li>
                    <li>Consistent weekly income</li>
                  </ul>
                  <div className="stage-milestone">Milestone: Gold validator tier</div>
                </div>
              </div>

              <div className="career-stage">
                <div className="stage-marker">Year 2+</div>
                <div className="stage-content">
                  <h3>Elite Validator</h3>
                  <p>Platinum tier and domain expertise</p>
                  <ul>
                    <li>100,000+ RON accumulated</li>
                    <li>95%+ accuracy (elite status)</li>
                    <li>Enterprise premium requests</li>
                    <li>10K+ RDLN per validation</li>
                  </ul>
                  <div className="stage-milestone">Milestone: Platinum validator tier</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration with Ecosystem */}
        <section className="integration-section alt">
          <div className="container">
            <h2 className="section-title">Integration with Riddlen Ecosystem</h2>
            <p className="section-intro">Oracle Network connects to all major Riddlen systems</p>

            <div className="integration-grid">
              <div className="integration-card">
                <div className="integration-icon">🎁</div>
                <h3>Airdrop Phase 3 Connection</h3>
                <div className="connection-details">
                  <div className="connection-item">
                    <i className="fas fa-arrow-right"></i>
                    <p>Every validation earns variable Oracle pool share (100-10K+ RDLN based on tier)</p>
                  </div>
                  <div className="connection-item">
                    <i className="fas fa-arrow-right"></i>
                    <p>Plus Phase 3 airdrop bonus (500 RDLN fixed per validation)</p>
                  </div>
                  <div className="connection-item">
                    <i className="fas fa-arrow-right"></i>
                    <p>Total per validation: ~3,833 RDLN</p>
                  </div>
                  <div className="connection-item">
                    <i className="fas fa-arrow-right"></i>
                    <p>10+ validations: Unlock 25% Phase 3 bonus</p>
                  </div>
                </div>
              </div>

              <div className="integration-card">
                <div className="integration-icon">🏆</div>
                <h3>RON Progression</h3>
                <div className="connection-details">
                  <div className="connection-item">
                    <i className="fas fa-arrow-right"></i>
                    <p>Earn RON through validations</p>
                  </div>
                  <div className="connection-item">
                    <i className="fas fa-arrow-right"></i>
                    <p>Higher RON → Higher validator tier</p>
                  </div>
                  <div className="connection-item">
                    <i className="fas fa-arrow-right"></i>
                    <p>Higher tier → Better request access</p>
                  </div>
                  <div className="connection-item">
                    <i className="fas fa-arrow-right"></i>
                    <p>Better requests → More RDLN earned</p>
                  </div>
                </div>
              </div>

              <div className="integration-card">
                <div className="integration-icon">🗳️</div>
                <h3>DAO Governance</h3>
                <div className="connection-details">
                  <div className="connection-item">
                    <i className="fas fa-arrow-right"></i>
                    <p>Validators accumulate RON (voting power)</p>
                  </div>
                  <div className="connection-item">
                    <i className="fas fa-arrow-right"></i>
                    <p>1 RON = 1 vote in governance</p>
                  </div>
                  <div className="connection-item">
                    <i className="fas fa-arrow-right"></i>
                    <p>Influence protocol parameters</p>
                  </div>
                  <div className="connection-item">
                    <i className="fas fa-arrow-right"></i>
                    <p>Vote on Oracle Network improvements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="getting-started-section">
          <div className="container">
            <h2 className="section-title">How to Become a Validator</h2>
            <p className="section-intro">Step-by-step guide to start earning as a validator</p>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-badge">Step 1</div>
                <h3>Qualify as Validator</h3>
                <p>Build minimum 100 RON reputation (1,000 RON recommended for Silver tier)</p>
                <div className="step-code">
                  <code>const ronBalance = await ron.balanceOf(userAddress);</code>
                  <code>// Need: 100 RON minimum for Bronze</code>
                </div>
              </div>

              <div className="step-card">
                <div className="step-badge">Step 2</div>
                <h3>Browse Requests</h3>
                <p>View available validation requests matching your tier</p>
                <div className="step-code">
                  <code>const requests = await oracleNetwork.getOpenRequests();</code>
                  <code>// Filter by tier, category, min reward</code>
                </div>
              </div>

              <div className="step-card">
                <div className="step-badge">Step 3</div>
                <h3>Research & Submit</h3>
                <p>Thoroughly research the question and submit your answer with proof</p>
                <div className="step-code">
                  <code>await oracleNetwork.submitValidation(</code>
                  <code>  requestId, answerHash, proofURI, stakeAmount</code>
                  <code>);</code>
                </div>
              </div>

              <div className="step-card">
                <div className="step-badge">Step 4</div>
                <h3>Wait for Consensus</h3>
                <p>Other validators submit answers, consensus algorithm runs automatically</p>
                <div className="step-note">
                  <p>Typical timeframe: 6-24 hours depending on request deadline</p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-badge">Step 5</div>
                <h3>Claim Rewards</h3>
                <p>If correct, claim your RDLN reward and get staked RON back</p>
                <div className="step-code">
                  <code>const reward = await oracleNetwork.claimValidationReward(requestId);</code>
                  <code>{'console.log(`Earned: ${reward} RDLN`);'}</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-box">
              <h2>Ready to Start Earning as a Validator?</h2>
              <p>Build 1,000 RON, join the Oracle Network, and start earning unlimited RDLN through human intelligence validation.</p>
              <div className="cta-buttons">
                <a href="/quick-start" className="btn-cta-primary">
                  <i className="fas fa-play"></i> Start Building RON
                </a>
                <a href="/airdrop-guide" className="btn-cta-secondary">
                  <i className="fas fa-gift"></i> Learn About Phase 3
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .hero-section {
          background: linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(255, 215, 0, 0.1));
          padding: 4rem 0 3rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }

        .page-title {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(45deg, #8A2BE2, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .page-subtitle {
          font-size: 1.3rem;
          color: #cccccc;
          margin-bottom: 3rem;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-badge {
          background: linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(255, 215, 0, 0.15));
          border: 2px solid rgba(255, 215, 0, 0.5);
          border-radius: 20px;
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .badge-icon {
          font-size: 4rem;
        }

        .badge-title {
          color: #8A2BE2;
          font-weight: 700;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }

        .badge-value {
          color: #FFD700;
          font-weight: 800;
          font-size: 1.8rem;
          margin-bottom: 0.25rem;
        }

        .badge-subtitle {
          color: #cccccc;
          font-size: 0.9rem;
        }

        .prerequisites-section {
          padding: 5rem 0;
        }

        .section-title {
          text-align: center;
          font-size: 2.8rem;
          font-weight: 800;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .section-intro {
          text-align: center;
          font-size: 1.2rem;
          color: #cccccc;
          margin-bottom: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .prerequisites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .prerequisite-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(138, 43, 226, 0.5);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .prereq-number {
          width: 50px;
          height: 50px;
          background: linear-gradient(45deg, #8A2BE2, #9370DB);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .prerequisite-card h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .prerequisite-card > p {
          color: #cccccc;
          margin-bottom: 1.5rem;
        }

        .prereq-path {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .path-option {
          background: rgba(0, 0, 0, 0.3);
          border-left: 3px solid #FFD700;
          border-radius: 10px;
          padding: 1rem;
        }

        .path-option strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.5rem;
        }

        .path-option p {
          color: #cccccc;
          margin: 0.25rem 0;
        }

        .time-estimate {
          color: #FFA500 !important;
          font-style: italic;
        }

        .setup-list, .understanding-list {
          list-style: none;
          padding: 0;
        }

        .setup-list li, .understanding-list li {
          color: #9370DB;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .setup-list li:before, .understanding-list li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: #FFD700;
        }

        .prereq-callout {
          background: rgba(255, 215, 0, 0.15);
          border: 2px solid rgba(255, 215, 0, 0.4);
          border-radius: 15px;
          padding: 2rem;
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .prereq-callout i {
          color: #FFD700;
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .prereq-callout strong {
          color: #FFD700;
          display: block;
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }

        .prereq-callout p {
          color: #cccccc;
          margin: 0;
        }

        .tiers-section {
          padding: 5rem 0;
        }

        .alt {
          background: rgba(0, 0, 0, 0.2);
        }

        .tiers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .tier-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid;
          border-radius: 20px;
          padding: 2rem;
        }

        .tier-card.bronze {
          border-color: rgba(205, 127, 50, 0.6);
        }

        .tier-card.silver {
          border-color: rgba(192, 192, 192, 0.6);
        }

        .tier-card.gold {
          border-color: rgba(255, 215, 0, 0.6);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
        }

        .tier-card.platinum {
          border-color: rgba(255, 105, 180, 0.6);
          background: linear-gradient(135deg, rgba(255, 105, 180, 0.15), rgba(138, 43, 226, 0.1));
        }

        .tier-badge {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 215, 0, 0.2);
        }

        .tier-badge .badge-icon {
          font-size: 3rem;
        }

        .tier-badge .badge-text {
          font-size: 2rem;
          font-weight: 700;
          color: #FFD700;
        }

        .tier-requirements {
          margin-bottom: 1.5rem;
        }

        .req-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .req-label {
          color: #9370DB;
        }

        .req-value {
          color: #FFD700;
          font-weight: 700;
        }

        .tier-access, .tier-rewards {
          margin-bottom: 1.5rem;
        }

        .tier-access h4, .tier-rewards h4 {
          color: #FFD700;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .tier-access p, .tier-rewards p {
          color: #cccccc;
          margin: 0;
        }

        .reward-range {
          color: #FFD700 !important;
          font-weight: 700 !important;
          font-size: 1.3rem !important;
        }

        .reward-note {
          font-size: 0.9rem !important;
          color: #9370DB !important;
        }

        .tier-examples {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
        }

        .tier-examples strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.75rem;
        }

        .tier-examples ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .tier-examples ul li {
          color: #cccccc;
          padding: 0.25rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .tier-examples ul li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #FFD700;
        }

        .tier-progression-box {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .tier-progression-box h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .progression-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .progression-step {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          flex: 1;
          min-width: 150px;
          text-align: center;
        }

        .progression-step strong {
          color: #FFD700;
          display: block;
          margin-bottom: 0.5rem;
        }

        .progression-step p {
          color: #cccccc;
          margin: 0;
          font-size: 0.9rem;
        }

        .progression-arrow {
          color: #FFD700;
          font-size: 2rem;
          font-weight: 700;
        }

        .validation-mechanics-section {
          padding: 5rem 0;
        }

        .lifecycle-flow {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .lifecycle-step {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 215, 0, 0.2);
        }

        .step-number {
          background: linear-gradient(45deg, #8A2BE2, #9370DB);
          color: #fff;
          padding: 0.75rem 1.5rem;
          border-radius: 15px;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .step-header h3 {
          color: #FFD700;
          font-size: 2rem;
          margin: 0;
        }

        .step-content p {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        .request-details {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1.5rem;
          margin: 1rem 0;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: #9370DB;
        }

        .detail-value {
          color: #FFD700;
          font-weight: 700;
        }

        .cost-note {
          color: #FFA500 !important;
          font-style: italic;
          margin-top: 1rem !important;
        }

        .participation-steps {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }

        .participation-steps li {
          color: #9370DB;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .participation-steps li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: #FFD700;
        }

        .stake-example {
          background: rgba(138, 43, 226, 0.15);
          border: 1px solid rgba(138, 43, 226, 0.4);
          border-radius: 10px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .stake-example strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.5rem;
        }

        .stake-example p {
          color: #cccccc !important;
          margin: 0 !important;
        }

        .consensus-process {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 1rem 0;
        }

        .process-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
        }

        .process-item i {
          color: #FFD700;
          font-size: 1.5rem;
        }

        .process-item.success {
          border-left: 3px solid #00FF7F;
        }

        .process-item.failure {
          border-left: 3px solid #FF6347;
        }

        .process-item span {
          color: #cccccc;
        }

        .reward-distribution, .punishment-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }

        .reward-distribution li {
          color: #00FF7F;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .reward-distribution li:before {
          content: "✓";
          position: absolute;
          left: 0;
        }

        .punishment-list li {
          color: #FF6347;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .punishment-list li:before {
          content: "✗";
          position: absolute;
          left: 0;
        }

        .earnings-section {
          padding: 5rem 0;
        }

        .earnings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .earnings-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .earnings-card.highlight {
          border-color: rgba(255, 215, 0, 0.6);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1));
        }

        .earnings-card h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }

        .validator-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 215, 0, 0.2);
        }

        .stat {
          display: flex;
          justify-content: space-between;
        }

        .stat-label {
          color: #9370DB;
        }

        .stat-value {
          color: #FFD700;
          font-weight: 700;
        }

        .earnings-breakdown {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1.5rem;
        }

        .earning-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .earning-row:last-child {
          border-bottom: none;
        }

        .earning-row span:first-child {
          color: #cccccc;
        }

        .amount {
          color: #FFD700;
          font-weight: 700;
        }

        .earning-row.bonus {
          background: rgba(138, 43, 226, 0.1);
          border-radius: 5px;
          padding: 0.75rem;
        }

        .earning-row.total {
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.2), transparent);
          border-top: 2px solid rgba(255, 215, 0, 0.4);
          margin-top: 0.5rem;
          padding: 1rem;
          font-size: 1.1rem;
        }

        .validation-earnings-table {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 3rem;
        }

        .validation-earnings-table h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .earnings-table {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          overflow: hidden;
        }

        .table-header, .table-row {
          display: grid;
          grid-template-columns: 1.5fr 2fr 2fr 2fr;
          gap: 1rem;
          padding: 1rem;
          align-items: center;
        }

        .table-header {
          background: rgba(255, 215, 0, 0.2);
          color: #FFD700;
          font-weight: 700;
        }

        .table-row {
          color: #cccccc;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .table-row.highlight {
          background: rgba(255, 215, 0, 0.1);
          color: #FFD700;
          font-weight: 700;
        }

        .table-row.bonus {
          background: rgba(138, 43, 226, 0.15);
        }

        .table-note {
          margin-top: 1rem;
          color: #9370DB;
          font-style: italic;
          text-align: center;
        }

        .revenue-streams-box {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(138, 43, 226, 0.5);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .revenue-streams-box h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .revenue-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .revenue-item h4 {
          color: #9370DB;
          margin-bottom: 1rem;
        }

        .revenue-item p {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        .fee-example {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .fee-example span:first-child {
          color: #9370DB;
        }

        .fee-example span:last-child {
          color: #FFD700;
          font-weight: 700;
        }

        .fee-distribution h4 {
          color: #9370DB;
          margin-bottom: 1.5rem;
        }

        .distribution-bars {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .distribution-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .distribution-item span {
          color: #cccccc;
        }

        .dist-bar {
          height: 25px;
          background: linear-gradient(90deg, #FFD700, #FFA500);
          border-radius: 12px;
        }

        .security-section {
          padding: 5rem 0;
        }

        .security-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .security-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(138, 43, 226, 0.5);
          border-radius: 20px;
          padding: 2.5rem;
          text-align: center;
        }

        .security-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .security-card h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }

        .security-list {
          list-style: none;
          padding: 0;
          text-align: left;
        }

        .security-list li {
          color: #cccccc;
          padding: 0.75rem 0;
          padding-left: 2rem;
          position: relative;
        }

        .security-list li i {
          position: absolute;
          left: 0;
          color: #00FF7F;
        }

        .accuracy-formula {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .accuracy-formula p {
          color: #FFD700;
          font-weight: 700;
          text-align: center;
          margin: 0;
        }

        .accuracy-effects {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .accuracy-tier {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border-radius: 5px;
        }

        .accuracy-tier.bad {
          background: rgba(255, 99, 71, 0.2);
          border-left: 3px solid #FF6347;
        }

        .accuracy-tier.normal {
          background: rgba(255, 215, 0, 0.1);
          border-left: 3px solid #FFD700;
        }

        .accuracy-tier.good {
          background: rgba(0, 255, 127, 0.2);
          border-left: 3px solid #00FF7F;
        }

        .accuracy-tier.elite {
          background: rgba(138, 43, 226, 0.2);
          border-left: 3px solid #8A2BE2;
        }

        .accuracy-tier span:first-child {
          color: #9370DB;
          font-weight: 700;
        }

        .accuracy-tier span:last-child {
          color: #cccccc;
          font-size: 0.9rem;
        }

        .use-cases-section {
          padding: 5rem 0;
        }

        .use-cases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .use-case-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .use-case-number {
          width: 50px;
          height: 50px;
          background: linear-gradient(45deg, #8A2BE2, #9370DB);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .use-case-card h3 {
          color: #FFD700;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .use-case-example {
          background: rgba(0, 0, 0, 0.3);
          border-left: 3px solid #FFD700;
          border-radius: 5px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .use-case-example strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.5rem;
        }

        .use-case-details {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row span:first-child {
          color: #9370DB;
        }

        .detail-row span:last-child {
          color: #cccccc;
          text-align: right;
        }

        .career-path-section {
          padding: 5rem 0;
        }

        .career-timeline {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .career-stage {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        .stage-marker {
          background: linear-gradient(45deg, #8A2BE2, #9370DB);
          color: #fff;
          padding: 1rem 1.5rem;
          border-radius: 15px;
          font-weight: 700;
          white-space: nowrap;
          min-width: 120px;
          text-align: center;
        }

        .stage-content {
          flex: 1;
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2rem;
        }

        .stage-content h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .stage-content > p {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        .stage-content ul {
          list-style: none;
          padding: 0;
          margin-bottom: 1.5rem;
        }

        .stage-content ul li {
          color: #9370DB;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .stage-content ul li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: #FFD700;
        }

        .stage-milestone {
          background: rgba(138, 43, 226, 0.2);
          border-left: 3px solid #8A2BE2;
          border-radius: 5px;
          padding: 1rem;
          color: #FFD700;
          font-weight: 700;
        }

        .integration-section {
          padding: 5rem 0;
        }

        .integration-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .integration-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(138, 43, 226, 0.5);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .integration-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .integration-card h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }

        .connection-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .connection-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .connection-item i {
          color: #FFD700;
          margin-top: 0.25rem;
        }

        .connection-item p {
          color: #cccccc;
          margin: 0;
        }

        .getting-started-section {
          padding: 5rem 0;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .step-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .step-badge {
          background: linear-gradient(45deg, #8A2BE2, #9370DB);
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: 15px;
          font-weight: 700;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .step-card h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .step-card > p {
          color: #cccccc;
          margin-bottom: 1.5rem;
        }

        .step-code {
          background: rgba(0, 0, 0, 0.6);
          border-left: 3px solid #8A2BE2;
          border-radius: 5px;
          padding: 1rem;
          font-family: monospace;
          font-size: 0.9rem;
        }

        .step-code code {
          display: block;
          color: #9370DB;
          margin: 0.25rem 0;
        }

        .step-note {
          background: rgba(138, 43, 226, 0.15);
          border: 1px solid rgba(138, 43, 226, 0.4);
          border-radius: 10px;
          padding: 1rem;
        }

        .step-note p {
          color: #cccccc !important;
          margin: 0 !important;
        }

        .cta-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(255, 215, 0, 0.1));
        }

        .cta-box {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
          border: 2px solid rgba(255, 215, 0, 0.4);
          border-radius: 25px;
          padding: 4rem;
          text-align: center;
        }

        .cta-box h2 {
          color: #FFD700;
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .cta-box > p {
          color: #cccccc;
          font-size: 1.3rem;
          margin-bottom: 2.5rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .btn-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 1.2rem 3rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .btn-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: transparent;
          color: #FFD700;
          border: 2px solid #FFD700;
          padding: 1.2rem 3rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .btn-cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(255, 215, 0, 0.5);
        }

        .btn-cta-secondary:hover {
          background: rgba(255, 215, 0, 0.1);
          transform: translateY(-3px);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2.5rem;
          }

          .prerequisites-grid {
            grid-template-columns: 1fr;
          }

          .tiers-grid {
            grid-template-columns: 1fr;
          }

          .progression-flow {
            flex-direction: column;
          }

          .progression-arrow {
            transform: rotate(90deg);
          }

          .table-header, .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .career-stage {
            flex-direction: column;
          }

          .stage-marker {
            min-width: auto;
          }
        }
      `}</style>
    </>
  );
}
