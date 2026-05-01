import { useState } from 'react';
import { NutrientBar } from './NutrientBar';
import { NUTRIENT_META } from '../data/nutrients';
import type { DailyGoals, NutrientKey } from '../types';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  totals: Partial<DailyGoals>;
  goals: DailyGoals;
}

const GROUPS = [
  { key: 'macros', label: '🌾 Macronutriments' },
  { key: 'vitamines', label: '🌿 Vitamines' },
  { key: 'mineraux', label: '🪨 Minéraux' },
  { key: 'acidesgras', label: '💧 Acides gras' },
  { key: 'aminoacides', label: '🔗 Acides aminés essentiels' },
] as const;

export function NutrientPanel({ totals, goals }: Props) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    new Set(['macros', 'vitamines'])
  );

  const toggle = (key: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
       if (next.has(key)) {
         next.delete(key);
       } else {
         next.add(key);
       }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {GROUPS.map(({ key, label }) => {
        const nutrients = NUTRIENT_META.filter((n) => n.group === key);
        const isOpen = openGroups.has(key);
        return (
          <div key={key} className="bg-[#F0EBE0] rounded-2xl overflow-hidden">
            <button
              onClick={() => toggle(key)}
              className="w-full flex justify-between items-center px-4 py-3 font-semibold text-stone-700 hover:bg-stone-200/50 transition-colors"
            >
              <span>{label}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4">
                    {nutrients.map((meta) => (
                      <NutrientBar
                        key={meta.id}
                        meta={meta}
                        value={totals[meta.id as NutrientKey] ?? 0}
                        goal={goals[meta.id as NutrientKey] as number}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}