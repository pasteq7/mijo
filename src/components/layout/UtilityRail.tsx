import { Settings, Leaf, Sun, Moon, Flower2, Snowflake, Clock } from 'lucide-react';
import type { Season } from '../../types';

const seasonConfig: Record<Season, { icon: typeof Leaf; label: string; color: string; softColor: string }> = {
  printemps: { icon: Flower2, label: 'Printemps', color: 'var(--accent)', softColor: 'var(--accent-soft)' },
  ete: { icon: Sun, label: 'Été', color: 'var(--highlight)', softColor: 'var(--highlight-soft)' },
  automne: { icon: Leaf, label: 'Automne', color: 'var(--action)', softColor: 'var(--action-soft)' },
  hiver: { icon: Snowflake, label: 'Hiver', color: 'var(--info)', softColor: 'var(--info-soft)' },
};

interface UtilityRailProps {
  onOpenGoals: () => void;
  onResetFoods: () => void;
  hasFoods: boolean;
  currentSeason: Season;
  theme: 'light' | 'dark';
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
          title={theme === 'light' ? 'Thème foncé' : 'Thème clair'}
        >
          {theme === 'light' ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
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
