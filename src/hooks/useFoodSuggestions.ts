import { useMemo } from 'react';
import type { SelectedFood, MealRecord, NutrientGoals } from '../types';
import { FOODS } from '../data/foods';
import { useNutrients } from './useNutrients';
import { calculateDeficits, getCompensatedGoals, getFoodSuggestions } from '../utils/recommendations';

export function useFoodSuggestions(selectedFoods: SelectedFood[], pastMeals: MealRecord[], baseGoals: NutrientGoals) {
  const totals = useNutrients(selectedFoods);

  return useMemo(() => {
    const activeGoals = getCompensatedGoals(baseGoals, pastMeals);
    const deficits = calculateDeficits(totals, activeGoals);
    const suggestions = getFoodSuggestions(FOODS, deficits, selectedFoods);

    return {
      activeGoals,
      deficits,
      suggestions,
    };
  }, [totals, pastMeals, baseGoals, selectedFoods]);
}