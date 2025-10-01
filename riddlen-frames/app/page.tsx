'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import LiveStats from '../components/LiveStats';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-end mb-4">
            <ConnectButton />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🧠 Riddlen
          </h1>

          <p className="text-xl mb-8 text-gray-300">
            Solve Riddles, Earn Crypto
          </p>

          <p className="text-sm mb-8 text-gray-400 max-w-2xl mx-auto">
            Play on Farcaster • Powered by Polygon • Built with Web3
          </p>

          {/* Live Ecosystem Stats */}
          <LiveStats />

          <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/20 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Play Now</h2>

            <div className="grid gap-4">
              <Link
                href="/frames/riddle"
                className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 transition-all hover:scale-105"
              >
                <h3 className="text-xl font-bold mb-2">🎮 Current Riddle</h3>
                <p className="text-gray-400">View active riddle and mint NFTs</p>
              </Link>

              <Link
                href="/frames/leaderboard"
                className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 transition-all hover:scale-105"
              >
                <h3 className="text-xl font-bold mb-2">🏆 Leaderboard</h3>
                <p className="text-gray-400">Top RON scorers</p>
              </Link>

              <Link
                href="/frames/profile"
                className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 transition-all hover:scale-105"
              >
                <h3 className="text-xl font-bold mb-2">👤 Profile</h3>
                <p className="text-gray-400">Your stats and collection</p>
              </Link>

              <Link
                href="/frames/mint"
                className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 transition-all hover:scale-105"
              >
                <h3 className="text-xl font-bold mb-2">💎 Mint NFT</h3>
                <p className="text-gray-400">Mint riddle NFTs on-chain</p>
              </Link>

              <Link
                href="/frames/solve"
                className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 transition-all hover:scale-105"
              >
                <h3 className="text-xl font-bold mb-2">🧩 Solve Riddle</h3>
                <p className="text-gray-400">Submit your solutions</p>
              </Link>

              <Link
                href="/frames/airdrop"
                className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 border border-orange-500/30 rounded-xl p-6 transition-all hover:scale-105"
              >
                <h3 className="text-xl font-bold mb-2">🎁 Airdrop</h3>
                <p className="text-gray-400">Claim up to 15K RDLN</p>
              </Link>

              <Link
                href="/frames/validate"
                className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 hover:from-purple-500/20 hover:to-violet-500/20 border border-purple-500/30 rounded-xl p-6 transition-all hover:scale-105"
              >
                <h3 className="text-xl font-bold mb-2">🔮 Oracle Network</h3>
                <p className="text-gray-400">Validate & earn rewards</p>
              </Link>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 mb-8">
            <h3 className="text-lg font-bold mb-3 text-yellow-400">About Riddlen</h3>
            <p className="text-sm text-gray-300 mb-4">
              Riddlen is a decentralized riddle-solving game where players mint NFTs, solve riddles, and earn RDLN tokens.
              Built on Polygon with a deflationary tokenomics model and reputation system.
            </p>
          </div>

          {/* Resource Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Main Site */}
            <a
              href="https://riddlen.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all hover:scale-105"
            >
              <div className="text-4xl mb-3">🌐</div>
              <h4 className="text-lg font-bold text-white mb-2">Main Site</h4>
              <p className="text-sm text-gray-400">Play full game at riddlen.com</p>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/RiddlenBaba/riddlen"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all hover:scale-105"
            >
              <div className="text-4xl mb-3">💻</div>
              <h4 className="text-lg font-bold text-white mb-2">GitHub</h4>
              <p className="text-sm text-gray-400">Open source & audited code</p>
            </a>

            {/* Smart Contracts */}
            <a
              href="https://amoy.polygonscan.com/address/0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg rounded-xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all hover:scale-105"
            >
              <div className="text-4xl mb-3">📜</div>
              <h4 className="text-lg font-bold text-white mb-2">Contracts</h4>
              <p className="text-sm text-gray-400">View on PolygonScan</p>
            </a>

            {/* Documentation */}
            <a
              href="https://github.com/RiddlenBaba/riddlen/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all hover:scale-105"
            >
              <div className="text-4xl mb-3">📚</div>
              <h4 className="text-lg font-bold text-white mb-2">Docs</h4>
              <p className="text-sm text-gray-400">Learn how to play & earn</p>
            </a>
          </div>

          {/* Contract Addresses */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 mb-8">
            <h3 className="text-lg font-bold mb-4 text-yellow-400">Verified Smart Contracts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left text-xs">
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-gray-400 mb-1">RDLN Token</div>
                <a href="https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB" target="_blank" rel="noopener" className="text-yellow-400 hover:text-yellow-300 font-mono break-all">
                  0x133029184EC460F661d05b0dC57BFC916b4AB0eB
                </a>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-gray-400 mb-1">RON Reputation</div>
                <a href="https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635" target="_blank" rel="noopener" className="text-yellow-400 hover:text-yellow-300 font-mono break-all">
                  0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635
                </a>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-gray-400 mb-1">Riddle NFT</div>
                <a href="https://amoy.polygonscan.com/address/0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3" target="_blank" rel="noopener" className="text-yellow-400 hover:text-yellow-300 font-mono break-all">
                  0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3
                </a>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-gray-400 mb-1">Airdrop</div>
                <a href="https://amoy.polygonscan.com/address/0x330275259AfCeC8822A861ecbbdfD026dB1B0A13" target="_blank" rel="noopener" className="text-yellow-400 hover:text-yellow-300 font-mono break-all">
                  0x330275259AfCeC8822A861ecbbdfD026dB1B0A13
                </a>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 max-w-2xl mx-auto space-y-2">
            <p className="font-semibold">Network: Polygon Amoy Testnet</p>
            <p>Powered by Frames.js, Next.js, Wagmi, and Viem</p>
            <p className="pt-4 border-t border-gray-700/50">
              <strong>Legal Disclaimer:</strong> Riddlen is an independent game built on Farcaster protocol.
              Riddlen is not affiliated with, endorsed by, or sponsored by Farcaster, Merkle Manufactory,
              or any of their affiliates. Farcaster® is a registered trademark of Merkle Manufactory Inc.
            </p>
            <p className="pt-2">
              <strong>Risk Warning:</strong> This is deployed on testnet for demonstration purposes.
              Do not use real funds. Play at your own risk. Smart contracts are experimental.
            </p>
            <p className="pt-2 text-gray-600">
              © 2025 Riddlen. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
