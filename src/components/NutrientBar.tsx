import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { NutrientMeta } from '../types';

interface Props {
  meta: NutrientMeta;
  value: number;
  goal: number;
}

function getColor(pct: number): string {
  if (pct >= 100) return '#4A7A5A';
  if (pct >= 70) return '#7C9A6E';
  if (pct >= 40) return '#E8A86B';
  return '#D97B78';
}

export function NutrientBar({ meta, value, goal }: Props) {
  const rawPct = (value / goal) * 100;
  const displayPct = Math.min(rawPct, 100);
  const color = getColor(rawPct);
  const isOver = rawPct > 100;

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className="group cursor-help">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-stone-700">
                  {meta.label}
                </span>
                {meta.veganAlert && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                    ⚠️ vegan
                  </span>
                )}
              </div>
              <span className="text-xs text-stone-500 tabular-nums">
                {value.toFixed(1)} / {goal} {meta.unit}
                {isOver && <span className="text-emerald-600 ml-1 font-semibold">✓</span>}
              </span>
            </div>
            <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${displayPct}%` }}
                transition={{ type: 'spring', stiffness: 60, damping: 15 }}
              />
            </div>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="max-w-xs bg-stone-800 text-stone-100 text-sm px-3 py-2 rounded-lg shadow-lg z-50"
            sideOffset={6}
          >
            <p>{meta.tooltip}</p>
            {meta.tip && (
              <p className="mt-1 text-amber-300 text-xs">{meta.tip}</p>
            )}
            <Tooltip.Arrow className="fill-stone-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}