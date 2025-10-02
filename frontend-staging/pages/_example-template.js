/**
 * EXAMPLE PAGE TEMPLATE
 *
 * This is a starter template showing how to create new pages using PageTemplate.
 * Copy this file and modify it for your needs.
 *
 * To use: Copy this file to pages/your-page-name.js and customize
 */

import PageTemplate from '../components/PageTemplate';

export default function ExamplePage() {
  return (
    <PageTemplate
      title="Example Page - Riddlen"
      description="This is an example page showing how to use the PageTemplate component"
      currentPage="home"
      showFloatingRiddles={true}
      showFooter={true}
      containerMaxWidth="1200px"
    >

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Page Title Here</h1>
        <p className="hero-subtitle">Catchy subtitle or tagline</p>
        <div className="hero-cta">
          <a href="/game" className="btn-primary">Primary Action</a>
          <a href="/docs" className="btn-secondary">Secondary Action</a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">100M</div>
            <div className="stat-label">Stat Label</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4x</div>
            <div className="stat-label">Another Stat</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Third Stat</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Feature One</h3>
            <p>Description of your first feature. Make it compelling and clear.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Feature Two</h3>
            <p>Description of your second feature. Keep it concise and benefit-focused.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Feature Three</h3>
            <p>Description of your third feature. Highlight what makes it special.</p>
          </div>

        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <h2 className="section-title">Main Content</h2>
        <div className="content-box">
          <p>Add your main content here. This could be text, images, videos, or interactive components.</p>
          <p>The PageTemplate handles the header, footer, and overall page structure, so you just focus on your content.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of players earning RDLN by solving riddles</p>
          <a href="/game" className="btn-primary-large">Start Playing Now</a>
        </div>
      </section>

      <style jsx>{`
        /* Hero Section */
        .hero-section {
          padding: 6rem 0;
          text-align: center;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: #cccccc;
          margin-bottom: 2rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Buttons */
        .btn-primary {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(255, 215, 0, 0.4);
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
          display: inline-block;
        }

        .btn-secondary:hover {
          background: rgba(255, 215, 0, 0.1);
          transform: translateY(-2px);
        }

        .btn-primary-large {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          padding: 1.25rem 3rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .btn-primary-large:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(255, 215, 0, 0.5);
        }

        /* Stats Section */
        .stats-section {
          padding: 4rem 0;
          background: rgba(0, 0, 0, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 215, 0, 0.4);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #FFD700;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }

        .stat-label {
          font-size: 1rem;
          color: #cccccc;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Features Section */
        .features-section {
          padding: 6rem 0;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 3rem;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          border-color: rgba(255, 215, 0, 0.4);
          box-shadow: 0 20px 40px rgba(255, 215, 0, 0.1);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }

        .feature-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #FFD700;
        }

        .feature-card p {
          color: #cccccc;
          line-height: 1.6;
        }

        /* Content Section */
        .content-section {
          padding: 6rem 0;
          background: rgba(0, 0, 0, 0.2);
        }

        .content-box {
          background: rgba(255, 215, 0, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 3rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .content-box p {
          color: #cccccc;
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        /* CTA Section */
        .cta-section {
          padding: 6rem 0;
        }

        .cta-box {
          background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 99, 71, 0.2));
          border: 2px solid rgba(255, 215, 0, 0.5);
          border-radius: 20px;
          padding: 4rem 2rem;
          text-align: center;
          animation: pulse 3s ease-in-out infinite;
        }

        .cta-box h2 {
          color: #FFD700;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .cta-box p {
          color: #ffffff;
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.2rem;
          }

          .hero-cta {
            flex-direction: column;
            align-items: center;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .content-box {
            padding: 2rem;
          }

          .cta-box {
            padding: 3rem 1.5rem;
          }

          .cta-box h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </PageTemplate>
  );
}
