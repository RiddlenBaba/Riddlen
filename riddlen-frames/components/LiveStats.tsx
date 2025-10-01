'use client';

import { useEffect, useState } from 'react';

interface EcosystemStats {
  rdln: {
    totalSupply: string;
    burned: string;
    circulating: string;
  };
  ron: {
    totalSupply: string;
  };
  nft: {
    minted: number;
    available: number;
    maxSupply: number;
  };
  treasury: {
    grandPrize: string;
    airdropPool: string;
  };
  metrics: {
    tvl: string;
    riddlesSolved: number;
    activeUsers: number;
  };
}

export default function LiveStats() {
  const [stats, setStats] = useState<EcosystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/30 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-20 mb-3"></div>
            <div className="h-8 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8 mb-8">
      {/* Live Indicator */}
      <div className="flex items-center justify-center gap-2 text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm font-semibold">LIVE ON POLYGON AMOY</span>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* RDLN Token */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30">
          <div className="text-yellow-400 text-sm font-semibold mb-2">💰 RDLN TOKEN</div>
          <div className="text-3xl font-bold text-white mb-1">{stats.rdln.circulating}</div>
          <div className="text-xs text-gray-400">Circulating Supply</div>
          <div className="text-xs text-red-400 mt-2">🔥 {stats.rdln.burned} Burned</div>
        </div>

        {/* RON Reputation */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
          <div className="text-purple-400 text-sm font-semibold mb-2">🏅 RON REPUTATION</div>
          <div className="text-3xl font-bold text-white mb-1">{stats.ron.totalSupply}</div>
          <div className="text-xs text-gray-400">Total RON Earned</div>
          <div className="text-xs text-blue-400 mt-2">🎯 {stats.metrics.riddlesSolved} Riddles Solved</div>
        </div>

        {/* NFTs */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
          <div className="text-blue-400 text-sm font-semibold mb-2">🎫 RIDDLE NFTs</div>
          <div className="text-3xl font-bold text-white mb-1">{stats.nft.minted}</div>
          <div className="text-xs text-gray-400">Minted / {stats.nft.maxSupply} Total</div>
          <div className="text-xs text-green-400 mt-2">✨ {stats.nft.available} Available</div>
        </div>

        {/* Grand Prize */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
          <div className="text-green-400 text-sm font-semibold mb-2">🏆 GRAND PRIZE</div>
          <div className="text-3xl font-bold text-white mb-1">{stats.treasury.grandPrize}</div>
          <div className="text-xs text-gray-400">RDLN Pool</div>
          <div className="text-xs text-yellow-400 mt-2">💎 Growing Daily</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/20 backdrop-blur-lg rounded-xl p-4 border border-gray-700/30 text-center">
          <div className="text-2xl font-bold text-white">{stats.metrics.tvl}</div>
          <div className="text-xs text-gray-400">Total Value Locked (RDLN)</div>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-xl p-4 border border-gray-700/30 text-center">
          <div className="text-2xl font-bold text-white">{stats.treasury.airdropPool}</div>
          <div className="text-xs text-gray-400">Airdrop Pool (RDLN)</div>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-xl p-4 border border-gray-700/30 text-center">
          <div className="text-2xl font-bold text-white">{stats.metrics.activeUsers}</div>
          <div className="text-xs text-gray-400">Active Players</div>
        </div>
      </div>
    </div>
  );
}
