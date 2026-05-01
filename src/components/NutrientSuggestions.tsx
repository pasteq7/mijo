import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { NUTRIENT_META } from '../data/nutrients';
import type { FC } from 'react';
import type { FoodSuggestion } from '../utils/recommendations';

interface Props {
  suggestions: FoodSuggestion[];
  onAddFood: (foodId: string) => void;
}

export const NutrientSuggestions: FC<Props> = ({ suggestions, onAddFood }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      {suggestions.map((s, idx) => (
        <motion.div
          key={s.food.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.03 }}
          className="group flex items-center gap-3 px-4 py-3 rounded-2xl border border-transparent hover:border-[--border] hover:bg-white hover:shadow-[var(--shadow-sm)] transition-all cursor-pointer"
          onClick={() => onAddFood(s.food.id)}
        >
          <span className="text-xl">{s.food.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[--text-h] truncate">{s.food.name}</div>
            <div className="flex gap-1.5 mt-1">
              {s.contributingNutrients.slice(0, 2).map((n) => (
                <span key={n.id} className="text-[10px] text-[--text] uppercase tracking-wider font-medium">
                  {NUTRIENT_META.find((m) => m.id === n.id)?.label || n.id}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onAddFood(s.food.id); }}
            className="w-7 h-7 flex items-center justify-center rounded-xl text-[--text] hover:text-[--accent] hover:bg-[--accent-soft] opacity-0 group-hover:opacity-100 transition-all"
          >
            <Plus size={16} strokeWidth={2} />
          </button>
        </motion.div>
      ))}
    </div>
  );
};