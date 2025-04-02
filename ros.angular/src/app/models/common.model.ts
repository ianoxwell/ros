import { FormControl } from '@angular/forms';
import { SortDirection } from '@angular/material/sort';

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

export const CBlankPagedMeta = {
  page: 0,
  take: 0,
  itemCount: 0,
  pageCount: 0,
  hasPreviousPage: false,
  hasNextPage: false
};

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

/**
 * Create a simple (form controls only) using an existing interface
 * Credit to RcoderNY for his answer https://stackoverflow.com/questions/72507263/angular-14-strictly-typed-reactive-forms-how-to-type-formgroup-model-using-exi
 * @example: searchForm: FormGroup<TFormControlMap<ISearchRequestDTO>> | undefined;
 */
export type TypedControls<T> = {
  [K in keyof T]: FormControl<T[K]>;
};
