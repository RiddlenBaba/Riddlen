import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';

export default function HowItWorks() {
  return (
    <>
      <Head>
        <title>How Riddlen Works - Core Game Mechanics | Riddlen</title>
        <meta name="description" content="Deep dive into Riddlen's Proof-of-Solve consensus, NFT riddle mechanics, tiered rewards, RON progression, and anti-cheat mechanisms. Intelligence becomes currency." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">🧠</div>
        <div className="floating-riddle">⚡</div>
        <div className="floating-riddle">🎮</div>
      </div>

      <Header currentPage="docs" />

      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <h1 className="page-title">How Riddlen Works</h1>
            <p className="page-subtitle">The first blockchain game where intelligence becomes currency through Proof-of-Solve</p>
          </div>
        </section>

        {/* Proof-of-Solve Consensus */}
        <section className="proof-of-solve-section">
          <div className="container">
            <h2 className="section-title">🧠 Proof-of-Solve Consensus</h2>
            <p className="section-intro">Unlike Proof-of-Work (mining) or Proof-of-Stake (capital), Riddlen rewards pure intelligence</p>

            <div className="comparison-grid">
              <div className="comparison-card old">
                <h3>Traditional Blockchain</h3>
                <div className="method">
                  <i className="fas fa-server"></i>
                  <span>Proof-of-Work</span>
                </div>
                <p>Miners buy expensive hardware to compete. Capital advantage wins.</p>
                <div className="problem">Problem: Hardware = Power</div>
              </div>

              <div className="comparison-card old">
                <h3>Modern Blockchain</h3>
                <div className="method">
                  <i className="fas fa-coins"></i>
                  <span>Proof-of-Stake</span>
                </div>
                <p>Validators stake capital to earn rewards. Wealth advantage wins.</p>
                <div className="problem">Problem: Money = Power</div>
              </div>

              <div className="comparison-card new">
                <h3>Riddlen Innovation</h3>
                <div className="method">
                  <i className="fas fa-brain"></i>
                  <span>Proof-of-Solve</span>
                </div>
                <p>Solvers use intelligence to earn rewards. Merit advantage wins.</p>
                <div className="solution">Solution: Intelligence = Power</div>
              </div>
            </div>

            <div className="consensus-flow">
              <h3>How Proof-of-Solve Works</h3>
              <div className="flow-steps">
                <div className="flow-step">
                  <div className="step-num">1</div>
                  <div className="step-content">
                    <h4>Riddle Released</h4>
                    <p>Every week, a new riddle NFT is released with a prize pool (100K-2M RDLN)</p>
                  </div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <div className="step-num">2</div>
                  <div className="step-content">
                    <h4>Players Mint Access</h4>
                    <p>Pay minting fee (starts at 1,000 RDLN, halves every 2 years) to get NFT</p>
                  </div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <div className="step-num">3</div>
                  <div className="step-content">
                    <h4>Solve & Earn</h4>
                    <p>Correct answers win RDLN + RON. First solvers earn 4x more than last!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NFT Riddle Mechanics */}
        <section className="nft-mechanics-section">
          <div className="container">
            <h2 className="section-title">🎴 NFT Riddle Mechanics</h2>

            <div className="mechanic-breakdown">
              <div className="mechanic-card">
                <div className="mechanic-icon">🔨</div>
                <h3>Step 1: Mint NFT Access</h3>
                <p>Each riddle is an interactive NFT. Mint it to attempt solving.</p>
                <div className="details-box">
                  <div className="detail-item">
                    <span className="label">Cost:</span>
                    <span className="value">1,000 RDLN (Year 1-2)</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Halving:</span>
                    <span className="value">Reduces 50% every 2 years</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Supply:</span>
                    <span className="value">10-1,000 NFTs per riddle</span>
                  </div>
                </div>
                <div className="burn-note">
                  <i className="fas fa-fire"></i>
                  <span>50% burned, 25% Grand Prize, 25% ops</span>
                </div>
              </div>

              <div className="mechanic-card">
                <div className="mechanic-icon">⏱️</div>
                <h3>Step 2: Wait 30 Seconds</h3>
                <p>Anti-cheat timer prevents instant bot solutions.</p>
                <div className="timer-display">
                  <div className="timer-icon">🔒</div>
                  <div className="timer-text">30 Second Delay</div>
                </div>
                <div className="why-box">
                  <strong>Why this matters:</strong>
                  <ul>
                    <li>Prevents copy-paste attacks</li>
                    <li>Ensures human thinking time</li>
                    <li>Levels playing field</li>
                    <li>No instant bot wins</li>
                  </ul>
                </div>
              </div>

              <div className="mechanic-card">
                <div className="mechanic-icon">🧩</div>
                <h3>Step 3: Submit Answer</h3>
                <p>Type your solution. Wrong answers cost progressively more RDLN.</p>
                <div className="attempts-cost">
                  <div className="attempt-row">
                    <span>1st attempt:</span>
                    <span className="cost">1 RDLN burned</span>
                  </div>
                  <div className="attempt-row">
                    <span>2nd attempt:</span>
                    <span className="cost">2 RDLN burned</span>
                  </div>
                  <div className="attempt-row">
                    <span>3rd attempt:</span>
                    <span className="cost">3 RDLN burned</span>
                  </div>
                  <div className="attempt-row highlight">
                    <span>Nth attempt:</span>
                    <span className="cost">N RDLN burned</span>
                  </div>
                </div>
                <div className="strategy-tip">
                  <i className="fas fa-lightbulb"></i>
                  <strong>Pro Tip:</strong> Quality over quantity. Think before submitting!
                </div>
              </div>

              <div className="mechanic-card highlight">
                <div className="mechanic-icon">💰</div>
                <h3>Step 4: Earn Rewards</h3>
                <p>Correct answers unlock tiered RDLN rewards + soul-bound RON reputation!</p>
                <div className="rewards-breakdown">
                  <div className="reward-type">
                    <div className="reward-icon">💎</div>
                    <div className="reward-info">
                      <h4>RDLN Tokens</h4>
                      <p>Tradeable rewards based on solve position</p>
                    </div>
                  </div>
                  <div className="reward-type">
                    <div className="reward-icon">⭐</div>
                    <div className="reward-info">
                      <h4>RON Reputation</h4>
                      <p>Soul-bound tokens unlock harder riddles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tiered Reward System */}
        <section className="tiered-rewards-section">
          <div className="container">
            <h2 className="section-title">⚡ Revolutionary Tiered Rewards</h2>
            <p className="section-intro">First solvers earn 4x more than last! Speed and intelligence matter.</p>

            <div className="tier-visual">
              <div className="tier-box gold">
                <div className="tier-header">
                  <div className="tier-badge">Top Tier</div>
                  <div className="tier-range">First 25%</div>
                </div>
                <div className="tier-multiplier">2.0x</div>
                <div className="tier-label">Double Rewards</div>
                <div className="tier-positions">Positions 1-5 (in 20-winner riddle)</div>
              </div>

              <div className="tier-box silver">
                <div className="tier-header">
                  <div className="tier-badge">Mid Tier</div>
                  <div className="tier-range">Middle 50%</div>
                </div>
                <div className="tier-multiplier">1.0x</div>
                <div className="tier-label">Standard Rewards</div>
                <div className="tier-positions">Positions 6-15</div>
              </div>

              <div className="tier-box bronze">
                <div className="tier-header">
                  <div className="tier-badge">Lower Tier</div>
                  <div className="tier-range">Last 25%</div>
                </div>
                <div className="tier-multiplier">0.5x</div>
                <div className="tier-label">Half Rewards</div>
                <div className="tier-positions">Positions 16-20</div>
              </div>
            </div>

            <div className="example-calculation">
              <h3>Real Example: 500 RDLN Riddle, 10 Winners</h3>
              <div className="calc-grid">
                <div className="calc-card">
                  <div className="solver-position">Solver #1</div>
                  <div className="solver-tier">Top Tier (2x)</div>
                  <div className="solver-math">Base: 50 RDLN × 2.0 = <strong>100 RDLN</strong></div>
                </div>
                <div className="calc-card">
                  <div className="solver-position">Solver #5</div>
                  <div className="solver-tier">Mid Tier (1x)</div>
                  <div className="solver-math">Base: 50 RDLN × 1.0 = <strong>50 RDLN</strong></div>
                </div>
                <div className="calc-card">
                  <div className="solver-position">Solver #10</div>
                  <div className="solver-tier">Lower Tier (0.5x)</div>
                  <div className="solver-math">Base: 50 RDLN × 0.5 = <strong>25 RDLN</strong></div>
                </div>
              </div>
              <div className="calc-result">
                <i className="fas fa-trophy"></i>
                <p><strong>Result:</strong> First solver earns 4x more than last solver! This creates urgency and prevents NFT hoarding.</p>
              </div>
            </div>

            <div className="game-mechanic-box">
              <i className="fas fa-gamepad"></i>
              <div>
                <strong>Game Mechanic:</strong> Tiered rewards solve the "wait and copy" problem. Early solvers get paid more, incentivizing speed and original thinking!
              </div>
            </div>
          </div>
        </section>

        {/* RON Progression */}
        <section className="ron-progression-section">
          <div className="container">
            <h2 className="section-title">📈 RON Reputation Progression</h2>
            <p className="section-intro">Level up your reputation to unlock harder riddles and higher rewards</p>

            <div className="progression-levels">
              <div className="level-card level-1">
                <div className="level-icon">🌱</div>
                <h3>Newcomer</h3>
                <div className="ron-range">0 - 999 RON</div>
                <div className="access-badge">EASY Riddles Only</div>
                <div className="level-details">
                  <h4>What You Can Do:</h4>
                  <ul>
                    <li>Solve EASY riddles (100K-300K pools)</li>
                    <li>Earn 10-25 RON per solve</li>
                    <li>Learn the game mechanics</li>
                    <li>Build foundation reputation</li>
                  </ul>
                  <div className="earning-example">
                    <strong>Path to Level 2:</strong> Solve ~40 EASY riddles
                  </div>
                </div>
              </div>

              <div className="level-card level-2">
                <div className="level-icon">🎯</div>
                <h3>Solver</h3>
                <div className="ron-range">1,000 - 9,999 RON</div>
                <div className="access-badge">EASY + MEDIUM Riddles</div>
                <div className="level-details">
                  <h4>What You Can Do:</h4>
                  <ul>
                    <li>Access MEDIUM riddles (300K-700K pools)</li>
                    <li>Earn 50-100 RON per solve</li>
                    <li>Become Oracle Network validator (Bronze tier)</li>
                    <li>Earn unlimited RDLN through validation</li>
                  </ul>
                  <div className="earning-example">
                    <strong>Major Unlock:</strong> Oracle Network access = passive income!
                  </div>
                </div>
              </div>

              <div className="level-card level-3">
                <div className="level-icon">🏆</div>
                <h3>Expert</h3>
                <div className="ron-range">10,000 - 99,999 RON</div>
                <div className="access-badge">EASY + MEDIUM + HARD</div>
                <div className="level-details">
                  <h4>What You Can Do:</h4>
                  <ul>
                    <li>Access HARD riddles (700K-1.5M pools)</li>
                    <li>Earn 200-500 RON per solve</li>
                    <li>Oracle Gold tier (premium requests)</li>
                    <li>Vote on DAO proposals</li>
                  </ul>
                  <div className="earning-example">
                    <strong>Elite Status:</strong> Top 5% of all players
                  </div>
                </div>
              </div>

              <div className="level-card level-4">
                <div className="level-icon">🔮</div>
                <h3>Oracle</h3>
                <div className="ron-range">100,000+ RON</div>
                <div className="access-badge">ALL Riddles + Legendary</div>
                <div className="level-details">
                  <h4>What You Can Do:</h4>
                  <ul>
                    <li>Access LEGENDARY riddles (1.5M-2M pools)</li>
                    <li>Earn 1,000-10,000 RON per solve</li>
                    <li>Oracle Platinum tier (enterprise requests)</li>
                    <li>Major DAO voting power</li>
                  </ul>
                  <div className="earning-example">
                    <strong>Master Level:</strong> Elite validator earning 10K+ RDLN/week
                  </div>
                </div>
              </div>
            </div>

            <div className="progression-path-visual">
              <h3>Your Journey Example</h3>
              <div className="journey-timeline">
                <div className="journey-point">
                  <div className="point-marker">Start</div>
                  <div className="point-info">
                    <strong>Day 1:</strong> 0 RON
                    <p>Solve first EASY riddle, earn 15 RON</p>
                  </div>
                </div>
                <div className="journey-line"></div>
                <div className="journey-point">
                  <div className="point-marker">Week 4</div>
                  <div className="point-info">
                    <strong>1,000 RON</strong>
                    <p>Unlock MEDIUM + Oracle Network</p>
                  </div>
                </div>
                <div className="journey-line"></div>
                <div className="journey-point">
                  <div className="point-marker">Month 3</div>
                  <div className="point-info">
                    <strong>10,000 RON</strong>
                    <p>Unlock HARD riddles + DAO voting</p>
                  </div>
                </div>
                <div className="journey-line"></div>
                <div className="journey-point">
                  <div className="point-marker">Year 1</div>
                  <div className="point-info">
                    <strong>100,000 RON</strong>
                    <p>Oracle master, legendary access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Anti-Cheat Mechanisms */}
        <section className="anti-cheat-section">
          <div className="container">
            <h2 className="section-title">🛡️ Anti-Cheat Mechanisms</h2>
            <p className="section-intro">Multiple layers of protection ensure fair play and human intelligence</p>

            <div className="anti-cheat-grid">
              <div className="protection-card">
                <i className="fas fa-clock"></i>
                <h3>30-Second Timer</h3>
                <p>Mandatory delay between minting and solving prevents instant bot submissions.</p>
                <div className="protection-why">
                  <strong>Prevents:</strong> Copy-paste attacks, automated solving, instant AI solutions
                </div>
              </div>

              <div className="protection-card">
                <i className="fas fa-fire"></i>
                <h3>Progressive Burns</h3>
                <p>Wrong answers cost more each time (1, 2, 3... N RDLN). Discourages brute force.</p>
                <div className="protection-why">
                  <strong>Prevents:</strong> Spam attempts, random guessing, brute force attacks
                </div>
              </div>

              <div className="protection-card">
                <i className="fas fa-lock"></i>
                <h3>Soul-Bound RON</h3>
                <p>Reputation cannot be transferred or bought. Must be earned through solving.</p>
                <div className="protection-why">
                  <strong>Prevents:</strong> Vote buying, account selling, unfair advantages
                </div>
              </div>

              <div className="protection-card">
                <i className="fas fa-chart-line"></i>
                <h3>RON Gating</h3>
                <p>Higher difficulty riddles require proven reputation to access.</p>
                <div className="protection-why">
                  <strong>Prevents:</strong> Newbies spamming hard riddles, low-quality attempts
                </div>
              </div>

              <div className="protection-card">
                <i className="fas fa-tachometer-alt"></i>
                <h3>Tiered Rewards</h3>
                <p>Late solvers earn less. Creates urgency to solve quickly with original thinking.</p>
                <div className="protection-why">
                  <strong>Prevents:</strong> NFT hoarding, waiting for answers, copying solutions
                </div>
              </div>

              <div className="protection-card">
                <i className="fas fa-shield-alt"></i>
                <h3>Hash-Based Answers</h3>
                <p>Correct answer stored as keccak256 hash. Cannot be reverse-engineered.</p>
                <div className="protection-why">
                  <strong>Prevents:</strong> Answer leaks, blockchain inspection attacks
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Flow */}
        <section className="complete-flow-section">
          <div className="container">
            <h2 className="section-title">🎮 Complete Game Flow</h2>

            <div className="flow-diagram">
              <div className="flow-stage">
                <div className="stage-num">1</div>
                <h4>Monday 00:00 UTC</h4>
                <p>New weekly riddle released</p>
                <div className="stage-details">
                  <span>Prize Pool: 500,000 RDLN</span>
                  <span>Difficulty: MEDIUM</span>
                  <span>Winners: 20 slots</span>
                </div>
              </div>

              <div className="flow-stage">
                <div className="stage-num">2</div>
                <h4>You Mint NFT</h4>
                <p>Pay 1,000 RDLN minting cost</p>
                <div className="stage-details">
                  <span>500 RDLN burned forever</span>
                  <span>250 RDLN to Grand Prize</span>
                  <span>250 RDLN to operations</span>
                </div>
              </div>

              <div className="flow-stage">
                <div className="stage-num">3</div>
                <h4>Wait 30 Seconds</h4>
                <p>Read riddle, think, prepare answer</p>
                <div className="stage-details">
                  <span>Timer prevents bots</span>
                  <span>Use time to think carefully</span>
                </div>
              </div>

              <div className="flow-stage">
                <div className="stage-num">4</div>
                <h4>Submit Answer</h4>
                <p>You're 3rd to solve correctly!</p>
                <div className="stage-details">
                  <span>Position: Top tier (2x multiplier)</span>
                  <span>Win: ~55,555 RDLN</span>
                  <span>Earn: 75 RON reputation</span>
                </div>
              </div>

              <div className="flow-stage highlight">
                <div className="stage-num">5</div>
                <h4>Claim Rewards</h4>
                <p>Withdraw your earnings!</p>
                <div className="stage-details">
                  <span>55,555 RDLN to wallet</span>
                  <span>75 RON added (soul-bound)</span>
                  <span>Achievement NFT updated</span>
                </div>
              </div>
            </div>

            <div className="net-result">
              <h3>Your Net Result</h3>
              <div className="result-breakdown">
                <div className="result-row cost">
                  <span>Minting Cost:</span>
                  <span>-1,000 RDLN</span>
                </div>
                <div className="result-row">
                  <span>Prize Won:</span>
                  <span>+55,555 RDLN</span>
                </div>
                <div className="result-row">
                  <span>RON Earned:</span>
                  <span>+75 RON</span>
                </div>
                <div className="result-total">
                  <span>Total Profit:</span>
                  <span className="profit">+54,555 RDLN + 75 RON</span>
                </div>
              </div>
              <div className="result-note">
                <i className="fas fa-star"></i>
                <p>Intelligence = Currency. You just earned 54x your investment by being smart and fast!</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-box">
              <h2>Ready to Start Solving?</h2>
              <p>Put your intelligence to work and start earning RDLN today</p>
              <div className="cta-buttons">
                <a href="/game" className="btn-cta-primary">
                  <i className="fas fa-gamepad"></i> Play Now
                </a>
                <a href="/quick-start" className="btn-cta-secondary">
                  <i className="fas fa-rocket"></i> Quick Start Guide
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
          max-width: 800px;
          margin: 0 auto;
        }

        .proof-of-solve-section,
        .nft-mechanics-section,
        .tiered-rewards-section,
        .ron-progression-section,
        .anti-cheat-section,
        .complete-flow-section {
          padding: 5rem 0;
        }

        .proof-of-solve-section {
          background: rgba(0, 0, 0, 0.2);
        }

        .anti-cheat-section {
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

        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .comparison-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
        }

        .comparison-card.new {
          border-color: rgba(255, 215, 0, 0.6);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.08));
        }

        .comparison-card h3 {
          color: #FFD700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .method {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin: 1.5rem 0;
        }

        .method i {
          font-size: 3rem;
          color: #FFA500;
        }

        .method span {
          color: #FFD700;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .comparison-card p {
          color: #cccccc;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .problem {
          background: rgba(255, 99, 71, 0.2);
          border: 1px solid rgba(255, 99, 71, 0.4);
          color: #FF6347;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
        }

        .solution {
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid rgba(0, 255, 0, 0.4);
          color: #00ff00;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
        }

        .consensus-flow {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 3rem;
        }

        .consensus-flow h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .flow-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .flow-step {
          flex: 1;
          min-width: 200px;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
        }

        .step-num {
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.3rem;
          margin: 0 auto 1rem;
        }

        .step-content h4 {
          color: #FFD700;
          margin-bottom: 0.5rem;
        }

        .step-content p {
          color: #cccccc;
          font-size: 0.95rem;
        }

        .flow-arrow {
          color: #FFD700;
          font-size: 2rem;
          font-weight: 700;
        }

        .mechanic-breakdown {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .mechanic-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .mechanic-card.highlight {
          border-color: rgba(255, 215, 0, 0.5);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.08));
        }

        .mechanic-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.5);
        }

        .mechanic-icon {
          font-size: 3.5rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        .mechanic-card h3 {
          color: #FFD700;
          font-size: 1.5rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        .mechanic-card > p {
          color: #cccccc;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .details-box {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .label {
          color: #FFA500;
          font-weight: 600;
        }

        .value {
          color: #FFD700;
        }

        .burn-note {
          background: rgba(255, 99, 71, 0.15);
          border: 1px solid rgba(255, 99, 71, 0.3);
          border-radius: 8px;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #FF6347;
          font-size: 0.9rem;
        }

        .timer-display {
          text-align: center;
          margin: 1.5rem 0;
        }

        .timer-icon {
          font-size: 4rem;
          margin-bottom: 0.5rem;
        }

        .timer-text {
          color: #FFD700;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .why-box {
          background: rgba(138, 43, 226, 0.15);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .why-box strong {
          color: #8A2BE2;
          display: block;
          margin-bottom: 0.5rem;
        }

        .why-box ul {
          color: #cccccc;
          padding-left: 1.5rem;
          margin: 0;
        }

        .attempts-cost {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin: 1.5rem 0;
        }

        .attempt-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          color: #cccccc;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .attempt-row:last-child {
          border-bottom: none;
        }

        .attempt-row.highlight {
          background: rgba(255, 215, 0, 0.1);
          padding: 0.75rem;
          border-radius: 5px;
        }

        .cost {
          color: #FF6347;
          font-weight: 700;
        }

        .strategy-tip {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 8px;
          padding: 0.75rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .strategy-tip i {
          color: #FFD700;
          font-size: 1.2rem;
        }

        .strategy-tip strong {
          color: #FFD700;
        }

        .rewards-breakdown {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .reward-type {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
        }

        .reward-icon {
          font-size: 2.5rem;
        }

        .reward-info h4 {
          color: #FFD700;
          margin-bottom: 0.25rem;
        }

        .reward-info p {
          color: #cccccc;
          font-size: 0.9rem;
          margin: 0;
        }

        .tier-visual {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .tier-box {
          border: 2px solid;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
        }

        .tier-box.gold {
          border-color: #FFD700;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
        }

        .tier-box.silver {
          border-color: #C0C0C0;
          background: linear-gradient(135deg, rgba(192, 192, 192, 0.2), rgba(169, 169, 169, 0.1));
        }

        .tier-box.bronze {
          border-color: #CD7F32;
          background: linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(184, 115, 51, 0.1));
        }

        .tier-header {
          margin-bottom: 1.5rem;
        }

        .tier-badge {
          display: inline-block;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .tier-range {
          color: #cccccc;
          font-size: 0.9rem;
        }

        .tier-multiplier {
          font-size: 3rem;
          font-weight: 800;
          color: #FFD700;
          margin: 1rem 0;
        }

        .tier-label {
          color: #FFA500;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .tier-positions {
          color: #cccccc;
          font-size: 0.9rem;
        }

        .example-calculation {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 3rem;
          margin-bottom: 2rem;
        }

        .example-calculation h3 {
          color: #FFD700;
          text-align: center;
          font-size: 1.8rem;
          margin-bottom: 2rem;
        }

        .calc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .calc-card {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
        }

        .solver-position {
          color: #FFD700;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .solver-tier {
          color: #FFA500;
          margin-bottom: 1rem;
        }

        .solver-math {
          color: #cccccc;
        }

        .solver-math strong {
          color: #FFD700;
          font-size: 1.2rem;
        }

        .calc-result {
          background: rgba(255, 215, 0, 0.15);
          border: 1px solid rgba(255, 215, 0, 0.4);
          border-radius: 10px;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .calc-result i {
          color: #FFD700;
          font-size: 2rem;
        }

        .calc-result p {
          color: #cccccc;
          margin: 0;
        }

        .game-mechanic-box {
          background: rgba(255, 99, 71, 0.1);
          border: 1px solid rgba(255, 99, 71, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .game-mechanic-box i {
          color: #FFD700;
          font-size: 2rem;
          flex-shrink: 0;
        }

        .game-mechanic-box div {
          color: #cccccc;
        }

        .game-mechanic-box strong {
          color: #FFD700;
        }

        .progression-levels {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .level-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid;
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .level-card:hover {
          transform: translateY(-5px);
        }

        .level-card.level-1 {
          border-color: rgba(124, 252, 0, 0.5);
        }

        .level-card.level-2 {
          border-color: rgba(138, 43, 226, 0.5);
        }

        .level-card.level-3 {
          border-color: rgba(255, 215, 0, 0.5);
        }

        .level-card.level-4 {
          border-color: rgba(255, 105, 180, 0.5);
          background: linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(138, 43, 226, 0.05));
        }

        .level-icon {
          font-size: 4rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        .level-card h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .ron-range {
          color: #FFA500;
          text-align: center;
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .access-badge {
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.4);
          color: #FFD700;
          text-align: center;
          padding: 0.75rem;
          border-radius: 10px;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .level-details h4 {
          color: #FFA500;
          margin-bottom: 0.75rem;
        }

        .level-details ul {
          color: #cccccc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .level-details li {
          padding: 0.25rem 0;
        }

        .earning-example {
          background: rgba(138, 43, 226, 0.15);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 8px;
          padding: 0.75rem;
          margin-top: 1rem;
        }

        .earning-example strong {
          color: #8A2BE2;
        }

        .progression-path-visual {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 3rem;
        }

        .progression-path-visual h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .journey-timeline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .journey-point {
          flex: 1;
          min-width: 150px;
          text-align: center;
          position: relative;
        }

        .point-marker {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin: 0 auto 1rem;
        }

        .point-info strong {
          color: #FFD700;
          display: block;
          margin-bottom: 0.5rem;
        }

        .point-info p {
          color: #cccccc;
          font-size: 0.9rem;
        }

        .journey-line {
          flex: 0.5;
          height: 3px;
          background: linear-gradient(90deg, #FFD700, #FFA500);
          margin: 0 1rem;
        }

        .anti-cheat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .protection-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .protection-card:hover {
          border-color: rgba(138, 43, 226, 0.6);
          transform: translateY(-5px);
        }

        .protection-card i {
          font-size: 3.5rem;
          color: #8A2BE2;
          margin-bottom: 1rem;
        }

        .protection-card h3 {
          color: #FFD700;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .protection-card > p {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        .protection-why {
          background: rgba(138, 43, 226, 0.15);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 8px;
          padding: 0.75rem;
        }

        .protection-why strong {
          color: #8A2BE2;
          display: block;
          margin-bottom: 0.5rem;
        }

        .flow-diagram {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .flow-stage {
          flex: 1;
          min-width: 200px;
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 1.5rem;
          text-align: center;
        }

        .flow-stage.highlight {
          border-color: rgba(255, 215, 0, 0.6);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.08));
        }

        .stage-num {
          width: 50px;
          height: 50px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.5rem;
          margin: 0 auto 1rem;
        }

        .flow-stage h4 {
          color: #FFD700;
          margin-bottom: 0.5rem;
        }

        .flow-stage > p {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        .stage-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .stage-details span {
          color: #FFA500;
        }

        .net-result {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 3rem;
        }

        .net-result h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .result-breakdown {
          max-width: 600px;
          margin: 0 auto 2rem;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 15px;
          padding: 2rem;
        }

        .result-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          color: #cccccc;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .result-row.cost span:last-child {
          color: #FF6347;
        }

        .result-row:not(.result-total) span:last-child {
          color: #00ff00;
        }

        .result-total {
          border-top: 2px solid rgba(255, 215, 0, 0.4);
          border-bottom: none;
          padding-top: 1rem;
          margin-top: 1rem;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .profit {
          color: #00ff00;
          font-size: 1.3rem;
        }

        .result-note {
          background: rgba(255, 215, 0, 0.15);
          border: 1px solid rgba(255, 215, 0, 0.4);
          border-radius: 10px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .result-note i {
          font-size: 2rem;
          color: #FFD700;
        }

        .result-note p {
          color: #cccccc;
          margin: 0;
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

          .comparison-grid,
          .mechanic-breakdown,
          .tier-visual,
          .progression-levels,
          .anti-cheat-grid {
            grid-template-columns: 1fr;
          }

          .flow-steps,
          .flow-diagram {
            flex-direction: column;
          }

          .flow-arrow {
            transform: rotate(90deg);
          }

          .journey-timeline {
            flex-direction: column;
          }

          .journey-line {
            width: 3px;
            height: 50px;
            margin: 1rem auto;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </>
  );
}
