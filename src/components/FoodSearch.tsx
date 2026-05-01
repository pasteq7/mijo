import { useState, useMemo, type FC } from 'react';
import { Search } from 'lucide-react';
import { FOODS } from '../data/foods';
import type { Food, FoodCategory, Season } from '../types';
import { FoodCard } from './FoodCard';
import clsx from 'clsx';

const CATEGORIES: FoodCategory[] = ['légumineuses', 'céréales', 'légumes', 'fruits', 'graines & noix', 'autres'];

interface Props {
  selectedIds: Set<string>;
  onToggle: (f: Food) => void;
  currentSeason: Season;
}

export const FoodSearch: FC<Props> = ({ selectedIds, onToggle, currentSeason }) => {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<FoodCategory | 'tous'>('tous');

  const filtered = useMemo(() => FOODS.filter((f) => {
    const q = query.toLowerCase();
    const mq = !q || f.name.toLowerCase().includes(q);
    const mc = cat === 'tous' || f.category === cat;
    return mq && mc;
  }), [query, cat]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[--text]" />
        <input
          type="text"
          placeholder="Rechercher…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-2.5 text-xs bg-[--warm-100] text-[--text-h] rounded-xl outline-none focus:ring-2 focus:ring-[--accent-soft] focus:bg-white transition-all shadow-inner"
        />
      </div>

      <div className="flex flex-wrap gap-1">
        {(['tous', ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={clsx(
              'text-[10px] px-2.5 py-1.5 rounded-lg transition-colors font-medium',
              cat === c ? 'bg-[--text-h] text-white shadow-sm' : 'bg-[--warm-100] text-[--text] hover:bg-[--warm-200] hover:text-[--text-h]'
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filtered.map((f) => (
          <FoodCard 
            key={f.id} 
            food={f} 
            isSelected={selectedIds.has(f.id)} 
            onToggle={onToggle}
            isInSeason={f.seasons.includes(currentSeason)}
          />
        ))}
      </div>
    </div>
  );
};