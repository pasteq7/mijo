import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { FavoriteMeal, MealRecord } from '../types';

function generateName(foods: MealRecord['foods']): string {
  const names = foods.map(sf => sf.food.name);
  const joined = names.join(', ');
  if (joined.length <= 40) return joined;
  const truncated = names.slice(0, 3).join(', ');
  const remaining = names.length - 3;
  return `${truncated}, +${remaining}`;
}

export function useFavoriteMeals() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteMeal[]>('veganut-favorites', []);

  const addFavorite = useCallback((meal: MealRecord) => {
    setFavorites(prev => {
      if (prev.some(f => f.sourceMealId === meal.id)) return prev;
      const fav: FavoriteMeal = {
        id: crypto.randomUUID(),
        sourceMealId: meal.id,
        name: generateName(meal.foods),
        foods: meal.foods,
        totals: meal.totals,
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

  return { favorites, favoriteIds, addFavorite, removeFavorite, isFavorite };
}
