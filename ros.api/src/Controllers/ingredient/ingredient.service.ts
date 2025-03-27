import { PageMetaDto, PaginatedDto } from '@base//paginated.entity';
import { CPageOptionsDto } from '@base/filter.const';
import { IFilterBase } from '@base/filter.entity';
import { CMessage } from '@base/message.class';
import { EOrder } from '@models/base.dto';
import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { IConversion } from 'Models/conversion.dto';
import {
  EPurchasedBy,
  ICaloricBreakdown,
  IIngredient,
  IIngredientShort,
  IMinerals,
  INutrients,
  INutritionProperties,
  IReferenceShort,
  IVitamins
} from 'Models/ingredient.dto';
import { IMeasurement } from 'Models/measurement.dto';
import { IRecipeIngredient } from 'Models/recipe-ingredient.dto';
import { ILike, In, Like, Raw, Repository, UpdateResult } from 'typeorm';
import { Measurement } from '../measurement/measurement.entity';
import { RecipeIngredient } from '../recipe/recipe-ingredient/recipe-ingredient.entity';
import { Reference } from '../reference/reference.entity';
import { ISpoonIngredient } from '../spoon/models/spoon-ingredient.dto';
import { Conversion } from './conversion/conversion.entity';
import { CIngredientShort } from './ingredient-short.dto';
import { Ingredient } from './ingredient.entity';

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

  async getIngredientById(id: string | number): Promise<IIngredient> {
    id = typeof id === 'number' ? id : parseInt(id);
    const ingredient: Ingredient = await this.repository.findOne({
      where: { id, isActive: true },
      relations: {
        possibleUnits: true,
        conversions: true,
        allergies: true
      }
    });

    const measures = await this.measurementRepository.find();
    return this.mapIngredientToIIngredientDTO(ingredient, true, measures);
  }
  /** Filter ingredients and paginate the results. */
  async getIngredients(pageOptionsDto: IFilterBase): Promise<PaginatedDto<IIngredient>> {
    const [result, itemCount] = await this.repository.findAndCount({
      where: { name: Raw((alias) => `LOWER(${alias}) Like '%${pageOptionsDto.keyword.toLowerCase()}%'`), isActive: true },
      order: { name: pageOptionsDto.order || EOrder.DESC },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      relations: {
        possibleUnits: true,
        conversions: true,
        allergies: true
      }
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const measures = await this.measurementRepository.find();
    const fullResult = result.map((ing: Ingredient) => this.mapIngredientToIIngredientDTO(ing, true, measures));

    return new PaginatedDto(fullResult, pageMetaDto);
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
  async findAll(): Promise<PaginatedDto<IIngredient>> {
    const [result, itemCount] = await this.repository.findAndCount({
      where: { isActive: true },
      relations: {
        possibleUnits: true,
        conversions: true
      }
    });
    const measures = await this.measurementRepository.find();
    const fullResult = result.map((ing: Ingredient) => this.mapIngredientToIIngredientDTO(ing, true, measures));
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: CPageOptionsDto });

    return new PaginatedDto(fullResult, pageMetaDto);
  }

  /** Update ingredient */
  async updateIngredient(id: number, ingredient: IIngredient): Promise<UpdateResult> {
    const ing: Ingredient = this.mapIIngredientDtoIngredient(ingredient);
    return await this.repository.update(id, ing);
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

  mapIngredientToIIngredientShort(i: Ingredient): IIngredientShort {
    return {
      id: i.id,
      name: i.name,
      originalName: i.originalName,
      image: i.image,
      aisle: i.aisle
    };
  }

  mapIngredientToIIngredientDTO(i: Ingredient, isNutritionIncluded = true, measures: Measurement[]): IIngredient {
    const ing: IIngredient = {
      id: i.id,
      name: i.name,
      originalName: i.originalName,
      image: i.image,
      externalId: i.externalId,
      aisle: i.aisle,
      estimatedCost: {
        value: i.estimatedCost,
        unit: i.estimatedCostUnit
      },
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
      possibleUnits: (i.possibleUnits as unknown as number[]).map((measureId: number) =>
        this.mapMeasurementToIMeasurement(this.findMeasure(measureId, measures))
      ),
      allergies: i.allergies?.map((item: Reference) => ({ id: item.id, title: item.title, symbol: item.symbol })) || [],
      conversions: i.conversions.map((convert: Conversion) => this.mapConversionToIConversion(convert, i.id, measures))
    };

    if (isNutritionIncluded) {
      ing.nutrition = {
        nutrients: this.mapIngredientToINutrient(i),
        vitamins: this.mapIngredientToIVitamins(i),
        minerals: this.mapIngredientToIMineral(i),
        properties: this.mapIngredientToINutritionProp(i),
        caloricBreakdown: this.mapIngredientToICaloricBreakdown(i)
      };
    }

    return ing;
  }

  mapRecipeIngredientToIRecipeIngredientDto(
    iL: RecipeIngredient,
    recipeId: number,
    measures: Measurement[],
    ingredients: Ingredient[]
  ): IRecipeIngredient {
    return {
      id: iL.id,
      ingredientId: iL.ingredientId,
      recipeId,
      amount: iL.amount,
      unit: iL.measure.title,
      consistency: iL.consistency,
      meta: iL.meta,
      measure: this.mapMeasurementToIMeasurement(this.findMeasure(iL.measureId, measures)),
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

  private mapConversionToIConversion(convert: Conversion, ingredientId: number, measures: Measurement[]): IConversion {
    return {
      id: convert.id,
      ingredientId,
      sourceAmount: convert.sourceAmount,
      sourceUnit: this.mapMeasurementToIMeasurement(this.findMeasure(convert.sourceUnitId, measures)),
      targetAmount: convert.targetAmount,
      targetUnit: this.mapMeasurementToIMeasurement(this.findMeasure(convert.targetUnitId, measures)),
      answer: convert.answer,
      type: convert.answer
    };
  }

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
