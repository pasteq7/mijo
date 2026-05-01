import type { Food } from '../../types';

export const cereales: Food[] = [
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
  {
    id: 'mais', name: 'Maïs', emoji: '🌽',
    category: 'céréales', seasons: ['ete', 'automne'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 86, proteines: 3.2, glucides: 19, lipides: 1.2, fibres: 2.7,
      fer: 0.5, magnesium: 37, zinc: 0.5,
      vitC: 6.8, vitB9: 42,
      lysine: 0.14, methionine: 0.06, leucine: 0.35, threonine: 0.13,
    },
  },
  {
    id: 'boulgour', name: 'Boulgour', emoji: '🌾',
    category: 'céréales', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 83, proteines: 3.1, glucides: 18.6, lipides: 0.2, fibres: 4.5,
      fer: 1, magnesium: 32, zinc: 0.6,
      vitB9: 18,
      lysine: 0.07, methionine: 0.05, leucine: 0.22, threonine: 0.09,
    },
  },
  {
    id: 'pain_blanc', name: 'Pain blanc (Baguette)', emoji: '🥖',
    category: 'céréales', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 80,
    per100g: {
      calories: 270, proteines: 9, glucides: 55, lipides: 1.2, fibres: 2.5,
      fer: 1.5, magnesium: 28, zinc: 0.8,
      vitB9: 20, vitB6: 0.05,
      lysine: 0.2, methionine: 0.15, leucine: 0.65, threonine: 0.28,
    },
  },
  {
    id: 'riz_blanc', name: 'Riz blanc', emoji: '🍚',
    category: 'céréales', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 360, proteines: 7, glucides: 78, lipides: 0.6, fibres: 1,
      fer: 0.8, magnesium: 25, zinc: 1.1,
      vitB9: 8, vitB6: 0.15,
      lysine: 0.25, methionine: 0.16, leucine: 0.58, threonine: 0.25,
    },
  },
  {
    id: 'pates_blanches', name: 'Pâtes blanches', emoji: '🍝',
    category: 'céréales', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 350, proteines: 12, glucides: 72, lipides: 1.5, fibres: 3,
      fer: 1.3, magnesium: 43, zinc: 1.2,
      vitB9: 10, vitB6: 0.1,
      lysine: 0.25, methionine: 0.18, leucine: 0.8, threonine: 0.35,
    },
  },
];
