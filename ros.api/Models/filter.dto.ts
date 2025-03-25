import { EOrder } from './base.dto';

export interface IFilter {
  take: number;

  page: number;

  sort?: string;

  order?: EOrder;

  keyword?: string;
  skip: number;
}

export interface IRecipeFilter extends IFilter {
  cuisineTypes?: number[];
  diets?: number[];
  dishTypes?: number[];
  equipment?: number[];
}

export interface IIngredientFilter extends IFilter {
  aisle?: number[];
}

export const CBlankFilter: IFilter = {
  take: 10,
  page: 0,
  sort: 'name',
  order: EOrder.ASC,
  keyword: '',
  skip: 0
};
