import { useState } from 'react';
import { MealStats } from '../MealStats';
import { DayStats } from '../DayStats';
import { NutrientPanel } from '../NutrientPanel';
import { NutrientSuggestions } from '../NutrientSuggestions';
import { InsightCard } from '../InsightCard';
import { Leaf, Target, Pill, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NutrientGoals, SelectedFood } from '../../types';
import type { FoodSuggestion } from '../../utils/recommendations';
import clsx from 'clsx';

interface AnalysisViewProps {
  totals: Partial<NutrientGoals>;
  dailyTotals: Partial<NutrientGoals>;
  dailyGoals: NutrientGoals;
  mealGoals: NutrientGoals;
  activeGoals: NutrientGoals;
  balancedSuggestions: FoodSuggestion[];
  targetedSuggestions: FoodSuggestion[];
  selectedFoods: SelectedFood[];
  onAddFood: (id: string) => void;
  onSaveMeal: () => void;
}

export function AnalysisView({
  totals,
  dailyTotals,
  dailyGoals,
  mealGoals,
  activeGoals,
  balancedSuggestions,
  targetedSuggestions,
  selectedFoods,
  onAddFood,
  onSaveMeal
}: AnalysisViewProps) {
  const [viewMode, setViewMode] = useState<'meal' | 'day'>('meal');
  const hasHistoryAdjustment = JSON.stringify(mealGoals) !== JSON.stringify(activeGoals);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12 pb-24">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-[var(--text-h)] tracking-tight display-font">Mon Repas</h1>
          <div className="h-1 w-16 bg-[var(--accent)] mt-4 rounded-full opacity-60" />
        </div>
        {selectedFoods.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onSaveMeal}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-2xl font-medium hover:bg-[#5C7D5B] transition-colors shadow-[var(--shadow-sm)]"
          >
            <CheckCircle2 size={18} strokeWidth={2} />
            Valider le repas
          </motion.button>
        )}
      </header>

      {/* Permanent Supplement Reminder */}
      <div className="flex items-center gap-4 p-5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-2xl text-[var(--text-h)] text-sm">
        <div className="p-2.5 bg-[var(--warm-100)] shadow-[var(--shadow-sm)] rounded-xl text-[var(--info)]"><Pill size={20} strokeWidth={1.5} /></div>
        <div>
          <span className="font-medium block text-[var(--text-h)] mb-0.5">Rappel Quotidien : Compléments Végans</span>
          <span className="text-[var(--text)] text-xs">La B12 et la Vitamine D se prennent en supplémentation. Prends-tu tes vitamines ?</span>
        </div>
      </div>

      <div className="space-y-12">
        <div className="space-y-8">
          <div className="flex flex-col gap-6">
            <div className="flex justify-center mb-4">
              <div className="bg-[var(--warm-100)] p-1.5 rounded-2xl flex gap-1 shadow-[var(--shadow-sm)]">
                <button
                  onClick={() => setViewMode('meal')}
                  className={clsx(
                    "px-6 py-2 rounded-xl text-xs font-medium transition-all relative",
                    viewMode === 'meal' ? "text-[var(--text-h)]" : "text-[var(--text)] hover:text-[var(--text-h)]"
                  )}
                >
                  <span className="relative z-10">Par Repas</span>
                  {viewMode === 'meal' && (
                    <motion.div
                      layoutId="viewTab"
                      className="absolute inset-0 bg-[var(--bg-subtle)] rounded-xl shadow-[var(--shadow-sm)]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={clsx(
                    "px-6 py-2 rounded-xl text-xs font-medium transition-all relative",
                    viewMode === 'day' ? "text-[var(--text-h)]" : "text-[var(--text)] hover:text-[var(--text-h)]"
                  )}
                >
                  <span className="relative z-10">Par Journée</span>
                  {viewMode === 'day' && (
                    <motion.div
                      layoutId="viewTab"
                      className="absolute inset-0 bg-[var(--bg-subtle)] rounded-xl shadow-[var(--shadow-sm)]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {viewMode === 'meal' ? (
                  <MealStats totals={totals} goals={mealGoals} />
                ) : (
                  <DayStats totals={dailyTotals} goals={dailyGoals} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-[var(--border)] pb-4">
              <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-[0.1em]">
                Couverture nutritionnelle ({viewMode === 'meal' ? 'Repas' : 'Journée'})
              </h3>
              {viewMode === 'meal' && hasHistoryAdjustment && (
                <span className="text-[10px] bg-[var(--highlight)] text-white px-2.5 py-1 rounded-full font-medium shadow-[var(--shadow-sm)]">
                  Ajusté selon les repas précédents
                </span>
              )}
            </div>
            <NutrientPanel
              totals={viewMode === 'meal' ? totals : dailyTotals}
              goals={viewMode === 'meal' ? activeGoals : dailyGoals}
            />
          </div>
        </div>

        {(balancedSuggestions.length > 0 || targetedSuggestions.length > 0) && selectedFoods.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-widest">
              Suggestions pour compléter
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {balancedSuggestions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-h)]">
                    <Leaf size={16} className="text-[#7C9A6E]" />
                    Approche équilibrée
                  </div>
                  <NutrientSuggestions suggestions={balancedSuggestions} onAddFood={onAddFood} />
                </div>
              )}

              {targetedSuggestions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-h)]">
                    <Target size={16} className="text-amber-600" />
                    Ciblage critique
                  </div>
                  <NutrientSuggestions suggestions={targetedSuggestions} onAddFood={onAddFood} />
                </div>
              )}
            </div>
          </div>
        )}

        {selectedFoods.length > 0 && (
          <div className="pt-8 border-t border-[var(--border)]">
            <InsightCard totals={totals} goals={dailyGoals} />
          </div>
        )}
      </div>
    </div>
  );
}
