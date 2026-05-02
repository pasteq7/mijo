import { motion, AnimatePresence } from 'framer-motion';
import type { DayRecord, NutrientGoals } from '../types';

interface DayValidationDialogProps {
  day: DayRecord;
  dailyGoals: NutrientGoals;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DayValidationDialog({ day, dailyGoals, onConfirm, onCancel }: DayValidationDialogProps) {
  const mealCount = day.meals.length;
  const totalKcal = Math.round(day.meals.reduce((sum, m) => sum + (m.totals.calories ?? 0), 0));
  const calPct = dailyGoals.calories > 0 ? Math.round((totalKcal / dailyGoals.calories) * 100) : 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="bg-[var(--bg)] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-[var(--border)]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
            <h2 className="text-lg font-light text-[var(--text-h)] display-font">Valider la journée</h2>
          </div>

          <div className="px-6 py-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text)]">Repas enregistrés</span>
              <span className="text-lg font-medium text-[var(--text-h)] tabular-nums">{mealCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text)]">Total calories</span>
              <span className="text-lg font-medium text-[var(--text-h)] tabular-nums">{totalKcal} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text)]">Objectif journalier</span>
              <span className="text-lg font-medium text-[var(--text-h)] tabular-nums">{dailyGoals.calories} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text)]">Couverture</span>
              <span className="text-lg font-medium text-[var(--text-h)] tabular-nums">{calPct}%</span>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-subtle)] flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[var(--text)] bg-[var(--warm-100)] hover:bg-[var(--warm-200)] transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-[var(--accent)] hover:bg-[#5C7D5B] transition-colors shadow-[var(--shadow-sm)]"
            >
              Confirmer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
