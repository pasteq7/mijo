import { useState, useMemo, useEffect } from 'react';
import { Search, Bean, Wheat, Carrot, Apple, Nut, Ellipsis } from 'lucide-react';
import { FOODS } from '../data/foods';
import type { Food, FoodCategory, Season } from '../types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FoodCard } from './FoodCard';

const PLACEHOLDERS = ['Riz...', 'Tofu...', 'Brocoli...', 'Pois chiches...', 'Quinoa...', 'Lentilles...'];

const CATEGORIES: { value: FoodCategory; icon: typeof Bean; label: string }[] = [
  { value: 'légumineuses', icon: Bean, label: 'Légumineuses' },
  { value: 'céréales', icon: Wheat, label: 'Céréales' },
  { value: 'légumes', icon: Carrot, label: 'Légumes' },
  { value: 'fruits', icon: Apple, label: 'Fruits' },
  { value: 'graines & noix', icon: Nut, label: 'Graines & noix' },
  { value: 'autres', icon: Ellipsis, label: 'Autres' },
];

const MONTH_SEASON: Record<number, Season> = {
  3: 'printemps', 4: 'printemps', 5: 'printemps',
  6: 'ete', 7: 'ete', 8: 'ete',
  9: 'automne', 10: 'automne', 11: 'automne',
  12: 'hiver', 1: 'hiver', 2: 'hiver',
};
const currentSeason = MONTH_SEASON[new Date().getMonth() + 1]!;

interface Props {
  selectedIds: Set<string>;
  onToggle: (f: Food) => void;
  tooltipMode: 'simple' | 'advanced';
  onTooltipModeChange: (mode: 'simple' | 'advanced') => void;
}

export function FoodSearch({ selectedIds, onToggle, tooltipMode, onTooltipModeChange }: Props) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<FoodCategory | 'tous'>('tous');

  const [phIndex, setPhIndex] = useState(0);

  useEffect(() => {
    if (selectedIds.size > 0) return;
    const t = setInterval(() => setPhIndex((i) => (i + 1) % PLACEHOLDERS.length), 2500);
    return () => clearInterval(t);
  }, [selectedIds.size]);

  const filtered = useMemo(() => FOODS.filter((f) => {
    const q = query.toLowerCase();
    const mq = !q || f.name.toLowerCase().includes(q);
    const mc = cat === 'tous' || f.category === cat;
    return mq && mc;
  }), [query, cat]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <h3 className="display-font text-base font-semibold text-[var(--text-h)] shrink-0">
          Catalogue d'aliments
        </h3>
        <div className="flex min-w-0 items-center gap-2 sm:ml-auto">
          <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)]" />
            <input
              id="food-search-input"
              type="text"
              placeholder={PLACEHOLDERS[phIndex]}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 w-full rounded-full bg-[var(--warm-100)] pl-8 pr-3 text-sm text-[var(--text-h)] outline-none transition-all focus:bg-[var(--bg-subtle)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          </div>
          <button
            onClick={() => onTooltipModeChange(tooltipMode === 'simple' ? 'advanced' : 'simple')}
            className={clsx(
              'h-8 shrink-0 rounded-full px-3 text-[11px] font-medium transition-all',
              tooltipMode === 'advanced'
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'bg-[var(--warm-100)] text-[var(--text)] hover:bg-[var(--warm-200)] hover:text-[var(--text-h)]'
            )}
          >
            {tooltipMode === 'simple' ? 'Simple' : 'Avancé'}
          </button>
        </div>
      </div>

      <div className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-0.5">
        <button
          onClick={() => setCat('tous')}
          className={clsx(
            'h-7 shrink-0 rounded-full px-3 text-[11px] font-medium transition-all',
            cat === 'tous'
              ? 'bg-[var(--accent)] text-white shadow-sm'
              : 'bg-[var(--warm-100)] text-[var(--text)] hover:bg-[var(--warm-200)] hover:text-[var(--text-h)]'
          )}
        >
          Tous
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCat(c.value)}
            title={c.label}
            className={clsx(
              'flex h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium transition-all',
              cat === c.value
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'bg-[var(--warm-100)] text-[var(--text)] hover:bg-[var(--warm-200)] hover:text-[var(--text-h)]'
            )}
          >
            <c.icon size={14} />
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid max-h-[300px] grid-cols-2 content-start gap-1.5 overflow-y-auto pr-0.5 sm:grid-cols-3 lg:min-h-0 lg:max-h-none lg:flex-1 xl:grid-cols-4">
        <AnimatePresence>
          {filtered.map((food) => {
            const isSelected = selectedIds.has(food.id);
            const isInSeason = food.seasons.includes(currentSeason);
            return (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="h-full"
              >
                <FoodCard
                  food={food}
                  isSelected={isSelected}
                  onToggle={onToggle}
                  isInSeason={isInSeason}
                  tooltipMode={tooltipMode}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
