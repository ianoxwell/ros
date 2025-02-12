import { ApiLinks } from './apiLinks';
import { IMeasurement } from './ingredient/ingredient-model';
import { IIngredient } from './ingredient/ingredient.model';
import { IReferenceItemFull } from './reference.model';

export interface IRecipeIngredient {
  id?: number;
  recipeId?: number;
  ingredientId?: number;
  spoonacularId?: number;
  ingredientState?: IReferenceItemFull;
  ingredient?: IIngredient;
  /**
   * if stored as 0.5, 0.75 convert to symbol / fraction when displaying - 0.66 = 1/3
   */
  quantity?: number;
  /**
   * pinch, cup, kg, grams etc
   */
  measurementUnit?: IMeasurement;
  /**
   * each or whole, sliced, shredded, blank
   */
  state?: string;
  /**
   * optional field to replace ingredient name - not used in any calculations
   */
  text?: string;
  allergies?: Array<string>;
  /**
   * to order / shift around the ingredients
   */
  preference?: number;
  links?: ApiLinks;
}
