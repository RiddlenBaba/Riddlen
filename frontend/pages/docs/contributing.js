import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';

export default function Contributing() {
  return (
    <>
      <Head>
        <title>Contributing - Riddlen Docs</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/contributing">
        <div className="docs-content">
          <h1 className="docs-title">Contributing to Riddlen</h1>

          <div className="docs-highlight">
            <h3>🤝 Help Build the Future</h3>
            <p>Join us in creating the world's first Proof-of-Solve blockchain economy.</p>
          </div>

          <h2 className="section-title">Ways to Contribute</h2>
          <p className="section-description">
            There are many ways to contribute to the Riddlen ecosystem, regardless of your technical expertise.
          </p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon"><i className="fas fa-puzzle-piece"></i></div>
              <h3>Create Riddles</h3>
              <p>Design and submit challenging cryptographic puzzles that will engage the community.</p>
            </div>

            <div className="step-card">
              <div className="step-icon"><i className="fas fa-code"></i></div>
              <h3>Contribute Code</h3>
              <p>Help improve smart contracts, frontend, or tooling through GitHub contributions.</p>
            </div>

            <div className="step-card">
              <div className="step-icon"><i className="fas fa-book"></i></div>
              <h3>Write Documentation</h3>
              <p>Improve guides, tutorials, and explanations to help new users understand the platform.</p>
            </div>

            <div className="step-card">
              <div className="step-icon"><i className="fas fa-users"></i></div>
              <h3>Support Community</h3>
              <p>Help others on Discord, Telegram, or forums with questions and troubleshooting.</p>
            </div>

            <div className="step-card">
              <div className="step-icon"><i className="fas fa-bug"></i></div>
              <h3>Report Issues</h3>
              <p>Identify bugs, security vulnerabilities, or UX problems and report them responsibly.</p>
            </div>

            <div className="step-card">
              <div className="step-icon"><i className="fas fa-megaphone"></i></div>
              <h3>Spread the Word</h3>
              <p>Share Riddlen with your network and help grow the Proof-of-Solve movement.</p>
            </div>
          </div>

          <h2 className="section-title">🔧 Technical Contributions</h2>
          <div className="tokenomics-grid">
            <div className="tokenomics-card">
              <h4 style={{ color: '#FFD700', marginBottom: '1rem' }}><i className="fas fa-file-code"></i> Smart Contracts</h4>
              <p>Solidity development, security improvements, gas optimization</p>
            </div>

            <div className="tokenomics-card">
              <h4 style={{ color: '#FFD700', marginBottom: '1rem' }}><i className="fas fa-desktop"></i> Frontend</h4>
              <p>React/Next.js components, Web3 integration, UI/UX enhancements</p>
            </div>

            <div className="tokenomics-card">
              <h4 style={{ color: '#FFD700', marginBottom: '1rem' }}><i className="fas fa-vial"></i> Testing</h4>
              <p>Unit tests, integration tests, security audits, test coverage</p>
            </div>

            <div className="tokenomics-card">
              <h4 style={{ color: '#FFD700', marginBottom: '1rem' }}><i className="fas fa-tools"></i> Tooling</h4>
              <p>Scripts, bots, analytics dashboards, developer tools</p>
            </div>
          </div>

          <h2 className="section-title">📋 Contribution Guidelines</h2>
          <div className="security-grid">
            <div className="security-card">
              <div className="security-icon"><i className="fas fa-code-branch"></i></div>
              <h4>Fork & PR</h4>
              <p>Fork the repository, create a feature branch, and submit a pull request</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-check-circle"></i></div>
              <h4>Code Quality</h4>
              <p>Follow existing code style, add tests, ensure builds pass</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-comments"></i></div>
              <h4>Clear Communication</h4>
              <p>Write descriptive commit messages and PR descriptions</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-shield-alt"></i></div>
              <h4>Security First</h4>
              <p>Report vulnerabilities privately before public disclosure</p>
            </div>
          </div>

          <div className="burn-mechanism">
            <h3>🏗️ Current Development Priorities</h3>
            <div className="burn-split" style={{ textAlign: 'left', display: 'block' }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ margin: '0.75rem 0', color: '#ffffff' }}>✅ <strong>Mainnet deployment</strong> preparation and auditing</li>
                <li style={{ margin: '0.75rem 0', color: '#ffffff' }}>✅ <strong>Frontend enhancements</strong> for mobile responsiveness</li>
                <li style={{ margin: '0.75rem 0', color: '#ffffff' }}>✅ <strong>Analytics dashboard</strong> for tracking platform metrics</li>
                <li style={{ margin: '0.75rem 0', color: '#ffffff' }}>✅ <strong>Community governance</strong> mechanisms</li>
              </ul>
            </div>
          </div>

          <div className="grand-prize-banner">
            <h3>💎 Recognition & Rewards</h3>
            <p>Contributors are the backbone of Riddlen. We recognize valuable contributions through:</p>
            <ul>
              <li><strong>Contributor NFTs:</strong> Special recognition for significant contributions</li>
              <li><strong>RDLN rewards:</strong> Bounties for critical bugs and feature implementations</li>
              <li><strong>Community roles:</strong> Special Discord roles and privileges</li>
              <li><strong>Governance power:</strong> Influence over future platform direction</li>
            </ul>
          </div>

          <h2 className="section-title">🔗 Get Started</h2>
          <div className="cta-buttons">
            <a href="https://github.com/RiddlenBaba/Riddlen" target="_blank" className="btn-primary">
              <i className="fab fa-github"></i> Visit GitHub
            </a>
            <a href="https://discord.gg/riddlen" target="_blank" className="btn-secondary">
              <i className="fab fa-discord"></i> Join Discord
            </a>
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

          .steps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
          }

          .step-card {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            padding: 2rem;
            transition: all 0.3s ease;
            text-align: center;
          }

          .step-card:hover {
            transform: translateY(-10px);
            border-color: rgba(255, 215, 0, 0.4);
            box-shadow: 0 20px 40px rgba(255, 215, 0, 0.1);
          }

          .step-icon {
            font-size: 3rem;
            color: #FFD700;
            margin-bottom: 1rem;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
          }

          .step-card h3 {
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #ffffff;
          }

          .step-card p {
            color: #cccccc;
            line-height: 1.6;
          }

          .tokenomics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
          }

          .tokenomics-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            text-align: center;
          }

          .tokenomics-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 215, 0, 0.4);
          }

          .tokenomics-card h4 {
            font-weight: 700;
            font-size: 1.2rem;
          }

          .tokenomics-card p {
            color: #cccccc;
            line-height: 1.6;
          }

          .security-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
          }

          .security-card {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 15px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
          }

          .security-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 215, 0, 0.4);
          }

          .security-icon {
            font-size: 2rem;
            color: #FFD700;
            margin-bottom: 1rem;
          }

          .security-card h4 {
            color: #ffffff;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }

          .security-card p {
            color: #cccccc;
            font-size: 0.9rem;
            line-height: 1.5;
          }

          .burn-mechanism {
            background: linear-gradient(45deg, rgba(255, 99, 71, 0.1), rgba(255, 215, 0, 0.1));
            border: 2px solid rgba(255, 99, 71, 0.3);
            border-radius: 20px;
            padding: 2rem;
            margin: 2rem 0;
            text-align: center;
          }

          .burn-mechanism h3 {
            color: #FF6347;
            margin-bottom: 1rem;
            font-size: 1.5rem;
          }

          .grand-prize-banner {
            background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 99, 71, 0.2));
            border: 2px solid rgba(255, 215, 0, 0.5);
            border-radius: 15px;
            padding: 1.5rem;
            margin: 2rem 0;
            text-align: left;
            animation: pulse 3s ease-in-out infinite;
          }

          .grand-prize-banner h3 {
            color: #FFD700;
            font-size: 1.8rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          .grand-prize-banner p {
            color: #ffffff;
            font-size: 1.1rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          .grand-prize-banner ul {
            list-style: none;
            padding: 0;
          }

          .grand-prize-banner li {
            color: #cccccc;
            margin: 0.5rem 0;
            padding-left: 0;
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

            .steps-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </DocsLayout>
    </>
  );
}