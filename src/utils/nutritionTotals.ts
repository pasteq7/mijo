import type { MealRecord, NutrientGoals, NutrientKey, SelectedFood } from '../types';

export function addNutrientValue(
  totals: Partial<NutrientGoals>,
  key: NutrientKey,
  value: number,
): void {
  totals[key] = (totals[key] ?? 0) + value;
}

export function roundNutrientTotals(totals: Partial<NutrientGoals>, precision = 1): Partial<NutrientGoals> {
  const factor = 10 ** precision;
  const rounded: Partial<NutrientGoals> = {};

  for (const [key, value] of Object.entries(totals) as [NutrientKey, number][]) {
    rounded[key] = Math.round(value * factor) / factor;
  }

  return rounded;
}

export function calculateMealTotals(foods: SelectedFood[]): Partial<NutrientGoals> {
  const totals: Partial<NutrientGoals> = {};

  for (const { food, qty } of foods) {
    const ratio = qty / 100;

    for (const [key, value] of Object.entries(food.per100g) as [NutrientKey, number | undefined][]) {
      addNutrientValue(totals, key, (value ?? 0) * ratio);
    }
  }

  return roundNutrientTotals(totals);
}

export function calculateDailyTotals(meals: MealRecord[]): Partial<NutrientGoals> {
  const totals: Partial<NutrientGoals> = {};

  for (const meal of meals) {
    for (const [key, value] of Object.entries(meal.totals) as [NutrientKey, number | undefined][]) {
      addNutrientValue(totals, key, value ?? 0);
    }
  }

  return totals;
}
