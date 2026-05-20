import { useState } from 'react';
import { motion } from 'framer-motion';
import type { NutrientGoals, NutrientKey, SelectedFood } from '../types';
import { NutrientBar } from './NutrientBar';
import { NUTRIENT_META } from '../data/nutrients';
import { useLanguage } from '../hooks/useLanguage';

interface Props {
  totals: Partial<NutrientGoals>;
  goals: NutrientGoals;
  foods?: SelectedFood[];
}

type Tab = 'macro' | 'micro' | 'mineral';

const macroKeys: NutrientKey[] = ['proteines', 'glucides', 'lipides', 'fibres'];
const microKeys: NutrientKey[] = ['vitA', 'vitC', 'vitB9', 'vitB6', 'vitE', 'vitK', 'omega3', 'omega6'];
const mineralKeys: NutrientKey[] = ['fer', 'calcium', 'zinc', 'magnesium', 'selenium'];

export function NutritionOverview({ totals, goals, foods }: Props) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('macro');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'macro', label: t('analysis.sections.macros').toUpperCase() },
    { id: 'micro', label: t('analysis.sections.micros').toUpperCase() },
    { id: 'mineral', label: t('analysis.sections.minerals').toUpperCase() },
  ];

  const cal = totals.calories ?? 0;
  const calPct = goals.calories > 0 ? Math.min((cal / goals.calories) * 100, 100) : 0;

  const macroMeta = NUTRIENT_META.filter(m => macroKeys.includes(m.id as NutrientKey));
  const microMeta = NUTRIENT_META.filter(m => microKeys.includes(m.id as NutrientKey));
  const mineralMeta = NUTRIENT_META.filter(m => mineralKeys.includes(m.id as NutrientKey));

  const activeMeta = activeTab === 'macro' ? macroMeta : activeTab === 'micro' ? microMeta : mineralMeta;

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="display-font text-base font-semibold text-[var(--text-h)]">
            {t('analysis.overviewTitle')}
          </h3>
          <div className="shrink-0 text-right tabular-nums">
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="display-font text-xl font-semibold leading-none text-[var(--text-h)]">
                {Math.round(cal)}
              </span>
              <span className="text-[10px] font-medium text-[var(--text-muted)]">
                / {goals.calories} kcal
              </span>
            </div>
          </div>
        </div>

        <div className="h-1.5 rounded-full bg-[var(--warm-200)] shadow-inner overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${calPct}%` }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.7 }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 min-w-0">
        <div className="min-w-0 space-y-3">
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

          <div className="h-[180px] overflow-y-auto pr-1 space-y-1">
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
