import { motion } from 'framer-motion';
import type { DailyGoals } from '../types';

interface Props {
  totals: Partial<DailyGoals>;
  goals: DailyGoals;
}

export function DayStats({ totals, goals }: Props) {
  const cal = totals.calories ?? 0;
  const calPct = Math.min((cal / goals.calories) * 100, 100);

  const score = (() => {
    if (cal === 0) return null;
    if (calPct < 50) return { label: 'Léger', color: 'text-[var(--text)]' };
    if (calPct < 80) return { label: 'En cours', color: 'text-[var(--text-h)]' };
    if (calPct <= 110) return { label: 'Équilibré', color: 'text-[var(--accent)]' };
    return { label: 'Généreux', color: 'text-[var(--action)]' };
  })();

  return (
    <div className="px-6 py-5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-[2rem] shadow-[var(--shadow-sm)]">
      <div className="flex justify-between items-end mb-4">
        <div>
          <motion.p
            key={Math.round(cal)}
            initial={{ opacity: 0.5, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-light text-[var(--text-h)] tabular-nums tracking-tighter display-font"
          >
            {Math.round(cal)}
            <span className="text-xs font-normal text-[var(--text)] ml-1.5 font-sans">kcal</span>
          </motion.p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-[var(--text)] uppercase tracking-[0.1em] opacity-60">/ {goals.calories}</p>
        </div>
      </div>
      <div className="h-2 bg-[var(--warm-200)] rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-[var(--accent)] rounded-full"
          animate={{ width: `${calPct}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        />
      </div>
      {score && (
        <p className={`text-xs font-medium mt-3 ${score.color}`}>{score.label}</p>
      )}
    </div>
  );
}
