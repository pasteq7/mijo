import { useState, useCallback, useMemo } from 'react';
import { useNutrients, useDailyNutrients } from './hooks/useNutrients';
import { useDayHistory } from './hooks/useDayHistory';
import { useFavoriteMeals } from './hooks/useFavoriteMeals';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DAILY_GOALS, MEAL_GOALS } from './data/nutrients';
import { useLanguage } from './hooks/useLanguage';
import { createId } from './utils/ids';
import { getFoodsSignature } from './utils/mealSignatures';
import { BACKUP_STORAGE_KEYS, STORAGE_KEYS } from './utils/storageKeys';

import { MainLayout } from './components/layout/MainLayout';
import { UtilityRail } from './components/layout/UtilityRail';
import { FoodManagement } from './components/views/FoodManagement';
import { AnalysisView } from './components/views/AnalysisView';
import { NutritionGoalsModal } from './components/NutritionGoalsModal';
import { DayValidationDialog } from './components/DayValidationDialog';

import type { Food, SelectedFood, NutrientGoals, MealRecord, Season, FavoriteMeal } from './types';
import type { GoalProfile } from './utils/goalCalculations';

interface EditingHistoryMeal {
  dayId: string;
  mealId: string;
  date: string;
}

const DEFAULT_GOAL_PROFILE: GoalProfile = {
  age: 30,
  weight: 70,
  height: 170,
  sex: 'male',
  activity: 'light',
  target: 'deficit',
};

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

function createMealDate(dayDate?: string): string {
  if (!dayDate) return new Date().toISOString();
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return new Date(`${dayDate}T${hours}:${minutes}:${seconds}`).toISOString();
}

export default function App() {
  const { t } = useLanguage();
  const [selectedFoods, setSelectedFoods] = useLocalStorage<SelectedFood[]>(
    STORAGE_KEYS.selectedFoods,
    [],
  );
  const [dailyGoalsState, setDailyGoals] = useLocalStorage<NutrientGoals>(
    STORAGE_KEYS.dailyGoals,
    DAILY_GOALS,
  );
  const [mealGoalsState, setMealGoals] = useLocalStorage<NutrientGoals>(
    STORAGE_KEYS.mealGoals,
    MEAL_GOALS,
  );
  const [goalProfile, setGoalProfile] = useLocalStorage<GoalProfile>(
    STORAGE_KEYS.goalProfile,
    DEFAULT_GOAL_PROFILE,
  );
  const [editingHistoryMeal, setEditingHistoryMeal] = useState<EditingHistoryMeal | null>(null);
  const [selectedAnalysisDayId, setSelectedAnalysisDayId] = useState<string | null>(null);
  const dailyGoals = useMemo(() => mergeGoals(dailyGoalsState, DAILY_GOALS), [dailyGoalsState]);
  const mealGoals = useMemo(() => mergeGoals(mealGoalsState, MEAL_GOALS), [mealGoalsState]);
  const smartGoalProfile = useMemo(() => ({ ...DEFAULT_GOAL_PROFILE, ...goalProfile }), [goalProfile]);
  const [showGoals, setShowGoals] = useState(false);
  const [showDayValidation, setShowDayValidation] = useState(false);

  const currentSeason = getCurrentSeason();
  const totals = useNutrients(selectedFoods);

  const {
    activeDay,
    pastDays,
    addMealToDay,
    addMealToExistingDay,
    deleteMeal,
    deleteMealFromDay,
    updateMealQuantityInDay,
    updateMealInDay,
    validateDay,
    allDays,
  } = useDayHistory(dailyGoals);

  const dailyTotals = useDailyNutrients(totals, activeDay?.meals ?? []);

  const { favorites, favoriteIds, addFavorite, removeFavorite } = useFavoriteMeals();

  const selectedIdsKey = useMemo(
    () => selectedFoods.map((sf) => sf.food.id).join('\u0000'),
    [selectedFoods],
  );
  const selectedIds = useMemo(
    () => new Set(selectedIdsKey ? selectedIdsKey.split('\u0000') : []),
    [selectedIdsKey],
  );

  const handleToggle = useCallback((food: Food) => {
    setSelectedFoods((prev) => {
      if (prev.find((sf) => sf.food.id === food.id)) {
        return prev.filter((sf) => sf.food.id !== food.id);
      }
      return [...prev, { id: createId(), food, qty: food.defaultQty }];
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
    setEditingHistoryMeal(null);
  }, [setSelectedFoods]);

  const handleSaveMeal = useCallback(() => {
    if (selectedFoods.length === 0) return;
    if (editingHistoryMeal) {
      const updatedMeal: MealRecord = {
        id: editingHistoryMeal.mealId,
        date: editingHistoryMeal.date,
        foods: selectedFoods,
        totals,
      };
      updateMealInDay(editingHistoryMeal.dayId, editingHistoryMeal.mealId, updatedMeal);
      setEditingHistoryMeal(null);
      setSelectedFoods([]);
      return;
    }

    const targetDay = selectedAnalysisDayId ? allDays.find(day => day.id === selectedAnalysisDayId) : undefined;
    const newMeal: MealRecord = {
      id: createId(),
      date: createMealDate(targetDay?.date),
      foods: selectedFoods,
      totals,
    };
    if (selectedAnalysisDayId) {
      addMealToExistingDay(selectedAnalysisDayId, newMeal);
    } else {
      addMealToDay(newMeal);
    }
    setSelectedFoods([]);
  }, [selectedFoods, editingHistoryMeal, selectedAnalysisDayId, allDays, totals, updateMealInDay, addMealToExistingDay, addMealToDay, setSelectedFoods]);

  const handleEditMeal = useCallback((id: string) => {
    if (!activeDay) return;
    const meal = activeDay.meals.find(m => m.id === id);
    if (!meal) return;
    setEditingHistoryMeal(null);
    setSelectedFoods(meal.foods.map(sf => ({ ...sf, id: sf.id ?? createId() })));
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
    setEditingHistoryMeal({ dayId, mealId, date: meal.date });
    setSelectedFoods(meal.foods.map(sf => ({ ...sf, id: sf.id ?? createId() })));
  }, [allDays, setSelectedFoods]);

  const handleValidateDay = useCallback(() => {
    validateDay();
    setShowDayValidation(false);
    setSelectedFoods([]);
  }, [validateDay, setSelectedFoods]);

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
      id: createId(),
      date: new Date().toISOString(),
      foods: favorite.foods.map(sf => ({ ...sf, id: createId() })),
      totals: favorite.totals,
    };
    addMealToDay(meal);
  }, [addMealToDay]);

  const handleExport = useCallback(() => {
    const data: Record<string, unknown> = { version: 1, exportedAt: new Date().toISOString() };
    for (const key of BACKUP_STORAGE_KEYS) {
      try {
        const item = localStorage.getItem(key);
        if (item) data[key] = JSON.parse(item);
      } catch { /* skip */ }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mijo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleResetAll = useCallback(() => {
    for (const key of BACKUP_STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
    window.location.reload();
  }, []);

  const handleImport = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      for (const key of BACKUP_STORAGE_KEYS) {
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
            currentSeason={currentSeason}
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
            onSelectedDayChange={setSelectedAnalysisDayId}
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
