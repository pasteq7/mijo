import { useState, useCallback } from 'react';
import { useNutrients, useDailyNutrients } from './hooks/useNutrients';
import { useFoodSuggestions } from './hooks/useFoodSuggestions';
import { useDayHistory } from './hooks/useDayHistory';
import { useFavoriteMeals } from './hooks/useFavoriteMeals';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { MEAL_GOALS, multiplyGoals } from './data/nutrients';
import { FOODS } from './data/foods';

import { MainLayout } from './components/layout/MainLayout';
import { UtilityRail } from './components/layout/UtilityRail';
import { FoodManagement } from './components/views/FoodManagement';
import { AnalysisView } from './components/views/AnalysisView';
import { GoalsModal } from './components/GoalsModal';
import { DayValidationDialog } from './components/DayValidationDialog';

import type { Food, SelectedFood, NutrientGoals, MealRecord, Season, FavoriteMeal } from './types';

function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'printemps';
  if (month >= 6 && month <= 8) return 'ete';
  if (month >= 9 && month <= 11) return 'automne';
  return 'hiver';
}

export default function App() {
  const [selectedFoods, setSelectedFoods] = useLocalStorage<SelectedFood[]>('veganut-foods', []);
  const [dailyGoals, setDailyGoals] = useLocalStorage<NutrientGoals>('veganut-daily-goals', multiplyGoals(MEAL_GOALS, 3));
  const [mealGoals, setMealGoals] = useLocalStorage<NutrientGoals>('veganut-meal-goals', MEAL_GOALS);
  const [mealsPerDay, setMealsPerDay] = useLocalStorage<number>('veganut-meals-per-day', 3);
  const [showGoals, setShowGoals] = useState(false);
  const [showDayValidation, setShowDayValidation] = useState(false);

  const currentSeason = getCurrentSeason();
  const { theme, toggleTheme } = useTheme();
  const totals = useNutrients(selectedFoods);

  const {
    activeDay,
    pastDays,
    addMealToDay,
    deleteMeal,
    validateDay,
  } = useDayHistory(dailyGoals);

  const dailyTotals = useDailyNutrients(totals, activeDay?.meals ?? []);

  const { activeGoals, balancedSuggestions, targetedSuggestions } = useFoodSuggestions(selectedFoods, activeDay?.meals ?? [], mealGoals);

  const { favorites, favoriteIds, addFavorite, removeFavorite } = useFavoriteMeals();

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
    addMealToDay(newMeal);
    setSelectedFoods([]);
  }, [selectedFoods, totals, addMealToDay, setSelectedFoods]);

  const handleEditMeal = useCallback((id: string) => {
    if (!activeDay) return;
    const meal = activeDay.meals.find(m => m.id === id);
    if (!meal) return;
    setSelectedFoods(meal.foods);
    deleteMeal(id);
  }, [activeDay, setSelectedFoods, deleteMeal]);

  const handleDeleteMeal = useCallback((id: string) => {
    deleteMeal(id);
  }, [deleteMeal]);

  const handleValidateDay = useCallback(() => {
    validateDay();
    setShowDayValidation(false);
    setSelectedFoods([]);
  }, [validateDay, setSelectedFoods]);

  const handleToggleFavorite = useCallback((meal: MealRecord) => {
    if (favoriteIds.has(meal.id)) {
      const fav = favorites.find(f => f.sourceMealId === meal.id);
      if (fav) removeFavorite(fav.id);
    } else {
      addFavorite(meal);
    }
  }, [favoriteIds, favorites, addFavorite, removeFavorite]);

  const handleLoadFavorite = useCallback((fav: FavoriteMeal) => {
    setSelectedFoods(fav.foods);
  }, [setSelectedFoods]);

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
            dayValidated={activeDay === null}
          />
        }
        sidebar={
          <FoodManagement
            selectedFoods={selectedFoods}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemove}
            onSaveMeal={handleSaveMeal}
            onValidateDay={() => setShowDayValidation(true)}
            mealCountToday={activeDay?.meals.length ?? 0}
            currentSeason={currentSeason}
            favorites={favorites}
            onLoadFavorite={handleLoadFavorite}
            onDeleteFavorite={removeFavorite}
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
          pastMeals={activeDay?.meals ?? []}
          pastDays={pastDays}
          onAddFood={handleAddFoodById}
          onEditMeal={handleEditMeal}
          onDeleteMeal={handleDeleteMeal}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
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

      {showDayValidation && activeDay && (
        <DayValidationDialog
          day={activeDay}
          dailyGoals={dailyGoals}
          onConfirm={handleValidateDay}
          onCancel={() => setShowDayValidation(false)}
        />
      )}
    </>
  );
}
