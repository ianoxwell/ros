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
}

export interface IIngredient extends IIngredientShort {
  externalId?: number; // spoonacular id number
  possibleUnits: IMeasurement[];

  purchasedBy?: EPurchasedBy | TPurchasedBy;

  /** many to many reference back to allergy reference */
  allergies: IReferenceShort[];

  /** Many to one relationship */
  conversions?: IConversion[];

  /** Linked many to many table */
  recipeIngredientList?: IRecipe[];

  nutrition?: {
    nutrients: INutrients;
    properties: INutritionProperties;
    caloricBreakdown: ICaloricBreakdown;
  };

  estimatedCost: {
    value: number;
    unit: string;
  };
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

export interface INutrients {
  calories: number;
  fat: number;
  transFat: number;
  saturatedFat: number;
  monoUnsaturatedFat: number;
  polyUnsaturatedFat: number;
  protein: number;
  cholesterol: number;
  carbohydrates: number;
  netCarbohydrates: number;
  alcohol: number;
  fiber: number;
  sugar: number;
  sodium: number;
  caffeine: number;
  manganese: number;
  potassium: number;
  magnesium: number;
  calcium: number;
  copper: number;
  zinc: number;
  phosphorus: number;
  fluoride: number;
  choline: number;
  iron: number;
  vitaminA: number;
  vitaminB1: number;
  vitaminB2: number;
  vitaminB3: number;
  vitaminB5: number;
  vitaminB6: number;
  vitaminB12: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
  vitaminK: number;
  folate: number;
  folicAcid: number;
  iodine: number;
  selenium: number;
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
