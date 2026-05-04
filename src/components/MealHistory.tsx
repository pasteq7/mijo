import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Trash2, Star, ChevronDown, Check, Plus, Minus, SquarePen } from 'lucide-react';
import type { MealRecord } from '../types';

interface Props {
  meals: MealRecord[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
  favoriteIds?: Set<string>;
  onToggleFavorite?: (meal: MealRecord) => void;
  onDeleteHistory?: (id: string) => void;
  onUpdateQty?: (mealId: string, foodIndex: number, newQty: number) => void;
  onEditFoods?: (id: string) => void;
  onValidateDay?: () => void;
}

const formatTime = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export function MealHistory({ meals, onEdit, onDelete, readOnly = false, favoriteIds, onToggleFavorite, onDeleteHistory, onUpdateQty, onEditFoods, onValidateDay }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (meals.length === 0) return null;

  const sorted = [...meals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4 ">
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
            const isExpanded = expandedId === meal.id;

            return (
              <motion.li
                key={meal.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
                className="rounded-xl bg-[var(--warm-100)] overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : meal.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--warm-200)] transition-colors text-left"
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
                    <ChevronDown
                      size={14}
                      className={`text-[var(--text)] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
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
                      {readOnly && onUpdateQty && (
                        <>
                          {onEditFoods && (
                            <button
                              onClick={() => onEditFoods?.(meal.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--warm-200)] transition-all"
                              title="Modifier dans la liste"
                            >
                              <SquarePen size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => setEditingId(editingId === meal.id ? null : meal.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--warm-200)] transition-all"
                            title={editingId === meal.id ? 'Terminer' : 'Modifier'}
                          >
                            {editingId === meal.id ? <Check size={14} /> : <PenLine size={14} />}
                          </button>
                          <button
                            onClick={() => onDeleteHistory?.(meal.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text)] hover:text-[var(--action)] hover:bg-[var(--warm-200)] transition-all"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 pt-1.5 border-t border-[var(--border)] space-y-1">
                        {meal.foods.map((sf, i) => {
                          const foodCal = Math.round(((sf.food.per100g.calories ?? 0) / 100) * sf.qty);
                          return (
                            <div key={i} className="flex items-center gap-2 text-xs text-[var(--text)] py-0.5">
                              <span className="text-base w-5 text-center leading-none">{sf.food.emoji}</span>
                              <span className="flex-1 truncate">{sf.food.name}</span>
                              {editingId === meal.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => onUpdateQty?.(meal.id, i, sf.qty - sf.food.defaultQty)}
                                    className="w-5 h-5 rounded flex items-center justify-center bg-[var(--warm-200)] hover:bg-[var(--warm-300)] transition-colors"
                                  >
                                    <Minus size={10} />
                                  </button>
                                  <span className="tabular-nums text-[var(--text)] text-center min-w-[3.5rem]">
                                    {sf.qty}{sf.food.unit}
                                  </span>
                                  <button
                                    onClick={() => onUpdateQty?.(meal.id, i, sf.qty + sf.food.defaultQty)}
                                    className="w-5 h-5 rounded flex items-center justify-center bg-[var(--warm-200)] hover:bg-[var(--warm-300)] transition-colors"
                                  >
                                    <Plus size={10} />
                                  </button>
                                </div>
                              ) : (
                                <span className="tabular-nums text-[var(--text)] opacity-60">
                                  {sf.qty}{sf.food.unit}
                                </span>
                              )}
                              <span className="tabular-nums font-medium w-14 text-right">
                                {foodCal} kcal
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {!readOnly && onValidateDay && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onValidateDay}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-dashed border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/60 transition-all"
        >
          <Check size={14} />
          Valider la journée
        </motion.button>
      )}
    </div>
  );
}
