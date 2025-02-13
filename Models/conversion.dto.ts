
import { IBaseDto } from './base.dto';
import { IMeasurement } from './measurement.dto';

export interface IConversion extends IBaseDto {
  ingredientId?: number;
  sourceAmount: number;
  sourceUnit: IMeasurement;

  targetAmount: number;
  targetUnit: IMeasurement;
  answer: string;
  type: string;
}
