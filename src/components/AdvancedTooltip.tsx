import { motion } from 'framer-motion';
import type { Food } from '../types';
import { NUTRIENT_META } from '../data/nutrients';

const GROUP_ORDER = ['macros', 'mineraux', 'vitamines', 'acidesgras', 'aminoacides'] as const;

const GROUP_LABELS: Record<string, string> = {
  macros: 'Macros',
  mineraux: 'Minéraux',
  vitamines: 'Vitamines',
  acidesgras: 'Acides gras',
  aminoacides: 'Acides aminés',
};

interface Props {
  food: Food;
  isVisible: boolean;
}

export function AdvancedTooltip({ food, isVisible }: Props) {
  const per100g = food.per100g;

  const grouped = GROUP_ORDER
    .map((group) => ({
      group,
      label: GROUP_LABELS[group],
      nutrients: NUTRIENT_META.filter(
        (n) =>
          n.group === group &&
          n.id in per100g &&
          per100g[n.id as keyof typeof per100g] != null
      ),
    }))
    .filter((g) => g.nutrients.length > 0);

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 8,
        scale: isVisible ? 1 : 0.96,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="w-[32rem] p-4 rounded-2xl bg-[var(--bg-subtle)] text-[var(--text-h)] shadow-xl pointer-events-none border border-[var(--border)] relative"
    >
      <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[var(--bg-subtle)] border-r border-b border-[var(--border)] rotate-45" />

      <div className="text-sm font-semibold mb-1">
        {food.emoji} {food.name}
      </div>
      <div className="text-[10px] text-[var(--text)] mb-3">pour 100 {food.unit}</div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {grouped.map((g) => (
          <div key={g.group}>
            <div className="text-[9px] font-semibold text-[var(--text)] uppercase tracking-wider mb-1.5">
              {g.label}
            </div>
            <div className="space-y-1">
              {g.nutrients.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center justify-between text-[11px]"
                >
                  <span className="text-[var(--text)]">{n.label}</span>
                  <span className="font-medium tabular-nums">
                    {per100g[n.id as keyof typeof per100g]} {n.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
