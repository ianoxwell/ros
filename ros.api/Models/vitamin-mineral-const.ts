import { IMinerals, IVitamins } from './ingredient.dto';

export interface INutrientInfo {
  name: string;
  measure: string;
  shortName: string;
  /** Recommended daily allowance based on general adult male values (actual values may vary by age/gender) */
  rda: number;
}

type TCombinedMinVit = IVitamins & IMinerals;
export type TVitaminMineralInfo = {
  [P in keyof TCombinedMinVit]: INutrientInfo;
};

export const CVitaminsMinerals: TVitaminMineralInfo = {
  folate: { name: 'Folate', measure: 'μg', shortName: 'B9', rda: 400 }, // μg
  folicAcid: { name: 'Folic Acid', measure: 'μg DFE', shortName: 'B9', rda: 400 }, // μg DFE (Dietary Folate Equivalents)
  vitaminA: { name: 'Vitamin A', measure: 'μg RAE', shortName: 'A', rda: 900 }, // μg RAE (Retinol Activity Equivalents)
  vitaminB1: { name: 'Thiamine', measure: 'mg', shortName: 'B1', rda: 1.2 }, // mg
  vitaminB12: { name: 'Cobalamin', measure: 'μg', shortName: 'B12', rda: 2.4 }, // μg
  vitaminB2: { name: 'Riboflavin', measure: 'mg', shortName: 'B2', rda: 1.3 }, // mg
  vitaminB3: { name: 'Niacin', measure: 'mg', shortName: 'B3', rda: 16 }, // mg
  vitaminB5: { name: 'Pantothenic Acid', measure: 'mg', shortName: 'B5', rda: 5 }, // mg
  vitaminB6: { name: 'Pyridoxine', measure: 'mg', shortName: 'B6', rda: 1.7 }, // mg
  vitaminC: { name: 'Ascorbic Acid', measure: 'mg', shortName: 'C', rda: 90 }, // mg
  vitaminD: { name: 'Calciferol', measure: 'μg', shortName: 'D', rda: 20 }, // μg (800 IU)
  vitaminE: { name: 'Alpha-Tocopherol', measure: 'mg', shortName: 'E', rda: 15 }, // mg
  vitaminK: { name: 'Phylloquinone', measure: 'μg', shortName: 'K', rda: 120 },
  // Minerals
  calcium: { name: 'Calcium', measure: 'mg', shortName: 'Ca', rda: 1000 }, // mg
  choline: { name: 'Choline', measure: 'mg', shortName: 'Ch', rda: 550 }, // mg
  copper: { name: 'Copper', measure: 'mg', shortName: 'Cu', rda: 0.9 }, // mg
  fluoride: { name: 'Fluoride', measure: 'mg', shortName: 'F', rda: 4 }, // mg
  iodine: { name: 'Iodine', measure: 'μg', shortName: 'I', rda: 150 }, // μg
  iron: { name: 'Iron', measure: 'mg', shortName: 'Fe', rda: 18 }, // mg
  magnesium: { name: 'Magnesium', measure: 'mg', shortName: 'Mg', rda: 400 }, // mg
  manganese: { name: 'Manganese', measure: 'mg', shortName: 'Mn', rda: 2.3 }, // mg
  phosphorus: { name: 'Phosphorus', measure: 'mg', shortName: 'P', rda: 700 }, // mg
  potassium: { name: 'Potassium', measure: 'mg', shortName: 'K', rda: 4700 }, // mg
  selenium: { name: 'Selenium', measure: 'μg', shortName: 'Se', rda: 55 }, // μg
  sodium: { name: 'Sodium', measure: 'mg', shortName: 'Na', rda: 2300 }, // mg
  zinc: { name: 'Zinc', measure: 'mg', shortName: 'Zn', rda: 11 } // mg // μg
};

export const CMacroNutrientRda = {
  protein: { amount: 50, measure: 'g', note: 'Based on a 2000-calorie diet' },
  carbohydrates: { amount: 275, measure: 'g', note: 'Based on a 2000-calorie diet' },
  fat: { amount: 78, measure: 'g', note: 'Based on a 2000-calorie diet' },
  fiber: { amount: 28, measure: 'g', note: 'For adults, varies by age & sex' }
};
