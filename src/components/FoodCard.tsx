import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Food } from '../types';
import { Tooltip } from './Tooltip';

interface Props {
  food: Food;
  isSelected: boolean;
  onToggle: (food: Food) => void;
  isInSeason: boolean;
}

function getNutrientLevel(value: number, thresholds: { low: number; high: number }): 'low' | 'mid' | 'high' {
  if (value >= thresholds.high) return 'high';
  if (value >= thresholds.low) return 'mid';
  return 'low';
}

export function FoodCard({ food, isSelected, onToggle, isInSeason }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const nutrients = food.per100g;
  const protein = getNutrientLevel(nutrients.proteines || 0, { low: 5, high: 10 });
  const iron = getNutrientLevel(nutrients.fer || 0, { low: 2, high: 4 });
  const zinc = getNutrientLevel(nutrients.zinc || 0, { low: 1, high: 2 });
  const magnesium = getNutrientLevel(nutrients.magnesium || 0, { low: 20, high: 40 });
  const fibre = getNutrientLevel(nutrients.fibres || 0, { low: 2, high: 5 });
  const hasB12 = (nutrients.vitB12 || 0) > 0.5;
  const hasVitD = (nutrients.vitD || 0) > 0.5;

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip
        protein={protein}
        iron={iron}
        zinc={zinc}
        magnesium={magnesium}
        fibre={fibre}
        hasB12={hasB12}
        hasVitD={hasVitD}
        calories={nutrients.calories || 0}
        isVisible={isHovered}
      />
      <motion.button
        onClick={() => onToggle(food)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative w-full text-left p-4 rounded-2xl border transition-all duration-300
          ${isSelected
            ? 'border-[--accent] bg-[--accent-soft] shadow-[var(--shadow-sm)]'
            : 'border-[--border] bg-white hover:border-[--accent] hover:shadow-[var(--shadow-sm)]'
          }
        `}
    >
      {isInSeason && (
        <span className="absolute top-3 right-3 text-[10px] bg-[--accent-soft] text-[--accent] px-2 py-0.5 rounded-full font-medium tracking-wide">
          🍃 saison
        </span>
      )}
      <div className="text-3xl mb-2">{food.emoji}</div>
      <div className={`text-sm font-medium text-[--text-h] leading-tight ${isInSeason ? 'pr-12' : ''}`}>
        {food.name}
      </div>
      <div className="text-xs text-[--text] mt-1 opacity-80">
        {food.per100g.calories || 0} kcal · {food.per100g.proteines || 0}g prot.
      </div>
    </motion.button>
    </div>
  );
}