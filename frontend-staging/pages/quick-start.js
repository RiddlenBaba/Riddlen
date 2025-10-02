import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';

export default function QuickStart() {
  return (
    <>
      <Head>
        <title>Quick Start Guide - Get Started with Riddlen in 5 Minutes</title>
        <meta name="description" content="New to Riddlen? Connect your wallet, get testnet tokens, and solve your first riddle. Complete beginner's guide to earning RDLN through intelligence." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">🚀</div>
        <div className="floating-riddle">🎮</div>
        <div className="floating-riddle">💎</div>
      </div>

      <Header currentPage="docs" />

      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        {/* Hero Section */}
        <section className="quickstart-hero">
          <div className="container">
            <h1 className="hero-title">🚀 Quick Start Guide</h1>
            <p className="hero-subtitle">Get started with Riddlen in 5 minutes. No luck, no bots—just intelligence.</p>

            <div className="time-badge">
              <i className="fas fa-clock"></i>
              <span>Estimated Time: 5 minutes</span>
            </div>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="steps-section">
          <div className="container">
            <h2 className="section-title">Your Journey to First Solve</h2>

            <div className="steps-container">
              {/* Step 1: Connect Wallet */}
              <div className="step-box">
                <div className="step-header">
                  <div className="step-number">1</div>
                  <h3>Connect Your Wallet</h3>
                </div>
                <div className="step-content">
                  <p className="step-desc">First, you need a Web3 wallet to interact with Riddlen on Polygon Amoy testnet.</p>

                  <div className="action-card">
                    <h4><i className="fas fa-wallet"></i> Install MetaMask</h4>
                    <p>If you don't have MetaMask yet:</p>
                    <ol>
                      <li>Visit <a href="https://metamask.io" target="_blank">metamask.io</a></li>
                      <li>Download the browser extension</li>
                      <li>Create a new wallet (save your seed phrase!)</li>
                    </ol>
                    <div className="pro-tip">
                      <i className="fas fa-lightbulb"></i>
                      <strong>Pro Tip:</strong> Keep your seed phrase safe and never share it with anyone!
                    </div>
                  </div>

                  <div className="action-card">
                    <h4><i className="fas fa-network-wired"></i> Add Polygon Amoy Network</h4>
                    <p>Configure your wallet for Riddlen's testnet:</p>
                    <div className="network-config">
                      <div className="config-item">
                        <span className="config-label">Network Name:</span>
                        <span className="config-value">Polygon Amoy Testnet</span>
                      </div>
                      <div className="config-item">
                        <span className="config-label">RPC URL:</span>
                        <span className="config-value">https://rpc-amoy.polygon.technology/</span>
                      </div>
                      <div className="config-item">
                        <span className="config-label">Chain ID:</span>
                        <span className="config-value">80002</span>
                      </div>
                      <div className="config-item">
                        <span className="config-label">Currency Symbol:</span>
                        <span className="config-value">MATIC</span>
                      </div>
                      <div className="config-item">
                        <span className="config-label">Block Explorer:</span>
                        <span className="config-value">https://amoy.polygonscan.com/</span>
                      </div>
                    </div>
                    <a href="https://amoy.polygonscan.com/" target="_blank" className="btn-primary">
                      <i className="fas fa-plus"></i> Auto-Add Amoy Network
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 2: Get Testnet Tokens */}
              <div className="step-box">
                <div className="step-header">
                  <div className="step-number">2</div>
                  <h3>Get Testnet MATIC</h3>
                </div>
                <div className="step-content">
                  <p className="step-desc">You need testnet MATIC to pay for gas fees (they're free on testnet!).</p>

                  <div className="action-card">
                    <h4><i className="fas fa-faucet"></i> Use Polygon Faucet</h4>
                    <ol>
                      <li>Visit the official <a href="https://faucet.polygon.technology/" target="_blank">Polygon Faucet</a></li>
                      <li>Select "Polygon Amoy" network</li>
                      <li>Paste your wallet address</li>
                      <li>Complete the captcha</li>
                      <li>Receive 0.5 testnet MATIC instantly</li>
                    </ol>
                    <a href="https://faucet.polygon.technology/" target="_blank" className="btn-secondary">
                      <i className="fas fa-external-link-alt"></i> Get Free Testnet MATIC
                    </a>
                  </div>

                  <div className="game-mechanic-box">
                    <i className="fas fa-info-circle"></i>
                    <div>
                      <strong>Game Mechanic:</strong> Testnet MATIC is free and only used for gas fees. Real earning happens through RDLN rewards from solving riddles!
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Connect to Riddlen */}
              <div className="step-box">
                <div className="step-header">
                  <div className="step-number">3</div>
                  <h3>Connect to Riddlen</h3>
                </div>
                <div className="step-content">
                  <p className="step-desc">Now connect your wallet to the Riddlen platform and start playing!</p>

                  <div className="action-card">
                    <h4><i className="fas fa-play-circle"></i> Launch the Game</h4>
                    <ol>
                      <li>Visit <a href="/game">riddlen.com/game</a></li>
                      <li>Click "Connect Wallet" button</li>
                      <li>Approve MetaMask connection</li>
                      <li>Make sure you're on Amoy network</li>
                    </ol>
                    <a href="/game" className="btn-primary">
                      <i className="fas fa-gamepad"></i> Go to Game
                    </a>
                  </div>

                  <div className="checklist-box">
                    <h4>✓ Pre-Game Checklist</h4>
                    <div className="checklist-item">
                      <i className="fas fa-check-circle"></i>
                      <span>MetaMask installed and setup</span>
                    </div>
                    <div className="checklist-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Polygon Amoy network added</span>
                    </div>
                    <div className="checklist-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Testnet MATIC in wallet</span>
                    </div>
                    <div className="checklist-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Wallet connected to Riddlen</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Solve Your First Riddle */}
              <div className="step-box highlighted">
                <div className="step-header">
                  <div className="step-number">4</div>
                  <h3>Solve Your First Riddle</h3>
                </div>
                <div className="step-content">
                  <p className="step-desc">Time to earn your first RDLN! Here's how the game works:</p>

                  <div className="action-card">
                    <h4><i className="fas fa-puzzle-piece"></i> The Solving Process</h4>
                    <ol>
                      <li><strong>Browse Riddles:</strong> See available EASY riddles (no RON required)</li>
                      <li><strong>Mint NFT Access:</strong> Pay small RDLN fee to attempt riddle</li>
                      <li><strong>30-Second Timer:</strong> Anti-cheat delay before you can submit</li>
                      <li><strong>Submit Answer:</strong> Type your solution carefully</li>
                      <li><strong>Earn Rewards:</strong> Correct = RDLN + RON, Wrong = RDLN burned</li>
                    </ol>
                  </div>

                  <div className="reward-preview">
                    <h4>What You'll Earn</h4>
                    <div className="reward-grid">
                      <div className="reward-item">
                        <div className="reward-icon">💰</div>
                        <div className="reward-name">RDLN Tokens</div>
                        <div className="reward-desc">Tradeable rewards (varies by position)</div>
                      </div>
                      <div className="reward-item">
                        <div className="reward-icon">⭐</div>
                        <div className="reward-name">RON Reputation</div>
                        <div className="reward-desc">10-25 RON per EASY solve</div>
                      </div>
                      <div className="reward-item">
                        <div className="reward-icon">🏆</div>
                        <div className="reward-name">Achievement NFT</div>
                        <div className="reward-desc">Proof of your solve</div>
                      </div>
                    </div>
                  </div>

                  <div className="game-mechanic-box highlight">
                    <i className="fas fa-trophy"></i>
                    <div>
                      <strong>Tiered Rewards:</strong> Solve in the first 25% to earn 2x rewards! First solver earns 4x more than last solver.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Understanding the Mechanics */}
        <section className="mechanics-section">
          <div className="container">
            <h2 className="section-title">Understanding Core Mechanics</h2>

            <div className="mechanics-grid">
              <div className="mechanic-card">
                <div className="mechanic-icon">⚡</div>
                <h3>Tiered Rewards</h3>
                <p>Speed matters! Solve early to maximize earnings:</p>
                <div className="tier-breakdown">
                  <div className="tier-item gold">
                    <span className="tier-label">First 25%</span>
                    <span className="tier-mult">2.0x</span>
                  </div>
                  <div className="tier-item silver">
                    <span className="tier-label">Middle 50%</span>
                    <span className="tier-mult">1.0x</span>
                  </div>
                  <div className="tier-item bronze">
                    <span className="tier-label">Last 25%</span>
                    <span className="tier-mult">0.5x</span>
                  </div>
                </div>
                <p className="mechanic-example"><strong>Example:</strong> 1,000 RDLN pool → First earns ~2,000, Last earns ~500</p>
              </div>

              <div className="mechanic-card">
                <div className="mechanic-icon">📈</div>
                <h3>RON Progression</h3>
                <p>Build reputation to unlock harder riddles:</p>
                <div className="progression-path">
                  <div className="prog-step">
                    <div className="prog-badge">Level 1</div>
                    <div className="prog-name">Newcomer</div>
                    <div className="prog-req">0-999 RON</div>
                    <div className="prog-access">EASY riddles only</div>
                  </div>
                  <div className="prog-arrow">→</div>
                  <div className="prog-step">
                    <div className="prog-badge">Level 2</div>
                    <div className="prog-name">Solver</div>
                    <div className="prog-req">1,000+ RON</div>
                    <div className="prog-access">EASY + MEDIUM</div>
                  </div>
                  <div className="prog-arrow">→</div>
                  <div className="prog-step">
                    <div className="prog-badge">Level 3</div>
                    <div className="prog-name">Expert</div>
                    <div className="prog-req">10,000+ RON</div>
                    <div className="prog-access">All riddles + Oracle</div>
                  </div>
                </div>
              </div>

              <div className="mechanic-card">
                <div className="mechanic-icon">🔥</div>
                <h3>Burn Protocol</h3>
                <p>Wrong answers cost you—think before submitting:</p>
                <div className="burn-schedule">
                  <div className="burn-item">1st wrong: <span>1 RDLN burned</span></div>
                  <div className="burn-item">2nd wrong: <span>2 RDLN burned</span></div>
                  <div className="burn-item">3rd wrong: <span>3 RDLN burned</span></div>
                  <div className="burn-item">Nth wrong: <span>N RDLN burned</span></div>
                </div>
                <p className="mechanic-example"><strong>Strategy:</strong> Quality over quantity. Take time to think!</p>
              </div>

              <div className="mechanic-card">
                <div className="mechanic-icon">⏱️</div>
                <h3>Anti-Cheat Timer</h3>
                <p>30-second delay prevents instant bot solutions:</p>
                <div className="timer-visual">
                  <div className="timer-step">
                    <i className="fas fa-lock"></i>
                    <span>Mint NFT</span>
                  </div>
                  <div className="timer-arrow">→</div>
                  <div className="timer-step">
                    <i className="fas fa-clock"></i>
                    <span>Wait 30s</span>
                  </div>
                  <div className="timer-arrow">→</div>
                  <div className="timer-step">
                    <i className="fas fa-unlock"></i>
                    <span>Submit Answer</span>
                  </div>
                </div>
                <p className="mechanic-example"><strong>Why?</strong> Ensures human thinking time, no copy-paste wins</p>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="nextsteps-section">
          <div className="container">
            <h2 className="section-title">What's Next?</h2>

            <div className="nextsteps-grid">
              <div className="next-card">
                <div className="next-icon">🎁</div>
                <h3>Join the Airdrop</h3>
                <p>Earn up to 15K RDLN through our 3-phase airdrop system. Social proof, reputation tiers, and validation work.</p>
                <a href="/airdrop" className="next-link">Join Airdrop →</a>
              </div>

              <div className="next-card">
                <div className="next-icon">🧠</div>
                <h3>Learn Game Mechanics</h3>
                <p>Deep dive into how Riddlen works: Proof-of-Solve, NFT mechanics, tiered rewards, and RON progression.</p>
                <a href="/how-it-works" className="next-link">Learn Mechanics →</a>
              </div>

              <div className="next-card">
                <div className="next-icon">🔮</div>
                <h3>Become a Validator</h3>
                <p>Build 1,000+ RON to unlock the Oracle Network. Earn unlimited RDLN by validating data for enterprises.</p>
                <a href="/oracle-guide" className="next-link">Oracle Guide →</a>
              </div>

              <div className="next-card">
                <div className="next-icon">💰</div>
                <h3>Study Tokenomics</h3>
                <p>Understand RDLN and RON tokens, deflationary mechanics, burn protocol, and the rug-proof treasury system.</p>
                <a href="/tokenomics-deep" className="next-link">Deep Dive →</a>
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="resources-section">
          <div className="container">
            <h2 className="section-title">Helpful Resources</h2>

            <div className="resources-grid">
              <div className="resource-box">
                <i className="fas fa-question-circle"></i>
                <h4>Stuck? Check the FAQ</h4>
                <p>30+ questions answered about gameplay, tokens, airdrop, and more</p>
                <a href="/faq">View FAQ →</a>
              </div>

              <div className="resource-box">
                <i className="fab fa-telegram"></i>
                <h4>Join the Community</h4>
                <p>Get help from other players and the Riddlen team</p>
                <a href="https://t.me/RiddlenToken" target="_blank">Telegram Community →</a>
              </div>

              <div className="resource-box">
                <i className="fas fa-code"></i>
                <h4>Technical Docs</h4>
                <p>Developer documentation, API reference, smart contracts</p>
                <a href="https://riddlen.org" target="_blank">Visit Docs Site →</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-box">
              <h2>Ready to Solve Your First Riddle?</h2>
              <p>Everything is set up. Time to prove your intelligence and earn RDLN!</p>
              <a href="/game" className="btn-cta-primary">
                <i className="fas fa-play"></i> Start Playing Now
              </a>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .quickstart-hero {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          padding: 4rem 0 3rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: #cccccc;
          margin-bottom: 2rem;
        }

        .time-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.4);
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          color: #FFD700;
          font-weight: 600;
        }

        .steps-section {
          padding: 5rem 0;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 3rem;
        }

        .steps-container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .step-box {
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2.5rem;
          transition: all 0.3s ease;
        }

        .step-box.highlighted {
          border-color: rgba(255, 215, 0, 0.5);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
        }

        .step-box:hover {
          border-color: rgba(255, 215, 0, 0.4);
          transform: translateY(-3px);
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .step-number {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        .step-header h3 {
          color: #FFD700;
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .step-desc {
          color: #cccccc;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .action-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 15px;
          padding: 2rem;
          margin-bottom: 1.5rem;
        }

        .action-card h4 {
          color: #FFA500;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .action-card h4 i {
          color: #FFD700;
        }

        .action-card p {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        .action-card ol, .action-card ul {
          color: #cccccc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .action-card li {
          padding: 0.5rem 0;
          line-height: 1.5;
        }

        .action-card li a {
          color: #FFD700;
          text-decoration: none;
          font-weight: 600;
        }

        .action-card li a:hover {
          color: #FFA500;
        }

        .pro-tip {
          background: rgba(138, 43, 226, 0.2);
          border: 1px solid rgba(138, 43, 226, 0.4);
          border-radius: 10px;
          padding: 1rem;
          color: #9370DB;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          margin-top: 1rem;
        }

        .pro-tip i {
          color: #FFD700;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .network-config {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          padding: 1.5rem;
          margin: 1.5rem 0;
        }

        .config-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .config-item:last-child {
          border-bottom: none;
        }

        .config-label {
          color: #FFA500;
          font-weight: 600;
        }

        .config-value {
          color: #FFD700;
          font-family: 'Courier New', monospace;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(255, 215, 0, 0.4);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: transparent;
          color: #FFD700;
          border: 2px solid #FFD700;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(255, 215, 0, 0.1);
          transform: translateY(-3px);
        }

        .game-mechanic-box {
          background: rgba(255, 99, 71, 0.1);
          border: 1px solid rgba(255, 99, 71, 0.3);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          margin-top: 1.5rem;
        }

        .game-mechanic-box.highlight {
          background: rgba(255, 215, 0, 0.15);
          border-color: rgba(255, 215, 0, 0.4);
        }

        .game-mechanic-box i {
          color: #FFD700;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .game-mechanic-box div {
          color: #cccccc;
        }

        .game-mechanic-box strong {
          color: #FFD700;
        }

        .checklist-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 15px;
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .checklist-box h4 {
          color: #FFD700;
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .checklist-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 0;
          color: #cccccc;
        }

        .checklist-item i {
          color: #00ff00;
          font-size: 1.2rem;
        }

        .reward-preview {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 15px;
          padding: 2rem;
          margin-top: 1.5rem;
        }

        .reward-preview h4 {
          color: #FFD700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .reward-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
        }

        .reward-item {
          text-align: center;
        }

        .reward-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .reward-name {
          color: #FFD700;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .reward-desc {
          color: #cccccc;
          font-size: 0.9rem;
        }

        .mechanics-section {
          padding: 5rem 0;
          background: rgba(0, 0, 0, 0.2);
        }

        .mechanics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .mechanic-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
        }

        .mechanic-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }

        .mechanic-card h3 {
          color: #FFD700;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .mechanic-card > p {
          color: #cccccc;
          margin-bottom: 1.5rem;
        }

        .tier-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin: 1.5rem 0;
        }

        .tier-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          border-radius: 8px;
        }

        .tier-item.gold {
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.4);
        }

        .tier-item.silver {
          background: rgba(192, 192, 192, 0.2);
          border: 1px solid rgba(192, 192, 192, 0.4);
        }

        .tier-item.bronze {
          background: rgba(205, 127, 50, 0.2);
          border: 1px solid rgba(205, 127, 50, 0.4);
        }

        .tier-label {
          color: #cccccc;
        }

        .tier-mult {
          color: #FFD700;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .progression-path {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 1.5rem 0;
          flex-wrap: wrap;
        }

        .prog-step {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          flex: 1;
          min-width: 150px;
        }

        .prog-badge {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          font-weight: 700;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          display: inline-block;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
        }

        .prog-name {
          color: #FFD700;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .prog-req {
          color: #FFA500;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .prog-access {
          color: #cccccc;
          font-size: 0.85rem;
        }

        .prog-arrow {
          color: #FFD700;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .burn-schedule {
          background: rgba(255, 99, 71, 0.1);
          border: 1px solid rgba(255, 99, 71, 0.3);
          border-radius: 10px;
          padding: 1.5rem;
          margin: 1.5rem 0;
        }

        .burn-item {
          color: #cccccc;
          padding: 0.5rem 0;
          display: flex;
          justify-content: space-between;
        }

        .burn-item span {
          color: #FF6347;
          font-weight: 700;
        }

        .timer-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 1.5rem 0;
          flex-wrap: wrap;
        }

        .timer-step {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
          flex: 1;
          min-width: 100px;
        }

        .timer-step i {
          color: #FFD700;
          font-size: 2rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        .timer-step span {
          color: #cccccc;
          font-size: 0.9rem;
        }

        .timer-arrow {
          color: #FFD700;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .mechanic-example {
          color: #FFA500;
          font-size: 0.95rem;
          margin-top: 1rem;
          font-style: italic;
        }

        .mechanic-example strong {
          color: #FFD700;
        }

        .nextsteps-section {
          padding: 5rem 0;
        }

        .nextsteps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .next-card {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .next-card:hover {
          border-color: rgba(255, 215, 0, 0.5);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(255, 215, 0, 0.1);
        }

        .next-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }

        .next-card h3 {
          color: #FFD700;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .next-card p {
          color: #cccccc;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .next-link {
          color: #FFD700;
          text-decoration: none;
          font-weight: 700;
          transition: color 0.3s ease;
        }

        .next-link:hover {
          color: #FFA500;
        }

        .resources-section {
          padding: 5rem 0;
          background: rgba(0, 0, 0, 0.2);
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .resource-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
        }

        .resource-box i {
          font-size: 3rem;
          color: #8A2BE2;
          margin-bottom: 1rem;
        }

        .resource-box h4 {
          color: #9370DB;
          font-size: 1.3rem;
          margin-bottom: 0.75rem;
        }

        .resource-box p {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        .resource-box a {
          color: #8A2BE2;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .resource-box a:hover {
          color: #FFD700;
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
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .cta-box p {
          color: #cccccc;
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        .btn-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 1.5rem 3rem;
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

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }

          .step-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .mechanics-grid {
            grid-template-columns: 1fr;
          }

          .progression-path {
            flex-direction: column;
          }

          .prog-arrow {
            transform: rotate(90deg);
          }

          .reward-grid {
            grid-template-columns: 1fr;
          }

          .config-item {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}
