'use client';

const CATEGORIES = ['all', 'general', 'oracle', 'dao', 'nft', 'frames', 'milestone', 'technical'];

export function CategoryFilter({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-400 mb-3">Filter by category</h3>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected === cat
                ? 'bg-riddlen-purple text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
