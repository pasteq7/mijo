import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NutritionOverview } from '../NutritionOverview';
import { MealHistory } from '../MealHistory';
import { StepIndicator } from '../StepIndicator';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { NutrientGoals, SelectedFood, MealRecord, DayRecord } from '../../types';
import clsx from 'clsx';

interface AnalysisViewProps {
  totals: Partial<NutrientGoals>;
  dailyTotals: Partial<NutrientGoals>;
  dailyGoals: NutrientGoals;
  mealGoals: NutrientGoals;
  selectedFoods: SelectedFood[];
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

export function AnalysisView({
  totals,
  dailyTotals,
  dailyGoals,
  mealGoals,
  selectedFoods,
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
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [showRepas, setShowRepas] = useState(true);

  const showEmpty = selectedFoods.length === 0 && pastMeals.length === 0 && pastDays.length === 0;
  const hasFoods = selectedFoods.length > 0;

  const selectedDay = selectedDayId ? pastDays.find(d => d.id === selectedDayId) ?? null : null;
  const isPastDay = selectedDay !== null;

  const bufferFoods = useMemo(() => new Set(selectedFoods), [selectedFoods]);

  const currentFoods = useMemo(() => {
    if (isPastDay && selectedDay) return selectedDay.meals.flatMap(m => m.foods);
    return showRepas
      ? selectedFoods
      : [...selectedFoods, ...pastMeals.flatMap(m => m.foods)];
  }, [isPastDay, selectedDay, showRepas, selectedFoods, pastMeals]);

  const chronoDays = useMemo(() => [...pastDays].reverse(), [pastDays]);

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

  return (
    <AnimatePresence mode="wait">
      {showEmpty ? null : (
        <motion.div
          key="populated"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-full space-y-6 pb-4">
            <StepIndicator step={3} label="Analyser" />
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col space-y-4">
                  {pastDays.length > 0 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        onClick={goOlder}
                        disabled={!canGoOlder}
                        className={clsx(
                          "w-7 h-7 flex items-center justify-center rounded-lg transition-all",
                          canGoOlder
                            ? "text-[var(--text-h)] hover:bg-[var(--warm-200)]"
                            : "text-[var(--text)] opacity-30 cursor-not-allowed"
                        )}
                      >
                        <ChevronLeft size={14} />
                      </button>

                      <div className="flex items-center gap-1.5">
                        {chronoDays.map((day, i) => {
                          const isActive = day.id === selectedDayId;
                          const dayNumber = i + 1;
                          return (
                            <Tooltip.Provider key={day.id} delayDuration={400}>
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <button
                                    onClick={() => setSelectedDayId(day.id)}
                                    className={clsx(
                                      "w-7 h-7 rounded-lg text-[11px] font-medium transition-all",
                                      isActive
                                        ? "bg-[var(--accent)] text-white shadow-sm"
                                        : "bg-[var(--warm-100)] text-[var(--text)] hover:bg-[var(--warm-200)] hover:text-[var(--text-h)]"
                                    )}
                                  >
                                    {dayNumber}
                                  </button>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content
                                    side="top"
                                    align="center"
                                    sideOffset={6}
                                    className="z-50 bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-h)] text-[11px] leading-relaxed px-3 py-2 rounded-lg shadow-lg space-y-0.5"
                                  >
                                    <p className="font-medium">{formatDayDate(day.date)}</p>
                                    <p className="text-[var(--text)]">
                                      {day.score?.label ?? '—'} &middot; {Math.round(day.dailyTotals.calories ?? 0)} kcal
                                    </p>
                                    <Tooltip.Arrow className="fill-[var(--bg-subtle)]" />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              </Tooltip.Root>
                            </Tooltip.Provider>
                          );
                        })}
                        <Tooltip.Provider delayDuration={400}>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button
                                  onClick={() => { setSelectedDayId(null); setShowRepas(pastMeals.length === 0); }}
                                className={clsx(
                                  "w-7 h-7 rounded-lg text-[11px] font-medium transition-all border-2",
                                  selectedDayId === null
                                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                                    : "border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                )}
                              >
                                A
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                side="top"
                                align="center"
                                sideOffset={6}
                                className="z-50 bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-h)] text-[11px] leading-relaxed px-3 py-2 rounded-lg shadow-lg space-y-0.5"
                              >
                                <p className="font-medium">Aujourd'hui</p>
                                <p className="text-[var(--text)]">
                                  {Math.round(dailyTotals.calories ?? 0)} kcal &middot; {pastMeals.length} repas
                                </p>
                                <Tooltip.Arrow className="fill-[var(--bg-subtle)]" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </Tooltip.Provider>
                      </div>

                      <button
                        onClick={goNewer}
                        disabled={!canGoNewer}
                        className={clsx(
                          "w-7 h-7 flex items-center justify-center rounded-lg transition-all",
                          canGoNewer
                            ? "text-[var(--text-h)] hover:bg-[var(--warm-200)]"
                            : "text-[var(--text)] opacity-30 cursor-not-allowed"
                        )}
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isPastDay ? `past-${selectedDayId}` : 'day'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <NutritionOverview
                        totals={isPastDay && selectedDay ? selectedDay.dailyTotals : (showRepas ? totals : dailyTotals)}
                        goals={isPastDay && selectedDay ? dailyGoals : (showRepas ? mealGoals : dailyGoals)}
                        showPlaceholder={!hasFoods && !isPastDay}
                        foods={currentFoods}
                        bufferFoods={!isPastDay && !showRepas ? bufferFoods : undefined}
                        dayRecord={isPastDay && selectedDay ? selectedDay : undefined}
                        showToggle={!isPastDay}
                        showRepas={showRepas}
                        onToggleRepas={setShowRepas}
                      />
                    </motion.div>
                  </AnimatePresence>
                  {isPastDay && selectedDay ? (
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
