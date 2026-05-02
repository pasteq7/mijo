import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import type { SelectedFood } from '../types';

interface Props {
  items: SelectedFood[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function FoodList({ items, onUpdateQty, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <p className="text-xs text-[var(--text)] py-4 text-center italic">Ajoute des aliments</p>
    );
  }

  return (
    <ul className="space-y-1 max-h-[300px] overflow-y-auto">
      <AnimatePresence initial={false}>
        {items.map(({ food, qty }) => (
          <motion.li
            key={food.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            className="group flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[var(--warm-100)] hover:bg-[var(--warm-200)]"
          >
            <span className="text-base">{food.emoji}</span>
            <span className="flex-1 text-xs text-[var(--text-h)] font-medium truncate">{food.name}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdateQty(food.id, Math.max(10, qty - 10))}
                className="w-5 h-5 flex items-center justify-center rounded-full text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--warm-200)] transition-colors"
              >
                <Minus size={10} />
              </button>
              <span className="text-xs text-[var(--text)] w-10 text-center tabular-nums">{qty}{food.unit}</span>
              <button
                onClick={() => onUpdateQty(food.id, qty + 10)}
                className="w-5 h-5 flex items-center justify-center rounded-full text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--warm-200)] transition-colors"
              >
                <Plus size={10} />
              </button>
            </div>
            <button
              onClick={() => onRemove(food.id)}
              className="w-5 h-5 flex items-center justify-center text-[var(--text)] hover:text-[var(--action)] opacity-0 group-hover:opacity-100 transition-all ml-1"
            >
              <X size={12} />
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
