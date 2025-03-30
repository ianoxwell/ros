import { EPurchasedBy } from './ingredient.dto';

export enum ECountryCode {
  AU,
  US,
  ALL
}

export interface IMeasurement {
  id?: number;
  title: string;
  measurementType: EPurchasedBy;
  shortName: string;
  altShortName?: string;
  convertsToId?: number;
  quantity: number;
  countryCode: ECountryCode;
}
