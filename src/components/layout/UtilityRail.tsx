import { Settings, Leaf, Sun, Snowflake, Flower2, Clock, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Season } from '../../types';
import type { Theme } from '../../hooks/useTheme';

const seasonConfig: Record<Season, { icon: typeof Leaf; label: string; color: string; softColor: string }> = {
  printemps: { icon: Flower2, label: 'Printemps', color: 'var(--accent)', softColor: 'var(--accent-soft)' },
  ete: { icon: Sun, label: 'Été', color: 'var(--highlight)', softColor: 'var(--highlight-soft)' },
  automne: { icon: Leaf, label: 'Automne', color: 'var(--action)', softColor: 'var(--action-soft)' },
  hiver: { icon: Snowflake, label: 'Hiver', color: 'var(--info)', softColor: 'var(--info-soft)' },
};

const themeLabels: Record<Theme, string> = {
  washi: 'Washi · 和紙 (Clair)',
  suna: 'Suna · 砂 (Sable)',
  matcha: 'Matcha · 抹茶 (Vert)',
  sora: 'Sora · 空 (Ciel)',
  sumi: 'Sumi · 墨 (Foncé)',
};

interface UtilityRailProps {
  onOpenGoals: () => void;
  onResetFoods: () => void;
  hasFoods: boolean;
  currentSeason: Season;
  theme: Theme;
  onToggleTheme: () => void;
  dayValidated?: boolean;
}

export function UtilityRail({ onOpenGoals, currentSeason, theme, onToggleTheme }: UtilityRailProps) {
  return (
    <aside className="w-16 lg:w-20 h-full flex flex-col items-center py-8 bg-transparent z-50">
      <div className="mb-10 text-[var(--accent)]">
        <Leaf size={24} strokeWidth={1.5} />
      </div>

      <div className="flex-1 flex flex-col gap-5 items-center">
        <button
          className="p-3 rounded-full text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--warm-200)] transition-all"
          title="Aujourd'hui"
        >
          <Clock size={18} strokeWidth={1.5} />
        </button>

        <button
          onClick={onToggleTheme}
          className="p-3 rounded-full text-[var(--text)] hover:text-[var(--highlight)] hover:bg-[var(--warm-200)] transition-all"
          title={themeLabels[theme]}
        >
          <motion.span
            key={theme}
            initial={{ rotate: -90, scale: 0.6 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="block"
          >
            <Palette size={18} strokeWidth={1.5} />
          </motion.span>
        </button>

        <button
          onClick={onOpenGoals}
          className="p-3 rounded-full text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--warm-200)] transition-all"
          title="Objectifs"
        >
          <Settings size={18} strokeWidth={1.5} />
        </button>
      </div>

      {(() => {
        const cfg = seasonConfig[currentSeason];
        const Icon = cfg.icon;
        return (
          <div className="relative flex flex-col items-center mt-auto pb-2" title={cfg.label}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15]">
              <Icon size={56} strokeWidth={1} style={{ color: cfg.color }} />
            </div>
            <div className="relative flex flex-col items-center gap-2 py-5" style={{ color: cfg.color }}>
              {cfg.label.toUpperCase().split('').map((char, i) => (
                <span key={i} className="text-[13px] leading-none tracking-widest" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
                  {char}
                </span>
              ))}
            </div>
          </div>
        );
      })()}
    </aside>
  );
}
