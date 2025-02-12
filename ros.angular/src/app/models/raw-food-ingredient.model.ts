import { ICommonMinerals, ICommonVitamins, INutritionFacts } from './ingredient/ingredient-model';
import { IReferenceItemFull } from './reference.model';

export interface IRawFoodIngredient {
  commonMinerals: ICommonMinerals;
  commonVitamins: ICommonVitamins;
  foodGroupId: number;
  foodGroup: IReferenceItemFull;
  id: number;
  name: string;
  nutritionFacts: INutritionFacts;
  pralScore?: number;
  usdaFoodId: string;
}

export interface IRawFoodSuggestion {
  id: number;
  usdaId: string;
  name: string;
  foodGroup: string;
}

export interface ISpoonSuggestions {
  name: string;
  image: string;
  id: number;
  aisle: string;
  possibleUnits: string[];
}

export interface ISpoonFoodRaw {
  id: number;
  original: string;
  originalName: string;
  name: string;
  amount: number;
  unit: string;
  unitShort: string;
  unitLong: string;
  possibleUnits: string[];
  estimatedCost: { value: number; unit: string };
  consistency: string;
  shoppingListUnits: string[];
  aisle: string;
  image: string;
  meta: any[]; // what is this used for?
  nutrition: {
    nutrients: { title: string; amount: number; unit: string; percentOfDailyNeeds: number }[];
    properties: { title: string; amount: number; unit: string }[];
    flavanoids: { title: string; amount: number; unit: string }[];
    caloricBreakdown: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
    };
    weightPerServing: {
      amount: number;
      unit: string;
    };
  };

  categoryPath: string[];
}

export interface ISpoonConversion {
  sourceAmount: number;
  sourceUnit: string;
  targetAmount: number;
  targetUnit: string;
  answer: string;
  type: string;
}
