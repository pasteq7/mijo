import { useState, useCallback, useMemo } from 'react';
import { useNutrients, useDailyNutrients } from './hooks/useNutrients';
import { useDayHistory } from './hooks/useDayHistory';
import { useFavoriteMeals } from './hooks/useFavoriteMeals';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { DAILY_GOALS, MEAL_GOALS } from './data/nutrients';
import { useLanguage } from './hooks/useLanguage';

import { MainLayout } from './components/layout/MainLayout';
import { UtilityRail } from './components/layout/UtilityRail';
import { FoodManagement } from './components/views/FoodManagement';
import { AnalysisView } from './components/views/AnalysisView';
import { NutritionGoalsModal } from './components/NutritionGoalsModal';
import { DayValidationDialog } from './components/DayValidationDialog';

import type { Food, SelectedFood, NutrientGoals, MealRecord, Season, FavoriteMeal } from './types';
import type { GoalProfile } from './utils/goalCalculations';

const DEFAULT_GOAL_PROFILE: GoalProfile = {
  age: 30,
  weight: 70,
  height: 170,
  sex: 'male',
  activity: 'light',
  target: 'deficit',
};

function generateFoodId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'printemps';
  if (month >= 6 && month <= 8) return 'ete';
  if (month >= 9 && month <= 11) return 'automne';
  return 'hiver';
}

function mergeGoals(stored: NutrientGoals, defaults: NutrientGoals): NutrientGoals {
  return { ...defaults, ...stored };
}

function getFoodsSignature(foods: SelectedFood[]): string {
  return foods
    .map(sf => `${sf.food.id}:${sf.qty}`)
    .sort()
    .join('|');
}

