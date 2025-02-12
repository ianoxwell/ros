import { IBaseDto } from 'src/base/base.dto';
import { IIngredient } from 'src/ingredient/ingredient.dto';
import { User } from 'src/user/user.entity';
import { IRecipeIngredient } from './recipe-ingredient/recipe-ingredient.dto';
import { IRecipeSteppedInstruction } from './recipe-stepped-instructions/recipe-stepped-instructions.dto';

export class IRecipeShort extends IBaseDto {
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

export class IRecipe extends IRecipeShort {
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

  ingredients: IIngredient[];
  ingredientList: IRecipeIngredient[];
  steppedInstructions: IRecipeSteppedInstruction[];

  createdBy?: User;
  editedBy?: User;
  favoriteBy?: User[];
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
