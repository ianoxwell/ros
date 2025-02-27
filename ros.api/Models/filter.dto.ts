import { EOrder } from './base.dto';

export interface IFilter {
  take: number;

  page: number;

  sort?: string;

  order?: EOrder;

  keyword?: string;
}

export const CBlankFilter = {
  take: 10,
  page: 0,
  sort: 'name',
  order: EOrder.ASC,
  keyword: ''
};
