import { IBaseDto } from 'src/base/base.dto';
import { IIngredientShort } from 'src/ingredient/ingredient-short.dto';
import { IMeasurement } from 'src/measurement/measurement.dto';

export class IRecipeIngredient extends IBaseDto {
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
