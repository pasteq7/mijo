import type { Food } from '../../types';

export const autres: Food[] = [
  {
    id: 'levure_maltee', name: 'Levure maltée enrichie', emoji: '🟡',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 15,
    per100g: {
      calories: 325, proteines: 50, glucides: 37, lipides: 5, fibres: 25,
      vitB12: 17.6, vitB9: 2340, vitB6: 9.3, vitE: 0,
      zinc: 9, fer: 3, magnesium: 110,
      lysine: 3.1, methionine: 0.7, leucine: 3.2, threonine: 2.1,
    },
  },
  {
    id: 'lait_vegetal', name: 'Lait végétal enrichi', emoji: '🥛',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 250,
    per100g: {
      calories: 47, proteines: 1.5, glucides: 6.3, lipides: 1.8, fibres: 0.5,
      vitB12: 0.38, vitD: 0.75, calcium: 120, iode: 22,
      vitB9: 4,
    },
  },
  {
    id: 'chocolat_noir', name: 'Chocolat noir 70%', emoji: '🍫',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 20,
    per100g: {
      calories: 598, proteines: 7.8, glucides: 46, lipides: 43, fibres: 11,
      fer: 11.9, calcium: 73, magnesium: 228, zinc: 3.3,
      vitE: 0.59,
      omega3: 0.03, omega6: 1.22,
    },
  },
  {
    id: 'huile_colza', name: 'Huile de colza', emoji: '🫙',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 15,
    per100g: {
      calories: 884, proteines: 0, glucides: 0, lipides: 100, fibres: 0,
      vitE: 17.5, vitK: 71,
      omega3: 9.1, omega6: 18.6,
    },
  },
];
