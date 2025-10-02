import Head from 'next/head';
import Header from '../components/Header';
import GlobalStyles from '../components/GlobalStyles';

export default function FAQ() {
  return (
    <>
      <Head>
        <title>FAQ - Frequently Asked Questions | Riddlen</title>
        <meta name="description" content="Get answers to common questions about Riddlen, RDLN and RON tokens, airdrop, Oracle Network, governance, and more." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <GlobalStyles />

      <div className="floating-riddles">
        <div className="floating-riddle">❓</div>
        <div className="floating-riddle">💡</div>
        <div className="floating-riddle">🎯</div>
      </div>

      <Header currentPage="faq" />

      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <section className="faq-hero">
          <div className="container">
            <h1 className="page-title">Frequently Asked Questions</h1>
            <p className="page-subtitle">Everything you need to know about Riddlen</p>
          </div>
        </section>

        <section className="faq-content">
          <div className="container">
            <div className="faq-grid">
              <div className="faq-item">
                <h4>❓ What is Riddlen?</h4>
                <p>Riddlen is the first blockchain game where you earn crypto by solving riddles. Your intelligence becomes currency through our Proof-of-Solve consensus mechanism. No mining, no staking—just solve puzzles and earn.</p>
              </div>

              <div className="faq-item">
                <h4>🚀 How do I start playing?</h4>
                <p>Connect your MetaMask wallet, get testnet MATIC from the Polygon faucet, and head to the game page. No registration, no KYC—just connect and play!</p>
              </div>

              <div className="faq-item">
                <h4>💰 What's the difference between RDLN and RON?</h4>
                <p>RDLN is the tradeable utility token you earn and spend. RON is soul-bound reputation (non-transferable) that gives you voting power and unlocks higher difficulty riddles. You need both!</p>
              </div>

              <div className="faq-item">
                <h4>⚡ Why do early solvers earn more?</h4>
                <p>Our revolutionary tiered reward system (2x/1x/0.5x) creates urgency and prevents hoarding. First 25% of solvers earn double, last 25% earn half. First solver can earn 4x more than last!</p>
              </div>

              <div className="faq-item">
                <h4>🌐 Is this on mainnet?</h4>
                <p>We're currently on Polygon Amoy testnet with all 6 contracts deployed and operational. Oracle network is live, airdrop is active, 200+ tests passing, and first NFTs are minting soon!</p>
              </div>

              <div className="faq-item">
                <h4>🤝 How can I contribute?</h4>
                <p>Join our community, become a tester, validate data through the Oracle Network, or contribute code on GitHub. Early contributors get airdrop rewards and recognition!</p>
              </div>

              <div className="faq-item">
                <h4>🔮 What is the Oracle Network?</h4>
                <p>The Oracle Network lets high-reputation users (validators) earn RDLN by verifying data for enterprises. Build RON reputation, unlock validator tiers (Bronze to Platinum), and turn your intelligence into income.</p>
              </div>

              <div className="faq-item">
                <h4>🎁 How does the airdrop work?</h4>
                <p>100M RDLN distributed through 3 phases: Social Proof (5K RDLN), RON Reputation (2K-5K), and Validation Work (up to 5K). 15K max per wallet. Multiple ways to earn!</p>
              </div>

              <div className="faq-item">
                <h4>🛡️ Is the treasury rug-proof?</h4>
                <p>Yes! Immutable smart contract protections: fixed 1M RDLN/month operations, max 5M emergency/year with 1-year cooldown. No surprise token dumps possible. All constants are locked.</p>
              </div>

              <div className="faq-item">
                <h4>🏆 What are the validator tiers?</h4>
                <p>Bronze (100 RON), Silver (1K RON), Gold (10K RON), Platinum (100K RON). Higher tiers access better-paying validation requests. Build your reputation to climb tiers!</p>
              </div>

              <div className="faq-item">
                <h4>🗳️ How does governance work?</h4>
                <p>1 RON = 1 Vote in the DAO. RON is soul-bound (non-transferable), so voting power can't be bought—only earned. Propose changes, vote on protocol decisions, shape the future.</p>
              </div>

              <div className="faq-item">
                <h4>🔥 What happens to burned tokens?</h4>
                <p>Every transaction splits: 50% burned forever, 25% to grand prize pool, 25% to operations. Failed solve attempts also burn progressively (1st=1 RDLN, 2nd=2 RDLN, etc.). Deflationary by design.</p>
              </div>

              <div className="faq-item">
                <h4>⏰ What is biennial halving?</h4>
                <p>Rewards reduce by 50% every 2 years (Year 1-2: 100%, Year 3-4: 50%, Year 5-6: 25%, etc.). Creates long-term scarcity and value appreciation, similar to Bitcoin halving.</p>
              </div>

              <div className="faq-item">
                <h4>🎮 How do riddle NFTs work?</h4>
                <p>Riddle NFTs are interactive game assets. Mint with RDLN, solve the puzzle, earn tiered rewards + RON reputation. Each NFT is a playable challenge, not just a static image.</p>
              </div>

              <div className="faq-item">
                <h4>💡 What prevents brute force attacks?</h4>
                <p>30-second anti-cheat timer between minting and solving. Progressive burn penalty on wrong answers (costs more each time). Both discourage random guessing and bot attacks.</p>
              </div>

              <div className="faq-item">
                <h4>📊 Where can I see live contracts?</h4>
                <p>All contracts are verified on Polygon Amoy: RDLN, RON, RiddleNFT, Airdrop, Oracle Network, and DAO. Check riddlen.org for addresses and PolygonScan links.</p>
              </div>

              <div className="faq-item">
                <h4>🔗 What blockchain does Riddlen use?</h4>
                <p>Polygon (Amoy testnet currently). Low gas fees, fast transactions, EVM-compatible, and eco-friendly PoS consensus. Perfect for a gaming economy!</p>
              </div>

              <div className="faq-item">
                <h4>💻 Can developers integrate Riddlen?</h4>
                <p>Yes! Complete integration docs at riddlen.org. Use Wagmi v2, Viem, or Ethers.js. All ABIs available, contracts verified, examples provided. Build on Riddlen!</p>
              </div>

              <div className="faq-item">
                <h4>🎯 When is mainnet launch?</h4>
                <p>After successful testnet testing, security audit, and community validation. We're still early—help us test, earn airdrop rewards, and be part of the journey!</p>
              </div>

              <div className="faq-item">
                <h4>👥 How big is the community?</h4>
                <p>Growing daily! Join our Telegram, follow on Twitter, contribute on GitHub. Early community members get special recognition and larger airdrop allocations.</p>
              </div>

              <div className="faq-item">
                <h4>🔒 Is RON truly soul-bound?</h4>
                <p>Yes! RON tokens are permanently locked to your wallet—no transfers, no trades. This prevents vote buying and ensures governance power is earned, not purchased. True merit-based system.</p>
              </div>

              <div className="faq-item">
                <h4>💵 Where can I buy RDLN?</h4>
                <p>Not yet! We're on testnet. After mainnet launch, RDLN will be available on DEXs. 100M RDLN liquidity pool locked for 10 years ensures permanent market depth.</p>
              </div>

              <div className="faq-item">
                <h4>🎭 What is Farcaster integration?</h4>
                <p>We've built a Farcaster Frames mini-app at frames.riddlen.com! Play Riddlen directly in Warpcast with gasless onboarding. Follow @Riddlen on Farcaster to join our community.</p>
              </div>

              <div className="faq-item">
                <h4>🌟 What makes Riddlen different?</h4>
                <p>First blockchain game where intelligence = currency. Tiered rewards favor speed, soul-bound reputation prevents vote buying, rug-proof treasury protects holders, and Oracle Network creates sustainable income.</p>
              </div>

              <div className="faq-item">
                <h4>📈 What is the total supply of RDLN?</h4>
                <p>1 Billion RDLN total. 70% locked in riddle prizes, 10% treasury (8+ years runway), 10% airdrop, 10% liquidity. Deflationary through burns—supply decreases over time!</p>
              </div>

              <div className="faq-item">
                <h4>🔄 Can I earn both RDLN and RON?</h4>
                <p>Yes! Solving riddles earns both RDLN (tradeable rewards) and RON (soul-bound reputation). RDLN is your money, RON is your power. You need both to maximize earnings and governance influence.</p>
              </div>

              <div className="faq-item">
                <h4>⚙️ How does validation work?</h4>
                <p>Build 1,000+ RON, become a validator, stake RON on your answer, earn rewards when consensus is reached. Multiple validators (e.g., 5 of 7) must agree for payout. Wrong answers lose staked RON.</p>
              </div>

              <div className="faq-item">
                <h4>🎁 How do I claim Phase 1 airdrop?</h4>
                <p>Join Farcaster (@Riddlen), cast about us, submit your username on riddlen.com, get verified, claim 5,000 RDLN. First 6,600 participants only. Bot prevention through human verification.</p>
              </div>

              <div className="faq-item">
                <h4>💼 Who's behind Riddlen?</h4>
                <p>Built by blockchain developers passionate about merit-based systems. All code is open source on GitHub. Progressive decentralization planned—founder role transfers to DAO over time.</p>
              </div>

              <div className="faq-item">
                <h4>🔐 Is Riddlen secure?</h4>
                <p>Yes! 200+ tests passing, OpenZeppelin patterns, anti-cheat mechanisms, rug-proof treasury, and professional audit planned. All contracts verified on PolygonScan. Security is our priority.</p>
              </div>
            </div>

            {/* Still Have Questions CTA */}
            <div className="help-section">
              <h2>Still Have Questions?</h2>
              <p>Join our community and get help from the Riddlen team and fellow players</p>
              <div className="help-buttons">
                <a href="https://t.me/RiddlenToken" target="_blank" className="help-btn telegram">
                  <i className="fab fa-telegram"></i> Ask on Telegram
                </a>
                <a href="https://twitter.com/RiddlenToken" target="_blank" className="help-btn twitter">
                  <i className="fab fa-twitter"></i> Follow on Twitter
                </a>
                <a href="https://github.com/RiddlenBaba/riddlen/discussions" target="_blank" className="help-btn github">
                  <i className="fab fa-github"></i> GitHub Discussions
                </a>
                <a href="https://riddlen.org" target="_blank" className="help-btn docs">
                  <i className="fas fa-book"></i> Technical Docs
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .faq-hero {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          padding: 4rem 0 3rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }

        .page-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .page-subtitle {
          font-size: 1.3rem;
          color: #cccccc;
        }

        .faq-content {
          padding: 4rem 0;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .faq-item {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 15px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          border-color: rgba(255, 215, 0, 0.4);
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(255, 215, 0, 0.1);
        }

        .faq-item h4 {
          color: #FFD700;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .faq-item p {
          color: #cccccc;
          line-height: 1.7;
          font-size: 1.05rem;
        }

        .help-section {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
        }

        .help-section h2 {
          color: #FFD700;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .help-section > p {
          color: #cccccc;
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        .help-buttons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .help-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .help-btn.telegram {
          background: linear-gradient(45deg, #0088cc, #00a8e6);
          color: #ffffff;
        }

        .help-btn.telegram:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 136, 204, 0.4);
        }

        .help-btn.twitter {
          background: linear-gradient(45deg, #1DA1F2, #1a8cd8);
          color: #ffffff;
        }

        .help-btn.twitter:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(29, 161, 242, 0.4);
        }

        .help-btn.github {
          background: linear-gradient(45deg, #333, #555);
          color: #ffffff;
        }

        .help-btn.github:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(51, 51, 51, 0.4);
        }

        .help-btn.docs {
          background: transparent;
          color: #FFD700;
          border: 2px solid #FFD700;
        }

        .help-btn.docs:hover {
          background: rgba(255, 215, 0, 0.1);
          transform: translateY(-3px);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }

          .faq-grid {
            grid-template-columns: 1fr;
          }

          .help-buttons {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </>
  );
}
