import { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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
  currentMealFoods?: SelectedFood[];
  onAddMeal?: () => void;
}

type NutrientSection = 'macros' | 'micros' | 'minerals';

const NUTRIENT_SECTIONS: {
  id: NutrientSection;
  label: string;
  groups: string[];
}[] = [
    { id: 'macros', label: 'Macros', groups: ['macros', 'aminoacides'] },
    { id: 'micros', label: 'Micros', groups: ['vitamines', 'acidesgras'] },
    { id: 'minerals', label: 'Minéraux', groups: ['mineraux'] },
  ];

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
  const [activeSection, setActiveSection] = useState<NutrientSection>('micros');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  const selectedDay = selectedDayId ? pastDays.find(d => d.id === selectedDayId) ?? null : null;
  const isPastDay = selectedDay !== null;

  const currentTotals = isPastDay && selectedDay ? selectedDay.dailyTotals : dailyTotals;
  const currentGoal = dailyGoals;

  const mealsForView = isPastDay && selectedDay ? selectedDay.meals : pastMeals;
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
    const d = new Date(`${date}T00:00:00`);
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

  const sectionStats = useMemo(() => {
    return NUTRIENT_SECTIONS.reduce((acc, section) => {
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
  }, [currentTotals, currentGoal]);

  const activeNutrients = sectionStats[activeSection].nutrients;

  const todayKey = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const registeredDaysByDate = useMemo(() => {
    return new Map(pastDays.map(day => [day.date, day]));
  }, [pastDays]);

  const calendarMonthLabel = useMemo(() => {
    return calendarMonth.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  }, [calendarMonth]);

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: 42 }, (_, index) => {
      const dayNumber = index - startOffset + 1;
      if (dayNumber < 1 || dayNumber > daysInMonth) return null;
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
      return {
        dayNumber,
        dateKey,
        record: registeredDaysByDate.get(dateKey),
        isToday: dateKey === todayKey,
      };
    });
  }, [calendarMonth, registeredDaysByDate, todayKey]);

  useEffect(() => {
    if (!isCalendarOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (calendarRef.current?.contains(event.target as Node)) return;
      setIsCalendarOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCalendarOpen(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCalendarOpen]);

  const shiftCalendarMonth = (offset: number) => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const selectRegisteredDay = (day: DayRecord) => {
    setSelectedDayId(day.id);
    setCalendarMonth(new Date(`${day.date}T00:00:00`));
    setIsCalendarOpen(false);
  };

  const selectToday = () => {
    setSelectedDayId(null);
    setCalendarMonth(new Date());
    setIsCalendarOpen(false);
  };

  const toggleCalendar = () => {
    if (!isCalendarOpen) {
      setCalendarMonth(selectedDay ? new Date(`${selectedDay.date}T00:00:00`) : new Date());
    }
    setIsCalendarOpen(open => !open);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <header className="shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-[var(--text-h)] display-font">
              Analyse nutritionnelle
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!isPastDay && onValidateDay && pastMeals.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onValidateDay}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-[var(--accent-light)]"
              >
                <Check size={13} />
                Valider
              </motion.button>
            )}

            {pastDays.length > 0 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={goOlder}
                  disabled={!canGoOlder}
                  className={clsx(
                    'w-7 h-7 flex items-center justify-center rounded-lg transition-all',
                    canGoOlder
                      ? 'text-[var(--text)] hover:bg-[var(--warm-200)]'
                      : 'text-[var(--text-muted)] opacity-30 cursor-not-allowed'
                  )}
                  aria-label="Jour précédent"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="text-[11px] text-[var(--text)] tabular-nums min-w-[4.25rem] text-center">
                  {isPastDay && selectedDay ? formatDayDate(selectedDay.date) : 'Aujourd\'hui'}
                </span>
                <button
                  onClick={goNewer}
                  disabled={!canGoNewer}
                  className={clsx(
                    'w-7 h-7 flex items-center justify-center rounded-lg transition-all',
                    canGoNewer
                      ? 'text-[var(--text)] hover:bg-[var(--warm-200)]'
                      : 'text-[var(--text-muted)] opacity-30 cursor-not-allowed'
                  )}
                  aria-label="Jour suivant"
                >
                  <ChevronRight size={13} />
                </button>
                <div className="relative" ref={calendarRef}>
                  <button
                    type="button"
                    onClick={toggleCalendar}
                    className={clsx(
                      'w-7 h-7 flex items-center justify-center rounded-lg border transition-all',
                      isCalendarOpen
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'border-transparent text-[var(--text)] hover:bg-[var(--warm-200)]'
                    )}
                    aria-label="Ouvrir le calendrier"
                    aria-expanded={isCalendarOpen}
                  >
                    <CalendarDays size={13} />
                  </button>

                  {isCalendarOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.16 }}
                      className="absolute right-0 top-8 z-30 w-56 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-raised)] p-2.5 shadow-lg"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => shiftCalendarMonth(-1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text)] transition-colors hover:bg-[var(--warm-100)]"
                          aria-label="Mois precedent"
                        >
                          <ChevronLeft size={13} />
                        </button>
                        <p className="min-w-0 flex-1 text-center text-[11px] font-semibold capitalize text-[var(--text-h)] tabular-nums">
                          {calendarMonthLabel}
                        </p>
                        <button
                          type="button"
                          onClick={() => shiftCalendarMonth(1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text)] transition-colors hover:bg-[var(--warm-100)]"
                          aria-label="Mois suivant"
                        >
                          <ChevronRight size={13} />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 px-0.5 text-center text-[9px] font-semibold uppercase text-[var(--text-muted)]">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((weekday, index) => (
                          <span key={`${weekday}-${index}`} className="leading-5">
                            {weekday}
                          </span>
                        ))}
                      </div>

                      <div className="mt-1 grid grid-cols-7 gap-1">
                        {calendarDays.map((day, index) => {
                          if (!day) {
                            return <span key={`empty-${index}`} className="h-7" aria-hidden />;
                          }

                          const isSelected = selectedDay?.date === day.dateKey || (!selectedDay && day.isToday);
                          const isRegistered = Boolean(day.record);

                          return (
                            <button
                              key={day.dateKey}
                              type="button"
                              onClick={() => day.record ? selectRegisteredDay(day.record) : day.isToday ? selectToday() : undefined}
                              disabled={!isRegistered && !day.isToday}
                              className={clsx(
                                'relative flex h-7 w-7 items-center justify-center rounded-lg text-[11px] tabular-nums transition-all',
                                isSelected
                                  ? 'bg-[var(--accent)] font-semibold text-white shadow-sm'
                                  : isRegistered
                                    ? 'text-[var(--text-h)] hover:bg-[var(--accent-soft)]'
                                    : day.isToday
                                      ? 'text-[var(--accent)] hover:bg-[var(--accent-soft)]'
                                      : 'cursor-default text-[var(--text-muted)] opacity-30'
                              )}
                              aria-label={day.record ? `Voir le ${formatDayDate(day.dateKey)}` : day.isToday ? "Voir aujourd'hui" : undefined}
                            >
                              {day.dayNumber}
                              {isRegistered && !isSelected && (
                                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--accent)]" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-2 flex items-center justify-between border-t border-[var(--border-soft)] pt-2">
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {pastDays.length} jours
                        </span>
                        <button
                          type="button"
                          onClick={selectToday}
                          className="rounded-lg px-2 py-1 text-[10px] font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
                        >
                          Aujourd'hui
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(150px,0.9fr)_minmax(230px,1.1fr)] gap-4 overflow-hidden">
        <section className="min-h-0 overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--card-bg)] px-3 py-3">
          <div className="h-full min-h-0 overflow-y-auto pr-1">
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
              />
            )}

            {mealsForView.length === 0 && (
              <div className="flex h-full min-h-[120px] items-center justify-center text-center">
                <p className="text-xs text-[var(--text-muted)]">Aucun repas enregistré</p>
              </div>
            )}
          </div>
        </section>

        <section className="flex min-h-0 flex-col gap-3 overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--card-bg)] px-3 py-3">
          <div className="shrink-0">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[var(--text)] uppercase tracking-[0.1em]">
                Nutriments
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-1 rounded-lg bg-[var(--warm-100)] p-1">
              {NUTRIENT_SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={clsx(
                      'relative min-w-0 rounded-md px-2 py-2 text-center transition-colors',
                      isActive
                        ? 'text-[var(--text-h)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                    )}
                    aria-pressed={isActive}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="analysis-nutrient-section"
                        className="absolute inset-0 rounded-md bg-[var(--bg-raised)] shadow-sm"
                        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.22 }}
                      />
                    )}
                    <span className="relative z-10 block truncate text-[11px] font-semibold leading-tight">
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

      <footer className="shrink-0 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-raised)] p-3 shadow-sm">
        <div className="mb-2 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
              Total jour
            </p>
            <p className="text-3xl font-light text-[var(--text-h)] display-font tabular-nums leading-none">
              {Math.round(cal)}
              <span className="ml-1 text-xs font-medium text-[var(--text-muted)]">kcal</span>
            </p>
          </div>
          <div className="text-right text-[11px] text-[var(--text-muted)] tabular-nums">
            <p><span className="font-medium text-[var(--accent)]">/ {currentGoal.calories}</span> kcal</p>
            <p>{Math.round(calPct)}% objectif</p>
          </div>
        </div>

        <div className="mb-2 h-1.5 rounded-full bg-[var(--warm-100)] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${calPct}%` }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.8 }}
          />
        </div>
      </footer>
    </div>
  );
}
