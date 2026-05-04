import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { NutritionOverview } from '../NutritionOverview';
import { MealHistory } from '../MealHistory';
import * as Tooltip from '@radix-ui/react-tooltip';
import { FOODS } from '../../data/foods';
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
  onDeleteHistoryMeal?: (date: string, mealId: string) => void;
  onUpdateHistoryMealQty?: (date: string, mealId: string, foodIndex: number, newQty: number) => void;
  onEditHistoryMealFoods?: (date: string, mealId: string) => void;
  favoriteIds?: Set<string>;
  onToggleFavorite?: (meal: MealRecord) => void;
  onAddFood?: (id: string) => void;
  onValidateDay?: () => void;
}

function EmptyState({ onAddFood }: { onAddFood?: (id: string) => void }) {
  const suggested = FOODS.find((f) => f.id === 'lentilles_vertes');
  const cal = suggested ? Math.round((suggested.per100g.calories ?? 0) * suggested.defaultQty / 100) : 0;
  const prot = suggested ? ((suggested.per100g.proteines ?? 0) * suggested.defaultQty / 100).toFixed(1) : '0';

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      <svg width="192" height="160" viewBox="0 0 96 80" fill="none" className="opacity-70">
        <path d="M18 45 C18 68 78 68 78 45" stroke="var(--border)" strokeWidth="1.5" fill="none" />
        <ellipse cx="48" cy="45" rx="30" ry="7" fill="var(--bg-subtle)" stroke="var(--border)" strokeWidth="1.5" />
        <path d="M40 38 C44 30 52 30 56 38 C52 46 44 46 40 38Z" fill="var(--accent-soft)" />
        <line x1="48" y1="38" x2="48" y2="30" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M30 20 Q24 14 30 10 Q36 14 30 20Z" fill="var(--accent-light)" opacity="0.4" />
        <path d="M66 24 Q60 18 66 14 Q72 18 66 24Z" fill="var(--accent-light)" opacity="0.3" />
      </svg>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-light text-[var(--text-h)] display-font">Bienvenue</h1>
        <p className="text-base text-[var(--text)] max-w-sm">
          Choisis un aliment dans le panneau de droite pour découvrir tes apports nutritionnels.
        </p>
      </div>

      <div className="flex items-center gap-6">
        {[
          { num: '1', label: 'Ajoute', sub: 'un aliment', active: true },
          { num: '2', label: 'Ajuste', sub: 'les portions', active: false },
          { num: '3', label: 'Observe', sub: 'ta nutrition', active: false },
        ].map((step, i, arr) => (
          <div key={step.num} className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                  step.active
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'bg-[var(--warm-200)] text-[var(--text-muted)]'
                )}
              >
                {step.num}
              </div>
              <div className="text-center">
                <p className={clsx(
                  'text-sm font-medium leading-tight',
                  step.active ? 'text-[var(--text-h)]' : 'text-[var(--text-muted)]'
                )}>
                  {step.label}
                </p>
                <p className={clsx(
                  'text-xs leading-tight',
                  step.active ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'
                )}>
                  {step.sub}
                </p>
              </div>
            </div>
            {i < arr.length - 1 && (
              <div className="w-8 h-px bg-[var(--border)] self-start mt-5" />
            )}
          </div>
        ))}
      </div>

      {suggested && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-xs"
        >
          <div className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow-sm)] space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{suggested.emoji}</span>
              <div>
                <p className="text-base font-medium text-[var(--text-h)]">{suggested.name}</p>
                <p className="text-sm text-[var(--text)]">
                  {cal} kcal &middot; {prot}g prot
                </p>
              </div>
            </div>
            <button
              onClick={() => onAddFood?.(suggested.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--accent)] text-white text-base font-medium hover:bg-[#5C7D5B] transition-colors shadow-sm"
            >
              Ajouter à mon repas
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
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
  onAddFood,
  onValidateDay,
}: AnalysisViewProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [showRepas, setShowRepas] = useState(true);

  const showEmpty = selectedFoods.length === 0 && pastMeals.length === 0 && pastDays.length === 0;
  const hasFoods = selectedFoods.length > 0;

  const isPastDay = selectedDayIndex !== null;
  const selectedDay = isPastDay ? pastDays[selectedDayIndex] : null;

  const bufferFoods = useMemo(() => new Set(selectedFoods), [selectedFoods]);

  const currentFoods = useMemo(() => {
    if (isPastDay && selectedDay) return selectedDay.meals.flatMap(m => m.foods);
    return showRepas
      ? selectedFoods
      : [...selectedFoods, ...pastMeals.flatMap(m => m.foods)];
  }, [isPastDay, selectedDay, showRepas, selectedFoods, pastMeals]);

  const chronoDays = useMemo(() => [...pastDays].reverse(), [pastDays]);

  const canGoOlder = selectedDayIndex === null ? pastDays.length > 0 : selectedDayIndex < pastDays.length - 1;
  const canGoNewer = selectedDayIndex !== null;

  const goOlder = () => {
    if (!canGoOlder) return;
    if (selectedDayIndex === null) setSelectedDayIndex(0);
    else setSelectedDayIndex(selectedDayIndex + 1);
  };

  const goNewer = () => {
    if (!canGoNewer) return;
    if (selectedDayIndex === 0) setSelectedDayIndex(null);
    else setSelectedDayIndex(selectedDayIndex - 1);
  };

  const formatDayDate = (date: string) => {
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <AnimatePresence mode="wait">
      {showEmpty ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <EmptyState onAddFood={onAddFood} />
        </motion.div>
      ) : (
        <motion.div
          key="populated"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-full max-w-3xl mx-auto space-y-12 pb-8">
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="flex flex-col space-y-8">

                  {pastDays.length > 0 && (
                    <div className="flex items-center justify-center gap-4 pt-2">
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
                          const originalIdx = pastDays.length - 1 - i;
                          const isActive = selectedDayIndex === originalIdx;
                          const dayNum = pastDays.length - originalIdx;
                          return (
                            <Tooltip.Provider key={day.date} delayDuration={400}>
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <button
                                    onClick={() => setSelectedDayIndex(originalIdx)}
                                    className={clsx(
                                      "w-7 h-7 rounded-lg text-[11px] font-medium transition-all",
                                      isActive
                                        ? "bg-[var(--accent)] text-white shadow-sm"
                                        : "bg-[var(--warm-100)] text-[var(--text)] hover:bg-[var(--warm-200)] hover:text-[var(--text-h)]"
                                    )}
                                  >
                                    {dayNum}
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
                                onClick={() => { setSelectedDayIndex(null); setShowRepas(pastMeals.length === 0); }}
                                className={clsx(
                                  "w-7 h-7 rounded-lg text-[11px] font-medium transition-all border-2",
                                  selectedDayIndex === null
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
                      key={isPastDay ? `past-${selectedDayIndex}` : 'day'}
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
                      onDeleteHistory={onDeleteHistoryMeal ? (mealId) => onDeleteHistoryMeal(selectedDay.date, mealId) : undefined}
                      onUpdateQty={onUpdateHistoryMealQty ? (mealId, foodIndex, newQty) => onUpdateHistoryMealQty(selectedDay.date, mealId, foodIndex, newQty) : undefined}
                      onEditFoods={onEditHistoryMealFoods ? (mealId) => onEditHistoryMealFoods(selectedDay.date, mealId) : undefined}
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
