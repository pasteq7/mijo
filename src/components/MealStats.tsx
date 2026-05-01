import { motion } from 'framer-motion';
import type { NutrientGoals } from '../types';
import { evaluateMeal } from '../utils/recommendations';

interface Props {
  totals: Partial<NutrientGoals>;
  goals: NutrientGoals;
}

export function MealStats({ totals, goals }: Props) {
  const cal = totals.calories ?? 0;
  const calPct = Math.min((cal / goals.calories) * 100, 100);
  
  const evalResult = evaluateMeal(totals, goals);

  return (
    <div className="px-8 py-6 bg-[--bg-subtle] border border-[--border] rounded-[2rem] shadow-[var(--shadow-sm)]">
      <div className="flex justify-between items-end mb-4">
        <div>
          <motion.p
            key={Math.round(cal)}
            initial={{ opacity: 0.5, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-light text-[--text-h] tabular-nums tracking-tighter display-font"
          >
            {Math.round(cal)}
            <span className="text-sm font-normal text-[--text] ml-2 font-sans">kcal</span>
          </motion.p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-[--text] uppercase tracking-[0.1em]">Objectif: {Math.round(goals.calories)}</p>
        </div>
      </div>
      <div className="h-3 bg-[--warm-200] rounded-full overflow-hidden mb-4 shadow-inner">
        <motion.div
          className={`h-full rounded-full ${evalResult.progressColor.replace('bg-', 'bg-')}`}
          style={{ backgroundColor: evalResult.progressColor.includes('amber') ? 'var(--highlight)' : evalResult.progressColor.includes('green') ? 'var(--accent)' : evalResult.progressColor.includes('red') ? 'var(--action)' : 'var(--accent)' }}
          animate={{ width: `${calPct}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        />
      </div>
      <div className="flex justify-between items-center">
        <p className={`text-sm font-medium ${evalResult.color.includes('amber') ? 'text-[--highlight]' : evalResult.color.includes('green') ? 'text-[--accent]' : evalResult.color.includes('red') ? 'text-[--action]' : 'text-[--text-h]'}`}>
          {cal === 0 ? 'Commence à composer ton repas' : evalResult.label}
        </p>
        {cal > 0 && (
          <p className="text-xs text-[--text]">Score Qualité: {evalResult.score}/3</p>
        )}
      </div>
    </div>
  );
}