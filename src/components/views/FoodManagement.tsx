import { useLocalStorage } from '../../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../../utils/storageKeys';
import { NutritionOverview } from '../NutritionOverview';
import { FoodList } from '../FoodList';
import { FoodSearch } from '../FoodSearch';
import type { SelectedFood, Food, NutrientGoals, TooltipMode } from '../../types';

interface FoodManagementProps {
  selectedFoods: SelectedFood[];
  selectedIds: Set<string>;
  onToggle: (food: Food) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onSaveMeal: () => void;
  onClear: () => void;
  totals: Partial<NutrientGoals>;
  goals: NutrientGoals;
  hasMeals?: boolean;
}

export function FoodManagement({
  selectedFoods,
  selectedIds,
  onToggle,
  onUpdateQty,
  onRemove,
  onSaveMeal,
  onClear,
  totals,
  goals,
  hasMeals,
}: FoodManagementProps) {
  const [tooltipMode, setTooltipMode] = useLocalStorage<TooltipMode>(
    STORAGE_KEYS.tooltipMode,
    'off',
  );

  const showHint = !hasMeals && selectedFoods.length === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:h-full" style={{ gridTemplateRows: 'auto minmax(0, 1fr)' }}>
      <div className="card p-5 flex flex-col min-h-0">
        <NutritionOverview totals={totals} goals={goals} foods={selectedFoods} />
      </div>
      <div className="card p-5 flex flex-col min-h-0">
        <FoodList
          items={selectedFoods}
          onUpdateQty={onUpdateQty}
          onRemove={onRemove}
          onSaveMeal={onSaveMeal}
          onClear={onClear}
        />
      </div>

      <div className={`col-span-1 lg:col-span-2 card p-5 min-h-0 flex flex-col transition-all duration-500 ${showHint ? 'card-breathing' : ''}`}>
        <FoodSearch
          selectedIds={selectedIds}
          onToggle={onToggle}
          tooltipMode={tooltipMode}
          onTooltipModeChange={setTooltipMode}
        />
      </div>
    </div>
  );
}
