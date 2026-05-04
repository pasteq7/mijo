import type { FoodCategory } from '../types';

export const CATEGORY_COLORS: Record<FoodCategory, string> = {
  'légumineuses': '#bf905aff',
  'céréales': '#accf6aff',
  'légumes': '#6DA85C',
  'fruits': '#E07858',
  'graines & noix': '#8d498aff',
  'boissons': '#68ACBE',
  'autres': '#87aa88ff',
};

export function getCategoryColor(category: FoodCategory): string {
  return CATEGORY_COLORS[category];
}
