import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import type { NutrientGoals } from '../types';
import { evaluateMeal } from '../utils/recommendations';

interface Props {
  totals: Partial<NutrientGoals>;
  goals: NutrientGoals;
  hasFoods?: boolean;
}

export function MealStats({ totals, goals, hasFoods }: Props) {
  const cal = totals.calories ?? 0;
  const calPct = Math.min((cal / goals.calories) * 100, 100);

  const springConfig = { stiffness: 100, damping: 20 };
  const springVal = useSpring(0, springConfig);
  const display = useTransform(springVal, (v) => Math.round(v));

  useEffect(() => {
    springVal.set(cal);
  }, [cal, springVal]);

  const evalResult = evaluateMeal(totals, goals);

  if (!hasFoods && cal === 0) {
    return (
      <div className="px-8 py-6 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-b-2xl shadow-[var(--shadow-sm)]">
        <div className="flex justify-between items-end mb-4">
          <p className="text-base font-light text-[var(--text-muted)]">
            Tes apports s'afficheront ici
          </p>
        </div>
        <div className="h-3 rounded-full border border-dashed border-[var(--border)] bg-transparent" />
      </div>
    );
  }

  return (
    <div className="px-8 py-6 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-b-2xl shadow-[var(--shadow-sm)]">
      <div className="flex justify-between items-end mb-4">
        <div>
          <motion.p className="text-5xl font-light text-[var(--text-h)] tabular-nums tracking-tighter display-font">
            <motion.span className="font-number">{display}</motion.span>
            <span className="text-sm font-normal text-[var(--text)] ml-2 font-sans">kcal</span>
          </motion.p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-[var(--text)] uppercase tracking-[0.1em]">
            Objectif: {cal === 0 ? '0 / ' : ''}{Math.round(goals.calories)} kcal
          </p>
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
      {cal > 0 && (
        <div className="flex justify-between items-center">
          <p className={`text-sm font-medium ${evalResult.color.includes('amber') ? 'text-[var(--highlight)]' : evalResult.color.includes('green') ? 'text-[var(--accent)]' : evalResult.color.includes('red') ? 'text-[var(--action)]' : 'text-[var(--text-h)]'}`}>
            {evalResult.label}
          </p>
          <p className="text-xs text-[var(--text)]">Score Qualité: {evalResult.score}/3</p>
        </div>
      )}
    </div>
  );
}
