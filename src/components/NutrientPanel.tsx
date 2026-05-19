import { useState } from 'react';
import { NutrientBar } from './NutrientBar';
import { NUTRIENT_META } from '../data/nutrients';
import type { NutrientGoals, NutrientKey } from '../types';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface Props {
  totals: Partial<NutrientGoals>;
  goals: NutrientGoals;
}

const GROUPS = [
  { key: 'macros', label: 'Macronutriments' },
  { key: 'vitamines', label: 'Vitamines' },
  { key: 'mineraux', label: 'Minéraux' },
] as const;

export function NutrientPanel({ totals, goals }: Props) {
  const [activeTab, setActiveTab] = useState('macros');

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
      <div className="flex gap-6 text-sm border-b border-stone-100 mb-5">
        {GROUPS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={clsx(
              'pb-3 font-medium transition-colors relative',
              activeTab === key ? 'text-stone-800' : 'text-stone-400 hover:text-stone-600'
            )}
          >
            {label}
            {activeTab === key && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C9A6E]" />
            )}
          </button>
        ))}
      </div>
      <div className="min-h-[220px] grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
        {NUTRIENT_META
          .filter((n) => n.group === activeTab && !n.isSupplement)
          .map((meta) => (
            <NutrientBar
              key={meta.id}
              meta={meta}
              value={totals[meta.id as NutrientKey] ?? 0}
              goal={goals[meta.id as NutrientKey] as number}
            />
          ))}
      </div>
    </div>
  );
}