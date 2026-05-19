import type { Food } from '../../types';

export const autres: Food[] = [
  {
    id: 'lait_vegetal', name: 'Lait végétal enrichi', emoji: '🥛',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 250,
    per100g: {
      calories: 47, proteines: 1.5, glucides: 6.3, lipides: 1.8, fibres: 0.5,
      calcium: 120,
      vitB9: 4,
    },
  },
  {
    id: 'chocolat_noir', name: 'Chocolat noir 70%', emoji: '🍫',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 20,
    per100g: {
      calories: 598, proteines: 7.8, glucides: 46, lipides: 43, fibres: 11,
      fer: 11.9, calcium: 73, magnesium: 228, zinc: 3.3, selenium: 6.8,
      vitE: 0.59,
      omega3: 0.03, omega6: 1.22,
    },
  },
  {
    id: 'huile_olive', name: 'Huile d\'olive', emoji: '🫒',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 15,
    per100g: {
      calories: 884, proteines: 0, glucides: 0, lipides: 100, fibres: 0,
      vitE: 14, vitK: 60,
      omega3: 0.8, omega6: 10,
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
  {
    id: 'jus_citron', name: 'Jus de citron', emoji: '🍋',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 30,
    per100g: {
      calories: 22, proteines: 0.4, glucides: 6.9, lipides: 0.2, fibres: 0.3,
      vitC: 44, vitB9: 13,
    },
  },
  {
    id: 'moutarde', name: 'Moutarde', emoji: '🟡',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 10,
    per100g: {
      calories: 66, proteines: 3.7, glucides: 5.8, lipides: 3.3, fibres: 2.9,
      calcium: 60, magnesium: 50, fer: 1.6, zinc: 0.6, selenium: 20.8,
    },
  },
  {
    id: 'sauce_tomate', name: 'Sauce tomate', emoji: '🍅',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 25,
    per100g: {
      calories: 137, proteines: 2.8, glucides: 14, lipides: 7.3, fibres: 2,
    },
  },
  {
    id: 'steak_vegetal', name: 'Steak végétal', emoji: '🥩',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 80,
    per100g: {
      calories: 224, proteines: 17, glucides: 12, lipides: 11, fibres: 4.6, selenium: 15,
    },
  },
  {
    id: 'biscuit_tous', name: 'Biscuit (Oreo, Prince, Kinder...)', emoji: '🍪',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 20,
    per100g: {
      calories: 480, proteines: 6, glucides: 65, lipides: 22, fibres: 2,
      fer: 4, calcium: 50, magnesium: 40, zinc: 1, selenium: 5,
      vitE: 1,
      omega3: 0.1, omega6: 1.5,
    },
  },
  {
    id: 'chips', name: 'Chips de pomme de terre', emoji: '🥔',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 536, proteines: 7, glucides: 49, lipides: 35, fibres: 4.8,
      fer: 1.8, calcium: 24, magnesium: 67, zinc: 1.1, selenium: 4,
      vitE: 3.1, vitC: 4,
      omega3: 0.3, omega6: 9.5,
    },
  },
  {
    id: 'oeuf', name: 'Oeuf', emoji: '🥚',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 60,
    per100g: {
      calories: 143, proteines: 12.6, glucides: 0.7, lipides: 9.5, fibres: 0,
      fer: 1.8, calcium: 56, magnesium: 12, zinc: 1.3, selenium: 30.7,
      vitA: 160, vitB9: 47, vitB6: 0.17, vitE: 1.1, vitK: 0.3,
      omega3: 0.07, omega6: 1.2,
      lysine: 0.91, methionine: 0.38, leucine: 1.08, threonine: 0.61,
    },
  },
  {
    id: 'miel', name: 'Miel', emoji: '🍯',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 15,
    per100g: {
      calories: 304, proteines: 0.3, glucides: 82, lipides: 0, fibres: 0.2,
      fer: 0.4, calcium: 6, magnesium: 2, zinc: 0.2,
      vitC: 0.5, vitB9: 2,
    },
  },
  {
    id: 'yaourt_grec', name: 'Yaourt grec', emoji: '🥛',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 125,
    per100g: {
      calories: 97, proteines: 9, glucides: 3.6, lipides: 5, fibres: 0,
      fer: 0.1, calcium: 110, magnesium: 11, zinc: 0.5, selenium: 9.7,
      vitA: 27, vitB9: 7, vitB6: 0.05,
      lysine: 0.75, methionine: 0.24, leucine: 0.9, threonine: 0.42,
    },
  },
  {
    id: 'fromage_blanc', name: 'Fromage blanc', emoji: '🥛',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 125,
    per100g: {
      calories: 76, proteines: 7.5, glucides: 4, lipides: 3.2, fibres: 0,
      fer: 0.1, calcium: 120, magnesium: 10, zinc: 0.5, selenium: 8,
      vitA: 35, vitB9: 10, vitB6: 0.04,
      lysine: 0.67, methionine: 0.21, leucine: 0.78, threonine: 0.38,
    },
  },
  {
    id: 'emmental', name: 'Emmental', emoji: '🧀',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 380, proteines: 28, glucides: 0.5, lipides: 29, fibres: 0,
      fer: 0.3, calcium: 970, magnesium: 30, zinc: 4.6, selenium: 14.5,
      vitA: 265, vitB9: 10, vitB6: 0.08, vitE: 0.3, vitK: 2.3,
      omega3: 0.25, omega6: 0.7,
      lysine: 2.4, methionine: 0.8, leucine: 2.7, threonine: 1.2,
    },
  },
];
