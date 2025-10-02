import DocsLayout from '../../components/DocsLayout';

export default function GroupMechanicsDoc() {
  return (
    <DocsLayout currentPath="/docs/group-mechanics">
      <h1>👥 Group Mechanics</h1>

      <div className="doc-intro">
        <p>
          Riddlen's Group Mechanics allow multiple solvers to collaborate on riddles by pooling their RON reputation.
          This unlocks access to higher-tier riddles while maintaining fairness through tier diversity requirements and
          RON-weighted reward distribution.
        </p>
      </div>

      <h2>Overview</h2>
      <p>
        Groups are formed by converting a solo NFT into a collaborative group riddle. The group inherits the NFT's
        era-locked costs, meaning all members solve at the cheaper historical prices regardless of when they join.
      </p>

      <div className="highlight-box">
        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Access Higher Tiers:</strong> Pool RON to unlock riddles beyond your individual tier</li>
          <li><strong>Locked Era Costs:</strong> Solve at historical prices from when the NFT was minted</li>
          <li><strong>Fair Distribution:</strong> Rewards split proportionally by effective RON (1%-70% limits)</li>
          <li><strong>Balanced Teams:</strong> Tier diversity requirements ensure mixed-skill collaboration</li>
        </ul>
      </div>

      <h2>Group Composition Rules</h2>

      <h3>Size Requirements</h3>
      <ul>
        <li><strong>Minimum:</strong> 3 members</li>
        <li><strong>Maximum:</strong> 11 members</li>
      </ul>

      <h3>Tier Diversity Requirements</h3>
      <p>Every group MUST have at least one member from each tier category:</p>
      <ul>
        <li><strong>Low Tier:</strong> 0-999 RON (NOVICE) - At least 1 required</li>
        <li><strong>Mid Tier:</strong> 1,000-9,999 RON (SOLVER) - At least 1 required</li>
        <li><strong>High Tier:</strong> 10,000+ RON (EXPERT/ORACLE) - At least 1 required</li>
      </ul>

      <h3>Maximum Tier Limits</h3>
      <p>To prevent high-tier dominance:</p>
      <ul>
        <li><strong>High/Oracle combined:</strong> Maximum 2 members</li>
        <li><strong>Mid-tier:</strong> Maximum 4 members</li>
        <li><strong>Low-tier:</strong> Maximum 5 members</li>
      </ul>

      <div className="code-block">
        <h4>Example Valid Group (5 members):</h4>
        <pre>{`
Member 1: 500 RON     (Low)    ✓
Member 2: 2,000 RON   (Mid)    ✓
Member 3: 3,500 RON   (Mid)    ✓
Member 4: 15,000 RON  (Expert) ✓
Member 5: 120,000 RON (Oracle) ✓

Pooled RON: (500 + 2,000 + 3,500 + 15,000 + 120,000) / 5 = 28,200 RON
Group Access Tier: EXPERT (can solve 10K-99K RON riddles)
        `}</pre>
      </div>

      <h2>How Group Solving Works</h2>

      <h3>Step 1: Convert NFT to Group</h3>
      <p>
        An NFT holder calls <code>convertToGroupNFT()</code> on their solo riddle NFT. This:
      </p>
      <ul>
        <li>Burns the solo NFT</li>
        <li>Creates a new group with the creator as the first member</li>
        <li>Locks the NFT's era costs (attempt and submission costs)</li>
        <li>Opens the group for new members (FORMING state)</li>
      </ul>

      <div className="code-block">
        <pre>{`
// Example: Convert NFT #42 to group riddle
await riddleNFT.convertToGroupNFT(42);

// Group inherits NFT's costs
Group Locked Costs:
  Era: 0 (from NFT mint time)
  Attempt Cost: 1.0 RDLN
  Submission Cost: 1.0 RDLN

// Even if current era has 4.0 RDLN costs,
// this group always pays 1.0 RDLN!
        `}</pre>
      </div>

      <h3>Step 2: Members Join (7-Day Window)</h3>
      <p>
        Solvers join the forming group by calling <code>joinGroup(groupId, acknowledgedCost)</code>. They must:
      </p>
      <ul>
        <li>Acknowledge the locked attempt cost (prevents joining without reading terms)</li>
        <li>Have available group slots (tier-based limit)</li>
        <li>Join within 7 days of group creation</li>
      </ul>

      <div className="code-block">
        <pre>{`
// Join group #1, acknowledging 1 RDLN attempt cost
await groupManager.joinGroup(1, parseEther("1.0"));

// If you acknowledge wrong cost, transaction reverts:
await groupManager.joinGroup(1, parseEther("0.5"));
// ❌ Reverts: InvalidCostAcknowledgement
        `}</pre>
      </div>

      <h3>Step 3: Group Finalization</h3>
      <p>
        When the group has enough members (3+) and valid composition, the creator finalizes:
      </p>
      <ul>
        <li>System validates tier diversity requirements</li>
        <li>Calculates pooled (average) effective RON</li>
        <li>Determines group's accessible riddle tier</li>
        <li>Locks the group (no more joins/leaves)</li>
        <li>State changes to RESERVED</li>
      </ul>

      <h3>Step 4: Solving Phase (ACTIVE)</h3>
      <p>
        The NFT contract activates the group when solving begins. During this phase:
      </p>
      <ul>
        <li>All members' RON is diluted (effective RON = base RON / active groups)</li>
        <li>Members collaborate to solve using the locked costs</li>
        <li>Attempts are tracked per-group, not per-member</li>
      </ul>

      <h3>Step 5: Completion & Rewards</h3>
      <p>
        Upon success, rewards are distributed using RON-weighted shares:
      </p>
      <ul>
        <li>Each member's effective RON determines their share</li>
        <li>Minimum 1% per member (prevents exploitation)</li>
        <li>Maximum 70% per member (prevents dominance)</li>
        <li>RON dilution is released (active group count decrements)</li>
      </ul>

      <div className="code-block">
        <h4>Reward Distribution Example:</h4>
        <pre>{`
Total Reward: 1000 RDLN

Member 1: 500 RON     → Share: 50 RDLN  (5.0%)
Member 2: 2,000 RON   → Share: 143 RDLN (14.3%)
Member 3: 3,500 RON   → Share: 250 RDLN (25.0%)
Member 4: 15,000 RON  → Share: 339 RDLN (33.9%)
Member 5: 120,000 RON → Share: 218 RDLN (21.8%) // Capped at 70%!

// Without caps, Member 5 would get ~852 RDLN (85.2%)
// But 70% cap prevents extreme concentration
        `}</pre>
      </div>

      <h2>RON Dilution Mechanic</h2>

      <div className="warning-box">
        <h3>⚠️ Important: RON Dilution</h3>
        <p>
          Your base RON is <strong>diluted</strong> across all active groups you're participating in.
          This prevents RON farming by being in multiple groups simultaneously.
        </p>
      </div>

      <h3>How Dilution Works</h3>
      <p>Formula: <code>Effective RON = Base RON / Active Group Count</code></p>

      <div className="code-block">
        <pre>{`
Example:

Base RON: 10,000 (EXPERT tier)

Scenario A (1 active group):
  Effective RON: 10,000 / 1 = 10,000 (EXPERT)

Scenario B (2 active groups):
  Effective RON: 10,000 / 2 = 5,000 (SOLVER)

Scenario C (5 active groups):
  Effective RON: 10,000 / 5 = 2,000 (SOLVER)
        `}</pre>
      </div>

      <h3>Max Concurrent Groups by Tier</h3>
      <table className="tier-table">
        <thead>
          <tr>
            <th>Tier</th>
            <th>RON Range</th>
            <th>Max Active Groups</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>🌱 NOVICE</td>
            <td>0 - 999</td>
            <td>2 groups</td>
          </tr>
          <tr>
            <td>⚡ SOLVER</td>
            <td>1,000 - 9,999</td>
            <td>3 groups</td>
          </tr>
          <tr>
            <td>🔥 EXPERT</td>
            <td>10,000 - 99,999</td>
            <td>5 groups</td>
          </tr>
          <tr>
            <td>🌟 ORACLE</td>
            <td>100,000+</td>
            <td>8 groups</td>
          </tr>
        </tbody>
      </table>

      <h2>Pooled RON & Access Tiers</h2>

      <p>
        The group's pooled RON (average of all members' effective RON) determines what riddle tier the group can access.
      </p>

      <div className="code-block">
        <pre>{`
Pooled RON Calculation:
  Sum all members' effective RON, divide by member count

Access Tier Thresholds:
  0 - 999 RON:       NOVICE  (can solve Tier 0 riddles)
  1,000 - 9,999:     SOLVER  (can solve Tier 1 riddles)
  10,000 - 99,999:   EXPERT  (can solve Tier 2 riddles)
  100,000+:          ORACLE  (can solve Tier 3 riddles)
        `}</pre>
      </div>

      <h3>Strategic Group Formation</h3>

      <div className="highlight-box">
        <h4>Example: Reaching EXPERT Tier</h4>
        <p>Goal: Form a group to solve a 15,000 RON riddle (EXPERT tier)</p>

        <ul>
          <li>
            <strong>Option A (High RON Players):</strong>
            <div>3 members: 12K + 15K + 18K = 45K / 3 = <strong>15K pooled</strong> ✓ EXPERT</div>
          </li>
          <li>
            <strong>Option B (Mixed Tiers):</strong>
            <div>5 members: 500 + 2K + 5K + 20K + 50K = 77.5K / 5 = <strong>15.5K pooled</strong> ✓ EXPERT</div>
          </li>
          <li>
            <strong>Option C (Too Low):</strong>
            <div>4 members: 800 + 1.5K + 3K + 5K = 10.3K / 4 = <strong>2.6K pooled</strong> ❌ Only SOLVER</div>
          </li>
        </ul>

        <p>
          <strong>Key Insight:</strong> One high-RON member can lift the entire group's access tier, but tier diversity
          requirements ensure it's not all high-tier players.
        </p>
      </div>

      <h2>Group Lifecycle States</h2>

      <table className="state-table">
        <thead>
          <tr>
            <th>State</th>
            <th>Description</th>
            <th>Actions Available</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className="state-badge forming">FORMING</span></td>
            <td>Accepting new members (7-day window)</td>
            <td>Join, Leave, Finalize</td>
          </tr>
          <tr>
            <td><span className="state-badge reserved">RESERVED</span></td>
            <td>Locked, waiting for NFT contract to start</td>
            <td>Activate (NFT contract only)</td>
          </tr>
          <tr>
            <td><span className="state-badge active">ACTIVE</span></td>
            <td>Solving in progress, RON diluted</td>
            <td>Submit attempts</td>
          </tr>
          <tr>
            <td><span className="state-badge completed">COMPLETED</span></td>
            <td>Finished (success or failure)</td>
            <td>Claim rewards (if successful)</td>
          </tr>
          <tr>
            <td><span className="state-badge disbanded">DISBANDED</span></td>
            <td>Cancelled before activation</td>
            <td>None (refunds processed)</td>
          </tr>
        </tbody>
      </table>

      <h2>Smart Contract Functions</h2>

      <h3>RiddleGroupManager.sol</h3>

      <div className="function-doc">
        <h4>createGroupFromNFT()</h4>
        <p>Called by RiddleNFT contract when NFT is converted to group</p>
        <div className="code-block">
          <pre>{`
function createGroupFromNFT(
    address creator,
    uint256 nftId,
    uint256 riddleId,
    uint256 mintEra,
    uint256 baseAttemptCost,
    uint256 baseSubmissionCost
) external onlyRole(NFT_CONTRACT_ROLE) returns (uint256 groupId)
          `}</pre>
        </div>
      </div>

      <div className="function-doc">
        <h4>joinGroup()</h4>
        <p>Join a forming group (must acknowledge locked costs)</p>
        <div className="code-block">
          <pre>{`
function joinGroup(
    uint256 groupId,
    uint256 acknowledgedCost
) external nonReentrant
          `}</pre>
        </div>
      </div>

      <div className="function-doc">
        <h4>finalizeGroup()</h4>
        <p>Lock group composition and calculate pooled RON (creator only)</p>
        <div className="code-block">
          <pre>{`
function finalizeGroup(uint256 groupId)
    external
    nonReentrant
          `}</pre>
        </div>
      </div>

      <div className="function-doc">
        <h4>leaveGroup()</h4>
        <p>Leave a forming group before finalization</p>
        <div className="code-block">
          <pre>{`
function leaveGroup(uint256 groupId)
    external
    nonReentrant
          `}</pre>
        </div>
      </div>

      <h3>GroupCompositionValidator.sol</h3>

      <div className="function-doc">
        <h4>validateComposition()</h4>
        <p>Check if group meets tier diversity requirements</p>
        <div className="code-block">
          <pre>{`
function validateComposition(address[] calldata members)
    external view
    returns (bool valid, string memory reason)
          `}</pre>
        </div>
      </div>

      <div className="function-doc">
        <h4>calculatePooledRON()</h4>
        <p>Calculate average effective RON for the group</p>
        <div className="code-block">
          <pre>{`
function calculatePooledRON(address[] calldata members)
    external view
    returns (uint256 pooledRON)
          `}</pre>
        </div>
      </div>

      <div className="function-doc">
        <h4>getAccessibleRiddleTier()</h4>
        <p>Determine what tier the group can access</p>
        <div className="code-block">
          <pre>{`
function getAccessibleRiddleTier(address[] calldata members)
    external view
    returns (string memory accessTier)
          `}</pre>
        </div>
      </div>

      <h2>Economic Implications</h2>

      <h3>Era Cost Locking = Valuable NFTs</h3>
      <p>
        As eras progress and costs increase, old NFTs with Era 0 or Era 1 costs become increasingly valuable for group formation.
        A 1 RDLN attempt cost is far better than a 16 RDLN attempt cost in Era 4!
      </p>

      <h3>RON Dilution = Anti-Farming</h3>
      <p>
        Without dilution, a single high-RON player could join 20 groups simultaneously and collect 20x rewards.
        Dilution ensures participation has opportunity cost - your effective RON decreases with each additional group.
      </p>

      <h3>Distribution Limits = Fairness</h3>
      <p>
        The 1%-70% share limits ensure:
      </p>
      <ul>
        <li>Low-tier members always get meaningful rewards (minimum 1%)</li>
        <li>High-tier members can't dominate rewards (maximum 70%)</li>
        <li>Encourages balanced groups rather than all-high-tier groups</li>
      </ul>

      <h2>Best Practices</h2>

      <div className="highlight-box">
        <h3>For Group Creators:</h3>
        <ul>
          <li>Convert old NFTs (Era 0-1) for maximum cost savings</li>
          <li>Recruit diverse tiers - don't just grab your high-RON friends</li>
          <li>Finalize within 7 days or group expires</li>
          <li>Check pooled RON before finalizing to ensure tier access</li>
        </ul>
      </div>

      <div className="highlight-box">
        <h3>For Group Members:</h3>
        <ul>
          <li>Always check locked costs before joining</li>
          <li>Monitor your active group count (affects RON dilution)</li>
          <li>Join groups with good era costs (Era 0-2 better than Era 3+)</li>
          <li>Verify group has valid composition before joining</li>
        </ul>
      </div>

      <h2>Security Considerations</h2>

      <ul>
        <li><strong>Reentrancy Protection:</strong> All state-changing functions use <code>nonReentrant</code></li>
        <li><strong>Access Control:</strong> NFT contract role required for group creation</li>
        <li><strong>Cost Acknowledgement:</strong> Prevents accidental joins without reading terms</li>
        <li><strong>Pausable:</strong> Emergency stop mechanism if vulnerabilities discovered</li>
        <li><strong>Immutable Costs:</strong> Once group created, costs can't be changed</li>
      </ul>

      <h2>Future Enhancements</h2>

      <p>Potential future features being considered:</p>
      <ul>
        <li>Group chat integration</li>
        <li>Reputation bonuses for successful group solves</li>
        <li>Group leaderboards</li>
        <li>Multi-riddle group campaigns</li>
        <li>Group NFT badges</li>
      </ul>

      <style jsx>{`
        .doc-intro {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          border-left: 4px solid #FFD700;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border-radius: 8px;
        }

        .doc-intro p {
          color: #FFD700;
          font-size: 1.1rem;
          line-height: 1.7;
          margin: 0;
        }

        .highlight-box {
          background: rgba(255, 215, 0, 0.05);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .highlight-box h3,
        .highlight-box h4 {
          color: #FFD700;
          margin-top: 0;
        }

        .warning-box {
          background: linear-gradient(135deg, rgba(255, 99, 71, 0.1), rgba(255, 165, 0, 0.05));
          border: 2px solid rgba(255, 99, 71, 0.4);
          border-radius: 12px;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .warning-box h3 {
          color: #FF6347;
          margin-top: 0;
        }

        .code-block {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1.5rem 0;
          overflow-x: auto;
        }

        .code-block h4 {
          color: #FFA500;
          margin-top: 0;
          margin-bottom: 1rem;
        }

        .code-block pre {
          margin: 0;
          color: #cccccc;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          line-height: 1.6;
          white-space: pre;
        }

        code {
          background: rgba(255, 215, 0, 0.1);
          color: #FFD700;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        .tier-table,
        .state-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          overflow: hidden;
        }

        .tier-table th,
        .state-table th {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
          color: #FFD700;
          padding: 1rem;
          text-align: left;
          font-weight: 700;
        }

        .tier-table td,
        .state-table td {
          padding: 1rem;
          border-top: 1px solid rgba(255, 215, 0, 0.1);
          color: #cccccc;
        }

        .tier-table tr:hover,
        .state-table tr:hover {
          background: rgba(255, 215, 0, 0.05);
        }

        .state-badge {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .state-badge.forming {
          background: rgba(255, 215, 0, 0.2);
          color: #FFD700;
          border: 1px solid rgba(255, 215, 0, 0.4);
        }

        .state-badge.reserved {
          background: rgba(255, 165, 0, 0.2);
          color: #FFA500;
          border: 1px solid rgba(255, 165, 0, 0.4);
        }

        .state-badge.active {
          background: rgba(255, 99, 71, 0.2);
          color: #FF6347;
          border: 1px solid rgba(255, 99, 71, 0.4);
        }

        .state-badge.completed {
          background: rgba(144, 238, 144, 0.2);
          color: #90EE90;
          border: 1px solid rgba(144, 238, 144, 0.4);
        }

        .state-badge.disbanded {
          background: rgba(136, 136, 136, 0.2);
          color: #888;
          border: 1px solid rgba(136, 136, 136, 0.4);
        }

        .function-doc {
          margin: 2rem 0;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-left: 4px solid #FFA500;
          border-radius: 8px;
        }

        .function-doc h4 {
          color: #FFD700;
          margin-top: 0;
          font-family: 'Courier New', monospace;
        }

        .function-doc p {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        h1 {
          color: #FFD700;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        h2 {
          color: #FFD700;
          font-size: 1.8rem;
          margin-top: 3rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(255, 215, 0, 0.3);
        }

        h3 {
          color: #FFA500;
          font-size: 1.4rem;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }

        p, li {
          color: #cccccc;
          line-height: 1.8;
        }

        ul {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        li {
          margin: 0.5rem 0;
        }

        strong {
          color: #FFD700;
        }

        @media (max-width: 768px) {
          .tier-table,
          .state-table {
            font-size: 0.85rem;
          }

          .code-block {
            padding: 1rem;
          }

          .code-block pre {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </DocsLayout>
  );
}
