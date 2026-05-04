import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Food } from '../types';
import { Tooltip } from './Tooltip';
import { AdvancedTooltip } from './AdvancedTooltip';

interface Props {
  food: Food;
  isSelected: boolean;
  onToggle: (food: Food) => void;
  isInSeason: boolean;
  tooltipMode: 'simple' | 'advanced';
}

function getNutrientLevel(value: number, thresholds: { low: number; mid: number; high: number }): 'low' | 'mid' | 'high' {
  if (value >= thresholds.high) return 'high';
  if (value >= thresholds.mid) return 'mid';
  return 'low';
}

export function FoodCard({ food, isSelected, onToggle, isInSeason, tooltipMode }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [anchorTop, setAnchorTop] = useState(0);
  const [anchorLeft, setAnchorLeft] = useState(0);

  const nutrients = food.per100g;
  const protein = getNutrientLevel(nutrients.proteines || 0, { low: 3, mid: 7, high: 12 });
  const iron = getNutrientLevel(nutrients.fer || 0, { low: 1, mid: 2.5, high: 4 });
  const zinc = getNutrientLevel(nutrients.zinc || 0, { low: 0.5, mid: 1.5, high: 3 });
  const magnesium = getNutrientLevel(nutrients.magnesium || 0, { low: 15, mid: 40, high: 80 });
  const fibre = getNutrientLevel(nutrients.fibres || 0, { low: 3, mid: 6, high: 10 });

  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setAnchorTop(rect.top);
      setAnchorLeft(rect.left + rect.width / 2);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const dotClass = (level: 'low' | 'mid' | 'high') => {
    if (level === 'high') return 'bg-[var(--accent)]';
    if (level === 'mid') return 'bg-[var(--accent-light)]';
    return 'bg-[var(--warm-300)]';
  };

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered && createPortal(
        <div
          style={{
            position: 'fixed',
            top: anchorTop - 12,
            left: anchorLeft,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          {tooltipMode === 'advanced' ? (
            <AdvancedTooltip food={food} isVisible={isHovered} />
          ) : (
            <Tooltip
              protein={protein}
              iron={iron}
              zinc={zinc}
              magnesium={magnesium}
              fibre={fibre}
              calories={nutrients.calories || 0}
              isVisible={isHovered}
            />
          )}
        </div>,
        document.body
      )}

      <motion.button
        onClick={() => onToggle(food)}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}

        className={`
          relative w-full flex flex-row items-center gap-3 px-3 py-2.5 rounded-xl border
          transition-colors duration-200
          ${isSelected
            ? 'border-[var(--border)] bg-[var(--accent-soft)]'
            : 'border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--warm-100)]'
          }
        `}
      >
        {isSelected && (
          <div className="absolute inset-y-1 left-0 w-[3px] bg-[var(--accent)] rounded-r-full" />
        )}
        {isInSeason && (
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-60" />
        )}

        <span className="text-base leading-none shrink-0">{food.emoji}</span>

        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-[var(--text-h)] leading-tight truncate">
            {food.name}
          </div>
          <div className="text-[11px] tabular-nums text-[var(--text)] mt-0.5 opacity-75">
            {nutrients.calories || 0} kcal · {nutrients.proteines || 0}g prot
          </div>
        </div>

        <div className="flex gap-1 shrink-0">
          <div className={`w-1.5 h-1.5 rounded-full ${dotClass(protein)}`} />
          <div className={`w-1.5 h-1.5 rounded-full ${dotClass(iron)}`} />
          <div className={`w-1.5 h-1.5 rounded-full ${dotClass(zinc)}`} />
          <div className={`w-1.5 h-1.5 rounded-full ${dotClass(magnesium)}`} />
          <div className={`w-1.5 h-1.5 rounded-full ${dotClass(fibre)}`} />
        </div>
      </motion.button>
    </div>
  );
}
