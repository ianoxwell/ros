import { CMessage } from '@base/message.class';
import { Conversion } from '@controllers/ingredient/conversion/conversion.entity';
import { Ingredient } from '@controllers/ingredient/ingredient.entity';
import { IngredientService } from '@controllers/ingredient/ingredient.service';
import { Measurement } from '@controllers/measurement/measurement.entity';
import { RecipeIngredient } from '@controllers/recipe/recipe-ingredient/recipe-ingredient.entity';
import { Recipe } from '@controllers/recipe/recipe.entity';
import { ScheduleRecipe } from '@controllers/schedule/schedule-recipe.entity';
import { Schedule } from '@controllers/schedule/schedule.entity';
import { ScheduleService } from '@controllers/schedule/schedule.service';
import { IConversion } from '@models/conversion.dto';
import { IIngredientShort } from '@models/ingredient.dto';
import { IMeasurement } from '@models/measurement.dto';
import { IOrder } from '@models/order.dto';
import { IRecipeIngredient } from '@models/recipe-ingredient.dto';
import { ISchedule, IScheduleRecipe } from '@models/schedule.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getDateIndex } from '@services/utils';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    private scheduleService: ScheduleService,
    private ingredientService: IngredientService,
    @InjectRepository(Recipe) private readonly repository: Repository<Recipe>,
    @InjectRepository(Measurement) private readonly measurementRepository: Repository<Measurement>

    // @InjectRepository(Schedule) private readonly repository: Repository<Schedule>
  ) {}
  async getOrdersByDate(userId: number, fromDate: Date, toDate: Date): Promise<IOrder | CMessage> {
    console.time('get orders start');
    const measures = await this.measurementRepository.find();
    const scheduledItems: ISchedule[] = await this.scheduleService.getScheduleDateOrBetween(userId, fromDate, toDate);
    const uniqueRecipes: IScheduleRecipe[] = [];
    const uniqueIngredients: Ingredient[] = [];
    const uniqueRecipeIngredients: RecipeIngredient[] = [];

    scheduledItems.forEach((item) => {
      item.scheduleRecipes.forEach((recipe) => {
        const existingRecipe = uniqueRecipes.find((ur) => ur.recipeId === recipe.recipeId);
        existingRecipe ? (existingRecipe.quantity += recipe.quantity) : uniqueRecipes.push(recipe);
      });
    });

    const recipeIds = uniqueRecipes.map((ur) => ur.recipeId);
    const rawRecipes: any[] = await this.repository.query(
      `SELECT r.*, 
        json_agg(DISTINCT i.*) FILTER (WHERE i.id IS NOT NULL) AS ingredients,
        jsonb_agg(DISTINCT c.*) FILTER (WHERE c.id IS NOT NULL) AS "ingredientConversions", 
        json_agg(DISTINCT ri.*) FILTER (WHERE ri.id IS NOT NULL) AS "ingredientList"
        FROM recipe r
        LEFT JOIN recipe_ingredient ri ON ri."recipeId" = r.id
        LEFT JOIN ingredient i on i.id = ri."ingredientId"
        LEFT JOIN conversion c on c."ingredientId" = i.id
        WHERE r.id = ANY($1::INT[])
        GROUP BY r.id`,
      [recipeIds]
    );
    rawRecipes.forEach((rr) => {
      if (!rr.ingredientList || !rr.ingredients || !rr.ingredientConversions) {
        console.log('recipe has a null error for ingredients', rr.id, rr.name);
        return;
      }

      rr.ingredients = rr.ingredients.map((i) => ({
        ...i,
        purchasedBy: parseInt(i.purchasedBy.toString()),
        preferredShoppingUnit: i.preferredShoppingUnitId ? measures.find((m) => m.id === i.preferredShoppingUnitId) : null,
        conversions: rr.ingredientConversions
          .filter((ic: Conversion) => ic.ingredientId === i.id)
          .map((ic) => ({ ...ic, sourceUnitId: parseInt(ic.sourceUnitId) }))
      }));

      const findUniqueRecipe = uniqueRecipes.find((ur: IScheduleRecipe) => ur.recipeId === rr.id);
      const convertedIngredients = convertIngredientAmounts(rr.ingredientList, rr.ingredients, findUniqueRecipe?.quantity || 1);
      convertedIngredients.forEach((ci: RecipeIngredient) => {
        const existingRecipeIngredient = uniqueRecipeIngredients.find((ui) => ui.ingredientId === ci.ingredientId);
        existingRecipeIngredient ? (existingRecipeIngredient.amount += ci.amount) : uniqueRecipeIngredients.push(ci);
        const existingIngredient = uniqueIngredients.find((ui) => ui.id === ci.ingredientId);
        if (!existingRecipeIngredient) {
          const findIngredient = rr.ingredients.find((i) => i.id === ci.ingredientId);
          if (findIngredient) {
            uniqueIngredients.push(findIngredient as Ingredient);
          }
        }
      });
    });
    // the uniqueIngredients are currently in grams - convert to the preferred unit

    console.timeEnd('get orders start');
    return {
      dateIndexStart: getDateIndex(fromDate),
      recipes: uniqueRecipes,
      ingredients: uniqueRecipeIngredients
      .map((i) => convertIngredientGramsToPreferred(i, uniqueIngredients, measures))
      .map((i) => this.ingredientService.mapRecipeIngredientToIRecipeIngredientDto({ ...i, recipeId: 0 }, 0, measures, uniqueIngredients))
      .sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name))
    };
  }
}

