import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';

export default function Tokenomics() {
  return (
    <>
      <Head>
        <title>Tokenomics - RDLN & RON Token Economics | Riddlen</title>
        <meta name="description" content="Complete guide to Riddlen tokenomics: RDLN utility token, RON reputation system, tiered rewards, deflationary mechanics, and rug-proof treasury." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">💰</div>
        <div className="floating-riddle">💎</div>
        <div className="floating-riddle">🔥</div>
      </div>

      <Header currentPage="tokenomics" />

      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <section className="tokenomics-hero">
          <div className="container">
            <h1 className="page-title">Riddlen Tokenomics</h1>
            <p className="page-subtitle">A merit-based economy where intelligence creates value</p>

            <div className="token-overview">
              <div className="token-card rdln">
                <div className="token-icon">💰</div>
                <h3>RDLN Token</h3>
                <p className="token-type">Utility Token (ERC-20)</p>
                <ul className="token-features">
                  <li><i className="fas fa-check"></i> Tradeable & Transferable</li>
                  <li><i className="fas fa-check"></i> Used for riddle access fees</li>
                  <li><i className="fas fa-check"></i> Earned as rewards</li>
                  <li><i className="fas fa-check"></i> Deflationary (burn on use)</li>
                </ul>
              </div>

              <div className="token-card ron">
                <div className="token-icon">🏆</div>
                <h3>RON Token</h3>
                <p className="token-type">Reputation Token (Soul-Bound)</p>
                <ul className="token-features">
                  <li><i className="fas fa-check"></i> Non-Transferable (Soul-Bound)</li>
                  <li><i className="fas fa-check"></i> Earned by solving riddles</li>
                  <li><i className="fas fa-check"></i> Grants voting power (1 RON = 1 Vote)</li>
                  <li><i className="fas fa-check"></i> Unlocks higher tiers</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="token-distribution">
          <div className="container">
            <h2 className="section-title">Token Distribution (1 Billion RDLN)</h2>

            <div className="distribution-grid">
              <div className="distribution-card">
                <div className="percentage">70%</div>
                <div className="amount">700,000,000 RDLN</div>
                <h3>🏆 Riddle Rewards Pool</h3>
                <p>Locked in prize vaults across 1,000 riddles released over 20 years. Tokens remain locked until riddles are solved.</p>
                <div className="details">
                  <div className="detail-item">
                    <i className="fas fa-lock"></i>
                    <span>Locked until solved</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>1,000 riddles over 20 years</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-trophy"></i>
                    <span>Tiered reward system (2x/1x/0.5x)</span>
                  </div>
                </div>
              </div>

              <div className="distribution-card">
                <div className="percentage">10%</div>
                <div className="amount">100,000,000 RDLN</div>
                <h3>🏛️ Treasury Reserve</h3>
                <p>Time-locked with 1M monthly release (~8+ years runway). Immutable rug-proof protections built into smart contract.</p>
                <div className="details">
                  <div className="detail-item">
                    <i className="fas fa-shield-alt"></i>
                    <span>1M RDLN/month (fixed)</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>5M max emergency/year</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>1-year emergency cooldown</span>
                  </div>
                </div>
              </div>

              <div className="distribution-card">
                <div className="percentage">10%</div>
                <div className="amount">100,000,000 RDLN</div>
                <h3>🎁 Community Airdrop</h3>
                <p>Three-phase distribution: social proof (33M), RON reputation (33M), and validation work (34M). 15K max per wallet.</p>
                <div className="details">
                  <div className="detail-item">
                    <i className="fas fa-users"></i>
                    <span>Phase 1: Social proof (5K RDLN)</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-star"></i>
                    <span>Phase 2: Reputation (2K-5K)</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-check-double"></i>
                    <span>Phase 3: Validation (up to 5K)</span>
                  </div>
                </div>
              </div>

              <div className="distribution-card">
                <div className="percentage">10%</div>
                <div className="amount">100,000,000 RDLN</div>
                <h3>💧 Liquidity Pool</h3>
                <p>Paired with MATIC and locked for up to 10 years, ensuring permanent market depth and price stability.</p>
                <div className="details">
                  <div className="detail-item">
                    <i className="fas fa-lock"></i>
                    <span>Locked up to 10 years</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-exchange-alt"></i>
                    <span>RDLN/MATIC pair</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-water"></i>
                    <span>Permanent market depth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tiered-rewards">
          <div className="container">
            <h2 className="section-title">🏆 Revolutionary Tiered Reward System</h2>
            <p className="section-description">First solvers earn 4x more than late solvers! Speed and intelligence matter.</p>

            <div className="tier-example">
              <h3>Example: 20 Winners, 1M RDLN Prize Pool</h3>
              <div className="tiers-grid">
                <div className="tier-card tier1">
                  <div className="tier-badge">Tier 1</div>
                  <div className="tier-positions">Positions 1-5</div>
                  <div className="tier-multiplier">2.0x Multiplier</div>
                  <div className="tier-reward">~88,888 RDLN each</div>
                  <p>First 25% of solvers get double rewards</p>
                </div>

                <div className="tier-card tier2">
                  <div className="tier-badge">Tier 2</div>
                  <div className="tier-positions">Positions 6-15</div>
                  <div className="tier-multiplier">1.0x Multiplier</div>
                  <div className="tier-reward">~44,444 RDLN each</div>
                  <p>Middle 50% get standard rewards</p>
                </div>

                <div className="tier-card tier3">
                  <div className="tier-badge">Tier 3</div>
                  <div className="tier-positions">Positions 16-20</div>
                  <div className="tier-multiplier">0.5x Multiplier</div>
                  <div className="tier-reward">~22,222 RDLN each</div>
                  <p>Last 25% get half rewards</p>
                </div>
              </div>

              <div className="tier-result">
                <strong>Result:</strong> First solver earns 4x more than last solver! This creates urgency and prevents NFT hoarding.
              </div>
            </div>
          </div>
        </section>

        <section className="deflationary">
          <div className="container">
            <h2 className="section-title">🔥 Deflationary Mechanics</h2>

            <div className="burn-mechanisms">
              <div className="mechanism-card">
                <div className="mechanism-icon">🔥</div>
                <h3>Burn Protocol</h3>
                <p>Every transaction triggers automatic burns:</p>
                <div className="burn-breakdown">
                  <div className="burn-item">
                    <div className="burn-percent">50%</div>
                    <div className="burn-label">Burned Forever</div>
                  </div>
                  <div className="burn-item">
                    <div className="burn-percent">25%</div>
                    <div className="burn-label">Grand Prize Pool</div>
                  </div>
                  <div className="burn-item">
                    <div className="burn-percent">25%</div>
                    <div className="burn-label">Operations</div>
                  </div>
                </div>
              </div>

              <div className="mechanism-card">
                <div className="mechanism-icon">📉</div>
                <h3>Failed Solve Penalties</h3>
                <p>Progressive burning on incorrect answers:</p>
                <ul className="penalty-list">
                  <li>1st attempt: 1 RDLN burned</li>
                  <li>2nd attempt: 2 RDLN burned</li>
                  <li>3rd attempt: 3 RDLN burned</li>
                  <li>And so on...</li>
                </ul>
                <p className="penalty-note">This prevents brute force attacks and maintains token scarcity.</p>
              </div>

              <div className="mechanism-card">
                <div className="mechanism-icon">⏳</div>
                <h3>Biennial Halving</h3>
                <p>Rewards reduce every 2 years:</p>
                <ul className="halving-list">
                  <li>Year 1-2: 100% rewards</li>
                  <li>Year 3-4: 50% rewards</li>
                  <li>Year 5-6: 25% rewards</li>
                  <li>Year 7-8: 12.5% rewards</li>
                </ul>
                <p className="halving-note">Creates long-term scarcity and value appreciation.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rug-proof">
          <div className="container">
            <h2 className="section-title">🛡️ Rug-Proof Treasury</h2>
            <p className="section-description">Immutable holder protections built into smart contracts</p>

            <div className="protection-grid">
              <div className="protection-card">
                <i className="fas fa-calendar-check"></i>
                <h3>Fixed Monthly Release</h3>
                <p>1M RDLN per month for operations</p>
                <div className="code-box">uint256 MONTHLY_OPERATIONS_RELEASE = 1_000_000</div>
                <span className="immutable-badge">IMMUTABLE</span>
              </div>

              <div className="protection-card">
                <i className="fas fa-exclamation-circle"></i>
                <h3>Emergency Limit</h3>
                <p>Maximum 5M RDLN per emergency</p>
                <div className="code-box">uint256 MAX_EMERGENCY_RELEASE = 5_000_000</div>
                <span className="immutable-badge">IMMUTABLE</span>
              </div>

              <div className="protection-card">
                <i className="fas fa-clock"></i>
                <h3>Emergency Cooldown</h3>
                <p>1 year between emergency releases</p>
                <div className="code-box">uint256 EMERGENCY_COOLDOWN = 365 days</div>
                <span className="immutable-badge">IMMUTABLE</span>
              </div>

              <div className="protection-card">
                <i className="fas fa-chart-line"></i>
                <h3>Predictable Supply</h3>
                <p>Max 12M RDLN/year from operations</p>
                <div className="calculation">
                  1M/month × 12 months = 12M/year
                </div>
                <span className="guarantee-badge">GUARANTEED</span>
              </div>
            </div>

            <div className="transparency-note">
              <i className="fas fa-eye"></i>
              <p>All treasury operations are fully transparent and verifiable on-chain. No surprise token dumps possible.</p>
            </div>
          </div>
        </section>

        <section className="ron-system">
          <div className="container">
            <h2 className="section-title">⭐ RON Reputation System</h2>

            <div className="ron-grid">
              <div className="ron-feature">
                <h3>How to Earn RON</h3>
                <ul className="earn-list">
                  <li><i className="fas fa-puzzle-piece"></i> Solve riddles correctly</li>
                  <li><i className="fas fa-check-circle"></i> Validate data through Oracle Network</li>
                  <li><i className="fas fa-edit"></i> Curate quality content</li>
                  <li><i className="fas fa-hands-helping"></i> Contribute to ecosystem</li>
                </ul>
              </div>

              <div className="ron-feature">
                <h3>RON Benefits</h3>
                <ul className="benefit-list">
                  <li><i className="fas fa-vote-yea"></i> Governance voting power (1 RON = 1 Vote)</li>
                  <li><i className="fas fa-level-up-alt"></i> Unlock higher difficulty riddles</li>
                  <li><i className="fas fa-star"></i> Access Oracle Network tiers</li>
                  <li><i className="fas fa-crown"></i> Community recognition & status</li>
                </ul>
              </div>

              <div className="ron-feature">
                <h3>Oracle Network Tiers</h3>
                <ul className="tier-list">
                  <li><span className="tier-name">Bronze:</span> 100 RON required</li>
                  <li><span className="tier-name">Silver:</span> 1,000 RON required</li>
                  <li><span className="tier-name">Gold:</span> 10,000 RON required</li>
                  <li><span className="tier-name">Platinum:</span> 100,000 RON required</li>
                </ul>
              </div>

              <div className="ron-feature soul-bound">
                <h3>🔒 Soul-Bound Property</h3>
                <p>RON tokens are <strong>non-transferable</strong> and bound to your wallet forever.</p>
                <div className="soul-bound-benefits">
                  <p>✓ Prevents vote buying</p>
                  <p>✓ True merit-based system</p>
                  <p>✓ Reputation can't be purchased</p>
                  <p>✓ Fair governance for all</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-box">
              <h2>Ready to Start Earning?</h2>
              <p>Join the merit-based economy where your intelligence creates real value</p>
              <div className="cta-buttons">
                <a href="/game" className="btn-primary">
                  <i className="fas fa-play"></i> Start Playing
                </a>
                <a href="/airdrop" className="btn-secondary">
                  <i className="fas fa-gift"></i> Join Airdrop
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .tokenomics-hero {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          padding: 4rem 0 3rem;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }

        .page-title {
          text-align: center;
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .page-subtitle {
          text-align: center;
          font-size: 1.3rem;
          color: #cccccc;
          margin-bottom: 3rem;
        }

        .token-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .token-card {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
          text-align: center;
        }

        .token-card.ron {
          background: linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(148, 0, 211, 0.1));
          border-color: rgba(138, 43, 226, 0.5);
        }

        .token-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .token-card h3 {
          color: #FFD700;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .token-type {
          color: #FFA500;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .token-features {
          list-style: none;
          padding: 0;
          text-align: left;
        }

        .token-features li {
          color: #cccccc;
          padding: 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .token-features i {
          color: #FFD700;
        }

        .token-distribution, .tiered-rewards, .deflationary, .rug-proof, .ron-system {
          padding: 4rem 0;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .section-description {
          text-align: center;
          font-size: 1.2rem;
          color: #cccccc;
          margin-bottom: 3rem;
        }

        .distribution-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .distribution-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .distribution-card:hover {
          border-color: rgba(255, 215, 0, 0.5);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(255, 215, 0, 0.1);
        }

        .percentage {
          font-size: 3rem;
          font-weight: 800;
          color: #FFD700;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .amount {
          font-size: 1.1rem;
          color: #FFA500;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .distribution-card h3 {
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .distribution-card > p {
          color: #cccccc;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .details {
          border-top: 1px solid rgba(255, 215, 0, 0.2);
          padding-top: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #cccccc;
          padding: 0.5rem 0;
          font-size: 0.95rem;
        }

        .detail-item i {
          color: #FFD700;
          width: 20px;
        }

        .tier-example {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.03));
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 3rem;
        }

        .tier-example h3 {
          text-align: center;
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 2rem;
        }

        .tiers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .tier-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid;
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
        }

        .tier-card.tier1 {
          border-color: #FFD700;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
        }

        .tier-card.tier2 {
          border-color: #C0C0C0;
          background: linear-gradient(135deg, rgba(192, 192, 192, 0.2), rgba(169, 169, 169, 0.1));
        }

        .tier-card.tier3 {
          border-color: #CD7F32;
          background: linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(184, 115, 51, 0.1));
        }

        .tier-badge {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .tier1 .tier-badge { color: #FFD700; }
        .tier2 .tier-badge { color: #C0C0C0; }
        .tier3 .tier-badge { color: #CD7F32; }

        .tier-positions {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        .tier-multiplier {
          font-size: 1.8rem;
          font-weight: 800;
          color: #FFD700;
          margin-bottom: 0.5rem;
        }

        .tier-reward {
          font-size: 1.3rem;
          font-weight: 700;
          color: #FFA500;
          margin-bottom: 1rem;
        }

        .tier-card p {
          color: #cccccc;
          font-size: 0.9rem;
        }

        .tier-result {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 10px;
          padding: 1.5rem;
          text-align: center;
          color: #ffffff;
          font-size: 1.1rem;
        }

        .tier-result strong {
          color: #FFD700;
        }

        .burn-mechanisms {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .mechanism-card {
          background: linear-gradient(135deg, rgba(255, 99, 71, 0.1), rgba(255, 69, 0, 0.05));
          border: 1px solid rgba(255, 99, 71, 0.3);
          border-radius: 20px;
          padding: 2rem;
        }

        .mechanism-icon {
          font-size: 3rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        .mechanism-card h3 {
          color: #FF6347;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-align: center;
        }

        .mechanism-card > p {
          color: #cccccc;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .burn-breakdown {
          display: flex;
          justify-content: space-around;
          margin-top: 1.5rem;
        }

        .burn-item {
          text-align: center;
        }

        .burn-percent {
          font-size: 2rem;
          font-weight: 800;
          color: #FF6347;
        }

        .burn-label {
          font-size: 0.9rem;
          color: #cccccc;
        }

        .penalty-list, .halving-list {
          list-style: none;
          padding: 0;
          color: #cccccc;
        }

        .penalty-list li, .halving-list li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .penalty-list li:before, .halving-list li:before {
          content: "•";
          color: #FF6347;
          position: absolute;
          left: 0;
          font-size: 1.5rem;
        }

        .penalty-note, .halving-note {
          margin-top: 1rem;
          color: #FFA500;
          font-style: italic;
          font-size: 0.9rem;
        }

        .protection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .protection-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
        }

        .protection-card i {
          font-size: 3rem;
          color: #8A2BE2;
          margin-bottom: 1rem;
        }

        .protection-card h3 {
          color: #FFD700;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .protection-card > p {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        .code-box {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 8px;
          padding: 1rem;
          color: #9370DB;
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          margin-bottom: 1rem;
          word-break: break-all;
        }

        .calculation {
          background: rgba(255, 215, 0, 0.1);
          border-radius: 8px;
          padding: 1rem;
          color: #FFD700;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .immutable-badge, .guarantee-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .immutable-badge {
          background: linear-gradient(45deg, #8A2BE2, #9370DB);
          color: #ffffff;
        }

        .guarantee-badge {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000000;
        }

        .transparency-note {
          background: rgba(138, 43, 226, 0.1);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .transparency-note i {
          font-size: 2rem;
          color: #8A2BE2;
        }

        .transparency-note p {
          color: #cccccc;
          margin: 0;
        }

        .ron-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .ron-feature {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
        }

        .ron-feature.soul-bound {
          background: linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(148, 0, 211, 0.1));
          border-color: rgba(138, 43, 226, 0.5);
        }

        .ron-feature h3 {
          color: #FFD700;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .earn-list, .benefit-list, .tier-list {
          list-style: none;
          padding: 0;
        }

        .earn-list li, .benefit-list li, .tier-list li {
          color: #cccccc;
          padding: 0.75rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .earn-list i, .benefit-list i {
          color: #FFD700;
          width: 20px;
        }

        .tier-name {
          color: #FFD700;
          font-weight: 600;
        }

        .soul-bound-benefits {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(138, 43, 226, 0.3);
        }

        .soul-bound-benefits p {
          color: #9370DB;
          padding: 0.4rem 0;
        }

        .ron-feature strong {
          color: #8A2BE2;
        }

        .cta-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.03));
        }

        .cta-box {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
        }

        .cta-box h2 {
          color: #FFD700;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .cta-box > p {
          color: #cccccc;
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 1.2rem 2.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(255, 215, 0, 0.4);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: transparent;
          color: #FFD700;
          padding: 1.2rem 2.5rem;
          border: 2px solid #FFD700;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(255, 215, 0, 0.1);
          transform: translateY(-3px);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }

          .token-overview {
            grid-template-columns: 1fr;
          }

          .distribution-grid, .burn-mechanisms, .protection-grid, .ron-grid {
            grid-template-columns: 1fr;
          }

          .tiers-grid {
            grid-template-columns: 1fr;
          }

          .burn-breakdown {
            flex-direction: column;
            gap: 1rem;
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
