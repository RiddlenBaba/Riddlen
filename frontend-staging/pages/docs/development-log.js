import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';
import Link from 'next/link';

export default function DevelopmentLog() {
  const milestones = [
    {
      date: 'September 2024',
      title: 'Amoy Testnet Deployment',
      description: 'All contracts successfully deployed and verified on Polygon Amoy testnet',
      icon: 'rocket',
      status: 'completed'
    },
    {
      date: 'September 2024',
      title: 'Airdrop Contract Launch',
      description: '51M RDLN funded for two-phase airdrop distribution',
      icon: 'gift',
      status: 'completed'
    },
    {
      date: 'August 2024',
      title: 'Security Audit Completed',
      description: 'Professional audit completed with B+ grade and recommendations implemented',
      icon: 'shield-alt',
      status: 'completed'
    },
    {
      date: 'July 2024',
      title: 'Tiered Reward System',
      description: 'Revolutionary 2x/1x/0.5x reward system prevents NFT hoarding',
      icon: 'trophy',
      status: 'completed'
    },
    {
      date: 'June 2024',
      title: 'RON Token Integration',
      description: 'Four-tier reputation system with merit-based progression',
      icon: 'medal',
      status: 'completed'
    },
    {
      date: 'May 2024',
      title: 'Rug-Proof Treasury',
      description: 'Immutable supply controls with 1M RDLN monthly releases',
      icon: 'lock',
      status: 'completed'
    }
  ];

  const versions = [
    {
      version: 'v5.1',
      date: 'September 2024',
      changes: [
        'Airdrop contract with two-phase distribution',
        'Enhanced anti-cheat mechanisms (30s solve delay)',
        'Optimized gas usage across all contracts',
        'Complete testnet deployment on Amoy'
      ]
    },
    {
      version: 'v5.0',
      date: 'August 2024',
      changes: [
        'Tiered reward system (2x/1x/0.5x multipliers)',
        'RON token with tier-based access control',
        'Rug-proof treasury with immutable limits',
        'Security audit and improvements'
      ]
    },
    {
      version: 'v4.0',
      date: 'July 2024',
      changes: [
        'Progressive difficulty system',
        'Cross-contract RON integration',
        'Biennial halving economics',
        'Emergency release safeguards'
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Development Log - Riddlen Docs</title>
        <meta name="description" content="Track the evolution of Riddlen from concept to deployed platform" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/development-log">
        <div className="docs-content">
          <h1 className="docs-title">Development Log</h1>

          <div className="docs-highlight">
            <h3><i className="fas fa-history"></i> Project Evolution</h3>
            <p>Track the journey of Riddlen from initial concept to fully deployed testnet platform</p>
          </div>

          <h2 className="section-title"><i className="fas fa-map-marked-alt"></i> Major Milestones</h2>
          <p className="section-description">
            Key achievements in the development of Riddlen's revolutionary gaming platform.
          </p>

          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="milestone-card">
                <div className="milestone-icon">
                  <i className={`fas fa-${milestone.icon}`}></i>
                </div>
                <div className="milestone-content">
                  <div className="milestone-header">
                    <h3>{milestone.title}</h3>
                    <span className="milestone-date">{milestone.date}</span>
                  </div>
                  <p>{milestone.description}</p>
                  <span className="status-badge completed">
                    <i className="fas fa-check-circle"></i> Completed
                  </span>
                </div>
              </div>
            ))}
          </div>

          <h2 className="section-title"><i className="fas fa-code-branch"></i> Version History</h2>
          <p className="section-description">
            Detailed changelog of major releases and feature additions.
          </p>

          <div className="versions-grid">
            {versions.map((version) => (
              <div key={version.version} className="version-card">
                <div className="version-header">
                  <h3>{version.version}</h3>
                  <span className="version-date">{version.date}</span>
                </div>
                <ul className="changes-list">
                  {version.changes.map((change, index) => (
                    <li key={index}>
                      <i className="fas fa-chevron-right"></i> {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="section-title"><i className="fas fa-chart-line"></i> Key Innovations</h2>

          <div className="tokenomics-grid">
            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-layer-group"></i>
              </div>
              <h3>Tiered Rewards</h3>
              <p>First 25% get 2x, middle 50% get 1x, last 25% get 0.5x rewards - preventing NFT hoarding</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Rug-Proof Treasury</h3>
              <p>Immutable supply controls with maximum 1M RDLN monthly releases and emergency safeguards</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Merit-Based System</h3>
              <p>Four-tier RON progression rewards skill over capital with anti-Sybil protection</p>
            </div>

            <div className="tokenomics-card">
              <div className="tokenomics-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Anti-Cheat Timer</h3>
              <p>30-second solve delay ensures fair gameplay and prevents automation abuse</p>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-road"></i> Upcoming Features</h2>

          <div className="grand-prize-banner">
            <h3><i className="fas fa-star"></i> Mainnet Launch Roadmap</h3>
            <div className="roadmap-list">
              <div className="roadmap-item">
                <i className="fas fa-check-circle"></i>
                <span>Testnet deployment and testing</span>
              </div>
              <div className="roadmap-item pending">
                <i className="fas fa-circle"></i>
                <span>Community feedback integration</span>
              </div>
              <div className="roadmap-item pending">
                <i className="fas fa-circle"></i>
                <span>Final security audit for mainnet</span>
              </div>
              <div className="roadmap-item pending">
                <i className="fas fa-circle"></i>
                <span>Mainnet deployment on Polygon</span>
              </div>
              <div className="roadmap-item pending">
                <i className="fas fa-circle"></i>
                <span>Public launch and marketing campaign</span>
              </div>
            </div>
          </div>

          <div className="cta-buttons">
            <Link href="/docs/deployed-contracts" className="btn-primary">
              <i className="fas fa-file-contract"></i> View Deployed Contracts
            </Link>
            <Link href="/docs/testnet-deployment" className="btn-secondary">
              <i className="fas fa-book"></i> Testnet Guide
            </Link>
          </div>
        </div>

        <style jsx>{`
          .docs-content {
            max-width: 900px;
            margin: 0 auto;
          }

          .docs-title {
            text-align: center;
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 2rem;
            background: linear-gradient(45deg, #ffffff, #FFD700);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .docs-highlight {
            background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 99, 71, 0.2));
            border: 2px solid rgba(255, 215, 0, 0.5);
            border-radius: 15px;
            padding: 1.5rem;
            margin: 2rem 0;
            text-align: center;
            animation: pulse 3s ease-in-out infinite;
          }

          .docs-highlight h3 {
            color: #FFD700;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
          }

          .docs-highlight p {
            color: #ffffff;
            font-size: 1.1rem;
          }

          .section-title {
            font-size: 2.2rem;
            font-weight: 800;
            margin: 3rem 0 1rem;
            background: linear-gradient(45deg, #ffffff, #FFD700);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .section-description {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            color: #cccccc;
            line-height: 1.8;
          }

          .timeline {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin: 2rem 0;
          }

          .milestone-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            padding: 2rem;
            display: flex;
            gap: 1.5rem;
            align-items: flex-start;
            transition: all 0.3s ease;
          }

          .milestone-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 215, 0, 0.4);
          }

          .milestone-icon {
            font-size: 2.5rem;
            color: #FFD700;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
            flex-shrink: 0;
          }

          .milestone-content {
            flex: 1;
          }

          .milestone-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .milestone-header h3 {
            color: #ffffff;
            font-size: 1.4rem;
            font-weight: 700;
            margin: 0;
          }

          .milestone-date {
            color: #FFD700;
            font-size: 0.9rem;
            font-weight: 600;
          }

          .milestone-content p {
            color: #cccccc;
            line-height: 1.6;
            margin-bottom: 1rem;
          }

          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.4rem 1rem;
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: 600;
          }

          .status-badge.completed {
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.3);
          }

          .versions-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin: 2rem 0;
          }

          .version-card {
            background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(99, 102, 241, 0.1));
            border: 1px solid rgba(147, 51, 234, 0.3);
            border-radius: 20px;
            padding: 2rem;
            transition: all 0.3s ease;
          }

          .version-card:hover {
            transform: translateY(-5px);
            border-color: rgba(147, 51, 234, 0.5);
          }

          .version-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(147, 51, 234, 0.2);
          }

          .version-header h3 {
            color: #FFD700;
            font-size: 1.6rem;
            font-weight: 800;
            margin: 0;
          }

          .version-date {
            color: #a78bfa;
            font-size: 0.9rem;
            font-weight: 600;
          }

          .changes-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .changes-list li {
            color: #e5e5e5;
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            line-height: 1.6;
          }

          .changes-list i {
            color: #a78bfa;
            margin-top: 0.3rem;
            flex-shrink: 0;
          }

          .tokenomics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
          }

          .tokenomics-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease;
          }

          .tokenomics-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 215, 0, 0.4);
          }

          .tokenomics-icon {
            font-size: 3rem;
            color: #FFD700;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
            margin-bottom: 1rem;
          }

          .tokenomics-card h3 {
            color: #ffffff;
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
          }

          .tokenomics-card p {
            color: #cccccc;
            line-height: 1.6;
            font-size: 0.95rem;
          }

          .grand-prize-banner {
            background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 99, 71, 0.2));
            border: 2px solid rgba(255, 215, 0, 0.5);
            border-radius: 15px;
            padding: 2rem;
            margin: 2rem 0;
            animation: pulse 3s ease-in-out infinite;
          }

          .grand-prize-banner h3 {
            color: #FFD700;
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .roadmap-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .roadmap-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            color: #22c55e;
            font-size: 1.05rem;
            font-weight: 500;
          }

          .roadmap-item i {
            font-size: 1.2rem;
          }

          .roadmap-item.pending {
            color: #94a3b8;
          }

          .roadmap-item.pending i {
            color: #475569;
          }

          .cta-buttons {
            display: flex;
            gap: 1rem;
            margin: 3rem 0;
            justify-content: center;
            flex-wrap: wrap;
          }

          .btn-primary {
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: #000;
            padding: 1rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(255, 215, 0, 0.4);
            color: #000;
          }

          .btn-secondary {
            background: transparent;
            color: #FFD700;
            padding: 1rem 2rem;
            border: 2px solid #FFD700;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }

          .btn-secondary:hover {
            background: rgba(255, 215, 0, 0.1);
            transform: translateY(-2px);
            color: #FFD700;
          }

          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
            50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
          }

          @media (max-width: 768px) {
            .docs-title {
              font-size: 2.2rem;
            }

            .section-title {
              font-size: 1.8rem;
            }

            .milestone-card {
              flex-direction: column;
            }

            .milestone-icon {
              font-size: 2rem;
            }

            .tokenomics-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </DocsLayout>
    </>
  );
}