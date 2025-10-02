import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';

export default function TokenomicsDeep() {
  return (
    <>
      <Head>
        <title>The Economics of Intelligence - Riddlen Tokenomics Deep Dive</title>
        <meta name="description" content="Complete breakdown of RDLN and RON tokenomics: 1B supply, 50% burn mechanics, Grand Prize Pool, biennial halving, and the rug-proof treasury system." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">💰</div>
        <div className="floating-riddle">🔥</div>
        <div className="floating-riddle">💎</div>
      </div>

      <Header currentPage="docs" />

      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <h1 className="page-title">The Economics of Intelligence</h1>
            <p className="page-subtitle">How Riddlen creates sustainable value through deflationary mechanics, transparent treasury, and merit-based distribution</p>

            <div className="hero-stats-grid">
              <div className="hero-stat">
                <div className="stat-icon">🪙</div>
                <div className="stat-value">1,000,000,000</div>
                <div className="stat-label">Total RDLN Supply</div>
              </div>
              <div className="hero-stat">
                <div className="stat-icon">🔥</div>
                <div className="stat-value">50%</div>
                <div className="stat-label">Every Transaction Burns</div>
              </div>
              <div className="hero-stat">
                <div className="stat-icon">🏆</div>
                <div className="stat-value">25%</div>
                <div className="stat-label">Goes to Grand Prize</div>
              </div>
              <div className="hero-stat">
                <div className="stat-icon">🔐</div>
                <div className="stat-value">10 Years</div>
                <div className="stat-label">Liquidity Locked</div>
              </div>
            </div>
          </div>
        </section>

        {/* Supply Breakdown */}
        <section className="supply-section">
          <div className="container">
            <h2 className="section-title">1 Billion Token Breakdown</h2>
            <p className="section-intro">Fair, transparent, and designed for long-term sustainability</p>

            <div className="supply-visualization">
              <div className="supply-chart">
                <div className="chart-bar riddles" style={{ width: '70%' }}>
                  <div className="bar-label">Riddle Prize Pool</div>
                  <div className="bar-value">700M RDLN (70%)</div>
                </div>
                <div className="chart-bar treasury" style={{ width: '10%' }}>
                  <div className="bar-label">Treasury</div>
                  <div className="bar-value">100M RDLN (10%)</div>
                </div>
                <div className="chart-bar airdrop" style={{ width: '10%' }}>
                  <div className="bar-label">Airdrop</div>
                  <div className="bar-value">100M RDLN (10%)</div>
                </div>
                <div className="chart-bar liquidity" style={{ width: '10%' }}>
                  <div className="bar-label">Liquidity</div>
                  <div className="bar-value">100M RDLN (10%)</div>
                </div>
              </div>
            </div>

            <div className="allocation-grid">
              <div className="allocation-card">
                <div className="allocation-icon">🎯</div>
                <h3>700M RDLN - Riddle Prize Pool</h3>
                <p><strong>Purpose:</strong> Weekly riddle rewards distributed over 20 years</p>
                <ul>
                  <li>1,000 weekly riddles (2025-2045)</li>
                  <li>Average 700K RDLN per riddle</li>
                  <li>Prize range: 100K - 2M RDLN</li>
                  <li>Variable winner slots (1-100 per riddle)</li>
                </ul>
                <div className="allocation-note">The core mechanism that rewards intelligence</div>
              </div>

              <div className="allocation-card">
                <div className="allocation-icon">🏛️</div>
                <h3>100M RDLN - Treasury Reserve</h3>
                <p><strong>Purpose:</strong> Development and operations funding</p>
                <ul>
                  <li>1M RDLN/month base release</li>
                  <li>1.0x - 5.0x dynamic multiplier</li>
                  <li>8+ years guaranteed runway</li>
                  <li>5M RDLN emergency maximum</li>
                </ul>
                <div className="allocation-note">Rug-proof via TreasuryDrip smart contract</div>
              </div>

              <div className="allocation-card">
                <div className="allocation-icon">🎁</div>
                <h3>100M RDLN - Community Airdrop</h3>
                <p><strong>Purpose:</strong> Early adoption incentives</p>
                <ul>
                  <li>Phase 1: Social proof (33M)</li>
                  <li>Phase 2: RON reputation (33M)</li>
                  <li>Phase 3: Validation work (34M)</li>
                  <li>15K RDLN max per wallet</li>
                </ul>
                <div className="allocation-note">Merit-based distribution, not random lottery</div>
              </div>

              <div className="allocation-card">
                <div className="allocation-icon">💧</div>
                <h3>100M RDLN - Liquidity Pool</h3>
                <p><strong>Purpose:</strong> DEX liquidity and market stability</p>
                <ul>
                  <li>Locked for 10 years minimum</li>
                  <li>Prevents rug pull attacks</li>
                  <li>Ensures market depth</li>
                  <li>Time-locked smart contract</li>
                </ul>
                <div className="allocation-note">Complete transparency, no founder backdoors</div>
              </div>
            </div>
          </div>
        </section>

        {/* Burn Mechanics */}
        <section className="burn-section alt">
          <div className="container">
            <h2 className="section-title">Revolutionary Burn Mechanics</h2>
            <p className="section-intro">Every transaction makes RDLN more scarce and valuable</p>

            <div className="burn-flow">
              <div className="burn-step">
                <div className="step-icon">💸</div>
                <h3>Transaction Occurs</h3>
                <p>User pays RDLN for minting, attempts, or questions</p>
              </div>
              <div className="burn-arrow">→</div>
              <div className="burn-step">
                <div className="step-icon">🔥</div>
                <h3>50% Burned Forever</h3>
                <p>Permanently removed from circulation</p>
              </div>
              <div className="burn-arrow">→</div>
              <div className="burn-step">
                <div className="step-icon">🏆</div>
                <h3>25% Grand Prize Pool</h3>
                <p>Accumulates for legendary events</p>
              </div>
              <div className="burn-arrow">→</div>
              <div className="burn-step">
                <div className="step-icon">🛠️</div>
                <h3>25% Dev/Ops</h3>
                <p>Funds long-term development</p>
              </div>
            </div>

            <div className="burn-mechanics-grid">
              <div className="burn-card">
                <h3>Progressive Burn Protocol</h3>
                <p>Costs increase with usage to prevent spam</p>
                <div className="burn-examples">
                  <div className="burn-example">
                    <strong>Failed Riddle Attempts:</strong>
                    <div className="attempt-list">
                      <div className="attempt-row">
                        <span>1st attempt</span>
                        <span className="burn-amount">1 RDLN burned</span>
                      </div>
                      <div className="attempt-row">
                        <span>2nd attempt</span>
                        <span className="burn-amount">2 RDLN burned</span>
                      </div>
                      <div className="attempt-row">
                        <span>3rd attempt</span>
                        <span className="burn-amount">3 RDLN burned</span>
                      </div>
                      <div className="attempt-row">
                        <span>Nth attempt</span>
                        <span className="burn-amount">N RDLN burned</span>
                      </div>
                    </div>
                  </div>
                  <div className="burn-example">
                    <strong>Question Submissions:</strong>
                    <div className="attempt-list">
                      <div className="attempt-row">
                        <span>1st question</span>
                        <span className="burn-amount">1 RDLN burned</span>
                      </div>
                      <div className="attempt-row">
                        <span>2nd question</span>
                        <span className="burn-amount">2 RDLN burned</span>
                      </div>
                      <div className="attempt-row">
                        <span>Nth question</span>
                        <span className="burn-amount">N RDLN burned</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="burn-card">
                <h3>NFT Minting Burns</h3>
                <p>Biennial halving schedule</p>
                <div className="halving-schedule">
                  <div className="halving-row">
                    <span className="year-range">Years 1-2</span>
                    <span className="burn-cost">1,000 RDLN</span>
                  </div>
                  <div className="halving-row">
                    <span className="year-range">Years 3-4</span>
                    <span className="burn-cost">500 RDLN</span>
                  </div>
                  <div className="halving-row">
                    <span className="year-range">Years 5-6</span>
                    <span className="burn-cost">250 RDLN</span>
                  </div>
                  <div className="halving-row">
                    <span className="year-range">Years 7-8</span>
                    <span className="burn-cost">125 RDLN</span>
                  </div>
                  <div className="halving-row">
                    <span className="year-range">Years 9-10</span>
                    <span className="burn-cost">62 RDLN</span>
                  </div>
                  <div className="halving-row fade">
                    <span className="year-range">Years 11-12</span>
                    <span className="burn-cost">31 RDLN</span>
                  </div>
                  <div className="halving-row fade">
                    <span className="year-range">Years 13-14</span>
                    <span className="burn-cost">15 RDLN</span>
                  </div>
                  <div className="halving-row fade">
                    <span className="year-range">Years 19-20</span>
                    <span className="burn-cost">1.5 RDLN (final)</span>
                  </div>
                </div>
                <div className="halving-note">Every 2 years = 50% reduction in minting cost</div>
              </div>
            </div>
          </div>
        </section>

        {/* Grand Prize Pool */}
        <section className="grand-prize-section">
          <div className="container">
            <h2 className="section-title">Grand Prize Pool System</h2>
            <p className="section-intro">25% of all burns accumulate for legendary community events</p>

            <div className="grand-prize-visual">
              <div className="prize-accumulation">
                <div className="prize-vault">
                  <div className="vault-icon">🏆</div>
                  <div className="vault-title">Grand Prize Vault</div>
                  <div className="vault-accumulation">Continuously Growing</div>
                </div>
                <div className="accumulation-sources">
                  <div className="source-item">
                    <i className="fas fa-fire"></i>
                    <span>25% of every NFT mint</span>
                  </div>
                  <div className="source-item">
                    <i className="fas fa-fire"></i>
                    <span>25% of every failed attempt</span>
                  </div>
                  <div className="source-item">
                    <i className="fas fa-fire"></i>
                    <span>25% of every question submission</span>
                  </div>
                </div>
              </div>

              <div className="prize-features-grid">
                <div className="prize-feature">
                  <div className="feature-icon">🔒</div>
                  <h3>Multi-Sig Security</h3>
                  <p>4-of-5 signature requirement for Grand Prize vault</p>
                  <p>No single person can access the funds</p>
                </div>
                <div className="prize-feature">
                  <div className="feature-icon">📅</div>
                  <h3>Quarterly/Annual Events</h3>
                  <p>Massive prize pool distributions</p>
                  <p>Community votes on event timing</p>
                </div>
                <div className="prize-feature">
                  <div className="feature-icon">🎯</div>
                  <h3>Legendary Riddles</h3>
                  <p>Unprecedented reward opportunities</p>
                  <p>Build community excitement</p>
                </div>
                <div className="prize-feature">
                  <div className="feature-icon">📊</div>
                  <h3>Full Transparency</h3>
                  <p>On-chain balance tracking</p>
                  <p>Public wallet address</p>
                </div>
              </div>
            </div>

            <div className="prize-projection-box">
              <h3>Projected Grand Prize Growth</h3>
              <div className="projection-table">
                <div className="projection-row header">
                  <span>Year</span>
                  <span>Estimated Burns</span>
                  <span>Grand Prize (25%)</span>
                  <span>Cumulative Pool</span>
                </div>
                <div className="projection-row">
                  <span>Year 1</span>
                  <span>50,000 RDLN</span>
                  <span>12,500 RDLN</span>
                  <span>12,500 RDLN</span>
                </div>
                <div className="projection-row">
                  <span>Year 2</span>
                  <span>100,000 RDLN</span>
                  <span>25,000 RDLN</span>
                  <span>37,500 RDLN</span>
                </div>
                <div className="projection-row">
                  <span>Year 3</span>
                  <span>200,000 RDLN</span>
                  <span>50,000 RDLN</span>
                  <span>87,500 RDLN</span>
                </div>
                <div className="projection-row highlight">
                  <span>Year 5</span>
                  <span>500,000 RDLN</span>
                  <span>125,000 RDLN</span>
                  <span>300,000+ RDLN</span>
                </div>
              </div>
              <p className="projection-note">Example projection based on moderate usage. Actual accumulation depends on platform activity.</p>
            </div>
          </div>
        </section>

        {/* Rug-Proof Treasury */}
        <section className="treasury-section alt">
          <div className="container">
            <h2 className="section-title">Rug-Proof Treasury System</h2>
            <p className="section-intro">100M RDLN locked in transparent smart contract with automated monthly releases</p>

            <div className="treasury-grid">
              <div className="treasury-card">
                <div className="card-icon">📅</div>
                <h3>Monthly Drip Release</h3>
                <div className="drip-details">
                  <div className="drip-row">
                    <span>Base Release</span>
                    <span className="value">1,000,000 RDLN/month</span>
                  </div>
                  <div className="drip-row">
                    <span>Dynamic Multiplier</span>
                    <span className="value">1.0x - 5.0x</span>
                  </div>
                  <div className="drip-row">
                    <span>Emergency Maximum</span>
                    <span className="value">5,000,000 RDLN</span>
                  </div>
                  <div className="drip-row">
                    <span>Guaranteed Runway</span>
                    <span className="value">8+ years</span>
                  </div>
                </div>
              </div>

              <div className="treasury-card">
                <div className="card-icon">🔐</div>
                <h3>Smart Contract Protected</h3>
                <ul className="protection-list">
                  <li><i className="fas fa-check"></i> TreasuryDrip.sol enforces rules</li>
                  <li><i className="fas fa-check"></i> Cannot withdraw more than limit</li>
                  <li><i className="fas fa-check"></i> Automated monthly releases</li>
                  <li><i className="fas fa-check"></i> No manual intervention needed</li>
                  <li><i className="fas fa-check"></i> Publicly auditable on-chain</li>
                </ul>
              </div>

              <div className="treasury-card">
                <div className="card-icon">💼</div>
                <h3>Transparent Usage</h3>
                <div className="usage-breakdown">
                  <div className="usage-item">
                    <div className="usage-label">Development (40%)</div>
                    <div className="usage-bar" style={{ width: '40%' }}></div>
                  </div>
                  <div className="usage-item">
                    <div className="usage-label">Operations (30%)</div>
                    <div className="usage-bar" style={{ width: '30%' }}></div>
                  </div>
                  <div className="usage-item">
                    <div className="usage-label">Marketing (20%)</div>
                    <div className="usage-bar" style={{ width: '20%' }}></div>
                  </div>
                  <div className="usage-item">
                    <div className="usage-label">Emergency Reserve (10%)</div>
                    <div className="usage-bar" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>

              <div className="treasury-card">
                <div className="card-icon">📊</div>
                <h3>Real-Time Tracking</h3>
                <p>Monitor treasury health live:</p>
                <div className="tracking-metrics">
                  <div className="metric">
                    <span>Total Remaining</span>
                    <span className="metric-value">On-chain</span>
                  </div>
                  <div className="metric">
                    <span>Next Release Date</span>
                    <span className="metric-value">Automated</span>
                  </div>
                  <div className="metric">
                    <span>Current Multiplier</span>
                    <span className="metric-value">Transparent</span>
                  </div>
                  <div className="metric">
                    <span>Months Remaining</span>
                    <span className="metric-value">Calculated</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="treasury-callout">
              <i className="fas fa-shield-alt"></i>
              <div>
                <strong>Why This Matters:</strong>
                <p>Many projects fail because founders can drain treasuries overnight. Riddlen's TreasuryDrip contract makes this mathematically impossible. The maximum that can ever be withdrawn is 5M RDLN, even in emergencies. This ensures 8+ years of guaranteed funding.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Liquidity Lock */}
        <section className="liquidity-section">
          <div className="container">
            <h2 className="section-title">Locked Liquidity Pool</h2>
            <p className="section-intro">100M RDLN locked for 10 years - impossible to rug pull</p>

            <div className="liquidity-visual">
              <div className="lock-container">
                <div className="lock-icon">🔒</div>
                <div className="lock-details">
                  <h3>100,000,000 RDLN</h3>
                  <p>Time-Locked Until 2035</p>
                </div>
              </div>

              <div className="lock-features">
                <div className="lock-feature">
                  <i className="fas fa-clock"></i>
                  <h4>10-Year Lock Period</h4>
                  <p>Smart contract enforced, no backdoors</p>
                </div>
                <div className="lock-feature">
                  <i className="fas fa-ban"></i>
                  <h4>No Early Withdrawal</h4>
                  <p>Mathematically impossible to access early</p>
                </div>
                <div className="lock-feature">
                  <i className="fas fa-chart-line"></i>
                  <h4>Market Stability</h4>
                  <p>Ensures deep liquidity for trading</p>
                </div>
                <div className="lock-feature">
                  <i className="fas fa-users"></i>
                  <h4>Community Protection</h4>
                  <p>Prevents founder exit scams</p>
                </div>
              </div>
            </div>

            <div className="liquidity-comparison">
              <h3>Riddlen vs Other Projects</h3>
              <div className="comparison-table">
                <div className="comparison-row header">
                  <span>Feature</span>
                  <span>Most Projects</span>
                  <span className="riddlen-col">Riddlen</span>
                </div>
                <div className="comparison-row">
                  <span>Liquidity Lock</span>
                  <span>0-1 years</span>
                  <span className="riddlen-col">10 years</span>
                </div>
                <div className="comparison-row">
                  <span>Treasury Access</span>
                  <span>Unlimited</span>
                  <span className="riddlen-col">5M max</span>
                </div>
                <div className="comparison-row">
                  <span>Founder Pre-mine</span>
                  <span>10-30%</span>
                  <span className="riddlen-col">0%</span>
                </div>
                <div className="comparison-row">
                  <span>Smart Contract</span>
                  <span>Upgradeable</span>
                  <span className="riddlen-col">Time-locked</span>
                </div>
                <div className="comparison-row">
                  <span>Rug Pull Risk</span>
                  <span>High</span>
                  <span className="riddlen-col">Impossible</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deflationary Economics */}
        <section className="deflation-section alt">
          <div className="container">
            <h2 className="section-title">Deflationary Economics</h2>
            <p className="section-intro">How Riddlen becomes more scarce and valuable over time</p>

            <div className="deflation-mechanics">
              <div className="deflation-card">
                <h3>Supply Reduction Model</h3>
                <div className="supply-chart-visual">
                  <div className="year-projection">
                    <span className="year">2025</span>
                    <div className="supply-bar" style={{ width: '90%' }}>900M RDLN</div>
                  </div>
                  <div className="year-projection">
                    <span className="year">2030</span>
                    <div className="supply-bar" style={{ width: '75%' }}>750M RDLN</div>
                  </div>
                  <div className="year-projection">
                    <span className="year">2035</span>
                    <div className="supply-bar" style={{ width: '60%' }}>600M RDLN</div>
                  </div>
                  <div className="year-projection">
                    <span className="year">2040</span>
                    <div className="supply-bar" style={{ width: '45%' }}>450M RDLN</div>
                  </div>
                  <div className="year-projection">
                    <span className="year">2045</span>
                    <div className="supply-bar" style={{ width: '30%' }}>300M RDLN</div>
                  </div>
                </div>
                <p className="chart-note">Projected circulating supply based on average burn rates</p>
              </div>

              <div className="deflation-card">
                <h3>Economic Phases</h3>
                <div className="phase-timeline">
                  <div className="phase-item">
                    <div className="phase-header">
                      <span className="phase-number">Phase 1</span>
                      <span className="phase-years">Years 1-5</span>
                    </div>
                    <h4>Growth Phase</h4>
                    <ul>
                      <li>Prize pools attract participants</li>
                      <li>Moderate burn rates</li>
                      <li>Treasury funds development</li>
                      <li>Building user base</li>
                    </ul>
                  </div>
                  <div className="phase-item">
                    <div className="phase-header">
                      <span className="phase-number">Phase 2</span>
                      <span className="phase-years">Years 6-10</span>
                    </div>
                    <h4>Maturity Phase</h4>
                    <ul>
                      <li>Increasing burn pressure</li>
                      <li>Established user tiers</li>
                      <li>Self-sustaining ecosystem</li>
                      <li>Oracle Network expansion</li>
                    </ul>
                  </div>
                  <div className="phase-item">
                    <div className="phase-header">
                      <span className="phase-number">Phase 3</span>
                      <span className="phase-years">Years 11-15</span>
                    </div>
                    <h4>Optimization Phase</h4>
                    <ul>
                      <li>Advanced difficulty algorithms</li>
                      <li>Cross-chain expansion</li>
                      <li>Mature governance</li>
                      <li>Global adoption</li>
                    </ul>
                  </div>
                  <div className="phase-item">
                    <div className="phase-header">
                      <span className="phase-number">Phase 4</span>
                      <span className="phase-years">Years 16-20</span>
                    </div>
                    <h4>Sustainability Phase</h4>
                    <ul>
                      <li>Burns balance emissions</li>
                      <li>Pure merit-based allocation</li>
                      <li>Decentralized operations</li>
                      <li>Long-term stability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="burn-benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">📈</div>
                <h3>Increasing Scarcity</h3>
                <p>Every transaction permanently removes RDLN from circulation, making remaining tokens more valuable</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">⚖️</div>
                <h3>Balanced Emissions</h3>
                <p>Prize pool emissions decrease over time while burns increase, creating equilibrium</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🛡️</div>
                <h3>Spam Prevention</h3>
                <p>Progressive burn costs discourage low-quality attempts and maintain ecosystem integrity</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">💎</div>
                <h3>Long-Term Value</h3>
                <p>Deflationary pressure rewards long-term holders and active participants</p>
              </div>
            </div>
          </div>
        </section>

        {/* RON Token */}
        <section className="ron-section">
          <div className="container">
            <h2 className="section-title">RON - Reputation Token</h2>
            <p className="section-intro">Soul-bound tokens that represent proven intelligence and unlock ecosystem access</p>

            <div className="ron-features-grid">
              <div className="ron-feature">
                <div className="feature-icon">🔗</div>
                <h3>Soul-Bound Design</h3>
                <p>RON cannot be transferred or traded</p>
                <ul>
                  <li>Permanently tied to earning wallet</li>
                  <li>Cannot be bought with money</li>
                  <li>Represents proven ability</li>
                  <li>Anti-Sybil protection</li>
                </ul>
              </div>

              <div className="ron-feature">
                <div className="feature-icon">🎯</div>
                <h3>Access Tier System</h3>
                <p>RON unlocks higher difficulty riddles and rewards</p>
                <div className="tier-list">
                  <div className="tier-item novice">
                    <span className="tier-name">Novice (0-999)</span>
                    <span>Easy riddles only</span>
                  </div>
                  <div className="tier-item solver">
                    <span className="tier-name">Solver (1K-10K)</span>
                    <span>Easy + Medium riddles</span>
                  </div>
                  <div className="tier-item expert">
                    <span className="tier-name">Expert (10K-100K)</span>
                    <span>Easy + Medium + Hard</span>
                  </div>
                  <div className="tier-item oracle">
                    <span className="tier-name">Oracle (100K+)</span>
                    <span>All riddles + Governance</span>
                  </div>
                </div>
              </div>

              <div className="ron-feature">
                <div className="feature-icon">⚡</div>
                <h3>Earning Mechanisms</h3>
                <p>Multiple ways to earn RON tokens</p>
                <div className="earning-methods">
                  <div className="method">
                    <strong>Riddle Solving:</strong>
                    <span>10-25 RON (Easy) to 1K-10K RON (Legendary)</span>
                  </div>
                  <div className="method">
                    <strong>Oracle Validation:</strong>
                    <span>RON rewards for correct validations</span>
                  </div>
                  <div className="method">
                    <strong>Performance Bonuses:</strong>
                    <span>First solver (5x), Speed (1.5x), Streaks (+100%)</span>
                  </div>
                </div>
              </div>

              <div className="ron-feature">
                <div className="feature-icon">🗳️</div>
                <h3>Governance Power</h3>
                <p>1 RON = 1 Vote in DAO decisions</p>
                <ul>
                  <li>Merit-based voting power</li>
                  <li>Cannot buy governance influence</li>
                  <li>Progressive proposal thresholds</li>
                  <li>Era-based quorum requirements</li>
                </ul>
              </div>
            </div>

            <div className="ron-utility-matrix">
              <h3>RON Utility Matrix</h3>
              <div className="utility-table">
                <div className="utility-row header">
                  <span>Use Case</span>
                  <span>RON Requirement</span>
                  <span>Benefit</span>
                  <span>Economic Value</span>
                </div>
                <div className="utility-row">
                  <span>Hard Riddles</span>
                  <span>10,000+ RON</span>
                  <span>Higher prizes</span>
                  <span>RDLN earning access</span>
                </div>
                <div className="utility-row">
                  <span>Oracle Work</span>
                  <span>1,000+ RON</span>
                  <span>RDLN income</span>
                  <span>Direct monetization</span>
                </div>
                <div className="utility-row">
                  <span>Governance</span>
                  <span>100,000+ RON</span>
                  <span>Protocol control</span>
                  <span>Indirect value</span>
                </div>
                <div className="utility-row">
                  <span>Legendary Access</span>
                  <span>100,000+ RON</span>
                  <span>Massive prizes</span>
                  <span>Exclusive opportunity</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Economic Sustainability */}
        <section className="sustainability-section alt">
          <div className="container">
            <h2 className="section-title">Long-Term Sustainability Model</h2>
            <p className="section-intro">How Riddlen maintains economic health for 20+ years</p>

            <div className="sustainability-grid">
              <div className="sustainability-card">
                <h3>Burn Rate vs Prize Distribution</h3>
                <p>Natural economic pressure creates balance:</p>
                <div className="balance-phases">
                  <div className="balance-phase">
                    <strong>Early Adopters:</strong>
                    <p>Low burn costs, high prize pools</p>
                  </div>
                  <div className="balance-phase">
                    <strong>Mass Adoption:</strong>
                    <p>Increasing burn rates offset prize payouts</p>
                  </div>
                  <div className="balance-phase">
                    <strong>Mature Economy:</strong>
                    <p>Burns exceed new token creation</p>
                  </div>
                </div>
              </div>

              <div className="sustainability-card">
                <h3>Biennial Halving Events</h3>
                <p>Every 2 years, costs reduce by 50%:</p>
                <ul>
                  <li>Maintains accessibility for new users</li>
                  <li>Prevents excessive deflationary pressure</li>
                  <li>Aligns with prize pool depletion</li>
                  <li>Creates predictable economics</li>
                </ul>
                <div className="halving-timeline">
                  <div className="halving-event">2025-2027: 1000 RDLN</div>
                  <div className="halving-event">2027-2029: 500 RDLN</div>
                  <div className="halving-event">2029-2031: 250 RDLN</div>
                  <div className="halving-event">2031+: Continued halving...</div>
                </div>
              </div>

              <div className="sustainability-card">
                <h3>Risk Mitigation</h3>
                <div className="risk-grid">
                  <div className="risk-item">
                    <strong>Inflation Control:</strong>
                    <p>Progressive burns, finite prize pools, capped treasury</p>
                  </div>
                  <div className="risk-item">
                    <strong>Deflation Control:</strong>
                    <p>Biennial halving, new user incentives</p>
                  </div>
                  <div className="risk-item">
                    <strong>Economic Attacks:</strong>
                    <p>Soul-bound RON, progressive costs, multi-sig controls</p>
                  </div>
                </div>
              </div>

              <div className="sustainability-card">
                <h3>Revenue Diversification</h3>
                <p>Multiple income streams for protocol:</p>
                <ul>
                  <li>25% of all transaction burns</li>
                  <li>10% Oracle Network fees</li>
                  <li>50% of slashed validator stakes</li>
                  <li>Grand Prize event partnerships</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-box">
              <h2>Built on Transparent Economics</h2>
              <p>No hidden allocations. No founder pre-mine. No rug pull risk. Just pure, merit-based token distribution.</p>
              <div className="cta-buttons">
                <a href="/quick-start" className="btn-cta-primary">
                  <i className="fas fa-rocket"></i> Start Earning RDLN
                </a>
                <a href="/airdrop-guide" className="btn-cta-secondary">
                  <i className="fas fa-gift"></i> Join 100M Airdrop
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
          background: linear-gradient(45deg, #FFD700, #ffffff, #8A2BE2);
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

        .hero-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .hero-stat {
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
          padding: 2rem 1rem;
        }

        .stat-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #FFD700;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #cccccc;
          font-size: 0.9rem;
        }

        .supply-section {
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

        .supply-visualization {
          max-width: 1000px;
          margin: 0 auto 4rem;
        }

        .supply-chart {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
          padding: 2rem;
        }

        .chart-bar {
          padding: 1.5rem;
          margin-bottom: 1rem;
          border-radius: 10px;
          position: relative;
          overflow: hidden;
        }

        .chart-bar.riddles {
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.2));
          border: 2px solid rgba(255, 215, 0, 0.5);
        }

        .chart-bar.treasury {
          background: linear-gradient(90deg, rgba(138, 43, 226, 0.3), rgba(148, 0, 211, 0.2));
          border: 2px solid rgba(138, 43, 226, 0.5);
        }

        .chart-bar.airdrop {
          background: linear-gradient(90deg, rgba(0, 255, 127, 0.3), rgba(0, 200, 100, 0.2));
          border: 2px solid rgba(0, 255, 127, 0.5);
        }

        .chart-bar.liquidity {
          background: linear-gradient(90deg, rgba(64, 224, 208, 0.3), rgba(32, 178, 170, 0.2));
          border: 2px solid rgba(64, 224, 208, 0.5);
        }

        .bar-label {
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .bar-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #FFD700;
        }

        .allocation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .allocation-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .allocation-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .allocation-card h3 {
          color: #FFD700;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .allocation-card p {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        .allocation-card ul {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0;
        }

        .allocation-card ul li {
          color: #9370DB;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .allocation-card ul li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: #FFD700;
        }

        .allocation-note {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 215, 0, 0.2);
          color: #FFA500;
          font-style: italic;
          font-size: 0.95rem;
        }

        .burn-section {
          padding: 5rem 0;
        }

        .alt {
          background: rgba(0, 0, 0, 0.2);
        }

        .burn-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-bottom: 4rem;
        }

        .burn-step {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
          padding: 2rem;
          flex: 1;
          min-width: 180px;
          max-width: 220px;
          text-align: center;
        }

        .step-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .burn-step h3 {
          color: #FFD700;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .burn-step p {
          color: #cccccc;
          font-size: 0.9rem;
        }

        .burn-arrow {
          color: #FFD700;
          font-size: 2rem;
          font-weight: 700;
        }

        .burn-mechanics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .burn-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .burn-card h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .burn-card > p {
          color: #cccccc;
          margin-bottom: 2rem;
        }

        .burn-examples {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .burn-example strong {
          color: #9370DB;
          display: block;
          margin-bottom: 1rem;
        }

        .attempt-list {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
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

        .burn-amount {
          color: #FFD700;
          font-weight: 700;
        }

        .halving-schedule {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
        }

        .halving-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent);
          border-left: 3px solid #FFD700;
          border-radius: 5px;
        }

        .halving-row.fade {
          opacity: 0.6;
        }

        .year-range {
          color: #9370DB;
          font-weight: 600;
        }

        .burn-cost {
          color: #FFD700;
          font-weight: 700;
        }

        .halving-note {
          margin-top: 1rem;
          color: #FFA500;
          font-style: italic;
          text-align: center;
        }

        .grand-prize-section {
          padding: 5rem 0;
        }

        .grand-prize-visual {
          max-width: 1200px;
          margin: 0 auto;
        }

        .prize-accumulation {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 4rem;
        }

        .prize-vault {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
          border: 3px solid rgba(255, 215, 0, 0.5);
          border-radius: 25px;
          padding: 3rem;
          text-align: center;
          margin-bottom: 2rem;
          min-width: 300px;
        }

        .vault-icon {
          font-size: 5rem;
          margin-bottom: 1rem;
        }

        .vault-title {
          font-size: 2rem;
          font-weight: 700;
          color: #FFD700;
          margin-bottom: 0.5rem;
        }

        .vault-accumulation {
          color: #9370DB;
          font-size: 1.2rem;
        }

        .accumulation-sources {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .source-item {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 10px;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #cccccc;
        }

        .source-item i {
          color: #FF6347;
        }

        .prize-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .prize-feature {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .prize-feature h3 {
          color: #FFD700;
          margin-bottom: 1rem;
        }

        .prize-feature p {
          color: #cccccc;
          margin-bottom: 0.5rem;
        }

        .prize-projection-box {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
          margin-top: 3rem;
        }

        .prize-projection-box h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .projection-table {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          overflow: hidden;
        }

        .projection-row {
          display: grid;
          grid-template-columns: 1fr 2fr 2fr 2fr;
          gap: 1rem;
          padding: 1rem;
          align-items: center;
        }

        .projection-row.header {
          background: rgba(255, 215, 0, 0.2);
          color: #FFD700;
          font-weight: 700;
        }

        .projection-row:not(.header) {
          color: #cccccc;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .projection-row.highlight {
          background: rgba(255, 215, 0, 0.1);
          color: #FFD700;
          font-weight: 700;
        }

        .projection-note {
          margin-top: 1rem;
          color: #9370DB;
          font-style: italic;
          text-align: center;
        }

        .treasury-section {
          padding: 5rem 0;
        }

        .treasury-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .treasury-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(138, 43, 226, 0.5);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .treasury-card h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }

        .drip-details {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1.5rem;
        }

        .drip-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .drip-row:last-child {
          border-bottom: none;
        }

        .drip-row span:first-child {
          color: #9370DB;
        }

        .drip-row .value {
          color: #FFD700;
          font-weight: 700;
        }

        .protection-list {
          list-style: none;
          padding: 0;
        }

        .protection-list li {
          color: #cccccc;
          padding: 0.75rem 0;
          padding-left: 2rem;
          position: relative;
        }

        .protection-list li i {
          position: absolute;
          left: 0;
          color: #00FF7F;
        }

        .usage-breakdown {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1.5rem;
        }

        .usage-item {
          margin-bottom: 1rem;
        }

        .usage-label {
          color: #9370DB;
          margin-bottom: 0.5rem;
          display: block;
        }

        .usage-bar {
          height: 25px;
          background: linear-gradient(90deg, #FFD700, #FFA500);
          border-radius: 12px;
        }

        .tracking-metrics {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1.5rem;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .metric:last-child {
          border-bottom: none;
        }

        .metric span:first-child {
          color: #9370DB;
        }

        .metric-value {
          color: #FFD700;
          font-weight: 700;
        }

        .treasury-callout {
          background: rgba(138, 43, 226, 0.15);
          border: 2px solid rgba(138, 43, 226, 0.4);
          border-radius: 15px;
          padding: 2rem;
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .treasury-callout i {
          color: #FFD700;
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .treasury-callout strong {
          color: #FFD700;
          display: block;
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }

        .treasury-callout p {
          color: #cccccc;
          margin: 0;
        }

        .liquidity-section {
          padding: 5rem 0;
        }

        .liquidity-visual {
          max-width: 900px;
          margin: 0 auto;
        }

        .lock-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
          border: 3px solid rgba(255, 215, 0, 0.5);
          border-radius: 25px;
          padding: 3rem;
          margin-bottom: 3rem;
        }

        .lock-icon {
          font-size: 5rem;
        }

        .lock-details h3 {
          color: #FFD700;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .lock-details p {
          color: #9370DB;
          font-size: 1.3rem;
        }

        .lock-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .lock-feature {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
        }

        .lock-feature i {
          font-size: 2.5rem;
          color: #FFD700;
          margin-bottom: 1rem;
        }

        .lock-feature h4 {
          color: #FFD700;
          margin-bottom: 0.75rem;
        }

        .lock-feature p {
          color: #cccccc;
          font-size: 0.95rem;
        }

        .liquidity-comparison {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .liquidity-comparison h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .comparison-table {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          overflow: hidden;
        }

        .comparison-row {
          display: grid;
          grid-template-columns: 2fr 2fr 2fr;
          gap: 1rem;
          padding: 1rem;
          align-items: center;
        }

        .comparison-row.header {
          background: rgba(255, 215, 0, 0.2);
          color: #FFD700;
          font-weight: 700;
        }

        .comparison-row:not(.header) {
          color: #cccccc;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .riddlen-col {
          color: #00FF7F;
          font-weight: 700;
        }

        .deflation-section {
          padding: 5rem 0;
        }

        .deflation-mechanics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .deflation-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .deflation-card h3 {
          color: #FFD700;
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        .supply-chart-visual {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1.5rem;
        }

        .year-projection {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
        }

        .year {
          color: #9370DB;
          font-weight: 700;
        }

        .supply-bar {
          height: 35px;
          background: linear-gradient(90deg, #FFD700, #FFA500);
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 1rem;
          color: #000;
          font-weight: 700;
        }

        .chart-note {
          margin-top: 1rem;
          color: #9370DB;
          font-style: italic;
          font-size: 0.9rem;
        }

        .phase-timeline {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .phase-item {
          background: rgba(0, 0, 0, 0.3);
          border-left: 4px solid #FFD700;
          border-radius: 10px;
          padding: 1.5rem;
        }

        .phase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .phase-number {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-weight: 700;
        }

        .phase-years {
          color: #9370DB;
          font-weight: 600;
        }

        .phase-item h4 {
          color: #FFD700;
          margin-bottom: 1rem;
        }

        .phase-item ul {
          list-style: none;
          padding: 0;
        }

        .phase-item ul li {
          color: #cccccc;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .phase-item ul li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #FFD700;
        }

        .burn-benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .benefit-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
        }

        .benefit-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .benefit-card h3 {
          color: #FFD700;
          margin-bottom: 1rem;
        }

        .benefit-card p {
          color: #cccccc;
        }

        .ron-section {
          padding: 5rem 0;
        }

        .ron-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .ron-feature {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(138, 43, 226, 0.5);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .ron-feature h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .ron-feature > p {
          color: #cccccc;
          margin-bottom: 1.5rem;
        }

        .ron-feature ul {
          list-style: none;
          padding: 0;
        }

        .ron-feature ul li {
          color: #9370DB;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .ron-feature ul li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #00FF7F;
        }

        .tier-list {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
        }

        .tier-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border-radius: 5px;
        }

        .tier-item.novice {
          background: rgba(124, 252, 0, 0.1);
          border-left: 3px solid #7CFC00;
        }

        .tier-item.solver {
          background: rgba(138, 43, 226, 0.1);
          border-left: 3px solid #8A2BE2;
        }

        .tier-item.expert {
          background: rgba(255, 215, 0, 0.1);
          border-left: 3px solid #FFD700;
        }

        .tier-item.oracle {
          background: rgba(255, 105, 180, 0.1);
          border-left: 3px solid #FF69B4;
        }

        .tier-name {
          color: #FFD700;
          font-weight: 700;
        }

        .tier-item span:last-child {
          color: #cccccc;
          font-size: 0.9rem;
        }

        .earning-methods {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1.5rem;
        }

        .method {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .method:last-child {
          border-bottom: none;
        }

        .method strong {
          color: #9370DB;
        }

        .method span {
          color: #cccccc;
          font-size: 0.95rem;
        }

        .ron-utility-matrix {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .ron-utility-matrix h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .utility-table {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          overflow: hidden;
        }

        .utility-row {
          display: grid;
          grid-template-columns: 1.5fr 1.5fr 1.5fr 2fr;
          gap: 1rem;
          padding: 1rem;
          align-items: center;
        }

        .utility-row.header {
          background: rgba(255, 215, 0, 0.2);
          color: #FFD700;
          font-weight: 700;
        }

        .utility-row:not(.header) {
          color: #cccccc;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .sustainability-section {
          padding: 5rem 0;
        }

        .sustainability-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .sustainability-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .sustainability-card h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .sustainability-card > p {
          color: #cccccc;
          margin-bottom: 1.5rem;
        }

        .sustainability-card ul {
          list-style: none;
          padding: 0;
        }

        .sustainability-card ul li {
          color: #9370DB;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .sustainability-card ul li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: #FFD700;
        }

        .balance-phases {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .balance-phase {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
        }

        .balance-phase strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.5rem;
        }

        .balance-phase p {
          color: #cccccc;
          margin: 0;
        }

        .halving-timeline {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .halving-event {
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent);
          border-left: 3px solid #FFD700;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border-radius: 5px;
          color: #cccccc;
        }

        .risk-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .risk-item {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
        }

        .risk-item strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.5rem;
        }

        .risk-item p {
          color: #cccccc;
          margin: 0;
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

          .hero-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .supply-chart {
            padding: 1rem;
          }

          .chart-bar {
            width: 100% !important;
          }

          .allocation-grid {
            grid-template-columns: 1fr;
          }

          .burn-flow {
            flex-direction: column;
          }

          .burn-arrow {
            transform: rotate(90deg);
          }

          .burn-mechanics-grid {
            grid-template-columns: 1fr;
          }

          .projection-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .treasury-grid {
            grid-template-columns: 1fr;
          }

          .comparison-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .utility-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}
