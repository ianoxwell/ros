import { IReference } from './reference.dto';
import { EReferenceType } from './reference.entity';

export const allergyReference: IReference[] = [
  {
    title: 'Gluten',
    symbol: 'gluten.png',
    refType: EReferenceType.allergyWarning
  },
  {
    title: 'Lactose',
    symbol: 'milk.png',
    refType: EReferenceType.allergyWarning
  },
  {
    title: 'Shellfish',
    symbol: 'crustaceans.png',
    refType: EReferenceType.allergyWarning
  },
  {
    title: 'Fish and Seafood',
    symbol: 'fish.png',
    refType: EReferenceType.allergyWarning
  },
  {
    title: 'Almonds and other Tree Nuts',
    symbol: 'almonds.png',
    refType: EReferenceType.allergyWarning
  },
  {
    title: 'Sesame',
    symbol: 'sesame.png',
    refType: EReferenceType.allergyWarning
  },
  {
    title: 'Soy',
    symbol: 'soybean.png',
    refType: EReferenceType.allergyWarning
  },
  {
    title: 'Eggs',
    symbol: 'egg.png',
    refType: EReferenceType.allergyWarning
  },
  {
    title: 'Peanuts',
    symbol: 'peanut.png',
    refType: EReferenceType.allergyWarning
  },
  {
    title: 'Sulfides',
    symbol: 'sulfide.png',
    refType: EReferenceType.allergyWarning
  },
  {
    title: 'Celery',
    symbol: 'celery.png',
    refType: EReferenceType.allergyWarning
  }
];
