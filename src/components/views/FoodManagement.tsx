import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { FoodSearch } from '../FoodSearch';
import { FoodList } from '../FoodList';
import type { SelectedFood, Food, Season, FavoriteMeal } from '../../types';

interface FoodManagementProps {
  selectedFoods: SelectedFood[];
  selectedIds: Set<string>;
  onToggle: (food: Food) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onSaveMeal: () => void;
  onValidateDay: () => void;
  mealCountToday: number;
  currentSeason: Season;
  favorites?: FavoriteMeal[];
  onLoadFavorite?: (fav: FavoriteMeal) => void;
  onDeleteFavorite?: (id: string) => void;
}

export function FoodManagement({  
  selectedFoods,  
  selectedIds,
  onToggle,  
  onUpdateQty,  
  onRemove,
  onSaveMeal,
  onValidateDay,
  mealCountToday,
  currentSeason,
  favorites,
  onLoadFavorite,
  onDeleteFavorite
}: FoodManagementProps) {
  return (
    <div className="flex flex-col h-full space-y-8">
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-[var(--text)] uppercase tracking-[0.1em]">Sélection</h2>
        <FoodList items={selectedFoods} onUpdateQty={onUpdateQty} onRemove={onRemove} />
        {selectedFoods.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onSaveMeal}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-2xl font-medium hover:bg-[#5C7D5B] transition-colors shadow-[var(--shadow-sm)]"
          >
            <CheckCircle2 size={18} strokeWidth={2} />
            Valider le repas
          </motion.button>
        )}
        {mealCountToday > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onValidateDay}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-[var(--shadow-sm)]"
          >
            Valider la journée
          </motion.button>
        )}
      </div>
      <div className="pt-8 border-t border-[var(--border)] space-y-4">
        <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-[0.1em]">Ajouter</h3>
        <FoodSearch selectedIds={selectedIds} onToggle={onToggle} currentSeason={currentSeason} favorites={favorites} onLoadFavorite={onLoadFavorite} onDeleteFavorite={onDeleteFavorite} />
      </div>
    </div>
  );
}
