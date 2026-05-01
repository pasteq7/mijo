import { motion } from 'framer-motion';

interface Props {
  protein: 'low' | 'mid' | 'high';
  iron: 'low' | 'mid' | 'high';
  zinc: 'low' | 'mid' | 'high';
  magnesium: 'low' | 'mid' | 'high';
  fibre: 'low' | 'mid' | 'high';
  hasB12: boolean;
  hasVitD: boolean;
  calories: number;
  isVisible: boolean;
}

const levelHeight: Record<string, string> = {
  high: '100%',
  mid: '66%',
  low: '33%',
};

const levelBg: Record<string, string> = {
  high: 'var(--accent)',
  mid: 'color-mix(in srgb, var(--accent) 50%, transparent)',
  low: 'var(--warm-200)',
};

export function Tooltip({ protein, iron, zinc, magnesium, fibre, calories, isVisible }: Props) {
  return (
    <motion.div
      initial={false}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 8,
        scale: isVisible ? 1 : 0.96
      }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-4 rounded-2xl bg-white text-[--text-h] shadow-xl pointer-events-none z-50 border border-[var(--border)]"
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border)]">
        <span className="text-xs font-medium text-[--text]">Énergie</span>
        <span className="text-sm font-semibold">{calories} <span className="text-xs font-normal text-[--text]">kcal</span></span>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {[
          { label: 'PRO', level: protein, color: 'text-stone-500' },
          { label: 'Fe', level: iron, color: 'text-red-500' },
          { label: 'Zn', level: zinc, color: 'text-yellow-600' },
          { label: 'Mg', level: magnesium, color: 'text-green-600' },
          { label: 'Fib', level: fibre, color: 'text-amber-600' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1.5">
            <div className="w-2.5 h-8 rounded-full bg-[var(--warm-100)] overflow-hidden relative flex items-end">
              <div 
                className="w-full rounded-full transition-all duration-300"
                style={{
                  height: levelHeight[item.level],
                  backgroundColor: levelBg[item.level],
                }}
              />
            </div>
            <span className={`text-[10px] font-medium tracking-wide ${item.color}`}>{item.label}</span>
          </div>
        ))}
      </div>

    </motion.div>
  );
}