import { IMeasurement } from './measurement.dto';

export interface IReference {
  id?: number;
  title: string;
  refType: EReferenceType;
  symbol?: string;
  summary?: string;
  altTitle?: string;
  onlineId?: number;
  sortOrder?: number;
}

export enum EReferenceType {
  allergyWarning = 0,
  healthLabel = 5
}

export interface IAllReferences {
  allergyWarning: IReference[];
  healthLabel: IReference[];
  measurements: IMeasurement[];
}
