import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Whitepaper() {
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);
  const [aiCopied, setAiCopied] = useState(false);
  const [toc, setToc] = useState([]);
  const [showToc, setShowToc] = useState(false);

  useEffect(() => {
    // Fetch the whitepaper content
    fetch('/riddlen-whitepaper-v5.1.md')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load whitepaper');
        }
        return response.text();
      })
      .then(text => {
        setMarkdown(text);
        // Generate table of contents from headers
        generateTOC(text);
      })
      .catch(err => {
        console.error('Error loading whitepaper:', err);
        setMarkdown('# Error Loading Whitepaper\n\nPlease try refreshing the page or visit the [GitHub version](https://github.com/RiddlenBaba/riddlen/blob/main/contracts/Riddlen-White-Paper-v5.1.md).');
      });
  }, []);

  const generateTOC = (text) => {
    const lines = text.split('\n');
    const tocItems = [];

    lines.forEach((line, index) => {
      // Match h2 and h3 headers (## and ###)
      const h2Match = line.match(/^##\s+(.+)/);
      const h3Match = line.match(/^###\s+(.+)/);

      if (h2Match) {
        const title = h2Match[1].replace(/\*\*/g, '').trim();
        const id = `section-${tocItems.length}`;
        tocItems.push({ level: 2, title, id, index });
      } else if (h3Match) {
        const title = h3Match[1].replace(/\*\*/g, '').trim();
        const id = `section-${tocItems.length}`;
        tocItems.push({ level: 3, title, id, index });
      }
    });

    setToc(tocItems);
  };

  const scrollToSection = (title) => {
    // Find all h2 and h3 elements and scroll to the matching one
    const headers = document.querySelectorAll('.markdown-content h2, .markdown-content h3');
    for (const header of headers) {
      if (header.textContent.includes(title.substring(0, 20))) {
        header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Riddlen-Whitepaper-v5.1.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printWhitepaper = () => {
    window.print();
  };

  const shareWithAI = () => {
    const aiPrompt = `Please analyze the following Riddlen v5.1 Whitepaper and help me understand it:

${markdown}

---

I'd like you to:
1. Summarize the key innovations and value propositions
2. Explain the tokenomics model (RDLN and RON)
3. Clarify how the progressive burn mechanism works
4. Describe the Proof-of-Solve consensus
5. Identify potential risks and opportunities

Please provide a comprehensive analysis.`;

    navigator.clipboard.writeText(aiPrompt);
    setAiCopied(true);
    setTimeout(() => setAiCopied(false), 3000);
  };

  return (
    <>
      <Head>
        <title>Riddlen Whitepaper v5.1 - Complete Economic Model</title>
        <meta name="description" content="Read the complete Riddlen v5.1 whitepaper: The Human Intelligence Protocol building decentralized human validation infrastructure on Polygon." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">📄</div>
        <div className="floating-riddle">🧠</div>
        <div className="floating-riddle">💎</div>
      </div>

      <Header currentPage="whitepaper" />

      <main className="whitepaper-main">
        <div className="container">
          {/* Header Section */}
          <div className="whitepaper-header">
            <h1 className="whitepaper-title">
              <i className="fas fa-file-alt"></i> Riddlen Whitepaper v5.1
            </h1>
            <p className="whitepaper-subtitle">
              The Human Intelligence Protocol - Complete Economic Model
            </p>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button onClick={shareWithAI} className="action-btn ai-btn">
                <i className={aiCopied ? "fas fa-check" : "fas fa-robot"}></i>
                {aiCopied ? 'Copied for AI!' : 'Share with AI'}
              </button>
              <button onClick={copyToClipboard} className="action-btn copy-btn">
                <i className={copied ? "fas fa-check" : "fas fa-copy"}></i>
                {copied ? 'Copied!' : 'Copy Markdown'}
              </button>
              <button onClick={downloadMarkdown} className="action-btn download-btn">
                <i className="fas fa-download"></i> Download MD
              </button>
              <button onClick={printWhitepaper} className="action-btn print-btn">
                <i className="fas fa-print"></i> Print
              </button>
              <a
                href="https://github.com/RiddlenBaba/riddlen/blob/main/contracts/Riddlen-White-Paper-v5.1.md"
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn github-btn"
              >
                <i className="fab fa-github"></i> View on GitHub
              </a>
            </div>
          </div>

          {/* Table of Contents */}
          {toc.length > 0 && (
            <div className="toc-container">
              <div className="toc-header">
                <h2><i className="fas fa-list"></i> Table of Contents</h2>
                <button onClick={() => setShowToc(!showToc)} className="toc-toggle">
                  <i className={showToc ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i>
                </button>
              </div>
              {showToc && (
                <div className="toc-tree">
                  {toc.map((item, index) => (
                    <div
                      key={index}
                      className={`toc-item toc-level-${item.level}`}
                      onClick={() => scrollToSection(item.title)}
                    >
                      <span className="toc-bullet">
                        {item.level === 2 ? '📖' : '📄'}
                      </span>
                      <span className="toc-title">{item.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Markdown Content */}
          <div className="markdown-content">
            {markdown ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            ) : (
              <div className="loading">
                <i className="fas fa-spinner fa-spin"></i> Loading whitepaper...
              </div>
            )}
          </div>

          {/* Back to Top Button */}
          <div className="back-to-top">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-back-top">
              <i className="fas fa-arrow-up"></i> Back to Top
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Riddlen Economy</h3>
              <p>The world's first Proof-of-Solve blockchain where human intellect powers decentralized finance through cryptographic riddles and NFT gaming.</p>
              <div className="social-links">
                <a href="https://x.com/RiddlenToken" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="https://t.me/RiddlenToken" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><i className="fab fa-telegram"></i></a>
                <a href="https://t.me/RiddlenCommunity" target="_blank" rel="noopener noreferrer" aria-label="Community"><i className="fas fa-users"></i></a>
                <a href="https://github.com/RiddlenBaba/riddlen/discussions" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
              </div>
            </div>
            <div className="footer-section">
              <h3>Platform</h3>
              <a href="/">Home</a>
              <a href="/game">Play Demo</a>
              <a href="/docs">Documentation</a>
              <a href="/dashboard">Dashboard</a>
              <a href="/whitepaper">Whitepaper</a>
            </div>
            <div className="footer-section">
              <h3>Smart Contracts</h3>
              <a href="https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB" target="_blank">RDLN Token</a>
              <a href="https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635" target="_blank">RON Token</a>
              <a href="https://amoy.polygonscan.com/address/0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3" target="_blank">Riddle NFT</a>
            </div>
            <div className="footer-section">
              <h3>Resources</h3>
              <a href="https://github.com/RiddlenBaba/riddlen" target="_blank">GitHub Repository</a>
              <a href="https://polygon.technology/" target="_blank">Polygon Network</a>
              <a href="https://faucet.polygon.technology/" target="_blank">Testnet Faucet</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Riddlen. The Web3 Riddle Economy. Built on Polygon with Proof-of-Solve.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @media print {
          .header, .footer, .action-buttons, .back-to-top, .floating-riddles {
            display: none !important;
          }
          .whitepaper-main {
            padding-top: 0 !important;
          }
          .markdown-content {
            background: white !important;
            border: none !important;
            color: black !important;
          }
          .markdown-content h1, .markdown-content h2, .markdown-content h3 {
            color: black !important;
          }
        }
      `}</style>

      <style jsx>{`
        .whitepaper-main {
          padding-top: 100px;
          padding-bottom: 4rem;
          min-height: 100vh;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .whitepaper-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05));
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .whitepaper-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .whitepaper-title i {
          color: #FFD700;
          -webkit-text-fill-color: #FFD700;
          margin-right: 0.5rem;
        }

        .whitepaper-subtitle {
          font-size: 1.1rem;
          color: #cccccc;
          margin-bottom: 2rem;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .action-btn {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          color: #FFD700;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .action-btn:hover {
          background: rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 215, 0, 0.2);
        }

        .ai-btn:hover { border-color: rgba(236, 72, 153, 0.5); color: #ec4899; }
        .copy-btn:hover { border-color: rgba(59, 130, 246, 0.5); color: #3b82f6; }
        .download-btn:hover { border-color: rgba(16, 185, 129, 0.5); color: #10b981; }
        .print-btn:hover { border-color: rgba(139, 92, 246, 0.5); color: #8b5cf6; }
        .github-btn:hover { border-color: rgba(255, 215, 0, 0.5); color: #FFD700; }

        .markdown-content {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.1);
          border-radius: 20px;
          padding: 3rem;
          margin-bottom: 2rem;
          line-height: 1.8;
          color: #e5e5e5;
        }

        .loading {
          text-align: center;
          padding: 4rem 0;
          font-size: 1.2rem;
          color: #FFD700;
        }

        .loading i {
          font-size: 2rem;
          margin-bottom: 1rem;
          display: block;
        }

        /* Markdown Styling */
        .markdown-content :global(h1) {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 2rem 0 1rem;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          border-bottom: 2px solid rgba(255, 215, 0, 0.2);
          padding-bottom: 0.5rem;
        }

        .markdown-content :global(h2) {
          font-size: 2rem;
          font-weight: 700;
          margin: 2.5rem 0 1rem;
          color: #FFD700;
          border-left: 4px solid #FFD700;
          padding-left: 1rem;
        }

        .markdown-content :global(h3) {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 2rem 0 1rem;
          color: #FFA500;
        }

        .markdown-content :global(h4) {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem;
          color: #FFD700;
        }

        .markdown-content :global(p) {
          margin-bottom: 1.2rem;
          color: #e5e5e5;
        }

        .markdown-content :global(strong) {
          color: #FFD700;
          font-weight: 700;
        }

        .markdown-content :global(ul),
        .markdown-content :global(ol) {
          margin: 1rem 0 1.5rem 2rem;
          color: #e5e5e5;
        }

        .markdown-content :global(li) {
          margin-bottom: 0.5rem;
        }

        .markdown-content :global(code) {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.2);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          color: #FFA500;
          font-size: 0.9em;
        }

        .markdown-content :global(pre) {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 10px;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .markdown-content :global(pre code) {
          background: none;
          border: none;
          padding: 0;
        }

        .markdown-content :global(blockquote) {
          border-left: 4px solid #FFD700;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          color: #cccccc;
          font-style: italic;
        }

        .markdown-content :global(hr) {
          border: none;
          border-top: 2px solid rgba(255, 215, 0, 0.2);
          margin: 2rem 0;
        }

        .markdown-content :global(a) {
          color: #FFD700;
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 215, 0, 0.3);
          transition: all 0.3s ease;
        }

        .markdown-content :global(a:hover) {
          color: #FFA500;
          border-bottom-color: #FFA500;
        }

        .markdown-content :global(table) {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          overflow-x: auto;
          display: block;
        }

        .markdown-content :global(th),
        .markdown-content :global(td) {
          border: 1px solid rgba(255, 215, 0, 0.2);
          padding: 0.75rem;
          text-align: left;
        }

        .markdown-content :global(th) {
          background: rgba(255, 215, 0, 0.1);
          color: #FFD700;
          font-weight: 700;
        }

        .markdown-content :global(td) {
          background: rgba(0, 0, 0, 0.2);
        }

        .back-to-top {
          text-align: center;
          margin: 2rem 0;
        }

        .btn-back-top {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-back-top:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(255, 215, 0, 0.4);
        }

        .footer {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          padding: 4rem 0 2rem;
          margin-top: 4rem;
          border-top: 1px solid rgba(255, 215, 0, 0.1);
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-section h3 {
          color: #FFD700;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .footer-section p,
        .footer-section a {
          color: #cccccc;
          text-decoration: none;
          margin-bottom: 0.5rem;
          display: block;
        }

        .footer-section a:hover {
          color: #FFD700;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-links a {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 215, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFD700;
          transition: all 0.3s ease;
        }

        .social-links a:hover {
          background: rgba(255, 215, 0, 0.3);
          transform: translateY(-2px);
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 215, 0, 0.1);
          color: #888;
        }

        /* Table of Contents Styles */
        .toc-container {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 165, 0, 0.08));
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 3rem;
          backdrop-filter: blur(10px);
        }

        .toc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .toc-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #FFD700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .toc-toggle {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          color: #FFD700;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.2rem;
        }

        .toc-toggle:hover {
          background: rgba(255, 215, 0, 0.2);
          transform: scale(1.05);
        }

        .toc-tree {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .toc-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.1);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toc-item:hover {
          background: rgba(255, 215, 0, 0.15);
          border-color: rgba(255, 215, 0, 0.4);
          transform: translateX(10px);
          box-shadow: 0 5px 20px rgba(255, 215, 0, 0.2);
        }

        .toc-level-2 {
          border-left: 3px solid #FFD700;
        }

        .toc-level-3 {
          padding-left: 2rem;
          border-left: 3px solid #FFA500;
        }

        .toc-bullet {
          font-size: 1.2rem;
          min-width: 24px;
        }

        .toc-title {
          color: #e5e5e5;
          font-weight: 500;
          line-height: 1.6;
        }

        .toc-level-2 .toc-title {
          font-weight: 600;
          color: #FFD700;
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .whitepaper-title {
            font-size: 1.8rem;
          }

          .whitepaper-subtitle {
            font-size: 1rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
            justify-content: center;
          }

          .markdown-content {
            padding: 1.5rem;
          }

          .markdown-content :global(h1) {
            font-size: 1.8rem;
          }

          .markdown-content :global(h2) {
            font-size: 1.5rem;
          }

          .markdown-content :global(h3) {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </>
  );
}