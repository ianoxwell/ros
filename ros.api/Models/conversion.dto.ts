import { IBaseDto } from './base.dto';
import { IMeasurement } from './measurement.dto';

export interface IConversion extends IBaseDto {
  ingredientId?: number;
  sourceAmount: number;
  sourceUnit?: IMeasurement;
  sourceUnitId: number;

  targetAmount: number;
  targetUnit?: IMeasurement;
  targetUnitId: number;

  answer: string;
  type?: string;
}
