import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { toDateKey } from '../utils/dateHelpers';
import type { DayRecord, MealRecord, NutrientGoals, NutrientKey, DayScore, SelectedFood } from '../types';

function computeMealTotals(foods: SelectedFood[]): Partial<NutrientGoals> {
  const totals: Partial<NutrientGoals> = {};
  for (const sf of foods) {
    for (const [key, value] of Object.entries(sf.food.per100g)) {
      const k = key as NutrientKey;
      totals[k] = ((totals[k] ?? 0) + ((value ?? 0) / 100) * sf.qty) as never;
    }
  }
  return totals;
}

function computeDailyTotals(meals: MealRecord[]): Partial<NutrientGoals> {
  const totals: Partial<NutrientGoals> = {};
  for (const meal of meals) {
    for (const [key, value] of Object.entries(meal.totals)) {
      const k = key as NutrientKey;
      totals[k] = ((totals[k] ?? 0) + (value ?? 0)) as never;
    }
  }
  return totals;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function computeScore(dailyTotals: Partial<NutrientGoals>, goals: NutrientGoals): DayScore {
  const caloriesPct = goals.calories > 0 ? ((dailyTotals.calories ?? 0) / goals.calories) * 100 : 0;
  const proteinPct = goals.proteines > 0 ? ((dailyTotals.proteines ?? 0) / goals.proteines) * 100 : 0;

  const microKeys: NutrientKey[] = ['vitA', 'vitC', 'vitB9', 'vitB6', 'vitE', 'vitK', 'fer', 'calcium', 'zinc', 'magnesium', 'selenium', 'omega3', 'omega6', 'lysine', 'methionine', 'leucine', 'threonine'];
  const microCoverage = microKeys.filter(k => {
    const goal = goals[k];
    return goal > 0 && ((dailyTotals[k] ?? 0) / goal) >= 0.5;
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

export function useDayHistory(dailyGoals: NutrientGoals) {
  const [days, setDays] = useLocalStorage<DayRecord[]>('veganut-days', []);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const today = toDateKey(new Date());

    setDays(prev => {
      const migrated = prev.map(d => d.id ? d : { ...d, id: generateId() });
      const updated = [...migrated];

      const activeIdx = updated.findIndex(d => d.status === 'active');
      if (activeIdx !== -1) {
        const activeDay = updated[activeIdx];
        if (activeDay.date !== today) {
          updated[activeIdx] = {
            ...activeDay,
            dailyTotals: computeDailyTotals(activeDay.meals),
            status: 'validated',
            validatedAt: new Date().toISOString(),
          };
        }
      }

      if (!updated.some(d => d.date === today)) {
        updated.push({
          id: generateId(),
          date: today,
          meals: [],
          dailyTotals: {},
          status: 'active',
        });
      }

      return updated;
    });
  }, [setDays]);

  const activeDay = useMemo(() => {
    return days.find(d => d.status === 'active') ?? null;
  }, [days]);

  const pastDays = useMemo(() => {
    return days
      .filter(d => d.status === 'validated')
      .sort((a, b) => {
        const aTime = a.validatedAt ?? a.date;
        const bTime = b.validatedAt ?? b.date;
        return bTime.localeCompare(aTime);
      });
  }, [days]);

  const addMealToDay = useCallback((meal: MealRecord) => {
    const today = toDateKey(new Date());
    setDays(prev => {
      const dayIdx = prev.findIndex(d => d.date === today && d.status === 'active');
      if (dayIdx === -1) {
        return [...prev, {
          id: generateId(),
          date: today,
          meals: [meal],
          dailyTotals: computeDailyTotals([meal]),
          status: 'active',
        }];
      }
      const updated = [...prev];
      const updatedMeals = [...updated[dayIdx].meals, meal];
      updated[dayIdx] = {
        ...updated[dayIdx],
        meals: updatedMeals,
        dailyTotals: computeDailyTotals(updatedMeals),
      };
      return updated;
    });
  }, [setDays]);

  const deleteMeal = useCallback((id: string) => {
    setDays(prev => {
      const activeIdx = prev.findIndex(d => d.status === 'active');
      if (activeIdx === -1) return prev;
      const updated = [...prev];
      const updatedMeals = updated[activeIdx].meals.filter(m => m.id !== id);
      updated[activeIdx] = {
        ...updated[activeIdx],
        meals: updatedMeals,
        dailyTotals: computeDailyTotals(updatedMeals),
      };
      return updated;
    });
  }, [setDays]);

  const validateDay = useCallback(() => {
    setDays(prev => {
      const activeIdx = prev.findIndex(d => d.status === 'active');
      if (activeIdx === -1) return prev;
      const day = prev[activeIdx];
      if (day.meals.length === 0) return prev;
      const dailyTotals = computeDailyTotals(day.meals);
      const score = computeScore(dailyTotals, dailyGoals);
      const updated = [...prev];
      updated[activeIdx] = {
        ...day,
        dailyTotals,
        status: 'validated',
        validatedAt: new Date().toISOString(),
        score,
      };
      return updated;
    });
  }, [setDays, dailyGoals]);

  const getDayByDate = useCallback((date: string) => {
    return days.find(d => d.date === date);
  }, [days]);

  const deleteMealFromDay = useCallback((dayId: string, mealId: string) => {
    setDays(prev => {
      const dayIdx = prev.findIndex(d => d.id === dayId);
      if (dayIdx === -1) return prev;
      const day = prev[dayIdx];
      const updatedMeals = day.meals.filter(m => m.id !== mealId);
      const dailyTotals = computeDailyTotals(updatedMeals);
      const score = day.status === 'validated' ? computeScore(dailyTotals, dailyGoals) : undefined;
      const updated = [...prev];
      updated[dayIdx] = { ...day, meals: updatedMeals, dailyTotals, ...(score ? { score } : {}) };
      return updated;
    });
  }, [setDays, dailyGoals]);

  const updateMealQuantityInDay = useCallback((dayId: string, mealId: string, foodIndex: number, newQty: number) => {
    setDays(prev => {
      const dayIdx = prev.findIndex(d => d.id === dayId);
      if (dayIdx === -1) return prev;
      const day = prev[dayIdx];
      const mealIdx = day.meals.findIndex(m => m.id === mealId);
      if (mealIdx === -1) return prev;
      const qty = Math.max(1, newQty);
      const updated = [...prev];
      const updatedMeals = [...day.meals];
      const meal = { ...updatedMeals[mealIdx] };
      const foods = [...meal.foods];
      foods[foodIndex] = { ...foods[foodIndex], qty };
      meal.foods = foods;
      meal.totals = computeMealTotals(foods);
      updatedMeals[mealIdx] = meal;
      const dailyTotals = computeDailyTotals(updatedMeals);
      const score = day.status === 'validated' ? computeScore(dailyTotals, dailyGoals) : undefined;
      updated[dayIdx] = { ...day, meals: updatedMeals, dailyTotals, ...(score ? { score } : {}) };
      return updated;
    });
  }, [setDays, dailyGoals]);

  return {
    activeDay,
    pastDays,
    allDays: days,
    addMealToDay,
    deleteMeal,
    deleteMealFromDay,
    updateMealQuantityInDay,
    validateDay,
    getDayByDate,
  };
}
