import type { NutrientMeta, DailyGoals } from '../types';

export const NUTRIENT_META: NutrientMeta[] = [
  // MACROS
  {
    id: 'calories', label: 'Calories', unit: 'kcal', group: 'macros',
    tooltip: 'Énergie totale apportée par ton alimentation.',
  },
  {
    id: 'proteines', label: 'Protéines', unit: 'g', group: 'macros',
    tooltip: 'Essentielles à la construction musculaire et aux enzymes. Les végétaux en contiennent, mais pense à varier les sources.',
  },
  {
    id: 'glucides', label: 'Glucides', unit: 'g', group: 'macros',
    tooltip: 'Principale source d\'énergie du corps. Privilégie les glucides complexes (céréales complètes, légumineuses).',
  },
  {
    id: 'lipides', label: 'Lipides', unit: 'g', group: 'macros',
    tooltip: 'Indispensables aux hormones et à l\'absorption des vitamines liposolubles (A, D, E, K).',
  },
  {
    id: 'fibres', label: 'Fibres', unit: 'g', group: 'macros',
    tooltip: 'Excellentes pour le microbiote. Les régimes vegan en apportent généralement beaucoup.',
  },

  // VITAMINES
  {
    id: 'vitB12', label: 'Vitamine B12', unit: 'µg', group: 'vitamines', veganAlert: true,
    tooltip: 'Quasi absente des végétaux. La supplémentation ou les aliments enrichis sont indispensables en régime vegan.',
    tip: 'Sources : levure maltée enrichie, lait végétal enrichi. Une supplémentation directe est souvent recommandée.',
  },
  {
    id: 'vitD', label: 'Vitamine D', unit: 'µg', group: 'vitamines', veganAlert: true,
    tooltip: 'Synthétisée par le soleil, rare dans les végétaux. Cruciale pour les os et l\'immunité.',
    tip: 'Sources végétales : champignons exposés au soleil. Souvent supplémentée en hiver.',
  },
  {
    id: 'vitA', label: 'Vitamine A (β-carotène)', unit: 'µg', group: 'vitamines',
    tooltip: 'Présente sous forme de bêta-carotène dans les végétaux, converti par le corps. Moins efficace que la forme animale.',
    tip: 'Sources : carotte, patate douce, kale, épinards. La cuisson améliore l\'absorption.',
  },
  {
    id: 'vitC', label: 'Vitamine C', unit: 'mg', group: 'vitamines',
    tooltip: 'Antioxydant puissant et boosteur d\'absorption du fer non-héminique végétal. Généralement abondante en régime vegan.',
  },
  {
    id: 'vitB9', label: 'Vitamine B9 (Folates)', unit: 'µg', group: 'vitamines',
    tooltip: 'Essentiels à la division cellulaire. Abondants dans les légumineuses et légumes verts.',
  },
  {
    id: 'vitB6', label: 'Vitamine B6', unit: 'mg', group: 'vitamines',
    tooltip: 'Impliquée dans le métabolisme des protéines et la synthèse de neurotransmetteurs.',
  },
  {
    id: 'vitE', label: 'Vitamine E', unit: 'mg', group: 'vitamines',
    tooltip: 'Antioxydant liposoluble. Abondant dans les huiles végétales, noix et graines.',
  },
  {
    id: 'vitK', label: 'Vitamine K', unit: 'µg', group: 'vitamines',
    tooltip: 'Indispensable à la coagulation et à la santé osseuse. Très présente dans les légumes verts à feuilles.',
  },

  // MINÉRAUX
  {
    id: 'fer', label: 'Fer', unit: 'mg', group: 'mineraux', veganAlert: true,
    tooltip: 'Le fer végétal (non-héminique) est moins bien absorbé que le fer animal. La vitamine C multiplie son absorption.',
    tip: 'Astuce : mange épinards + poivron rouge ou lentilles + jus de citron pour tripler l\'absorption.',
  },
  {
    id: 'calcium', label: 'Calcium', unit: 'mg', group: 'mineraux',
    tooltip: 'Essentiel aux os et aux dents. Sans produits laitiers, mise sur les laits végétaux enrichis et les légumes verts.',
    tip: 'Sources : chou kale, brocoli, lait végétal enrichi, tofu (coagulé au calcium), amandes.',
  },
  {
    id: 'zinc', label: 'Zinc', unit: 'mg', group: 'mineraux', veganAlert: true,
    tooltip: 'Moins biodisponible dans les végétaux (phytates). Présent dans les légumineuses, noix et graines.',
    tip: 'Faire tremper ou fermenter les légumineuses réduit les phytates et améliore l\'absorption du zinc.',
  },
  {
    id: 'magnesium', label: 'Magnésium', unit: 'mg', group: 'mineraux',
    tooltip: 'Impliqué dans plus de 300 réactions enzymatiques. Abondant dans les noix, graines et céréales complètes.',
  },
  {
    id: 'iode', label: 'Iode', unit: 'µg', group: 'mineraux', veganAlert: true,
    tooltip: 'Rare dans les végétaux terrestres. Essentiel à la thyroïde.',
    tip: 'Sources vegan : algues (quantité variable), sel iodé, certains laits végétaux enrichis.',
  },
  {
    id: 'selenium', label: 'Sélénium', unit: 'µg', group: 'mineraux',
    tooltip: 'Antioxydant clé. La noix du Brésil est la source la plus concentrée au monde (1-2 par jour suffisent).',
  },

  // ACIDES GRAS
  {
    id: 'omega3', label: 'Oméga-3 (ALA)', unit: 'g', group: 'acidesgras', veganAlert: true,
    tooltip: 'L\'ALA (acide alpha-linolénique) est le seul oméga-3 végétal direct. Le corps le convertit partiellement en EPA/DHA.',
    tip: 'Sources : graines de lin, chia, noix, huile de colza. La conversion en DHA est limitée (~5%).',
  },
  {
    id: 'omega6', label: 'Oméga-6', unit: 'g', group: 'acidesgras',
    tooltip: 'Pro-inflammatoires en excès. Le ratio oméga-6/oméga-3 idéal est < 4:1, souvent déséquilibré en alimentation moderne.',
  },

  // ACIDES AMINÉS
  {
    id: 'lysine', label: 'Lysine', unit: 'g', group: 'aminoacides',
    tooltip: 'Acide aminé limitant des céréales. Les légumineuses en sont riches — d\'où l\'importance de combiner les deux.',
  },
  {
    id: 'methionine', label: 'Méthionine', unit: 'g', group: 'aminoacides',
    tooltip: 'Acide aminé limitant des légumineuses. Les céréales et graines en sont bonnes sources.',
  },
  {
    id: 'leucine', label: 'Leucine', unit: 'g', group: 'aminoacides',
    tooltip: 'Acide aminé clé pour la synthèse musculaire (mTOR). Présent dans le soja, les lentilles, les graines.',
  },
  {
    id: 'threonine', label: 'Thréonine', unit: 'g', group: 'aminoacides',
    tooltip: 'Important pour les protéines structurelles (collagène, élastine). Présent dans les légumineuses et céréales.',
  },
];

export const DEFAULT_GOALS: DailyGoals = {
  calories: 2000,
  proteines: 55,
  glucides: 260,
  lipides: 70,
  fibres: 30,
  vitB12: 2.4,
  vitD: 15,
  vitA: 750,
  vitC: 110,
  vitB9: 330,
  vitB6: 1.4,
  vitE: 12,
  vitK: 70,
  fer: 16,
  calcium: 950,
  zinc: 11,
  magnesium: 380,
  iode: 150,
  selenium: 70,
  omega3: 2.3,
  omega6: 12,
  lysine: 2.1,
  methionine: 1.1,
  leucine: 3.1,
  threonine: 1.5,
};