import { useState, useMemo, useEffect } from 'react';
import { Search, Bean, Wheat, Carrot, Apple, Nut, Ellipsis, EyeOff, Info, BarChart3 } from 'lucide-react';
import { FOODS } from '../data/foods';
import type { Food, FoodCategory, Season, TooltipMode } from '../types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FoodCard } from './FoodCard';
import { useLanguage } from '../hooks/useLanguage';

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
  tooltipMode: TooltipMode;
  onTooltipModeChange: (mode: TooltipMode) => void;
}

export function FoodSearch({ selectedIds, onToggle, tooltipMode, onTooltipModeChange }: Props) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<FoodCategory | 'tous'>('tous');
  const [phIndex, setPhIndex] = useState(0);

  const placeholders = useMemo(() => [
    t('foods.riz_complet') + '...',
    t('foods.tofu') + '...',
    t('foods.brocoli') + '...',
    t('foods.pois_chiches') + '...',
    t('foods.quinoa') + '...',
    t('foods.lentilles_vertes') + '...',
  ], [t]);

  const categories = useMemo(() => [
    { value: 'légumineuses' as const, icon: Bean, label: t('categories.légumineuses') },
    { value: 'céréales' as const, icon: Wheat, label: t('categories.céréales') },
    { value: 'légumes' as const, icon: Carrot, label: t('categories.légumes') },
    { value: 'fruits' as const, icon: Apple, label: t('categories.fruits') },
    { value: 'graines & noix' as const, icon: Nut, label: t('categories.graines & noix') },
    { value: 'autres' as const, icon: Ellipsis, label: t('categories.autres') },
  ], [t]);

  const tooltipModesList = useMemo(() => [
    { value: 'off' as const, label: t('foodSearch.tooltipModes.off'), icon: EyeOff },
    { value: 'simple' as const, label: t('foodSearch.tooltipModes.simple'), icon: Info },
    { value: 'advanced' as const, label: t('foodSearch.tooltipModes.advanced'), icon: BarChart3 },
  ], [t]);

  useEffect(() => {
    if (selectedIds.size > 0) return;
    const tInterval = setInterval(() => setPhIndex((i) => (i + 1) % placeholders.length), 2500);
    return () => clearInterval(tInterval);
  }, [selectedIds.size, placeholders.length]);

  const filtered = useMemo(() => FOODS.filter((f) => {
    const q = query.toLowerCase();
    const translatedName = t('foods.' + f.id).toLowerCase();
    const mq = !q || translatedName.includes(q);
    const mc = cat === 'tous' || f.category === cat;
    return mq && mc;
  }), [query, cat, t]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <h3 className="display-font text-base font-semibold text-[var(--text-h)] shrink-0">
          {t('foodSearch.title')}
        </h3>
        <div className="flex min-w-0 items-center gap-2 sm:ml-auto">
          <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)]" />
            <input
              id="food-search-input"
              type="text"
              placeholder={placeholders[phIndex]}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 w-full rounded-full bg-[var(--warm-100)] pl-8 pr-3 text-sm text-[var(--text-h)] outline-none transition-all focus:bg-[var(--bg-subtle)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          </div>
          <div className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-[var(--warm-100)] p-1" aria-label={t('foodSearch.tooltipModeLabel')}>
            {tooltipModesList.map((mode) => (
              <button
                key={mode.value}
                type="button"
                title={mode.label}
                aria-label={`Infobulles: ${mode.label}`}
                aria-pressed={tooltipMode === mode.value}
                onClick={() => onTooltipModeChange(mode.value)}
                className={clsx(
                  'flex h-6 w-6 items-center justify-center rounded-full transition-all',
                  tooltipMode === mode.value
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'text-[var(--text)] hover:bg-[var(--warm-200)] hover:text-[var(--text-h)]'
                )}
              >
                <mode.icon size={13} strokeWidth={2.2} />
              </button>
            ))}
          </div>
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
          {t('foodSearch.categoryTous')}
        </button>
        {categories.map((c) => (
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

