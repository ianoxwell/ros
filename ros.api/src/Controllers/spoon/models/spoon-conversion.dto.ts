import { Measurement } from '@controllers//measurement/measurement.entity';

export class ISpoonConversion {
  sourceAmount: number;
  sourceUnit: string;
  targetAmount: number;
  targetUnit: string;
  answer: string;
  type: string;
  sourceUnitM?: Measurement;
}
