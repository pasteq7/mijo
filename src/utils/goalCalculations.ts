import type { DailyGoals, MealGoals } from '../types';
import { MEAL_GOALS, multiplyGoals } from '../data/nutrients';

export type Sex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'intense';
export type CalorieTarget = 'deficit' | 'maintain' | 'gain';

export interface GoalProfile {
  age: number;
  weight: number;
  height: number;
  sex: Sex;
  activity: ActivityLevel;
  target?: CalorieTarget;
}

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sédentaire',
  light: 'Léger',
  moderate: 'Modéré',
  active: 'Actif',
  intense: 'Intense',
};

export const CALORIE_TARGET_LABELS: Record<CalorieTarget, string> = {
  deficit: 'Léger déficit',
  maintain: 'Maintien',
  gain: 'Prise douce',
};

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  intense: 1.9,
};

const CALORIE_TARGET_MULTIPLIERS: Record<CalorieTarget, number> = {
  deficit: 0.9,
  maintain: 1,
  gain: 1.1,
};

const REFERENCE_DAILY = multiplyGoals(MEAL_GOALS, 3);

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

function calculateBMR(weight: number, height: number, age: number, sex: Sex): number {
  return sex === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
}

function calculateTDEE(bmr: number, activity: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activity];
}

export function calculateGoals(profile: GoalProfile): { daily: DailyGoals; meal: MealGoals } {
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.sex);
  const maintenanceCalories = calculateTDEE(bmr, profile.activity);
  const calorieTarget = profile.target ?? 'maintain';
  const targetCalories = maintenanceCalories * CALORIE_TARGET_MULTIPLIERS[calorieTarget];
  const dailyCalories = Math.round(targetCalories / 10) * 10;
  const scaleFactor = dailyCalories / REFERENCE_DAILY.calories;

  const daily: DailyGoals = {
    calories: dailyCalories,
    proteines: round1((0.20 * dailyCalories) / 4),
    glucides: round1((0.50 * dailyCalories) / 4),
    lipides: round1((0.30 * dailyCalories) / 9),
    fibres: round1(14 * dailyCalories / 1000),
    vitA: round1(REFERENCE_DAILY.vitA * scaleFactor),
    vitC: round1(REFERENCE_DAILY.vitC * scaleFactor),
    vitB9: round1(REFERENCE_DAILY.vitB9 * scaleFactor),
    vitB6: round1(REFERENCE_DAILY.vitB6 * scaleFactor),
    vitE: round1(REFERENCE_DAILY.vitE * scaleFactor),
    vitK: round1(REFERENCE_DAILY.vitK * scaleFactor),
    fer: round1(REFERENCE_DAILY.fer * scaleFactor),
    calcium: round1(REFERENCE_DAILY.calcium * scaleFactor),
    zinc: round1(REFERENCE_DAILY.zinc * scaleFactor),
    magnesium: round1(REFERENCE_DAILY.magnesium * scaleFactor),
    selenium: round1(REFERENCE_DAILY.selenium * scaleFactor),
    omega3: round1(REFERENCE_DAILY.omega3 * scaleFactor),
    omega6: round1(REFERENCE_DAILY.omega6 * scaleFactor),
    lysine: round1(REFERENCE_DAILY.lysine * scaleFactor),
    methionine: round1(REFERENCE_DAILY.methionine * scaleFactor),
    leucine: round1(REFERENCE_DAILY.leucine * scaleFactor),
    threonine: round1(REFERENCE_DAILY.threonine * scaleFactor),
  };

  const meal: MealGoals = {
    calories: Math.round(dailyCalories / 30) * 10,
    proteines: round1(daily.proteines / 3),
    glucides: round1(daily.glucides / 3),
    lipides: round1(daily.lipides / 3),
    fibres: round1(daily.fibres / 3),
    vitA: round1(daily.vitA / 3),
    vitC: round1(daily.vitC / 3),
    vitB9: round1(daily.vitB9 / 3),
    vitB6: round1(daily.vitB6 / 3),
    vitE: round1(daily.vitE / 3),
    vitK: round1(daily.vitK / 3),
    fer: round1(daily.fer / 3),
    calcium: round1(daily.calcium / 3),
    zinc: round1(daily.zinc / 3),
    magnesium: round1(daily.magnesium / 3),
    selenium: round1(daily.selenium / 3),
    omega3: round1(daily.omega3 / 3),
    omega6: round1(daily.omega6 / 3),
    lysine: round1(daily.lysine / 3),
    methionine: round1(daily.methionine / 3),
    leucine: round1(daily.leucine / 3),
    threonine: round1(daily.threonine / 3),
  };

  return { daily, meal };
}
