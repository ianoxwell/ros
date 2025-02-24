import { IBaseDto } from './base.dto';
import { IRecipeTease } from './recipe.dto';

export interface ICuisineType extends IBaseDto {
  name: string;
  altName: string;
  description: string;
  recipes: IRecipeTease[];
}
