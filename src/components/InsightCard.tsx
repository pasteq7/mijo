import { motion, AnimatePresence } from 'framer-motion';
import { INSIGHTS } from '../data/insights';
import type { NutrientGoals } from '../types';

interface Props {
  totals: Partial<NutrientGoals>;
  goals: NutrientGoals;
}

export function InsightCard({ totals, goals }: Props) {
  const active = INSIGHTS.filter((i) => i.condition(totals, goals));
  if (active.length === 0) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {active.map((insight) => {
          const isWarning = insight.type === 'warning';
          const isSuccess = insight.type === 'success';
          
          return (
            <motion.div
              key={insight.message}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-4 px-5 py-4 border rounded-2xl items-start shadow-[var(--shadow-sm)] ${
                isWarning ? 'bg-orange-50/50 border-orange-200 text-orange-900' :
                isSuccess ? 'bg-green-50/50 border-green-200 text-green-900' :
                'bg-blue-50/50 border-blue-200 text-blue-900'
              }`}
            >
              <span className="text-xl mt-0.5">{insight.icon}</span>
              <span className="text-sm font-medium leading-relaxed pt-1">{insight.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}