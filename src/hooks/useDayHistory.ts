import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { toDateKey } from '../utils/dateHelpers';
import { createId } from '../utils/ids';
import { computeScore, recalculateDay } from '../utils/dayHistory';
import { STORAGE_KEYS } from '../utils/storageKeys';
import type { DayRecord, MealRecord, NutrientGoals } from '../types';

export function useDayHistory(dailyGoals: NutrientGoals) {
  const [days, setDays] = useLocalStorage<DayRecord[]>(
    STORAGE_KEYS.days,
    [],
  );
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const today = toDateKey(new Date());

    setDays(prev => {
      const migrated = prev.map(d => d.id ? d : { ...d, id: createId() });
      const updated = [...migrated];

      const activeIdx = updated.findIndex(d => d.status === 'active');
      if (activeIdx !== -1) {
        const activeDay = updated[activeIdx];
        if (activeDay.date !== today) {
          updated[activeIdx] = {
            ...recalculateDay(activeDay, activeDay.meals, dailyGoals),
            status: 'validated',
            validatedAt: new Date().toISOString(),
          };
        }
      }

      if (!updated.some(d => d.date === today)) {
        updated.push({
          id: createId(),
          date: today,
          meals: [],
          dailyTotals: {},
          status: 'active',
        });
      }

      return updated;
    });
  }, [setDays, dailyGoals]);

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
        const day: DayRecord = {
          id: createId(),
          date: today,
          meals: [],
          dailyTotals: {},
          status: 'active',
        };
        return [...prev, recalculateDay(day, [meal], dailyGoals)];
      }
      const updated = [...prev];
      const updatedMeals = [...updated[dayIdx].meals, meal];
      updated[dayIdx] = recalculateDay(updated[dayIdx], updatedMeals, dailyGoals);
      return updated;
    });
  }, [setDays, dailyGoals]);

  const addMealToExistingDay = useCallback((dayId: string, meal: MealRecord) => {
    setDays(prev => {
      const dayIdx = prev.findIndex(d => d.id === dayId);
      if (dayIdx === -1) return prev;

      const updated = [...prev];
      const day = updated[dayIdx];
      const updatedMeals = [...day.meals, meal];
      updated[dayIdx] = recalculateDay(day, updatedMeals, dailyGoals);
      return updated;
    });
  }, [setDays, dailyGoals]);

  const deleteMeal = useCallback((id: string) => {
    setDays(prev => {
      const activeIdx = prev.findIndex(d => d.status === 'active');
      if (activeIdx === -1) return prev;
      const updated = [...prev];
      const updatedMeals = updated[activeIdx].meals.filter(m => m.id !== id);
      updated[activeIdx] = recalculateDay(updated[activeIdx], updatedMeals, dailyGoals);
      return updated;
    });
  }, [setDays, dailyGoals]);

  const validateDay = useCallback(() => {
    setDays(prev => {
      const activeIdx = prev.findIndex(d => d.status === 'active');
      if (activeIdx === -1) return prev;
      const day = prev[activeIdx];
      if (day.meals.length === 0) return prev;
      const recalculatedDay = recalculateDay(day, day.meals, dailyGoals);
      const dailyTotals = recalculatedDay.dailyTotals;
      const score = computeScore(dailyTotals, dailyGoals);
      const updated = [...prev];
      updated[activeIdx] = {
        ...recalculatedDay,
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
      const updated = [...prev];
      updated[dayIdx] = recalculateDay(day, updatedMeals, dailyGoals);
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
      updatedMeals[mealIdx] = meal;
      updated[dayIdx] = recalculateDay(day, updatedMeals, dailyGoals);
      return updated;
    });
  }, [setDays, dailyGoals]);

  const updateMealInDay = useCallback((dayId: string, mealId: string, meal: MealRecord) => {
    setDays(prev => {
      const dayIdx = prev.findIndex(d => d.id === dayId);
      if (dayIdx === -1) return prev;
      const day = prev[dayIdx];
      const mealIdx = day.meals.findIndex(m => m.id === mealId);
      if (mealIdx === -1) return prev;

      const updated = [...prev];
      const updatedMeals = [...day.meals];
      const updatedMeal = {
        ...meal,
        id: mealId,
      };
      updatedMeals[mealIdx] = updatedMeal;
      updated[dayIdx] = recalculateDay(day, updatedMeals, dailyGoals);
      return updated;
    });
  }, [setDays, dailyGoals]);

  return {
    activeDay,
    pastDays,
    allDays: days,
    addMealToDay,
    addMealToExistingDay,
    deleteMeal,
    deleteMealFromDay,
    updateMealQuantityInDay,
    updateMealInDay,
    validateDay,
    getDayByDate,
  };
}
