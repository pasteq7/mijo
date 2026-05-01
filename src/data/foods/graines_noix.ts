import type { Food } from '../../types';

export const graines_noix: Food[] = [
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
  {
    id: 'cacahuetes', name: 'Cacahuètes', emoji: '🥜',
    category: 'graines & noix', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 567, proteines: 26, glucides: 16, lipides: 49, fibres: 8.5,
      fer: 4.6, calcium: 92, magnesium: 168, zinc: 3.3,
      vitE: 8.3, vitB9: 240,
      omega6: 15.6,
      lysine: 0.9, methionine: 0.3, leucine: 1.6, threonine: 0.8,
    },
  },
  {
    id: 'noisettes', name: 'Noisettes', emoji: '🌰',
    category: 'graines & noix', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 628, proteines: 15, glucides: 17, lipides: 61, fibres: 9.7,
      fer: 4.7, calcium: 114, magnesium: 163, zinc: 2.5,
      vitE: 15, vitB9: 113,
      omega6: 7.8,
      lysine: 0.4, methionine: 0.2, leucine: 1.0, threonine: 0.5,
    },
  },
];
