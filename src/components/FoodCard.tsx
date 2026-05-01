import { motion } from 'framer-motion';
import type { Food } from '../types';

interface Props {
  food: Food;
  isSelected: boolean;
  onToggle: (food: Food) => void;
  isInSeason: boolean;
}

export function FoodCard({ food, isSelected, onToggle, isInSeason }: Props) {
  return (
    <motion.button
      onClick={() => onToggle(food)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative w-full text-left p-3 rounded-xl border-2 transition-colors
        ${isSelected
          ? 'border-[#7C9A6E] bg-[#7C9A6E]/10'
          : 'border-transparent bg-[#F0EBE0] hover:border-stone-300'
        }
      `}
    >
      {isInSeason && (
        <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
          🍃 saison
        </span>
      )}
      <div className="text-2xl mb-1">{food.emoji}</div>
      <div className="text-sm font-medium text-stone-700 leading-tight pr-12">
        {food.name}
      </div>
      <div className="text-xs text-stone-400 mt-0.5">
        {food.per100g.calories} kcal · {food.per100g.proteines}g prot.
      </div>
    </motion.button>
  );
}