import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Trash2, Star } from 'lucide-react';
import type { MealRecord } from '../types';

interface Props {
  meals: MealRecord[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
  favoriteIds?: Set<string>;
  onToggleFavorite?: (meal: MealRecord) => void;
}

const formatTime = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export function MealHistory({ meals, onEdit, onDelete, readOnly = false, favoriteIds, onToggleFavorite }: Props) {
  if (meals.length === 0) return null;

  const sorted = [...meals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4 pt-8 border-t border-[var(--border)]">
      <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-[0.1em]">
        Repas
      </h3>

      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {sorted.map((meal) => {
            const cal = Math.round(meal.totals.calories ?? 0);
            const emojis = meal.foods.map((sf) => sf.food.emoji);
            const displayEmojis = emojis.slice(0, 5);
            const extra = emojis.length - displayEmojis.length;
            const isFav = favoriteIds?.has(meal.id);

            return (
              <motion.li
                key={meal.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--warm-100)] hover:bg-[var(--warm-200)] group"
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="text-xs text-[var(--text)] tabular-nums font-medium w-10 shrink-0">
                    {formatTime(meal.date)}
                  </span>
                  <span className="text-base leading-none shrink-0">
                    {displayEmojis.join(' ')}
                  </span>
                  {extra > 0 && (
                    <span className="text-xs text-[var(--text)]">+{extra}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[var(--text)] tabular-nums font-medium">
                    {cal} kcal
                  </span>
                  <div className="flex gap-1">
                    {onToggleFavorite && (
                      <button
                        onClick={() => onToggleFavorite(meal)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:bg-[var(--warm-200)]"
                        title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <Star
                          size={14}
                          className={isFav ? 'fill-[var(--highlight)] text-[var(--highlight)]' : 'text-[var(--text)]'}
                        />
                      </button>
                    )}
                    {!readOnly && (
                      <>
                        <button
                          onClick={() => onEdit?.(meal.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--warm-200)] transition-all"
                          title="Modifier"
                        >
                          <PenLine size={14} />
                        </button>
                        <button
                          onClick={() => onDelete?.(meal.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text)] hover:text-[var(--action)] hover:bg-[var(--warm-200)] transition-all"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
