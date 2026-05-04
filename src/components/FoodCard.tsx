import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Leaf, Check } from 'lucide-react';
import type { Food } from '../types';
import { Tooltip } from './Tooltip';
import { AdvancedTooltip } from './AdvancedTooltip';

interface Props {
  food: Food;
  isSelected: boolean;
  onToggle: (food: Food) => void;
  isInSeason?: boolean;
  tooltipMode?: 'simple' | 'advanced';
}

function getNutrientLevel(value: number, thresholds: { low: number; mid: number; high: number }): 'low' | 'mid' | 'high' {
  if (value >= thresholds.high) return 'high';
  if (value >= thresholds.mid) return 'mid';
  return 'low';
}

export function FoodCard({ food, isSelected, onToggle, isInSeason = false, tooltipMode = 'simple' }: Props) {
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
    if (level === 'high') return 'bg-[var(--accent)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]';
    if (level === 'mid') return 'bg-[var(--accent-light)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]';
    return 'bg-[var(--border-soft)] opacity-40';
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
        whileHover={{ y: -1, boxShadow: 'var(--shadow)' }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative w-full flex items-center gap-3 py-2.5 pl-2.5 pr-3 rounded-3xl border transition-colors duration-200
          ${isSelected
            ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-[0_0_0_1px_var(--accent),0_4px_16px_rgba(74,103,65,0.12)]'
            : 'border-[var(--border-soft)] backdrop-blur-sm hover:border-[var(--border)] hover:bg-[var(--warm-100)]'
          }
        `}
      >
        <div className="w-10 h-10 rounded-xl bg-[var(--bg)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] flex items-center justify-center relative shrink-0">
          <span className="text-2xl leading-none">{food.emoji}</span>
          {isSelected ? (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-[0_2px_6px_rgba(74,103,65,0.3)]">
              <Check size={10} strokeWidth={3} />
            </div>
          ) : isInSeason && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
              <Leaf size={9} className="text-[var(--accent)]" />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1.5">
            <span className="display-font text-sm font-medium text-[var(--text-h)] truncate leading-snug tracking-tight">
              {food.name}
            </span>
            <div className="flex gap-1.5 items-center shrink-0">
              <div className={`w-1.5 h-1.5 rounded-full ${dotClass(protein)}`} />
              <div className={`w-1.5 h-1.5 rounded-full ${dotClass(iron)}`} />
              <div className={`w-1.5 h-1.5 rounded-full ${dotClass(zinc)}`} />
              <div className={`w-1.5 h-1.5 rounded-full ${dotClass(magnesium)}`} />
              <div className={`w-1.5 h-1.5 rounded-full ${dotClass(fibre)}`} />
            </div>
          </div>
          <span className="text-xs text-[var(--text-muted)] tabular-nums leading-snug mt-0.5">
            {nutrients.calories || 0} kcal &middot; {nutrients.proteines || 0}g prot
          </span>
        </div>
      </motion.button>
    </div>
  );
}
