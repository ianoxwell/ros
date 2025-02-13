import { IBaseDto } from './base.dto';
import { IIngredientShort } from './ingredient.dto';
import { IMeasurement } from './measurement.dto';

export interface IRecipeIngredient extends IBaseDto {
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
