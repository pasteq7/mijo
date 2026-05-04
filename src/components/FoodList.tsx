import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, Star } from 'lucide-react';
import { StepIndicator } from './StepIndicator';
import type { SelectedFood, FavoriteMeal } from '../types';
import { FavoriteMealCard } from './FavoriteMealCard';
import clsx from 'clsx';

interface Props {
  items: SelectedFood[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onSaveAsFavorite?: () => void;
  favorites?: FavoriteMeal[];
  onLoadFavorite?: (fav: FavoriteMeal) => void;
  onDeleteFavorite?: (id: string) => void;
}

export function FoodList({ items, onUpdateQty, onRemove, onSaveAsFavorite, favorites = [], onLoadFavorite, onDeleteFavorite }: Props) {
  const [tab, setTab] = useState<'selection' | 'favoris'>('selection');

  return (
    <div className="space-y-3">
      <StepIndicator step={2} label="Sélectionner" />
      <div className="flex gap-6 border-b border-[var(--border)]">
        <button
          onClick={() => setTab('selection')}
          className={clsx(
            "px-1 py-2 text-xs font-medium transition-all relative",
            tab === 'selection' ? "text-[var(--text-h)]" : "text-[var(--text)] hover:text-[var(--text-h)]"
          )}
        >
          Sélection
          {tab === 'selection' && (
            <motion.div
              layoutId="foodListTab"
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
              layoutId="foodListTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            />
          )}
        </button>
      </div>

      {tab === 'selection' ? (
        items.length === 0 ? (
          <p className="text-xs text-[var(--text)] py-4 text-center italic">Ajoute des aliments</p>
        ) : (
          <div className="space-y-2">
            <ul className="space-y-1 max-h-[280px] overflow-y-auto overflow-x-hidden">
              <AnimatePresence initial={false}>
                {items.map(({ food, qty }) => (
                  <motion.li
                    key={food.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.15 }}
                    className="group flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[var(--warm-100)] hover:bg-[var(--warm-200)]"
                  >
                    <span className="text-base">{food.emoji}</span>
                    <span className="flex-1 text-xs text-[var(--text-h)] font-medium truncate">{food.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateQty(food.id, Math.max(10, qty - 10))}
                        className="w-5 h-5 flex items-center justify-center rounded-full text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--warm-200)] transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-xs text-[var(--text)] w-10 text-center tabular-nums">{qty}{food.unit}</span>
                      <button
                        onClick={() => onUpdateQty(food.id, qty + 10)}
                        className="w-5 h-5 flex items-center justify-center rounded-full text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--warm-200)] transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(food.id)}
                      className="w-5 h-5 flex items-center justify-center text-[var(--text)] hover:text-[var(--action)] opacity-0 group-hover:opacity-100 transition-all ml-1"
                    >
                      <X size={12} />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            {onSaveAsFavorite && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onSaveAsFavorite}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--highlight-soft)] text-[var(--text-h)] hover:bg-[var(--highlight)]/25 transition-all text-xs font-medium border border-transparent"
              >
                <Star size={13} className="fill-[var(--highlight)] text-[var(--highlight)]" />
                Favoriser cette sélection
              </motion.button>
            )}
          </div>
        )
      ) : (
        <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto overflow-x-hidden pr-0.5">
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
}
