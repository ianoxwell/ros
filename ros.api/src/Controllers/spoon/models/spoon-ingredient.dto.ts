export class ISpoonIngredient {
  id: number;
  original: string;
  originalName: string;
  name: string;
  amount: number;
  unit: string;
  unitShort: string;
  unitLong: string;
  possibleUnits: string[]; // g, cup, serving, tablespoon, oz
  estimatedCost: {
    value: number;
    /** Typically 'US Cents' */
    unit: string;
  };
  consistency: string; // liquid (or LIQUID), solid
  shoppingListUnits: string[]; // ounces, quarts, gallons (Disregard)
  aisle: string;
  image: string;
  meta: string[]; // added descriptors such as ['fresh', 'sliced', 'for garnish'] - Fresh chives or green onions, sliced, for garnish
  nutrition: {
    nutrients: INutritionItem[];
    properties: INutritionItem[];
    flavanoids: INutritionItem[];
    caloricBreakdown: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
    };
    weightPerServing: {
      amount: number;
      unit: string;
    };
  };

  categoryPath: string[];
}

export interface INutritionItem {
  title?: string;
  name?: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds?: number;
}
