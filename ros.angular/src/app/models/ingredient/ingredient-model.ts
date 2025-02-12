import { CountryCode, MeasurementType } from '../common.model';

export interface IMeasurement {
  id: number;
  rowVer: string;
  title: string;
  measurementType: MeasurementType;
  shortName: string;
  altShortName?: string;
  convertsToId: number;
  quantity: number;
  countryCode: CountryCode;
  createdAt: Date;
}
export interface IEditedField {
  key: string;
  value: any;
  changeType: string;
  subDocName?: string;
  subId?: string;
}
export interface IPrice {
  brandName: string;
  price: number;
  quantity: number;
  measurement: string;
  storeName: string;
  lastChecked: number;
  apiLink: string;
}

export interface ICommonMinerals {
  calcium?: number;
  copperCu?: number;
  fluorideF?: number;
  ironFe?: number;
  magnesium?: number;
  manganese?: number;
  potassiumK?: number;
  seleniumSe?: number;
  sodium?: number;
  zincZn?: number;
}

export interface ICommonVitamins {
  folateB9?: number;
  folateDfe?: number;
  folicAcid?: number;
  foodFolate?: number;
  niacinB3?: number;
  pantothenicAcidB5?: number;
  riboflavinB2?: number;
  thiaminB1?: number;
  vitaminAIu?: number;
  vitaminARae?: number;
  vitaminB6?: number;
  vitaminB12?: number;
  vitaminC?: number;
  vitaminD?: number;
  vitaminDIu?: number;
  vitaminE?: number;
  vitaminK?: number;
}
export interface INutritionFacts {
  calories?: number;
  cholesterol?: number;
  dietaryFiber?: number; // d
  monoUnsaturatedFat?: number;
  omega3s: number; // d
  omega3to6Ratio: number; // d
  omega6s: number;
  polyUnsaturatedFat?: number;
  protein?: number; // d
  saturatedFat?: number; // d
  totalCarbohydrate?: number; // d
  totalFat?: number; // d
  totalSugars?: number; // d
  transFat?: number; // d3
  water?: number; // d
}

export interface ICaloricBreakdown {
  carbohydrate?: number;
  fat?: number;
  protein?: number;
  water?: number;
}
