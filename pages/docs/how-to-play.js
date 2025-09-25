import DocsLayout from '../../components/DocsLayout';
import Head from 'next/head';

export default function HowToPlay() {
  return (
    <>
      <Head>
        <title>How to Play - Riddlen Docs</title>
        <meta name="description" content="Complete guide to playing Riddlen and earning RDLN tokens" />
      </Head>

      <DocsLayout currentPath="/docs/how-to-play">
        <div className="prose prose-invert max-w-none">
          <div className="not-prose mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              🎮 Game Guide
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              How to Play Riddlen
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Master the art of Proof-of-Solve and earn RDLN tokens through intelligent gameplay.
            </p>
          </div>

          <div className="docs-highlight not-prose">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3" style={{
                textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
              }}>🏆</span>
              <h3 className="text-lg font-semibold" style={{
                color: '#FFD700',
                textShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
              }}>Win Big with Your Brain</h3>
            </div>
            <p className="text-gray-300 mb-3">
              Every riddle you solve contributes to the growing Grand Prize wallet. 25% of every transaction automatically increases the ultimate jackpot.
            </p>
            <div className="text-sm" style={{ color: '#FFD700' }}>
              Current Grand Prize Pool: <strong>Growing with every transaction</strong>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Step-by-Step Guide</h2>

          <div className="space-y-8">
            <div className="docs-step">
              <div className="flex items-center mb-4">
                <div className="docs-step-number">1</div>
                <h3 className="text-xl font-semibold text-white">Connect Your Wallet</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Start by connecting your Web3 wallet (MetaMask recommended). Make sure you're on the Ethereum network.
              </p>
              <div className="bg-gray-900/50 border border-gray-600 rounded p-4">
                <code className="text-green-400 text-sm">
                  Network: Ethereum Mainnet<br/>
                  Required: ETH for gas fees + RDLN tokens for gameplay
                </code>
              </div>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center font-bold mr-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white">Acquire RDLN Tokens</h3>
              </div>
              <p className="text-gray-300 mb-4">
                You'll need RDLN tokens to mint riddle NFTs and submit solution attempts.
              </p>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Check available liquidity pools</li>
                <li>• Participate in community airdrops</li>
                <li>• Earn through successful riddle solving</li>
              </ul>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center font-bold mr-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white">Mint a Riddle NFT</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Pay 1 RDLN to mint an NFT containing a cryptographic riddle. This automatically splits your payment:
              </p>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="bg-red-500/20 border border-red-500/30 rounded p-3">
                  <div className="text-red-400 font-bold text-lg">50%</div>
                  <div className="text-gray-300">Burned Forever</div>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded p-3">
                  <div className="text-yellow-400 font-bold text-lg">25%</div>
                  <div className="text-gray-300">Grand Prize</div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded p-3">
                  <div className="text-blue-400 font-bold text-lg">25%</div>
                  <div className="text-gray-300">Treasury</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center font-bold mr-4">
                  4
                </div>
                <h3 className="text-xl font-semibold text-white">Study the Riddle</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Each riddle NFT contains a unique cryptographic puzzle. Take time to analyze:
              </p>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Pattern recognition elements</li>
                <li>• Cryptographic hints and clues</li>
                <li>• Mathematical relationships</li>
                <li>• Historical context or references</li>
              </ul>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center font-bold mr-4">
                  5
                </div>
                <h3 className="text-xl font-semibold text-white">Submit Your Solution</h3>
              </div>
              <p className="text-gray-300 mb-4">
                When you're ready to attempt a solution, pay 1 RDLN per attempt. Each attempt follows the same burn mechanics.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-4 mt-4">
                <p className="text-yellow-400 text-sm">
                  <strong>Strategy Tip:</strong> Study carefully before attempting. Each wrong answer costs 1 RDLN and reduces available supply!
                </p>
              </div>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 text-black rounded-full flex items-center justify-center font-bold mr-4">
                  6
                </div>
                <h3 className="text-xl font-semibold text-white">Claim Your Rewards</h3>
              </div>
              <p className="text-gray-300 mb-4">
                First solvers receive the largest portion of the locked prize vault for that riddle. Rewards are distributed based on:
              </p>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Speed of solution (first solver gets most)</li>
                <li>• Complexity of the riddle solved</li>
                <li>• Total attempts by all players on that riddle</li>
                <li>• Accumulated prize vault for that specific riddle</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 my-8 not-prose">
            <h3 className="text-lg font-semibold text-purple-400 mb-3">Advanced Strategy</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>• <strong>Portfolio Approach:</strong> Work on multiple riddles simultaneously</p>
              <p>• <strong>Community Learning:</strong> Join Discord discussions for hints and strategies</p>
              <p>• <strong>Long-term Thinking:</strong> Some riddles may take weeks or months to solve</p>
              <p>• <strong>Risk Management:</strong> Don't spend all your RDLN on a single riddle</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">Game Economics</h2>

          <p>
            Every action in Riddlen contributes to a deflationary economy that benefits all players:
          </p>

          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 my-6">
            <h4 className="font-semibold text-white mb-3">Transaction Flow</h4>
            <div className="text-sm text-gray-300 space-y-2">
              <div className="flex justify-between">
                <span>Mint Riddle NFT:</span>
                <span className="text-yellow-400">1 RDLN</span>
              </div>
              <div className="flex justify-between">
                <span>Solution Attempt:</span>
                <span className="text-yellow-400">1 RDLN</span>
              </div>
              <div className="flex justify-between">
                <span>Burned per transaction:</span>
                <span className="text-red-400">0.5 RDLN</span>
              </div>
              <div className="flex justify-between">
                <span>Added to Grand Prize:</span>
                <span className="text-green-400">0.25 RDLN</span>
              </div>
              <div className="flex justify-between">
                <span>Treasury funding:</span>
                <span className="text-blue-400">0.25 RDLN</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 mt-12">
            <h3 className="text-xl font-semibold text-white mb-4">Ready to Play?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://riddlen.org"
                target="_blank"
                className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
              >
                Start Playing Now →
              </a>
              <a
                href="/docs/riddle-nfts"
                className="inline-flex items-center px-6 py-3 border border-gray-600 hover:border-gray-500 text-white font-semibold rounded-lg transition-colors"
              >
                Learn About Riddle NFTs
              </a>
            </div>
          </div>
        </div>
      </DocsLayout>
    </>
  );
}