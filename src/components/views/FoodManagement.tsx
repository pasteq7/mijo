import { FoodSearch } from '../FoodSearch';
import { FoodList } from '../FoodList';
import type { SelectedFood, Food, Season } from '../../types';

interface FoodManagementProps {
  selectedFoods: SelectedFood[];
  selectedIds: Set<string>;
  onToggle: (food: Food) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  currentSeason: Season;
}

export function FoodManagement({  
  selectedFoods,  
  selectedIds,
  onToggle,  
  onUpdateQty,  
  onRemove,
  currentSeason
}: FoodManagementProps) {
  return (
    <div className="flex flex-col h-full space-y-8">
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-[--text] uppercase tracking-[0.1em]">Sélection</h2>
        <FoodList items={selectedFoods} onUpdateQty={onUpdateQty} onRemove={onRemove} />
      </div>
      <div className="pt-8 border-t border-[--border] space-y-4">
        <h3 className="text-xs font-semibold text-[--text] uppercase tracking-[0.1em]">Ajouter</h3>
        <FoodSearch selectedIds={selectedIds} onToggle={onToggle} currentSeason={currentSeason} />
      </div>
    </div>
  );
}