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
    if (calPct < 50) return { label: 'Assiette légère', color: 'text-amber-600' };
    if (calPct < 80) return { label: 'Bonne progression', color: 'text-[#7C9A6E]' };
    if (calPct <= 110) return { label: 'Journée équilibrée ✓', color: 'text-emerald-600' };
    return { label: 'Apport généreux', color: 'text-[#C4704F]' };
  })();

  return (
    <div className="bg-[#F0EBE0] rounded-2xl px-5 py-4">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wide mb-0.5">Calories du jour</p>
          <motion.p
            key={Math.round(cal)}
            initial={{ opacity: 0.5, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-stone-800 tabular-nums"
          >
            {Math.round(cal)}
          </motion.p>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-400">objectif</p>
          <p className="text-lg font-semibold text-stone-600">{goals.calories} kcal</p>
        </div>
      </div>
      <div className="h-2.5 bg-stone-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#7C9A6E] rounded-full"
          animate={{ width: `${calPct}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 14 }}
        />
      </div>
      {score && (
        <p className={`text-sm font-medium mt-2 ${score.color}`}>{score.label}</p>
      )}
    </div>
  );
}