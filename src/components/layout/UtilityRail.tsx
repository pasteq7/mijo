import { Settings, Leaf, RotateCcw } from 'lucide-react';
import type { Season } from '../../types';

interface UtilityRailProps {
  onOpenGoals: () => void;
  onResetFoods: () => void;
  hasFoods: boolean;
  currentSeason: Season;
}

export function UtilityRail({ onOpenGoals, onResetFoods, hasFoods, currentSeason }: UtilityRailProps) {
  return (
    <aside className="w-16 lg:w-24 flex flex-col items-center py-10 bg-transparent z-50">
      <div className="mb-12 text-[--accent]">
        <Leaf size={28} strokeWidth={1.5} />
      </div>
      
      <div className="flex-1 flex flex-col gap-6 items-center">
        <button 
          onClick={onOpenGoals}
          className="p-3.5 rounded-full text-[--text] hover:text-[--text-h] hover:bg-[--warm-200] transition-all shadow-[var(--shadow-sm)] bg-[--bg-subtle] border border-[--border]"
          title="Objectifs"
        >
          <Settings size={20} strokeWidth={1.5} />
        </button>
        
        {hasFoods && (
          <button 
            onClick={onResetFoods}
            className="p-3.5 rounded-full text-[--text] hover:text-[--action] hover:bg-white transition-all shadow-[var(--shadow-sm)] bg-[--bg-subtle] border border-[--border]"
            title="Réinitialiser"
          >
            <RotateCcw size={20} strokeWidth={1.5} />
          </button>
        )}
      </div>

      <div className="text-[10px] font-medium text-[--text] uppercase tracking-[0.2em] rotate-180 [writing-mode:vertical-lr] opacity-60">
        {currentSeason}
      </div>
    </aside>
  );
}
