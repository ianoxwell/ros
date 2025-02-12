import { EPurchasedBy } from '../ingredient/ingredient.dto';
import { ECountryCode, IMeasurement } from './measurement.dto';

export const CMeasurementData: IMeasurement[] = [
  {
    id: 1,
    title: 'Pinch',
    measurementType: EPurchasedBy.volume,
    shortName: 'Pinch',
    altShortName: null,
    convertsToId: 5,
    quantity: 1,
    countryCode: ECountryCode.AU
  },
  {
    id: 2,
    title: 'Tablespoon',
    measurementType: EPurchasedBy.volume,
    shortName: 'tbsp',
    altShortName: 'tbsps',
    convertsToId: 5,
    quantity: 20,
    countryCode: ECountryCode.AU
  },
  {
    id: 3,
    title: 'Teaspoon',
    measurementType: EPurchasedBy.volume,
    shortName: 'tsp',
    altShortName: 'tsps',
    convertsToId: 5,
    quantity: 5,
    countryCode: ECountryCode.AU
  },
  {
    id: 4,
    title: 'Cup',
    measurementType: EPurchasedBy.volume,
    shortName: 'C',
    altShortName: null,
    convertsToId: 5,
    quantity: 250,
    countryCode: ECountryCode.AU
  },
  {
    id: 5,
    title: 'Millilitres',
    measurementType: EPurchasedBy.volume,
    shortName: 'ml',
    altShortName: 'mls',
    convertsToId: 6,
    quantity: 0.001,
    countryCode: ECountryCode.AU
  },
  {
    id: 6,
    title: 'Litres',
    measurementType: EPurchasedBy.volume,
    shortName: 'L',
    altShortName: null,
    convertsToId: 5,
    quantity: 1000,
    countryCode: ECountryCode.AU
  },
  {
    id: 7,
    title: 'Grams',
    measurementType: EPurchasedBy.weight,
    shortName: 'g',
    altShortName: 'gr',
    convertsToId: 8,
    quantity: 0.001,
    countryCode: ECountryCode.AU
  },
  {
    id: 8,
    title: 'Kilograms',
    measurementType: EPurchasedBy.weight,
    shortName: 'kg',
    altShortName: 'kgs',
    convertsToId: 7,
    quantity: 1000,
    countryCode: ECountryCode.AU
  },
  {
    id: 9,
    title: 'Each',
    measurementType: EPurchasedBy.individual,
    shortName: 'ea',
    altShortName: null,
    convertsToId: 9,
    quantity: 1,
    countryCode: ECountryCode.ALL
  },
  {
    id: 10,
    title: 'Small',
    measurementType: EPurchasedBy.individual,
    shortName: 'sml',
    altShortName: null,
    convertsToId: 9,
    quantity: 1,
    countryCode: ECountryCode.ALL
  },
  {
    id: 11,
    title: 'Medium',
    measurementType: EPurchasedBy.individual,
    shortName: 'med',
    altShortName: null,
    convertsToId: 9,
    quantity: 1,
    countryCode: ECountryCode.ALL
  },
  {
    id: 12,
    title: 'Large',
    measurementType: EPurchasedBy.individual,
    shortName: 'lg',
    altShortName: null,
    convertsToId: 9,
    quantity: 1,
    countryCode: ECountryCode.ALL
  },
  {
    id: 13,
    title: 'Servings',
    measurementType: EPurchasedBy.individual,
    shortName: 'serving',
    altShortName: null,
    convertsToId: 9,
    quantity: 1,
    countryCode: ECountryCode.ALL
  },
  {
    id: 14,
    title: 'Bunch',
    measurementType: EPurchasedBy.bunch,
    shortName: 'bch',
    altShortName: null,
    convertsToId: 9,
    quantity: 1,
    countryCode: ECountryCode.ALL
  },
  {
    id: 15,
    title: 'Pieces',
    measurementType: EPurchasedBy.bunch,
    shortName: 'piece',
    altShortName: null,
    convertsToId: 9,
    quantity: 1,
    countryCode: ECountryCode.ALL
  },
  {
    title: 'Tablespoon (US)',
    measurementType: EPurchasedBy.volume,
    shortName: 'tb',
    altShortName: 'tbs',
    convertsToId: 5,
    quantity: 15,
    countryCode: ECountryCode.US
  },
  {
    title: 'Cloves',
    measurementType: EPurchasedBy.bunch,
    shortName: 'clove',
    altShortName: 'cloves',
    convertsToId: 9,
    quantity: 5,
    countryCode: ECountryCode.ALL
  },
  {
    title: 'Leaf',
    measurementType: EPurchasedBy.individual,
    shortName: 'leaf',
    altShortName: 'leaves',
    convertsToId: 9,
    quantity: 1,
    countryCode: ECountryCode.ALL
  },
  {
    title: 'Half',
    measurementType: EPurchasedBy.individual,
    shortName: 'halves',
    altShortName: 'halve',
    convertsToId: 9,
    quantity: 0.5,
    countryCode: ECountryCode.ALL
  }
];
