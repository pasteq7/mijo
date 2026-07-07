import { memo, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Leaf, Check } from 'lucide-react';
import type { Food, TooltipMode } from '../types';
import { Tooltip } from './Tooltip';
import { AdvancedTooltip } from './AdvancedTooltip';
import { useLanguage } from '../hooks/useLanguage';

interface Props {
  food: Food;
  isSelected: boolean;
  onToggle: (food: Food) => void;
  isInSeason?: boolean;
  tooltipMode?: TooltipMode;
}

function getNutrientLevel(value: number, thresholds: { low: number; mid: number; high: number }): 'low' | 'mid' | 'high' {
  if (value >= thresholds.high) return 'high';
  if (value >= thresholds.mid) return 'mid';
  return 'low';
}

function FoodCardComponent({ food, isSelected, onToggle, isInSeason = false, tooltipMode = 'simple' }: Props) {
  const { t } = useLanguage();
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
    if (tooltipMode === 'off') return;

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


  return (
    <div
      ref={cardRef}
      className="relative h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {tooltipMode !== 'off' && isHovered && createPortal(
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

      <button
        onClick={() => onToggle(food)}
        className={`
          relative w-full h-14 flex items-center gap-2.5 py-2 pl-2 pr-2.5 rounded-2xl border transition-[transform,box-shadow,border-color,background-color] duration-200 active:scale-[0.98]
          ${isSelected
            ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-[inset_0_0_0_1px_var(--accent),0_2px_10px_rgba(74,103,65,0.10)]'
            : 'border-[var(--border-soft)] hover:-translate-y-px hover:border-[var(--border)] hover:bg-[var(--warm-100)] hover:shadow-[var(--shadow)]'
          }
        `}
      >
        <div className="w-9 h-9 rounded-xl bg-[var(--bg)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] flex items-center justify-center relative shrink-0">
          <span className="text-xl leading-none">{food.emoji}</span>
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
          <span className="display-font text-[13px] font-medium text-[var(--text-h)] truncate leading-snug tracking-tight">
            {t('foods.' + food.id)}
          </span>
          <span className="text-[11px] text-[var(--text-muted)] tabular-nums leading-tight mt-0.5">
            {nutrients.calories || 0} {t('common.kcal')} &middot; {nutrients.proteines || 0}g prot
          </span>
        </div>
      </button>
    </div>
  );
}

export const FoodCard = memo(FoodCardComponent);

