// import { HttpService } from '@nestjs/axios';
import { CMessage } from '@base/message.class';
import {
  IEquipmentStepDto,
  IRecipeSteppedInstructionDto
} from '@controllers/recipe/recipe-stepped-instructions/recipe-stepped-instructions.model';
import { EPurchasedBy } from '@models/ingredient.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ConfigService } from '@nestjs/config';
import { FileService } from '@services/file.service';
import { isMessage } from '@services/utils';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { Conversion } from '../ingredient/conversion/conversion.entity';
import { ConversionService } from '../ingredient/conversion/conversion.service';
import { Ingredient } from '../ingredient/ingredient.entity';
import { IngredientService } from '../ingredient/ingredient.service';
import { CNutrientUnits } from '../ingredient/nutrient-units.const';
import { Measurement } from '../measurement/measurement.entity';
import { MeasurementService } from '../measurement/measurement.service';
import { CuisineType } from '../recipe/cuisine-type/cuisine-type.entity';
import { DishType } from '../recipe/dish-type/dish-type.entity';
import { Equipment } from '../recipe/equipment/equipment.entity';
import { HealthLabel } from '../recipe/health-label/health-label.entity';
import { RecipeIngredient } from '../recipe/recipe-ingredient/recipe-ingredient.entity';
import { Recipe } from '../recipe/recipe.entity';
import { RecipeService } from '../recipe/recipe.service';
import { ISpoonConversion } from './models/spoon-conversion.dto';
import { INutritionItem, ISpoonIngredient } from './models/spoon-ingredient.dto';
import {
  AnalyzedInstruction,
  ExtendedIngredient,
  IRandomRecipeResponse,
  IShortIngredient,
  ISpoonMeasure,
  ISpoonRecipe,
  SpoonEquipment,
  Step
} from './models/spoon-random-recipe.dto';
import { ISpoonSuggestions } from './models/spoon-suggestions.dto';

