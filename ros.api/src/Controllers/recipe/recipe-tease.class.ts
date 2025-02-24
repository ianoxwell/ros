import { IRecipeTease } from 'Models/recipe.dto';
import { CuisineType } from './cuisine-type/cuisine-type.entity';
import { DishType } from './dish-type/dish-type.entity';
import { Equipment } from './equipment/equipment.entity';
import { RecipeIngredient } from './recipe-ingredient/recipe-ingredient.entity';
import { Recipe } from './recipe.entity';

export class CRecipeTease implements IRecipeTease {
  id: number;
  name: string;
  shortSummary: string;
  images: string[];
  dishType: string[];
  cuisineType: string[];
  equipment: string[];
  ingredientList: string[];

  constructor(recipe?: Recipe) {
    if (!!recipe) {
      this.id = recipe.id;
      this.name = recipe.name;
      this.shortSummary = recipe.shortSummary;
      this.images = recipe.images;
      this.dishType = recipe.dishType.map((dType: DishType) => dType.name);
      this.cuisineType = recipe.cuisineType.map((cType: CuisineType) => cType.name);
      this.equipment = recipe.equipment.map((equip: Equipment) => equip.name);
      this.ingredientList = recipe.ingredientList.map((ing: RecipeIngredient) => ing.ingredient.name);
    }
  }
}
