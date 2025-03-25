import { IMeasurement } from './measurement.dto';
import { IEquipment, ISimpleReference } from './recipe.dto';

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
  healthLabel: ISimpleReference[];
  measurements: IMeasurement[];
  equipment: IEquipment[];
  cuisineType: ISimpleReference[];
  dishType: ISimpleReference[];
}
