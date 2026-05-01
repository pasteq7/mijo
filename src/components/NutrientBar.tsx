import { motion } from 'framer-motion';
import type { NutrientMeta } from '../types';

interface Props {
  meta: NutrientMeta;
  value: number;
  goal: number;
}

function getColor(pct: number): string {
  if (pct >= 100) return 'var(--accent)';
  if (pct >= 70) return '#8AA97D';
  if (pct >= 40) return 'var(--highlight)';
  return 'var(--action)';
}

export function NutrientBar({ meta, value, goal }: Props) {
  const rawPct = (value / goal) * 100;
  const displayPct = Math.min(rawPct, 100);
  const color = getColor(rawPct);
  const isOver = rawPct > 100;

  return (
    <div className="group py-2">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-[var(--text-h)]">{meta.label}</span>
        <span className="text-xs text-[var(--text)] tabular-nums">
          {value.toFixed(1)}{isOver && <span className="text-[var(--accent)] ml-1 font-bold">✓</span>}
        </span>
      </div>
      <div className="h-1.5 bg-[var(--warm-200)] rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${displayPct}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        />
      </div>
    </div>
  );
}
