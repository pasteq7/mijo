import type { Food } from '../types';

export const FOODS: Food[] = [
  // LÉGUMINEUSES
  {
    id: 'lentilles_vertes', name: 'Lentilles vertes', emoji: '🫘',
    category: 'légumineuses', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 116, proteines: 9, glucides: 20, lipides: 0.4, fibres: 8,
      fer: 3.3, calcium: 19, zinc: 1.3, magnesium: 36,
      vitC: 1.5, vitB9: 181, vitB6: 0.18, vitK: 5,
      omega3: 0.11, lysine: 0.62, methionine: 0.08, leucine: 0.62, threonine: 0.38,
    },
  },
  {
    id: 'lentilles_corail', name: 'Lentilles corail', emoji: '🟠',
    category: 'légumineuses', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 114, proteines: 8.5, glucides: 21, lipides: 0.4, fibres: 6,
      fer: 3.0, calcium: 16, zinc: 1.2, magnesium: 33,
      vitB9: 170, vitB6: 0.15,
      lysine: 0.58, methionine: 0.07, leucine: 0.60, threonine: 0.35,
    },
  },
  {
    id: 'pois_chiches', name: 'Pois chiches', emoji: '🟡',
    category: 'légumineuses', seasons: ['printemps', 'ete', 'automne'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 164, proteines: 8.9, glucides: 27, lipides: 2.6, fibres: 7.6,
      fer: 2.9, calcium: 49, zinc: 1.5, magnesium: 48,
      vitC: 1.3, vitB9: 172, vitB6: 0.14,
      omega3: 0.1, lysine: 0.52, methionine: 0.09, leucine: 0.58, threonine: 0.32,
    },
  },
  {
    id: 'haricots_rouges', name: 'Haricots rouges', emoji: '🫘',
    category: 'légumineuses', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 127, proteines: 8.7, glucides: 22, lipides: 0.5, fibres: 8.7,
      fer: 2.9, calcium: 40, zinc: 1.1, magnesium: 45,
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
      fer: 2.3, calcium: 60, zinc: 1.4, magnesium: 64,
      vitC: 6.1, vitB9: 311, vitK: 26,
      omega3: 0.3, lysine: 0.62, methionine: 0.14, leucine: 0.81, threonine: 0.43,
    },
  },
  {
    id: 'tofu', name: 'Tofu ferme', emoji: '⬜',
    category: 'autres', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 76, proteines: 8, glucides: 1.9, lipides: 4.8, fibres: 0.3,
      fer: 1.8, calcium: 350, zinc: 0.8, magnesium: 30,
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
      vitB12: 0.1, fer: 2.7, calcium: 111, zinc: 1.7, magnesium: 81,
      lysine: 0.91, methionine: 0.19, leucine: 1.25, threonine: 0.65,
    },
  },

  // CÉRÉALES
  {
    id: 'flocons_avoine', name: 'Flocons d\'avoine', emoji: '🌾',
    category: 'céréales', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 80,
    per100g: {
      calories: 370, proteines: 13, glucides: 60, lipides: 7, fibres: 10,
      fer: 4.7, magnesium: 138, zinc: 3.5,
      vitB6: 0.1, vitB9: 26,
      omega3: 0.11, omega6: 2.4,
      lysine: 0.41, methionine: 0.17, leucine: 0.98, threonine: 0.44,
    },
  },
  {
    id: 'quinoa', name: 'Quinoa', emoji: '⚪',
    category: 'céréales', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 100,
    per100g: {
      calories: 368, proteines: 14, glucides: 57, lipides: 6, fibres: 7,
      fer: 4.6, calcium: 47, magnesium: 197, zinc: 3.1,
      vitB9: 184, vitB6: 0.49, vitE: 2.4,
      omega3: 0.26, omega6: 2.98,
      lysine: 0.77, methionine: 0.31, leucine: 0.84, threonine: 0.42,
    },
  },
  {
    id: 'riz_complet', name: 'Riz complet', emoji: '🍚',
    category: 'céréales', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 362, proteines: 7.5, glucides: 76, lipides: 2.2, fibres: 3.5,
      fer: 1.5, magnesium: 110, zinc: 2,
      vitB6: 0.51, vitB9: 20,
      lysine: 0.26, methionine: 0.18, leucine: 0.58, threonine: 0.26,
    },
  },
  {
    id: 'sarrasin', name: 'Sarrasin', emoji: '🟤',
    category: 'céréales', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 100,
    per100g: {
      calories: 343, proteines: 13, glucides: 71, lipides: 3.4, fibres: 10,
      fer: 2.2, calcium: 18, magnesium: 231, zinc: 2.4,
      vitB9: 30, vitB6: 0.21,
      lysine: 0.67, methionine: 0.17, leucine: 0.67, threonine: 0.51,
    },
  },
  {
    id: 'pain_complet', name: 'Pain complet', emoji: '🍞',
    category: 'céréales', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 80,
    per100g: {
      calories: 240, proteines: 9, glucides: 45, lipides: 2.5, fibres: 6,
      fer: 2.5, magnesium: 76, zinc: 1.8,
      vitB9: 22, vitB6: 0.1,
      lysine: 0.22, methionine: 0.15, leucine: 0.65, threonine: 0.29,
    },
  },
  {
    id: 'pates_completes', name: 'Pâtes complètes', emoji: '🍝',
    category: 'céréales', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 352, proteines: 13, glucides: 68, lipides: 2.5, fibres: 8,
      fer: 3.2, magnesium: 60, zinc: 1.4,
      vitB9: 18, vitB6: 0.2,
      lysine: 0.27, methionine: 0.18, leucine: 0.82, threonine: 0.38,
    },
  },

  // LÉGUMES
  {
    id: 'epinards', name: 'Épinards', emoji: '🥬',
    category: 'légumes', seasons: ['printemps', 'automne', 'hiver'],
    unit: 'g', defaultQty: 100,
    per100g: {
      calories: 23, proteines: 2.9, glucides: 3.6, lipides: 0.4, fibres: 2.2,
      fer: 2.7, calcium: 99, magnesium: 87, zinc: 0.5,
      vitC: 28, vitA: 469, vitB9: 194, vitK: 483, vitE: 2,
      omega3: 0.14,
    },
  },
  {
    id: 'brocoli', name: 'Brocoli', emoji: '🥦',
    category: 'légumes', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 35, proteines: 2.8, glucides: 7, lipides: 0.4, fibres: 2.6,
      fer: 0.7, calcium: 47, magnesium: 21, zinc: 0.4,
      vitC: 89, vitA: 31, vitB9: 63, vitK: 102, vitB6: 0.18,
    },
  },
  {
    id: 'chou_kale', name: 'Chou kale', emoji: '🥗',
    category: 'légumes', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 80,
    per100g: {
      calories: 35, proteines: 2.9, glucides: 4.4, lipides: 1.5, fibres: 4.1,
      fer: 1.5, calcium: 254, magnesium: 47, zinc: 0.6,
      vitC: 120, vitA: 500, vitB9: 141, vitK: 705, vitE: 1.5,
      omega3: 0.18,
    },
  },
  {
    id: 'patate_douce', name: 'Patate douce', emoji: '🍠',
    category: 'légumes', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 200,
    per100g: {
      calories: 86, proteines: 1.6, glucides: 20, lipides: 0.1, fibres: 3,
      fer: 0.6, calcium: 30, magnesium: 25, zinc: 0.3,
      vitC: 2.4, vitA: 709, vitB9: 11, vitB6: 0.3, vitE: 0.26,
    },
  },
  {
    id: 'carotte', name: 'Carotte', emoji: '🥕',
    category: 'légumes', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 41, proteines: 0.9, glucides: 9.6, lipides: 0.2, fibres: 2.8,
      fer: 0.3, calcium: 33, magnesium: 12,
      vitC: 5.9, vitA: 835, vitB9: 19, vitK: 13.2,
    },
  },
  {
    id: 'champignons', name: 'Champignons de Paris', emoji: '🍄',
    category: 'légumes', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 22, proteines: 3.1, glucides: 3.3, lipides: 0.3, fibres: 1,
      fer: 0.5, zinc: 0.5, magnesium: 9,
      vitD: 0.2, vitB9: 17, vitB6: 0.1,
    },
  },
  {
    id: 'courgette', name: 'Courgette', emoji: '🥒',
    category: 'légumes', seasons: ['ete'],
    unit: 'g', defaultQty: 200,
    per100g: {
      calories: 17, proteines: 1.2, glucides: 3.1, lipides: 0.3, fibres: 1,
      fer: 0.4, calcium: 16, magnesium: 18,
      vitC: 17, vitB9: 24, vitK: 4.3,
    },
  },
  {
    id: 'betterave', name: 'Betterave', emoji: '🟣',
    category: 'légumes', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 43, proteines: 1.6, glucides: 9.6, lipides: 0.2, fibres: 2.8,
      fer: 0.8, calcium: 16, magnesium: 23,
      vitC: 4.9, vitB9: 109,
    },
  },
  {
    id: 'poireau', name: 'Poireau', emoji: '🧅',
    category: 'légumes', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 61, proteines: 1.5, glucides: 14, lipides: 0.3, fibres: 1.8,
      fer: 2.1, calcium: 59, magnesium: 28,
      vitC: 12, vitA: 83, vitB9: 64, vitK: 47,
    },
  },

  // FRUITS
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

  // GRAINES & NOIX
  {
    id: 'graines_chia', name: 'Graines de chia', emoji: '⚫',
    category: 'graines & noix', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 20,
    per100g: {
      calories: 486, proteines: 17, glucides: 42, lipides: 31, fibres: 34,
      fer: 7.7, calcium: 631, magnesium: 335, zinc: 4.6,
      vitB9: 49,
      omega3: 17.8, omega6: 5.8,
      lysine: 0.97, methionine: 0.59, leucine: 1.37, threonine: 0.72,
    },
  },
  {
    id: 'graines_lin', name: 'Graines de lin', emoji: '🟤',
    category: 'graines & noix', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 15,
    per100g: {
      calories: 534, proteines: 18, glucides: 29, lipides: 42, fibres: 27,
      fer: 5.7, calcium: 255, magnesium: 392, zinc: 4.3,
      omega3: 22.8, omega6: 5.9,
      lysine: 0.86, methionine: 0.37, leucine: 1.24, threonine: 0.77,
    },
  },
  {
    id: 'amandes', name: 'Amandes', emoji: '🟤',
    category: 'graines & noix', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 579, proteines: 21, glucides: 22, lipides: 50, fibres: 12.5,
      fer: 3.7, calcium: 264, magnesium: 270, zinc: 3.1,
      vitE: 25.6, vitB9: 44, vitB6: 0.14,
      omega3: 0.0, omega6: 12.3,
      lysine: 0.58, methionine: 0.16, leucine: 1.49, threonine: 0.6,
    },
  },
  {
    id: 'noix', name: 'Noix', emoji: '🥜',
    category: 'graines & noix', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 654, proteines: 15, glucides: 14, lipides: 65, fibres: 6.7,
      fer: 2.9, calcium: 98, magnesium: 158, zinc: 3.1,
      vitB9: 98, vitB6: 0.54, vitE: 0.7,
      omega3: 9.1, omega6: 38.1,
      lysine: 0.42, methionine: 0.24, leucine: 1.17, threonine: 0.6,
    },
  },
  {
    id: 'noix_bresil', name: 'Noix du Brésil', emoji: '🟤',
    category: 'graines & noix', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 10,
    per100g: {
      calories: 656, proteines: 14, glucides: 12, lipides: 66, fibres: 7.5,
      fer: 2.4, calcium: 160, magnesium: 376, zinc: 4.1, selenium: 1917,
      vitE: 5.7, vitB9: 22,
      omega3: 0.05, omega6: 20.6,
      lysine: 0.49, methionine: 1.01, leucine: 1.16, threonine: 0.36,
    },
  },
  {
    id: 'graines_courge', name: 'Graines de courge', emoji: '🌰',
    category: 'graines & noix', seasons: ['automne'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 559, proteines: 30, glucides: 11, lipides: 49, fibres: 6,
      fer: 8.8, calcium: 46, magnesium: 592, zinc: 7.8,
      vitK: 7.3,
      omega3: 0.12, omega6: 20.7,
      lysine: 1.24, methionine: 0.6, leucine: 2.42, threonine: 0.98,
    },
  },
  {
    id: 'sesame', name: 'Graines de sésame', emoji: '⬜',
    category: 'graines & noix', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 15,
    per100g: {
      calories: 573, proteines: 17, glucides: 23, lipides: 50, fibres: 12,
      fer: 14.6, calcium: 975, magnesium: 351, zinc: 7.8,
      vitB9: 97, vitB6: 0.79, vitE: 0.25,
      omega3: 0.38, omega6: 21.4,
      lysine: 0.57, methionine: 0.59, leucine: 1.36, threonine: 0.73,
    },
  },

  // AUTRES
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