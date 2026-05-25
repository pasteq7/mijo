import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useDismissablePopover } from '../../hooks/useDismissablePopover';
import { useLanguage } from '../../hooks/useLanguage';
import type { FavoriteMeal } from '../../types';

interface FavoriteMealMenuProps {
  favorites: FavoriteMeal[];
  onAddFavoriteMeal: (favorite: FavoriteMeal) => void;
  onDeleteFavorite?: (id: string) => void;
}

export function FavoriteMealMenu({
  favorites,
  onAddFavoriteMeal,
  onDeleteFavorite,
}: FavoriteMealMenuProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  useDismissablePopover(menuRef, isOpen, closeMenu);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-soft)] text-[var(--text)] transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
        title={t('mealHistory.addFavorite')}
        aria-label={t('mealHistory.addFavoriteMeal')}
        aria-expanded={isOpen}
      >
        <Plus size={13} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.16 }}
          className="absolute right-0 top-8 z-30 w-60 overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--bg-raised)] p-1.5 shadow-lg"
        >
          <div className="max-h-60 overflow-y-auto pr-0.5">
            {favorites.map((favorite) => {
              const cal = Math.round(favorite.totals.calories ?? 0);
              const emojis = favorite.foods.map((sf) => sf.food.emoji).slice(0, 3).join(' ');

              return (
                <div
                  key={favorite.id}
                  className="flex items-center gap-1 rounded-lg transition-colors hover:bg-[var(--warm-100)]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onAddFavoriteMeal(favorite);
                      setIsOpen(false);
                    }}
                    className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-[var(--text-h)]">
                        {favorite.name}
                      </span>
                      <span className="block truncate text-[10px] text-[var(--text-muted)]">
                        {emojis} - {cal} {t('common.kcal')}
                      </span>
                    </span>
                    <Plus size={12} className="shrink-0 text-[var(--accent)]" />
                  </button>

                  {onDeleteFavorite && (
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteFavorite(favorite.id);
                        if (favorites.length <= 1) setIsOpen(false);
                      }}
                      className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--action-soft)] hover:text-[var(--action)]"
                      title={t('mealHistory.deleteFavorite')}
                      aria-label={`${t('mealHistory.deleteFavorite')} ${favorite.name}`}
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
  );
}
