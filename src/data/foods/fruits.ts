import type { Food } from '../../types';

export const fruits: Food[] = [
  {
    id: 'pomme', name: 'Pomme', emoji: '🍎',
    category: 'fruits', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 52, proteines: 0.3, glucides: 14, lipides: 0.2, fibres: 2.4,
      fer: 0.1, vitC: 4.6, vitK: 2.2,
    },
  },
  {
    id: 'orange', name: 'Orange', emoji: '🍊',
    category: 'fruits', seasons: ['hiver', 'printemps'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 47, proteines: 0.9, glucides: 12, lipides: 0.1, fibres: 2.4,
      fer: 0.1, calcium: 40,
      vitC: 53, vitB9: 30, vitA: 11,
    },
  },
  {
    id: 'banane', name: 'Banane', emoji: '🍌',
    category: 'fruits', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 120,
    per100g: {
      calories: 89, proteines: 1.1, glucides: 23, lipides: 0.3, fibres: 2.6,
      fer: 0.3, magnesium: 27,
      vitC: 8.7, vitB6: 0.37, vitB9: 20,
    },
  },
  {
    id: 'myrtilles', name: 'Myrtilles', emoji: '🫐',
    category: 'fruits', seasons: ['ete'],
    unit: 'g', defaultQty: 100,
    per100g: {
      calories: 57, proteines: 0.7, glucides: 14, lipides: 0.3, fibres: 2.4,
      fer: 0.3, calcium: 6,
      vitC: 9.7, vitK: 19, vitE: 0.57,
    },
  },
  {
    id: 'avocat', name: 'Avocat', emoji: '🥑',
    category: 'fruits', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 100,
    per100g: {
      calories: 160, proteines: 2, glucides: 9, lipides: 15, fibres: 7,
      fer: 0.6, calcium: 12, magnesium: 29,
      vitC: 10, vitB9: 81, vitK: 21, vitE: 2.1,
      omega3: 0.11, omega6: 1.75,
    },
  },
  {
    id: 'fraise', name: 'Fraise', emoji: '🍓',
    category: 'fruits', seasons: ['printemps', 'ete'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 32, proteines: 0.7, glucides: 7.7, lipides: 0.3, fibres: 2,
      fer: 0.4, calcium: 16, magnesium: 13,
      vitC: 58.8, vitB9: 24,
    },
  },
  {
    id: 'kiwi', name: 'Kiwi', emoji: '🥝',
    category: 'fruits', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 100,
    per100g: {
      calories: 61, proteines: 1.1, glucides: 15, lipides: 0.5, fibres: 3,
      fer: 0.3, calcium: 34, magnesium: 17,
      vitC: 92.7, vitK: 40.3, vitE: 1.5,
    },
  },
  {
    id: 'poire', name: 'Poire', emoji: '🍐',
    category: 'fruits', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 57, proteines: 0.4, glucides: 15, lipides: 0.1, fibres: 3.1,
      fer: 0.2, calcium: 9, magnesium: 7,
      vitC: 4.3, vitK: 4.4,
    },
  },
  {
    id: 'raisin', name: 'Raisin', emoji: '🍇',
    category: 'fruits', seasons: ['ete', 'automne'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 69, proteines: 0.7, glucides: 18, lipides: 0.2, fibres: 0.9,
      fer: 0.4, calcium: 10, magnesium: 7,
      vitC: 3.2, vitK: 14.6,
    },
  },
];
