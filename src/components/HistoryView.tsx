import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayStats } from './DayStats';
import { MealHistory } from './MealHistory';
import { NutrientPanel } from './NutrientPanel';
import { formatDate, formatDateShort, getDateKeys } from '../utils/dateHelpers';
import type { DayRecord, NutrientGoals, MealRecord } from '../types';
import clsx from 'clsx';

interface HistoryViewProps {
  pastDays: DayRecord[];
  dailyGoals: NutrientGoals;
  mealGoals: NutrientGoals;
  favoriteIds?: Set<string>;
  onToggleFavorite?: (meal: MealRecord) => void;
}

export function HistoryView({ pastDays, dailyGoals, favoriteIds, onToggleFavorite }: HistoryViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const dateKeys = getDateKeys(30);

  const selectedDay = selectedDate
    ? pastDays.find(d => d.date === selectedDate)
    : null;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-2 min-w-max">
          {dateKeys.map(dateKey => {
            const day = pastDays.find(d => d.date === dateKey);
            const isSelected = selectedDate === dateKey;
            return (
              <button
                key={dateKey}
                onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                className={clsx(
                  "px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
                  isSelected
                    ? "bg-[var(--accent)] text-white shadow-[var(--shadow-sm)]"
                    : day
                      ? "bg-[var(--bg-subtle)] text-[var(--text-h)] border border-[var(--border)] hover:bg-[var(--warm-200)]"
                      : "bg-[var(--warm-100)] text-[var(--text)] opacity-40"
                )}
              >
                {formatDateShort(dateKey)}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedDay ? (
          <motion.div
            key={selectedDay.date}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-light text-[var(--text-h)] display-font">
                {formatDate(selectedDay.date)}
              </h2>
              {selectedDay.score && (
                <span className={clsx(
                  "text-xs font-medium px-3 py-1 rounded-full",
                  selectedDay.score.label === 'Excellent' ? "bg-green-100 text-green-800" :
                  selectedDay.score.label === 'Équilibré' ? "bg-blue-100 text-blue-800" :
                  selectedDay.score.label === 'Léger' ? "bg-amber-100 text-amber-800" :
                  "bg-orange-100 text-orange-800"
                )}>
                  {selectedDay.score.label}
                </span>
              )}
            </div>

            <DayStats
              totals={selectedDay.dailyTotals}
              goals={dailyGoals}
              dayRecord={selectedDay}
            />

            <MealHistory
              meals={selectedDay.meals}
              readOnly
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
            />

            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-[0.1em]">
                Couverture nutritionnelle
              </h3>
              <NutrientPanel
                totals={selectedDay.dailyTotals}
                goals={dailyGoals}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <p className="text-sm text-[var(--text)]">
              {pastDays.length === 0
                ? "Aucun jour validé pour le moment"
                : "Sélectionne un jour pour voir les détails"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
