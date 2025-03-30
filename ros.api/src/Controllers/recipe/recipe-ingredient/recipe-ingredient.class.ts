import { IIngredientShort } from '@models/ingredient.dto';
import { IMeasurement } from '@models/measurement.dto';
import { IRecipeIngredient } from '@models/recipe-ingredient.dto';

export class CRecipeIngredient implements IRecipeIngredient {
  ingredientId: number;
  recipeId: number;
  /** Quantity of the ingredient */
  amount: number;
  /** The title of the associated measure */
  unit: string;
  /** Seems to be solid or liquid - might be more? */
  consistency: string;
  /** Like chopped, diced, packed */
  meta: string[];
  measure: IMeasurement;

  /** Ingredient related items */
  ingredient: IIngredientShort;
}
