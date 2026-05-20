/* eslint-disable @typescript-eslint/no-explicit-any, react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const TRANSLATIONS: Record<Language, Record<string, any>> = {
  fr: {
    common: {
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      close: 'Fermer',
      reset: 'Réinitialiser',
      today: "Aujourd'hui",
      edit: 'Modifier',
      delete: 'Supprimer',
      search: 'Rechercher...',
      grams: 'g',
      kcal: 'kcal',
      ml: 'ml',
      percentageOfGoal: '% objectif',
      done: 'Terminé',
      saveAll: 'Enregistrer les modifications',
      saveThese: 'Enregistrer ces objectifs',
      total: 'Total',
      per100: 'pour 100',
    },
    seasons: {
      printemps: 'Printemps',
      ete: 'Été',
      automne: 'Automne',
      hiver: 'Hiver',
    },
    themes: {
      washi: 'Washi · 和紙 (Clair)',
      suna: 'Suna · 砂 (Sable)',
      matcha: 'Matcha · 抹茶 (Vert)',
      sora: 'Sora · 空 (Ciel)',
      sumi: 'Sumi · 墨 (Foncé)',
    },
    categories: {
      légumineuses: 'Légumineuses',
      céréales: 'Céréales',
      légumes: 'Légumes',
      fruits: 'Fruits',
      'graines & noix': 'Graines & noix',
      boissons: 'Boissons',
      autres: 'Autres',
    },
    utilityRail: {
      themeTitle: 'Thème',
      goalsTitle: 'Objectifs',
      toggleLanguage: 'Switch to English',
    },
    analysis: {
      title: 'Analyse nutritionnelle',
      overviewTitle: 'Aperçu nutritionnel',
      distribution: 'Répartition — {label}',
      toAdd: 'à ajouter',
      prevDay: 'Jour précédent',
      nextDay: 'Jour suivant',
      openCalendar: 'Ouvrir le calendrier',
      pastDaysCount: '{count} jours',
      noMealRegistered: 'Aucun repas enregistré',
      composeFirstMeal: 'Composez et validez votre premier repas.',
      plateReady: 'Assiette prête',
      validateToSave: "Validez votre repas pour l'enregistrer.",
      nutrients: 'Nutriments',
      sections: {
        macros: 'Macros',
        micros: 'Micros',
        minerals: 'Minéraux',
      },
      dailyTotalLabel: 'Total jour',
      closeDayButton: 'Clôturer ma journée',
    },
    foodList: {
      selectedFoods: 'Aliments sélectionnés',
      clearListTitle: 'Vider la liste',
      plateEmpty: 'Votre assiette est vide',
      addIngredientsFromCatalog: 'Ajoutez des ingrédients depuis le catalogue.',
      validateMealButton: 'Valider le repas',
    },
    foodSearch: {
      title: "Catalogue d'aliments",
      tooltipModeLabel: "Mode d'infobulles",
      tooltipModes: {
        off: 'Sans survol',
        simple: 'Simple',
        advanced: 'Avancé',
      },
      categoryTous: 'Tous',
    },
    detailedDrawer: {
      title: 'Analyse détaillée',
      noNutrientsInGroup: 'Aucun nutriment dans ce groupe',
    },
    goalsModal: {
      title: 'Objectifs nutritionnels',
      subTitle: 'Smart pour calculer vite, manuel pour ajuster finement.',
      importData: 'Importer les données',
      exportData: 'Exporter les données',
      resetGoals: 'Réinitialiser les objectifs',
      resetConfirmTitle: 'Réinitialiser les objectifs',
      resetConfirmText: 'Êtes-vous sûr de vouloir réinitialiser tous les objectifs ? Cette action remettra toutes les valeurs par défaut.',
      viewModeSmart: 'Smart',
      viewModeManual: 'Manuel',
      fieldAge: 'Âge',
      fieldWeight: 'Poids',
      fieldHeight: 'Taille',
      sexMale: 'Masculin',
      sexFemale: 'Féminin',
      fieldSex: 'Sexe',
      fieldTarget: 'Objectif',
      fieldActivity: 'Activité',
      previewTitle: 'Aperçu',
      kcalPerDay: 'kcal/jour',
      kcalPerMeal: '{calories} kcal par repas',
      dailyTab: 'Journalier',
      mealTab: 'Par repas',
      manualEditHint: 'Modifier les calories recalcule protéines, glucides, lipides, fibres et ajuste les autres cibles.',
      yearsSuffix: 'ans',
      nutrientGroups: {
        macros: 'Énergie',
        vitamines: 'Vitamines',
        mineraux: 'Minéraux',
        acidesgras: 'Acides gras',
        aminoacides: 'Acides aminés',
      },
      resetToDefault: 'Réinitialiser à {val} {unit}',
      invalidFileFormat: 'Format de fichier invalide',
    },
    mealHistory: {
      title: 'Repas',
      addFavorite: 'Ajouter un favori',
      addFavoriteMeal: 'Ajouter un repas favori',
      deleteFavorite: 'Supprimer le favori',
      quantities: 'Quantités',
      removeFromFavorites: 'Retirer des favoris',
      addToFavorites: 'Ajouter aux favoris',
      validateDay: 'Valider la journée',
      viewAtDate: 'Voir le {date}',
    },
    dayValidation: {
      title: 'Valider la journée',
      recordedMeals: 'Repas enregistrés',
      totalCalories: 'Total calories',
      dailyGoal: 'Objectif journalier',
      coverage: 'Couverture',
    },
    mealStats: {
      infoPlaceholder: "Tes apports s'afficheront ici",
      goalLabel: 'Objectif: {val} kcal',
      qualityScore: 'Score Qualité: {score}/3',
    },
    mealEvaluation: {
      tooLight: 'Repas trop léger',
      excellent: 'Excellent & Complet',
      balanced: 'Équilibré',
      incomplete: 'Incomplet',
    },
    activities: {
      sedentary: 'Sédentaire',
      light: 'Léger',
      moderate: 'Modéré',
      active: 'Actif',
      intense: 'Intense',
    },
    targets: {
      deficit: 'Léger déficit',
      maintain: 'Maintien',
      gain: 'Prise douce',
    },
    nutrients: {
      // MACROS
      calories: { label: 'Calories', tooltip: 'Énergie de ton repas.' },
      proteines: { label: 'Protéines', tooltip: 'Construction musculaire. Combine céréales et légumineuses.' },
      glucides: { label: 'Glucides', tooltip: 'Carburant principal. Privilégie les complexes.' },
      lipides: { label: 'Lipides', tooltip: 'Absorption des vitamines.' },
      fibres: { label: 'Fibres', tooltip: 'Santé digestive.' },
      // VITAMINES
      vitA: { label: 'Vitamine A', tooltip: 'Bêta-carotène (carottes, patate douce).' },
      vitC: { label: 'Vitamine C', tooltip: "Boost l'absorption du fer." },
      vitB9: { label: 'Vitamine B9', tooltip: 'Division cellulaire (légumineuses).' },
      vitB6: { label: 'Vitamine B6', tooltip: 'Métabolisme.' },
      vitE: { label: 'Vitamine E', tooltip: 'Antioxydant (noix, huiles).' },
      vitK: { label: 'Vitamine K', tooltip: 'Coagulation (légumes verts).' },
      // MINÉRAUX
      fer: { label: 'Fer', tooltip: "Associe à la Vitamine C pour l'absorption." },
      calcium: { label: 'Calcium', tooltip: 'Santé osseuse (tofu, chou kale).' },
      zinc: { label: 'Zinc', tooltip: 'Immunité. Le trempage aide l\'absorption.' },
      magnesium: { label: 'Magnésium', tooltip: 'Système nerveux (graines, céréales).' },
      selenium: { label: 'Sélénium', tooltip: 'Antioxydant (noix du Brésil).' },
      // ACIDES GRAS
      omega3: { label: 'Oméga-3', tooltip: 'Graines de lin, chia, noix.' },
      omega6: { label: 'Oméga-6', tooltip: 'Ne pas en abuser par rapport aux oméga-3.' },
      // ACIDES AMINÉS
      lysine: { label: 'Lysine', tooltip: 'Légumineuses.' },
      methionine: { label: 'Méthionine', tooltip: 'Céréales et graines.' },
      leucine: { label: 'Leucine', tooltip: 'Synthèse musculaire (soja).' },
      threonine: { label: 'Thréonine', tooltip: 'Protéines structurelles.' },
    },
    foods: {
      // Légumineuses
      lentilles_vertes: 'Lentilles vertes',
      lentilles_corail: 'Lentilles corail',
      pois_chiches: 'Pois chiches',
      haricots_rouges: 'Haricots rouges',
      edamame: 'Edamame',
      tofu: 'Tofu ferme',
      tempeh: 'Tempeh',
      haricots_blancs: 'Haricots blancs',
      petits_pois: 'Petits pois',
      pois_casses: 'Pois cassés',
      houmous: 'Houmous',
      // Céréales
      flocons_avoine: "Flocons d'avoine",
      quinoa: 'Quinoa',
      riz_complet: 'Riz complet',
      sarrasin: 'Sarrasin',
      pain_complet: 'Pain complet',
      pates_completes: 'Pâtes complètes',
      mais: 'Maïs',
      boulgour: 'Boulgour',
      pain_blanc: 'Pain blanc (Baguette)',
      riz_blanc: 'Riz blanc',
      pates_blanches: 'Pâtes blanches',
      semoule_couscous: 'Semoule de couscous',
      muesli: 'Muesli',
      pain_seigle: 'Pain de seigle',
      // Fruits
      pomme: 'Pomme',
      orange: 'Orange',
      banane: 'Banane',
      myrtilles: 'Myrtilles',
      avocat: 'Avocat',
      fraise: 'Fraise',
      kiwi: 'Kiwi',
      poire: 'Poire',
      raisin: 'Raisin',
      clementine: 'Clémentine',
      melon: 'Melon',
      peche: 'Pêche',
      compote_pomme: 'Compote de pomme',
      // Graines & noix
      graines_chia: 'Graines de chia',
      graines_lin: 'Graines de lin',
      amandes: 'Amandes',
      noix: 'Noix',
      noix_bresil: 'Noix du Brésil',
      graines_courge: 'Graines de courge',
      sesame: 'Graines de sésame',
      cacahuetes: 'Cacahuètes',
      noisettes: 'Noisettes',
      noix_cajou: 'Noix de cajou',
      beurre_cacahuete: 'Beurre de cacahuète',
      // Légumes
      epinards: 'Épinards',
      brocoli: 'Brocoli',
      chou_kale: 'Chou kale',
      patate_douce: 'Patate douce',
      carotte: 'Carotte',
      champignons: 'Champignons de Paris',
      courgette: 'Courgette',
      betterave: 'Betterave',
      poireau: 'Poireau',
      tomate: 'Tomate',
      concombre: 'Concombre',
      poivron: 'Poivron',
      aubergine: 'Aubergine',
      chou_fleur: 'Chou fleur',
      haricot_vert: 'Haricot vert',
      oignon: 'Oignon',
      pomme_de_terre: 'Pomme de terre',
      salade_verte: 'Salade verte',
      chou_rouge: 'Chou rouge',
      ail: 'Ail',
      // Autres
      lait_vegetal: 'Lait végétal enrichi',
      chocolat_noir: 'Chocolat noir 70%',
      huile_olive: "Huile d'olive",
      huile_colza: 'Huile de colza',
      jus_citron: 'Jus de citron',
      moutarde: 'Moutarde',
      sauce_tomate: 'Sauce tomate',
      steak_vegetal: 'Steak végétal',
      biscuit_tous: 'Biscuit (Oreo, Prince...)',
      chips: 'Chips de pomme de terre',
      oeuf: 'Oeuf',
      miel: 'Miel',
      yaourt_grec: 'Yaourt grec',
      fromage_blanc: 'Fromage blanc',
      emmental: 'Emmental',
      // Boissons
      biere_blonde: 'Bière blonde',
      biere_brune: 'Bière brune',
      vin_rouge: 'Vin rouge',
      vin_blanc: 'Vin blanc',
      cidre: 'Cidre',
      coca: 'Coca-Cola / Soda',
      soda_light: 'Soda light / zéro',
      jus_orange: "Jus d'orange",
      jus_pomme: 'Jus de pomme',
      jus_raisin: 'Jus de raisin',
      cafe: 'Café noir',
      the: 'Thé vert / noir',
      infusion: 'Infusion',
      limonade: 'Limonade',
      lait_soja: 'Lait de soja',
      lait_amande: "Lait d'amande",
    },
  },
  en: {
    common: {
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      close: 'Close',
      reset: 'Reset',
      today: 'Today',
      edit: 'Edit',
      delete: 'Delete',
      search: 'Search...',
      grams: 'g',
      kcal: 'kcal',
      ml: 'ml',
      percentageOfGoal: '% of goal',
      done: 'Done',
      saveAll: 'Save changes',
      saveThese: 'Save these goals',
      total: 'Total',
      per100: 'per 100',
    },
    seasons: {
      printemps: 'Spring',
      ete: 'Summer',
      automne: 'Autumn',
      hiver: 'Winter',
    },
    themes: {
      washi: 'Washi · Paper (Light)',
      suna: 'Suna · Sand (Warm)',
      matcha: 'Matcha · Green (Tea)',
      sora: 'Sora · Sky (Blue)',
      sumi: 'Sumi · Ink (Dark)',
    },
    categories: {
      légumineuses: 'Legumes',
      céréales: 'Grains',
      légumes: 'Vegetables',
      fruits: 'Fruits',
      'graines & noix': 'Seeds & nuts',
      boissons: 'Drinks',
      autres: 'Others',
    },
    utilityRail: {
      themeTitle: 'Theme',
      goalsTitle: 'Goals',
      toggleLanguage: 'Passer en Français',
    },
    analysis: {
      title: 'Nutritional Analysis',
      overviewTitle: 'Nutritional Overview',
      distribution: 'Distribution — {label}',
      toAdd: 'to add',
      prevDay: 'Previous day',
      nextDay: 'Next day',
      openCalendar: 'Open calendar',
      pastDaysCount: '{count} days',
      noMealRegistered: 'No meals registered',
      composeFirstMeal: 'Compose and validate your first meal.',
      plateReady: 'Plate ready',
      validateToSave: 'Validate your meal to save it.',
      nutrients: 'Nutrients',
      sections: {
        macros: 'Macros',
        micros: 'Micros',
        minerals: 'Minerals',
      },
      dailyTotalLabel: 'Daily Total',
      closeDayButton: 'Complete my day',
    },
    foodList: {
      selectedFoods: 'Selected Foods',
      clearListTitle: 'Clear list',
      plateEmpty: 'Your plate is empty',
      addIngredientsFromCatalog: 'Add ingredients from the catalog.',
      validateMealButton: 'Validate meal',
    },
    foodSearch: {
      title: 'Food Catalog',
      tooltipModeLabel: 'Tooltip Mode',
      tooltipModes: {
        off: 'No Tooltips',
        simple: 'Simple',
        advanced: 'Advanced',
      },
      categoryTous: 'All',
    },
    detailedDrawer: {
      title: 'Detailed Analysis',
      noNutrientsInGroup: 'No nutrients in this group',
    },
    goalsModal: {
      title: 'Nutrient Goals',
      subTitle: 'Smart to calculate quickly, Manual for fine adjustments.',
      importData: 'Import data',
      exportData: 'Export data',
      resetGoals: 'Reset goals',
      resetConfirmTitle: 'Reset goals',
      resetConfirmText: 'Are you sure you want to reset all goals? This will restore all values to their defaults.',
      viewModeSmart: 'Smart',
      viewModeManual: 'Manual',
      fieldAge: 'Age',
      fieldWeight: 'Weight',
      fieldHeight: 'Height',
      sexMale: 'Male',
      sexFemale: 'Female',
      fieldSex: 'Sex',
      fieldTarget: 'Goal',
      fieldActivity: 'Activity',
      previewTitle: 'Preview',
      kcalPerDay: 'kcal/day',
      kcalPerMeal: '{calories} kcal per meal',
      dailyTab: 'Daily',
      mealTab: 'Per meal',
      manualEditHint: 'Modifying calories recalculates protein, carbs, fats, fiber and adjusts other targets.',
      yearsSuffix: 'yrs',
      nutrientGroups: {
        macros: 'Energy',
        vitamines: 'Vitamins',
        mineraux: 'Minerals',
        acidesgras: 'Fatty acids',
        aminoacides: 'Amino acids',
      },
      resetToDefault: 'Reset to {val} {unit}',
      invalidFileFormat: 'Invalid file format',
    },
    mealHistory: {
      title: 'Meals',
      addFavorite: 'Add a favorite',
      addFavoriteMeal: 'Add favorite meal',
      deleteFavorite: 'Delete favorite',
      quantities: 'Quantities',
      removeFromFavorites: 'Remove from favorites',
      addToFavorites: 'Add to favorites',
      validateDay: 'Validate day',
      viewAtDate: 'View {date}',
    },
    dayValidation: {
      title: 'Validate Day',
      recordedMeals: 'Recorded meals',
      totalCalories: 'Total calories',
      dailyGoal: 'Daily goal',
      coverage: 'Coverage',
    },
    mealStats: {
      infoPlaceholder: 'Your intake will display here',
      goalLabel: 'Goal: {val} kcal',
      qualityScore: 'Quality Score: {score}/3',
    },
    mealEvaluation: {
      tooLight: 'Meal too light',
      excellent: 'Excellent & Complete',
      balanced: 'Balanced',
      incomplete: 'Incomplete',
    },
    activities: {
      sedentary: 'Sedentary',
      light: 'Lightly active',
      moderate: 'Moderately active',
      active: 'Very active',
      intense: 'Extremely active',
    },
    targets: {
      deficit: 'Light deficit',
      maintain: 'Maintenance',
      gain: 'Lean bulk',
    },
    nutrients: {
      // MACROS
      calories: { label: 'Calories', tooltip: 'Energy of your meal.' },
      proteines: { label: 'Protein', tooltip: 'Muscle building. Combine grains and legumes.' },
      glucides: { label: 'Carbohydrates', tooltip: 'Primary fuel. Choose complex sources.' },
      lipides: { label: 'Fats', tooltip: 'Vitamin absorption.' },
      fibres: { label: 'Fiber', tooltip: 'Digestive health.' },
      // VITAMINES
      vitA: { label: 'Vitamin A', tooltip: 'Beta-carotene (carrots, sweet potato).' },
      vitC: { label: 'Vitamin C', tooltip: 'Boosts iron absorption.' },
      vitB9: { label: 'Folate (B9)', tooltip: 'Cell division (legumes).' },
      vitB6: { label: 'Vitamin B6', tooltip: 'Metabolism.' },
      vitE: { label: 'Vitamin E', tooltip: 'Antioxidant (nuts, oils).' },
      vitK: { label: 'Vitamin K', tooltip: 'Coagulation (green vegetables).' },
      // MINÉRAUX
      fer: { label: 'Iron', tooltip: 'Pair with Vitamin C for better absorption.' },
      calcium: { label: 'Calcium', tooltip: 'Bone health (tofu, kale).' },
      zinc: { label: 'Zinc', tooltip: 'Immunity. Soaking aids absorption.' },
      magnesium: { label: 'Magnesium', tooltip: 'Nervous system (seeds, grains).' },
      selenium: { label: 'Selenium', tooltip: 'Antioxidant (Brazil nuts).' },
      // ACIDES GRAS
      omega3: { label: 'Omega-3', tooltip: 'Flaxseeds, chia, walnuts.' },
      omega6: { label: 'Omega-6', tooltip: 'Do not abuse compared to omega-3.' },
      // ACIDES AMINÉS
      lysine: { label: 'Lysine', tooltip: 'Legumes.' },
      methionine: { label: 'Methionine', tooltip: 'Grains and seeds.' },
      leucine: { label: 'Leucine', tooltip: 'Muscle synthesis (soy).' },
      threonine: { label: 'Threonine', tooltip: 'Structural proteins.' },
    },
    foods: {
      // Légumineuses
      lentilles_vertes: 'Green lentils',
      lentilles_corail: 'Coral lentils',
      pois_chiches: 'Chickpeas',
      haricots_rouges: 'Red kidney beans',
      edamame: 'Edamame',
      tofu: 'Firm tofu',
      tempeh: 'Tempeh',
      haricots_blancs: 'White beans',
      petits_pois: 'Green peas',
      pois_casses: 'Split peas',
      houmous: 'Hummus',
      // Céréales
      flocons_avoine: 'Rolled oats',
      quinoa: 'Quinoa',
      riz_complet: 'Brown rice',
      sarrasin: 'Buckwheat',
      pain_complet: 'Whole wheat bread',
      pates_completes: 'Whole wheat pasta',
      mais: 'Corn',
      boulgour: 'Bulgur',
      pain_blanc: 'White bread (Baguette)',
      riz_blanc: 'White rice',
      pates_blanches: 'White pasta',
      semoule_couscous: 'Couscous semolina',
      muesli: 'Muesli',
      pain_seigle: 'Rye bread',
      // Fruits
      pomme: 'Apple',
      orange: 'Orange',
      banane: 'Banana',
      myrtilles: 'Blueberries',
      avocat: 'Avocado',
      fraise: 'Strawberry',
      kiwi: 'Kiwi',
      poire: 'Pear',
      raisin: 'Grapes',
      clementine: 'Clementine',
      melon: 'Melon',
      peche: 'Peach',
      compote_pomme: 'Applesauce',
      // Graines & noix
      graines_chia: 'Chia seeds',
      graines_lin: 'Flaxseeds',
      amandes: 'Almonds',
      noix: 'Walnuts',
      noix_bresil: 'Brazil nuts',
      graines_courge: 'Pumpkin seeds',
      sesame: 'Sesame seeds',
      cacahuetes: 'Peanuts',
      noisettes: 'Hazelnuts',
      noix_cajou: 'Cashews',
      beurre_cacahuete: 'Peanut butter',
      // Légumes
      epinards: 'Spinach',
      brocoli: 'Broccoli',
      chou_kale: 'Kale',
      patate_douce: 'Sweet potato',
      carotte: 'Carrot',
      champignons: 'Button mushrooms',
      courgette: 'Zucchini',
      betterave: 'Beetroot',
      poireau: 'Leek',
      tomate: 'Tomato',
      concombre: 'Cucumber',
      poivron: 'Bell pepper',
      aubergine: 'Eggplant',
      chou_fleur: 'Cauliflower',
      haricot_vert: 'Green beans',
      oignon: 'Onion',
      pomme_de_terre: 'Potato',
      salade_verte: 'Green salad',
      chou_rouge: 'Red cabbage',
      ail: 'Garlic',
      // Autres
      lait_vegetal: 'Fortified plant milk',
      chocolat_noir: 'Dark chocolate 70%',
      huile_olive: 'Olive oil',
      huile_colza: 'Rapeseed oil',
      jus_citron: 'Lemon juice',
      moutarde: 'Mustard',
      sauce_tomate: 'Tomato sauce',
      steak_vegetal: 'Plant steak',
      biscuit_tous: 'Biscuit (Oreo, Prince...)',
      chips: 'Potato chips',
      oeuf: 'Egg',
      miel: 'Honey',
      yaourt_grec: 'Greek yogurt',
      fromage_blanc: 'Fromage blanc',
      emmental: 'Emmental',
      // Boissons
      biere_blonde: 'Blonde beer',
      biere_brune: 'Brown beer',
      vin_rouge: 'Red wine',
      vin_blanc: 'White wine',
      cidre: 'Cider',
      coca: 'Coca-Cola / Soda',
      soda_light: 'Diet / Zero soda',
      jus_orange: 'Orange juice',
      jus_pomme: 'Apple juice',
      jus_raisin: 'Grape juice',
      cafe: 'Black coffee',
      the: 'Green / Black tea',
      infusion: 'Herbal tea',
      limonade: 'Lemonade',
      lait_soja: 'Soy milk',
      lait_amande: 'Almond milk',
    },
  },
};

function getBrowserLanguage(): Language {
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language.split('-')[0].toLowerCase();
    if (lang === 'en' || lang === 'fr') {
      return lang as Language;
    }
  }
  return 'fr';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('veganut-lang');
    if (stored === 'en' || stored === 'fr') return stored as Language;
    return getBrowserLanguage();
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('veganut-lang', lang);
  }, []);

  const t = useCallback(
    (keyPath: string, params?: Record<string, string | number>): string => {
      const keys = keyPath.split('.');
      let current: any = TRANSLATIONS[language];

      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          // If translation is missing in the current language, fall back to 'fr'
          let fallback: any = TRANSLATIONS['fr'];
          for (const fbKey of keys) {
            if (fallback && typeof fallback === 'object' && fbKey in fallback) {
              fallback = fallback[fbKey];
            } else {
              fallback = undefined;
              break;
            }
          }
          if (fallback !== undefined) {
            current = fallback;
            break;
          }
          return keyPath;
        }
      }

      if (typeof current !== 'string') {
        return keyPath;
      }

      let text = current;
      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(value));
        });
      }

      return text;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
