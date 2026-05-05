import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, CheckCircle2, Trash2 } from 'lucide-react';
import type { SelectedFood } from '../types';

interface Props {
  items: SelectedFood[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onSaveMeal: () => void;
  onClear: () => void;
}

export function FoodList({ items, onUpdateQty, onRemove, onSaveMeal, onClear }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[var(--text-h)]">Aliments sélectionnés</h3>
          <span className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] opacity-30">
            <Trash2 size={14} />
          </span>
        </div>
        <div className="min-h-[180px] max-h-[180px] overflow-y-auto space-y-1.5">
          {[1].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--warm-100)] animate-pulse"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--warm-200)] shrink-0" />
              <div className="flex-1 h-4 rounded bg-[var(--warm-200)]" />
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-[var(--warm-200)]" />
                <div className="w-12 h-4 rounded bg-[var(--warm-200)]" />
                <div className="w-6 h-6 rounded-full bg-[var(--warm-200)]" />
              </div>
              <div className="w-6 h-6 rounded-lg bg-[var(--warm-200)]" />
            </div>
          ))}
        </div>
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--warm-200)] text-[var(--text-muted)] rounded-2xl font-medium text-sm shadow-sm mt-auto cursor-not-allowed"
        >
          <CheckCircle2 size={18} />
          Valider le repas
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-[var(--text-h)]">Aliments sélectionnés</h3>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--action)] hover:bg-[var(--warm-200)] transition-colors"
            title="Vider la liste"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="min-h-[180px] max-h-[180px] overflow-y-auto">
        <ul className="space-y-1.5">
          <AnimatePresence initial={false}>
            {items.map(({ food, qty }) => (
              <motion.li
                key={food.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="group flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--warm-100)] hover:bg-[var(--warm-200)]"
              >
                <span className="text-lg leading-none shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/60">
                  {food.emoji}
                </span>
                <span className="flex-1 text-sm font-medium text-[var(--text-h)] truncate">{food.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateQty(food.id, Math.max(10, qty - 10))}
                    className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--text)] hover:text-[var(--text-h)] hover:bg-white transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-xs text-[var(--text)] tabular-nums font-medium min-w-[3rem] text-center">
                    {qty}{food.unit}
                  </span>
                  <button
                    onClick={() => onUpdateQty(food.id, qty + 10)}
                    className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--text)] hover:text-[var(--text-h)] hover:bg-white transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <button
                  onClick={() => onRemove(food.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--text)] hover:text-[var(--action)] hover:bg-white opacity-0 group-hover:opacity-100 transition-all"
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
        Valider le repas
      </button>
    </div>
  );
}
