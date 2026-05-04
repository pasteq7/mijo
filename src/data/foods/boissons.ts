import type { Food } from '../../types';

export const boissons: Food[] = [
  {
    id: 'biere_blonde', name: 'Bière blonde', emoji: '🍺',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 330,
    per100g: {
      calories: 42, proteines: 0.5, glucides: 3.6, lipides: 0, fibres: 0,
      vitB9: 6, vitB6: 0.05,
      magnesium: 6,
    },
  },
  {
    id: 'biere_brune', name: 'Bière brune', emoji: '🍺',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 330,
    per100g: {
      calories: 50, proteines: 0.6, glucides: 5.5, lipides: 0, fibres: 0,
      fer: 0.05, magnesium: 8,
      vitB6: 0.07, vitB9: 7,
    },
  },
  {
    id: 'vin_rouge', name: 'Vin rouge', emoji: '🍷',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 150,
    per100g: {
      calories: 85, proteines: 0.1, glucides: 2.6, lipides: 0, fibres: 0,
      fer: 0.5, magnesium: 12,
      vitB6: 0.05,
    },
  },
  {
    id: 'vin_blanc', name: 'Vin blanc', emoji: '🥂',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 150,
    per100g: {
      calories: 82, proteines: 0.1, glucides: 2.6, lipides: 0, fibres: 0,
      magnesium: 10,
    },
  },
  {
    id: 'cidre', name: 'Cidre', emoji: '🍎',
    category: 'boissons', seasons: ['automne', 'hiver'],
    unit: 'ml', defaultQty: 330,
    per100g: {
      calories: 42, proteines: 0, glucides: 5, lipides: 0, fibres: 0,
      fer: 0.1, calcium: 5,
      vitC: 7,
    },
  },
  {
    id: 'coca', name: 'Coca-Cola / Soda', emoji: '🥤',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 330,
    per100g: {
      calories: 42, proteines: 0, glucides: 10.6, lipides: 0, fibres: 0,
    },
  },
  {
    id: 'soda_light', name: 'Soda light / zéro', emoji: '🥤',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 330,
    per100g: {
      calories: 0, proteines: 0, glucides: 0, lipides: 0, fibres: 0,
    },
  },
  {
    id: 'jus_orange', name: "Jus d'orange", emoji: '🍊',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 200,
    per100g: {
      calories: 45, proteines: 0.7, glucides: 10.4, lipides: 0.2, fibres: 0.2,
      fer: 0.2, calcium: 11,
      vitC: 50, vitB9: 30, vitA: 10,
    },
  },
  {
    id: 'jus_pomme', name: 'Jus de pomme', emoji: '🧃',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 200,
    per100g: {
      calories: 46, proteines: 0.1, glucides: 11.3, lipides: 0, fibres: 0,
      fer: 0.1, calcium: 8,
      vitC: 1,
    },
  },
  {
    id: 'jus_raisin', name: 'Jus de raisin', emoji: '🧃',
    category: 'boissons', seasons: ['automne'],
    unit: 'ml', defaultQty: 200,
    per100g: {
      calories: 60, proteines: 0.4, glucides: 14.5, lipides: 0, fibres: 0,
      fer: 0.3, calcium: 11, magnesium: 10,
      vitC: 2, vitK: 3,
    },
  },
  {
    id: 'cafe', name: 'Café noir', emoji: '☕',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 200,
    per100g: {
      calories: 1, proteines: 0.1, glucides: 0, lipides: 0, fibres: 0,
      magnesium: 7,
      vitB9: 1,
    },
  },
  {
    id: 'the', name: 'Thé vert / noir', emoji: '🫖',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 200,
    per100g: {
      calories: 1, proteines: 0, glucides: 0, lipides: 0, fibres: 0,
      vitB9: 5,
    },
  },
  {
    id: 'infusion', name: 'Infusion (menthe, camomille...)', emoji: '🌿',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 200,
    per100g: {
      calories: 0, proteines: 0, glucides: 0, lipides: 0, fibres: 0,
    },
  },

  {
    id: 'limonade', name: 'Limonade', emoji: '🍋',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 330,
    per100g: {
      calories: 34, proteines: 0, glucides: 8, lipides: 0, fibres: 0,
    },
  },
  {
    id: 'lait_soja', name: 'Lait de soja', emoji: '🧋',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 250,
    per100g: {
      calories: 45, proteines: 3.6, glucides: 2.6, lipides: 1.8, fibres: 0.5,
      fer: 0.5, calcium: 120, magnesium: 15,
      vitB9: 12, vitB6: 0.06,
      lysine: 0.22, methionine: 0.05, leucine: 0.29, threonine: 0.16,
    },
  },
  {
    id: 'lait_amande', name: "Lait d'amande", emoji: '🥜',
    category: 'boissons', seasons: ['printemps', 'ete', 'automne', 'hiver'],
    unit: 'ml', defaultQty: 250,
    per100g: {
      calories: 24, proteines: 0.6, glucides: 3.3, lipides: 1.1, fibres: 0.3,
      calcium: 120, magnesium: 5,
      vitE: 1.2,
    },
  },
];
