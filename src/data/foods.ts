import type { Food } from '../types';
import { legumineuses } from './foods/legumineuses';
import { cereales } from './foods/cereales';
import { legumes } from './foods/legumes';
import { fruits } from './foods/fruits';
import { graines_noix } from './foods/graines_noix';
import { autres } from './foods/autres';

export const FOODS: Food[] = [
  ...legumineuses,
  ...cereales,
  ...legumes,
  ...fruits,
  ...graines_noix,
  ...autres,
];