import { NUTRIENT_META } from '../data/nutrients';
import type { NutrientGoals, NutrientKey } from '../types';

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function scaleGoalsFromCalories(
  current: NutrientGoals,
  defaults: NutrientGoals,
  calories: number,
): NutrientGoals {
  const nextCalories = Math.max(0, calories);
  const previousCalories = current.calories > 0 ? current.calories : defaults.calories;
  const scaleFactor = previousCalories > 0 ? nextCalories / previousCalories : 1;

  const next = { ...current, calories: Math.round(nextCalories) };

  for (const meta of NUTRIENT_META) {
    const key = meta.id as NutrientKey;
    if (key === 'calories') continue;

    if (key === 'proteines') next[key] = round1((nextCalories * 0.2) / 4);
    else if (key === 'glucides') next[key] = round1((nextCalories * 0.5) / 4);
    else if (key === 'lipides') next[key] = round1((nextCalories * 0.3) / 9);
    else if (key === 'fibres') next[key] = round1((14 * nextCalories) / 1000);
    else next[key] = round1((current[key] || defaults[key] || 0) * scaleFactor);
  }

  return next;
}
