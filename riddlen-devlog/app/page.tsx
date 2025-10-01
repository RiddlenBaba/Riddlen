'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { DEVLOG_CONTRACT, DEVLOG_ABI, DevlogPost } from '@/lib/contract';
import { PostCard } from '@/components/PostCard';
import { WritePost } from '@/components/WritePost';
import { Header } from '@/components/Header';
import { CategoryFilter } from '@/components/CategoryFilter';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Read total posts
  const { data: totalPosts } = useReadContract({
    address: DEVLOG_CONTRACT,
    abi: DEVLOG_ABI,
    functionName: 'getTotalPosts',
  });

  // Read recent posts
  const { data: posts, refetch } = useReadContract({
    address: DEVLOG_CONTRACT,
    abi: DEVLOG_ABI,
    functionName: 'getRecentPosts',
    args: [0n, 50n],
  });

  const handlePostCreated = () => {
    refetch();
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-8 p-6 bg-gray-800 rounded-lg border border-riddlen-purple/30">
          <h2 className="text-2xl font-bold mb-2 text-riddlen-purple">📊 Devlog Stats</h2>
          <p className="text-gray-300">
            Total Posts: <span className="font-bold text-white">{totalPosts?.toString() || '0'}</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            On-chain • Immutable • Public
          </p>
        </div>

        {/* Write Post (only for connected wallets with WRITER_ROLE) */}
        {isConnected && address && (
          <WritePost onPostCreated={handlePostCreated} />
        )}

        {/* Category Filter */}
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Posts Timeline */}
        <div className="space-y-6">
          {posts && posts.length > 0 ? (
            posts
              .filter((post: DevlogPost) =>
                selectedCategory === 'all' || post.category === selectedCategory
              )
              .map((post: DevlogPost) => (
                <PostCard key={post.id.toString()} post={post} />
              ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl mb-2">📝 No posts yet</p>
              <p className="text-sm">Connect your wallet to create the first post!</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 mt-12 border-t border-gray-800">
        <div className="text-center text-gray-400 text-sm">
          <p>On-chain microblog powered by Polygon • Immutable • Transparent</p>
          <p className="mt-2">
            Contract: {DEVLOG_CONTRACT ? (
              <a
                href={`https://amoy.polygonscan.com/address/${DEVLOG_CONTRACT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-riddlen-purple hover:text-riddlen-blue underline"
              >
                {DEVLOG_CONTRACT.slice(0, 6)}...{DEVLOG_CONTRACT.slice(-4)}
              </a>
            ) : 'Not deployed'}
          </p>
        </div>
      </footer>
    </div>
  );
}
