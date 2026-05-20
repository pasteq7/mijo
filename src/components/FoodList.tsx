import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, CheckCircle2, Trash2, Utensils, ArrowDown } from 'lucide-react';
import type { SelectedFood } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface Props {
  items: SelectedFood[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onSaveMeal: () => void;
  onClear: () => void;
}

export function FoodList({ items, onUpdateQty, onRemove, onSaveMeal, onClear }: Props) {
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full select-none">
        <div className="flex items-center justify-between mb-2">
          <h3 className="display-font text-base font-semibold text-[var(--text-h)]">{t('foodList.selectedFoods')}</h3>
          <span className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] opacity-30">
            <Trash2 size={14} />
          </span>
        </div>
        <div className="min-h-[180px] max-h-[180px] overflow-hidden flex flex-col items-center justify-center p-4 text-center select-none relative">
          <div className="relative w-18 h-18 rounded-full border-2 border-dashed border-[var(--border)] flex items-center justify-center mb-2.5 bg-[var(--warm-100)]/15 animate-[spin_120s_linear_infinite]">
            <div className="w-12 h-12 rounded-full border border-dashed border-[var(--border)]/65 flex items-center justify-center" />
          </div>
          <div className="absolute top-[3.75rem] flex items-center justify-center w-7 h-7 rounded-full bg-[var(--bg-raised)] shadow-2xs border border-[var(--border-soft)] text-[var(--text-muted)]/75">
            <Utensils size={12} />
          </div>
          
          <p className="text-xs font-semibold text-[var(--text-h)] mt-1 mb-0.5">{t('foodList.plateEmpty')}</p>
          <p className="text-[10px] text-[var(--text-muted)] max-w-[200px] leading-normal mb-2">
            {t('foodList.addIngredientsFromCatalog')}
          </p>

          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-[var(--accent)] opacity-85"
          >
            <ArrowDown size={11} strokeWidth={2.5} />
          </motion.div>
        </div>
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--warm-100)] text-[var(--text-muted)] opacity-55 rounded-2xl font-medium text-sm shadow-2xs mt-auto cursor-not-allowed"
        >
          <CheckCircle2 size={18} className="opacity-40" />
          {t('foodList.validateMealButton')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="display-font text-base font-semibold text-[var(--text-h)]">{t('foodList.selectedFoods')}</h3>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--action)] hover:bg-[var(--warm-200)] transition-colors"
            title={t('foodList.clearListTitle')}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="min-h-[180px] max-h-[180px] overflow-y-auto">
        <ul className="space-y-1.5">
          <AnimatePresence initial={false}>
            {items.map((sf) => (
              <motion.li
                key={sf.id ?? sf.food.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="group flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--warm-100)] hover:bg-[var(--warm-200)]"
              >
                <span className="text-lg leading-none shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-raised)]">
                  {sf.food.emoji}
                </span>
                <span className="flex-1 text-sm font-medium text-[var(--text-h)] truncate">{t('foods.' + sf.food.id)}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateQty(sf.food.id, Math.max(10, sf.qty - 10))}
                    className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--bg-raised)] transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-xs text-[var(--text)] tabular-nums font-medium min-w-[3rem] text-center">
                    {sf.qty}{sf.food.unit}
                  </span>
                  <button
                    onClick={() => onUpdateQty(sf.food.id, sf.qty + 10)}
                    className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--bg-raised)] transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <button
                  onClick={() => onRemove(sf.food.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--text)] hover:text-[var(--action)] hover:bg-[var(--bg-raised)] opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={14} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <button
        onClick={onSaveMeal}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--accent)] text-white rounded-2xl font-medium text-sm hover:bg-[#3D5A35] transition-colors shadow-sm mt-auto"
      >
        <CheckCircle2 size={18} />
        {t('foodList.validateMealButton')}
      </button>
    </div>
  );
}

