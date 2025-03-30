import { IIngredientShort } from '@models/ingredient.dto';
import { calculateRecipeNutrition } from './recipe-nutrition-calculator';
import { IRecipeIngredient } from '@models/recipe-ingredient.dto';

const MockIngredientListOil: IRecipeIngredient = {
  id: 317,
  ingredientId: 117,
  recipeId: 59,
  amount: 2,
  unit: 'Tablespoon',
  consistency: 'LIQUID',
  meta: [''],
  measure: {
    id: 2,
    title: 'Tablespoon',
    measurementType: 1,
    shortName: 'tbsp',
    quantity: 20.0,
    countryCode: 0
  },
  ingredient: {
    id: 117,
    name: 'extra virgin olive oil',
    originalName: 'extra-virgin olive oil',
    image: 'olive-oil.jpg',
    aisle: 'Oil, Vinegar, Salad Dressing'
  }
};

const MockIngredientOil: IIngredientShort = {
  id: 117,
  name: 'extra virgin olive oil',
  originalName: 'extra-virgin olive oil',
  image: 'olive-oil.jpg',
  aisle: 'Oil, Vinegar, Salad Dressing',
  nutrition: {
    nutrients: {
      alcohol: 0,
      caffeine: 0,
      calories: 884,
      carbohydrates: 0,
      cholesterol: 0,
      fat: 100,
      fiber: 0,
      monoUnsaturatedFat: 73,
      netCarbohydrates: 0,
      polyUnsaturatedFat: 10.5,
      protein: 0,
      saturatedFat: 13.8,
      sugar: 0,
      transFat: null
    },
    vitamins: {
      folate: 0,
      folicAcid: 0,
      vitaminA: 0,
      vitaminB1: 0,
      vitaminB12: 0,
      vitaminB2: 0,
      vitaminB3: 0,
      vitaminB5: 0,
      vitaminB6: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminE: 14.4,
      vitaminK: 60.2
    },
    minerals: {
      calcium: 1,
      choline: 0.3,
      copper: 0,
      fluoride: null,
      iodine: null,
      iron: 0.56,
      magnesium: 0,
      manganese: 0,
      phosphorus: 0,
      potassium: 1,
      selenium: 0,
      sodium: 2,
      zinc: 0
    },
    properties: {
      glycemicIndex: 0,
      glycemicLoad: 0,
      nutritionScore: 0
    },
    caloricBreakdown: {
      percentProtein: 0,
      percentFat: 100,
      percentCarbs: 0
    }
  },
  conversions: [
    {
      ingredientId: 117,
      sourceAmount: 1,
      sourceUnitId: 3,
      sourceUnit: {
        id: 3,
        title: 'Teaspoon',
        measurementType: 1,
        shortName: 'tsp',
        altShortName: 'tsps',
        quantity: 5.0,
        countryCode: 0
      },
      targetAmount: 4.5,
      targetUnitId: 7,
      targetUnit: {
        id: 7,
        title: 'Grams',
        measurementType: 0,
        shortName: 'g',
        altShortName: 'gr',
        quantity: 0.001,
        countryCode: 0
      },
      answer: '1 tsp extra virgin olive oil are 4.5 grams.'
    },
    {
      ingredientId: 117,
      sourceAmount: 1,
      sourceUnitId: 13,
      sourceUnit: {
        id: 13,
        title: 'Servings',
        measurementType: 2,
        shortName: 'serving',
        altShortName: null,
        quantity: 1.0,
        countryCode: 2
      },
      targetAmount: 14,
      targetUnitId: 7,
      targetUnit: {
        id: 7,
        title: 'Grams',
        measurementType: 0,
        shortName: 'g',
        altShortName: 'gr',
        quantity: 0.001,
        countryCode: 0
      },
      answer: '1 serving extra virgin olive oil are 14 grams.'
    },
    {
      ingredientId: 117,
      sourceAmount: 1,
      sourceUnitId: 2,
      sourceUnit: {
        id: 2,
        title: 'Tablespoon',
        measurementType: 1,
        shortName: 'tbsp',
        altShortName: 'tbsps',
        quantity: 20.0,
        countryCode: 0
      },
      targetAmount: 14,
      targetUnitId: 7,
      targetUnit: {
        id: 7,
        title: 'Grams',
        measurementType: 0,
        shortName: 'g',
        altShortName: 'gr',
        quantity: 0.001,
        countryCode: 0
      },
      answer: '1 tbsp extra virgin olive oil are 14 grams.'
    }
  ]
};

describe('RecipeNutritionCalculator', () => {
  it('should give a valid summary of fats, protein and carbs', () => {
    const numberOfServes = 30;
    const nutrition = calculateRecipeNutrition([MockIngredientListOil], [MockIngredientOil], numberOfServes);

    // conversion should be tablespoon with a target amount of 14g
    const conversion = MockIngredientOil.conversions.find((c) => c.sourceUnitId === MockIngredientListOil.measure.id);
    // the recipe calls for 2 tablespoons - so now 28g
    const scaledFat = MockIngredientListOil.amount * conversion.targetAmount;
    // the expected scaled amount is 100g of fat for 100g of olive oil, so 1 g of fat for 1g of oliveOil * 28
    const expectedFat = (MockIngredientOil.nutrition.nutrients.fat / 100) * scaledFat;

    // so the expected result is 28/30 (0.9333)
    expect(nutrition.nutrients.fat).toBe(expectedFat / numberOfServes);
  });
});
