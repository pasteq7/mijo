import { Settings, Leaf, Sun, Moon, Flower2, Snowflake } from 'lucide-react';
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
    <aside className="w-16 lg:w-24 h-full flex flex-col items-center py-10 bg-transparent z-50">
      <div className="mb-12 text-[var(--accent)] relative">
        <Leaf size={28} strokeWidth={1.5} />

      </div>

      <div className="flex-1 flex flex-col gap-6 items-center">
        <button
          onClick={onToggleTheme}
          className="p-3.5 rounded-full text-[var(--text)] hover:text-[var(--highlight)] hover:bg-[var(--warm-200)] transition-all shadow-[var(--shadow-sm)] bg-[var(--bg-subtle)] border border-[var(--border)]"
          title={theme === 'light' ? 'Thème Catppuccin Macchiato' : 'Thème Green / Cream'}
        >
          {theme === 'light' ? <Moon size={20} strokeWidth={1.5} /> : <Sun size={20} strokeWidth={1.5} />}
        </button>

        <button
          onClick={onOpenGoals}
          className="p-3.5 rounded-full text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--warm-200)] transition-all shadow-[var(--shadow-sm)] bg-[var(--bg-subtle)] border border-[var(--border)]"
          title="Objectifs"
        >
          <Settings size={20} strokeWidth={1.5} />
        </button>


      </div>

      {(() => {
        const cfg = seasonConfig[currentSeason];
        const Icon = cfg.icon;
        return (
          <div className="relative flex flex-col items-center mt-auto pb-2" title={cfg.label}>
            {/* Background motif — large, ghosted icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.18]">
              <Icon size={64} strokeWidth={1} style={{ color: cfg.color }} />
            </div>
            {/* Stacked label over the motif */}
            <div className="relative flex flex-col items-center gap-3 py-6" style={{ color: cfg.color }}>
              {cfg.label.toUpperCase().split('').map((char, i) => (
                <span key={i} className="text-[15px] leading-none" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
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
