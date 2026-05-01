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
      <p className="text-center text-stone-400 py-6 text-sm">
        Ajoute des aliments pour commencer 🌱
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      <AnimatePresence initial={false}>
        {items.map(({ food, qty }) => (
          <motion.li
            key={food.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 bg-[#F0EBE0] rounded-xl px-3 py-2"
          >
            <span className="text-xl">{food.emoji}</span>
            <span className="flex-1 text-sm font-medium text-stone-700 truncate">
              {food.name}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onUpdateQty(food.id, Math.max(10, qty - 10))}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-stone-200 hover:bg-stone-300 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-12 text-center text-sm tabular-nums text-stone-600">
                {qty}{food.unit}
              </span>
              <button
                onClick={() => onUpdateQty(food.id, qty + 10)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-stone-200 hover:bg-stone-300 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
            <button
              onClick={() => onRemove(food.id)}
              className="text-stone-400 hover:text-[#C4704F] transition-colors ml-1"
            >
              <X size={16} />
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}