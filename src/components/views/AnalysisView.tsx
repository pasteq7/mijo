import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MealHistory } from '../MealHistory';
import { NutrientBar } from '../NutrientBar';
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
}

const GROUPS = [
  { key: 'macros', label: 'Macros' },
  { key: 'vitamines', label: 'Micros' },
  { key: 'mineraux', label: 'Minéraux' },
] as const;

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
}: AnalysisViewProps) {
  const [activeTab, setActiveTab] = useState('macros');
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  const selectedDay = selectedDayId ? pastDays.find(d => d.id === selectedDayId) ?? null : null;
  const isPastDay = selectedDay !== null;

  const currentTotals = isPastDay && selectedDay ? selectedDay.dailyTotals : dailyTotals;
  const currentGoal = dailyGoals;

  const cal = currentTotals.calories ?? 0;
  const calPct = Math.min((cal / currentGoal.calories) * 100, 100);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (calPct / 100) * circumference;

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

  const nutrientMeta = NUTRIENT_META.filter(n => n.group === activeTab);

  const combinedFoods: SelectedFood[] = useMemo(() => {
    const meals = isPastDay && selectedDay ? selectedDay.meals : pastMeals;
    return meals.flatMap(meal => meal.foods);
  }, [isPastDay, selectedDay, pastMeals]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-[11px] font-semibold text-[var(--text)] uppercase tracking-[0.12em] mb-6">
          Analyse nutritionnelle
        </h3>

        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border-soft)]">
          <svg width="90" height="90" viewBox="0 0 90 90" className="shrink-0">
            <circle cx="45" cy="45" r={radius} fill="none" stroke="var(--warm-200)" strokeWidth="8" />
            <motion.circle
              cx="45" cy="45" r={radius}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: offset }}
              transform="rotate(-90 45 45)"
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.8 }}
            />
            <text x="45" y="40" textAnchor="middle" className="font-number" fontSize="18" fill="var(--text-h)">
              {Math.round(cal)}
            </text>
            <text x="45" y="54" textAnchor="middle" fontSize="8" fill="var(--text-muted)">
              /{currentGoal.calories}
            </text>
          </svg>
          <div>
            <p className="text-xs text-[var(--text)] font-medium">Total du jour</p>
            <p className="text-2xl font-light text-[var(--text-h)] display-font tabular-nums">
              {Math.round(cal)} <span className="text-sm text-[var(--text-muted)] font-sans">kcal</span>
            </p>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {pastMeals.length} repas · {Math.round(calPct)}% objectif
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          {GROUPS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={clsx(
                'text-[11px] px-3.5 py-1.5 rounded-full transition-all font-medium',
                activeTab === key
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'bg-[var(--warm-100)] text-[var(--text)] hover:bg-[var(--warm-200)]'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              {nutrientMeta.map((meta) => {
                const val = currentTotals[meta.id as NutrientKey] ?? 0;
                const goal = currentGoal[meta.id as NutrientKey] as number;
                return (
                  <NutrientBar
                    key={meta.id}
                    meta={meta}
                    value={val}
                    goal={goal}
                    foods={combinedFoods}
                    showPlaceholder
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
      </div>

      <div className="pt-2 border-t border-[var(--border-soft)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-semibold text-[var(--text)] uppercase tracking-[0.12em]">
            Repas enregistrés
          </h3>
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
  );
}
