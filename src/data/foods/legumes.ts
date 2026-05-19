import type { Food } from '../../types';

export const legumes: Food[] = [
  {
    id: 'epinards', name: 'Épinards', emoji: '🥬',
    category: 'légumes', seasons: ['printemps', 'automne', 'hiver'],
    unit: 'g', defaultQty: 50,
    per100g: {
      calories: 23, proteines: 2.9, glucides: 3.6, lipides: 0.4, fibres: 2.2,
      fer: 2.7, calcium: 99, magnesium: 87, zinc: 0.5, selenium: 1,
      vitC: 28, vitA: 469, vitB9: 194, vitK: 483, vitE: 2,
      omega3: 0.14,
    },
  },
  {
    id: 'brocoli', name: 'Brocoli', emoji: '🥦',
    category: 'légumes', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 35, proteines: 2.8, glucides: 7, lipides: 0.4, fibres: 2.6,
      fer: 0.7, calcium: 47, magnesium: 21, zinc: 0.4, selenium: 2.5,
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
    unit: 'g', defaultQty: 50,
    per100g: {
      calories: 86, proteines: 1.6, glucides: 20, lipides: 0.1, fibres: 3,
      fer: 0.6, calcium: 30, magnesium: 25, zinc: 0.3,
      vitC: 2.4, vitA: 709, vitB9: 11, vitB6: 0.3, vitE: 0.26,
    },
  },
  {
    id: 'carotte', name: 'Carotte', emoji: '🥕',
    category: 'légumes', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 41, proteines: 0.9, glucides: 9.6, lipides: 0.2, fibres: 2.8,
      fer: 0.3, calcium: 33, magnesium: 12,
      vitC: 5.9, vitA: 835, vitB9: 19, vitK: 13.2,
    },
  },
  {
    id: 'champignons', name: 'Champignons de Paris', emoji: '🍄',
    category: 'légumes', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 22, proteines: 3.1, glucides: 3.3, lipides: 0.3, fibres: 1,
      fer: 0.5, zinc: 0.5, magnesium: 9, selenium: 9.3,
      vitB9: 17, vitB6: 0.1,
    },
  },
  {
    id: 'courgette', name: 'Courgette', emoji: '🥒',
    category: 'légumes', seasons: ['ete'],
    unit: 'g', defaultQty: 50,
    per100g: {
      calories: 17, proteines: 1.2, glucides: 3.1, lipides: 0.3, fibres: 1,
      fer: 0.4, calcium: 16, magnesium: 18,
      vitC: 17, vitB9: 24, vitK: 4.3,
    },
  },
  {
    id: 'betterave', name: 'Betterave', emoji: '🟣',
    category: 'légumes', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 43, proteines: 1.6, glucides: 9.6, lipides: 0.2, fibres: 2.8,
      fer: 0.8, calcium: 16, magnesium: 23,
      vitC: 4.9, vitB9: 109,
    },
  },
  {
    id: 'poireau', name: 'Poireau', emoji: '🧅',
    category: 'légumes', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 61, proteines: 1.5, glucides: 14, lipides: 0.3, fibres: 1.8,
      fer: 2.1, calcium: 59, magnesium: 28,
      vitC: 12, vitA: 83, vitB9: 64, vitK: 47,
    },
  },
  {
    id: 'tomate', name: 'Tomate', emoji: '🍅',
    category: 'légumes', seasons: ['ete', 'automne'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 18, proteines: 0.9, glucides: 3.9, lipides: 0.2, fibres: 1.2,
      fer: 0.3, calcium: 10, magnesium: 11,
      vitC: 14, vitB9: 15, vitA: 42,
    },
  },
  {
    id: 'concombre', name: 'Concombre', emoji: '🥒',
    category: 'légumes', seasons: ['ete'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 15, proteines: 0.6, glucides: 3.6, lipides: 0.1, fibres: 0.5,
      fer: 0.3, calcium: 16, magnesium: 13,
      vitC: 2.8, vitK: 16.4,
    },
  },
  {
    id: 'poivron', name: 'Poivron', emoji: '🫑',
    category: 'légumes', seasons: ['ete', 'automne'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 20, proteines: 0.9, glucides: 4.6, lipides: 0.2, fibres: 1.7,
      fer: 0.4, calcium: 10, magnesium: 11,
      vitC: 127, vitA: 157, vitB6: 0.2,
    },
  },
  {
    id: 'aubergine', name: 'Aubergine', emoji: '🍆',
    category: 'légumes', seasons: ['ete', 'automne'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 25, proteines: 1, glucides: 5.9, lipides: 0.2, fibres: 3,
      fer: 0.2, calcium: 9, magnesium: 14,
      vitC: 2.2, vitB9: 22,
    },
  },
  {
    id: 'chou_fleur', name: 'Chou fleur', emoji: '🥦',
    category: 'légumes', seasons: ['automne', 'hiver', 'printemps'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 25, proteines: 1.9, glucides: 5, lipides: 0.3, fibres: 2,
      fer: 0.4, calcium: 22, magnesium: 15, zinc: 0.3,
      vitC: 48, vitB9: 57, vitK: 15.5, vitB6: 0.18,
    },
  },
  {
    id: 'haricot_vert', name: 'Haricot vert', emoji: '🫘',
    category: 'légumes', seasons: ['ete', 'automne'],
    unit: 'g', defaultQty: 30,
    per100g: {
      calories: 31, proteines: 1.8, glucides: 7, lipides: 0.2, fibres: 3.4,
      fer: 1, calcium: 37, magnesium: 25, zinc: 0.2,
      vitC: 16, vitA: 35, vitB9: 33, vitK: 43,
    },
  },
  {
    id: 'oignon', name: 'Oignon', emoji: '🧅',
    category: 'légumes', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 50,
    per100g: {
      calories: 40, proteines: 1.1, glucides: 9, lipides: 0.1, fibres: 1.7,
      fer: 0.2, calcium: 23, magnesium: 10, zinc: 0.2,
      vitC: 7.4, vitB9: 19, vitB6: 0.12,
    },
  },
  {
    id: 'pomme_de_terre', name: 'Pomme de terre', emoji: '🥔',
    category: 'légumes', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 150,
    per100g: {
      calories: 77, proteines: 2, glucides: 17, lipides: 0.1, fibres: 2.2,
      fer: 0.8, calcium: 12, magnesium: 23, zinc: 0.3,
      vitC: 19.7, vitB6: 0.3, vitB9: 16,
    },
  },
  {
    id: 'salade_verte', name: 'Salade verte', emoji: '🥬',
    category: 'légumes', seasons: ['printemps', 'ete', 'automne'],
    unit: 'g', defaultQty: 50,
    per100g: {
      calories: 15, proteines: 1.4, glucides: 2.9, lipides: 0.2, fibres: 1.3,
      fer: 0.9, calcium: 36, magnesium: 13, zinc: 0.2,
      vitC: 9.2, vitA: 370, vitB9: 38, vitK: 126,
    },
  },
  {
    id: 'chou_rouge', name: 'Chou rouge', emoji: '🟣',
    category: 'légumes', seasons: ['automne', 'hiver'],
    unit: 'g', defaultQty: 80,
    per100g: {
      calories: 31, proteines: 1.4, glucides: 7.4, lipides: 0.2, fibres: 2.1,
      fer: 0.8, calcium: 45, magnesium: 16, zinc: 0.2,
      vitC: 57, vitA: 56, vitB9: 18, vitK: 38,
    },
  },
  {
    id: 'ail', name: 'Ail', emoji: '🧄',
    category: 'légumes', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'g', defaultQty: 5,
    per100g: {
      calories: 149, proteines: 6.4, glucides: 33, lipides: 0.5, fibres: 2.1,
      fer: 1.7, calcium: 181, magnesium: 25, zinc: 1.2, selenium: 14.2,
      vitC: 31, vitB6: 1.24, vitB9: 3,
    },
  },
];
