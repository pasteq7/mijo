import { calculateDailyTotals, calculateMealTotals } from './nutritionTotals';
import type { DayRecord, DayScore, MealRecord, NutrientGoals, NutrientKey } from '../types';

export function computeScore(dailyTotals: Partial<NutrientGoals>, goals: NutrientGoals): DayScore {
  const caloriesPct = goals.calories > 0 ? ((dailyTotals.calories ?? 0) / goals.calories) * 100 : 0;
  const proteinPct = goals.proteines > 0 ? ((dailyTotals.proteines ?? 0) / goals.proteines) * 100 : 0;

  const microKeys: NutrientKey[] = [
    'vitA',
    'vitC',
    'vitB9',
    'vitB6',
    'vitE',
    'vitK',
    'fer',
    'calcium',
    'zinc',
    'magnesium',
    'selenium',
    'omega3',
    'omega6',
    'lysine',
    'methionine',
    'leucine',
    'threonine',
  ];
  const microCoverage = microKeys.filter((key) => {
    const goal = goals[key];
    return goal > 0 && ((dailyTotals[key] ?? 0) / goal) >= 0.5;
  }).length;

  let label: string;
  if (caloriesPct >= 90 && caloriesPct <= 110 && microCoverage >= 10) {
    label = 'Excellent';
  } else if (caloriesPct >= 80) {
    label = 'Équilibré';
  } else if (caloriesPct < 50) {
    label = 'Léger';
  } else {
    label = 'En cours';
  }

  return { caloriesPct, proteinPct, microCoverage, label };
}

export function recalculateDay(day: DayRecord, meals: MealRecord[], goals: NutrientGoals): DayRecord {
  const normalizedMeals = meals.map((meal) => ({
    ...meal,
    totals: calculateMealTotals(meal.foods),
  }));
  const dailyTotals = calculateDailyTotals(normalizedMeals);

  return {
    ...day,
    meals: normalizedMeals,
    dailyTotals,
    ...(day.status === 'validated' ? { score: computeScore(dailyTotals, goals) } : { score: undefined }),
  };
}
