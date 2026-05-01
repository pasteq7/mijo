import { useMemo } from 'react';
import type { SelectedFood, DailyGoals, NutrientKey } from '../types';

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