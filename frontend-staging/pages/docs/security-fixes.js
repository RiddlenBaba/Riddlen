import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';

export default function SecurityFixes() {
  return (
    <>
      <Head>
        <title>Security Fixes - Riddlen Docs</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/security-fixes">
        <div className="docs-content">
          <h1 className="docs-title">Applied Security Fixes</h1>

          <div className="docs-highlight">
            <h3>🛡️ All Security Vulnerabilities Resolved</h3>
            <p>Every security issue identified during audits has been addressed and verified.</p>
          </div>

          <div className="audit-grade-card">
            <div className="grade-badge">B+</div>
            <h3>Treasury Drip Audit Grade</h3>
            <p>All critical and high severity issues resolved. Medium and low issues addressed.</p>
          </div>

          <h2 className="section-title">🔧 Key Improvements</h2>
          <p className="section-description">
            Our security audit resulted in comprehensive improvements across all smart contracts.
          </p>

          <div className="security-grid">
            <div className="security-card">
              <div className="security-icon"><i className="fas fa-shield-alt"></i></div>
              <h4>Reentrancy Protection</h4>
              <p>Implemented OpenZeppelin's ReentrancyGuard across all critical functions</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-stopwatch"></i></div>
              <h4>Emergency Cooldown</h4>
              <p>Enforced cooldown periods prevent rapid-fire exploit attempts</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-broadcast-tower"></i></div>
              <h4>Event Emission</h4>
              <p>Comprehensive event logging for complete transaction transparency</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-lock"></i></div>
              <h4>Access Control</h4>
              <p>Hardened role-based access with owner-only critical functions</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-check-circle"></i></div>
              <h4>Input Validation</h4>
              <p>All user inputs validated before processing to prevent malicious data</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-fire"></i></div>
              <h4>Safe Math</h4>
              <p>Overflow protection using Solidity 0.8+ built-in checks</p>
            </div>
          </div>

          <h2 className="section-title">📋 Issue Resolution</h2>
          <div className="tokenomics-grid">
            <div className="tokenomics-card">
              <h4 style={{ color: '#10b981', marginBottom: '1rem' }}>✅ Critical: 0 issues</h4>
              <p>No critical vulnerabilities found</p>
            </div>

            <div className="tokenomics-card">
              <h4 style={{ color: '#10b981', marginBottom: '1rem' }}>✅ High: 0 issues</h4>
              <p>No high severity issues identified</p>
            </div>

            <div className="tokenomics-card">
              <h4 style={{ color: '#f59e0b', marginBottom: '1rem' }}>⚠️ Medium: 2 resolved</h4>
              <p>Both medium issues patched and verified</p>
            </div>

            <div className="tokenomics-card">
              <h4 style={{ color: '#3b82f6', marginBottom: '1rem' }}>ℹ️ Low: 3 resolved</h4>
              <p>All low priority issues addressed</p>
            </div>
          </div>

          <div className="grand-prize-banner">
            <h3>🔍 Continuous Security</h3>
            <p>Our commitment to security doesn't stop at launch:</p>
            <ul>
              <li><strong>Ongoing monitoring:</strong> Real-time transaction analysis</li>
              <li><strong>Bug bounty program:</strong> Community-driven security discovery</li>
              <li><strong>Regular audits:</strong> Scheduled security reviews</li>
              <li><strong>Open source:</strong> All contracts verified and public</li>
            </ul>
          </div>

          <div className="cta-buttons">
            <a href="/docs/audit-report" className="btn-primary">
              <i className="fas fa-file-alt"></i> View Full Audit
            </a>
            <a href="https://amoy.polygonscan.com/" target="_blank" className="btn-secondary">
              <i className="fas fa-external-link-alt"></i> Verify Contracts
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

          .audit-grade-card {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
            border: 2px solid rgba(16, 185, 129, 0.3);
            border-radius: 20px;
            padding: 2rem;
            margin: 2rem 0;
            text-align: center;
          }

          .grade-badge {
            background: linear-gradient(45deg, #10b981, #059669);
            color: #000;
            font-size: 3rem;
            font-weight: 900;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
          }

          .audit-grade-card h3 {
            color: #10b981;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
          }

          .audit-grade-card p {
            color: #cccccc;
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
          }
        `}</style>
      </DocsLayout>
    </>
  );
}