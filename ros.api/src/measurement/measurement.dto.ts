import { IBaseDto } from 'src/base/base.dto';
import { EPurchasedBy } from 'src/ingredient/ingredient.dto';

export enum ECountryCode {
  AU,
  US,
  ALL
}

export interface IMeasurement extends IBaseDto {
  title: string;
  measurementType: EPurchasedBy;
  shortName: string;
  altShortName?: string;
  convertsToId: number;
  quantity: number;
  countryCode: ECountryCode;
}
