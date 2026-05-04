import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { NutrientBar } from './NutrientBar';
import { NUTRIENT_META } from '../data/nutrients';
import type { NutrientGoals, NutrientKey, SelectedFood, DayRecord } from '../types';
import clsx from 'clsx';

interface Props {
  totals: Partial<NutrientGoals>;
  goals: NutrientGoals;
  showPlaceholder?: boolean;
  foods?: SelectedFood[];
  bufferFoods?: Set<SelectedFood>;
  dayRecord?: DayRecord;
  showToggle?: boolean;
  showRepas: boolean;
  onToggleRepas: (showRepas: boolean) => void;
}

const colorMap: Record<string, string> = {
  'Excellent': 'text-[var(--accent)]',
  'Équilibré': 'text-[var(--accent)]',
  'Léger': 'text-[var(--text)]',
  'En cours': 'text-[var(--text-h)]',
  'Généreux': 'text-[var(--action)]',
};

const GROUPS = [
  { key: 'macros', label: 'Macro' },
  { key: 'vitamines', label: 'Vit' },
  { key: 'mineraux', label: 'Min' },
] as const;

export function NutritionOverview({
  totals,
  goals,
  showPlaceholder,
  foods,
  bufferFoods,
  dayRecord,
  showToggle,
  showRepas,
  onToggleRepas,
}: Props) {
  const [activeTab, setActiveTab] = useState('macros');

  const cal = totals.calories ?? 0;
  const calPct = Math.min((cal / goals.calories) * 100, 100);

  const inlineScore = cal === 0 ? null : calPct < 50
    ? { label: 'Léger', color: 'text-[var(--text)]' }
    : calPct < 80
      ? { label: 'En cours', color: 'text-[var(--text-h)]' }
      : calPct <= 110
        ? { label: 'Équilibré', color: 'text-[var(--accent)]' }
        : { label: 'Généreux', color: 'text-[var(--action)]' };

  const scoreLabel = dayRecord?.score?.label ?? inlineScore?.label ?? null;
  const scoreColor = dayRecord?.score
    ? (colorMap[dayRecord.score.label] ?? 'text-[var(--text)]')
    : (inlineScore?.color ?? '');

  return (
    <div className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)]">
      <div className="px-6 pt-5 pb-3">
        <div className="flex justify-between items-start mb-4">
          <div>
            <motion.p
              key={Math.round(cal)}
              initial={{ opacity: 0.5, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-light text-[var(--text-h)] tabular-nums tracking-tighter display-font"
            >
              <span className="font-number">{Math.round(cal)}</span>
              <span className="text-sm font-normal text-[var(--text)] ml-1.5 font-sans">kcal</span>
            </motion.p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs font-medium text-[var(--text)] uppercase tracking-[0.1em] opacity-60">
              / {goals.calories}
            </p>
            {showToggle && (
              <div className="flex bg-[var(--warm-100)] rounded-xl p-0.5 shadow-inner">
                <button
                  onClick={() => onToggleRepas(false)}
                  className={clsx(
                    "px-3 py-1 text-xs font-medium rounded-lg transition-all",
                    !showRepas
                      ? "bg-white text-[var(--text-h)] shadow-sm"
                      : "text-[var(--text)] hover:text-[var(--text-h)]"
                  )}
                >
                  Journée
                </button>
                <button
                  onClick={() => onToggleRepas(true)}
                  className={clsx(
                    "px-3 py-1 text-xs font-medium rounded-lg transition-all",
                    showRepas
                      ? "bg-white text-[var(--text-h)] shadow-sm"
                      : "text-[var(--text)] hover:text-[var(--text-h)]"
                  )}
                >
                  Repas
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="h-2 bg-[var(--warm-200)] rounded-full overflow-hidden shadow-inner mb-4">
          <motion.div
            className="h-full bg-[var(--accent)] rounded-full"
            animate={{ width: `${calPct}%` }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {scoreLabel && (
              <p className={`text-xs font-medium ${scoreColor}`}>
                {scoreLabel}
                {dayRecord?.validatedAt && ' · Validée'}
              </p>
            )}
            <Tooltip.Provider delayDuration={200}>
              <Tooltip.Root>
                <Tooltip.Trigger className="cursor-help">
                  <Info size={12} className="text-[var(--text)] opacity-40 hover:opacity-70 transition-opacity" />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    align="center"
                    sideOffset={6}
                    className="z-50 max-w-[220px] bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-h)] text-[11px] leading-relaxed px-3 py-2 rounded-lg shadow-lg"
                  >
                    Pense à prendre un complément de vitamine B12, iode et vitamine D — difficiles à couvrir uniquement par l'alimentation végétale.
                    <Tooltip.Arrow className="fill-[var(--bg-subtle)]" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
          <div className="flex gap-4 text-xs">
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
        </div>
      </div>

      <div className="px-6 pb-5">
        <motion.div layout className="min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {NUTRIENT_META.filter((n) => n.group === activeTab).map((meta) => (
                <NutrientBar
                  key={meta.id}
                  meta={meta}
                  value={totals[meta.id as NutrientKey] ?? 0}
                  goal={goals[meta.id as NutrientKey] as number}
                  showPlaceholder={showPlaceholder}
                  foods={foods}
                  bufferFoods={bufferFoods}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
