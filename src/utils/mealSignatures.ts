import type { SelectedFood } from '../types';

export function getFoodsSignature(foods: SelectedFood[]): string {
  return foods
    .map((sf) => `${sf.food.id}:${sf.qty}`)
    .sort()
    .join('|');
}
