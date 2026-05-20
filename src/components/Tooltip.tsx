import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

interface Props {
  protein: 'low' | 'mid' | 'high';
  iron: 'low' | 'mid' | 'high';
  zinc: 'low' | 'mid' | 'high';
  magnesium: 'low' | 'mid' | 'high';
  fibre: 'low' | 'mid' | 'high';
  calories: number;
  isVisible: boolean;
}

const items = [
  { labelKey: 'nutrients.proteines.label', key: 'protein' as const },
  { labelKey: 'nutrients.fer.label', key: 'iron' as const },
  { labelKey: 'nutrients.zinc.label', key: 'zinc' as const },
  { labelKey: 'nutrients.magnesium.label', key: 'magnesium' as const },
  { labelKey: 'nutrients.fibres.label', key: 'fibre' as const },
];

export function Tooltip({ protein, iron, zinc, magnesium, fibre, calories, isVisible }: Props) {
  const { t } = useLanguage();
  const levels = { protein, iron, zinc, magnesium, fibre };

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 8,
        scale: isVisible ? 1 : 0.96,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="w-64 p-5 rounded-2xl bg-[var(--bg-subtle)] text-[var(--text-h)] shadow-xl pointer-events-none border border-[var(--border)] relative"
    >
      <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[var(--bg-subtle)] border-r border-b border-[var(--border)] rotate-45" />

      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[var(--border)]">
        <span className="text-xs font-medium text-[var(--text)]">{t('goalsModal.nutrientGroups.macros')}</span>
        <span className="text-sm font-semibold">
          {calories} <span className="text-xs font-normal text-[var(--text)]">{t('common.kcal')}</span>
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => {
          const level = levels[item.key];
          return (
            <div key={item.key} className="flex items-center gap-3">
              <span className="text-[11px] text-[var(--text)] w-16 shrink-0">{t(item.labelKey)}</span>
              <div className="flex-1 h-2 rounded-full bg-[var(--warm-100)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${level === 'high'
                    ? 'bg-[var(--accent)]'
                    : level === 'mid'
                      ? 'bg-[var(--accent-light)]'
                      : 'bg-[var(--warm-300)]'
                    }`}
                  style={{
                    width: level === 'high' ? '100%' : level === 'mid' ? '66%' : '33%',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

