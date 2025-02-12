export interface IEquipmentIngredient {
  id: number;
  name: string;
  localizedName: string;
  image: string;
}

export interface IAnalyzedSteps {
  number: number;
  step: string;
  equipment: IEquipmentIngredient[];
  ingredients: IEquipmentIngredient[];
}
export interface IAnalyzedInstructions {
  name: string;
  steps: IAnalyzedSteps[];
}

export interface IIngredientMeasures {
  amount: number;
  unitLong: string;
  unitShort: string;
}

export interface IExtendedIngredients {
  aisle: string;
  amount: number;
  consistency: string;
  id: number;
  image: string;
  measures: {
    us: IIngredientMeasures;
    metric: IIngredientMeasures;
  };
  meta: string[];
  metaInformation: string[];
  name: string;
  original: string;
  originalName: string;
  originalString: string;
  unit: string;
}

export interface ISpoonacularRecipeModel {
  aggregateLikes: number;
  analyzedInstructions: IAnalyzedInstructions[];
  cheap: boolean;
  creditsText: string;
  cuisines: string[];
  dairyFree: boolean;
  diets: string[];
  dishTypes: string[];
  extendedIngredients: IExtendedIngredients[];
  gaps: string; // Gut and Psychology Syndrome
  glutenFree: boolean;
  healthScore: number;
  id: number;
  image: string;
  imageType: string;
  instructions: string;
  license: string;
  lowFodmap: boolean;
  occasions: string[];
  originalId: number;
  pricePerServing: number;
  readyInMinutes: number;
  servings: number;
  sourceName: string;
  sourceUrl: string;
  spoonacularScore: number;
  spoonacularSourceUrl: string;
  summary: string;
  sustainable: boolean;
  title: string;
  vegan: boolean;
  vegetarian: boolean;
  veryHealthy: boolean;
  veryPopular: boolean;
  weightWatcherSmartPoints: number;
}

export interface IRawReturnedRecipes {
  recipes: ISpoonacularRecipeModel[];
}
