import { IBaseDto } from './base.dto';
import { IIngredientShort, INutrition } from './ingredient.dto';
import { IRecipeIngredient } from './recipe-ingredient.dto';
import { IRecipeSteppedInstruction } from './recipe-stepped-instructions.dto';
import { IUserProfile } from './user.dto';

export interface IRecipeTease {
  id: number;
  name: string;
  shortSummary: string;
  images: string[];
}

export interface IRecipeShort extends IBaseDto {
  name: string;
  instructions: string;
  summary: string;
  shortSummary: string;
  pricePerServing: number;
  images: string[];
  preparationMinutes: number;
  cookingMinutes: number;
  readyInMinutes: number;
  aggregateLikes: number;
  healthScore: number;
  servings: number;
  spoonId: number;
  sourceUrl: string;
  creditsText: string;
  license?: string;
  sourceName?: string;
  spoonacularSourceUrl?: string;

  gaps: string;
  weightWatcherSmartPoints: number;

  /** Create a map to return string of the health label - e.g. vegan, vegetarian (or whatever is marked true.) */
  healthLabels: THealthBooleanLabels[];
  cuisineType: string[];
  dishType: string[];
  diets: string[];
}

export interface IRecipe extends IRecipeShort {
  name: string;
  instructions: string;
  summary: string;
  shortSummary: string;
  equipment: IEquipment[];
  pricePerServing: number;
  images: string[];
  preparationMinutes: number;
  cookingMinutes: number;
  readyInMinutes: number;
  aggregateLikes: number;
  healthScore: number;
  servings: number;
  spoonId: number;
  sourceUrl: string;
  creditsText: string;
  license?: string;
  sourceName?: string;
  spoonacularSourceUrl?: string;

  gaps: string;
  weightWatcherSmartPoints: number;

  /** Create a map to return string of the health label - e.g. vegan, vegetarian (or whatever is marked true.) */
  healthLabels: THealthBooleanLabels[];
  cuisineType: string[];
  dishType: string[];
  diets: string[];

  ingredients: IIngredientShort[];
  ingredientList: IRecipeIngredient[];
  steppedInstructions: IRecipeSteppedInstruction[];

  createdBy?: IUserProfile;
  editedBy?: IUserProfile;
  favoriteBy?: IUserProfile[];
  nutrition?: INutrition;
}
export interface ISimpleReference {
  id: number;
  name: string;
  description?: string;
}

export interface IEquipment extends ISimpleReference {
  image?: string;
}

export type THealthBooleanLabels =
  | 'vegetarian'
  | 'vegan'
  | 'glutenFree'
  | 'dairyFree'
  | 'veryHealthy'
  | 'cheap'
  | 'veryPopular'
  | 'sustainable'
  | 'lowFodmap';
