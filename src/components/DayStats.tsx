import { motion } from 'framer-motion';
import type { DailyGoals, DayRecord } from '../types';

interface Props {
  totals: Partial<DailyGoals>;
  goals: DailyGoals;
  dayRecord?: DayRecord;
}

const colorMap: Record<string, string> = {
  'Excellent': 'text-[var(--accent)]',
  'Équilibré': 'text-[var(--accent)]',
  'Léger': 'text-[var(--text)]',
  'En cours': 'text-[var(--text-h)]',
  'Généreux': 'text-[var(--action)]',
};

export function DayStats({ totals, goals, dayRecord }: Props) {
  const cal = totals.calories ?? 0;
  const calPct = Math.min((cal / goals.calories) * 100, 100);

  const inlineScore = cal === 0 ? null : calPct < 50
    ? { label: 'Léger', color: 'text-[var(--text)]' }
    : calPct < 80
      ? { label: 'En cours', color: 'text-[var(--text-h)]' }
      : calPct <= 110
        ? { label: 'Équilibré', color: 'text-[var(--accent)]' }
        : { label: 'Généreux', color: 'text-[var(--action)]' };

  const scoreLabel = dayRecord?.score?.label ?? inlineScore?.label ?? null;
  const scoreColor = dayRecord?.score
    ? (colorMap[dayRecord.score.label] ?? 'text-[var(--text)]')
    : (inlineScore?.color ?? '');

  return (
    <div className="px-6 py-5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-b-2xl shadow-[var(--shadow-sm)]">
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
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
        />
      </div>
      {scoreLabel && (
        <p className={`text-xs font-medium mt-3 ${scoreColor}`}>
          {scoreLabel}
          {dayRecord?.validatedAt && ' · Validée'}
        </p>
      )}
    </div>
  );
}
