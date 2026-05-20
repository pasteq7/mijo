import { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Check, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Utensils } from 'lucide-react';
import { MealHistory } from '../MealHistory';
import { NutrientBar } from '../NutrientBar';
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
  onAddMeal?: () => void;
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
}: AnalysisViewProps) {
  const { t, language } = useLanguage();
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<NutrientSection>('micros');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  const nutrientSections = useMemo<{ id: NutrientSection; label: string; groups: string[] }[]>(() => [
    { id: 'macros', label: t('analysis.sections.macros'), groups: ['macros', 'aminoacides'] },
    { id: 'micros', label: t('analysis.sections.micros'), groups: ['vitamines', 'acidesgras'] },
    { id: 'minerals', label: t('analysis.sections.minerals'), groups: ['mineraux'] },
  ], [t]);

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
    return d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' });
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
    return calendarMonth.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric' });
  }, [calendarMonth, language]);

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

  const weekdays = language === 'fr' ? ['L', 'M', 'M', 'J', 'V', 'S', 'D'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <header className="shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-[var(--text-h)] display-font">
              {t('analysis.title')}
            </h3>
          </div>

          <div className="relative shrink-0" ref={calendarRef}>
            <div className="flex shrink-0 items-center bg-[var(--warm-100)]/70 dark:bg-[var(--warm-200)]/20 rounded-full p-0.5 border border-[var(--border-soft)] shadow-xs relative">
              <button
                onClick={goOlder}
                disabled={!canGoOlder}
                className={clsx(
                  'w-6 h-6 flex items-center justify-center rounded-full transition-all',
                  canGoOlder
                    ? 'text-[var(--text-h)] hover:bg-[var(--warm-200)]/80 dark:hover:bg-[var(--warm-300)]'
                    : 'text-[var(--text-muted)] opacity-30 cursor-not-allowed'
                )}
                aria-label={t('analysis.prevDay')}
              >
                <ChevronLeft size={11} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                onClick={toggleCalendar}
                className={clsx(
                  'flex items-center gap-1.5 px-2.5 py-0.5 rounded-full transition-all text-[11px] font-semibold tracking-wide shadow-2xs',
                  isCalendarOpen
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--accent)] bg-[var(--accent-soft)] hover:bg-[var(--accent-soft)]/85'
                )}
                aria-label={t('analysis.openCalendar')}
                aria-expanded={isCalendarOpen}
              >
                <span className="tabular-nums">
                  {isPastDay && selectedDay ? formatDayDate(selectedDay.date) : t('common.today')}
                </span>
                <CalendarDays size={10} className={isCalendarOpen ? 'text-white' : 'text-[var(--accent)] opacity-80'} />
              </button>

              <button
                onClick={goNewer}
                disabled={!canGoNewer}
                className={clsx(
                  'w-6 h-6 flex items-center justify-center rounded-full transition-all',
                  canGoNewer
                    ? 'text-[var(--text-h)] hover:bg-[var(--warm-200)]/80 dark:hover:bg-[var(--warm-300)]'
                    : 'text-[var(--text-muted)] opacity-30 cursor-not-allowed'
                )}
                aria-label={t('analysis.nextDay')}
              >
                <ChevronRight size={11} strokeWidth={2.5} />
              </button>
            </div>

            {isCalendarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.16 }}
                className="absolute right-0 top-9 z-30 w-56 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-raised)] backdrop-blur-md p-3 shadow-xl"
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
                  {weekdays.map((weekday, index) => (
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
                        aria-label={day.record ? (language === 'fr' ? `Voir le ${formatDayDate(day.dateKey)}` : `View ${formatDayDate(day.dateKey)}`) : day.isToday ? (language === 'fr' ? "Voir aujourd'hui" : "View today") : undefined}
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
                    {t('analysis.pastDaysCount', { count: pastDays.length })}
                  </span>
                  <button
                    type="button"
                    onClick={selectToday}
                    className="rounded-lg px-2 py-1 text-[10px] font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
                  >
                    {t('common.today')}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(150px,0.9fr)_minmax(230px,1.1fr)] gap-4 overflow-hidden">
        <section className="card p-3.5 flex flex-col min-h-0 overflow-hidden">
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
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="text-[var(--accent)]"
                    >
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="card p-3.5 flex min-h-0 flex-col gap-2.5 overflow-hidden">
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

