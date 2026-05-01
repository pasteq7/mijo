export interface NutrientMeta {
  id: string;
  label: string;
  unit: string;
  group: 'macros' | 'vitamines' | 'mineraux' | 'acidesgras' | 'aminoacides';
  veganAlert?: boolean;
  tooltip: string;
  tip?: string;
}

export interface DailyGoals {
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
  fibres: number;
  vitB12: number;
  vitD: number;
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
  iode: number;
  selenium: number;
  omega3: number;
  omega6: number;
  lysine: number;
  methionine: number;
  leucine: number;
  threonine: number;
}

export type NutrientKey = keyof DailyGoals;

export type Season = 'printemps' | 'ete' | 'automne' | 'hiver';
export type FoodCategory =
  | 'légumineuses'
  | 'céréales'
  | 'légumes'
  | 'fruits'
  | 'graines & noix'
  | 'autres';

export interface Food {
  id: string;
  name: string;
  emoji: string;
  category: FoodCategory;
  seasons: Season[];
  unit: string;
  defaultQty: number;
  per100g: Partial<DailyGoals>;
}

export interface SelectedFood {
  food: Food;
  qty: number;
}

export interface Insight {
  condition: (totals: Partial<DailyGoals>, goals: DailyGoals) => boolean;
  message: string;
  icon: string;
}