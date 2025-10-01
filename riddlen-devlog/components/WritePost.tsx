'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { DEVLOG_CONTRACT, DEVLOG_ABI } from '@/lib/contract';

const CATEGORIES = ['general', 'oracle', 'dao', 'nft', 'frames', 'milestone', 'technical'];

export function WritePost({ onPostCreated }: { onPostCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState('');

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert('Title and content are required');
      return;
    }

    const tagsArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      writeContract({
        address: DEVLOG_CONTRACT,
        abi: DEVLOG_ABI,
        functionName: 'createPost',
        args: [title, content, category, tagsArray],
      });
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Check console for details.');
    }
  };

  // Reset form and notify parent when transaction succeeds
  if (isSuccess && hash) {
    setTimeout(() => {
      setTitle('');
      setContent('');
      setCategory('general');
      setTags('');
      setIsOpen(false);
      onPostCreated();
    }, 2000);
  }

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 bg-riddlen-purple hover:bg-riddlen-blue text-white rounded-lg transition-colors font-semibold"
        >
          ✍️ Write New Post
        </button>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 border border-riddlen-purple/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">✍️ New Devlog Post</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-riddlen-purple focus:outline-none"
                placeholder="Today's epic achievement..."
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-riddlen-purple focus:outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-riddlen-purple focus:outline-none"
                placeholder="v6.0, launch, milestone"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content (Markdown supported)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-riddlen-purple focus:outline-none font-mono text-sm"
                placeholder="## What we built today

- Oracle Network deployed
- DAO governance live
- **34,818 lines** of code

Feeling unstoppable! 🚀"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Supports markdown: **bold**, *italic*, `code`, links, lists, etc.
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isPending || isConfirming}
                className="flex-1 py-3 bg-riddlen-purple hover:bg-riddlen-blue text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Signing...' : isConfirming ? 'Publishing...' : isSuccess ? '✅ Published!' : '📝 Publish to Blockchain'}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>

            {isSuccess && (
              <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
                ✅ Post published on-chain! Transaction hash: {hash?.slice(0, 10)}...
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
