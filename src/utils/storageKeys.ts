export const STORAGE_KEYS = {
  selectedFoods: 'mijo-foods',
  dailyGoals: 'mijo-daily-goals',
  mealGoals: 'mijo-meal-goals',
  goalProfile: 'mijo-goal-profile',
  days: 'mijo-days',
  favorites: 'mijo-favorites',
  theme: 'mijo-theme',
  language: 'mijo-lang',
  tooltipMode: 'mijo-tooltip-mode',
} as const;

export const BACKUP_STORAGE_KEYS = [
  STORAGE_KEYS.selectedFoods,
  STORAGE_KEYS.dailyGoals,
  STORAGE_KEYS.mealGoals,
  STORAGE_KEYS.goalProfile,
  STORAGE_KEYS.days,
  STORAGE_KEYS.favorites,
  STORAGE_KEYS.theme,
  STORAGE_KEYS.language,
  STORAGE_KEYS.tooltipMode,
] as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
