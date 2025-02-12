import { SortDirection } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { IIngredientFilterObject, IRecipeFilterQuery } from './filter-queries.model';

/** Generic key/values */
export interface IDictionary<T> {
  [Key: string]: T;
}

export interface BaseDbModel {
  id: number;
  rowVer: string;
  createdAt: Date;
}

export interface Validations {
  type: string;
  message: string;
}

export interface HourMin {
  hours: number;
  minutes: number;
}

export interface IdValuePair {
  id: number | string;
  value: string | number;
}

export interface IIdKeyPair {
  id: number;
  key: string;
}

export interface IdTitlePair {
  id: number;
  title: string;
}

export interface IngredientPaginator {
  previousPageIndex: number;
  pageIndex: number;
  pageSize: number;
  length: number;
  active?: string;
  direction?: SortDirection;
  filter?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

export class MessageResult {
  message: string;
  constructor(message: string) {
    this.message = message;
  }
}

export interface ISortPageObj {
  orderby: string;
  order: SortDirection;
  perPage: number;
  page: number;
}

export class SortPageObj implements ISortPageObj {
  orderby = 'name';
  order: SortDirection = 'asc';
  page = 0;
  perPage = environment.resultsPerPage;

  public update(filterObj: IIngredientFilterObject | IRecipeFilterQuery) {
    if (filterObj) {
      this.orderby = filterObj.orderby;
      this.order = filterObj.order;
      this.page = filterObj.page;
      this.perPage = filterObj.perPage;
    }
    return this;
  }
}

export interface AdminRights {
  globalAdmin: boolean;
  schoolAdmin: IdTitlePair[];
}

export interface IValidationMessages {
  [key: string]: {
    type: string;
    message: string;
  }[];
}

export interface IScrollPositions {
  prev: number;
  current: number;
}

/* Section Enums
 */

export enum CountryCode {
  AU,
  US,
  ALL
}

export enum MeasurementType {
  Volume,
  Weight,
  Item
}

export enum NutritionUnit {
  g,
  mg,
  cal
}

export enum PicturePosition {
  top,
  left,
  right
}
