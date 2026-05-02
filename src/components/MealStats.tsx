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
    <div className="px-8 py-6 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-b-2xl shadow-[var(--shadow-sm)]">
      <div className="flex justify-between items-end mb-4">
        <div>
          <motion.p
            key={Math.round(cal)}
            initial={{ opacity: 0.5, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-light text-[var(--text-h)] tabular-nums tracking-tighter display-font"
          >
            {Math.round(cal)}
            <span className="text-sm font-normal text-[var(--text)] ml-2 font-sans">kcal</span>
          </motion.p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-[var(--text)] uppercase tracking-[0.1em]">Objectif: {Math.round(goals.calories)}</p>
        </div>
      </div>
      <div className="h-3 bg-[var(--warm-200)] rounded-full overflow-hidden mb-4 shadow-inner">
        <motion.div
          className={`h-full rounded-full ${evalResult.progressColor.replace('bg-', 'bg-')}`}
          style={{ backgroundColor: evalResult.progressColor.includes('amber') ? 'var(--highlight)' : evalResult.progressColor.includes('green') ? 'var(--accent)' : evalResult.progressColor.includes('red') ? 'var(--action)' : 'var(--accent)' }}
          animate={{ width: `${calPct}%` }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
        />
      </div>
      <div className="flex justify-between items-center">
        <p className={`text-sm font-medium ${evalResult.color.includes('amber') ? 'text-[var(--highlight)]' : evalResult.color.includes('green') ? 'text-[var(--accent)]' : evalResult.color.includes('red') ? 'text-[var(--action)]' : 'text-[var(--text-h)]'}`}>
          {cal === 0 ? 'Commence à composer ton repas' : evalResult.label}
        </p>
        {cal > 0 && (
          <p className="text-xs text-[var(--text)]">Score Qualité: {evalResult.score}/3</p>
        )}
      </div>
    </div>
  );
}