export default function App() {
  const { t } = useLanguage();
  const [selectedFoods, setSelectedFoods] = useLocalStorage<SelectedFood[]>('veganut-foods', []);
  const [dailyGoalsState, setDailyGoals] = useLocalStorage<NutrientGoals>('veganut-daily-goals', DAILY_GOALS);
  const [mealGoalsState, setMealGoals] = useLocalStorage<NutrientGoals>('veganut-meal-goals', MEAL_GOALS);
  const [goalProfile, setGoalProfile] = useLocalStorage<GoalProfile>('veganut-goal-profile', DEFAULT_GOAL_PROFILE);
  const dailyGoals = useMemo(() => mergeGoals(dailyGoalsState, DAILY_GOALS), [dailyGoalsState]);
  const mealGoals = useMemo(() => mergeGoals(mealGoalsState, MEAL_GOALS), [mealGoalsState]);
  const smartGoalProfile = useMemo(() => ({ ...DEFAULT_GOAL_PROFILE, ...goalProfile }), [goalProfile]);
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
    deleteMealFromDay,
    updateMealQuantityInDay,
    validateDay,
    allDays,
  } = useDayHistory(dailyGoals);

  const dailyTotals = useDailyNutrients(totals, activeDay?.meals ?? []);

  const { favorites, favoriteIds, addFavorite, removeFavorite } = useFavoriteMeals();

  const selectedIds = new Set(selectedFoods.map((sf) => sf.food.id));

  const handleToggle = useCallback((food: Food) => {
    setSelectedFoods((prev) => {
      if (prev.find((sf) => sf.food.id === food.id)) {
        return prev.filter((sf) => sf.food.id !== food.id);
      }
      return [...prev, { id: generateFoodId(), food, qty: food.defaultQty }];
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

  const handleClear = useCallback(() => {
    setSelectedFoods([]);
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
    setSelectedFoods(meal.foods.map(sf => ({ ...sf, id: sf.id ?? generateFoodId() })));
    deleteMeal(id);
  }, [activeDay, setSelectedFoods, deleteMeal]);

  const handleDeleteMeal = useCallback((id: string) => {
    deleteMeal(id);
  }, [deleteMeal]);

  const handleDeleteHistoryMeal = useCallback((dayId: string, mealId: string) => {
    deleteMealFromDay(dayId, mealId);
  }, [deleteMealFromDay]);

  const handleUpdateHistoryMealQty = useCallback((dayId: string, mealId: string, foodIndex: number, newQty: number) => {
    updateMealQuantityInDay(dayId, mealId, foodIndex, newQty);
  }, [updateMealQuantityInDay]);

  const handleEditHistoryMealFoods = useCallback((dayId: string, mealId: string) => {
    const day = allDays.find(d => d.id === dayId);
    if (!day) return;
    const meal = day.meals.find(m => m.id === mealId);
    if (!meal) return;
    setSelectedFoods(meal.foods.map(sf => ({ ...sf, id: sf.id ?? generateFoodId() })));
    deleteMealFromDay(dayId, mealId);
  }, [allDays, setSelectedFoods, deleteMealFromDay]);

  const handleValidateDay = useCallback(() => {
    validateDay();
    setShowDayValidation(false);
    setSelectedFoods([]);
  }, [validateDay, setSelectedFoods]);

  const handleAddMeal = useCallback(() => {
    const el = document.getElementById('food-search-input');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el?.focus();
  }, []);

  const handleToggleFavorite = useCallback((meal: MealRecord) => {
    const mealSignature = getFoodsSignature(meal.foods);
    const fav = favorites.find(f => f.sourceMealId === meal.id || getFoodsSignature(f.foods) === mealSignature);

    if (fav) {
      removeFavorite(fav.id);
    } else {
      addFavorite(meal);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const handleAddFavoriteMeal = useCallback((favorite: FavoriteMeal) => {
    const meal: MealRecord = {
      id: generateFoodId(),
      date: new Date().toISOString(),
      foods: favorite.foods.map(sf => ({ ...sf, id: generateFoodId() })),
      totals: favorite.totals,
    };
    addMealToDay(meal);
  }, [addMealToDay]);

  const handleExport = useCallback(() => {
    const keys = ['veganut-foods', 'veganut-daily-goals', 'veganut-meal-goals', 'veganut-goal-profile',
      'veganut-days', 'veganut-favorites', 'veganut-theme'];
    const data: Record<string, unknown> = { version: 1, exportedAt: new Date().toISOString() };
    for (const key of keys) {
      try {
        const item = localStorage.getItem(key);
        if (item) data[key] = JSON.parse(item);
      } catch { /* skip */ }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veganut-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleResetAll = useCallback(() => {
    const keys = ['veganut-foods', 'veganut-daily-goals', 'veganut-meal-goals', 'veganut-goal-profile',
      'veganut-days', 'veganut-favorites', 'veganut-theme'];
    for (const key of keys) {
      localStorage.removeItem(key);
    }
    window.location.reload();
  }, []);

  const handleImport = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      const keys = ['veganut-foods', 'veganut-daily-goals', 'veganut-meal-goals', 'veganut-goal-profile',
        'veganut-days', 'veganut-favorites', 'veganut-theme'];
      for (const key of keys) {
        if (data[key] !== undefined) {
          localStorage.setItem(key, JSON.stringify(data[key]));
        }
      }
      window.location.reload();
    } catch {
      alert(t('goalsModal.invalidFileFormat'));
    }
  }, [t]);

  return (
    <>
      <img
        src="/nature.svg"
        alt=""
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-0 z-0 w-[50vw] max-w-[800px] opacity-[0.15]"
        style={{ transform: 'scaleX(-1)' }}
      />

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
          <AnalysisView
            dailyTotals={dailyTotals}
            dailyGoals={dailyGoals}
            pastMeals={activeDay?.meals ?? []}
            pastDays={pastDays}
            onEditMeal={handleEditMeal}
            onDeleteMeal={handleDeleteMeal}
            onDeleteHistoryMeal={handleDeleteHistoryMeal}
            onUpdateHistoryMealQty={handleUpdateHistoryMealQty}
            onEditHistoryMealFoods={handleEditHistoryMealFoods}
            favorites={favorites}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onAddFavoriteMeal={handleAddFavoriteMeal}
            onDeleteFavorite={removeFavorite}
            onValidateDay={() => setShowDayValidation(true)}
            currentMealFoods={selectedFoods}
            onAddMeal={handleAddMeal}
          />
        }
      >
        <FoodManagement
          selectedFoods={selectedFoods}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
          onSaveMeal={handleSaveMeal}
          onClear={handleClear}
          totals={totals}
          goals={mealGoals}
          hasMeals={(activeDay?.meals ?? []).length > 0}
        />
      </MainLayout>

      {showGoals && (
        <NutritionGoalsModal
          dailyGoals={dailyGoals}
          mealGoals={mealGoals}
          smartProfile={smartGoalProfile}
          onSaveDaily={setDailyGoals}
          onSaveMeal={setMealGoals}
          onSaveSmartProfile={setGoalProfile}
          onClose={() => setShowGoals(false)}
          onExport={handleExport}
          onImport={handleImport}
          onResetAll={handleResetAll}
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
