import { motion, AnimatePresence } from 'framer-motion';
import { INSIGHTS } from '../data/insights';
import type { DailyGoals } from '../types';

interface Props {
  totals: Partial<DailyGoals>;
  goals: DailyGoals;
}

export function InsightCard({ totals, goals }: Props) {
  const active = INSIGHTS.filter((i) => i.condition(totals, goals));

  return (
    <AnimatePresence mode="popLayout">
      {active.map((insight, idx) => (
        <motion.div
          key={insight.message}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ delay: idx * 0.05 }}
          className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-stone-700"
        >
          <span className="text-lg shrink-0">{insight.icon}</span>
          <p>{insight.message}</p>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}