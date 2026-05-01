import type { NutrientMeta, NutrientGoals } from '../types';

export const NUTRIENT_META: NutrientMeta[] =[
  // MACROS
  { id: 'calories', label: 'Calories', unit: 'kcal', group: 'macros', tooltip: 'Énergie de ton repas.' },
  { id: 'proteines', label: 'Protéines', unit: 'g', group: 'macros', tooltip: 'Construction musculaire. Combine céréales et légumineuses.' },
  { id: 'glucides', label: 'Glucides', unit: 'g', group: 'macros', tooltip: 'Carburant principal. Privilégie les complexes.' },
  { id: 'lipides', label: 'Lipides', unit: 'g', group: 'macros', tooltip: 'Absorption des vitamines.' },
  { id: 'fibres', label: 'Fibres', unit: 'g', group: 'macros', tooltip: 'Santé digestive.' },

  // VITAMINES
  { id: 'vitA', label: 'Vitamine A', unit: 'µg', group: 'vitamines', tooltip: 'Bêta-carotène (carottes, patate douce).' },
  { id: 'vitC', label: 'Vitamine C', unit: 'mg', group: 'vitamines', tooltip: 'Boost l\'absorption du fer.' },
  { id: 'vitB9', label: 'Vitamine B9', unit: 'µg', group: 'vitamines', tooltip: 'Division cellulaire (légumineuses).' },
  { id: 'vitB6', label: 'Vitamine B6', unit: 'mg', group: 'vitamines', tooltip: 'Métabolisme.' },
  { id: 'vitE', label: 'Vitamine E', unit: 'mg', group: 'vitamines', tooltip: 'Antioxydant (noix, huiles).' },
  { id: 'vitK', label: 'Vitamine K', unit: 'µg', group: 'vitamines', tooltip: 'Coagulation (légumes verts).' },

  // MINÉRAUX
  { id: 'fer', label: 'Fer', unit: 'mg', group: 'mineraux', veganAlert: true, tooltip: 'Associe à la Vitamine C pour l\'absorption.' },
  { id: 'calcium', label: 'Calcium', unit: 'mg', group: 'mineraux', tooltip: 'Santé osseuse (tofu, chou kale).' },
  { id: 'zinc', label: 'Zinc', unit: 'mg', group: 'mineraux', veganAlert: true, tooltip: 'Immunité. Le trempage aide l\'absorption.' },
  { id: 'magnesium', label: 'Magnésium', unit: 'mg', group: 'mineraux', tooltip: 'Système nerveux (graines, céréales).' },
  { id: 'iode', label: 'Iode', unit: 'µg', group: 'mineraux', veganAlert: true, tooltip: 'Thyroïde (sel iodé, algues).' },
  { id: 'selenium', label: 'Sélénium', unit: 'µg', group: 'mineraux', tooltip: 'Antioxydant (noix du Brésil).' },

  // ACIDES GRAS
  { id: 'omega3', label: 'Oméga-3', unit: 'g', group: 'acidesgras', veganAlert: true, tooltip: 'Graines de lin, chia, noix.' },
  { id: 'omega6', label: 'Oméga-6', unit: 'g', group: 'acidesgras', tooltip: 'Ne pas en abuser par rapport aux oméga-3.' },

  // ACIDES AMINÉS
  { id: 'lysine', label: 'Lysine', unit: 'g', group: 'aminoacides', tooltip: 'Légumineuses.' },
  { id: 'methionine', label: 'Méthionine', unit: 'g', group: 'aminoacides', tooltip: 'Céréales et graines.' },
  { id: 'leucine', label: 'Leucine', unit: 'g', group: 'aminoacides', tooltip: 'Synthèse musculaire (soja).' },
  { id: 'threonine', label: 'Thréonine', unit: 'g', group: 'aminoacides', tooltip: 'Protéines structurelles.' },
];
 
// Goals for ~1 MEAL (roughly Daily / 3)
export const MEAL_GOALS: NutrientGoals = {
  calories: 660,
  proteines: 20,
  glucides: 85,
  lipides: 25,
  fibres: 10,
  vitB12: 0, // Handled via supplement
  vitD: 0,   // Handled via supplement
  vitA: 250,
  vitC: 40,
  vitB9: 110,
  vitB6: 0.5,
  vitE: 4,
  vitK: 25,
  fer: 5.5,
  calcium: 300,
  zinc: 4,
  magnesium: 130,
  iode: 50,
  selenium: 25,
  omega3: 0.8,
  omega6: 4,
  lysine: 0.7,
  methionine: 0.4,
  leucine: 1.0,
  threonine: 0.5,
};

export function multiplyGoals(goals: NutrientGoals, factor: number): NutrientGoals {
  const result = { ...goals };
  for (const key in result) {
    result[key as keyof NutrientGoals] = (result[key as keyof NutrientGoals] || 0) * factor;
  }
  return result;
}

export const DAILY_GOALS = multiplyGoals(MEAL_GOALS, 3);
