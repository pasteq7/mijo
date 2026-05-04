import { useState, useMemo, useEffect, type FC } from 'react';
import { Search, Bean, Wheat, Carrot, Apple, Nut, Ellipsis, List, Columns2, Sparkles } from 'lucide-react';
import { StepIndicator } from './StepIndicator';
import { FOODS } from '../data/foods';
import type { Food, FoodCategory, Season } from '../types';
import type { FoodSuggestion } from '../utils/recommendations';
import { FoodCard } from './FoodCard';
import { NutrientSuggestions } from './NutrientSuggestions';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const PLACEHOLDERS = ['Riz...', 'Tofu...', 'Brocoli...', 'Pois chiches...', 'Quinoa...', 'Lentilles...'];

const CATEGORIES: { value: FoodCategory; icon: typeof Bean; label: string }[] = [
  { value: 'légumineuses', icon: Bean, label: 'Légumineuses' },
  { value: 'céréales', icon: Wheat, label: 'Céréales' },
  { value: 'légumes', icon: Carrot, label: 'Légumes' },
  { value: 'fruits', icon: Apple, label: 'Fruits' },
  { value: 'graines & noix', icon: Nut, label: 'Graines & noix' },
  { value: 'autres', icon: Ellipsis, label: 'Autres' },
];

interface Props {
  selectedIds: Set<string>;
  onToggle: (f: Food) => void;
  currentSeason: Season;
  suggestions: FoodSuggestion[];
  onAddFood: (id: string) => void;
}

export const FoodSearch: FC<Props> = ({ selectedIds, onToggle, currentSeason, suggestions, onAddFood }) => {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<FoodCategory | 'tous'>('tous');
  const [tooltipMode, setTooltipMode] = useState<'simple' | 'advanced'>('simple');
  const [tab, setTab] = useState<'search' | 'suggestions'>('search');

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

  const hasSuggestions = suggestions.length > 0 && selectedIds.size > 0;


  return (
    <div className="space-y-2">
      <StepIndicator step={1} label="Rechercher" />
      <div className="flex border-b border-[var(--border)] gap-6">
        <button
          onClick={() => setTab('search')}
          className={clsx(
            "px-1 py-2 text-xs font-medium transition-all relative",
            tab === 'search' ? "text-[var(--text-h)]" : "text-[var(--text)] hover:text-[var(--text-h)]"
          )}
        >
          Recherche
          {tab === 'search' && (
            <motion.div
              layoutId="foodSearchTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            />
          )}
        </button>
        <button
          onClick={() => setTab('suggestions')}
          className={clsx(
            "px-1 py-2 text-xs font-medium transition-all relative flex items-center gap-1.5",
            tab === 'suggestions' ? "text-[var(--text-h)]" : "text-[var(--text)] hover:text-[var(--text-h)]"
          )}
        >
          <Sparkles size={12} />
          Suggestions
          {hasSuggestions && (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          )}
          {tab === 'suggestions' && (
            <motion.div
              layoutId="foodSearchTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'search' ? (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col h-full overflow-x-hidden"
          >
            <div className="space-y-3 shrink-0">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text)]" />
                <input
                  type="text"
                  placeholder={PLACEHOLDERS[phIndex]}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-2.5 text-xs bg-[var(--warm-100)] text-[var(--text-h)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:bg-[var(--bg-subtle)] transition-all shadow-inner"
                />
                <button
                  onClick={() => setTooltipMode(tooltipMode === 'simple' ? 'advanced' : 'simple')}
                  title={tooltipMode === 'simple' ? 'Mode avancé' : 'Mode simple'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--warm-200)]"
                >
                  {tooltipMode === 'advanced' ? <List size={14} /> : <Columns2 size={14} />}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCat('tous')}
                  title="Tous les aliments"
                  className={clsx(
                    'text-[10px] px-2.5 py-2 rounded-xl transition-colors font-medium tracking-wide',
                    cat === 'tous'
                      ? 'bg-[var(--text-h)] text-white shadow-sm'
                      : 'bg-[var(--warm-100)] text-[var(--text)] hover:bg-[var(--warm-200)] hover:text-[var(--text-h)]'
                  )}
                >
                  Tous
                </button>
                <div className="w-px h-5 bg-[var(--warm-200)]" />
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCat(c.value)}
                    title={c.label}
                    className={clsx(
                      'p-2 rounded-xl transition-colors',
                      cat === c.value
                        ? 'bg-[var(--text-h)] text-white shadow-sm'
                        : 'bg-[var(--warm-100)] text-[var(--text)] hover:bg-[var(--warm-200)] hover:text-[var(--text-h)]'
                    )}
                  >
                    <c.icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 pr-0.5 min-h-0 overflow-y-auto overflow-x-hidden max-h-[440px] mt-3">
              {filtered.map((f) => (
                <FoodCard
                  key={f.id}
                  food={f}
                  isSelected={selectedIds.has(f.id)}
                  onToggle={onToggle}
                  isInSeason={f.seasons.includes(currentSeason)}
                  tooltipMode={tooltipMode}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-6 max-h-[440px] overflow-y-auto overflow-x-hidden pr-0.5"
          >
            {hasSuggestions ? (
              <div className="space-y-3 overflow-x-hidden">
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-h)]">
                  <Sparkles size={16} className="text-[#7C9A6E]" />
                  Pour compléter vos apports
                </div>
                <NutrientSuggestions suggestions={suggestions} onAddFood={onAddFood} />
              </div>
            ) : (
              <div className="text-center py-16 text-[var(--text)] text-xs">
                <Sparkles size={24} className="mx-auto mb-3 opacity-40" />
                Ajoutez des aliments pour obtenir des suggestions
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
