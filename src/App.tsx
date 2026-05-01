import { useState, useCallback } from 'react';
import { useNutrients, useDailyNutrients } from './hooks/useNutrients';
import { useFoodSuggestions } from './hooks/useFoodSuggestions';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { MEAL_GOALS, multiplyGoals } from './data/nutrients';
import { FOODS } from './data/foods';

import { MainLayout } from './components/layout/MainLayout';
import { UtilityRail } from './components/layout/UtilityRail';
import { FoodManagement } from './components/views/FoodManagement';
import { AnalysisView } from './components/views/AnalysisView';
import { GoalsModal } from './components/GoalsModal';

import type { Food, SelectedFood, NutrientGoals, MealRecord, Season } from './types';

function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'printemps';
  if (month >= 6 && month <= 8) return 'ete';
  if (month >= 9 && month <= 11) return 'automne';
  return 'hiver';
}

export default function App() {
  const [selectedFoods, setSelectedFoods] = useLocalStorage<SelectedFood[]>('veganut-foods', []);
  const [pastMeals, setPastMeals] = useLocalStorage<MealRecord[]>('veganut-history', []);
  const [dailyGoals, setDailyGoals] = useLocalStorage<NutrientGoals>('veganut-daily-goals', multiplyGoals(MEAL_GOALS, 3));
  const [mealGoals, setMealGoals] = useLocalStorage<NutrientGoals>('veganut-meal-goals', MEAL_GOALS);
  const [mealsPerDay, setMealsPerDay] = useLocalStorage<number>('veganut-meals-per-day', 3);
  const [showGoals, setShowGoals] = useState(false);

  const currentSeason = getCurrentSeason();
  const { theme, toggleTheme } = useTheme();
  const totals = useNutrients(selectedFoods);
  const dailyTotals = useDailyNutrients(totals, pastMeals);
  const { activeGoals, balancedSuggestions, targetedSuggestions } = useFoodSuggestions(selectedFoods, pastMeals, mealGoals);

  const selectedIds = new Set(selectedFoods.map((sf) => sf.food.id));

  const handleToggle = useCallback((food: Food) => {
    setSelectedFoods((prev) => {
      if (prev.find((sf) => sf.food.id === food.id)) {
        return prev.filter((sf) => sf.food.id !== food.id);
      }
      return [...prev, { food, qty: food.defaultQty }];
    });
  }, [setSelectedFoods]);

  const handleAddFoodById = useCallback((id: string) => {
    const food = FOODS.find((f) => f.id === id);
    if (food) handleToggle(food);
  }, [handleToggle]);

  const handleUpdateQty = useCallback((id: string, qty: number) => {
    setSelectedFoods((prev) =>
      prev.map((sf) => sf.food.id === id ? { ...sf, qty } : sf)
    );
  }, [setSelectedFoods]);

  const handleRemove = useCallback((id: string) => {
    setSelectedFoods((prev) => prev.filter((sf) => sf.food.id !== id));
  }, [setSelectedFoods]);

  const handleSaveMeal = useCallback(() => {
    if (selectedFoods.length === 0) return;
    const newMeal: MealRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      foods: selectedFoods,
      totals,
    };
    setPastMeals((prev) => [...prev, newMeal].slice(-10)); // Keep last 10 meals history
    setSelectedFoods([]); // Clear plate for next meal
  }, [selectedFoods, totals, setPastMeals, setSelectedFoods]);

  return (
    <>
      <MainLayout
        utilityRail={
          <UtilityRail
            onOpenGoals={() => setShowGoals(true)}
            onResetFoods={() => setSelectedFoods([])}
            hasFoods={selectedFoods.length > 0}
            currentSeason={currentSeason}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        }
        sidebar={
          <FoodManagement
            selectedFoods={selectedFoods}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemove}
            currentSeason={currentSeason}
          />
        }
      >
        <AnalysisView
          totals={totals}
          dailyTotals={dailyTotals}
          dailyGoals={dailyGoals}
          mealGoals={mealGoals}
          activeGoals={activeGoals}
          balancedSuggestions={balancedSuggestions}
          targetedSuggestions={targetedSuggestions}
          selectedFoods={selectedFoods}
          onAddFood={handleAddFoodById}
          onSaveMeal={handleSaveMeal}
        />
      </MainLayout>

      {showGoals && (
        <GoalsModal
          dailyGoals={dailyGoals}
          mealGoals={mealGoals}
          mealsPerDay={mealsPerDay}
          onSaveDaily={setDailyGoals}
          onSaveMeal={setMealGoals}
          onSaveMealsPerDay={setMealsPerDay}
          onClose={() => setShowGoals(false)}
        />
      )}
    </>
  );
}
