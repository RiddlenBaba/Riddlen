'use client';

import { DevlogPost } from '@/lib/contract';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

export function PostCard({ post }: { post: DevlogPost }) {
  const date = new Date(Number(post.timestamp) * 1000);

  return (
    <article className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-riddlen-purple/50 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">{post.title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>
              👤 {post.author.slice(0, 6)}...{post.author.slice(-4)}
            </span>
            <span>📅 {format(date, 'MMM d, yyyy')}</span>
            <span>⏰ {format(date, 'HH:mm')}</span>
            <span>🔗 Block #{post.blockNumber.toString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-riddlen-purple/20 text-riddlen-purple rounded-full text-sm">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="markdown mb-4">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
        <span>Post ID: {post.id.toString()}</span>
        <a
          href={`https://amoy.polygonscan.com/tx/${post.blockNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-riddlen-purple hover:text-riddlen-blue underline"
        >
          View on PolygonScan →
        </a>
      </div>
    </article>
  );
}
