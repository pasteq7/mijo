import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Trash2, Star, ChevronDown, Check, Plus, Minus, SquarePen } from 'lucide-react';
import type { FavoriteMeal, MealRecord } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { getFoodsSignature } from '../utils/mealSignatures';
import { FavoriteMealMenu } from './meal/FavoriteMealMenu';

interface Props {
  meals: MealRecord[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
  favorites?: FavoriteMeal[];
  favoriteIds?: Set<string>;
  onToggleFavorite?: (meal: MealRecord) => void;
  onAddFavoriteMeal?: (favorite: FavoriteMeal) => void;
  onDeleteFavorite?: (id: string) => void;
  onDeleteHistory?: (id: string) => void;
  onUpdateQty?: (mealId: string, foodIndex: number, newQty: number) => void;
  onEditFoods?: (id: string) => void;
  onValidateDay?: () => void;
}

export function MealHistory({
  meals,
  onEdit,
  onDelete,
  readOnly = false,
  favorites = [],
  favoriteIds,
  onToggleFavorite,
  onAddFavoriteMeal,
  onDeleteFavorite,
  onDeleteHistory,
  onUpdateQty,
  onEditFoods,
  onValidateDay,
}: Props) {
  const { t, language } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const sorted = [...meals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const canAddFavoriteMeal = !readOnly && favorites.length > 0 && Boolean(onAddFavoriteMeal);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--accent)] px-2.5 py-0.5">
          {t('mealHistory.title')}
        </span>

        <div className="flex items-center gap-1.5">
          {canAddFavoriteMeal && onAddFavoriteMeal && (
            <FavoriteMealMenu
              favorites={favorites}
              onAddFavoriteMeal={onAddFavoriteMeal}
              onDeleteFavorite={onDeleteFavorite}
            />
          )}
          {!readOnly && onValidateDay && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onValidateDay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-dashed border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/60 transition-all"
            >
              <Check size={12} />
              {t('mealHistory.validateDay')}
            </motion.button>
          )}
        </div>
      </div>

      {sorted.length > 0 && (
        <ul className="space-y-1.5">
          <AnimatePresence initial={false}>
            {sorted.map((meal) => {
              const cal = Math.round(meal.totals.calories ?? 0);
              const emojis = meal.foods.map((sf) => sf.food.emoji);
              const displayEmojis = emojis.slice(0, 2);
              const extra = emojis.length - displayEmojis.length;
              const mealSignature = getFoodsSignature(meal.foods);
              const isFav = favoriteIds?.has(meal.id) || favorites.some(favorite => getFoodsSignature(favorite.foods) === mealSignature);
              const isExpanded = expandedId === meal.id;

              return (
                <motion.li
                  key={meal.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg bg-[var(--warm-100)]/65 border border-[var(--border-soft)]/50 overflow-hidden hover:shadow-xs transition-all duration-200 border-l-[1.5px] border-l-[var(--accent)]/40"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setExpandedId(isExpanded ? null : meal.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedId(isExpanded ? null : meal.id);
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[var(--warm-200)]/60 transition-colors text-left cursor-pointer"
                  >
                    <span className="text-[11px] text-[var(--accent)] tabular-nums font-semibold w-9 shrink-0">
                      {formatTime(meal.date)}
                    </span>

                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span className="text-sm leading-none shrink-0 select-none">
                        {displayEmojis.join(' ')}
                      </span>
                      {extra > 0 && (
                        <span className="text-[10px] px-1 py-0.2 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] font-bold select-none">+{extra}</span>
                      )}
                    </div>

                    <span className="text-[11px] text-[var(--text-h)] tabular-nums font-semibold">
                      {cal} {t('common.kcal')}
                    </span>

                    {onToggleFavorite && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(meal); }}
                        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] text-[var(--text-muted)] transition-all shrink-0"
                        title={isFav ? t('mealHistory.removeFromFavorites') : t('mealHistory.addToFavorites')}
                      >
                        <Star
                          size={12}
                          className={isFav ? 'fill-[var(--highlight)] text-[var(--highlight)]' : 'text-[var(--text)]'}
                        />
                      </button>
                    )}

                    <ChevronDown
                      size={12}
                      className={`text-[var(--text-muted)] transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-3.5 pb-1 pt-1 border-t border-[var(--border)] space-y-0.25">
                          {meal.foods.map((sf, i) => {
                            const foodCal = Math.round(((sf.food.per100g.calories ?? 0) / 100) * sf.qty);
                            return (
                              <div key={i} className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] py-0.25">
                                <span className="text-xs w-4 text-center leading-none select-none">{sf.food.emoji}</span>
                                <span className="flex-1 truncate">{t('foods.' + sf.food.id)}</span>

                                {editingId === meal.id && onUpdateQty ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => onUpdateQty(meal.id, i, sf.qty - sf.food.defaultQty)}
                                      className="w-4.5 h-4.5 rounded flex items-center justify-center bg-[var(--warm-200)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors"
                                    >
                                      <Minus size={9} />
                                    </button>
                                    <span className="tabular-nums text-[var(--text)] text-center min-w-[3rem] font-medium">
                                      {sf.qty}{sf.food.unit}
                                    </span>
                                    <button
                                      onClick={() => onUpdateQty(meal.id, i, sf.qty + sf.food.defaultQty)}
                                      className="w-4.5 h-4.5 rounded flex items-center justify-center bg-[var(--warm-200)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors"
                                    >
                                      <Plus size={9} />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="tabular-nums text-[var(--text-muted)] opacity-80">{sf.qty}{sf.food.unit}</span>
                                )}

                                <span className="tabular-nums font-semibold w-12 text-right text-[var(--text-h)]">{foodCal} {t('common.kcal')}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-1 px-3.5 pb-2 pt-1.5 border-t border-[var(--border)]">
                          {readOnly ? (
                            <>
                              {onUpdateQty && (
                                <button
                                  onClick={() => setEditingId(editingId === meal.id ? null : meal.id)}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] text-[var(--text)] hover:bg-[var(--warm-200)] transition-all font-medium"
                                >
                                  {editingId === meal.id ? <Check size={11} /> : <PenLine size={11} />}
                                  {editingId === meal.id ? t('common.done') : t('mealHistory.quantities')}
                                </button>
                              )}
                              {onEditFoods && (
                                <button
                                  onClick={() => onEditFoods(meal.id)}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] text-[var(--text)] hover:bg-[var(--warm-200)] transition-all font-medium"
                                >
                                  <SquarePen size={11} /> {t('common.edit')}
                                </button>
                              )}
                              {onDeleteHistory && (
                                <button
                                  onClick={() => onDeleteHistory(meal.id)}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] text-[var(--text)] hover:text-[var(--action)] hover:bg-[var(--warm-200)] transition-all ml-auto font-medium"
                                >
                                  <Trash2 size={11} /> {t('common.delete')}
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              {onEdit && (
                                <button
                                  onClick={() => onEdit(meal.id)}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--warm-200)] transition-all font-medium"
                                >
                                  <PenLine size={11} /> {t('common.edit')}
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  onClick={() => onDelete(meal.id)}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] text-[var(--text)] hover:text-[var(--action)] hover:bg-[var(--warm-200)] transition-all ml-auto font-medium"
                                >
                                  <Trash2 size={11} /> {t('common.delete')}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

