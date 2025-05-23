import { PageMetaDto, PaginatedDto } from '@base//paginated.entity';
import { CPageOptionsDto } from '@base/filter.const';
import { IFilterBase } from '@base/filter.entity';
import { CMessage } from '@base/message.class';
import { EOrder } from '@models/base.dto';
import {
  EPurchasedBy,
  ICaloricBreakdown,
  IIngredient,
  IIngredientShort,
  IMinerals,
  INutrients,
  INutritionProperties,
  IReferenceShort,
  IVitamins,
  TPurchasedBy
} from '@models/ingredient.dto';
import { IMeasurement } from '@models/measurement.dto';
import { IRecipeIngredient } from '@models/recipe-ingredient.dto';
import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Like, Raw, Repository, UpdateResult } from 'typeorm';
import { Measurement } from '../measurement/measurement.entity';
import { RecipeIngredient } from '../recipe/recipe-ingredient/recipe-ingredient.entity';
import { Reference } from '../reference/reference.entity';
import { ISpoonIngredient } from '../spoon/models/spoon-ingredient.dto';
import { Conversion } from './conversion/conversion.entity';
import { CIngredientShort } from './ingredient-short.dto';
import { IIngredientEntityExtended, Ingredient } from './ingredient.entity';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient) private readonly repository: Repository<Ingredient>,
    @InjectRepository(Conversion) private readonly conversionRepository: Repository<Conversion>,
    @InjectRepository(Measurement) private readonly measurementRepository: Repository<Measurement>
  ) {}

  /**
   * Very quick delete ingredient by id - temp
   */
  async deleteIngredientById(id: number): Promise<CMessage> {
    const ingredient: Ingredient = await this.repository.findOne({
      where: { id, isActive: true },
      loadRelationIds: false
    });
    ingredient.isActive = false;

    const updateResult = await this.repository.update(ingredient.id, ingredient);
    return updateResult
      ? new CMessage('Success', HttpStatus.ACCEPTED)
      : new CMessage('Unable to find that ingredient', HttpStatus.NOT_FOUND);
  }

  /** Quick and dirty get ingredient by id */
  async getIngredientByIdForRecipe(id: number): Promise<Ingredient> {
    const ingredient: Ingredient = await this.repository.findOne({
      where: { id, isActive: true },
      loadRelationIds: true
    });

    const conversions = await Promise.all(
      (ingredient.conversions as unknown as number[]).map(async (convertId: number) => {
        return await this.conversionRepository.findOne({ where: { id: convertId } });
      })
    );

    ingredient.conversions = conversions;

    return ingredient;
  }

  async getIngredientEntity(id: string | number): Promise<Ingredient> {
    id = typeof id === 'number' ? id : parseInt(id);
    return this.repository.findOne({
      where: { id, isActive: true }
    });
  }

  async getIngredientByExternalId(externalId: number): Promise<Ingredient> {
    return this.repository.findOne({
      where: { externalId, isActive: true },
      relations: { conversions: true, possibleUnits: true, preferredShoppingUnit: true }
    });
  }
  async findLimitAsEntityMissingFields(limit: number): Promise<Ingredient[]> {
    return await this.repository.query(
      `SELECT i.*, 
      json_agg(DISTINCT m.*) FILTER (WHERE m.id IS NOT NULL) AS "possibleUnits", 
      json_agg(DISTINCT c.*) FILTER (WHERE c.id IS NOT NULL) AS "conversions",
      json_agg(distinct m2.*) FILTER (WHERE m2.id IS NOT NULL) AS "preferredShoppingUnit"
      FROM ingredient i
      LEFT JOIN ingredient_possible_units_measurement ipum ON ipum."ingredientId" = i.id
      LEFT JOIN measurement m ON m.id = ipum."measurementId"
      left join measurement m2 on m2.id = i."preferredShoppingUnitId" 
      LEFT JOIN conversion c ON c."ingredientId" = i.id
      WHERE i."isActive" = true 
      AND (i."preferredShoppingUnitId" IS NULL OR m.id IS NULL OR c.id IS NULL)
      GROUP BY i.id
      ORDER BY i.name
      LIMIT $1`,
      [limit]
    );
  }

  async getIngredientById(id: string | number): Promise<IIngredient> {
    id = typeof id === 'number' ? id : parseInt(id);
    const ingredient: IIngredientEntityExtended = await this.repository.query(
      `SELECT i.*, 
      json_agg(DISTINCT m.*) FILTER (WHERE m.id IS NOT NULL) AS "possibleUnits", 
      json_agg(DISTINCT c.*) FILTER (WHERE c.id IS NOT NULL) AS "conversions", 
      json_agg(DISTINCT r.*) FILTER (WHERE r.id IS NOT NULL) AS "allergies",
      jsonb_build_object(
      'id', m2.id,
      'title', m2.title,
      'measurementType', CAST(m2."measurementType"::text AS INT),
      'shortName', m2."shortName",
      'convertsToId', m2."convertsToIdId",
      'quantity', m2."quantity",
      'countryCode', CAST(m2."countryCode"::text AS INT)
      ) AS "preferredShoppingUnit",
      json_agg(DISTINCT jsonb_build_object(
      'id', rii."recipeId",
      'name', rec.name,
      'images', rec.images,
      'summary', rec.summary,
      'aggregateLikes', rec."aggregateLikes"
      )) FILTER (WHERE rii."recipeId" IS NOT NULL) AS "recipes"
      FROM ingredient i
      LEFT JOIN ingredient_possible_units_measurement ipum ON ipum."ingredientId" = i.id
      LEFT JOIN measurement m ON m.id = ipum."measurementId"
      LEFT JOIN measurement m2 ON m2.id = i."preferredShoppingUnitId" 
      LEFT JOIN conversion c ON c."ingredientId" = i.id
      LEFT JOIN ingredient_allergies_reference iar ON iar."ingredientId" = i.id
      LEFT JOIN reference r ON r.id = iar."referenceId"
      LEFT JOIN recipe_ingredients_ingredient rii ON rii."ingredientId" = i.id
      LEFT JOIN recipe rec ON rec.id = rii."recipeId"
      WHERE i.id = $1 AND i."isActive" = true
      GROUP BY i.id, m2.id`,
      [id]
    );

    const measures = await this.measurementRepository.find();

    return this.mapIngredientToIIngredientDTO(ingredient[0], measures);
  }
  /** Filter ingredients and paginate the results. */
  async getIngredients(pageOptionsDto: IFilterBase): Promise<PaginatedDto<IIngredientShort>> {
    const [result, itemCount] = await this.repository.findAndCount({
      where: {
        name: Raw((alias) => `LOWER(${alias}) Like '%${pageOptionsDto.keyword ? pageOptionsDto.keyword.toLowerCase() : ''}%'`),
        isActive: true
      },
      order: { [pageOptionsDto.sort || 'name']: pageOptionsDto.order || EOrder.DESC },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      relations: {
        possibleUnits: false,
        conversions: false,
        allergies: false
      }
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const fullResult = result.map((ing: Ingredient) => this.mapIngredientToIIngredientShort(ing));

    return new PaginatedDto(fullResult, pageMetaDto);
  }

  async getRecipeIngredientsByIngredientId(
    id: string | number,
    measures: Measurement[]
  ): Promise<CMessage | { name: string; awaitingConversions: Measurement[] }> {
    id = typeof id === 'number' ? id : parseInt(id);
    const ingredient = await this.repository.query(
      `SELECT i.name,
      json_agg(DISTINCT ipum.*) FILTER (WHERE ipum."measurementId" IS NOT NULL) AS "possibleUnits", 
      json_agg(DISTINCT c.*) FILTER (WHERE c.id IS NOT NULL) AS "conversions", 
      json_agg(DISTINCT ri.*) FILTER (WHERE ri.id IS NOT NULL) AS "ingredientList"
      FROM ingredient i
      LEFT JOIN ingredient_possible_units_measurement ipum ON ipum."ingredientId" = i.id
      LEFT JOIN recipe_ingredient ri ON ri."ingredientId" = i.id
      LEFT JOIN conversion c ON c."ingredientId" = i.id
      WHERE i.id = $1 AND i."isActive" = true
      GROUP BY i.id`,
      [id]
    );

    if (!Array.isArray(ingredient) || !ingredient.length) {
      return new CMessage('Unable to find ingredient', HttpStatus.NOT_FOUND);
    }

    const awaitingConversions = [];
    ingredient[0].ingredientList.forEach((item) => {
      if (ingredient[0]?.conversions?.find((c) => c.sourceUnitId === item.measureId)) {
        return;
      }

      if (awaitingConversions.find((m) => m.id === item.measureId)) {
        return;
      }

      const measure = measures.find((m) => m.id === item.measureId);
      if (measure) {
        awaitingConversions.push(measure);
      }
    });

    return { name: ingredient[0]?.name, awaitingConversions };
  }

  /** Given an array of ingredient id's return the ingredient */
  async getIngredientFromIdList(ingredientIds: number[]): Promise<Ingredient[]> {
    return await this.repository.find({ where: { id: In(ingredientIds) }, loadRelationIds: true });
  }

  /** Returns true IF the ingredient is NOT found. */
  async ingredientNameAvailable(name: string): Promise<boolean> {
    return await this.repository.findOne({ where: { name: ILike(name) } }).then((result: Ingredient) => {
      return result === null;
    });
  }

  /** Quick and dirty find all - at least it maps it to a pagination object to show number of results. */
  async findAll(): Promise<PaginatedDto<IIngredientShort>> {
    const [result, itemCount] = await this.repository.findAndCount({
      where: { isActive: true },
      relations: {
        possibleUnits: false,
        conversions: false
      }
    });
    const fullResult = result.map((ing: Ingredient) => this.mapIngredientToIIngredientShort(ing));
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: CPageOptionsDto });

    return new PaginatedDto(fullResult, pageMetaDto);
  }

  /** Update ingredient */
  async updateIngredient(id: number, ingredient: IIngredient): Promise<UpdateResult> {
    const ing: Ingredient = this.mapIIngredientDtoIngredient(ingredient);
    return await this.repository.update(id, ing);
  }

  async updateIngredientFromEntity(ingredient: Partial<Ingredient>): Promise<Ingredient> {
    const updatedRecipe = await this.repository.preload(ingredient);
    return await this.repository.save(updatedRecipe);
  }

  /** checks if the name exists and then attempts to create */
  async createIngredientFromDto(ingredient: IIngredient): Promise<Ingredient | CMessage> {
    const nameAvailable = await this.ingredientNameAvailable(ingredient.name);

    if (!nameAvailable) {
      return new CMessage('Ingredient name already exists', HttpStatus.CONFLICT);
    }

    if (ingredient.externalId) {
      const spoonCheck = await this.repository.findOne({ where: { externalId: ingredient.externalId } });
      if (!!spoonCheck) {
        return new CMessage('Ingredient with same spoon identity already exists', HttpStatus.CONFLICT);
      }
    }

    return await this.repository.save(this.mapIIngredientDtoIngredient(ingredient));
  }

  /** The ingredient should be unique in the spoonacularId should not already exist. */
  async spoonIngredientIdExists(externalId: number): Promise<Ingredient | boolean> {
    const spoonCheck = await this.repository.findOne({ where: { externalId } });

    return !!spoonCheck ? spoonCheck : false;
  }

  /** The name must also be unique. */
  async spoonIngredientNameExists(spoon: ISpoonIngredient): Promise<Ingredient | boolean> {
    const spoonCheck = await this.repository.findOne({ where: [{ name: ILike(spoon.name) }] });

    return !!spoonCheck ? spoonCheck : false;
  }

  /** Save ingredient or return internal server error. */
  async createIngredientFromSpoon(spoon: Ingredient): Promise<Ingredient | CMessage> {
    const result = await this.repository.save(spoon);

    return result !== null ? result : new CMessage('something went pear shaped', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  /** get a short list of ingredient suggestions */
  async getSuggestedIngredients(filter: string, limit = 10): Promise<PaginatedDto<IIngredientShort>> {
    const pageOptionsDto: IFilterBase = {
      keyword: filter,
      page: 1,
      take: limit,
      skip: 0
    };
    const [result, itemCount] = await this.repository.findAndCount({
      where: { name: Like(`%${filter}%`), isActive: true },
      order: { name: EOrder.ASC },
      take: limit,
      skip: 0
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PaginatedDto(
      result.map((ing) => this.mapIngredientToIIngredientShort(ing)),
      pageMetaDto
    );
  }

  mapIngredientToIIngredientShort(i: Ingredient, measures?: Measurement[]): IIngredientShort {
    const iShort: IIngredientShort = {
      id: i.id,
      name: i.name,
      originalName: i.originalName,
      image: i.image,
      aisle: i.aisle,
      nutrition: {
        nutrients: this.mapIngredientToINutrient(i),
        vitamins: this.mapIngredientToIVitamins(i),
        minerals: this.mapIngredientToIMineral(i),
        properties: this.mapIngredientToINutritionProp(i),
        caloricBreakdown: this.mapIngredientToICaloricBreakdown(i)
      }
    };

    if (i.conversions && measures) {
      iShort.conversions = i.conversions.map((c) => ({
        ingredientId: c.ingredientId,
        sourceAmount: c.sourceAmount,
        sourceUnitId: c.sourceUnitId,
        sourceUnit: measures?.find((m) => m.id === c.sourceUnitId),

        targetAmount: c.targetAmount,
        targetUnitId: c.targetUnitId,
        targetUnit: measures?.find((m) => m.id === c.targetUnitId),
        answer: c.answer
      }));
    }

    return iShort;
  }

  mapIngredientToIIngredientDTO(i: IIngredientEntityExtended, measures?: Measurement[]): IIngredient {
    const ing: IIngredient = {
      ...this.mapIngredientToIIngredientShort(i, measures),
      externalId: i.externalId,
      estimatedCost: {
        value: i.estimatedCost,
        unit: i.estimatedCostUnit
      },
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
      possibleUnits: i.possibleUnits,
      preferredShoppingUnit: i.preferredShoppingUnit,
      purchasedBy: i.purchasedBy ? (EPurchasedBy[i.purchasedBy] as TPurchasedBy) : EPurchasedBy.weight,
      allergies: i.allergies?.map((item: Reference) => ({ id: item.id, title: item.title, symbol: item.symbol })) || [],
      recipes: i.recipes
    };

    return ing;
  }

  mapRecipeIngredientToIRecipeIngredientDto(
    iL: RecipeIngredient,
    recipeId: number,
    measures: Measurement[],
    ingredients: Ingredient[]
  ): IRecipeIngredient {
    const measure = this.mapMeasurementToIMeasurement(this.findMeasure(iL.measureId, measures));
    return {
      id: iL.id,
      ingredientId: iL.ingredientId,
      recipeId,
      amount: iL.amount,
      unit: measure.title,
      consistency: iL.consistency,
      meta: iL.meta,
      measure,
      ingredient: new CIngredientShort(this.findIngredient(iL.ingredientId, ingredients))
    };
  }

  private findIngredient(id: number, ingredients: Ingredient[]): Ingredient {
    return ingredients.find((i: Ingredient) => i.id === id);
  }

  private mapIngredientToIMineral(i: Ingredient): IMinerals {
    return {
      calcium: i.calcium,
      choline: i.choline,
      copper: i.copper,
      fluoride: i.fluoride,
      iodine: i.iodine,
      iron: i.iron,
      magnesium: i.magnesium,
      manganese: i.manganese,
      phosphorus: i.phosphorus,
      potassium: i.potassium,
      selenium: i.selenium,
      sodium: i.sodium,
      zinc: i.zinc
    };
  }

  private mapIngredientToIVitamins(i: Ingredient): IVitamins {
    return {
      folate: i.folate,
      folicAcid: i.folicAcid,
      vitaminA: i.vitaminA,
      vitaminB1: i.vitaminB1,
      vitaminB12: i.vitaminB12,
      vitaminB2: i.vitaminB2,
      vitaminB3: i.vitaminB3,
      vitaminB5: i.vitaminB5,
      vitaminB6: i.vitaminB6,
      vitaminC: i.vitaminC,
      vitaminD: i.vitaminD,
      vitaminE: i.vitaminE,
      vitaminK: i.vitaminK
    };
  }

  private mapIngredientToINutrient(i: Ingredient): INutrients {
    return {
      alcohol: i.alcohol,
      caffeine: i.caffeine,
      calories: i.calories,
      carbohydrates: i.carbohydrates,
      cholesterol: i.cholesterol,
      fat: i.fat,
      fiber: i.fiber,
      monoUnsaturatedFat: i.monoUnsaturatedFat,
      netCarbohydrates: i.netCarbohydrates,
      polyUnsaturatedFat: i.polyUnsaturatedFat,
      protein: i.protein,
      saturatedFat: i.saturatedFat,
      sugar: i.sugar,
      transFat: i.transFat
    };
  }

  private mapIngredientToINutritionProp(i: Ingredient): INutritionProperties {
    return {
      glycemicIndex: i.glycemicIndex,
      glycemicLoad: i.glycemicLoad,
      nutritionScore: i.nutritionScore
    };
  }

  private mapIngredientToICaloricBreakdown(i: Ingredient): ICaloricBreakdown {
    return {
      percentProtein: i.percentProtein,
      percentFat: i.percentFat,
      percentCarbs: i.percentCarbs
    };
  }

  // private mapConversionToIConversion(convert: Conversion, ingredientId: number, measures: Measurement[]): IConversion {
  //   return {
  //     id: convert.id,
  //     ingredientId,
  //     sourceAmount: convert.sourceAmount,
  //     sourceUnit: this.mapMeasurementToIMeasurement(this.findMeasure(convert.sourceUnitId, measures)),
  //     targetAmount: convert.targetAmount,
  //     targetUnit: this.mapMeasurementToIMeasurement(this.findMeasure(convert.targetUnitId, measures)),
  //     answer: convert.answer,
  //     type: convert.answer
  //   };
  // }

  private findMeasure(id: number, measures: Measurement[]): Measurement {
    return measures.find((m: Measurement) => m.id === id) || measures[0];
  }

  private mapMeasurementToIMeasurement(measure: Measurement): IMeasurement {
    return {
      id: measure.id,
      title: measure.title,
      measurementType: measure.measurementType,
      shortName: measure.shortName,
      convertsToId: measure.convertsToId,
      quantity: measure.quantity,
      countryCode: measure.countryCode
    };
  }

  /** Mapping from the FE ingredient DTO through to ingredient object. */
  mapIIngredientDtoIngredient(i: IIngredient): Ingredient {
    const ing: Ingredient = {
      name: i.name,
      originalName: i.originalName,
      image: i.image,
      externalId: i.externalId,
      possibleUnits: i.possibleUnits as Measurement[], // probably okay...
      allergies: i.allergies.map((allergy: IReferenceShort) => {
        const alle = new Reference();
        alle.id = allergy.id;
        return alle;
      }),
      aisle: i.aisle,
      recipeIngredientList: [],
      estimatedCost: i.estimatedCost.value,
      estimatedCostUnit: i.estimatedCost.unit,
      purchasedBy: typeof i.purchasedBy === 'string' ? EPurchasedBy[i.purchasedBy] : i.purchasedBy,
      // conversions: i.conversions.map((conv: IConversion) => new Conversion(conv)),
      glycemicIndex: i.nutrition.properties.glycemicIndex,
      glycemicLoad: i.nutrition.properties.glycemicLoad,
      nutritionScore: i.nutrition.properties.nutritionScore,
      percentProtein: i.nutrition.caloricBreakdown.percentProtein,
      percentFat: i.nutrition.caloricBreakdown.percentFat,
      percentCarbs: i.nutrition.caloricBreakdown.percentCarbs,
      calories: i.nutrition.nutrients.calories,
      fat: i.nutrition.nutrients.fat,
      transFat: i.nutrition.nutrients.transFat,
      saturatedFat: i.nutrition.nutrients.saturatedFat,
      monoUnsaturatedFat: i.nutrition.nutrients.monoUnsaturatedFat,
      polyUnsaturatedFat: i.nutrition.nutrients.polyUnsaturatedFat,
      protein: i.nutrition.nutrients.protein,
      cholesterol: i.nutrition.nutrients.cholesterol,
      carbohydrates: i.nutrition.nutrients.carbohydrates,
      netCarbohydrates: i.nutrition.nutrients.netCarbohydrates,
      alcohol: i.nutrition.nutrients.alcohol,
      fiber: i.nutrition.nutrients.fiber,
      sugar: i.nutrition.nutrients.sugar,
      sodium: i.nutrition.minerals.sodium,
      caffeine: i.nutrition.nutrients.caffeine,
      manganese: i.nutrition.minerals.manganese,
      potassium: i.nutrition.minerals.potassium,
      magnesium: i.nutrition.minerals.magnesium,
      calcium: i.nutrition.minerals.calcium,
      copper: i.nutrition.minerals.copper,
      zinc: i.nutrition.minerals.zinc,
      phosphorus: i.nutrition.minerals.phosphorus,
      fluoride: i.nutrition.minerals.fluoride,
      choline: i.nutrition.minerals.choline,
      iron: i.nutrition.minerals.iron,
      vitaminA: i.nutrition.vitamins.vitaminA,
      vitaminB1: i.nutrition.vitamins.vitaminB1,
      vitaminB2: i.nutrition.vitamins.vitaminB2,
      vitaminB3: i.nutrition.vitamins.vitaminB3,
      vitaminB5: i.nutrition.vitamins.vitaminB5,
      vitaminB6: i.nutrition.vitamins.vitaminB6,
      vitaminB12: i.nutrition.vitamins.vitaminB12,
      vitaminC: i.nutrition.vitamins.vitaminC,
      vitaminD: i.nutrition.vitamins.vitaminD,
      vitaminE: i.nutrition.vitamins.vitaminE,
      vitaminK: i.nutrition.vitamins.vitaminK,
      folate: i.nutrition.vitamins.folate,
      folicAcid: i.nutrition.vitamins.folicAcid,
      iodine: i.nutrition.minerals.iodine,
      selenium: i.nutrition.minerals.selenium,
      isActive: true
    };

    return ing;
  }
}
