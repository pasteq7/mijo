import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { MealHistory } from '../MealHistory';
import { DetailedNutritionDrawer } from '../DetailedNutritionDrawer';
import { NUTRIENT_META } from '../../data/nutrients';
import type { NutrientGoals, MealRecord, DayRecord, NutrientKey, SelectedFood } from '../../types';
import clsx from 'clsx';

interface AnalysisViewProps {
  dailyTotals: Partial<NutrientGoals>;
  dailyGoals: NutrientGoals;
  pastMeals: MealRecord[];
  pastDays: DayRecord[];
  onEditMeal: (id: string) => void;
  onDeleteMeal: (id: string) => void;
  onDeleteHistoryMeal?: (dayId: string, mealId: string) => void;
  onUpdateHistoryMealQty?: (dayId: string, mealId: string, foodIndex: number, newQty: number) => void;
  onEditHistoryMealFoods?: (dayId: string, mealId: string) => void;
  favoriteIds?: Set<string>;
  onToggleFavorite?: (meal: MealRecord) => void;
  onValidateDay?: () => void;
  currentMealFoods?: SelectedFood[];
  onAddMeal?: () => void;
}

const MACRO_KEYS: NutrientKey[] = ['proteines', 'glucides', 'lipides'];

const MACRO_COLORS: Record<string, string> = {
  proteines: '#8B7BA8',
  glucides: '#5A7FA0',
  lipides: '#C47A5A',
};

const NON_MACRO_NUTRIENTS = NUTRIENT_META.filter(
  n => n.group !== 'macros' && n.group !== 'aminoacides'
);

