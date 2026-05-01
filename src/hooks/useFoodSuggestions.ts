import { useMemo } from 'react';
import type { SelectedFood, MealRecord, NutrientGoals } from '../types';
import { FOODS } from '../data/foods';
import { useNutrients } from './useNutrients';
import { calculateDeficits, getCompensatedGoals, getFoodSuggestions } from '../utils/recommendations';

export function useFoodSuggestions(selectedFoods: SelectedFood[], pastMeals: MealRecord[], baseGoals: NutrientGoals) {
  const totals = useNutrients(selectedFoods);

  return useMemo(() => {
    // We adjust current goals based on what we missed in previous meals!
    const activeGoals = getCompensatedGoals(baseGoals, pastMeals);
    const deficits = calculateDeficits(totals, activeGoals);
    
    const balanced = getFoodSuggestions(FOODS, deficits, 'balanced');
    const targeted = getFoodSuggestions(FOODS, deficits, 'targeted');

    return {
      activeGoals,
      deficits,
      balancedSuggestions: balanced,
      targetedSuggestions: targeted,
    };
  }, [totals, pastMeals, baseGoals]);
}