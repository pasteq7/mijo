import type { MealRecord, DayRecord, NutrientGoals, NutrientKey } from '../types';

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

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export function runMigration(): boolean {
  try {
    const oldData = window.localStorage.getItem('veganut-history');
    if (!oldData) return false;

    const meals: MealRecord[] = JSON.parse(oldData);
    const grouped = new Map<string, MealRecord[]>();

    for (const meal of meals) {
      const dateKey = toDateKey(new Date(meal.date));
      const existing = grouped.get(dateKey) || [];
      existing.push(meal);
      grouped.set(dateKey, existing);
    }

    const today = toDateKey(new Date());
    const newDays: DayRecord[] = [];

    for (const [date, dayMeals] of grouped) {
      const isActive = date === today;
      newDays.push({
        id: generateId(),
        date,
        meals: dayMeals,
        dailyTotals: isActive ? {} : computeDailyTotals(dayMeals),
        status: isActive ? 'active' : 'validated',
        validatedAt: isActive ? undefined : new Date().toISOString(),
      });
    }

    const existingData = window.localStorage.getItem('veganut-days');
    const existingDays: DayRecord[] = existingData ? JSON.parse(existingData) : [];
    const merged = new Map<string, DayRecord>();

    for (const d of [...existingDays, ...newDays]) {
      merged.set(d.date, d);
    }

    window.localStorage.setItem('veganut-days', JSON.stringify([...merged.values()]));
    window.localStorage.removeItem('veganut-history');

    return true;
  } catch {
    return false;
  }
}
