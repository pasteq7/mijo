import { useState, useCallback } from 'react';
import { Settings, Leaf } from 'lucide-react';
import { FoodSearch } from './components/FoodSearch';
import { FoodList } from './components/FoodList';
import { NutrientPanel } from './components/NutrientPanel';
import { DayStats } from './components/DayStats';
import { InsightCard } from './components/InsightCard';
import { GoalsModal } from './components/GoalsModal';
import { useNutrients } from './hooks/useNutrients';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_GOALS } from './data/nutrients';
import type { Food, SelectedFood, DailyGoals, Season } from './types';

function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'printemps';
  if (month >= 6 && month <= 8) return 'ete';
  if (month >= 9 && month <= 11) return 'automne';
  return 'hiver';
}

export default function App() {
  const [selectedFoods, setSelectedFoods] = useLocalStorage<SelectedFood[]>(
    'veganut-foods', []
  );
  const [goals, setGoals] = useLocalStorage<DailyGoals>(
    'veganut-goals', DEFAULT_GOALS
  );
  const [showGoals, setShowGoals] = useState(false);
  const currentSeason = getCurrentSeason();
  const totals = useNutrients(selectedFoods);

  const selectedIds = new Set(selectedFoods.map((sf) => sf.food.id));

  const handleToggle = useCallback((food: Food) => {
    setSelectedFoods((prev) => {
      if (prev.find((sf) => sf.food.id === food.id)) {
        return prev.filter((sf) => sf.food.id !== food.id);
      }
      return [...prev, { food, qty: food.defaultQty }];
    });
  }, [setSelectedFoods]);

  const handleUpdateQty = useCallback((id: string, qty: number) => {
    setSelectedFoods((prev) =>
      prev.map((sf) => sf.food.id === id ? { ...sf, qty } : sf)
    );
  }, [setSelectedFoods]);

  const handleRemove = useCallback((id: string) => {
    setSelectedFoods((prev) => prev.filter((sf) => sf.food.id !== id));
  }, [setSelectedFoods]);

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-stone-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FAFAF7]/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf size={20} className="text-[#7C9A6E]" />
            <h1 className="font-semibold text-[#7C9A6E] text-lg">VegaNutrient</h1>
            <span className="text-xs text-stone-400 capitalize ml-1">
              · {currentSeason}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {selectedFoods.length > 0 && (
              <button
                onClick={() => setSelectedFoods([])}
                className="text-xs text-stone-400 hover:text-[#C4704F] transition-colors"
              >
                Réinitialiser
              </button>
            )}
            <button
              onClick={() => setShowGoals(true)}
              className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-800 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <Settings size={15} />
              Objectifs
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
              Sélectionner des aliments
            </h2>
            <FoodSearch
              selectedIds={selectedIds}
              onToggle={handleToggle}
              currentSeason={currentSeason}
            />
          </section>

          <section>
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
              Mon assiette du jour
              {selectedFoods.length > 0 && (
                <span className="ml-2 text-xs bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full normal-case font-normal">
                  {selectedFoods.length} aliment{selectedFoods.length > 1 ? 's' : ''}
                </span>
              )}
            </h2>
            <FoodList
              items={selectedFoods}
              onUpdateQty={handleUpdateQty}
              onRemove={handleRemove}
            />
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <DayStats totals={totals} goals={goals} />



          <section>
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
              Couverture nutritionnelle
            </h2>
            <NutrientPanel totals={totals} goals={goals} />
          </section>

                    {/* Insights */}
          {selectedFoods.length > 0 && (
            <div className="space-y-2">
              <InsightCard totals={totals} goals={goals} />
            </div>
          )}
        </div>
      </main>

      {/* Goals modal */}
      {showGoals && (
        <GoalsModal
          goals={goals}
          onSave={setGoals}
          onClose={() => setShowGoals(false)}
        />
      )}
    </div>
  );
}