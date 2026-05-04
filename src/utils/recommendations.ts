import type { Food, FoodCategory, NutrientGoals, NutrientKey, MealRecord, SelectedFood } from '../types';
import { NUTRIENT_META } from '../data/nutrients';

export interface NutrientDeficit {
  id: NutrientKey;
  current: number;
  goal: number;
  deficit: number;
  percentDeficit: number;
  label: string;
}

export interface FoodSuggestion {
  food: Food;
  score: number;
  contributingNutrients: { id: NutrientKey; impact: number }[];
}

// Dynamically adjust current meal goals based on what was missed in recent meals
export function getCompensatedGoals(baseGoals: NutrientGoals, pastMeals: MealRecord[]): NutrientGoals {
  const compensated = { ...baseGoals };
  if (pastMeals.length === 0) return compensated;
  
  // Look at the last 2 meals to compensate
  const recent = pastMeals.slice(-2);
  
  for (const key in baseGoals) {
    const k = key as NutrientKey;
    const meta = NUTRIENT_META.find(m => m.id === k);
    
    // Ignore macros for compensation (don't overeat calories because of past meals) and supplements
    if (meta?.group === 'macros') continue;
    
    const pastTarget = baseGoals[k] * recent.length;
    const pastActual = recent.reduce((sum, m) => sum + (m.totals[k] ?? 0), 0);
    
    if (pastActual < pastTarget) {
      // Add 40% of the past deficit to the current meal goal
      compensated[k] += (pastTarget - pastActual) * 0.4;
    }
  }
  return compensated;
}

export function calculateDeficits(totals: Partial<NutrientGoals>, goals: NutrientGoals): NutrientDeficit[] {
  return (Object.keys(goals) as NutrientKey[])
    .map((id) => {
      const meta = NUTRIENT_META.find((m) => m.id === id);
      const goal = goals[id];
      const current = totals[id] ?? 0;
      const deficit = Math.max(0, goal - current);
      const percentDeficit = (deficit / goal) * 100;

      return {
        id,
        current,
        goal,
        deficit,
        percentDeficit,
        label: meta?.label ?? id,
      };
    })
    .filter((d): d is NutrientDeficit => d !== null && d.deficit > 0)
    .sort((a, b) => b.percentDeficit - a.percentDeficit);
}

export function getFoodSuggestions(
  foods: Food[],
  deficits: NutrientDeficit[],
  selectedFoods: SelectedFood[] = [],
): FoodSuggestion[] {
  if (deficits.length === 0) return [];

  const topDeficits = deficits.slice(0, 5);
  const selectedIds = new Set(selectedFoods.map(sf => sf.food.id));

  // Synergy: what's already in the meal
  const selectedCategories = new Set(selectedFoods.map(sf => sf.food.category));
  const hasCereals = selectedCategories.has('céréales');
  const hasLegumes = selectedCategories.has('légumineuses');
  const needsCerealLegumeBoost = (hasCereals && !hasLegumes) || (hasLegumes && !hasCereals);
  const needsVitCBoost = deficits.some(d => d.id === 'fer') && deficits.some(d => d.id === 'vitC');

  const scored = foods
    .filter(f => !selectedIds.has(f.id))
    .map((food) => {
      const contributingNutrients: { id: NutrientKey; impact: number }[] = [];
      let score = 0;

      topDeficits.forEach((d) => {
        const per100 = food.per100g[d.id] ?? 0;
        if (per100 <= 0) return;

        const servingValue = per100 * (food.defaultQty / 100);
        const coverage = Math.min(1, servingValue / d.deficit);
        score += coverage * (d.percentDeficit / 100);
        contributingNutrients.push({ id: d.id, impact: Math.round(coverage * 100) });
      });

      // Synergy: complete proteins (céréales + légumineuses)
      if (needsCerealLegumeBoost &&
          ((food.category === 'légumineuses' && hasCereals) ||
           (food.category === 'céréales' && hasLegumes))) {
        score *= 1.5;
      }

      // Synergy: iron absorption (boost vitamin C sources when both iron and vitC are lacking)
      if (needsVitCBoost && (food.per100g.vitC ?? 0) > 5) {
        score *= 1.3;
      }

      return {
        food,
        score,
        contributingNutrients: contributingNutrients.sort((a, b) => b.impact - a.impact).slice(0, 3),
      };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // Diversity: limit to 2 suggestions per category to ensure variety
  const categoryCount = new Map<FoodCategory, number>();
  const diverse: FoodSuggestion[] = [];

  for (const s of scored) {
    const count = categoryCount.get(s.food.category) ?? 0;
    if (count >= 2) continue;
    categoryCount.set(s.food.category, count + 1);
    diverse.push(s);
    if (diverse.length >= 5) break;
  }

  return diverse;
}

// Realistic Meal Evaluator
export function evaluateMeal(totals: Partial<NutrientGoals>, goals: NutrientGoals) {
  const calPct = (totals.calories ?? 0) / goals.calories;
  const proPct = (totals.proteines ?? 0) / goals.proteines;

  const keyMicros =['fer', 'calcium', 'zinc', 'magnesium', 'vitC', 'vitA', 'omega3'] as NutrientKey[];
  const goodMicrosCount = keyMicros.filter(m => (totals[m] ?? 0) >= goals[m] * 0.5).length;

  if (calPct < 0.3) {
    return { score: 0, label: 'Repas trop léger', color: 'text-stone-400', progressColor: 'bg-stone-300' };
  }
  if (calPct >= 0.7 && proPct >= 0.7 && goodMicrosCount >= 4) {
    return { score: 3, label: 'Excellent & Complet', color: 'text-[#4A7A5A]', progressColor: 'bg-[#4A7A5A]' };
  }
  if (calPct >= 0.5 && proPct >= 0.4) {
    return { score: 2, label: 'Équilibré', color: 'text-[#7C9A6E]', progressColor: 'bg-[#7C9A6E]' };
  }
  return { score: 1, label: 'Incomplet', color: 'text-amber-500', progressColor: 'bg-amber-400' };
}