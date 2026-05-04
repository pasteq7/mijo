export interface NutrientMeta {
  id: string;
  label: string;
  unit: string;
  group: 'macros' | 'vitamines' | 'mineraux' | 'acidesgras' | 'aminoacides';
  veganAlert?: boolean;
  tooltip: string;
  tip?: string;
}

export interface NutrientGoals {
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
  fibres: number;
  vitA: number;
  vitC: number;
  vitB9: number;
  vitB6: number;
  vitE: number;
  vitK: number;
  fer: number;
  calcium: number;
  zinc: number;
  magnesium: number;
  selenium: number;
  omega3: number;
  omega6: number;
  lysine: number;
  methionine: number;
  leucine: number;
  threonine: number;
}

export type NutrientKey = keyof NutrientGoals;
export type DailyGoals = NutrientGoals;
export type MealGoals = NutrientGoals;

export type Season = 'printemps' | 'ete' | 'automne' | 'hiver';
export type FoodCategory =
  | 'légumineuses'
  | 'céréales'
  | 'légumes'
  | 'fruits'
  | 'graines & noix'
  | 'boissons'
  | 'autres';

export interface Food {
  id: string;
  name: string;
  emoji: string;
  category: FoodCategory;
  seasons: Season[];
  unit: string;
  defaultQty: number;
  per100g: Partial<NutrientGoals>;
}

export interface SelectedFood {
  food: Food;
  qty: number;
}

export interface MealRecord {
  id: string;
  date: string;
  foods: SelectedFood[];
  totals: Partial<NutrientGoals>;
}

export interface FavoriteMeal {
  id: string;
  sourceMealId: string;
  name: string;
  foods: SelectedFood[];
  totals: Partial<NutrientGoals>;
  createdAt: string;
}

export interface DayScore {
  caloriesPct: number;
  proteinPct: number;
  microCoverage: number;
  label: string;
}

export interface DayRecord {
  id: string;
  date: string;
  meals: MealRecord[];
  dailyTotals: Partial<NutrientGoals>;
  status: 'active' | 'validated';
  validatedAt?: string;
  score?: DayScore;
}

export interface Insight {
  condition: (totals: Partial<NutrientGoals>, goals: NutrientGoals) => boolean;
  message: string;
  icon: string;
  type?: 'warning' | 'success' | 'info';
}