import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { NutrientMeta, SelectedFood, NutrientKey } from '../types';
import { getCategoryColor } from '../utils/colors';

interface Props {
  meta: NutrientMeta;
  value: number;
  goal: number;
  showPlaceholder?: boolean;
  foods?: SelectedFood[];
  bufferFoods?: Set<SelectedFood>;
  compact?: boolean;
}

function getColor(pct: number): string {
  if (pct >= 100) return 'var(--accent)';
  if (pct >= 70) return '#8AA97D';
  if (pct >= 40) return 'var(--highlight)';
  return 'var(--action)';
}

interface Segment {
  food: SelectedFood;
  contribution: number;
  pct: number;
  color: string;
}

export function NutrientBar({ meta, value, goal, showPlaceholder, foods, bufferFoods, compact }: Props) {
  const rawPct = goal > 0 ? (value / goal) * 100 : 0;
  const color = getColor(rawPct);
  const isOver = rawPct > 100;
  const isEmpty = value === 0;

  const segments: Segment[] = (() => {
    if (!foods || isEmpty) return [];
    const nutrientKey = meta.id as NutrientKey;
    const contributing = foods
      .map(sf => {
        const per100 = sf.food.per100g[nutrientKey] ?? 0;
        return { food: sf, contribution: (per100 * sf.qty) / 100 };
      })
      .filter(s => s.contribution > 0);
    if (contributing.length === 0) return [];
    contributing.sort((a, b) => b.contribution - a.contribution);
    const scaleTarget = value >= goal ? value : goal;
    return contributing.map(s => ({
      food: s.food,
      contribution: s.contribution,
      pct: (s.contribution / scaleTarget) * 100,
      color: getCategoryColor(s.food.food.category),
    }));
  })();

  return (
    <div className={`group ${compact ? 'py-0.5' : 'py-2'}`}>
      <div className={`flex justify-between items-center ${compact ? 'mb-0.5' : 'mb-1.5'}`}>
        <span className={`${compact ? 'text-[10px]' : 'text-xs'} font-medium text-[var(--text-h)]`}>{meta.label}</span>
        <span className={`${compact ? 'text-[10px]' : 'text-xs'} tabular-nums`} style={{ color: isEmpty ? undefined : color }}>
          {showPlaceholder && isEmpty ? '—' : `${value.toFixed(1)}`}{isOver && <span className="ml-1 font-bold">✓</span>}
        </span>
      </div>
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className={`h-1.5 rounded-full shadow-inner ${isEmpty ? 'border border-dashed border-[var(--border)] bg-transparent' : 'bg-[var(--warm-200)] overflow-hidden'}`}>
              {segments.length > 0 && (
                <div className="flex h-full rounded-full overflow-hidden">
                  {segments.map((seg) => {
                    const isBuffer = bufferFoods?.has(seg.food);
                    return (
                      <motion.div
                        key={seg.food.id}
                        layout="position"
                        initial={false}
                        className="relative h-full"
                        animate={{ width: `${seg.pct}%` }}
                        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
                      >
                        <div
                          className="absolute inset-0"
                          style={{ backgroundColor: seg.color }}
                        />
                        {isBuffer && (
                          <motion.div
                            className="absolute inset-0 rounded-[inherit]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                              backgroundImage: `repeating-linear-gradient(
                                45deg,
                                transparent,
                                transparent 3px,
                                rgba(255,255,255,0.25) 3px,
                                rgba(255,255,255,0.25) 6px
                              )`,
                            }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </Tooltip.Trigger>
          {segments.length > 0 && (
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                align="center"
                sideOffset={6}
                className="z-50 min-w-[220px] max-w-[300px] bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-h)] text-[11px] leading-relaxed px-3 py-2.5 rounded-xl shadow-sm space-y-1.5"
              >
                <p className="text-[10px] font-semibold text-[var(--text)] uppercase tracking-wider mb-2">
                  Répartition — {meta.label}
                </p>
                {segments.map((seg, i) => {
                  const isBuffer = bufferFoods?.has(seg.food);
                  return (
                    <div key={`${seg.food.food.id}-${i}`} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0 relative" style={{ backgroundColor: seg.color }}>
                        {isBuffer && (
                          <span className="absolute inset-0 rounded-full" style={{
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)`,
                          }} />
                        )}
                      </span>
                      <span className="flex-1 truncate">
                        {seg.food.food.emoji} {seg.food.food.name}
                        {isBuffer && <span className="text-[10px] text-[var(--text-muted)] ml-1">· à ajouter</span>}
                      </span>
                      <span className="tabular-nums font-medium shrink-0">{seg.contribution.toFixed(1)}</span>
                      <span className="tabular-nums text-[var(--text)] w-9 text-right shrink-0">
                        {((seg.contribution / value) * 100).toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
                <div className="border-t border-[var(--border)] pt-1.5 mt-1.5 flex justify-between text-[10px] text-[var(--text)]">
                  <span>Total</span>
                  <span className="tabular-nums font-medium text-[var(--text-h)]">
                    {value.toFixed(1)} {meta.unit}
                  </span>
                </div>
                <Tooltip.Arrow className="fill-[var(--bg-subtle)]" />
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
