import { useState, useMemo } from 'react';
import { Search, Leaf } from 'lucide-react';
import { FOODS } from '../data/foods';
import { FoodCard } from './FoodCard';
import type { Food, FoodCategory, Season } from '../types';

const CATEGORIES: FoodCategory[] = [
  'légumineuses', 'céréales', 'légumes', 'fruits', 'graines & noix', 'autres',
];

interface Props {
  selectedIds: Set<string>;
  onToggle: (food: Food) => void;
  currentSeason: Season;
}

export function FoodSearch({ selectedIds, onToggle, currentSeason }: Props) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'tous'>('tous');
  const [seasonOnly, setSeasonOnly] = useState(false);

  const filtered = useMemo(() => {
    return FOODS.filter((f) => {
      const matchQuery = f.name.toLowerCase().includes(query.toLowerCase());
      const matchCat = activeCategory === 'tous' || f.category === activeCategory;
      const matchSeason = !seasonOnly || f.seasons.includes(currentSeason);
      return matchQuery && matchCat && matchSeason;
    });
  }, [query, activeCategory, seasonOnly, currentSeason]);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Rechercher un aliment…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-[#F0EBE0] rounded-xl text-stone-700 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-[#7C9A6E]/40"
        />
      </div>

      {/* Season toggle */}
      <button
        onClick={() => setSeasonOnly(!seasonOnly)}
        className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border transition-colors
          ${seasonOnly
            ? 'bg-[#7C9A6E] text-white border-[#7C9A6E]'
            : 'text-stone-600 border-stone-300 hover:border-[#7C9A6E]'
          }`}
      >
        <Leaf size={14} />
        De saison uniquement
      </button>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {(['tous', ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3 py-1 rounded-full capitalize transition-colors
              ${activeCategory === cat
                ? 'bg-stone-700 text-white'
                : 'bg-[#F0EBE0] text-stone-600 hover:bg-stone-200'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[420px] overflow-y-auto pr-1">
        {filtered.map((food) => (
          <FoodCard
            key={food.id}
            food={food}
            isSelected={selectedIds.has(food.id)}
            onToggle={onToggle}
            isInSeason={food.seasons.includes(currentSeason)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-3 text-center text-stone-400 py-8">
            Aucun aliment trouvé
          </p>
        )}
      </div>
    </div>
  );
}