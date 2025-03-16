export class IBaseDto {
  id?: number;
  updatedAt?: Date;
  createdAt?: Date;
}

export enum EOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface IPagedResult<T> {
  results: T[];
  meta: IPagedMeta;
}

export interface IPagedMeta {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}
