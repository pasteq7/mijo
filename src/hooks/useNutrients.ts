import { useMemo } from 'react';
import { addNutrientValue, calculateMealTotals } from '../utils/nutritionTotals';
import type { SelectedFood, DailyGoals, NutrientKey, MealRecord } from '../types';

export function useNutrients(selectedFoods: SelectedFood[]): Partial<DailyGoals> {
  return useMemo(() => calculateMealTotals(selectedFoods), [selectedFoods]);
}

export function useDailyNutrients(
  currentTotals: Partial<DailyGoals>,
  pastMeals: MealRecord[]
): Partial<DailyGoals> {
  return useMemo(() => {
    const today = new Date();
    const isToday = (dateString: string) => {
      const d = new Date(dateString);
      return d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate();
    };

    const todayMeals = pastMeals.filter(m => isToday(m.date));
    const dailyTotals: Partial<DailyGoals> = { ...currentTotals };

    for (const meal of todayMeals) {
      for (const [key, value] of Object.entries(meal.totals) as [NutrientKey, number | undefined][]) {
        addNutrientValue(dailyTotals, key, value ?? 0);
      }
    }

    return dailyTotals;
  }, [currentTotals, pastMeals]);
}
