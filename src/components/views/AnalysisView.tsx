import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowLeft, Utensils } from 'lucide-react';
import { MealHistory } from '../MealHistory';
import { NutrientBar } from '../NutrientBar';
import { AnalysisCalendar } from '../analysis/AnalysisCalendar';
import { NUTRIENT_META } from '../../data/nutrients';
import type { NutrientGoals, MealRecord, DayRecord, NutrientKey, SelectedFood, FavoriteMeal } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
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
  favorites?: FavoriteMeal[];
  favoriteIds?: Set<string>;
  onToggleFavorite?: (meal: MealRecord) => void;
  onAddFavoriteMeal?: (favorite: FavoriteMeal) => void;
  onDeleteFavorite?: (id: string) => void;
  onValidateDay?: () => void;
  currentMealFoods?: SelectedFood[];
  onSelectedDayChange?: (dayId: string | null) => void;
}

type NutrientSection = 'macros' | 'micros' | 'minerals';

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
  favorites,
  favoriteIds,
  onToggleFavorite,
  onAddFavoriteMeal,
  onDeleteFavorite,
  onValidateDay,
  currentMealFoods,
  onSelectedDayChange,
}: AnalysisViewProps) {
  const { t } = useLanguage();
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<NutrientSection>('macros');

  const nutrientSections = useMemo<{ id: NutrientSection; label: string; groups: string[] }[]>(() => [
    { id: 'macros', label: t('analysis.sections.macros'), groups: ['macros', 'aminoacides'] },
    { id: 'micros', label: t('analysis.sections.micros'), groups: ['vitamines', 'acidesgras'] },
    { id: 'minerals', label: t('analysis.sections.minerals'), groups: ['mineraux'] },
  ], [t]);

  const selectedDay = selectedDayId ? pastDays.find(d => d.id === selectedDayId) ?? null : null;
  const isPastDay = selectedDay !== null;

  useEffect(() => {
    onSelectedDayChange?.(selectedDay?.id ?? null);
  }, [onSelectedDayChange, selectedDay]);

  const currentTotals = isPastDay && selectedDay ? selectedDay.dailyTotals : dailyTotals;
  const currentGoal = dailyGoals;

  const mealsForView = isPastDay && selectedDay ? selectedDay.meals : pastMeals;
  const cal = currentTotals.calories ?? 0;
  const calPct = Math.min((cal / currentGoal.calories) * 100, 100);

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

  const sectionStats = useMemo(() => {
    return nutrientSections.reduce((acc, section) => {
      const nutrients = NUTRIENT_META.filter(n => {
        if (n.id === 'calories') return false;
        return section.groups.includes(n.group);
      });
      const met = nutrients.filter(n => {
        const val = currentTotals[n.id as NutrientKey] ?? 0;
        const goal = currentGoal[n.id as NutrientKey] ?? 0;
        return goal > 0 && val >= goal;
      }).length;

      acc[section.id] = { nutrients, met };
      return acc;
    }, {} as Record<NutrientSection, { nutrients: typeof NUTRIENT_META; met: number }>);
  }, [currentTotals, currentGoal, nutrientSections]);

  const activeNutrients = sectionStats[activeSection].nutrients;

  return (
    <div className="flex flex-col gap-4 overflow-visible lg:h-full lg:min-h-0 lg:overflow-hidden">
      <header className="shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-[var(--text-h)] display-font">
              {t('analysis.title')}
            </h3>
          </div>

          <AnalysisCalendar
            selectedDay={selectedDay}
            selectedDayId={selectedDayId}
            pastDays={pastDays}
            onSelectDayId={setSelectedDayId}
          />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-4 overflow-visible lg:grid-rows-[minmax(150px,0.9fr)_minmax(230px,1.1fr)] lg:overflow-hidden">
        <section className="card p-3.5 flex flex-col min-h-0 overflow-hidden max-h-[360px] lg:max-h-none">
          <div className={clsx(
            "flex-grow flex-1 min-h-0 flex flex-col",
            mealsForView.length > 0 ? "overflow-y-auto pr-1" : "overflow-hidden"
          )}>
            {selectedDayId && selectedDay ? (
              <MealHistory
                meals={selectedDay.meals}
                readOnly
                favorites={favorites}
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
                favorites={favorites}
                favoriteIds={favoriteIds}
                onToggleFavorite={onToggleFavorite}
                onAddFavoriteMeal={onAddFavoriteMeal}
                onDeleteFavorite={onDeleteFavorite}
              />
            )}

            {mealsForView.length === 0 && (
              <div className="flex-grow flex-1 flex flex-col items-center justify-center text-center py-4 px-4 overflow-hidden select-none">
                {(currentMealFoods?.length ?? 0) === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-[var(--border)]/65 flex items-center justify-center mb-3 bg-[var(--warm-100)]/10">
                      <Utensils size={14} className="text-[var(--text-muted)] opacity-60" />
                    </div>
                    <p className="text-xs font-semibold text-[var(--text-h)] mb-0.5">{t('analysis.noMealRegistered')}</p>
                    <p className="text-[10px] text-[var(--text-muted)] max-w-[180px] leading-normal">
                      {t('analysis.composeFirstMeal')}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative w-16 h-16 rounded-full border border-dashed border-[var(--accent)]/45 flex items-center justify-center mb-3 bg-[var(--accent-soft)]/5">
                      <Sparkles size={14} className="text-[var(--accent)] animate-spin-slow" />
                    </div>
                    <p className="text-xs font-semibold text-[var(--text-h)] mb-0.5">{t('analysis.plateReady')}</p>
                    <p className="text-[10px] text-[var(--text-muted)] max-w-[180px] leading-normal mb-2">
                      {t('analysis.validateToSave')}
                    </p>
                    
                    <motion.div
                      animate={{ x: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="text-[var(--accent)]"
                    >
                      <ArrowLeft size={12} strokeWidth={2.5} />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="card p-3.5 flex min-h-0 flex-col gap-2.5 overflow-hidden max-h-[420px] lg:max-h-none">
          <div className="shrink-0">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--accent)] px-2.5 py-0.5">
                {t('analysis.nutrients')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 rounded-xl bg-[var(--warm-100)]/70 p-1 border border-[var(--border-soft)]/40 shadow-xs">
              {nutrientSections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={clsx(
                      'relative min-w-0 rounded-lg px-2 py-1 text-center transition-colors cursor-pointer',
                      isActive
                        ? 'font-semibold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-h)]'
                    )}
                    aria-pressed={isActive}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="analysis-nutrient-section"
                        className="absolute inset-0 rounded-lg bg-[var(--bg-raised)] shadow-xs border border-[var(--border-soft)]/40"
                        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.22 }}
                      />
                    )}
                    <span className={clsx(
                      'relative z-10 block truncate text-[11px] font-semibold leading-tight transition-colors',
                      isActive ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-muted)]'
                    )}>
                      {section.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {activeNutrients.map((meta) => {
              const val = currentTotals[meta.id as NutrientKey] ?? 0;
              const goal = currentGoal[meta.id as NutrientKey] ?? 0;
              return (
                <NutrientBar
                  key={meta.id}
                  meta={meta}
                  value={val}
                  goal={goal}
                  foods={combinedFoods}
                  bufferFoods={bufferFoodsSet}
                  compact
                />
              );
            })}
          </div>
        </section>
      </div>

      <footer className="shrink-0 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-raised)] p-4 shadow-sm relative overflow-hidden">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {t('analysis.dailyTotalLabel')}
            </p>
            <p className="text-3xl font-light text-[var(--text-h)] display-font tabular-nums leading-none mt-1">
              {Math.round(cal)}
              <span className="ml-1 text-xs font-medium text-[var(--text-muted)]">{t('common.kcal')}</span>
            </p>
          </div>
          <div className="text-right text-[11px] text-[var(--text-muted)] tabular-nums">
            <p><span className="font-medium text-[var(--accent)]">/ {currentGoal.calories}</span> {t('common.kcal')}</p>
            <p className="font-medium text-[var(--text-h)] mt-0.5">{Math.round(calPct)}{t('common.percentageOfGoal')}</p>
          </div>
        </div>

        <div className="h-2 rounded-full bg-[var(--warm-100)] dark:bg-[var(--warm-200)]/20 overflow-hidden shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent)] shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${calPct}%` }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.8 }}
          />
        </div>

        {!isPastDay && onValidateDay && pastMeals.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onValidateDay}
            className="mt-3.5 w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white py-2.5 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Check size={14} strokeWidth={2.5} />
            {t('analysis.closeDayButton')}
          </motion.button>
        )}
      </footer>
    </div>
  );
}
