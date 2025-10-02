import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';

export default function Airdrop() {
  return (
    <>
      <Head>
        <title>100M RDLN Airdrop - Three Ways to Earn | Riddlen</title>
        <meta name="description" content="Earn RDLN through our revolutionary 3-phase airdrop: Social proof via Farcaster, RON reputation tiers, and validation work. 15K max per wallet!" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">🎁</div>
        <div className="floating-riddle">💎</div>
        <div className="floating-riddle">⚡</div>
      </div>

      <Header currentPage="airdrop" />

      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        {/* Hero Section */}
        <section className="airdrop-hero">
          <div className="container">
            <h1 className="hero-title">🎁 100M RDLN Airdrop</h1>
            <p className="hero-subtitle">Three simultaneous ways to earn. Participate in all phases to maximize your rewards!</p>

            <div className="hero-stats">
              <div className="stat-box">
                <div className="stat-value">100M</div>
                <div className="stat-label">Total RDLN Pool</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">15K</div>
                <div className="stat-label">Max Per Wallet</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">3</div>
                <div className="stat-label">Ways to Earn</div>
              </div>
            </div>

            <div className="contract-badge">
              <span>Airdrop Contract:</span>
              <a href="https://amoy.polygonscan.com/address/0x4f3f2202f3F865074f534aA324a259DF962C6FBA" target="_blank" rel="noopener noreferrer">
                0x4f3f22...C6FBA <i className="fas fa-external-link-alt"></i>
              </a>
            </div>

            <div className="early-banner">
              <i className="fas fa-rocket"></i>
              <div>
                <strong>We're Building in Public!</strong>
                <p>Oracle network live • Validation active • First NFTs minting soon • Early testers wanted</p>
              </div>
            </div>
          </div>
        </section>

        {/* Three Phases Overview */}
        <section className="phases-overview">
          <div className="container">
            <h2 className="section-title">Three-Phase Earning System</h2>
            <p className="section-intro">All three phases run simultaneously. Stack your earnings across multiple phases!</p>

            <div className="phases-grid">
              {/* Phase 1: Social Proof */}
              <div className="phase-card phase-1">
                <div className="phase-number">Phase 1</div>
                <div className="phase-icon">🎭</div>
                <h3>Social Proof</h3>
                <div className="phase-reward-badge">5,000 RDLN</div>
                <p className="phase-desc">Join our Farcaster community and prove you're human through social engagement</p>

                <div className="phase-allocation">
                  <span className="allocation-label">Allocation:</span>
                  <span className="allocation-value">33M RDLN</span>
                </div>

                <div className="phase-details">
                  <h4>How to Earn:</h4>
                  <ol>
                    <li>Follow @Riddlen on Farcaster/Warpcast</li>
                    <li>Cast about Riddlen and tag us</li>
                    <li>Submit your Farcaster username</li>
                    <li>Get verified by our team</li>
                    <li>Claim your 5,000 RDLN</li>
                  </ol>

                  <div className="phase-specs">
                    <div className="spec-item">
                      <i className="fas fa-users"></i>
                      <span>Max 6,600 participants</span>
                    </div>
                    <div className="spec-item">
                      <i className="fas fa-shield-alt"></i>
                      <span>Human verification only</span>
                    </div>
                    <div className="spec-item">
                      <i className="fas fa-check-circle"></i>
                      <span>One-time claim</span>
                    </div>
                  </div>
                </div>

                <a href="https://warpcast.com/riddlen" target="_blank" className="phase-btn phase-1-btn">
                  <i className="fab fa-twitter"></i> Join on Farcaster
                </a>
              </div>

              {/* Phase 2: RON Reputation */}
              <div className="phase-card phase-2">
                <div className="phase-number">Phase 2</div>
                <div className="phase-icon">⭐</div>
                <h3>RON Reputation</h3>
                <div className="phase-reward-badge">2K - 5K RDLN</div>
                <p className="phase-desc">Passive rewards based on your soul-bound RON reputation holdings</p>

                <div className="phase-allocation">
                  <span className="allocation-label">Allocation:</span>
                  <span className="allocation-value">33M RDLN</span>
                </div>

                <div className="phase-details">
                  <h4>Tier Structure:</h4>
                  <div className="tier-table">
                    <div className="tier-row tier-header">
                      <span>Tier</span>
                      <span>RON Required</span>
                      <span>Reward</span>
                    </div>
                    <div className="tier-row">
                      <span className="tier-name">Tier 1</span>
                      <span>1,000 - 4,999</span>
                      <span className="tier-reward">2,000 RDLN</span>
                    </div>
                    <div className="tier-row">
                      <span className="tier-name">Tier 2</span>
                      <span>5,000 - 9,999</span>
                      <span className="tier-reward">3,000 RDLN</span>
                    </div>
                    <div className="tier-row">
                      <span className="tier-name">Tier 3</span>
                      <span>10,000 - 24,999</span>
                      <span className="tier-reward">4,000 RDLN</span>
                    </div>
                    <div className="tier-row tier-highlight">
                      <span className="tier-name">Tier 4</span>
                      <span>25,000+</span>
                      <span className="tier-reward">5,000 RDLN</span>
                    </div>
                  </div>

                  <div className="phase-specs">
                    <div className="spec-item">
                      <i className="fas fa-camera"></i>
                      <span>Snapshot-based (trustless)</span>
                    </div>
                    <div className="spec-item">
                      <i className="fas fa-trophy"></i>
                      <span>Passive earning</span>
                    </div>
                    <div className="spec-item">
                      <i className="fas fa-chart-line"></i>
                      <span>Higher RON = Higher rewards</span>
                    </div>
                  </div>
                </div>

                <a href="/game" className="phase-btn phase-2-btn">
                  <i className="fas fa-play"></i> Earn RON Now
                </a>
              </div>

              {/* Phase 3: Validation Work */}
              <div className="phase-card phase-3">
                <div className="phase-number">Phase 3</div>
                <div className="phase-icon">🔮</div>
                <h3>Validation Work</h3>
                <div className="phase-reward-badge">Up to 5K RDLN</div>
                <p className="phase-desc">Active earning through Oracle Network validation + airdrop bonuses</p>

                <div className="phase-allocation">
                  <span className="allocation-label">Allocation:</span>
                  <span className="allocation-value">34M RDLN</span>
                </div>

                <div className="phase-details">
                  <h4>How it Works:</h4>
                  <ol>
                    <li>Build 1,000+ RON reputation</li>
                    <li>Become Oracle Network validator</li>
                    <li>Complete data validations</li>
                    <li>Earn 500 RDLN per validation (Phase 3 bonus)</li>
                    <li>Claim multiple times as you work!</li>
                  </ol>

                  <div className="earning-note">
                    <i className="fas fa-info-circle"></i>
                    <p><strong>Bonus:</strong> 25% additional reward when you complete 10+ validations</p>
                  </div>

                  <div className="phase-specs">
                    <div className="spec-item">
                      <i className="fas fa-sync"></i>
                      <span>Multiple claims allowed</span>
                    </div>
                    <div className="spec-item">
                      <i className="fas fa-gift"></i>
                      <span>Bonus at 10+ validations</span>
                    </div>
                    <div className="spec-item">
                      <i className="fas fa-check"></i>
                      <span>3 validation minimum</span>
                    </div>
                  </div>
                </div>

                <a href="https://riddlen.com/oracle" className="phase-btn phase-3-btn">
                  <i className="fas fa-check-double"></i> Learn About Oracle
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Earning Calculator */}
        <section className="earning-calculator">
          <div className="container">
            <h2 className="section-title">Your Maximum Earning Potential</h2>

            <div className="calc-grid">
              <div className="calc-card">
                <h3>Airdrop Allocation (15K Max)</h3>
                <div className="calc-breakdown">
                  <div className="calc-row">
                    <span>Phase 1 (Social Proof)</span>
                    <span className="calc-value">5,000 RDLN</span>
                  </div>
                  <div className="calc-row">
                    <span>Phase 2 (RON Tier 4)</span>
                    <span className="calc-value">5,000 RDLN</span>
                  </div>
                  <div className="calc-row">
                    <span>Phase 3 (Validation)</span>
                    <span className="calc-value">5,000 RDLN</span>
                  </div>
                  <div className="calc-total">
                    <span>Total Airdrop Cap:</span>
                    <span className="total-value">15,000 RDLN</span>
                  </div>
                </div>
              </div>

              <div className="calc-card highlight">
                <h3>Plus: Unlimited Oracle Earnings</h3>
                <p className="oracle-desc">Phase 3 validators earn RDLN from the Oracle Network. Each validation request has a total reward pool that gets split among correct validators:</p>
                <div className="oracle-earnings">
                  <div className="oracle-row">
                    <span>Oracle Payment (Variable Pool Share):</span>
                    <span className="oracle-value">100 - 10,000+ RDLN</span>
                  </div>
                  <div className="oracle-row">
                    <span>Phase 3 Airdrop Bonus:</span>
                    <span className="oracle-value">500 RDLN fixed</span>
                  </div>
                  <div className="oracle-total">
                    <span>Your Tier Determines Pool Access:</span>
                    <span className="oracle-amount">Bronze→Platinum</span>
                  </div>
                </div>
                <p className="oracle-note">
                  <i className="fas fa-infinity"></i>
                  <strong>No limit on Oracle earnings!</strong> Higher tiers access bigger reward pools. Companies set pool amounts, validators split based on stake.
                </p>
              </div>
            </div>

            <div className="example-journey">
              <h3>Example: Complete Earning Journey</h3>
              <div className="journey-steps">
                <div className="journey-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Join Farcaster</h4>
                    <p>Complete social tasks</p>
                    <span className="step-earn">+5,000 RDLN</span>
                  </div>
                </div>
                <div className="journey-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Build RON</h4>
                    <p>Solve riddles, reach Tier 4</p>
                    <span className="step-earn">+5,000 RDLN</span>
                  </div>
                </div>
                <div className="journey-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Become Validator</h4>
                    <p>Complete 10 validations</p>
                    <span className="step-earn">+5,000 RDLN (Phase 3)</span>
                  </div>
                </div>
                <div className="journey-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Keep Validating</h4>
                    <p>Unlimited Oracle earnings</p>
                    <span className="step-earn">Variable (pool shares)</span>
                  </div>
                </div>
              </div>
              <div className="journey-total">
                <strong>Total Airdrop:</strong> 15,000 RDLN max + unlimited Oracle earnings (varies by request pools)
              </div>
            </div>
          </div>
        </section>

        {/* Farcaster Integration */}
        <section className="farcaster-section">
          <div className="container">
            <div className="farcaster-content">
              <div className="farcaster-text">
                <h2>🎮 Play on Farcaster Frames</h2>
                <p className="farcaster-intro">Experience Riddlen directly in your Warpcast feed with our interactive mini-app!</p>

                <div className="farcaster-features">
                  <div className="feature">
                    <i className="fas fa-gamepad"></i>
                    <div>
                      <h4>Interactive Gaming</h4>
                      <p>Solve riddles without leaving Warpcast</p>
                    </div>
                  </div>
                  <div className="feature">
                    <i className="fas fa-rocket"></i>
                    <div>
                      <h4>Gasless Onboarding</h4>
                      <p>First 3 mints sponsored for new users</p>
                    </div>
                  </div>
                  <div className="feature">
                    <i className="fas fa-trophy"></i>
                    <div>
                      <h4>Live Leaderboards</h4>
                      <p>Track top solvers in real-time</p>
                    </div>
                  </div>
                </div>

                <div className="farcaster-status">
                  <i className="fas fa-flask"></i>
                  <p><strong>Currently Testing:</strong> Our Farcaster Frames mini-app is live at frames.riddlen.com. Full integration coming soon!</p>
                </div>

                <div className="farcaster-buttons">
                  <a href="https://frames.riddlen.com" target="_blank" className="btn-frames">
                    <i className="fas fa-external-link-alt"></i> Try Frames Demo
                  </a>
                  <a href="https://warpcast.com/riddlen" target="_blank" className="btn-warpcast">
                    <i className="fab fa-twitter"></i> Follow @Riddlen
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Participate */}
        <section className="how-to-participate">
          <div className="container">
            <h2 className="section-title">How to Participate</h2>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-icon">1</div>
                <h3>Connect Your Wallet</h3>
                <p>Use MetaMask on Polygon Amoy testnet. Get free testnet MATIC from the faucet.</p>
                <a href="https://faucet.polygon.technology/" target="_blank" className="step-link">Get Testnet MATIC →</a>
              </div>

              <div className="step-card">
                <div className="step-icon">2</div>
                <h3>Join Farcaster</h3>
                <p>Follow @Riddlen on Warpcast, complete social tasks, and claim your 5K RDLN.</p>
                <a href="https://warpcast.com/riddlen" target="_blank" className="step-link">Join Farcaster →</a>
              </div>

              <div className="step-card">
                <div className="step-icon">3</div>
                <h3>Earn RON</h3>
                <p>Solve riddles to build soul-bound reputation and unlock higher airdrop tiers.</p>
                <a href="/game" className="step-link">Start Solving →</a>
              </div>

              <div className="step-card">
                <div className="step-icon">4</div>
                <h3>Become Validator</h3>
                <p>Reach 1,000 RON to unlock Oracle Network and earn through validation work.</p>
                <a href="https://riddlen.com/oracle" className="step-link">Learn More →</a>
              </div>
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="important-info">
          <div className="container">
            <h2 className="section-title">Important Information</h2>

            <div className="info-grid">
              <div className="info-card">
                <i className="fas fa-exclamation-circle"></i>
                <h3>Testnet Status</h3>
                <p>We're currently on Polygon Amoy testnet. All 6 contracts are deployed and operational. Oracle network is live, airdrop validation is active!</p>
              </div>

              <div className="info-card">
                <i className="fas fa-users"></i>
                <h3>Fair Distribution</h3>
                <p>15K RDLN max per wallet across all phases. 100M total allocation ensures wide distribution to 6,600+ early participants.</p>
              </div>

              <div className="info-card">
                <i className="fas fa-shield-alt"></i>
                <h3>Bot Protection</h3>
                <p>Human verification required for Phase 1. Snapshot-based Phase 2 prevents manipulation. RON requirement for Phase 3 ensures quality validators.</p>
              </div>

              <div className="info-card">
                <i className="fas fa-infinity"></i>
                <h3>Beyond Airdrop</h3>
                <p>The 15K airdrop cap is just the beginning. Oracle Network offers unlimited earning potential through validation work!</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-box">
              <h2>Ready to Claim Your RDLN?</h2>
              <p>Start earning today through our three-phase airdrop system</p>
              <div className="cta-buttons">
                <a href="/game" className="btn-cta-primary">
                  <i className="fas fa-rocket"></i> Start Earning Now
                </a>
                <a href="/faq" className="btn-cta-secondary">
                  <i className="fas fa-question-circle"></i> View FAQ
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        /* Hero Section */
        .airdrop-hero {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          padding: 4rem 0;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }

        .hero-title {
          text-align: center;
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          text-align: center;
          font-size: 1.3rem;
          color: #cccccc;
          margin-bottom: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto 2rem;
        }

        .stat-box {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-box:hover {
          border-color: rgba(255, 215, 0, 0.6);
          transform: translateY(-3px);
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #FFD700;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #cccccc;
          font-size: 0.95rem;
        }

        .contract-badge {
          text-align: center;
          margin: 2rem 0;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .contract-badge span {
          color: #cccccc;
          margin-right: 1rem;
        }

        .contract-badge a {
          color: #FFD700;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .contract-badge a:hover {
          color: #FFA500;
        }

        .early-banner {
          background: linear-gradient(45deg, rgba(255, 99, 71, 0.2), rgba(255, 215, 0, 0.2));
          border: 2px solid rgba(255, 215, 0, 0.5);
          border-radius: 15px;
          padding: 1.5rem;
          max-width: 900px;
          margin: 2rem auto 0;
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .early-banner i {
          font-size: 3rem;
          color: #FFD700;
          flex-shrink: 0;
        }

        .early-banner strong {
          color: #FFD700;
          font-size: 1.3rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .early-banner p {
          color: #cccccc;
          margin: 0;
        }

        /* Phases Overview */
        .phases-overview {
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
          margin-bottom: 4rem;
        }

        .phases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2.5rem;
        }

        .phase-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid;
          border-radius: 20px;
          padding: 2.5rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .phase-card.phase-1 {
          border-color: rgba(255, 99, 71, 0.5);
          background: linear-gradient(135deg, rgba(255, 99, 71, 0.15), rgba(255, 69, 0, 0.08));
        }

        .phase-card.phase-2 {
          border-color: rgba(138, 43, 226, 0.5);
          background: linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(148, 0, 211, 0.08));
        }

        .phase-card.phase-3 {
          border-color: rgba(255, 215, 0, 0.5);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.08));
        }

        .phase-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(255, 215, 0, 0.2);
        }

        .phase-number {
          position: absolute;
          top: -15px;
          left: 20px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-weight: 700;
        }

        .phase-icon {
          font-size: 4rem;
          text-align: center;
          margin: 1rem 0;
        }

        .phase-card h3 {
          color: #FFD700;
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 1rem;
        }

        .phase-reward-badge {
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.5);
          color: #FFD700;
          text-align: center;
          padding: 0.75rem;
          border-radius: 10px;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .phase-desc {
          color: #cccccc;
          text-align: center;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .phase-allocation {
          display: flex;
          justify-content: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          margin-bottom: 1.5rem;
        }

        .allocation-label {
          color: #FFA500;
        }

        .allocation-value {
          color: #FFD700;
          font-weight: 700;
        }

        .phase-details {
          margin-top: 1.5rem;
        }

        .phase-details h4 {
          color: #FFA500;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .phase-details ol {
          color: #cccccc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .phase-details ol li {
          padding: 0.4rem 0;
          line-height: 1.5;
        }

        .tier-table {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .tier-row {
          display: grid;
          grid-template-columns: 1fr 1.5fr 1fr;
          gap: 1rem;
          padding: 0.75rem 1rem;
          align-items: center;
        }

        .tier-header {
          background: rgba(255, 215, 0, 0.2);
          color: #FFD700;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .tier-row:not(.tier-header):not(:last-child) {
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .tier-row:not(.tier-header) {
          color: #cccccc;
        }

        .tier-highlight {
          background: rgba(255, 215, 0, 0.1);
        }

        .tier-name {
          color: #FFD700;
          font-weight: 600;
        }

        .tier-reward {
          color: #FFD700;
          font-weight: 600;
          text-align: right;
        }

        .phase-specs {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #cccccc;
          font-size: 0.95rem;
        }

        .spec-item i {
          color: #FFD700;
          width: 20px;
        }

        .earning-note {
          background: rgba(138, 43, 226, 0.15);
          border: 1px solid rgba(138, 43, 226, 0.4);
          border-radius: 10px;
          padding: 1rem;
          margin: 1.5rem 0;
          display: flex;
          gap: 0.75rem;
        }

        .earning-note i {
          color: #8A2BE2;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .earning-note p {
          color: #cccccc;
          margin: 0;
        }

        .phase-btn {
          display: block;
          text-align: center;
          padding: 1rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          margin-top: 1.5rem;
          transition: all 0.3s ease;
        }

        .phase-1-btn {
          background: linear-gradient(45deg, #FF6347, #FF4500);
          color: #ffffff;
        }

        .phase-2-btn {
          background: linear-gradient(45deg, #8A2BE2, #9370DB);
          color: #ffffff;
        }

        .phase-3-btn {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000000;
        }

        .phase-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(255, 215, 0, 0.4);
        }

        /* Earning Calculator */
        .earning-calculator {
          padding: 5rem 0;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.03));
        }

        .calc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2.5rem;
          margin-bottom: 3rem;
        }

        .calc-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .calc-card.highlight {
          border-color: rgba(138, 43, 226, 0.5);
          background: linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(148, 0, 211, 0.08));
        }

        .calc-card h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }

        .oracle-desc {
          color: #cccccc;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .calc-breakdown, .oracle-earnings {
          margin-bottom: 1.5rem;
        }

        .calc-row, .oracle-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          color: #cccccc;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .calc-value, .oracle-value {
          color: #FFD700;
          font-weight: 600;
        }

        .calc-total, .oracle-total {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0 0;
          margin-top: 1rem;
          border-top: 2px solid rgba(255, 215, 0, 0.3);
          font-size: 1.2rem;
          font-weight: 700;
        }

        .total-value, .oracle-amount {
          color: #FFD700;
          font-size: 1.5rem;
        }

        .oracle-note {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          color: #cccccc;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .oracle-note i {
          color: #FFD700;
          font-size: 1.5rem;
        }

        .example-journey {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .example-journey h3 {
          color: #FFD700;
          font-size: 2rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .journey-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .journey-step {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .journey-step:hover {
          border-color: rgba(255, 215, 0, 0.5);
          transform: translateY(-5px);
        }

        .step-number {
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
          margin: 0 auto 1rem;
        }

        .step-content h4 {
          color: #FFD700;
          margin-bottom: 0.5rem;
        }

        .step-content p {
          color: #cccccc;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .step-earn {
          color: #FFD700;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .journey-total {
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.5);
          border-radius: 10px;
          padding: 1.5rem;
          text-align: center;
          font-size: 1.3rem;
          color: #FFD700;
        }

        /* Farcaster Section */
        .farcaster-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(148, 0, 211, 0.05));
        }

        .farcaster-text h2 {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(45deg, #ffffff, #8A2BE2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .farcaster-intro {
          color: #cccccc;
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        .farcaster-features {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .feature {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .feature:hover {
          border-color: rgba(138, 43, 226, 0.6);
          transform: translateX(5px);
        }

        .feature i {
          font-size: 2.5rem;
          color: #8A2BE2;
          flex-shrink: 0;
        }

        .feature h4 {
          color: #9370DB;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .feature p {
          color: #cccccc;
          margin: 0;
        }

        .farcaster-status {
          background: rgba(138, 43, 226, 0.15);
          border: 1px solid rgba(138, 43, 226, 0.4);
          border-radius: 10px;
          padding: 1rem;
          margin: 2rem 0;
          display: flex;
          gap: 0.75rem;
        }

        .farcaster-status i {
          color: #8A2BE2;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .farcaster-status p {
          color: #cccccc;
          margin: 0;
        }

        .farcaster-buttons {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .btn-frames, .btn-warpcast {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .btn-frames {
          background: linear-gradient(45deg, #8A2BE2, #9370DB);
          color: #ffffff;
        }

        .btn-warpcast {
          background: transparent;
          color: #8A2BE2;
          border: 2px solid #8A2BE2;
        }

        .btn-frames:hover, .btn-warpcast:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(138, 43, 226, 0.3);
        }

        .btn-warpcast:hover {
          background: rgba(138, 43, 226, 0.1);
        }

        /* How to Participate */
        .how-to-participate {
          padding: 5rem 0;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .step-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .step-card:hover {
          border-color: rgba(255, 215, 0, 0.5);
          transform: translateY(-5px);
        }

        .step-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 auto 1.5rem;
        }

        .step-card h3 {
          color: #FFD700;
          font-size: 1.3rem;
          margin-bottom: 1rem;
        }

        .step-card p {
          color: #cccccc;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .step-link {
          color: #FFD700;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .step-link:hover {
          color: #FFA500;
        }

        /* Important Info */
        .important-info {
          padding: 5rem 0;
          background: rgba(0, 0, 0, 0.2);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .info-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
        }

        .info-card i {
          font-size: 3rem;
          color: #FFD700;
          margin-bottom: 1rem;
        }

        .info-card h3 {
          color: #FFD700;
          font-size: 1.3rem;
          margin-bottom: 1rem;
        }

        .info-card p {
          color: #cccccc;
          line-height: 1.6;
        }

        /* CTA Section */
        .cta-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
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

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            grid-template-columns: 1fr;
          }

          .early-banner {
            flex-direction: column;
            text-align: center;
          }

          .phases-grid {
            grid-template-columns: 1fr;
          }

          .calc-grid {
            grid-template-columns: 1fr;
          }

          .journey-steps {
            grid-template-columns: 1fr;
          }

          .steps-grid {
            grid-template-columns: 1fr;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .farcaster-buttons {
            flex-direction: column;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .tier-row {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .tier-reward {
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}
