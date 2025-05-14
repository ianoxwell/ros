import { EPurchasedBy, IIngredientShort } from '@models/ingredient.dto';
import { Ingredient } from './ingredient.entity';

export class CIngredientShort implements IIngredientShort {
  id: number;
  /** Ingredient name - must be unique */
  name: string;
  originalName: string;
  image?: string;
  aisle?: string;
  purchasedBy?: string;  
  constructor(i?: Ingredient) {
    if (i) {
      this.id = i.id;
      this.name = i.name;
      this.originalName = i.originalName;
      this.image = i.image;
      this.aisle = i.aisle;
      this.purchasedBy = i.purchasedBy ? EPurchasedBy[i.purchasedBy] : undefined;
    }
  }
}
