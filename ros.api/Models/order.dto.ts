import { IRecipeIngredient } from './recipe-ingredient.dto';
import { IScheduleRecipe } from './schedule.dto';

export interface IOrder {
  dateIndexStart: string;
  recipes: IScheduleRecipe[];
  ingredients: Omit<Partial<IRecipeIngredient>, 'recipeId'>[];
}
