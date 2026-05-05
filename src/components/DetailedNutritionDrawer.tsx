import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NutrientBar } from './NutrientBar';
import { NUTRIENT_META } from '../data/nutrients';
import type { NutrientGoals, NutrientKey, SelectedFood } from '../types';
import clsx from 'clsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  totals: Partial<NutrientGoals>;
  goals: NutrientGoals;
  foods: SelectedFood[];
  bufferFoods?: Set<SelectedFood>;
}

const GROUPS = [
  { key: 'macros', label: 'MACROS' },
  { key: 'vitamines', label: 'MICROS' },
  { key: 'mineraux', label: 'MINÉRAUX' },
] as const;

const GROUP_MAP: Record<string, string[]> = {
  macros: ['macros', 'aminoacides'],
  vitamines: ['vitamines', 'acidesgras'],
  mineraux: ['mineraux'],
};

export function DetailedNutritionDrawer({ isOpen, onClose, totals, goals, foods, bufferFoods }: Props) {
  const [activeTab, setActiveTab] = useState('macros');

  const nutrientMeta = NUTRIENT_META.filter(n => {
    if (activeTab === 'macros' && n.id === 'calories') return false;
    return GROUP_MAP[activeTab]?.includes(n.group) ?? false;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[400px] max-w-[90vw] z-50 bg-[var(--bg)] border-l border-[var(--border-soft)] shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[var(--border-soft)]">
              <h3 className="text-sm font-semibold text-[var(--text-h)] display-font">
                Analyse détaillée
              </h3>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--warm-200)] transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex gap-4 px-4 border-b border-[var(--border-soft)]">
              {GROUPS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={clsx(
                    'text-[11px] pb-2 pt-3 transition-all font-medium tracking-[0.08em] relative',
                    activeTab === key
                      ? 'text-[var(--text-h)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  )}
                >
                  {label}
                  {activeTab === key && (
                    <motion.div
                      layoutId="drawer-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--accent)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-1"
                >
                  {nutrientMeta.map((meta) => {
                    const val = totals[meta.id as NutrientKey] ?? 0;
                    const goal = goals[meta.id as NutrientKey] ?? 0;
                    return (
                      <NutrientBar
                        key={meta.id}
                        meta={meta}
                        value={val}
                        goal={goal}
                        foods={foods}
                        bufferFoods={bufferFoods}
                      />
                    );
                  })}
                  {nutrientMeta.length === 0 && (
                    <p className="text-xs text-[var(--text-muted)] italic py-4 text-center">
                      Aucun nutriment dans ce groupe
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
