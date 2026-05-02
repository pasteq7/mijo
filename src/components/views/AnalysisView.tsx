import { useState } from 'react';
import { MealStats } from '../MealStats';
import { DayStats } from '../DayStats';
import { NutrientPanel } from '../NutrientPanel';
import { NutrientSuggestions } from '../NutrientSuggestions';
import { InsightCard } from '../InsightCard';
import { MealHistory } from '../MealHistory';
import { HistoryView } from '../HistoryView';
import { Leaf, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NutrientGoals, SelectedFood, MealRecord, DayRecord } from '../../types';
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
  pastMeals: MealRecord[];
  pastDays: DayRecord[];
  onAddFood: (id: string) => void;
  onEditMeal: (id: string) => void;
  onDeleteMeal: (id: string) => void;
  favoriteIds?: Set<string>;
  onToggleFavorite?: (meal: MealRecord) => void;
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
  pastMeals,
  pastDays,
  onAddFood,
  onEditMeal,
  onDeleteMeal,
  favoriteIds,
  onToggleFavorite
}: AnalysisViewProps) {
  const [viewMode, setViewMode] = useState<'meal' | 'day' | 'history'>('meal');
  const hasHistoryAdjustment = JSON.stringify(mealGoals) !== JSON.stringify(activeGoals);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12 pb-8">
      <div className="space-y-12">
        <div className="space-y-8">
          <div className="flex flex-col">
            <div className="flex justify-start border-b border-[var(--border)] gap-8">
              <button
                onClick={() => setViewMode('meal')}
                className={clsx(
                  "px-1 py-2.5 text-xs font-medium transition-all relative",
                  viewMode === 'meal' ? "text-[var(--text-h)]" : "text-[var(--text)] hover:text-[var(--text-h)]"
                )}
              >
                Repas
                {viewMode === 'meal' && (
                  <motion.div
                    layoutId="viewTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
                    transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
                  />
                )}
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={clsx(
                  "px-1 py-2.5 text-xs font-medium transition-all relative",
                  viewMode === 'day' ? "text-[var(--text-h)]" : "text-[var(--text)] hover:text-[var(--text-h)]"
                )}
              >
                Journée
                {viewMode === 'day' && (
                  <motion.div
                    layoutId="viewTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
                    transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
                  />
                )}
              </button>
              <button
                onClick={() => setViewMode('history')}
                className={clsx(
                  "px-1 py-2.5 text-xs font-medium transition-all relative",
                  viewMode === 'history' ? "text-[var(--text-h)]" : "text-[var(--text)] hover:text-[var(--text-h)]"
                )}
              >
                Historique
                {viewMode === 'history' && (
                  <motion.div
                    layoutId="viewTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
                    transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
                  />
                )}
              </button>
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
                ) : viewMode === 'day' ? (
                  <DayStats totals={dailyTotals} goals={dailyGoals} />
                ) : null}
              </motion.div>
            </AnimatePresence>

            {viewMode === 'day' && (
              <MealHistory
                meals={pastMeals}
                onEdit={onEditMeal}
                onDelete={onDeleteMeal}
                favoriteIds={favoriteIds}
                onToggleFavorite={onToggleFavorite}
              />
            )}

            {viewMode === 'history' && (
              <HistoryView
                pastDays={pastDays}
                dailyGoals={dailyGoals}
                mealGoals={mealGoals}
                favoriteIds={favoriteIds}
                onToggleFavorite={onToggleFavorite}
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-[var(--border)] pb-4">
              <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-[0.1em]">
                Couverture nutritionnelle ({viewMode === 'meal' ? 'Repas' : viewMode === 'day' ? 'Journée' : ''})
              </h3>
              {viewMode === 'meal' && hasHistoryAdjustment && (
                <span className="text-[10px] bg-[var(--highlight)] text-white px-2.5 py-1 rounded-full font-medium shadow-[var(--shadow-sm)]">
                  Ajusté selon les repas précédents
                </span>
              )}
            </div>
            {viewMode !== 'history' && (
              <NutrientPanel
                totals={viewMode === 'meal' ? totals : dailyTotals}
                goals={viewMode === 'meal' ? activeGoals : dailyGoals}
              />
            )}
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
                  <div className="flex items-center gap-2 bg text-sm font-medium text-[var(--text-h)]">
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
