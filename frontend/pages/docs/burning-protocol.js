import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';
import Link from 'next/link';

export default function BurningProtocol() {
  return (
    <>
      <Head>
        <title>Burning Protocol - Riddlen Docs</title>
        <meta name="description" content="Understanding RDLN token burn mechanics" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <DocsLayout currentPath="/docs/burning-protocol">
        <div className="docs-content">
          <h1 className="docs-title">RDLN Burning Protocol</h1>

          <div className="docs-highlight">
            <h3><i className="fas fa-fire"></i> Deflationary Token Model</h3>
            <p>Every transaction permanently removes tokens from circulation while funding prizes and development</p>
          </div>

          <h2 className="section-title">Three-Way Split</h2>
          <p className="section-description">
            Every RDLN transaction (mint or solve attempt) follows a transparent distribution model that creates permanent scarcity.
          </p>

          <div className="tokenomics-grid">
            <div className="tokenomics-card burn-card">
              <div className="step-icon"><i className="fas fa-fire"></i></div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#FF6347', margin: '1rem 0' }}>50%</div>
              <h3>Permanently Burned</h3>
              <p>Removed from total supply forever, creating permanent deflationary pressure</p>
            </div>

            <div className="tokenomics-card prize-card">
              <div className="step-icon"><i className="fas fa-trophy"></i></div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#FFD700', margin: '1rem 0' }}>25%</div>
              <h3>Grand Prize Pool</h3>
              <p>Accumulates for legendary quarterly/annual riddles with massive jackpots</p>
            </div>

            <div className="tokenomics-card treasury-card">
              <div className="step-icon"><i className="fas fa-briefcase"></i></div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6', margin: '1rem 0' }}>25%</div>
              <h3>Treasury/Operations</h3>
              <p>Funds development, infrastructure, and long-term platform sustainability</p>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-calculator"></i> Burn Calculation Example</h2>
          <div className="burn-mechanism">
            <h3>User mints a Riddle NFT for 1,000 RDLN</h3>
            <div className="burn-split">
              <div className="burn-item burn-red">
                <div className="label">Burned Forever</div>
                <div className="percentage">500 RDLN</div>
              </div>
              <div className="burn-item burn-yellow">
                <div className="label">Added to Grand Prize</div>
                <div className="percentage">250 RDLN</div>
              </div>
              <div className="burn-item burn-blue">
                <div className="label">Treasury Funding</div>
                <div className="percentage">250 RDLN</div>
              </div>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-calendar-alt"></i> Biennial Halving Schedule</h2>
          <p className="section-description">
            The cost to mint riddle NFTs follows a Bitcoin-inspired halving schedule, reducing by 50% every 2 years over 20 years.
          </p>

          <div className="security-grid">
            <div className="security-card">
              <div className="security-icon"><i className="fas fa-calendar-alt"></i></div>
              <h4>Years 1-2</h4>
              <p><strong>1,000 RDLN</strong> per riddle</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>500 RDLN burned</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-calendar-alt"></i></div>
              <h4>Years 3-4</h4>
              <p><strong>500 RDLN</strong> per riddle</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>250 RDLN burned</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-calendar-alt"></i></div>
              <h4>Years 5-6</h4>
              <p><strong>250 RDLN</strong> per riddle</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>125 RDLN burned</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-calendar-alt"></i></div>
              <h4>Years 7-8</h4>
              <p><strong>125 RDLN</strong> per riddle</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>62.5 RDLN burned</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-ellipsis-h"></i></div>
              <h4>Continues...</h4>
              <p>Halving every 2 years</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Through year 20</p>
            </div>

            <div className="security-card">
              <div className="security-icon"><i className="fas fa-flag-checkered"></i></div>
              <h4>Years 19-20</h4>
              <p><strong>1.5 RDLN</strong> minimum</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>0.75 RDLN burned</p>
            </div>
          </div>

          <h2 className="section-title">Economic Impact</h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon"><i className="fas fa-chart-line-down"></i></div>
              <h3>Supply Reduction</h3>
              <p>Continuous decrease in total RDLN supply creates permanent scarcity</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon"><i className="fas fa-gem"></i></div>
              <h3>Value Appreciation</h3>
              <p>Remaining tokens become more valuable as supply decreases</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon"><i className="fas fa-infinity"></i></div>
              <h3>Long-term Sustainability</h3>
              <p>20-year economic model ensures platform longevity</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon"><i className="fas fa-trophy"></i></div>
              <h3>Grand Prize Growth</h3>
              <p>Massive jackpots accumulate for legendary riddle events</p>
            </div>
          </div>

          <h2 className="section-title"><i className="fas fa-eye"></i> Transparency</h2>
          <div className="grand-prize-banner">
            <h3>Track Burns in Real-Time</h3>
            <p>All burn transactions are publicly verifiable on the blockchain. You can track:</p>
            <ul>
              <li><strong>Total tokens burned:</strong> Check dead address balance</li>
              <li><strong>Grand Prize accumulation:</strong> Track prize wallet</li>
              <li><strong>Treasury operations:</strong> Transparent on-chain</li>
              <li><strong>All transactions:</strong> Verifiable on PolygonScan</li>
            </ul>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.9rem', color: '#cccccc', marginBottom: '0.5rem' }}>Dead Address:</div>
              <code style={{ color: '#10b981', fontSize: '0.9rem' }}>0x000000000000000000000000000000000000dEaD</code>
            </div>
          </div>

          <div className="cta-buttons">
            <Link href="/docs/tokenomics" className="btn-primary">
              <i className="fas fa-coins"></i> Full Tokenomics
            </Link>
            <Link href="/docs/nft-mechanics" className="btn-secondary">
              <i className="fas fa-cube"></i> NFT Mechanics
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

          .tokenomics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

          .burn-card {
            background: linear-gradient(135deg, rgba(255, 99, 71, 0.1), rgba(255, 0, 0, 0.05));
            border-color: rgba(255, 99, 71, 0.3);
          }

          .burn-card:hover {
            border-color: rgba(255, 99, 71, 0.5);
          }

          .prize-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
            border-color: rgba(255, 215, 0, 0.3);
          }

          .prize-card:hover {
            border-color: rgba(255, 215, 0, 0.5);
          }

          .treasury-card {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
            border-color: rgba(59, 130, 246, 0.3);
          }

          .treasury-card:hover {
            border-color: rgba(59, 130, 246, 0.5);
          }

          .step-icon {
            font-size: 3rem;
            color: #FFD700;
            margin-bottom: 1rem;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
          }

          .tokenomics-card h3 {
            color: #ffffff;
            font-weight: 700;
            font-size: 1.2rem;
          }

          .tokenomics-card p {
            color: #cccccc;
            line-height: 1.6;
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
            color: #FFD700;
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
          }

          .burn-split {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 1.5rem;
            margin-top: 1.5rem;
          }

          .burn-item {
            text-align: center;
            padding: 1.5rem;
            border-radius: 15px;
            min-width: 150px;
            transition: all 0.3s ease;
          }

          .burn-item:hover {
            transform: translateY(-5px);
          }

          .burn-red {
            background: rgba(255, 99, 71, 0.2);
            border: 1px solid rgba(255, 99, 71, 0.3);
          }

          .burn-yellow {
            background: rgba(255, 215, 0, 0.2);
            border: 1px solid rgba(255, 215, 0, 0.3);
          }

          .burn-blue {
            background: rgba(59, 130, 246, 0.2);
            border: 1px solid rgba(59, 130, 246, 0.3);
          }

          .burn-item .label {
            font-size: 0.9rem;
            color: #cccccc;
            margin-bottom: 0.75rem;
          }

          .burn-item .percentage {
            font-size: 1.5rem;
            font-weight: bold;
            color: #ffffff;
          }

          .security-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
            position: relative;
            text-align: center;
          }

          .step-card:hover {
            transform: translateY(-10px);
            border-color: rgba(255, 215, 0, 0.4);
            box-shadow: 0 20px 40px rgba(255, 215, 0, 0.1);
          }

          .step-number {
            position: absolute;
            top: -15px;
            left: 20px;
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: #000;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9rem;
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
            text-align: center;
            margin-bottom: 1rem;
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

            .tokenomics-grid {
              grid-template-columns: 1fr;
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