// Start with a recipe with recipeIngredients - this is then multiplied by the quantity needed of the recipe
// each ingredient in the recipe is then converted to grams
// then the ingredient is either added to or pushed to the ingredientList - as grams
// then convert the ingredient from grams back into the preferred amount
// 1 tsp of asparagus is? - should be converted to pieces -

function convertIngredientGramsToPreferred(
  recipeIngredient: RecipeIngredient,
  ingredients: Ingredient[],
  measures: Measurement[]
): RecipeIngredient {
  // find out what measure it is purchased by and then convert the grams to that
  const ingredient = ingredients.find((i) => i.id === recipeIngredient.ingredientId);
  if (!ingredient) {
    return recipeIngredient;
  }

  // most likely initially undefined
  let convertMeasure = recipeIngredient.measure;
  if (ingredient.preferredShoppingUnit) {
    convertMeasure = measures.find((m) => m.id === ingredient.preferredShoppingUnit.id);
  }

  const filterMeasures = measures.filter(
    (m) => m.measurementType === ingredient.purchasedBy && ingredient.conversions?.find((c) => c.sourceUnitId === m.id)
  );

  if (!!filterMeasures.length && !convertMeasure) {
    // This is a best guess at this point and will probably do
    convertMeasure = filterMeasures[0];
  }

  if (!convertMeasure) {
    // attempt to match the recipeIngredient conversion measureId - else fall back to grams
    convertMeasure = measures.find((m) => m.id === recipeIngredient.measureId) || measures.find((m) => m.title === 'Grams');
  }

  const conversionChosen = ingredient.conversions?.find((c) => c.sourceUnitId === convertMeasure.id);
  recipeIngredient.amount = recipeIngredient.amount / (conversionChosen?.targetAmount || 1);
  recipeIngredient.measure = convertMeasure;
  recipeIngredient.measureId = convertMeasure.id;

  return recipeIngredient;
}

function convertIngredientAmounts(ingredientList: RecipeIngredient[], ingredients: IIngredientShort[], quantity: number) {
  return ingredientList.map((item: RecipeIngredient) => {
    const ingredient = ingredients.find((ing) => ing.id === item.ingredientId);
    if (!ingredient) {
      console.warn(`No matching ingredient found for ID ${item.ingredientId}`);
      return { ...item, convertedAmount: null };
    }

    const conversion = ingredient.conversions.find((conv: IConversion) => conv.sourceUnitId === item.measureId);

    if (conversion) {
      return { ...item, amount: conversion.targetAmount * item.amount * quantity };
    } else {
      console.log(`No conversion found for ${ingredient.name} using measure ID ${item.measureId}. Falling back to measure.quantity.`);
      return { ...item, convertedAmount: item.amount * quantity };
    }
  });
}
