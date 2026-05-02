import { useState, useMemo, type FC } from 'react';
import { Search, Bean, Wheat, Carrot, Apple, Nut, Ellipsis, Star } from 'lucide-react';
import { FOODS } from '../data/foods';
import type { Food, FoodCategory, Season, FavoriteMeal } from '../types';
import { FoodCard } from './FoodCard';
import { FavoriteMealCard } from './FavoriteMealCard';
import { motion } from 'framer-motion';
import clsx from 'clsx';

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
  favorites?: FavoriteMeal[];
  onLoadFavorite?: (fav: FavoriteMeal) => void;
  onDeleteFavorite?: (id: string) => void;
}

export const FoodSearch: FC<Props> = ({ selectedIds, onToggle, currentSeason, favorites = [], onLoadFavorite, onDeleteFavorite }) => {
  const [tab, setTab] = useState<'aliments' | 'favoris'>('aliments');
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
      <div className="flex gap-6 border-b border-[var(--border)]">
        <button
          onClick={() => setTab('aliments')}
          className={clsx(
            "px-1 py-2 text-xs font-medium transition-all relative",
            tab === 'aliments' ? "text-[var(--text-h)]" : "text-[var(--text)] hover:text-[var(--text-h)]"
          )}
        >
          Aliments
          {tab === 'aliments' && (
            <motion.div
              layoutId="foodSearchTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            />
          )}
        </button>
        <button
          onClick={() => setTab('favoris')}
          className={clsx(
            "px-1 py-2 text-xs font-medium transition-all relative flex items-center gap-1.5",
            tab === 'favoris' ? "text-[var(--text-h)]" : "text-[var(--text)] hover:text-[var(--text-h)]"
          )}
        >
          <Star size={12} />
          Favoris
          {favorites.length > 0 && (
            <span className="text-[10px] bg-[var(--accent)] text-white px-1.5 py-0.5 rounded-full font-bold leading-none">
              {favorites.length}
            </span>
          )}
          {tab === 'favoris' && (
            <motion.div
              layoutId="foodSearchTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            />
          )}
        </button>
      </div>

      {tab === 'aliments' ? (
        <>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text)]" />
            <input
              type="text"
              placeholder="Rechercher…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 text-xs bg-[var(--warm-100)] text-[var(--text-h)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:bg-[var(--bg-subtle)] transition-all shadow-inner"
            />
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

          <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-0.5">
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
        </>
      ) : (
        <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-0.5">
          {favorites.length === 0 ? (
            <p className="text-xs text-[var(--text)] text-center py-8">
              Aucun favori pour le moment
            </p>
          ) : (
            favorites.map((fav) => (
              <FavoriteMealCard
                key={fav.id}
                favorite={fav}
                onLoad={(f) => onLoadFavorite?.(f)}
                onDelete={onDeleteFavorite ?? (() => {})}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