export function AnalysisView({
  dailyTotals,
  dailyGoals,
  pastMeals,
  pastDays,
  onEditMeal,
  onDeleteMeal,
  onDeleteHistoryMeal,
  onUpdateHistoryMealQty,
  onEditHistoryMealFoods,
  favoriteIds,
  onToggleFavorite,
  onValidateDay,
  currentMealFoods,
}: AnalysisViewProps) {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const selectedDay = selectedDayId ? pastDays.find(d => d.id === selectedDayId) ?? null : null;
  const isPastDay = selectedDay !== null;

  const currentTotals = isPastDay && selectedDay ? selectedDay.dailyTotals : dailyTotals;
  const currentGoal = dailyGoals;

  const cal = currentTotals.calories ?? 0;
  const calPct = Math.min((cal / currentGoal.calories) * 100, 100);

  const selectedDayIdx = useMemo(() => {
    if (!selectedDayId) return null;
    const idx = pastDays.findIndex(d => d.id === selectedDayId);
    return idx >= 0 ? idx : null;
  }, [selectedDayId, pastDays]);

  const canGoOlder = selectedDayId === null ? pastDays.length > 0 : (selectedDayIdx ?? -1) < pastDays.length - 1;
  const canGoNewer = selectedDayId !== null && selectedDayIdx !== null;

  const goOlder = () => {
    if (!canGoOlder) return;
    if (selectedDayId === null) setSelectedDayId(pastDays[0].id);
    else if (selectedDayIdx !== null) setSelectedDayId(pastDays[selectedDayIdx + 1].id);
  };

  const goNewer = () => {
    if (!canGoNewer) return;
    if (selectedDayIdx === 0) setSelectedDayId(null);
    else setSelectedDayId(pastDays[selectedDayIdx - 1].id);
  };

  const formatDayDate = (date: string) => {
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const combinedFoods: SelectedFood[] = useMemo(() => {
    const meals = isPastDay && selectedDay ? selectedDay.meals : pastMeals;
    const savedFoods = meals.flatMap(meal => meal.foods);
    if (!isPastDay && currentMealFoods) {
      return [...savedFoods, ...currentMealFoods];
    }
    return savedFoods;
  }, [isPastDay, selectedDay, pastMeals, currentMealFoods]);

  const bufferFoodsSet = useMemo(() => {
    if (!currentMealFoods) return undefined;
    return new Set(currentMealFoods);
  }, [currentMealFoods]);

  const metCount = NON_MACRO_NUTRIENTS.filter(n => {
    const val = currentTotals[n.id as NutrientKey] ?? 0;
    const goal = currentGoal[n.id as NutrientKey] ?? 0;
    return goal > 0 && val >= goal;
  }).length;

  return (
    <div className="space-y-8 flex flex-col min-h-0">
      <div className="overflow-y-auto flex-1 min-h-0 space-y-8 pr-1">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-[var(--text-h)] display-font">
                Analyse nutritionnelle
              </h3>
              <Info size={13} className="text-[var(--text-muted)] shrink-0" />
            </div>
            <div className="flex items-center gap-1">
              {pastDays.length > 0 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={goOlder}
                    disabled={!canGoOlder}
                    className={clsx(
                      "w-6 h-6 flex items-center justify-center rounded-lg transition-all",
                      canGoOlder
                        ? "text-[var(--text)] hover:bg-[var(--warm-200)]"
                        : "text-[var(--text-muted)] opacity-30 cursor-not-allowed"
                    )}
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <span className="text-[10px] text-[var(--text-muted)] tabular-nums min-w-[3rem] text-center">
                    {isPastDay && selectedDay ? formatDayDate(selectedDay.date) : 'Aujourd\'hui'}
                  </span>
                  <button
                    onClick={goNewer}
                    disabled={!canGoNewer}
                    className={clsx(
                      "w-6 h-6 flex items-center justify-center rounded-lg transition-all",
                      canGoNewer
                        ? "text-[var(--text)] hover:bg-[var(--warm-200)]"
                        : "text-[var(--text-muted)] opacity-30 cursor-not-allowed"
                    )}
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pb-3 border-b border-[var(--border-soft)] space-y-2.5">
            <div className="flex items-end justify-between">
              <p className="text-3xl font-light text-[var(--text-h)] display-font tabular-nums leading-none">
                {Math.round(cal)}
              </p>
              <p className="text-xs text-[var(--text-muted)] tabular-nums pb-0.5">
                <span className="text-[var(--accent)] font-medium">/ {currentGoal.calories}</span> kcal
              </p>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--warm-100)] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[var(--accent)]"
                initial={{ width: 0 }}
                animate={{ width: `${calPct}%` }}
                transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.8 }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
              <span>{pastMeals.length} repas</span>
              <span>{Math.round(calPct)}% objectif</span>
            </div>

            <div className="flex gap-3 pt-1">
              {MACRO_KEYS.map((key) => {
                const val = currentTotals[key] ?? 0;
                const goal = currentGoal[key] ?? 0;
                const pct = goal > 0 ? Math.min((val / goal) * 100, 100) : 0;
                const meta = NUTRIENT_META.find(m => m.id === key);
                return (
                  <div key={key} className="flex-1 min-w-0">
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-[var(--text-muted)] truncate">{meta?.label}</span>
                      <span className="tabular-nums text-[var(--text)] ml-1">{Math.round(val)}g</span>
                    </div>
                    <div className="h-1 rounded-full bg-[var(--warm-100)] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
                        style={{ backgroundColor: MACRO_COLORS[key] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[var(--text-muted)]">
                {metCount}/{NON_MACRO_NUTRIENTS.length} micronutriments atteints
              </span>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="text-[11px] font-medium text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors"
              >
                Voir l'analyse complète →
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--border-soft)]">
          {selectedDayId && selectedDay ? (
            <MealHistory
              meals={selectedDay.meals}
              readOnly
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
              onDeleteHistory={onDeleteHistoryMeal ? (mealId) => onDeleteHistoryMeal(selectedDay.id, mealId) : undefined}
              onUpdateQty={onUpdateHistoryMealQty ? (mealId, foodIndex, newQty) => onUpdateHistoryMealQty(selectedDay.id, mealId, foodIndex, newQty) : undefined}
              onEditFoods={onEditHistoryMealFoods ? (mealId) => onEditHistoryMealFoods(selectedDay.id, mealId) : undefined}
            />
          ) : (
            <MealHistory
              meals={pastMeals}
              onEdit={onEditMeal}
              onDelete={onDeleteMeal}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
              onValidateDay={onValidateDay}
            />
          )}
        </div>
      </div>

      <DetailedNutritionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        totals={currentTotals}
        goals={currentGoal}
        foods={combinedFoods}
        bufferFoods={bufferFoodsSet}
      />
    </div>
  );
}
