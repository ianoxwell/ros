import { IBaseDto } from 'src/base/base.dto';
import { IRecipeTease } from '../recipe-tease.dto';

export class ICuisineType extends IBaseDto {
  name: string;
  altName: string;
  description: string;
  recipes: IRecipeTease[];
}
