import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Moon, RotateCcw, Sun } from 'lucide-react';
import { NUTRIENT_META } from '../../data/nutrients';
import { useLanguage } from '../../hooks/useLanguage';
import type { NutrientGoals, NutrientKey } from '../../types';

export type GoalTab = 'daily' | 'meal';

interface ManualGoalEditorProps {
  activeTab: GoalTab;
  setActiveTab: (tab: GoalTab) => void;
  currentDraft: NutrientGoals;
  defaultGoals: NutrientGoals;
  onChange: (tab: GoalTab, key: NutrientKey, val: string) => void;
}

export function ManualGoalEditor({
  activeTab,
  setActiveTab,
  currentDraft,
  defaultGoals,
  onChange,
}: ManualGoalEditorProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      key="advanced"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-[var(--border-soft)] bg-[var(--warm-100)] p-1">
        <TabButton active={activeTab === 'daily'} onClick={() => setActiveTab('daily')} icon={<Sun size={16} strokeWidth={1.5} />}>
          {t('goalsModal.dailyTab')}
        </TabButton>
        <TabButton active={activeTab === 'meal'} onClick={() => setActiveTab('meal')} icon={<Moon size={16} strokeWidth={1.5} />}>
          {t('goalsModal.mealTab')}
        </TabButton>
      </div>

      <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-4">
        <label className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-[var(--text)]">
          {t('nutrients.calories.label')}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            step={10}
            value={currentDraft.calories}
            onChange={(e) => onChange(activeTab, 'calories', e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-4xl font-light leading-none text-[var(--text-h)] outline-none display-font tabular-nums"
          />
          <span className="text-sm font-medium text-[var(--text)]">kcal</span>
        </div>
        <p className="mt-2 text-xs text-[var(--text)]">{t('goalsModal.manualEditHint')}</p>
      </div>

      <div className="space-y-4">
        {Object.entries(groupNutrients()).map(([group, items]) => (
          <div key={group} className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-3">
            <p className="mb-2 px-1 text-xs font-medium uppercase tracking-[0.08em] text-[var(--text)]">
              {t('goalsModal.nutrientGroups.' + group)}
            </p>
            <div className="space-y-1">
              {items.map((meta) => {
                const key = meta.id as NutrientKey;
                const defaultValue = defaultGoals[key];
                const currentValue = currentDraft[key] as number;
                const isModified = currentValue !== defaultValue;

                return (
                  <div
                    key={meta.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--warm-100)]"
                  >
                    <label className="min-w-0 flex-1 text-sm font-medium text-[var(--text-h)]">
                      {t('nutrients.' + meta.id + '.label')}
                      <span className="ml-1.5 text-xs font-normal text-[var(--text)]">({meta.unit})</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      {isModified && (
                        <button
                          onClick={() => onChange(activeTab, key, String(defaultValue))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text)] transition-colors hover:bg-[var(--warm-200)] hover:text-[var(--action)]"
                          title={t('goalsModal.resetToDefault', { val: defaultValue, unit: meta.unit })}
                        >
                          <RotateCcw size={12} strokeWidth={1.5} />
                        </button>
                      )}
                      <input
                        type="number"
                        min={0}
                        step={meta.unit === 'µg' || meta.unit === 'mg' ? 0.1 : 1}
                        value={currentValue}
                        onChange={(e) => onChange(activeTab, key, e.target.value)}
                        className="w-24 rounded-lg bg-[var(--warm-100)] px-2.5 py-1.5 text-right text-sm font-medium text-[var(--text-h)] shadow-inner outline-none transition-all focus:ring-2 focus:ring-[var(--accent-soft)]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function groupNutrients() {
  return NUTRIENT_META.filter((meta) => meta.id !== 'calories').reduce<Record<string, typeof NUTRIENT_META>>(
    (groups, meta) => {
      groups[meta.group] = groups[meta.group] || [];
      groups[meta.group].push(meta);
      return groups;
    },
    {},
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
        active ? 'bg-[var(--bg)] text-[var(--text-h)] shadow-[var(--shadow-sm)]' : 'text-[var(--text)] hover:text-[var(--text-h)]'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
