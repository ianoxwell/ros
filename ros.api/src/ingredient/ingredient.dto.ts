import { IBaseDto } from 'src/base/base.dto';
import { IMeasurement } from 'src/measurement/measurement.dto';
import { IRecipe } from 'src/recipe/recipe.dto';
import { IConversion } from './conversion/conversion.dto';

export class IIngredient extends IBaseDto {
  /** Ingredient name - must be unique */
  name: string;
  originalName: string;

  image?: string;
  externalId?: number; // spoonacular id number

  possibleUnits: IMeasurement[];
  aisle?: string;

  purchasedBy?: EPurchasedBy | TPurchasedBy;

  /** many to many reference back to allergy reference */
  allergies: IReferenceShort[];

  /** Many to one relationship */
  conversions?: IConversion[];

  /** Linked many to many table */
  recipes?: IRecipe[];

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
