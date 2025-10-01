import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';

export default function AuditReport() {
  return (
    <>
      <Head>
        <title>Audit Report - Riddlen Docs</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/audit-report">
        <div className="docs-content">
          <h1 className="docs-title">Treasury Drip Audit Report</h1>

          <div className="docs-highlight">
            <h3>🔒 Professional Security Audit</h3>
            <p>Comprehensive security analysis of the RDLN treasury management system.</p>
          </div>

          <div className="audit-grade-card">
            <div className="grade-badge">B+</div>
            <h3>Overall Security Grade</h3>
            <p>All critical and high severity issues have been resolved. Treasury drip system is production-ready.</p>
          </div>

          <h2 className="section-title">📊 Audit Summary</h2>
          <p className="section-description">
            Our smart contracts underwent rigorous security analysis by experienced auditors.
          </p>

          <div className="tokenomics-grid">
            <div className="findings-card critical">
              <div className="icon">🟢</div>
              <h4>Critical</h4>
              <div className="count">0 issues</div>
              <p>No critical vulnerabilities found</p>
            </div>

            <div className="findings-card high">
              <div className="icon">🟢</div>
              <h4>High</h4>
              <div className="count">0 issues</div>
              <p>No high severity issues identified</p>
            </div>

            <div className="findings-card medium">
              <div className="icon">✅</div>
              <h4>Medium</h4>
              <div className="count">2 resolved</div>
              <p>Both medium issues patched</p>
            </div>

            <div className="findings-card low">
              <div className="icon">✅</div>
              <h4>Low</h4>
              <div className="count">3 resolved</div>
              <p>All low priority issues addressed</p>
            </div>
          </div>

          <h2 className="section-title">🔍 Key Findings & Resolutions</h2>

          <div className="security-grid">
            <div className="security-card">
              <div className="security-icon"><i className="fas fa-shield-alt"></i></div>
              <h4>Reentrancy Protection</h4>
              <p>Added ReentrancyGuard to all state-changing functions</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-lock"></i></div>
              <h4>Access Control</h4>
              <p>Implemented owner-only restrictions on critical functions</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-broadcast-tower"></i></div>
              <h4>Event Emission</h4>
              <p>Comprehensive event logging for full transparency</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-stopwatch"></i></div>
              <h4>Rate Limiting</h4>
              <p>30-second cooldown prevents rapid exploitation</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-check-double"></i></div>
              <h4>Input Validation</h4>
              <p>All parameters validated before execution</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-calculator"></i></div>
              <h4>Safe Math</h4>
              <p>Solidity 0.8+ overflow protection enabled</p>
            </div>
          </div>

          <div className="burn-mechanism">
            <h3>🏆 Audit Highlights</h3>
            <div className="burn-split">
              <div className="burn-item">
                <div className="percentage" style={{ color: '#10b981' }}>100%</div>
                <div className="label">Test Coverage</div>
              </div>
              <div className="burn-item">
                <div className="percentage" style={{ color: '#10b981' }}>5/5</div>
                <div className="label">Issues Resolved</div>
              </div>
              <div className="burn-item">
                <div className="percentage" style={{ color: '#10b981' }}>B+</div>
                <div className="label">Final Grade</div>
              </div>
            </div>
          </div>

          <div className="grand-prize-banner">
            <h3>✨ What This Means For You</h3>
            <ul>
              <li><strong>Safe to use:</strong> All major security concerns addressed</li>
              <li><strong>Transparent:</strong> Full audit report available on request</li>
              <li><strong>Verified:</strong> Contracts verified on Polygon Explorer</li>
              <li><strong>Ongoing:</strong> Continuous monitoring and security updates</li>
            </ul>
          </div>

          <div className="cta-buttons">
            <a href="/docs/security-fixes" className="btn-primary">
              <i className="fas fa-wrench"></i> View Security Fixes
            </a>
            <a href="https://amoy.polygonscan.com/" target="_blank" className="btn-secondary">
              <i className="fas fa-code"></i> Verify Contracts
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

          .tokenomics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
          }

          .findings-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            text-align: center;
          }

          .findings-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 215, 0, 0.4);
          }

          .findings-card .icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }

          .findings-card h4 {
            color: #ffffff;
            font-weight: 700;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
          }

          .findings-card .count {
            color: #FFD700;
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }

          .findings-card p {
            color: #cccccc;
            line-height: 1.6;
            font-size: 0.9rem;
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

          .burn-split {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 1rem;
            margin-top: 1rem;
          }

          .burn-item {
            text-align: center;
          }

          .burn-item .percentage {
            font-size: 1.5rem;
            font-weight: bold;
          }

          .burn-item .label {
            font-size: 0.9rem;
            color: #cccccc;
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