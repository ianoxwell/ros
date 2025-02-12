import { IBaseDto } from 'src/base/base.dto';
import { IMeasurement } from 'src/measurement/measurement.dto';

export interface IConversion extends IBaseDto {
  ingredientId?: number;
  sourceAmount: number;
  sourceUnit: IMeasurement;

  targetAmount: number;
  targetUnit: IMeasurement;
  answer: string;
  type: string;
}
