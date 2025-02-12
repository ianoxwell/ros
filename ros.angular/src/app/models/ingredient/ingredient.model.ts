import { Conversion } from '../conversion';
import { ICommonMinerals, ICommonVitamins, INutritionFacts, IPrice } from './ingredient-model';
import { IReferenceItemFull } from '../reference.model';

export interface IIngredient {
  allergies?: IReferenceItemFull[];
  commonMinerals?: ICommonMinerals;
  commonVitamins?: ICommonVitamins;
  foodGroup?: IReferenceItemFull;
  id?: number;
  ingredientConversions?: Conversion[];
  ingredientStateId?: number;
  linkUrl?: number; // spoonacular id number
  name: string;
  nutritionFacts?: INutritionFacts;
  parentId?: number;
  pralScore?: number;
  price?: IPrice;
  purchasedBy?: TPurchasedBy;
  recipes?: [
    {
      id: number;
      name: string;
      teaser: string;
    }
  ];
  usdaFoodId?: number;
  image?: string;
  updatedAt?: string | Date;
  createdAt?: string | Date;
}

export enum PurchasedBy {
  Volume,
  Weight,
  Item
}

export const CPurchasedBy = ['weight', 'volume', 'individual', 'bunch'] as const;
type allPurchasedBy = typeof CPurchasedBy;
export type TPurchasedBy = allPurchasedBy[number];
