import { Ingredient } from './ingredient.entity';

export class IIngredientShort {
  id: number;
  name: string;
  originalName: string;

  image?: string;
  aisle?: string;

  constructor(i?: Ingredient) {
    if (i) {
      this.id = i.id;
      this.name = i.name;
      this.originalName = i.originalName;
      this.image = i.image;
      this.aisle = i.aisle;
    }
  }
}
