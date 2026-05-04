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
    <div className="space-y-4 lg:space-y-0 lg:flex lg:flex-col lg:gap-4 lg:flex-1 lg:min-h-0">
      <div className="flex items-center gap-2">
        <h3 className="display-font text-base font-semibold text-[var(--text-h)] shrink-0">
          Catalogue d'aliments
        </h3>
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative max-w-60">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text)]" />
            <input
              type="text"
              placeholder={PLACEHOLDERS[phIndex]}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-[var(--warm-100)] text-[var(--text-h)] rounded-full outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:bg-[var(--bg-subtle)] transition-all"
            />
          </div>
          <button
            onClick={() => onTooltipModeChange(tooltipMode === 'simple' ? 'advanced' : 'simple')}
            className={clsx(
              'text-[11px] px-3 py-1.5 rounded-full transition-all font-medium shrink-0',
              tooltipMode === 'advanced'
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'bg-[var(--warm-100)] text-[var(--text)] hover:bg-[var(--warm-200)] hover:text-[var(--text-h)]'
            )}
          >
            {tooltipMode === 'simple' ? 'Simple' : 'Avancé'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setCat('tous')}
          className={clsx(
            'text-[11px] px-4 py-1.5 rounded-full transition-all font-medium',
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
              'flex items-center gap-1.5 text-[11px] px-3.5 py-1.5 rounded-full transition-all font-medium',
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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] lg:max-h-none lg:flex-1 lg:min-h-0 overflow-y-auto pr-0.5">
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
