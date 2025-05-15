import { IBaseDto } from './base.dto';
import { IConversion } from './conversion.dto';
import { IMeasurement } from './measurement.dto';
import { IRecipe } from './recipe.dto';

export interface IIngredientShort extends IBaseDto {
  id: number;
  /** Ingredient name - must be unique */
  name: string;
  originalName: string;
  image?: string;
  aisle?: string;
  nutrition?: INutrition;
  /** Many to one relationship */
  conversions?: IConversion[];
}

export interface IIngredientRecipeVeryShort {
  id: number;
  name: string;
  summary: string;
  images: string[];
  aggregateLikes: number;
}

export interface IIngredient extends IIngredientShort {
  externalId?: number; // spoonacular id number
  possibleUnits: IMeasurement[];
  preferredShoppingUnit?: IMeasurement;

  purchasedBy?: EPurchasedBy | TPurchasedBy;

  /** many to many reference back to allergy reference */
  allergies: IReferenceShort[];

  /** Linked many to many table */
  recipeIngredientList?: IRecipe[];

  estimatedCost: {
    value: number;
    unit: string;
  };
  recipes?: IIngredientRecipeVeryShort[];
}

export interface IReferenceShort {
  id: number;
  title: string;
  symbol?: string;
}

export type TPurchasedBy = 'weight' | 'volume' | 'individual' | 'bunch';
export enum EPurchasedBy {
  weight,
  volume,
  individual,
  bunch
}

export interface INutrition {
  nutrients: INutrients;
  vitamins: IVitamins;
  minerals: IMinerals;
  properties: INutritionProperties;
  caloricBreakdown: ICaloricBreakdown;
}

export interface IVitamins {
  folate: number;
  folicAcid: number;
  vitaminA: number;
  vitaminB1: number;
  vitaminB12: number;
  vitaminB2: number;
  vitaminB3: number;
  vitaminB5: number;
  vitaminB6: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
  vitaminK: number;
}

export interface IMinerals {
  calcium: number;
  choline: number;
  copper: number;
  fluoride: number;
  iodine: number;
  iron: number;
  magnesium: number;
  manganese: number;
  phosphorus: number;
  potassium: number;
  selenium: number;
  sodium: number;
  zinc: number;
}

export interface INutrients {
  alcohol: number;
  caffeine: number;
  calories: number;
  carbohydrates: number;
  cholesterol: number;
  fat: number;
  fiber: number;
  monoUnsaturatedFat: number;
  netCarbohydrates: number;
  polyUnsaturatedFat: number;
  protein: number;
  saturatedFat: number;
  sugar: number;
  transFat: number;
}

export interface INutritionProperties {
  glycemicIndex: number;
  glycemicLoad: number;
  nutritionScore: number;
}

export interface ICaloricBreakdown {
  percentProtein: number;
  percentFat: number;
  percentCarbs: number;
}
