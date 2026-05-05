import { useState } from 'react';
import { motion } from 'framer-motion';
import type { NutrientGoals, NutrientKey, SelectedFood } from '../types';
import { NutrientBar } from './NutrientBar';
import { NUTRIENT_META } from '../data/nutrients';

interface Props {
  totals: Partial<NutrientGoals>;
  goals: NutrientGoals;
  foods?: SelectedFood[];
}

type Tab = 'macro' | 'micro' | 'mineral';

const macroKeys: NutrientKey[] = ['proteines', 'glucides', 'lipides', 'fibres'];
const microKeys: NutrientKey[] = ['vitA', 'vitC', 'vitB9', 'vitB6', 'vitE', 'vitK'];
const mineralKeys: NutrientKey[] = ['fer', 'calcium', 'zinc', 'magnesium', 'selenium'];

const tabs: { id: Tab; label: string }[] = [
  { id: 'macro', label: 'Macro' },
  { id: 'micro', label: 'Micro' },
  { id: 'mineral', label: 'Minéraux' },
];

export function NutritionOverview({ totals, goals, foods }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('macro');

  const cal = totals.calories ?? 0;
  const calPct = Math.min((cal / goals.calories) * 100, 100);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (calPct / 100) * circumference;

  const macroMeta = NUTRIENT_META.filter(m => macroKeys.includes(m.id as NutrientKey));
  const microMeta = NUTRIENT_META.filter(m => microKeys.includes(m.id as NutrientKey));
  const mineralMeta = NUTRIENT_META.filter(m => mineralKeys.includes(m.id as NutrientKey));

  const activeMeta = activeTab === 'macro' ? macroMeta : activeTab === 'micro' ? microMeta : mineralMeta;

  return (
    <div className="flex flex-col h-full gap-4">
      <h3 className="display-font text-base font-semibold text-[var(--text-h)]">
        Aperçu Nutritionnel
      </h3>

      <div className="flex items-start gap-4 flex-wrap">
        <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--warm-200)" strokeWidth="5" />
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transform="rotate(-90 50 50)"
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.8 }}
          />
          <text x="50" y="42" textAnchor="middle" className="font-number" fontSize="18" fill="var(--text-h)">
            {Math.round(cal)}
          </text>
          <text x="50" y="57" textAnchor="middle" fontSize="7" fill="var(--text-muted)">
            / {goals.calories} kcal
          </text>
        </svg>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex gap-1 p-0.5 rounded-lg bg-[var(--warm-100)] w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === tab.id
                    ? 'text-[var(--text-h)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="nutrient-tab"
                    className="absolute inset-0 rounded-md bg-white/80 shadow-sm"
                    transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.25 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="h-[180px] overflow-hidden space-y-1">
            {activeMeta.map((meta) => (
              <NutrientBar
                key={meta.id}
                meta={meta}
                value={totals[meta.id as NutrientKey] ?? 0}
                goal={goals[meta.id as NutrientKey] as number}
                foods={foods}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
