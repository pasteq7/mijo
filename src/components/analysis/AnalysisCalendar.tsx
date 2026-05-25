import { useMemo, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useDismissablePopover } from '../../hooks/useDismissablePopover';
import { useLanguage } from '../../hooks/useLanguage';
import type { DayRecord } from '../../types';

interface AnalysisCalendarProps {
  selectedDay: DayRecord | null;
  selectedDayId: string | null;
  pastDays: DayRecord[];
  onSelectDayId: (dayId: string | null) => void;
}

export function AnalysisCalendar({
  selectedDay,
  selectedDayId,
  pastDays,
  onSelectDayId,
}: AnalysisCalendarProps) {
  const { t, language } = useLanguage();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const closeCalendar = useCallback(() => setIsCalendarOpen(false), []);
  useDismissablePopover(calendarRef, isCalendarOpen, closeCalendar);

  const selectedDayIdx = useMemo(() => {
    if (!selectedDayId) return null;
    const idx = pastDays.findIndex((day) => day.id === selectedDayId);
    return idx >= 0 ? idx : null;
  }, [selectedDayId, pastDays]);

  const canGoOlder = selectedDayId === null ? pastDays.length > 0 : (selectedDayIdx ?? -1) < pastDays.length - 1;
  const canGoNewer = selectedDayId !== null && selectedDayIdx !== null;

  const formatDayDate = (date: string) => {
    const d = new Date(`${date}T00:00:00`);
    return d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' });
  };

  const todayKey = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const registeredDaysByDate = useMemo(() => {
    return new Map(pastDays.map((day) => [day.date, day]));
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

  const goOlder = () => {
    if (!canGoOlder) return;
    if (selectedDayId === null) onSelectDayId(pastDays[0].id);
    else if (selectedDayIdx !== null) onSelectDayId(pastDays[selectedDayIdx + 1].id);
  };

  const goNewer = () => {
    if (!canGoNewer) return;
    if (selectedDayIdx === 0) onSelectDayId(null);
    else if (selectedDayIdx !== null) onSelectDayId(pastDays[selectedDayIdx - 1].id);
  };

  const shiftCalendarMonth = (offset: number) => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const selectRegisteredDay = (day: DayRecord) => {
    onSelectDayId(day.id);
    setCalendarMonth(new Date(`${day.date}T00:00:00`));
    setIsCalendarOpen(false);
  };

  const selectToday = () => {
    onSelectDayId(null);
    setCalendarMonth(new Date());
    setIsCalendarOpen(false);
  };

  const toggleCalendar = () => {
    if (!isCalendarOpen) {
      setCalendarMonth(selectedDay ? new Date(`${selectedDay.date}T00:00:00`) : new Date());
    }
    setIsCalendarOpen((open) => !open);
  };

  const weekdays = language === 'fr' ? ['L', 'M', 'M', 'J', 'V', 'S', 'D'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="relative shrink-0" ref={calendarRef}>
      <div className="flex shrink-0 items-center bg-[var(--warm-100)]/70 dark:bg-[var(--warm-200)]/20 rounded-full p-0.5 border border-[var(--border-soft)] shadow-xs relative">
        <button
          onClick={goOlder}
          disabled={!canGoOlder}
          className={clsx(
            'w-6 h-6 flex items-center justify-center rounded-full transition-all',
            canGoOlder
              ? 'text-[var(--text-h)] hover:bg-[var(--warm-200)]/80 dark:hover:bg-[var(--warm-300)]'
              : 'text-[var(--text-muted)] opacity-30 cursor-not-allowed',
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
              : 'text-[var(--accent)] bg-[var(--accent-soft)] hover:bg-[var(--accent-soft)]/85',
          )}
          aria-label={t('analysis.openCalendar')}
          aria-expanded={isCalendarOpen}
        >
          <span className="tabular-nums">
            {selectedDay ? formatDayDate(selectedDay.date) : t('common.today')}
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
              : 'text-[var(--text-muted)] opacity-30 cursor-not-allowed',
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
              aria-label={language === 'fr' ? 'Mois précédent' : 'Previous month'}
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
              aria-label={language === 'fr' ? 'Mois suivant' : 'Next month'}
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
              if (!day) return <span key={`empty-${index}`} className="h-7" aria-hidden />;

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
                          : 'cursor-default text-[var(--text-muted)] opacity-30',
                  )}
                  aria-label={
                    day.record
                      ? language === 'fr'
                        ? `Voir le ${formatDayDate(day.dateKey)}`
                        : `View ${formatDayDate(day.dateKey)}`
                      : day.isToday
                        ? language === 'fr'
                          ? "Voir aujourd'hui"
                          : 'View today'
                        : undefined
                  }
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
  );
}
