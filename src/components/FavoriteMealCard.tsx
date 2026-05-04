import { motion } from 'framer-motion';
import { X, Star } from 'lucide-react';
import type { FavoriteMeal } from '../types';

interface Props {
  favorite: FavoriteMeal;
  onLoad: (fav: FavoriteMeal) => void;
  onDelete: (id: string) => void;
}

export function FavoriteMealCard({ favorite, onLoad, onDelete }: Props) {
  const cal = Math.round(favorite.totals.calories ?? 0);
  const prot = Math.round(favorite.totals.proteines ?? 0);
  const emojis = favorite.foods.map(sf => sf.food.emoji);
  const displayEmojis = emojis.slice(0, 5);
  const extra = emojis.length - displayEmojis.length;

  return (
    <div className="relative bg-[var(--warm-100)] rounded-xl shadow-[var(--shadow-sm)] p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Star size={14} className="shrink-0 fill-[var(--highlight)] text-[var(--highlight)]" />
          <h4 className="text-sm font-medium text-[var(--text-h)] truncate">
            {favorite.name}
          </h4>
        </div>
        <button
          onClick={() => onDelete(favorite.id)}
          className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--text)] hover:text-[var(--action)] hover:bg-[var(--warm-200)] transition-all shrink-0 -mr-1 -mt-1"
          title="Supprimer"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-base leading-none">
          {displayEmojis.join(' ')}
        </span>
        {extra > 0 && (
          <span className="text-xs text-[var(--text)]">+{extra}</span>
        )}
        <span className="text-xs text-[var(--text-muted)]">
          · {favorite.foods.length} aliment{favorite.foods.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-[var(--text)] tabular-nums">
          {cal} kcal · {prot}g prot
        </span>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onLoad(favorite)}
          className="px-3 py-1.5 text-xs font-medium text-white bg-[var(--accent)] rounded-lg hover:bg-[#5C7D5B] transition-colors"
        >
          Charger
        </motion.button>
      </div>
    </div>
  );
}