@Injectable()
export class SpoonService {
  private spoonApi: string;
  private spoonKey: string;
  private delayApi = 500; // delay time in between requests.
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    private ingredientService: IngredientService,
    private measurementService: MeasurementService,
    private conversionService: ConversionService,
    private recipeService: RecipeService,
    private fileService: FileService
  ) {
    this.spoonApi = this.config.get<string>('SPOON_API');
    this.spoonKey = this.config.get<string>('SPOON_KEY');
  }

  /** Wraps the common code from the axios httpService - what a waste of space?? */
  private async getAxiosHttp<T>(url: string): Promise<T> {
    return await firstValueFrom(
      this.httpService.get(url, { headers: { 'Accept-Encoding': 'gzip,deflate,compress' } }).pipe(
        map((resp: AxiosResponse) => {
          if (resp.headers['X-API-Quota-Left']) {
            console.log('quota remaining', resp.headers['X-API-Quota-Left']);
          }

          return resp.data as T;
        })
      )
    );
  }

  /** list of ingredient suggestions, with id, aisle and possible measurements. */
  async getSpoonIngredientSuggestion(foodName: string, limit = 5): Promise<ISpoonSuggestions[]> {
    limit = limit > 50 ? 50 : Math.abs(limit);
    const url = `?${this.spoonApi}/food/ingredients/autocomplete?query=${foodName}&number=${limit}&metaInformation=true&apiKey=${this.spoonKey}`;

    return await this.getAxiosHttp<ISpoonSuggestions[]>(url);
  }

  /** Get a spoonacular recipe suggestion, non-random response, e.g. keto, recipe 1 will always be the same. */
  async getSpoonRecipeSuggestion(diet: string, intolerances: string, limit = 1, offset = 1, title?: string): Promise<any> {
    let queryStr = `?number=${limit}&offset=${offset}&fillIngredients=false&addRecipeInformation=true&addRecipeNutrition=false`;
    if (title && title.length > 1) {
      queryStr = queryStr + `&query=${title}`;
    }

    if (diet.length > 1) {
      queryStr = queryStr + `&diet=${diet}`;
    }

    if (intolerances.length > 1) {
      queryStr = queryStr + `&intolerances=${intolerances}`;
    }

    queryStr = queryStr + `&apiKey=${this.spoonKey}`;
    return await this.getAxiosHttp<any>(`${this.spoonApi}/recipes/complexSearch${queryStr}`);
  }

  /** Get the specific information about an ingredient that you have the id for. */
  async getSpoonIngredientById(id: string, amount?: number, unit?: string): Promise<Ingredient> {
    amount = amount || 100;
    unit = unit || 'grams';
    const spoonCheck = await this.ingredientService.spoonIngredientIdExists(parseInt(id));

    if (typeof spoonCheck === 'boolean') {
      const url = `${this.spoonApi}/food/ingredients/${id}/information?amount=${amount}&unit=${unit}&apiKey=${this.spoonKey}`;
      const spoonIngredient = await this.getAxiosHttp<ISpoonIngredient>(url);

      const spoonNameCheck = await this.ingredientService.spoonIngredientNameExists(spoonIngredient);
      await this.fileService.saveJsonFile(`ingredient - ${spoonIngredient.name}`, spoonIngredient);

      return typeof spoonNameCheck === 'boolean' ? await this.createIngredientFromSpoon(spoonIngredient) : spoonNameCheck;
    }

    return spoonCheck as Ingredient;
  }

  /** Get conversion of food from source unit to generally grams. */
  async getSpoonConversion(foodName: string, sourceUnit: Measurement, sourceAmount: number, targetUnit: string): Promise<ISpoonConversion> {
    const url = `${this.spoonApi}/recipes/convert?ingredientName=${foodName}&sourceUnit=${sourceUnit.shortName}&sourceAmount=${sourceAmount}&targetUnit=${targetUnit}&apiKey=${this.spoonKey}`;

    const spoonConversion = await this.getAxiosHttp<ISpoonConversion>(url);
    spoonConversion.sourceUnitM = sourceUnit;

    return spoonConversion;
  }

  async populateConversions(id: string, measures: Measurement[]): Promise<Conversion[] | CMessage> {
    const ingredient = await this.ingredientService.getIngredientEntity(id);
    const pUnits = await this.ingredientService.getRecipeIngredientsByIngredientId(parseInt(id), measures);

    if (isMessage(pUnits)) {
      return pUnits;
    }

    const grams: Measurement = await this.measurementService.findGrams();

    const spoonConverts = await Promise.all(
      pUnits.awaitingConversions
        .filter((unit: Measurement) => unit.title !== grams.title)
        .map(async (c: Measurement, index: number) => {
          const spoonConvert = await this.waitForMe<ISpoonConversion>(
            this.getSpoonConversion(pUnits.name, c, 1, 'grams'),
            this.delayApi * index
          );

          const newConvert = new Conversion();
          newConvert.sourceAmount = spoonConvert.sourceAmount;
          newConvert.sourceUnit = spoonConvert.sourceUnitM;
          newConvert.targetAmount = spoonConvert.targetAmount;
          newConvert.targetUnit = grams; // grams from measurement.data
          newConvert.answer = spoonConvert.answer;
          newConvert.type = spoonConvert.type;
          newConvert.ingredientId = parseInt(id); // Set the ingredientId

          return this.conversionService.createConversion(newConvert);
        })
    );
    ingredient.possibleUnits = pUnits.awaitingConversions;
    await this.ingredientService.updateIngredientFromEntity(ingredient);

    return spoonConverts;
  }

  /** Gets a random spoon recipe that means tag condition. */
  async getSpoonRandomRecipe(tags: string): Promise<Recipe | CMessage> {
    const url = `${this.spoonApi}/recipes/random?number=1&tags=${tags}&fillIngredients=true&apiKey=${this.spoonKey}`;

    const recipes: IRandomRecipeResponse = await this.getAxiosHttp<IRandomRecipeResponse>(url);

    if (recipes.recipes?.length) {
      const spoonRecipe = recipes.recipes[0];
      if (await this.recipeService.isSpoonRecipeAlreadySaved(spoonRecipe)) {
        return new CMessage('Recipe already exists', HttpStatus.CONFLICT);
      }

      await this.fileService.saveJsonFile<ISpoonRecipe>(spoonRecipe.title, spoonRecipe);
      return await this.createSpoonRecipe(spoonRecipe);
    }

    return new CMessage('Did not get a recipe response, try again');
  }

  /** Gets a spoon recipe of specific id*/
  async getSpoonRecipeId(spoonId: number): Promise<Recipe | CMessage> {
    const url = `${this.spoonApi}/recipes/${spoonId}/information?apiKey=${this.spoonKey}`;

    const recipe: ISpoonRecipe = await this.getAxiosHttp<ISpoonRecipe>(url);

    if (recipe !== null) {
      const recipeCheck = await this.recipeService.getRecipeByName(recipe.title);
      if (typeof recipeCheck !== 'boolean') {
        const allSteppedInstructEquip = await this.mapSteppedInstructions(recipe.analyzedInstructions, recipeCheck.ingredients);
        recipeCheck.analyzedInstructions = allSteppedInstructEquip.steppedInstructions;
        if (!recipeCheck.images.length) {
          recipeCheck.images.push(recipe.image);
        }
        console.log('result', recipeCheck.analyzedInstructions);

        const updateRecipe = await this.recipeService.updateRecipeFromEntity(recipeCheck);

        return new CMessage(updateRecipe ? 'Recipe updated' : 'Recipe update fail', HttpStatus.CONFLICT);
      }

      return await this.createSpoonRecipe(recipe);
    }

    return new CMessage('Did not get a recipe response, try again');
  }

  /** This is the big one - creates the recipe from the spoonacular result. */
  private async createSpoonRecipe(spoonRecipe: ISpoonRecipe): Promise<CMessage> {
    const measurements: Measurement[] = await this.measurementService.findAllAsEntity();

    const diets: HealthLabel[] = await Promise.all(
      spoonRecipe.diets.map(async (diet: string) => await this.recipeService.createHealthLabel(diet))
    );
    const dishType: DishType[] = await Promise.all(
      spoonRecipe.dishTypes.map(async (dish: string) => await this.recipeService.createDishType(dish))
    );
    const cuisineType: CuisineType[] = await Promise.all(
      spoonRecipe.cuisines.map(async (cuisine: string) => await this.recipeService.createCuisineType(cuisine))
    );
    const ingredients: Ingredient[] = await Promise.all(
      this.uniqueByKeepFirst<ExtendedIngredient>(spoonRecipe.extendedIngredients, (it) => it.name).map(
        async (extIng: ExtendedIngredient, index: number) => {
          return await this.waitForMe<Ingredient>(this.getSpoonIngredientById(extIng.id.toString()), this.delayApi * index);
        }
      )
    );

    const newRecipe: Recipe = new Recipe();
    newRecipe.name = spoonRecipe.title;
    newRecipe.instructions = spoonRecipe.instructions;
    newRecipe.summary = spoonRecipe.summary;
    newRecipe.shortSummary = this.createSummary(spoonRecipe.summary);
    newRecipe.pricePerServing = spoonRecipe.pricePerServing;
    newRecipe.images = [spoonRecipe.image];
    newRecipe.preparationMinutes = spoonRecipe.preparationMinutes || -1;
    newRecipe.cookingMinutes = spoonRecipe.cookingMinutes || -1;
    newRecipe.readyInMinutes = spoonRecipe.readyInMinutes || -1;
    newRecipe.aggregateLikes = spoonRecipe.aggregateLikes;
    newRecipe.healthScore = spoonRecipe.healthScore;
    newRecipe.servings = spoonRecipe.servings;
    newRecipe.spoonId = spoonRecipe.id;
    newRecipe.sourceUrl = spoonRecipe.sourceUrl;
    newRecipe.creditsText = spoonRecipe.creditsText;
    newRecipe.license = spoonRecipe.license;
    newRecipe.sourceName = spoonRecipe.sourceName;
    newRecipe.spoonacularSourceUrl = spoonRecipe.spoonacularSourceUrl;
    newRecipe.vegetarian = spoonRecipe.vegetarian;
    newRecipe.vegan = spoonRecipe.vegan;
    newRecipe.glutenFree = spoonRecipe.glutenFree;
    newRecipe.dairyFree = spoonRecipe.dairyFree;
    newRecipe.veryHealthy = spoonRecipe.veryHealthy;
    newRecipe.cheap = spoonRecipe.cheap;
    newRecipe.veryPopular = spoonRecipe.veryPopular;
    newRecipe.sustainable = spoonRecipe.sustainable;
    newRecipe.lowFodmap = spoonRecipe.lowFodmap;
    newRecipe.weightWatcherSmartPoints = spoonRecipe.weightWatcherSmartPoints;
    newRecipe.gaps = spoonRecipe.gaps;
    newRecipe.ingredients = ingredients;
    newRecipe.cuisineType = cuisineType;
    newRecipe.dishType = dishType;
    newRecipe.diets = diets;

    const allSteppedInstructEquip = await this.mapSteppedInstructions(spoonRecipe.analyzedInstructions, ingredients);
    const ingredientList: RecipeIngredient[] = await this.mapRecipeIngredientList(
      spoonRecipe.extendedIngredients,
      ingredients,
      measurements,
      newRecipe
    );

    newRecipe.equipment = allSteppedInstructEquip.allEquipment;
    newRecipe.analyzedInstructions = allSteppedInstructEquip.steppedInstructions;
    newRecipe.ingredientList = ingredientList;
    console.log('newRecipe', newRecipe, spoonRecipe);

    const createdRecipe = await this.recipeService.createRecipeFromEntity(newRecipe);

    if (createdRecipe) {
      return new CMessage('Successful save, ' + createdRecipe.id, HttpStatus.OK);
    }

    return new CMessage('Failed to save', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  /** Uses the measurement results in the database to try to find a measurement match, else throws error. */
  private findMeasuresFromSpoon(spoonMeasure: ISpoonMeasure, measures: Measurement[]): Measurement {
    if (!spoonMeasure.unitShort.length && !spoonMeasure.unitLong.length) {
      spoonMeasure.unitShort = 'piece';
    }

    const findMeasure = measures.find(
      (measure: Measurement) =>
        measure.shortName === spoonMeasure.unitShort.toLowerCase() ||
        measure.altShortName === spoonMeasure.unitShort.toLowerCase() ||
        measure.title.toLowerCase() === spoonMeasure.unitLong.toLowerCase() ||
        spoonMeasure.unitLong.toLowerCase().includes(measure.title.toLowerCase())
    );

    // TODO this is not the best response - maybe a looser search method?
    if (!findMeasure) {
      console.log('unable to find measure', JSON.stringify(spoonMeasure));
      return measures[0];
    }

    return findMeasure;
  }

  /** Following the mapping of the spoonDto to ingredient the conversions are worked out and the whole ingredient is saved.  */
  private async createIngredientFromSpoon(spoon: ISpoonIngredient): Promise<Ingredient> {
    const newIngredient = await this.mapSpoonDtoIngredient(spoon);
    const grams: Measurement = await this.measurementService.findGrams();

    const conversions: Conversion[] = await Promise.all(
      newIngredient.possibleUnits
        .filter((unit: Measurement) => unit.title !== grams.title)
        .map(async (sourceUnit: Measurement, index: number) => {
          const spoonConvert = await this.waitForMe<ISpoonConversion>(
            this.getSpoonConversion(spoon.name, sourceUnit, 1, 'grams'),
            this.delayApi * index
          );

          const newConvert = new Conversion();
          newConvert.sourceAmount = spoonConvert.sourceAmount;
          newConvert.sourceUnit = spoonConvert.sourceUnitM;
          newConvert.targetAmount = spoonConvert.targetAmount;
          newConvert.targetUnit = grams; // grams from measurement.data
          newConvert.answer = spoonConvert.answer;
          newConvert.type = spoonConvert.type;
          newConvert.ingredientId = newIngredient.id; // Set the ingredientId

          return newConvert;
        })
    );
    newIngredient.conversions = conversions;

    try {
      const result = await this.ingredientService.createIngredientFromSpoon(newIngredient);
      return result as Ingredient;
    } catch (error) {
      throw new Error('Error in ingredient creation ' + error);
    }
  }

  /** This brings together all the ingredients relationships together (except conversions) - lots going on here. */
  private async mapSpoonDtoIngredient(spoon: ISpoonIngredient): Promise<Ingredient> {
    const purchasedBy = this.calcPurchasedBy(spoon);
    const nutrients = this.spoonNutrientsToEntity(spoon.nutrition.nutrients);
    const nutritionProperties = this.spoonNutrientPropertiesToEntity(spoon.nutrition.properties);
    const possibleUnits = await this.mapPossibleUnitsMeasurements(spoon.possibleUnits);
    const ing: Ingredient = {
      name: spoon.name,
      originalName: spoon.originalName,
      // https://spoonacular.com/food-api/docs#Show-Images
      image: spoon.image,
      externalId: spoon.id,
      possibleUnits,
      allergies: [],
      conversions: [],
      recipeIngredientList: [],
      estimatedCost: spoon.estimatedCost.value,
      estimatedCostUnit: spoon.estimatedCost.unit,
      purchasedBy,
      aisle: spoon.aisle,
      ...nutrients,
      percentProtein: spoon.nutrition.caloricBreakdown.percentProtein,
      percentFat: spoon.nutrition.caloricBreakdown.percentFat,
      percentCarbs: spoon.nutrition.caloricBreakdown.percentCarbs,
      ...nutritionProperties,
      isActive: true
    };

    return ing;
  }

  /** Each ingredient should have a primary purchase, e.g. celery is purchased by bunch and milk is purchased litres, by default items are purchased by weight - for example a kilo of flour. */
  private calcPurchasedBy(spoon: ISpoonIngredient): EPurchasedBy {
    if (spoon.consistency.toLowerCase() === 'liquid') {
      return EPurchasedBy.volume;
    }

    if (spoon.consistency.toLowerCase() === 'solid' && spoon.possibleUnits.includes('bunch')) {
      return EPurchasedBy.bunch;
    }

    if (spoon.consistency.toLowerCase() === 'solid' && spoon.possibleUnits.includes('each')) {
      return EPurchasedBy.individual;
    }

    return EPurchasedBy.weight;
  }

  /** Wow the nutrients list is stupidly long! Short cut used a known const to loop through and set nutrient values. */
  private spoonNutrientsToEntity(spoon: INutritionItem[]): Partial<Ingredient> {
    const ing: Partial<Ingredient> = {};
    Object.keys(CNutrientUnits).forEach((key: string) => {
      const item = CNutrientUnits[key];
      const foundNutrient = spoon.find((nutrient: INutritionItem) => {
        if (nutrient.hasOwnProperty('title')) {
          return nutrient.title === item.name;
        }

        return nutrient.name === item.name;
      });

      ing[key] = !!foundNutrient ? foundNutrient.amount : null;
    });

    return ing;
  }

  /** short cut for just mapping the nutrition values to local keys. */
  private spoonNutrientPropertiesToEntity(spoon: INutritionItem[]): Partial<Ingredient> {
    const ing: Partial<Ingredient> = {};
    const nutritionProperties = {
      glycemicIndex: 'Glycemic Index',
      glycemicLoad: 'Glycemic Load',
      nutritionScore: 'Nutrition Score'
    };
    Object.keys(nutritionProperties).forEach((key: string) => {
      const foundNutrient = spoon.find((prop: INutritionItem) => prop.title === CNutrientUnits[key]);

      ing[key] = !!foundNutrient ? foundNutrient.amount : null;
    });

    return ing;
  }

  /** Attempts to associate/link the possible measurements for a spoon ingredient through to known measurement units. */
  private async mapPossibleUnitsMeasurements(units: string[]): Promise<Measurement[]> {
    const measures = await this.measurementService.findAllAsEntity();

    const matchedMeasures: Measurement[] = [];
    units.forEach((unit: string) => {
      const result = measures.find(
        (m: Measurement) => unit === m.title.toLowerCase() || unit === m.shortName.toLowerCase() || unit === m.altShortName?.toLowerCase()
      );
      if (!!result) {
        matchedMeasures.push(result);
      }
    });

    return matchedMeasures;
  }

  /** Maps the analyzed instructions -> step through to stepped instructions. */
  private async mapSteppedInstructions(
    analyzedInstructions: AnalyzedInstruction[],
    ingredients: Ingredient[]
  ): Promise<{ steppedInstructions: IRecipeSteppedInstructionDto[]; allEquipment: Equipment[] }> {
    const equipmentDb = await this.recipeService.getAllEquipment();
    const steppedInstructions: IRecipeSteppedInstructionDto[] = [];
    const allEquipment: Equipment[] = [];

    await Promise.all(
      analyzedInstructions.map(async (namedStep: AnalyzedInstruction) => {
        await Promise.all(
          namedStep.steps.map(async (step: Step) => {
            const stepIngredientIds = step.ingredients.map((ing: IShortIngredient) => ing.id);
            const ingredientIds = ingredients
              .filter((item: Ingredient) => stepIngredientIds.includes(item.externalId))
              .map((item) => item.id);

            const steppedInstruction: IRecipeSteppedInstructionDto = {
              step: step.step,
              stepName: namedStep.name,
              stepNumber: step.number,
              lengthTimeValue: step.length?.number,
              lengthTimeUnit: step.length?.unit,
              equipment: [],
              ingredientIds
            };

            const equipment: IEquipmentStepDto[] = await Promise.all(
              step.equipment.map(async (equip: SpoonEquipment) => {
                const existingEquip: Equipment | undefined = equipmentDb.find((item) => item.spoonId === equip.id);
                const equipItem = existingEquip || (await this.recipeService.createSpoonEquipment(equip));
                if (!allEquipment.find((allEquip: Equipment) => allEquip.spoonId === equip.id)) {
                  allEquipment.push(equipItem);
                }

                const steppedEquip: IEquipmentStepDto = {
                  equipmentId: equipItem.id,
                  temperature: equip.temperature?.number,
                  temperatureUnit: equip.temperature?.unit
                };

                return steppedEquip;
              })
            );
            steppedInstruction.equipment = equipment;
            steppedInstructions.push(steppedInstruction);
          })
        );
      })
    );

    return { steppedInstructions, allEquipment };
  }

  /** Maps the extended ingredient list to an ingredient list, including the associated ingredient. */
  private async mapRecipeIngredientList(
    extendedIngredients: ExtendedIngredient[],
    ingredients: Ingredient[],
    measurements: Measurement[],
    newRecipe: Recipe
  ): Promise<RecipeIngredient[]> {
    return await Promise.all(
      extendedIngredients.map(async (extIng: ExtendedIngredient) => {
        const ingredient: Ingredient | undefined = ingredients.find((item: Ingredient) => item.externalId === extIng.id);
        const measure = this.findMeasuresFromSpoon(extIng.measures.metric, measurements);
        const reIngredient: RecipeIngredient = {
          ingredientId: ingredient.id,
          ingredient,
          amount: extIng.measures.metric.amount,
          consistency: extIng.consistency,
          meta: extIng.meta,
          measure,
          measureId: measure.id,
          recipeId: newRecipe.id,
          recipe: newRecipe
        };

        return reIngredient;
      })
    );
  }

  /** Utility methods */
  private createSummary(summary: string): string {
    if (summary.length < 240) {
      return summary;
    }

    return summary.substring(0, 237) + '...';
  }

  private uniqueByKeepFirst<T>(a: T[], key) {
    const seen = new Set();
    return a.filter((item) => {
      const k = key(item);
      return seen.has(k) ? false : seen.add(k);
    });
  }

  private async waitForMe<T>(premise: Promise<T>, milliseconds: number): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(premise);
      }, milliseconds);
    });
  }
}
