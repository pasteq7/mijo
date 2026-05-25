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
        <div className="mb-1.5 flex items-center justify-between lg:mb-2">
          <h3 className="display-font text-base font-semibold text-[var(--text-h)]">{t('foodList.selectedFoods')}</h3>
          <span className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] opacity-30">
            <Trash2 size={14} />
          </span>
        </div>
        <div className="flex min-h-[62px] items-center gap-2.5 rounded-xl bg-[var(--warm-100)]/45 px-3 py-2.5 lg:hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--bg-raised)] text-[var(--text-muted)]/75">
            <Utensils size={13} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-tight text-[var(--text-h)]">{t('foodList.plateEmpty')}</p>
            <p className="mt-0.5 text-[10px] leading-snug text-[var(--text-muted)]">
              {t('foodList.addIngredientsFromCatalog')}
            </p>
          </div>
        </div>
        <div className="relative hidden min-h-[180px] max-h-[180px] select-none flex-col items-center justify-center overflow-hidden p-4 text-center lg:flex">
          <div className="relative mb-2.5 flex h-18 w-18 animate-[spin_120s_linear_infinite] items-center justify-center rounded-full border-2 border-dashed border-[var(--border)] bg-[var(--warm-100)]/15">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-[var(--border)]/65" />
          </div>
          <div className="absolute top-[3.75rem] flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--bg-raised)] text-[var(--text-muted)]/75 shadow-2xs">
            <Utensils size={12} />
          </div>

          <p className="mb-0.5 mt-1 text-xs font-semibold text-[var(--text-h)]">{t('foodList.plateEmpty')}</p>
          <p className="mb-2 max-w-[200px] text-[10px] leading-normal text-[var(--text-muted)]">
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
          className="mt-auto hidden w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-[var(--warm-100)] py-3 text-sm font-medium text-[var(--text-muted)] opacity-55 shadow-2xs lg:flex"
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
      <div className="min-h-[120px] max-h-[24dvh] overflow-y-auto lg:min-h-[180px] lg:max-h-[180px]">
        <ul className="space-y-1.5">
          <AnimatePresence initial={false}>
            {items.map((sf) => (
              <motion.li
                key={sf.id ?? sf.food.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="group flex items-center gap-2 px-2.5 py-2 rounded-xl bg-[var(--warm-100)] hover:bg-[var(--warm-200)] sm:gap-3 sm:px-3"
              >
                <span className="text-lg leading-none shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-raised)]">
                  {sf.food.emoji}
                </span>
                <span className="flex-1 text-sm font-medium text-[var(--text-h)] truncate">{t('foods.' + sf.food.id)}</span>
                <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
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
                  className="w-6 h-6 shrink-0 flex items-center justify-center rounded-lg text-[var(--text)] hover:text-[var(--action)] hover:bg-[var(--bg-raised)] opacity-100 transition-all lg:opacity-0 lg:group-hover:opacity-100"
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

