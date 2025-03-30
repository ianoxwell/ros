import { ICaloricBreakdown, IIngredientShort, INutrition } from '@models/ingredient.dto';
import { IRecipeIngredient } from '@models/recipe-ingredient.dto';

function scaleValues<T>(values: T, amount: number): T {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, (value / 100) * amount])) as T;
}

function addValues<T>(target: T, source: T): T {
  return Object.fromEntries(Object.entries(target).map(([key, value]) => [key, value + source[key]])) as T;
}

function normalizeCaloricBreakdown(breakdown: ICaloricBreakdown): ICaloricBreakdown {
  // the percents at this point are actually total g of protein, fat and carbs
  const total = breakdown.percentProtein + breakdown.percentFat + breakdown.percentCarbs;
  return {
    percentProtein: (breakdown.percentProtein / total) * 100,
    percentFat: (breakdown.percentFat / total) * 100,
    percentCarbs: (breakdown.percentCarbs / total) * 100
  };
}

function convertIngredientAmounts(ingredientList: IRecipeIngredient[], ingredients: IIngredientShort[], servings: number) {
  return ingredientList.map((item) => {
    const ingredient = ingredients.find((ing) => ing.id === item.ingredientId);
    if (!ingredient) {
      console.warn(`No matching ingredient found for ID ${item.ingredientId}`);
      return { ...item, convertedAmount: null };
    }

    const conversion = ingredient.conversions.find((conv) => conv.sourceUnitId === item.measure.id);
    if (conversion) {
      return { ...item, convertedAmount: (conversion.targetAmount * item.amount) / servings };
    } else {
      console.log(`No conversion found for ${ingredient.name} using measure ID ${item.measure.id}. Falling back to measure.quantity.`);
      return { ...item, convertedAmount: item.amount / servings };
    }
  });
}

export function calculateRecipeNutrition(
  ingredientList: IRecipeIngredient[],
  ingredients: IIngredientShort[],
  servings: number
): INutrition {
  const totalNutrition = { ...CBlankNutritionValues };

  const convertedIngredients = convertIngredientAmounts(ingredientList, ingredients, servings);

  convertedIngredients.forEach((item) => {
    const ingredient = ingredients.find((ing) => ing.id === item.ingredientId);
    if (ingredient && item.convertedAmount) {
      const scaledNutrition = {
        nutrients: scaleValues(ingredient.nutrition.nutrients, item.convertedAmount),
        vitamins: scaleValues(ingredient.nutrition.vitamins, item.convertedAmount),
        minerals: scaleValues(ingredient.nutrition.minerals, item.convertedAmount),
        properties: scaleValues(ingredient.nutrition.properties, item.convertedAmount),
        caloricBreakdown: scaleValues(ingredient.nutrition.caloricBreakdown, item.convertedAmount)
      };

      totalNutrition.nutrients = addValues(totalNutrition.nutrients, scaledNutrition.nutrients);
      totalNutrition.vitamins = addValues(totalNutrition.vitamins, scaledNutrition.vitamins);
      totalNutrition.minerals = addValues(totalNutrition.minerals, scaledNutrition.minerals);
      totalNutrition.properties = addValues(totalNutrition.properties, scaledNutrition.properties);
      totalNutrition.caloricBreakdown = addValues(totalNutrition.caloricBreakdown, scaledNutrition.caloricBreakdown);
    }
  });

  totalNutrition.caloricBreakdown = normalizeCaloricBreakdown(totalNutrition.caloricBreakdown);

  return totalNutrition;
}

export const CBlankNutritionValues: INutrition = {
  nutrients: {
    alcohol: 0,
    caffeine: 0,
    calories: 0,
    carbohydrates: 0,
    cholesterol: 0,
    fat: 0,
    fiber: 0,
    monoUnsaturatedFat: 0,
    netCarbohydrates: 0,
    polyUnsaturatedFat: 0,
    protein: 0,
    saturatedFat: 0,
    sugar: 0,
    transFat: 0
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
    vitaminE: 0,
    vitaminK: 0
  },
  minerals: {
    calcium: 0,
    choline: 0,
    copper: 0,
    fluoride: 0,
    iodine: 0,
    iron: 0,
    magnesium: 0,
    manganese: 0,
    phosphorus: 0,
    potassium: 0,
    selenium: 0,
    sodium: 0,
    zinc: 0
  },
  properties: {
    glycemicIndex: 0,
    glycemicLoad: 0,
    nutritionScore: 0
  },
  caloricBreakdown: {
    percentProtein: 0,
    percentFat: 0,
    percentCarbs: 0
  }
};
