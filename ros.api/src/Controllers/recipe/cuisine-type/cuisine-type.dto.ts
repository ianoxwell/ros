import { ICuisineType } from 'Models/cuisine-type.dto';
import { CRecipeTease } from '../recipe-tease.class';

export class CCuisineType implements ICuisineType {
  name: string;
  altName: string;
  description: string;
  recipes: CRecipeTease[];
}
