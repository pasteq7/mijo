import type { Food } from '../../types';

export const legumineuses: Food[] = [
  {
    id: 'lentilles_vertes', name: 'Lentilles vertes', emoji: '🫘',
    category: 'légumineuses', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 50,
    per100g: {
      calories: 116, proteines: 9, glucides: 20, lipides: 0.4, fibres: 8,
      fer: 3.3, calcium: 19, zinc: 1.3, magnesium: 36, selenium: 5,
      vitC: 1.5, vitB9: 181, vitB6: 0.18, vitK: 5,
      omega3: 0.11, lysine: 0.62, methionine: 0.08, leucine: 0.62, threonine: 0.38,
    },
  },
  {
    id: 'lentilles_corail', name: 'Lentilles corail', emoji: '🟠',
    category: 'légumineuses', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 50,
    per100g: {
      calories: 114, proteines: 8.5, glucides: 21, lipides: 0.4, fibres: 6,
      fer: 3.0, calcium: 16, zinc: 1.2, magnesium: 33, selenium: 5,
      vitB9: 170, vitB6: 0.15,
      lysine: 0.58, methionine: 0.07, leucine: 0.60, threonine: 0.35,
    },
  },
  {
    id: 'pois_chiches', name: 'Pois chiches', emoji: '🟡',
    category: 'légumineuses', seasons: ['printemps', 'ete', 'automne'],
    unit: 'g', defaultQty: 50,
    per100g: {
      calories: 164, proteines: 8.9, glucides: 27, lipides: 2.6, fibres: 7.6,
      fer: 2.9, calcium: 49, zinc: 1.5, magnesium: 48, selenium: 8.2,
      vitC: 1.3, vitB9: 172, vitB6: 0.14,
      omega3: 0.1, lysine: 0.52, methionine: 0.09, leucine: 0.58, threonine: 0.32,
    },
  },
  {
    id: 'haricots_rouges', name: 'Haricots rouges', emoji: '🫘',
    category: 'légumineuses', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 50,
    per100g: {
      calories: 127, proteines: 8.7, glucides: 22, lipides: 0.5, fibres: 8.7,
      fer: 2.9, calcium: 40, zinc: 1.1, magnesium: 45, selenium: 3.2,
      vitB9: 193, vitB6: 0.12,
      lysine: 0.56, methionine: 0.07, leucine: 0.64, threonine: 0.35,
    },
  },
  {
    id: 'edamame', name: 'Edamame', emoji: '💚',
    category: 'légumineuses', seasons: ['ete', 'automne'],
    unit: 'g', defaultQty: 100,
    per100g: {
      calories: 121, proteines: 11, glucides: 8.9, lipides: 5.2, fibres: 5,
      fer: 2.3, calcium: 60, zinc: 1.4, magnesium: 64, selenium: 1.5,
      vitC: 6.1, vitB9: 311, vitK: 26,
      omega3: 0.3, lysine: 0.62, methionine: 0.14, leucine: 0.81, threonine: 0.43,
    },
  },
  {
    id: 'tofu', name: 'Tofu ferme', emoji: '⬜',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 50,
    per100g: {
      calories: 76, proteines: 8, glucides: 1.9, lipides: 4.8, fibres: 0.3,
      fer: 1.8, calcium: 350, zinc: 0.8, magnesium: 30, selenium: 17.4,
      vitB9: 15, omega3: 0.3,
      lysine: 0.53, methionine: 0.1, leucine: 0.61, threonine: 0.33,
    },
  },
  {
    id: 'tempeh', name: 'Tempeh', emoji: '🟫',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 100,
    per100g: {
      calories: 195, proteines: 19, glucides: 9.4, lipides: 11, fibres: 0,
      fer: 2.7, calcium: 111, zinc: 1.7, magnesium: 81, selenium: 8.8,
      lysine: 0.91, methionine: 0.19, leucine: 1.25, threonine: 0.65,
    },
  },
  {
    id: 'haricots_blancs', name: 'Haricots blancs', emoji: '🫘',
    category: 'légumineuses', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 50,
    per100g: {
      calories: 139, proteines: 9.7, glucides: 25, lipides: 0.4, fibres: 6.3,
      fer: 3.7, calcium: 90, magnesium: 63, zinc: 1.4, selenium: 12.8,
      vitB9: 130,
      lysine: 0.65, methionine: 0.1, leucine: 0.77, threonine: 0.41,
    },
  },
  {
    id: 'petits_pois', name: 'Petits pois', emoji: '🫛',
    category: 'légumineuses', seasons: ['printemps', 'ete'],
    unit: 'g', defaultQty: 50,
    per100g: {
      calories: 81, proteines: 5.4, glucides: 14, lipides: 0.4, fibres: 5.1,
      fer: 1.5, calcium: 25, magnesium: 33, zinc: 1.2, selenium: 1.8,
      vitC: 40, vitK: 24.8, vitB9: 65,
      lysine: 0.38, methionine: 0.05, leucine: 0.4, threonine: 0.22,
    },
  },
];
