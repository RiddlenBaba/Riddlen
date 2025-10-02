import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';

export default function DaoGuide() {
  return (
    <>
      <Head>
        <title>Riddlen DAO Governance - Merit-Based Decentralization</title>
        <meta name="description" content="Complete guide to Riddlen's DAO governance with 1 RON = 1 vote, progressive decentralization, transferable Founder Role, and era-based economics." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">🏛️</div>
        <div className="floating-riddle">🗳️</div>
        <div className="floating-riddle">💎</div>
      </div>

      <Header currentPage="docs" />

      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <h1 className="page-title">Govern Through Merit</h1>
            <p className="page-subtitle">Riddlen's revolutionary DAO governance: 1 RON = 1 vote, soul-bound tokens prevent vote buying, and progressive decentralization ensures a smooth path to community control.</p>

            <div className="hero-badge">
              <div className="badge-icon">🏛️</div>
              <div className="badge-content">
                <div className="badge-title">Merit-Based Governance</div>
                <div className="badge-value">1 RON = 1 Vote</div>
                <div className="badge-subtitle">Earned only, never bought. True democratic power.</div>
              </div>
            </div>
          </div>
        </section>

        {/* RON Voting Power */}
        <section className="voting-power-section">
          <div className="container">
            <h2 className="section-title">1 RON = 1 Vote</h2>
            <p className="section-intro">Voting power based on reputation, not wealth</p>

            <div className="voting-grid">
              <div className="voting-card">
                <h3>Why RON for Voting?</h3>
                <div className="reason-list">
                  <div className="reason-item">
                    <div className="reason-icon">🔗</div>
                    <div className="reason-content">
                      <strong>Soul-Bound Design</strong>
                      <p>Cannot be transferred or traded - prevents vote buying</p>
                    </div>
                  </div>
                  <div className="reason-item">
                    <div className="reason-icon">💪</div>
                    <div className="reason-content">
                      <strong>Earned Only</strong>
                      <p>Acquired through solving riddles, validation work, curation</p>
                    </div>
                  </div>
                  <div className="reason-item">
                    <div className="reason-icon">⚖️</div>
                    <div className="reason-content">
                      <strong>Proportional Power</strong>
                      <p>More contribution = more reputation = more voting power</p>
                    </div>
                  </div>
                  <div className="reason-item">
                    <div className="reason-icon">✅</div>
                    <div className="reason-content">
                      <strong>Fair Distribution</strong>
                      <p>No founder pre-mine, no insider allocations</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="voting-card">
                <h3>How to Earn RON</h3>
                <div className="earning-methods">
                  <div className="method-item">
                    <div className="method-number">1</div>
                    <div className="method-details">
                      <strong>Solve Riddles</strong>
                      <p>10-25 RON (Easy) to 1K-10K RON (Legendary)</p>
                    </div>
                  </div>
                  <div className="method-item">
                    <div className="method-number">2</div>
                    <div className="method-details">
                      <strong>Validate Data</strong>
                      <p>Earn RON through Oracle Network validation work</p>
                    </div>
                  </div>
                  <div className="method-item">
                    <div className="method-number">3</div>
                    <div className="method-details">
                      <strong>Curate Content</strong>
                      <p>Earn RON for quality curation contributions</p>
                    </div>
                  </div>
                  <div className="method-item">
                    <div className="method-number">4</div>
                    <div className="method-details">
                      <strong>Ecosystem Participation</strong>
                      <p>Contribute to protocol development and growth</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="voting-example-box">
              <h3>Your Voting Power</h3>
              <div className="example-scenario">
                <div className="scenario-item">
                  <span className="scenario-label">If you have 5,000 RON</span>
                  <span className="scenario-arrow">→</span>
                  <span className="scenario-result">5,000 votes</span>
                </div>
                <div className="scenario-item">
                  <span className="scenario-label">If you have 25,000 RON</span>
                  <span className="scenario-arrow">→</span>
                  <span className="scenario-result">25,000 votes</span>
                </div>
                <div className="scenario-item highlight">
                  <span className="scenario-label">If you have 100,000 RON</span>
                  <span className="scenario-arrow">→</span>
                  <span className="scenario-result">100,000 votes (Oracle tier)</span>
                </div>
              </div>
              <p className="example-note">Your voting power directly reflects your contribution to the ecosystem</p>
            </div>
          </div>
        </section>

        {/* Three Phases */}
        <section className="phases-section alt">
          <div className="container">
            <h2 className="section-title">The Transferable Founder Role</h2>
            <p className="section-intro">Progressive decentralization through three distinct phases</p>

            <div className="phases-timeline">
              <div className="phase-card phase-1">
                <div className="phase-header">
                  <div className="phase-badge">Phase 1</div>
                  <h3>Builder Control</h3>
                  <div className="phase-duration">Launch Period</div>
                </div>
                <div className="phase-content">
                  <p className="phase-description">Founder has full executive powers for rapid development</p>

                  <div className="powers-section">
                    <h4>Founder Powers:</h4>
                    <ul className="powers-list">
                      <li><i className="fas fa-check"></i> Execute decisions instantly (no DAO vote needed)</li>
                      <li><i className="fas fa-check"></i> Veto any DAO proposal</li>
                      <li><i className="fas fa-check"></i> Emergency pause/unpause</li>
                      <li><i className="fas fa-check"></i> Update protocol parameters</li>
                      <li><i className="fas fa-check"></i> Upgrade contracts</li>
                      <li><i className="fas fa-check"></i> Control treasury spending</li>
                    </ul>
                  </div>

                  <div className="community-role">
                    <h4>Community Role:</h4>
                    <ul className="role-list">
                      <li>Can propose via DAO (advisory only)</li>
                      <li>Can vote (founder sees preferences)</li>
                      <li>Cannot execute (founder has final say)</li>
                      <li>Learning governance processes</li>
                    </ul>
                  </div>

                  <div className="phase-duration-note">
                    <strong>Duration:</strong> As long as needed to prove product-market fit
                  </div>
                </div>
              </div>

              <div className="phase-card phase-2">
                <div className="phase-header">
                  <div className="phase-badge">Phase 2</div>
                  <h3>Shared Governance</h3>
                  <div className="phase-duration">Transition Period</div>
                </div>
                <div className="phase-content">
                  <p className="phase-description">Founder transfers role to DAO contract for community control</p>

                  <div className="transition-details">
                    <h4>How Transition Works:</h4>
                    <div className="transition-steps">
                      <div className="transition-step">
                        <i className="fas fa-arrow-right"></i>
                        <p>Community proposes and votes on all decisions</p>
                      </div>
                      <div className="transition-step">
                        <i className="fas fa-arrow-right"></i>
                        <p>Founder role now belongs to DAO itself</p>
                      </div>
                      <div className="transition-step">
                        <i className="fas fa-arrow-right"></i>
                        <p>Proposals execute via normal governance</p>
                      </div>
                      <div className="transition-step">
                        <i className="fas fa-arrow-right"></i>
                        <p>No more veto power - true democracy</p>
                      </div>
                    </div>
                  </div>

                  <div className="code-example">
                    <code>await dao.transferFounderRoleToDAO();</code>
                    <p>// Now DAO has "founder powers" via proposals</p>
                  </div>

                  <div className="alternative-option">
                    <strong>Alternative:</strong> Transfer to trusted person or multisig
                    <code>await dao.transferFounderRole(trustedAddress);</code>
                  </div>

                  <div className="phase-duration-note">
                    <strong>When:</strong> After 12-18 months of proven community governance maturity
                  </div>
                </div>
              </div>

              <div className="phase-card phase-3">
                <div className="phase-header">
                  <div className="phase-badge">Phase 3</div>
                  <h3>Full Decentralization</h3>
                  <div className="phase-duration">Final Form</div>
                </div>
                <div className="phase-content">
                  <p className="phase-description">Founder role dissolved permanently - complete community ownership</p>

                  <div className="dissolution-details">
                    <h4>Role Dissolution:</h4>
                    <ul className="dissolution-list">
                      <li><i className="fas fa-times-circle"></i> Role ceases to exist (irreversible)</li>
                      <li><i className="fas fa-check-circle"></i> DAO fully controls all protocol functions</li>
                      <li><i className="fas fa-check-circle"></i> Complete community ownership</li>
                      <li><i className="fas fa-check-circle"></i> Cleaner code (role logic removed)</li>
                    </ul>
                  </div>

                  <div className="code-example">
                    <code>await dao.dissolveFounderRole();</code>
                    <p>// This is IRREVERSIBLE - permanent decentralization</p>
                  </div>

                  <div className="requirements-box">
                    <h4>Requirements:</h4>
                    <ul>
                      <li>Minimum 365 days since deployment</li>
                      <li>Cannot be undone</li>
                      <li>Founder becomes regular RON holder</li>
                    </ul>
                  </div>

                  <div className="phase-duration-note">
                    <strong>Timeline:</strong> Year 3+ (when community is ready)
                  </div>
                </div>
              </div>
            </div>

            <div className="founder-callout">
              <i className="fas fa-crown"></i>
              <div>
                <strong>The Elegant Solution:</strong>
                <p>Instead of pre-mining governance tokens, Riddlen uses a smart contract ROLE that can be transferred to the DAO or dissolved. This separates power (role) from reputation (tokens), ensuring fair token distribution while maintaining necessary early-stage control.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Era-Based Economics */}
        <section className="era-section">
          <div className="container">
            <h2 className="section-title">Era-Based Economics</h2>
            <p className="section-intro">Biennial halving progressively lowers barriers to participation</p>

            <div className="era-grid">
              <div className="era-card">
                <h3>Proposal Threshold Halving</h3>
                <p>Cost to create a proposal decreases every 730 days (2 years)</p>

                <div className="era-table">
                  <div className="era-row header">
                    <span>Era</span>
                    <span>Time Period</span>
                    <span>RON Required</span>
                    <span>Target Users</span>
                  </div>
                  <div className="era-row">
                    <span className="era-number">Era 0</span>
                    <span>Launch - Year 2</span>
                    <span className="ron-amount">10,000 RON</span>
                    <span>Early builders</span>
                  </div>
                  <div className="era-row">
                    <span className="era-number">Era 1</span>
                    <span>Year 2 - Year 4</span>
                    <span className="ron-amount">5,000 RON</span>
                    <span>Active participants</span>
                  </div>
                  <div className="era-row">
                    <span className="era-number">Era 2</span>
                    <span>Year 4 - Year 6</span>
                    <span className="ron-amount">2,500 RON</span>
                    <span>Regular users</span>
                  </div>
                  <div className="era-row highlight">
                    <span className="era-number">Era 3</span>
                    <span>Year 6+</span>
                    <span className="ron-amount">1,250 RON</span>
                    <span>Broader community</span>
                  </div>
                </div>

                <div className="era-rationale">
                  <strong>Why Decreasing?</strong>
                  <ul>
                    <li>Early: High threshold filters for serious proposals</li>
                    <li>Middle: Moderate threshold allows proven contributors</li>
                    <li>Mature: Low threshold enables broad participation</li>
                  </ul>
                </div>
              </div>

              <div className="era-card">
                <h3>Progressive Quorum</h3>
                <p>Quorum increases over time to ensure participation</p>

                <div className="quorum-table">
                  <div className="quorum-row header">
                    <span>Era</span>
                    <span>Quorum Required</span>
                    <span>Rationale</span>
                  </div>
                  <div className="quorum-row">
                    <span className="era-number">Era 0</span>
                    <span className="quorum-percent">5% of total RON</span>
                    <span>Easy at launch (small supply)</span>
                  </div>
                  <div className="quorum-row">
                    <span className="era-number">Era 1</span>
                    <span className="quorum-percent">6% of total RON</span>
                    <span>Growing participation</span>
                  </div>
                  <div className="quorum-row">
                    <span className="era-number">Era 2</span>
                    <span className="quorum-percent">7% of total RON</span>
                    <span>Mature ecosystem</span>
                  </div>
                  <div className="quorum-row">
                    <span className="era-number">Era 3</span>
                    <span className="quorum-percent">8% of total RON</span>
                    <span>High engagement expected</span>
                  </div>
                  <div className="quorum-row max">
                    <span className="era-number">Maximum</span>
                    <span className="quorum-percent">15% cap</span>
                    <span>Prevents impossible thresholds</span>
                  </div>
                </div>

                <div className="quorum-formula">
                  <strong>Formula:</strong>
                  <p>Quorum starts at 5% and increases 1% per era, capped at 15%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proposal & Voting Process */}
        <section className="proposal-process-section alt">
          <div className="container">
            <h2 className="section-title">Proposal & Voting Process</h2>
            <p className="section-intro">From proposal creation to execution - the complete governance lifecycle</p>

            <div className="process-timeline">
              <div className="process-step">
                <div className="step-number">Step 1</div>
                <div className="step-content">
                  <h3>Create a Proposal</h3>
                  <div className="step-details">
                    <strong>Requirements:</strong>
                    <ul>
                      <li>Have minimum RON balance (era-based threshold)</li>
                      <li>Prepare proposal details</li>
                      <li>Optional: Discuss in community forums first</li>
                    </ul>
                    <div className="code-block">
                      <code>const tx = await dao.propose(</code>
                      <code>  [targetContract],</code>
                      <code>  [0],</code>
                      <code>  [encodedFunctionData],</code>
                      <code>  "Proposal: Increase oracle validator rewards by 10%"</code>
                      <code>);</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="process-step">
                <div className="step-number">Step 2</div>
                <div className="step-content">
                  <h3>Voting Delay</h3>
                  <div className="step-details">
                    <p><strong>1-day delay before voting begins</strong> (7,200 blocks @ 12s)</p>
                    <ul>
                      <li>Prevents surprise proposals</li>
                      <li>Gives community time to review</li>
                      <li>Snapshot taken for voting power</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="process-step">
                <div className="step-number">Step 3</div>
                <div className="step-content">
                  <h3>Voting Period</h3>
                  <div className="step-details">
                    <p><strong>1-week voting period</strong> (50,400 blocks)</p>
                    <ul>
                      <li>Users cast votes: FOR, AGAINST, or ABSTAIN</li>
                      <li>Voting power = RON balance at snapshot block</li>
                      <li>Can delegate voting power to another address</li>
                    </ul>
                    <div className="code-block">
                      <code>await dao.castVote(proposalId, 1); // 0=Against, 1=For, 2=Abstain</code>
                      <code>// Or vote with reason:</code>
                      <code>await dao.castVoteWithReason(proposalId, 1, "This improves validator incentives");</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="process-step">
                <div className="step-number">Step 4</div>
                <div className="step-content">
                  <h3>Quorum & Threshold Check</h3>
                  <div className="step-details">
                    <p><strong>Proposal passes if:</strong></p>
                    <ul>
                      <li>Quorum reached (era-based %)</li>
                      <li>More FOR than AGAINST votes</li>
                      <li>No founder veto (Phase 1 only)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="process-step">
                <div className="step-number">Step 5</div>
                <div className="step-content">
                  <h3>Timelock (48 Hours)</h3>
                  <div className="step-details">
                    <p><strong>After passing, 48-hour delay before execution</strong></p>
                    <ul>
                      <li>Allows community to review</li>
                      <li>Time to react to malicious proposals</li>
                      <li>Can be vetoed in Phase 1</li>
                      <li>Industry best practice</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="process-step">
                <div className="step-number">Step 6</div>
                <div className="step-content">
                  <h3>Execution</h3>
                  <div className="step-details">
                    <p><strong>Proposal executes automatically</strong> (if founder role inactive)</p>
                    <div className="code-block">
                      <code>await dao.execute(</code>
                      <code>  [targetContract],</code>
                      <code>  [0],</code>
                      <code>  [encodedFunctionData],</code>
                      <code>  descriptionHash</code>
                      <code>);</code>
                    </div>
                    <p className="timeline-note">Total timeline: ~9 days (1 day delay + 7 days voting + 2 days timelock)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Governance Scenarios */}
        <section className="scenarios-section">
          <div className="container">
            <h2 className="section-title">Governance Scenarios</h2>
            <p className="section-intro">Real examples of how governance works in each phase</p>

            <div className="scenarios-grid">
              <div className="scenario-card">
                <div className="scenario-header">
                  <h3>Scenario 1: Phase 1 (Founder Active)</h3>
                </div>
                <div className="scenario-content">
                  <div className="scenario-proposal">
                    <strong>Community Proposes:</strong>
                    <p>"Add new riddle category: Science"</p>
                  </div>
                  <div className="scenario-vote">
                    <strong>Community Votes:</strong>
                    <p>80% FOR (1M RON voted)</p>
                  </div>
                  <div className="scenario-status">
                    <strong>Status:</strong>
                    <p>Succeeded (advisory only)</p>
                  </div>
                  <div className="scenario-options">
                    <strong>Founder Options:</strong>
                    <ol>
                      <li><strong>Execute it:</strong> Shows responsiveness, builds trust</li>
                      <li><strong>Veto it:</strong> With public reason if problematic</li>
                      <li><strong>Ignore it:</strong> Proposal expires</li>
                    </ol>
                  </div>
                  <div className="scenario-outcome">
                    <i className="fas fa-lightbulb"></i>
                    <p>If founder executes, community trust increases. This demonstrates listening to the community.</p>
                  </div>
                </div>
              </div>

              <div className="scenario-card highlight">
                <div className="scenario-header">
                  <h3>Scenario 2: Phase 2 (Role Transferred to DAO)</h3>
                </div>
                <div className="scenario-content">
                  <div className="scenario-proposal">
                    <strong>Community Proposes:</strong>
                    <p>"Increase oracle fee to 12%"</p>
                  </div>
                  <div className="scenario-vote">
                    <strong>Community Votes:</strong>
                    <p>65% FOR (2M RON voted)</p>
                  </div>
                  <div className="scenario-status">
                    <strong>Status:</strong>
                    <p>Succeeded</p>
                  </div>
                  <div className="scenario-execution">
                    <strong>What Happens:</strong>
                    <ul>
                      <li><i className="fas fa-check"></i> Quorum reached</li>
                      <li><i className="fas fa-check"></i> Majority FOR</li>
                      <li><i className="fas fa-check"></i> Goes into 48h timelock</li>
                      <li><i className="fas fa-check"></i> Executes automatically</li>
                      <li><i className="fas fa-times"></i> No founder veto possible (DAO has role)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="scenario-card">
                <div className="scenario-header">
                  <h3>Scenario 3: Phase 3 (Role Dissolved)</h3>
                </div>
                <div className="scenario-content">
                  <div className="scenario-proposal">
                    <strong>Community Proposes:</strong>
                    <p>"Allocate 100K RDLN to marketing"</p>
                  </div>
                  <div className="scenario-vote">
                    <strong>Community Votes:</strong>
                    <p>55% FOR (3M RON voted)</p>
                  </div>
                  <div className="scenario-status">
                    <strong>Status:</strong>
                    <p>Succeeded</p>
                  </div>
                  <div className="scenario-execution">
                    <strong>What Happens:</strong>
                    <ul>
                      <li>Exactly like Scenario 2</li>
                      <li>But founder role doesn't exist anymore</li>
                      <li>Pure DAO governance</li>
                      <li>Cleaner code</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Participate */}
        <section className="participation-section alt">
          <div className="container">
            <h2 className="section-title">How to Participate in Governance</h2>
            <p className="section-intro">Your guide to becoming an active DAO member</p>

            <div className="participation-grid">
              <div className="participation-card">
                <div className="card-icon">🪙</div>
                <h3>As a Token Holder</h3>

                <div className="participation-steps">
                  <div className="p-step">
                    <div className="p-step-number">1</div>
                    <div className="p-step-content">
                      <strong>Earn RON</strong>
                      <p>Solve riddles, validate data, participate in ecosystem</p>
                    </div>
                  </div>
                  <div className="p-step">
                    <div className="p-step-number">2</div>
                    <div className="p-step-content">
                      <strong>Stay Informed</strong>
                      <p>Join Telegram community, follow forum discussions, review proposals</p>
                    </div>
                  </div>
                  <div className="p-step">
                    <div className="p-step-number">3</div>
                    <div className="p-step-content">
                      <strong>Vote on Proposals</strong>
                      <div className="code-snippet">
                        <code>await dao.castVoteWithReason(proposalId, 1, "I support this because...");</code>
                      </div>
                    </div>
                  </div>
                  <div className="p-step">
                    <div className="p-step-number">4</div>
                    <div className="p-step-content">
                      <strong>Delegate (Optional)</strong>
                      <div className="code-snippet">
                        <code>await ron.delegate(trustedDelegateAddress);</code>
                        <code>// They vote with your power, you keep your tokens</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="participation-card">
                <div className="card-icon">📝</div>
                <h3>As a Proposal Creator</h3>

                <div className="creator-requirements">
                  <strong>Requirements:</strong>
                  <ul>
                    <li>Minimum RON balance (era-based)</li>
                    <li>Clear proposal description</li>
                    <li>Understanding of impact</li>
                  </ul>
                </div>

                <div className="best-practices">
                  <strong>Best Practices:</strong>
                  <div className="practice-list">
                    <div className="practice-item">
                      <i className="fas fa-comments"></i>
                      <p><strong>Discuss first:</strong> Post in forum for feedback</p>
                    </div>
                    <div className="practice-item">
                      <i className="fas fa-bullseye"></i>
                      <p><strong>Be specific:</strong> Clear objectives and implementation</p>
                    </div>
                    <div className="practice-item">
                      <i className="fas fa-brain"></i>
                      <p><strong>Consider impact:</strong> Think through consequences</p>
                    </div>
                    <div className="practice-item">
                      <i className="fas fa-question-circle"></i>
                      <p><strong>Provide reasoning:</strong> Explain the "why"</p>
                    </div>
                  </div>
                </div>

                <div className="example-proposal">
                  <strong>Example Proposal:</strong>
                  <div className="code-snippet">
                    <code>await dao.propose(</code>
                    <code>  [targetContract],</code>
                    <code>  [0],</code>
                    <code>  [encodedData],</code>
                    <code>  "Proposal: Increase oracle fee from 10% to 12%"</code>
                    <code>);</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Safety */}
        <section className="security-section">
          <div className="container">
            <h2 className="section-title">Security & Safety Mechanisms</h2>
            <p className="section-intro">How Riddlen protects the DAO from attacks and ensures proper governance</p>

            <div className="security-grid">
              <div className="security-card">
                <div className="security-icon">🔐</div>
                <h3>Access Control</h3>
                <div className="access-roles">
                  <div className="role-item">
                    <strong>DEFAULT_ADMIN_ROLE</strong>
                    <p>Can grant/revoke roles</p>
                  </div>
                  <div className="role-item">
                    <strong>UPGRADER_ROLE</strong>
                    <p>Can upgrade DAO contract</p>
                  </div>
                  <div className="role-item">
                    <strong>PROPOSER_ROLE</strong>
                    <p>Can propose to timelock (DAO only)</p>
                  </div>
                  <div className="role-item">
                    <strong>EXECUTOR_ROLE</strong>
                    <p>Can execute from timelock (DAO only)</p>
                  </div>
                </div>
              </div>

              <div className="security-card">
                <div className="security-icon">🔄</div>
                <h3>Upgradeability</h3>
                <ul className="upgrade-features">
                  <li><i className="fas fa-check"></i> UUPS pattern implementation</li>
                  <li><i className="fas fa-check"></i> DAO contract can be upgraded</li>
                  <li><i className="fas fa-check"></i> Fixes bugs without redeployment</li>
                  <li><i className="fas fa-check"></i> Requires UPGRADER_ROLE</li>
                  <li><i className="fas fa-check"></i> Maintains state across upgrades</li>
                </ul>
              </div>

              <div className="security-card">
                <div className="security-icon">⏱️</div>
                <h3>Timelock Protection</h3>
                <p><strong>48-hour delay on critical actions:</strong></p>
                <ul className="timelock-features">
                  <li>Treasury spending</li>
                  <li>Contract upgrades</li>
                  <li>Parameter changes</li>
                  <li>Gives community reaction time</li>
                </ul>
              </div>

              <div className="security-card">
                <div className="security-icon">⚖️</div>
                <h3>Checks & Balances</h3>
                <ul className="balance-features">
                  <li><i className="fas fa-check"></i> Quorum prevents minority rule</li>
                  <li><i className="fas fa-check"></i> Timelock prevents hasty execution</li>
                  <li><i className="fas fa-check"></i> Public proposals ensure transparency</li>
                  <li><i className="fas fa-check"></i> On-chain voting prevents manipulation</li>
                  <li><i className="fas fa-check"></i> Founder veto (Phase 1) prevents early attacks</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Governance Best Practices */}
        <section className="best-practices-section alt">
          <div className="container">
            <h2 className="section-title">Governance Best Practices</h2>
            <p className="section-intro">Guidelines for responsible DAO participation</p>

            <div className="best-practices-grid">
              <div className="bp-card voters">
                <h3>For Voters</h3>
                <div className="bp-section">
                  <h4>✅ Do:</h4>
                  <ul className="do-list">
                    <li>Read full proposal before voting</li>
                    <li>Consider long-term impact</li>
                    <li>Vote consistently (build reputation)</li>
                    <li>Provide reasons when voting</li>
                    <li>Discuss in community forums</li>
                  </ul>
                </div>
                <div className="bp-section">
                  <h4>❌ Don't:</h4>
                  <ul className="dont-list">
                    <li>Vote without reading</li>
                    <li>Follow others blindly</li>
                    <li>Ignore important proposals</li>
                    <li>Vote emotionally</li>
                    <li>Skip community discussion</li>
                  </ul>
                </div>
              </div>

              <div className="bp-card proposers">
                <h3>For Proposers</h3>
                <div className="bp-section">
                  <h4>✅ Do:</h4>
                  <ul className="do-list">
                    <li>Start with forum discussion</li>
                    <li>Provide clear rationale</li>
                    <li>Consider implementation details</li>
                    <li>Be open to feedback</li>
                    <li>Iterate based on comments</li>
                  </ul>
                </div>
                <div className="bp-section">
                  <h4>❌ Don't:</h4>
                  <ul className="dont-list">
                    <li>Surprise the community</li>
                    <li>Make vague proposals</li>
                    <li>Ignore technical feasibility</li>
                    <li>Rush to vote</li>
                    <li>Take rejection personally</li>
                  </ul>
                </div>
              </div>

              <div className="bp-card community">
                <h3>For the Community</h3>
                <div className="bp-section">
                  <h4>✅ Do:</h4>
                  <ul className="do-list">
                    <li>Engage in governance discussions</li>
                    <li>Help new members understand</li>
                    <li>Share expertise on proposals</li>
                    <li>Build consensus before formal vote</li>
                    <li>Celebrate successful proposals</li>
                  </ul>
                </div>
                <div className="bp-section">
                  <h4>❌ Don't:</h4>
                  <ul className="dont-list">
                    <li>Attack other community members</li>
                    <li>Spread misinformation</li>
                    <li>Vote brigade</li>
                    <li>Create spam proposals</li>
                    <li>Ignore founder guidance (Phase 1)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="timeline-section">
          <div className="container">
            <h2 className="section-title">The Path to Full Decentralization</h2>
            <p className="section-intro">Projected timeline for progressive governance maturity</p>

            <div className="decentralization-timeline">
              <div className="timeline-stage">
                <div className="stage-period">Months 0-6</div>
                <div className="stage-content">
                  <h3>Phase 1: Builder Control</h3>
                  <ul>
                    <li>Founder has full control</li>
                    <li>Community learns governance</li>
                    <li>Proposal practice runs</li>
                    <li>Building trust</li>
                  </ul>
                </div>
              </div>

              <div className="timeline-connector">↓</div>

              <div className="timeline-stage">
                <div className="stage-period">Months 6-18</div>
                <div className="stage-content">
                  <h3>Phase 1 → Phase 2 Transition</h3>
                  <ul>
                    <li>Founder increasingly defers to community votes</li>
                    <li>Test DAO maturity</li>
                    <li>Prepare for role transfer</li>
                  </ul>
                </div>
              </div>

              <div className="timeline-connector">↓</div>

              <div className="timeline-stage highlight">
                <div className="stage-period">Month 18</div>
                <div className="stage-content">
                  <h3>Phase 2: Shared Governance</h3>
                  <ul>
                    <li>Founder transfers role to DAO</li>
                    <li>Community has full control via proposals</li>
                    <li>Founder becomes regular participant</li>
                  </ul>
                </div>
              </div>

              <div className="timeline-connector">↓</div>

              <div className="timeline-stage">
                <div className="stage-period">Year 3+</div>
                <div className="stage-content">
                  <h3>Phase 3: Full Decentralization</h3>
                  <ul>
                    <li>Option to dissolve founder role</li>
                    <li>Pure community governance</li>
                    <li>Complete decentralization achieved</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="philosophy-section alt">
          <div className="container">
            <h2 className="section-title">Governance Philosophy</h2>
            <p className="section-intro">The principles that guide Riddlen's decentralization journey</p>

            <div className="philosophy-grid">
              <div className="philosophy-card">
                <div className="philosophy-icon">📈</div>
                <h3>Progressive Decentralization</h3>
                <p>Start with necessary control, end with complete community ownership. No rushed decentralization that compromises quality.</p>
              </div>

              <div className="philosophy-card">
                <div className="philosophy-icon">💪</div>
                <h3>Merit-Based Power</h3>
                <p>Voting power earned through contribution, not purchased with money. RON is soul-bound to ensure authentic participation.</p>
              </div>

              <div className="philosophy-card">
                <div className="philosophy-icon">🔍</div>
                <h3>Transparent Transition</h3>
                <p>Clear phases, public actions, predictable timeline. Community always knows what to expect.</p>
              </div>

              <div className="philosophy-card">
                <div className="philosophy-icon">🚪</div>
                <h3>Clean Exit</h3>
                <p>Founder can transfer or dissolve role, ensuring no permanent power. True decentralization is achievable.</p>
              </div>

              <div className="philosophy-card">
                <div className="philosophy-icon">🌟</div>
                <h3>Community First</h3>
                <p>All RON fairly distributed, no founder pre-mine or allocation. Everyone starts equal.</p>
              </div>

              <div className="philosophy-card">
                <div className="philosophy-icon">🔒</div>
                <h3>Long-Term Thinking</h3>
                <p>Timelock delays, quorum requirements, and era-based economics ensure sustainable governance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-box">
              <h2>Ready to Participate in Riddlen Governance?</h2>
              <p>Start earning RON today to gain voting power. Every riddle solved, every validation completed, every contribution made increases your voice in the protocol's future.</p>
              <div className="cta-buttons">
                <a href="/quick-start" className="btn-cta-primary">
                  <i className="fas fa-play"></i> Start Earning RON
                </a>
                <a href="/oracle-guide" className="btn-cta-secondary">
                  <i className="fas fa-users"></i> Become a Validator
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

        .voting-power-section {
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

        .voting-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .voting-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(138, 43, 226, 0.5);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .voting-card h3 {
          color: #FFD700;
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        .reason-list, .earning-methods {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .reason-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .reason-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .reason-content strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.5rem;
        }

        .reason-content p {
          color: #cccccc;
          margin: 0;
        }

        .method-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .method-number {
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

        .method-details strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.5rem;
        }

        .method-details p {
          color: #cccccc;
          margin: 0;
        }

        .voting-example-box {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .voting-example-box h3 {
          color: #FFD700;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .example-scenario {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .scenario-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem 1.5rem;
          border-radius: 10px;
        }

        .scenario-item.highlight {
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.2), rgba(138, 43, 226, 0.15));
          border: 2px solid rgba(255, 215, 0, 0.4);
        }

        .scenario-label {
          color: #9370DB;
        }

        .scenario-arrow {
          color: #FFD700;
          font-size: 1.5rem;
        }

        .scenario-result {
          color: #FFD700;
          font-weight: 700;
        }

        .example-note {
          color: #9370DB;
          font-style: italic;
          text-align: center;
        }

        .phases-section {
          padding: 5rem 0;
        }

        .alt {
          background: rgba(0, 0, 0, 0.2);
        }

        .phases-timeline {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .phase-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid;
          border-radius: 20px;
          padding: 2.5rem;
        }

        .phase-card.phase-1 {
          border-color: rgba(255, 215, 0, 0.5);
        }

        .phase-card.phase-2 {
          border-color: rgba(138, 43, 226, 0.5);
        }

        .phase-card.phase-3 {
          border-color: rgba(0, 255, 127, 0.5);
        }

        .phase-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 215, 0, 0.2);
        }

        .phase-badge {
          background: linear-gradient(45deg, #8A2BE2, #9370DB);
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: 15px;
          font-weight: 700;
        }

        .phase-header h3 {
          color: #FFD700;
          font-size: 2rem;
          margin: 0;
        }

        .phase-duration {
          color: #9370DB;
          font-style: italic;
        }

        .phase-description {
          color: #cccccc;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .powers-section, .community-role {
          margin-bottom: 1.5rem;
        }

        .powers-section h4, .community-role h4 {
          color: #9370DB;
          margin-bottom: 1rem;
        }

        .powers-list, .role-list {
          list-style: none;
          padding: 0;
        }

        .powers-list li {
          color: #00FF7F;
          padding: 0.5rem 0;
          padding-left: 2rem;
          position: relative;
        }

        .powers-list li i {
          position: absolute;
          left: 0;
        }

        .role-list li {
          color: #cccccc;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .role-list li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: #FFD700;
        }

        .phase-duration-note {
          background: rgba(138, 43, 226, 0.15);
          border-left: 3px solid #8A2BE2;
          border-radius: 5px;
          padding: 1rem;
          margin-top: 1.5rem;
        }

        .phase-duration-note strong {
          color: #9370DB;
        }

        .transition-details, .dissolution-details {
          margin-bottom: 1.5rem;
        }

        .transition-details h4, .dissolution-details h4 {
          color: #9370DB;
          margin-bottom: 1rem;
        }

        .transition-steps {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .transition-step {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .transition-step i {
          color: #FFD700;
        }

        .transition-step p {
          color: #cccccc;
          margin: 0;
        }

        .code-example {
          background: rgba(0, 0, 0, 0.5);
          border-left: 3px solid #8A2BE2;
          border-radius: 5px;
          padding: 1rem;
          margin: 1rem 0;
          font-family: monospace;
        }

        .code-example code {
          display: block;
          color: #9370DB;
          margin: 0.25rem 0;
        }

        .code-example p {
          color: #666;
          margin: 0.5rem 0 0 0;
          font-size: 0.9rem;
        }

        .alternative-option {
          background: rgba(138, 43, 226, 0.1);
          border: 1px solid rgba(138, 43, 226, 0.4);
          border-radius: 10px;
          padding: 1rem;
          margin: 1rem 0;
        }

        .alternative-option strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.5rem;
        }

        .alternative-option code {
          display: block;
          color: #9370DB;
          font-family: monospace;
          margin-top: 0.5rem;
        }

        .dissolution-list {
          list-style: none;
          padding: 0;
        }

        .dissolution-list li {
          padding: 0.5rem 0;
          padding-left: 2rem;
          position: relative;
        }

        .dissolution-list li i {
          position: absolute;
          left: 0;
        }

        .dissolution-list li i.fa-times-circle {
          color: #FF6347;
        }

        .dissolution-list li i.fa-check-circle {
          color: #00FF7F;
        }

        .requirements-box {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin: 1rem 0;
        }

        .requirements-box h4 {
          color: #9370DB;
          margin-bottom: 0.75rem;
        }

        .requirements-box ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .requirements-box ul li {
          color: #cccccc;
          padding: 0.25rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .requirements-box ul li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #FFD700;
        }

        .founder-callout {
          background: rgba(255, 215, 0, 0.15);
          border: 2px solid rgba(255, 215, 0, 0.4);
          border-radius: 15px;
          padding: 2rem;
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          margin-top: 2rem;
        }

        .founder-callout i {
          color: #FFD700;
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .founder-callout strong {
          color: #FFD700;
          display: block;
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }

        .founder-callout p {
          color: #cccccc;
          margin: 0;
        }

        .era-section {
          padding: 5rem 0;
        }

        .era-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 2rem;
        }

        .era-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .era-card h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .era-card > p {
          color: #cccccc;
          margin-bottom: 2rem;
        }

        .era-table, .quorum-table {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .era-row, .quorum-row {
          display: grid;
          grid-template-columns: 1fr 2fr 2fr 2fr;
          gap: 1rem;
          padding: 1rem;
          align-items: center;
        }

        .quorum-row {
          grid-template-columns: 1fr 2fr 3fr;
        }

        .era-row.header, .quorum-row.header {
          background: rgba(255, 215, 0, 0.2);
          color: #FFD700;
          font-weight: 700;
        }

        .era-row:not(.header), .quorum-row:not(.header) {
          color: #cccccc;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }

        .era-row.highlight, .quorum-row.max {
          background: rgba(255, 215, 0, 0.1);
          color: #FFD700;
          font-weight: 700;
        }

        .era-number {
          color: #9370DB;
          font-weight: 700;
        }

        .ron-amount, .quorum-percent {
          color: #FFD700;
          font-weight: 700;
        }

        .era-rationale {
          background: rgba(138, 43, 226, 0.15);
          border-left: 3px solid #8A2BE2;
          border-radius: 5px;
          padding: 1rem;
        }

        .era-rationale strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.75rem;
        }

        .era-rationale ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .era-rationale ul li {
          color: #cccccc;
          padding: 0.25rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .era-rationale ul li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: #FFD700;
        }

        .quorum-formula {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
        }

        .quorum-formula strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.5rem;
        }

        .quorum-formula p {
          color: #cccccc;
          margin: 0;
        }

        .proposal-process-section {
          padding: 5rem 0;
        }

        .process-timeline {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .process-step {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        .step-number {
          background: linear-gradient(45deg, #8A2BE2, #9370DB);
          color: #fff;
          padding: 1rem 1.5rem;
          border-radius: 15px;
          font-weight: 700;
          white-space: nowrap;
          min-width: 100px;
          text-align: center;
        }

        .step-content {
          flex: 1;
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2rem;
        }

        .step-content h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .step-details strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.75rem;
        }

        .step-details > p {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        .step-details ul {
          list-style: none;
          padding: 0;
          margin-bottom: 1rem;
        }

        .step-details ul li {
          color: #9370DB;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .step-details ul li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: #FFD700;
        }

        .code-block {
          background: rgba(0, 0, 0, 0.5);
          border-left: 3px solid #8A2BE2;
          border-radius: 5px;
          padding: 1rem;
          font-family: monospace;
          margin: 1rem 0;
        }

        .code-block code {
          display: block;
          color: #9370DB;
          margin: 0.25rem 0;
        }

        .timeline-note {
          color: #FFA500 !important;
          font-style: italic;
          margin-top: 1rem !important;
        }

        .scenarios-section {
          padding: 5rem 0;
        }

        .scenarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .scenario-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .scenario-card.highlight {
          border-color: rgba(255, 215, 0, 0.6);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(138, 43, 226, 0.1));
        }

        .scenario-header h3 {
          color: #FFD700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .scenario-proposal, .scenario-vote, .scenario-status {
          margin-bottom: 1rem;
        }

        .scenario-proposal strong, .scenario-vote strong, .scenario-status strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.5rem;
        }

        .scenario-proposal p, .scenario-vote p, .scenario-status p {
          color: #cccccc;
          margin: 0;
        }

        .scenario-options {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin: 1.5rem 0;
        }

        .scenario-options strong {
          color: #9370DB;
          display: block;
          margin-bottom: 1rem;
        }

        .scenario-options ol {
          margin: 0;
          padding-left: 1.5rem;
        }

        .scenario-options ol li {
          color: #cccccc;
          padding: 0.5rem 0;
        }

        .scenario-options ol li strong {
          color: #FFD700;
          display: inline;
        }

        .scenario-execution {
          margin: 1.5rem 0;
        }

        .scenario-execution strong {
          color: #9370DB;
          display: block;
          margin-bottom: 1rem;
        }

        .scenario-execution ul {
          list-style: none;
          padding: 0;
        }

        .scenario-execution ul li {
          padding: 0.5rem 0;
          padding-left: 2rem;
          position: relative;
        }

        .scenario-execution ul li i {
          position: absolute;
          left: 0;
        }

        .scenario-execution ul li i.fa-check {
          color: #00FF7F;
        }

        .scenario-execution ul li i.fa-times {
          color: #FF6347;
        }

        .scenario-outcome {
          background: rgba(138, 43, 226, 0.15);
          border-left: 3px solid #8A2BE2;
          border-radius: 5px;
          padding: 1rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .scenario-outcome i {
          color: #FFD700;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .scenario-outcome p {
          color: #cccccc !important;
          margin: 0 !important;
        }

        .participation-section {
          padding: 5rem 0;
        }

        .participation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .participation-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(138, 43, 226, 0.5);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .card-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .participation-card h3 {
          color: #FFD700;
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        .participation-steps {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .p-step {
          display: flex;
          gap: 1rem;
        }

        .p-step-number {
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

        .p-step-content strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.5rem;
        }

        .p-step-content p {
          color: #cccccc;
          margin: 0 0 0.5rem 0;
        }

        .code-snippet {
          background: rgba(0, 0, 0, 0.5);
          border-left: 3px solid #8A2BE2;
          border-radius: 5px;
          padding: 0.75rem;
          font-family: monospace;
          margin-top: 0.5rem;
        }

        .code-snippet code {
          display: block;
          color: #9370DB;
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }

        .creator-requirements, .best-practices {
          margin-bottom: 2rem;
        }

        .creator-requirements strong, .best-practices strong {
          color: #9370DB;
          display: block;
          margin-bottom: 1rem;
        }

        .creator-requirements ul {
          list-style: none;
          padding: 0;
        }

        .creator-requirements ul li {
          color: #cccccc;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .creator-requirements ul li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: #FFD700;
        }

        .practice-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .practice-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .practice-item i {
          color: #FFD700;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .practice-item p {
          color: #cccccc;
          margin: 0;
        }

        .practice-item strong {
          color: #9370DB;
          display: inline;
        }

        .example-proposal {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
        }

        .example-proposal strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.75rem;
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

        .access-roles {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
        }

        .role-item {
          background: rgba(0, 0, 0, 0.3);
          border-left: 3px solid #FFD700;
          border-radius: 5px;
          padding: 1rem;
        }

        .role-item strong {
          color: #9370DB;
          display: block;
          margin-bottom: 0.5rem;
        }

        .role-item p {
          color: #cccccc;
          margin: 0;
        }

        .upgrade-features, .timelock-features, .balance-features {
          list-style: none;
          padding: 0;
          text-align: left;
        }

        .upgrade-features li, .timelock-features li, .balance-features li {
          padding: 0.5rem 0;
          padding-left: 2rem;
          position: relative;
        }

        .upgrade-features li, .balance-features li {
          color: #cccccc;
        }

        .timelock-features li {
          color: #9370DB;
        }

        .upgrade-features li i, .balance-features li i {
          position: absolute;
          left: 0;
          color: #00FF7F;
        }

        .security-card > p {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        .best-practices-section {
          padding: 5rem 0;
        }

        .best-practices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .bp-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .bp-card h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .bp-section {
          margin-bottom: 2rem;
        }

        .bp-section h4 {
          color: #9370DB;
          margin-bottom: 1rem;
        }

        .do-list, .dont-list {
          list-style: none;
          padding: 0;
        }

        .do-list li {
          color: #00FF7F;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .do-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
        }

        .dont-list li {
          color: #FF6347;
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .dont-list li:before {
          content: "✗";
          position: absolute;
          left: 0;
        }

        .timeline-section {
          padding: 5rem 0;
        }

        .decentralization-timeline {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .timeline-stage {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        .stage-period {
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

        .timeline-stage.highlight .stage-content {
          border-color: rgba(255, 215, 0, 0.6);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(138, 43, 226, 0.1));
        }

        .stage-content h3 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .stage-content ul {
          list-style: none;
          padding: 0;
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

        .timeline-connector {
          color: #FFD700;
          font-size: 3rem;
          text-align: center;
          margin: 0.5rem 0;
        }

        .philosophy-section {
          padding: 5rem 0;
        }

        .philosophy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .philosophy-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(138, 43, 226, 0.5);
          border-radius: 20px;
          padding: 2.5rem;
          text-align: center;
        }

        .philosophy-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .philosophy-card h3 {
          color: #FFD700;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .philosophy-card p {
          color: #cccccc;
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

          .voting-grid {
            grid-template-columns: 1fr;
          }

          .era-grid {
            grid-template-columns: 1fr;
          }

          .era-row, .quorum-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .process-step {
            flex-direction: column;
          }

          .step-number {
            min-width: auto;
          }

          .scenarios-grid {
            grid-template-columns: 1fr;
          }

          .participation-grid {
            grid-template-columns: 1fr;
          }

          .timeline-stage {
            flex-direction: column;
          }

          .stage-period {
            min-width: auto;
          }
        }
      `}</style>
    </>
  );
}
