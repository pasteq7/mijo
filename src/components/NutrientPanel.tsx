import { useState } from 'react';
import { NutrientBar } from './NutrientBar';
import { NUTRIENT_META } from '../data/nutrients';
import type { DailyGoals, NutrientKey } from '../types';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface Props {
  totals: Partial<DailyGoals>;
  goals: DailyGoals;
}

const GROUPS = [
  { key: 'macros', label: 'Macro' },
  { key: 'vitamines', label: 'Vit' },
  { key: 'mineraux', label: 'Min' },
] as const;

export function NutrientPanel({ totals, goals }: Props) {
  const [activeTab, setActiveTab] = useState('macros');

  return (
    <div className="space-y-3">
      <div className="flex gap-4 text-xs border-b border-[var(--border)]">
        {GROUPS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={clsx(
              'pb-2 transition-colors relative font-medium uppercase tracking-[0.05em]',
              activeTab === key ? 'text-[var(--text-h)]' : 'text-[var(--text)] hover:text-[var(--text-h)]'
            )}
          >
            {label}
            {activeTab === key && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
            )}
          </button>
        ))}
      </div>
      <div className="min-h-[200px] pt-3">
        {NUTRIENT_META.filter((n) => n.group === activeTab).map((meta) => (
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
