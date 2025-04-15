import { IMinerals, INutrients, IVitamins } from './ingredient.dto';

export interface INutrientInfo {
  name: string;
  measure: string;
  shortName?: string;
  /** Recommended daily allowance based on general adult male values (actual values may vary by age/gender) */
  rda: number;
  indent?: boolean;
}

type TCombinedMinVit = IVitamins & IMinerals;
export type TVitaminMineralInfo = {
  [P in keyof TCombinedMinVit]: INutrientInfo;
};

export type TNutrition = {
  [P in keyof INutrients]: INutrientInfo;
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

export const CMacroNutrientRda: Pick<
  TNutrition,
  'fat' | 'saturatedFat' | 'monoUnsaturatedFat' | 'cholesterol' | 'carbohydrates' | 'fiber' | 'sugar' | 'protein'
> = {
  fat: { rda: 78, name: 'Total fats', measure: 'g' },
  saturatedFat: { rda: 0, name: 'Saturated fat', measure: 'g', indent: true },
  monoUnsaturatedFat: { rda: 0, name: 'Mono unsaturated fat', measure: 'g', indent: true },
  cholesterol: { rda: 0, name: 'Cholesterol', measure: 'mg', indent: true },
  carbohydrates: { rda: 275, name: 'Total carbohydrates', measure: 'g' },
  fiber: { rda: 28, name: 'Total fibre', measure: 'g', indent: true },
  sugar: { rda: 0, name: 'Total sugars', measure: 'g', indent: true },
  protein: { rda: 50, name: 'Protein', measure: 'g' }
};

/** Takes the nutrient values 24.000, 0.1234 and returns '24' or '0.123' */
const fixWholeNumber = (value: number | string | undefined, length = 3): string => {
  if (!value || isNaN(Number(value))) {
    return '0';
  }

  const num = Number(value);
  return Number.isInteger(num) ? num.toString() : num.toFixed(length);
};

export const calculateRdaPercent = (rdaAmount: number, value: number): string => {
  if (!rdaAmount) {
    return '';
  }

  return fixWholeNumber((value / rdaAmount) * 100, 1);
};
