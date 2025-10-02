import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';

export default function AirdropGuide() {
  return (
    <>
      <Head>
        <title>100M RDLN Airdrop Strategy Guide - Maximize Your 15K Cap | Riddlen</title>
        <meta name="description" content="Strategic guide to maximizing your Riddlen airdrop earnings across all 3 phases. Learn how to hit the 15K cap through social proof, RON tiers, and validation work." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">💎</div>
        <div className="floating-riddle">🎁</div>
        <div className="floating-riddle">⚡</div>
      </div>

      <Header currentPage="docs" />

      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <h1 className="page-title">Airdrop Strategy Guide</h1>
            <p className="page-subtitle">How to maximize your 15K RDLN airdrop cap plus unlimited Oracle earnings</p>

            <div className="max-earning-badge">
              <div className="badge-icon">💰</div>
              <div className="badge-content">
                <div className="badge-title">Maximum Potential</div>
                <div className="badge-value">15,000 RDLN Airdrop + Unlimited Oracle</div>
                <div className="badge-subtitle">Follow this guide to hit your cap</div>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 1 Strategy */}
        <section className="phase-strategy-section">
          <div className="container">
            <h2 className="section-title">Phase 1 Strategy: Social Proof</h2>
            <p className="section-intro">Easiest 5,000 RDLN you'll ever earn. Takes 10 minutes, zero technical skills required.</p>

            <div className="strategy-grid">
              <div className="strategy-card quick-wins">
                <div className="strategy-header">
                  <i className="fas fa-rocket"></i>
                  <h3>Quick Win Tasks</h3>
                  <div className="reward-badge">5,000 RDLN</div>
                </div>
                <div className="task-list">
                  <div className="task-item">
                    <div className="task-number">1</div>
                    <div className="task-content">
                      <h4>Follow @Riddlen on Farcaster</h4>
                      <p>Find us at warpcast.com/riddlen</p>
                    </div>
                  </div>
                  <div className="task-item">
                    <div className="task-number">2</div>
                    <div className="task-content">
                      <h4>Cast About Riddlen</h4>
                      <p>Share what excites you about intelligence-based rewards</p>
                    </div>
                  </div>
                  <div className="task-item">
                    <div className="task-number">3</div>
                    <div className="task-content">
                      <h4>Tag Us in Your Cast</h4>
                      <p>Make sure to @riddlen so we can verify</p>
                    </div>
                  </div>
                  <div className="task-item">
                    <div className="task-number">4</div>
                    <div className="task-content">
                      <h4>Submit Your Username</h4>
                      <p>Visit riddlen.com/airdrop and submit proof</p>
                    </div>
                  </div>
                  <div className="task-item">
                    <div className="task-number">5</div>
                    <div className="task-content">
                      <h4>Get Verified & Claim</h4>
                      <p>Wait 24-48 hours for manual verification</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="strategy-card pro-tips">
                <h3><i className="fas fa-lightbulb"></i> Pro Tips</h3>
                <div className="tip-box">
                  <strong>Quality Over Quantity:</strong>
                  <p>One thoughtful cast is better than spam. Share genuine excitement about the project.</p>
                </div>
                <div className="tip-box">
                  <strong>Be Human:</strong>
                  <p>Verification checks for real accounts. Bot accounts will be rejected.</p>
                </div>
                <div className="tip-box">
                  <strong>Complete All Tasks:</strong>
                  <p>Incomplete submissions won't be verified. Make sure you follow, cast, AND tag.</p>
                </div>
                <div className="tip-box warning">
                  <strong>One-Time Only:</strong>
                  <p>Phase 1 is a single 5K RDLN claim per wallet. Make it count!</p>
                </div>
              </div>
            </div>

            <div className="progress-tracker">
              <h3>Progress Tracker</h3>
              <div className="progress-bar-container">
                <div className="progress-label">0 RDLN</div>
                <div className="progress-bar">
                  <div className="progress-fill phase-1" style={{ width: '33%' }}>5,000 RDLN</div>
                </div>
                <div className="progress-label">15,000 RDLN Cap</div>
              </div>
              <p className="progress-note">Phase 1 complete = 33% of your airdrop cap achieved!</p>
            </div>
          </div>
        </section>

        {/* Phase 2 Strategy */}
        <section className="phase-strategy-section alt">
          <div className="container">
            <h2 className="section-title">Phase 2 Strategy: RON Reputation Tiers</h2>
            <p className="section-intro">Build reputation to unlock passive rewards. The math breakdown shows exactly how many riddles you need.</p>

            <div className="tier-calculator">
              <h3>The Math: How Many Riddles to Reach Each Tier?</h3>

              <div className="tier-breakdown-grid">
                <div className="tier-calc-card tier-1">
                  <div className="tier-header">
                    <span className="tier-badge">Tier 1</span>
                    <span className="tier-reward">2,000 RDLN</span>
                  </div>
                  <div className="tier-requirement">1,000 RON Required</div>
                  <div className="tier-math">
                    <h4>Path to Tier 1:</h4>
                    <div className="math-row">
                      <span>EASY riddles (avg 17 RON each)</span>
                      <span>= ~59 solves</span>
                    </div>
                    <div className="math-row alt">
                      <span>Time investment</span>
                      <span>= 3-4 weeks</span>
                    </div>
                  </div>
                  <div className="tier-note">Entry-level tier, achievable for new players</div>
                </div>

                <div className="tier-calc-card tier-2">
                  <div className="tier-header">
                    <span className="tier-badge">Tier 2</span>
                    <span className="tier-reward">3,000 RDLN</span>
                  </div>
                  <div className="tier-requirement">5,000 RON Required</div>
                  <div className="tier-math">
                    <h4>Path to Tier 2:</h4>
                    <div className="math-row">
                      <span>67 MEDIUM riddles (avg 75 RON each)</span>
                      <span>= 67 solves</span>
                    </div>
                    <div className="math-row">
                      <span>RON earned</span>
                      <span>= 67 × 75 = 5,025</span>
                    </div>
                    <div className="math-row alt">
                      <span>Time investment</span>
                      <span>= 2-3 months</span>
                    </div>
                  </div>
                  <div className="tier-note">Sweet spot for regular players</div>
                </div>

                <div className="tier-calc-card tier-3">
                  <div className="tier-header">
                    <span className="tier-badge">Tier 3</span>
                    <span className="tier-reward">4,000 RDLN</span>
                  </div>
                  <div className="tier-requirement">10,000 RON Required</div>
                  <div className="tier-math">
                    <h4>Path to Tier 3:</h4>
                    <div className="math-row">
                      <span>Mix: 20 EASY + 60 MEDIUM + 20 HARD</span>
                      <span>= 100 total solves</span>
                    </div>
                    <div className="math-row">
                      <span>RON earned</span>
                      <span>= 340 + 4,500 + 7,000 = 11,840</span>
                    </div>
                    <div className="math-row alt">
                      <span>Time investment</span>
                      <span>= 3-4 months</span>
                    </div>
                  </div>
                  <div className="tier-note">Dedicated solver status</div>
                </div>

                <div className="tier-calc-card tier-4 highlight">
                  <div className="tier-header">
                    <span className="tier-badge">Tier 4</span>
                    <span className="tier-reward">5,000 RDLN</span>
                  </div>
                  <div className="tier-requirement">25,000 RON Required</div>
                  <div className="tier-math">
                    <h4>Path to Tier 4 (MAX):</h4>
                    <div className="math-row">
                      <span>Mix: 100 MEDIUM + 50 HARD</span>
                      <span>= 150 total solves</span>
                    </div>
                    <div className="math-row">
                      <span>RON earned</span>
                      <span>= 7,500 + 17,500 = 25,000</span>
                    </div>
                    <div className="math-row alt">
                      <span>Time investment</span>
                      <span>= 5-6 months</span>
                    </div>
                  </div>
                  <div className="tier-note elite">Elite status - Maximum Phase 2 reward!</div>
                </div>
              </div>
            </div>

            <div className="strategy-callout">
              <i className="fas fa-trophy"></i>
              <div>
                <strong>Strategic Insight:</strong>
                <p>Don't rush to Tier 4 if you want to be a validator. Stop at 1,000 RON, focus on Phase 3 validations (better ROI), then come back to grind RON later.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 3 Strategy */}
        <section className="phase-strategy-section">
          <div className="container">
            <h2 className="section-title">Phase 3 Strategy: Validator Path</h2>
            <p className="section-intro">The most lucrative path. Unlimited Oracle earnings PLUS 5K airdrop cap.</p>

            <div className="validator-path">
              <h3>Complete Validator Journey</h3>

              <div className="journey-steps">
                <div className="journey-step">
                  <div className="step-marker">Step 1</div>
                  <h4>Build 1,000 RON (Minimum)</h4>
                  <p>Solve ~59 EASY riddles or equivalent</p>
                  <div className="step-time">Time: 3-4 weeks</div>
                  <div className="step-result">Unlock: Bronze Validator tier</div>
                </div>

                <div className="journey-arrow">→</div>

                <div className="journey-step">
                  <div className="step-marker">Step 2</div>
                  <h4>Join Oracle Network</h4>
                  <p>Register as validator, start accepting requests</p>
                  <div className="step-time">Time: Instant</div>
                  <div className="step-result">Access: Basic validation requests</div>
                </div>

                <div className="journey-arrow">→</div>

                <div className="journey-step">
                  <div className="step-marker">Step 3</div>
                  <h4>Complete 3+ Validations</h4>
                  <p>Minimum to qualify for Phase 3 claims</p>
                  <div className="step-time">Time: 1-2 days</div>
                  <div className="step-result">Earned: ~10,000 RDLN from Oracle</div>
                </div>

                <div className="journey-arrow">→</div>

                <div className="journey-step highlight">
                  <div className="step-marker">Step 4</div>
                  <h4>Push to 10 Validations</h4>
                  <p>Unlock 25% bonus tier</p>
                  <div className="step-time">Time: 3-5 days</div>
                  <div className="step-result">Earned: 5,000 RDLN Phase 3 (capped)</div>
                  <div className="step-result bonus">Oracle: Variable (pool shares)</div>
                </div>
              </div>
            </div>

            <div className="earning-breakdown-box">
              <h3>Validation Earnings Breakdown</h3>
              <div className="breakdown-grid">
                <div className="breakdown-item">
                  <div className="breakdown-label">Per Validation (Oracle Pool Share)</div>
                  <div className="breakdown-value">100-10K+ RDLN</div>
                </div>
                <div className="plus">+</div>
                <div className="breakdown-item">
                  <div className="breakdown-label">Per Validation (Phase 3 Bonus)</div>
                  <div className="breakdown-value">500 RDLN fixed</div>
                </div>
                <div className="equals">=</div>
                <div className="breakdown-item total">
                  <div className="breakdown-label">Total Per Validation</div>
                  <div className="breakdown-value">Variable by tier</div>
                </div>
              </div>

              <div className="validation-table">
                <div className="table-header">
                  <span>Your Tier</span>
                  <span>Typical Pool Share</span>
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
            </div>

            <div className="pro-tip-box">
              <i className="fas fa-star"></i>
              <p><strong>💡 Pro Tip:</strong> Phase 3 has NO LIMIT on Oracle earnings! The 5K cap only applies to the airdrop bonus. Keep validating to earn unlimited RDLN.</p>
            </div>
          </div>
        </section>

        {/* Combined Strategy */}
        <section className="combined-strategy-section">
          <div className="container">
            <h2 className="section-title">Combined Earnings: Max Strategy</h2>
            <p className="section-intro">Stack all three phases to hit maximum airdrop cap plus unlimited Oracle work</p>

            <div className="max-strategy-grid">
              <div className="strategy-option">
                <h3>Strategy A: Maximum Airdrop Cap</h3>
                <div className="strategy-breakdown">
                  <div className="phase-earning">
                    <div className="phase-label">Phase 1 (Social)</div>
                    <div className="phase-value">5,000 RDLN</div>
                  </div>
                  <div className="phase-earning">
                    <div className="phase-label">Phase 2 (Tier 4: 25K+ RON)</div>
                    <div className="phase-value">5,000 RDLN</div>
                  </div>
                  <div className="phase-earning">
                    <div className="phase-label">Phase 3 (10+ Validations)</div>
                    <div className="phase-value">5,000 RDLN</div>
                  </div>
                  <div className="strategy-total">
                    <div className="total-label">Airdrop Total</div>
                    <div className="total-value">15,000 RDLN</div>
                  </div>
                  <div className="strategy-time">
                    <strong>Time Investment:</strong> 5-6 months
                  </div>
                  <div className="strategy-effort">
                    <strong>Effort:</strong> High (150+ riddles + validations)
                  </div>
                </div>
              </div>

              <div className="strategy-option recommended">
                <div className="recommended-badge">Recommended</div>
                <h3>Strategy B: Validation-Focused</h3>
                <div className="strategy-breakdown">
                  <div className="phase-earning">
                    <div className="phase-label">Phase 1 (Social)</div>
                    <div className="phase-value">5,000 RDLN</div>
                  </div>
                  <div className="phase-earning">
                    <div className="phase-label">Phase 2 (Tier 1: 1K RON)</div>
                    <div className="phase-value">2,000 RDLN</div>
                  </div>
                  <div className="phase-earning">
                    <div className="phase-label">Phase 3 (20+ Validations)</div>
                    <div className="phase-value">5,000 RDLN</div>
                  </div>
                  <div className="strategy-total">
                    <div className="total-label">Airdrop Total</div>
                    <div className="total-value">12,000 RDLN</div>
                  </div>
                  <div className="phase-earning bonus">
                    <div className="phase-label">Oracle Direct (ongoing)</div>
                    <div className="phase-value">Unlimited Variable</div>
                  </div>
                  <div className="strategy-total grand">
                    <div className="total-label">Total Potential</div>
                    <div className="total-value">12K+ unlimited Oracle</div>
                  </div>
                  <div className="strategy-time">
                    <strong>Time Investment:</strong> 2-3 months
                  </div>
                  <div className="strategy-effort">
                    <strong>Effort:</strong> Medium (~59 riddles to start validating)
                  </div>
                </div>
              </div>
            </div>

            <div className="strategy-insight">
              <h3>Why Strategy B is Better:</h3>
              <div className="insight-grid">
                <div className="insight-item">
                  <i className="fas fa-bolt"></i>
                  <p><strong>Faster ROI:</strong> Start earning from validations in week 4 instead of month 6</p>
                </div>
                <div className="insight-item">
                  <i className="fas fa-chart-line"></i>
                  <p><strong>Higher Potential:</strong> Unlimited Oracle earnings vs 15K airdrop cap only</p>
                </div>
                <div className="insight-item">
                  <i className="fas fa-infinity"></i>
                  <p><strong>Unlimited Upside:</strong> Higher tiers = bigger pool access = more per validation</p>
                </div>
                <div className="insight-item">
                  <i className="fas fa-clock"></i>
                  <p><strong>Less Grinding:</strong> Validations are more efficient than solving 150 riddles</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="timeline-section">
          <div className="container">
            <h2 className="section-title">Timeline: How Long to Complete?</h2>

            <div className="timeline-visual">
              <div className="timeline-track">
                <div className="timeline-point start">
                  <div className="point-marker">Day 1</div>
                  <div className="point-content">
                    <h4>Start Here</h4>
                    <p>Complete Phase 1 social tasks</p>
                    <div className="point-earning">+5,000 RDLN</div>
                  </div>
                </div>

                <div className="timeline-point">
                  <div className="point-marker">Week 1-4</div>
                  <div className="point-content">
                    <h4>Build RON Foundation</h4>
                    <p>Solve EASY riddles to reach 1,000 RON</p>
                    <div className="point-earning">Unlock validator status</div>
                  </div>
                </div>

                <div className="timeline-point">
                  <div className="point-marker">Week 5</div>
                  <div className="point-content">
                    <h4>Start Validating</h4>
                    <p>Complete first 3 validations</p>
                    <div className="point-earning">+~11,500 RDLN</div>
                  </div>
                </div>

                <div className="timeline-point">
                  <div className="point-marker">Week 6-8</div>
                  <div className="point-content">
                    <h4>Validation Grind</h4>
                    <p>Push to 10 validations total</p>
                    <div className="point-earning">+~26,833 RDLN more</div>
                  </div>
                </div>

                <div className="timeline-point end">
                  <div className="point-marker">Week 12</div>
                  <div className="point-content">
                    <h4>Phase 2 Snapshot</h4>
                    <p>Claim Tier 1 reward</p>
                    <div className="point-earning">+2,000 RDLN</div>
                    <div className="point-total">Total: ~45,333 RDLN earned!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-box">
              <h2>Ready to Maximize Your Airdrop?</h2>
              <p>Start with Phase 1 social tasks today - free 5K RDLN in 10 minutes!</p>
              <div className="cta-buttons">
                <a href="/airdrop" className="btn-cta-primary">
                  <i className="fas fa-gift"></i> Join Airdrop Now
                </a>
                <a href="/game" className="btn-cta-secondary">
                  <i className="fas fa-play"></i> Start Earning RON
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .hero-section {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          padding: 4rem 0 3rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }

        .page-title {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .page-subtitle {
          font-size: 1.3rem;
          color: #cccccc;
          margin-bottom: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .max-earning-badge {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
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
          color: #FFA500;
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

        .phase-strategy-section {
          padding: 5rem 0;
        }

        .phase-strategy-section.alt {
          background: rgba(0, 0, 0, 0.2);
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

        .strategy-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .strategy-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .strategy-card.quick-wins {
          border-color: rgba(138, 43, 226, 0.5);
        }

        .strategy-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .strategy-header i {
          font-size: 3rem;
          color: #8A2BE2;
          margin-bottom: 1rem;
          display: block;
        }

        .strategy-header h3 {
          color: #FFD700;
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .reward-badge {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 1.2rem;
          display: inline-block;
        }

        .task-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .task-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .task-number {
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #8A2BE2, #9370DB);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        .task-content h4 {
          color: #FFD700;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .task-content p {
          color: #cccccc;
          font-size: 0.95rem;
        }

        .pro-tips h3 {
          color: #FFD700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .tip-box {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .tip-box.warning {
          border-color: rgba(255, 99, 71, 0.5);
          background: rgba(255, 99, 71, 0.1);
        }

        .tip-box strong {
          color: #FFD700;
          display: block;
          margin-bottom: 0.5rem;
        }

        .tip-box p {
          color: #cccccc;
          margin: 0;
          font-size: 0.95rem;
        }

        .progress-tracker {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2rem;
        }

        .progress-tracker h3 {
          color: #FFD700;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .progress-bar-container {
          position: relative;
          margin: 2rem 0;
        }

        .progress-label {
          color: #cccccc;
          font-size: 0.9rem;
          display: inline-block;
        }

        .progress-bar {
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          margin: 1rem 0;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #FFD700, #FFA500);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: 700;
          transition: width 0.3s ease;
        }

        .progress-note {
          text-align: center;
          color: #FFA500;
          font-style: italic;
        }

        .tier-calculator {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 3rem;
          margin-bottom: 2rem;
        }

        .tier-calculator h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .tier-breakdown-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .tier-calc-card {
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid;
          border-radius: 15px;
          padding: 2rem;
        }

        .tier-calc-card.tier-1 { border-color: rgba(124, 252, 0, 0.5); }
        .tier-calc-card.tier-2 { border-color: rgba(138, 43, 226, 0.5); }
        .tier-calc-card.tier-3 { border-color: rgba(255, 215, 0, 0.5); }
        .tier-calc-card.tier-4 {
          border-color: rgba(255, 105, 180, 0.6);
          background: linear-gradient(135deg, rgba(255, 105, 180, 0.15), rgba(138, 43, 226, 0.1));
        }

        .tier-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .tier-badge {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 0.5rem 1rem;
          border-radius: 15px;
          font-weight: 700;
        }

        .tier-reward {
          color: #FFD700;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .tier-requirement {
          color: #FFA500;
          text-align: center;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .tier-math h4 {
          color: #9370DB;
          margin-bottom: 1rem;
        }

        .math-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          color: #cccccc;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .math-row.alt {
          color: #FFA500;
          font-weight: 600;
        }

        .tier-note {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 215, 0, 0.2);
          color: #9370DB;
          font-style: italic;
          text-align: center;
        }

        .tier-note.elite {
          color: #FFD700;
          font-weight: 700;
        }

        .strategy-callout {
          background: rgba(138, 43, 226, 0.15);
          border: 1px solid rgba(138, 43, 226, 0.4);
          border-radius: 15px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .strategy-callout i {
          color: #FFD700;
          font-size: 2rem;
          flex-shrink: 0;
        }

        .strategy-callout strong {
          color: #FFD700;
          display: block;
          margin-bottom: 0.5rem;
        }

        .strategy-callout p {
          color: #cccccc;
          margin: 0;
        }

        .validator-path {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 3rem;
          margin-bottom: 2rem;
        }

        .validator-path h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .journey-steps {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .journey-step {
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
          padding: 2rem;
          flex: 1;
          min-width: 200px;
          max-width: 250px;
        }

        .journey-step.highlight {
          border-color: rgba(255, 215, 0, 0.6);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
        }

        .step-marker {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 0.5rem 1rem;
          border-radius: 15px;
          font-weight: 700;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .journey-step h4 {
          color: #FFD700;
          margin-bottom: 0.75rem;
        }

        .journey-step p {
          color: #cccccc;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .step-time, .step-result {
          color: #9370DB;
          font-size: 0.9rem;
          padding: 0.25rem 0;
        }

        .step-result.bonus {
          color: #FFD700;
          font-weight: 700;
        }

        .journey-arrow {
          color: #FFD700;
          font-size: 2rem;
          font-weight: 700;
        }

        .earning-breakdown-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 2rem;
        }

        .earning-breakdown-box h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .breakdown-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .breakdown-item {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 10px;
          padding: 1.5rem;
          text-align: center;
          min-width: 180px;
        }

        .breakdown-item.total {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.15));
          border-color: rgba(255, 215, 0, 0.6);
        }

        .breakdown-label {
          color: #FFA500;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .breakdown-value {
          color: #FFD700;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .plus, .equals {
          color: #FFD700;
          font-size: 2rem;
          font-weight: 700;
        }

        .validation-table {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          overflow: hidden;
        }

        .table-header, .table-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
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
          border-bottom: none;
        }

        .pro-tip-box {
          background: rgba(255, 215, 0, 0.15);
          border: 2px solid rgba(255, 215, 0, 0.5);
          border-radius: 15px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .pro-tip-box i {
          color: #FFD700;
          font-size: 2rem;
        }

        .pro-tip-box p {
          color: #cccccc;
          margin: 0;
        }

        .combined-strategy-section {
          padding: 5rem 0;
          background: rgba(0, 0, 0, 0.2);
        }

        .max-strategy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .strategy-option {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
          position: relative;
        }

        .strategy-option.recommended {
          border-color: rgba(138, 43, 226, 0.6);
          background: linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(148, 0, 211, 0.08));
        }

        .recommended-badge {
          position: absolute;
          top: -15px;
          right: 20px;
          background: linear-gradient(45deg, #8A2BE2, #9370DB);
          color: #fff;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-weight: 700;
        }

        .strategy-option h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .phase-earning {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .phase-earning.bonus {
          border-top: 2px solid rgba(138, 43, 226, 0.5);
          margin-top: 1rem;
          padding-top: 1rem;
          color: #9370DB;
        }

        .phase-label {
          color: #FFA500;
        }

        .phase-value {
          color: #FFD700;
          font-weight: 700;
        }

        .strategy-total {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
          border-top: 2px solid rgba(255, 215, 0, 0.4);
          margin-top: 1rem;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .strategy-total.grand {
          border-top: 3px solid rgba(138, 43, 226, 0.6);
          font-size: 1.5rem;
        }

        .total-label {
          color: #FFA500;
        }

        .total-value {
          color: #FFD700;
        }

        .strategy-time, .strategy-effort {
          color: #9370DB;
          margin-top: 1rem;
          font-size: 0.95rem;
        }

        .strategy-insight {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .strategy-insight h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .insight-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .insight-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .insight-item i {
          color: #FFD700;
          font-size: 2rem;
          flex-shrink: 0;
        }

        .insight-item p {
          color: #cccccc;
          margin: 0;
        }

        .timeline-section {
          padding: 5rem 0;
        }

        .timeline-visual {
          max-width: 1200px;
          margin: 0 auto;
        }

        .timeline-track {
          display: flex;
          align-items: flex-start;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .timeline-point {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
          padding: 2rem;
          flex: 1;
          min-width: 180px;
          max-width: 220px;
        }

        .timeline-point.start, .timeline-point.end {
          border-color: rgba(255, 215, 0, 0.6);
        }

        .point-marker {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 0.5rem 1rem;
          border-radius: 15px;
          font-weight: 700;
          display: inline-block;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .point-content h4 {
          color: #FFD700;
          margin-bottom: 0.5rem;
        }

        .point-content p {
          color: #cccccc;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .point-earning {
          color: #9370DB;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .point-total {
          color: #FFD700;
          font-weight: 700;
          font-size: 1.1rem;
          margin-top: 0.5rem;
        }

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

        @media (max-width: 768px) {
          .page-title {
            font-size: 2.5rem;
          }

          .strategy-grid {
            grid-template-columns: 1fr;
          }

          .tier-breakdown-grid {
            grid-template-columns: 1fr;
          }

          .journey-steps {
            flex-direction: column;
          }

          .journey-arrow {
            transform: rotate(90deg);
          }

          .max-strategy-grid {
            grid-template-columns: 1fr;
          }

          .timeline-track {
            flex-direction: column;
          }

          .table-header, .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .breakdown-grid {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
