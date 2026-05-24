import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { createId } from '../utils/ids';
import { STORAGE_KEYS } from '../utils/storageKeys';
import type { FavoriteMeal, MealRecord, SelectedFood, NutrientGoals } from '../types';

function generateName(foods: MealRecord['foods']): string {
  const names = foods.map(sf => sf.food.name);
  const joined = names.join(', ');
  if (joined.length <= 40) return joined;
  const truncated = names.slice(0, 3).join(', ');
  const remaining = names.length - 3;
  return `${truncated}, +${remaining}`;
}

export function useFavoriteMeals() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteMeal[]>(
    STORAGE_KEYS.favorites,
    [],
  );

  const addFavorite = useCallback((meal: MealRecord) => {
    setFavorites(prev => {
      if (prev.some(f => f.sourceMealId === meal.id)) return prev;
      const fav: FavoriteMeal = {
        id: createId(),
        sourceMealId: meal.id,
        name: generateName(meal.foods),
        foods: meal.foods,
        totals: meal.totals,
        createdAt: new Date().toISOString(),
      };
      return [fav, ...prev];
    });
  }, [setFavorites]);

  const addFavoriteFromSelection = useCallback((foods: SelectedFood[], totals: Partial<NutrientGoals>) => {
    setFavorites(prev => {
      const fav: FavoriteMeal = {
        id: createId(),
        sourceMealId: `selection-${createId()}`,
        name: generateName(foods),
        foods,
        totals,
        createdAt: new Date().toISOString(),
      };
      return [fav, ...prev];
    });
  }, [setFavorites]);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  }, [setFavorites]);

  const isFavorite = useCallback((sourceMealId: string) => {
    return favorites.some(f => f.sourceMealId === sourceMealId);
  }, [favorites]);

  const favoriteIds = new Set(favorites.map(f => f.sourceMealId));

  return { favorites, favoriteIds, addFavorite, addFavoriteFromSelection, removeFavorite, isFavorite };
}
