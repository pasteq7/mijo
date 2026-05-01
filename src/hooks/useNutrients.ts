import { useMemo } from 'react';
import type { SelectedFood, DailyGoals, NutrientKey, MealRecord } from '../types';

export function useNutrients(selectedFoods: SelectedFood[]): Partial<DailyGoals> {
  return useMemo(() => {
    const totals: Partial<DailyGoals> = {};
    for (const { food, qty } of selectedFoods) {
      const ratio = qty / 100;
      for (const [key, value] of Object.entries(food.per100g)) {
        const k = key as NutrientKey;
        totals[k] = ((totals[k] ?? 0) + (value ?? 0) * ratio) as never;
      }
    }
    return totals;
  }, [selectedFoods]);
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
      for (const [key, value] of Object.entries(meal.totals)) {
        const k = key as NutrientKey;
        dailyTotals[k] = ((dailyTotals[k] ?? 0) + (value ?? 0)) as never;
      }
    }

    return dailyTotals;
  }, [currentTotals, pastMeals]);
}