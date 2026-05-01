import { Settings, Leaf, RotateCcw, Sun, Moon } from 'lucide-react';
import type { Season } from '../../types';

interface UtilityRailProps {
  onOpenGoals: () => void;
  onResetFoods: () => void;
  hasFoods: boolean;
  currentSeason: Season;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function UtilityRail({ onOpenGoals, onResetFoods, hasFoods, currentSeason, theme, onToggleTheme }: UtilityRailProps) {
  return (
    <aside className="w-16 lg:w-24 flex flex-col items-center py-10 bg-transparent z-50">
      <div className="mb-12 text-[var(--accent)]">
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
        
        {hasFoods && (
          <button 
            onClick={onResetFoods}
            className="p-3.5 rounded-full text-[var(--text)] hover:text-[var(--action)] hover:bg-[var(--warm-200)] transition-all shadow-[var(--shadow-sm)] bg-[var(--bg-subtle)] border border-[var(--border)]"
            title="Réinitialiser"
          >
            <RotateCcw size={20} strokeWidth={1.5} />
          </button>
        )}
      </div>

      <div className="text-[10px] font-medium text-[var(--text)] uppercase tracking-[0.2em] rotate-180 [writing-mode:vertical-lr] opacity-60">
        {currentSeason}
      </div>
    </aside>
  );
}
