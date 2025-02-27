export class IBaseDto {
  id?: number;
  updatedAt?: Date;
  createdAt?: Date;
}

export enum EOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}
