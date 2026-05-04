import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { FoodSearch } from '../FoodSearch';
import { FoodList } from '../FoodList';
import type { SelectedFood, Food, Season, FavoriteMeal } from '../../types';
import type { FoodSuggestion } from '../../utils/recommendations';

interface FoodManagementProps {
  selectedFoods: SelectedFood[];
  selectedIds: Set<string>;
  onToggle: (food: Food) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onSaveMeal: () => void;
  onSaveAsFavorite?: () => void;
  currentSeason: Season;
  favorites?: FavoriteMeal[];
  onLoadFavorite?: (fav: FavoriteMeal) => void;
  onDeleteFavorite?: (id: string) => void;
  suggestions: FoodSuggestion[];
  onAddFood: (id: string) => void;
}

export function FoodManagement({
  selectedFoods,
  selectedIds,
  onToggle,
  onUpdateQty,
  onRemove,
  onSaveMeal,
  onSaveAsFavorite,
  currentSeason,
  favorites,
  onLoadFavorite,
  onDeleteFavorite,
  suggestions,
  onAddFood
}: FoodManagementProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
      <div className="flex flex-col space-y-4 overflow-y-auto">
        <FoodSearch
          selectedIds={selectedIds}
          onToggle={onToggle}
          currentSeason={currentSeason}
          suggestions={suggestions}
          onAddFood={onAddFood}
        />
      </div>
      <div className="flex flex-col space-y-4 overflow-y-auto overflow-x-hidden">
        <FoodList items={selectedFoods} onUpdateQty={onUpdateQty} onRemove={onRemove} onSaveAsFavorite={onSaveAsFavorite} favorites={favorites} onLoadFavorite={onLoadFavorite} onDeleteFavorite={onDeleteFavorite} />
        <AnimatePresence>
          {selectedFoods.length > 0 && (
            <motion.div
              key="save-meal"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onSaveMeal}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-2xl font-medium hover:bg-[#5C7D5B] transition-colors shadow-[var(--shadow-sm)]"
              >
                <CheckCircle2 size={18} strokeWidth={2} />
                Valider le repas
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
