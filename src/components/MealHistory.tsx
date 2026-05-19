import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Trash2, Star, ChevronDown, Check, Plus, Minus, SquarePen } from 'lucide-react';
import type { FavoriteMeal, MealRecord } from '../types';

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

const formatTime = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const getFoodsSignature = (foods: MealRecord['foods']) => {
  return foods
    .map(sf => `${sf.food.id}:${sf.qty}`)
    .sort()
    .join('|');
};

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFavoriteMenuOpen, setIsFavoriteMenuOpen] = useState(false);
  const favoriteMenuRef = useRef<HTMLDivElement>(null);

  const sorted = [...meals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const canAddFavoriteMeal = !readOnly && favorites.length > 0 && Boolean(onAddFavoriteMeal);

  useEffect(() => {
    if (!isFavoriteMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (favoriteMenuRef.current?.contains(event.target as Node)) return;
      setIsFavoriteMenuOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFavoriteMenuOpen(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFavoriteMenuOpen]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-[0.1em]">
          Repas
        </h3>

        <div className="flex items-center gap-1.5">
          {canAddFavoriteMeal && (
            <div ref={favoriteMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsFavoriteMenuOpen(open => !open)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-soft)] text-[var(--text)] transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                title="Ajouter un favori"
                aria-label="Ajouter un repas favori"
                aria-expanded={isFavoriteMenuOpen}
              >
                <Plus size={13} />
              </button>

              {isFavoriteMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.16 }}
                  className="absolute right-0 top-8 z-30 w-60 overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--bg-raised)] p-1.5 shadow-lg"
                >
                  <div className="max-h-60 overflow-y-auto pr-0.5">
                    {favorites.map((favorite) => {
                      const cal = Math.round(favorite.totals.calories ?? 0);
                      const emojis = favorite.foods.map(sf => sf.food.emoji).slice(0, 3).join(' ');

                      return (
                        <div
                          key={favorite.id}
                          className="flex items-center gap-1 rounded-lg transition-colors hover:bg-[var(--warm-100)]"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onAddFavoriteMeal?.(favorite);
                              setIsFavoriteMenuOpen(false);
                            }}
                            className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2 text-left"
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-medium text-[var(--text-h)]">
                                {favorite.name}
                              </span>
                              <span className="block truncate text-[10px] text-[var(--text-muted)]">
                                {emojis} - {cal} kcal
                              </span>
                            </span>
                            <Plus size={12} className="shrink-0 text-[var(--accent)]" />
                          </button>

                          {onDeleteFavorite && (
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteFavorite(favorite.id);
                                if (favorites.length <= 1) setIsFavoriteMenuOpen(false);
                              }}
                              className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--action-soft)] hover:text-[var(--action)]"
                              title="Supprimer le favori"
                              aria-label={`Supprimer le favori ${favorite.name}`}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {!readOnly && onValidateDay && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onValidateDay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-dashed border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/60 transition-all"
            >
              <Check size={12} />
              Valider la journée
            </motion.button>
          )}
        </div>
      </div>

      {sorted.length > 0 && (
        <ul className="space-y-2">
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
                  className="rounded-xl bg-[var(--warm-100)] overflow-hidden"
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
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--warm-200)] transition-colors text-left cursor-pointer"
                  >
                    <span className="text-xs text-[var(--text)] tabular-nums font-medium w-10 shrink-0">
                      {formatTime(meal.date)}
                    </span>

                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="text-base leading-none shrink-0">
                        {displayEmojis.join(' ')}
                      </span>
                      {extra > 0 && (
                        <span className="text-xs text-[var(--text)]">+{extra}</span>
                      )}
                    </div>

                    <span className="text-xs text-[var(--text)] tabular-nums font-medium">
                      {cal} kcal
                    </span>

                    {onToggleFavorite && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(meal); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--warm-200)] transition-all shrink-0"
                        title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <Star
                          size={14}
                          className={isFav ? 'fill-[var(--highlight)] text-[var(--highlight)]' : 'text-[var(--text)]'}
                        />
                      </button>
                    )}

                    <ChevronDown
                      size={14}
                      className={`text-[var(--text)] transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
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
                        <div className="px-4 pb-1.5 pt-1.5 border-t border-[var(--border)] space-y-0.5">
                          {meal.foods.map((sf, i) => {
                            const foodCal = Math.round(((sf.food.per100g.calories ?? 0) / 100) * sf.qty);
                            return (
                              <div key={i} className="flex items-center gap-2 text-xs text-[var(--text)] py-0.5">
                                <span className="text-base w-5 text-center leading-none">{sf.food.emoji}</span>
                                <span className="flex-1 truncate">{sf.food.name}</span>

                                {editingId === meal.id && onUpdateQty ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => onUpdateQty(meal.id, i, sf.qty - sf.food.defaultQty)}
                                      className="w-5 h-5 rounded flex items-center justify-center bg-[var(--warm-200)] hover:bg-[var(--warm-300)] transition-colors"
                                    >
                                      <Minus size={10} />
                                    </button>
                                    <span className="tabular-nums text-[var(--text)] text-center min-w-[3.5rem]">
                                      {sf.qty}{sf.food.unit}
                                    </span>
                                    <button
                                      onClick={() => onUpdateQty(meal.id, i, sf.qty + sf.food.defaultQty)}
                                      className="w-5 h-5 rounded flex items-center justify-center bg-[var(--warm-200)] hover:bg-[var(--warm-300)] transition-colors"
                                    >
                                      <Plus size={10} />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="tabular-nums text-[var(--text)] opacity-60">{sf.qty}{sf.food.unit}</span>
                                )}

                                <span className="tabular-nums font-medium w-14 text-right">{foodCal} kcal</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-1 px-4 pb-3 pt-2 border-t border-[var(--border)]">
                          {readOnly ? (
                            <>
                              {onUpdateQty && (
                                <button
                                  onClick={() => setEditingId(editingId === meal.id ? null : meal.id)}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-[var(--text)] hover:bg-[var(--warm-200)] transition-all"
                                >
                                  {editingId === meal.id ? <Check size={12} /> : <PenLine size={12} />}
                                  {editingId === meal.id ? 'Terminé' : 'Quantités'}
                                </button>
                              )}
                              {onEditFoods && (
                                <button
                                  onClick={() => onEditFoods(meal.id)}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-[var(--text)] hover:bg-[var(--warm-200)] transition-all"
                                >
                                  <SquarePen size={12} /> Modifier
                                </button>
                              )}
                              {onDeleteHistory && (
                                <button
                                  onClick={() => onDeleteHistory(meal.id)}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-[var(--text)] hover:text-[var(--action)] hover:bg-[var(--warm-200)] transition-all ml-auto"
                                >
                                  <Trash2 size={12} /> Supprimer
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              {onEdit && (
                                <button
                                  onClick={() => onEdit(meal.id)}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--warm-200)] transition-all"
                                >
                                  <PenLine size={12} /> Modifier
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  onClick={() => onDelete(meal.id)}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-[var(--text)] hover:text-[var(--action)] hover:bg-[var(--warm-200)] transition-all ml-auto"
                                >
                                  <Trash2 size={12} /> Supprimer
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
