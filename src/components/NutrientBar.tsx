import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { NutrientMeta, SelectedFood, NutrientKey } from '../types';
import { getCategoryColor } from '../utils/colors';
import { useLanguage } from '../hooks/useLanguage';

interface Props {
  meta: NutrientMeta;
  value: number;
  goal: number;
  foods?: SelectedFood[];
  bufferFoods?: Set<SelectedFood>;
  compact?: boolean;
}

const NUTRIENT_COLORS: Record<string, string> = {
  proteines: '#8B7BA8',
  glucides: '#5A7FA0',
  lipides: '#C47A5A',
  fibres: '#7B9B6E',
  vitA: '#D4A06A',
  vitC: '#E8A87C',
  vitB9: '#C9A855',
  vitB6: '#B8916B',
  vitE: '#D4B896',
  vitK: '#8FB08C',
  fer: '#B87A6A',
  calcium: '#A8B8C8',
  zinc: '#8A9BA8',
  magnesium: '#7B9BA0',
  selenium: '#8BA88E',
  omega3: '#9A8AB8',
  omega6: '#B89AB8',
  lysine: '#7BA88C',
  methionine: '#88A0B0',
  leucine: '#9AB09A',
  threonine: '#8FA0A0',
};

function getColor(meta: NutrientMeta, pct: number): string {
  if (meta.id in NUTRIENT_COLORS) return NUTRIENT_COLORS[meta.id];
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

export function NutrientBar({ meta, value, goal, foods, bufferFoods, compact }: Props) {
  const { t } = useLanguage();
  const safeGoal = goal ?? 0;
  const safeValue = value ?? 0;
  const rawPct = safeGoal > 0 ? (safeValue / safeGoal) * 100 : 0;
  const color = getColor(meta, rawPct);
  const isEmpty = safeValue === 0;

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
    const scaleTarget = safeValue >= safeGoal ? safeValue : safeGoal;
    return contributing.map(s => ({
      food: s.food,
      contribution: s.contribution,
      pct: (s.contribution / scaleTarget) * 100,
      color: getCategoryColor(s.food.food.category),
    }));
  })();

  return (
    <div className={`group ${compact ? 'py-0.5' : 'py-1.5'}`}>
      <div className={`flex items-baseline gap-2 ${compact ? 'mb-0.5' : 'mb-1'}`}>
        <span className={`${compact ? 'text-[10px]' : 'text-xs'} font-medium text-[var(--text-h)] flex-1`}>
          {t('nutrients.' + meta.id + '.label')}
        </span>
        <span className={`${compact ? 'text-[10px]' : 'text-xs'} tabular-nums text-[var(--text)]`}>
          {safeValue.toFixed(1)}&thinsp;<span className="text-[var(--text-muted)]">/ {safeGoal.toFixed(0)}</span>
        </span>
        <span
          className={`${compact ? 'text-[10px]' : 'text-xs'} tabular-nums font-medium w-11 text-right shrink-0`}
          style={{ color }}
        >
          {Math.round(rawPct)}%
        </span>
      </div>
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className={`h-1.5 rounded-full shadow-inner bg-[var(--warm-200)] ${isEmpty ? 'opacity-40' : 'overflow-hidden'}`}>
              {!isEmpty && segments.length === 0 && (
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(rawPct, 100)}%` }}
                  style={{ backgroundColor: color }}
                  transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
                />
              )}
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
                  {t('analysis.distribution', { label: t('nutrients.' + meta.id + '.label') })}
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
                        {seg.food.food.emoji} {t('foods.' + seg.food.food.id)}
                        {isBuffer && <span className="text-[10px] text-[var(--text-muted)] ml-1">· {t('analysis.toAdd')}</span>}
                      </span>
                      <span className="tabular-nums font-medium shrink-0">{seg.contribution.toFixed(1)}</span>
                      <span className="tabular-nums text-[var(--text)] w-9 text-right shrink-0">
                        {((seg.contribution / safeValue) * 100).toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
                <div className="border-t border-[var(--border)] pt-1.5 mt-1.5 flex justify-between text-[10px] text-[var(--text)]">
                  <span>{t('common.total')}</span>
                  <span className="tabular-nums font-medium text-[var(--text-h)]">
                    {safeValue.toFixed(1)} {meta.unit}
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
