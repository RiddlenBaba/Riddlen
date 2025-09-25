import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';

export default function Introduction() {
  return (
    <>
      <Head>
        <title>Introduction - Riddlen Docs</title>
        <meta name="description" content="Learn about Riddlen, the Web3 riddle economy platform" />
      </Head>

      <DocsLayout currentPath="/docs/introduction">
        <div className="prose prose-invert max-w-none">
          <div className="not-prose mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium mb-6">
              🎯 Getting Started
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to Riddlen
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              The world's first Proof-of-Solve blockchain where human intellect powers decentralized finance through cryptographic riddles and NFT gaming.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 not-prose">
            <div className="docs-card">
              <div className="text-3xl mb-3" style={{
                textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
              }}>🧩</div>
              <h3 className="text-lg font-semibold text-white mb-2">Solve Riddles</h3>
              <p className="text-gray-300 text-sm">
                Mint riddle NFTs and use your intellect to solve cryptographic puzzles and earn RDLN tokens.
              </p>
            </div>

            <div className="docs-card">
              <div className="text-3xl mb-3" style={{
                textShadow: '0 0 20px rgba(255, 99, 71, 0.5)'
              }}>🔥</div>
              <h3 className="text-lg font-semibold text-white mb-2">Deflationary Economy</h3>
              <p className="text-gray-300 text-sm">
                Every transaction burns 50% of tokens while growing the Grand Prize jackpot.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">What is Riddlen?</h2>

          <p>
            Riddlen transforms traditional crypto participation into a puzzle-based experience where <strong>your mind is your miner</strong>.
            Instead of energy-intensive proof-of-work or stake-based validation, Riddlen introduces <strong>Proof-of-Solve</strong> -
            a novel consensus mechanism powered by human intelligence.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Core Concept</h3>

          <div className="docs-highlight">
            <p className="text-gray-300 italic mb-4" style={{
              fontSize: '1.1rem',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
            }}>
              "Every riddle is an NFT. Every solution unlocks value. Every transaction burns supply."
            </p>
            <p className="text-sm" style={{ color: '#FFD700' }}>
              This creates a sustainable economy where intellectual effort directly correlates to economic value.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">How It Works</h3>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="docs-step-number">1</div>
              <div>
                <h4 className="font-semibold text-white mb-2">Mint Riddle NFTs</h4>
                <p className="text-gray-300">
                  Pay 1 RDLN to mint an NFT containing a cryptographic riddle. 50% is burned, 25% goes to Grand Prize, 25% to Treasury.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="docs-step-number">2</div>
              <div>
                <h4 className="font-semibold text-white mb-2">Solve Puzzles</h4>
                <p className="text-gray-300">
                  Use your intellect to crack the riddle. Each attempt costs 1 RDLN with the same burn/prize/treasury split.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="docs-step-number">3</div>
              <div>
                <h4 className="font-semibold text-white mb-2">Earn Rewards</h4>
                <p className="text-gray-300">
                  First solvers get the largest rewards from locked prize vaults. Unclaimed tokens remain locked until solved.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 my-8">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">⚡</span>
              <h4 className="text-lg font-semibold text-orange-400">Proof-of-Solve Network</h4>
            </div>
            <p className="text-gray-300">
              Unlike energy-intensive mining or capital-based staking, Riddlen's consensus relies on human cognitive abilities.
              This creates a truly decentralized network where participation is based on intellect rather than resources.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Why Riddlen?</h3>

          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <span className="text-yellow-400 mt-1">•</span>
              <span><strong className="text-white">Sustainable Economics:</strong> Deflationary tokenomics with permanent supply reduction</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-yellow-400 mt-1">•</span>
              <span><strong className="text-white">Human-Centric:</strong> No energy waste, no capital requirements - just pure intellect</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-yellow-400 mt-1">•</span>
              <span><strong className="text-white">Growing Rewards:</strong> Every transaction increases the ultimate Grand Prize jackpot</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-yellow-400 mt-1">•</span>
              <span><strong className="text-white">Long-term Vision:</strong> 1,000 riddles over 20 years ensures sustainable growth</span>
            </li>
          </ul>

          <div className="border-t border-gray-700 pt-8 mt-12">
            <h3 className="text-xl font-semibold text-white mb-4">Ready to Start?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/docs/how-to-play" className="btn-docs-primary">
                Learn How to Play →
              </a>
              <a href="https://riddlen.org" target="_blank" className="btn-docs-secondary">
                Start Playing Now
              </a>
            </div>
          </div>
        </div>
      </DocsLayout>
    </>
  );
}