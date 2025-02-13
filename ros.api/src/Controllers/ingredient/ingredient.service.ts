import { EOrder, PageMetaDto, PaginatedDto } from '@base//paginated.entity';
import { IConversion } from '@models/conversion.dto';
import { EPurchasedBy, ICaloricBreakdown, IIngredient, INutrients, INutritionProperties, IReferenceShort } from '@models/ingredient.dto';
import { IMeasurement } from '@models/measurement.dto';
import { CMessage } from '@base/message.class';
import { IRecipeIngredient } from '@models/recipe-ingredient.dto';
import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { CPageOptionsDto } from 'src/base/filter.const';
import { IFilterBase } from 'src/Base/filter.entity';
import { ILike, Like, Repository, UpdateResult } from 'typeorm';
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
    @InjectRepository(Conversion) private readonly conversionRepository: Repository<Conversion>
  ) {}

  /** Quick and dirty get ingredient by id */
  async getIngredientByIdForRecipe(id: number): Promise<Ingredient> {
    const ingredient: Ingredient = await this.repository.findOne({
      where: { id },
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

  /**
   * Very quick delete ingredient by id - temp
   * TODO - update to turn ingredient isActive false - etc.
   */
  async deleteIngredientById(id: number): Promise<any> {
    return await this.repository.delete({ id });
  }

  /** Filter ingredients and paginate the results. */
  async getIngredients(pageOptionsDto: IFilterBase): Promise<PaginatedDto<Ingredient>> {
    const [result, itemCount] = await this.repository.findAndCount({
      where: { name: Like(`%${pageOptionsDto.keyword}%`) },
      order: { name: pageOptionsDto.order || EOrder.DESC },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PaginatedDto(result, pageMetaDto);
  }

  /** Returns true IF the ingredient is NOT found. */
  async ingredientNameAvailable(name: string): Promise<boolean> {
    return await this.repository.findOne({ where: { name: ILike(name) } }).then((result: Ingredient) => {
      return result === null;
    });
  }

  /** Quick and dirty find all - at least it maps it to a pagination object to show number of results. */
  async findAll(): Promise<PaginatedDto<Ingredient>> {
    const [result, itemCount] = await this.repository.findAndCount({
      relations: {
        possibleUnits: true,
        conversions: true
      }
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: CPageOptionsDto });

    return new PaginatedDto(result, pageMetaDto);
  }

  /** Update ingredient */
  async updateIngredient(id: number, ing: Ingredient): Promise<UpdateResult> {
    return this.repository.update(id, ing);
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
  async spoonIngredientIdExists(externalId: number): Promise<Ingredient | CMessage> {
    const spoonCheck = await this.repository.findOne({ where: { externalId } });

    return !!spoonCheck ? spoonCheck : new CMessage('Go ahead and create it', HttpStatus.OK);
  }

  /** The name must also be unique. */
  async spoonIngredientNameExists(spoon: ISpoonIngredient): Promise<Ingredient | CMessage> {
    const spoonCheck = await this.repository.findOne({ where: [{ externalId: spoon.id }, { name: ILike(spoon.name) }] });

    return !!spoonCheck ? spoonCheck : new CMessage('Go ahead and create it', HttpStatus.OK);
  }

  /** Save ingredient or return internal server error. */
  async createIngredientFromSpoon(spoon: Ingredient): Promise<Ingredient | CMessage> {
    const result = await this.repository.save(spoon);

    return result !== null ? result : new CMessage('something went pear shaped', HttpStatus.INTERNAL_SERVER_ERROR);
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
      allergies: i.allergies.map((item: Reference) => ({ id: item.id, title: item.title, symbol: item.symbol })),
      conversions: i.conversions.map((convert: Conversion) => this.mapConversionToIConversion(convert, i.id, measures))
    };

    if (isNutritionIncluded) {
      ing.nutrition = {
        nutrients: this.mapIngredientToINutrient(i),
        properties: this.mapIngredientToINutritionProp(i),
        caloricBreakdown: this.mapIngredientToICaloricBreakdown(i)
      };
    }

    return ing;
  }

  mapRecipeIngredientToIRecipeIngredient(
    iL: RecipeIngredient,
    recipeId: number,
    measures: Measurement[],
    ingredients: Ingredient[]
  ): IRecipeIngredient {
    return {
      id: iL.id,
      ingredientId: iL.ingredient.id,
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

  private mapIngredientToINutrient(i: Ingredient): INutrients {
    return {
      calories: i.calories,
      fat: i.fat,
      transFat: i.transFat,
      saturatedFat: i.saturatedFat,
      monoUnsaturatedFat: i.monoUnsaturatedFat,
      polyUnsaturatedFat: i.polyUnsaturatedFat,
      protein: i.protein,
      cholesterol: i.cholesterol,
      carbohydrates: i.carbohydrates,
      netCarbohydrates: i.netCarbohydrates,
      alcohol: i.alcohol,
      fiber: i.fiber,
      sugar: i.sugar,
      sodium: i.sodium,
      caffeine: i.caffeine,
      manganese: i.manganese,
      potassium: i.potassium,
      magnesium: i.magnesium,
      calcium: i.calcium,
      copper: i.copper,
      zinc: i.zinc,
      phosphorus: i.phosphorus,
      fluoride: i.fluoride,
      choline: i.choline,
      iron: i.iron,
      vitaminA: i.vitaminA,
      vitaminB1: i.vitaminB1,
      vitaminB2: i.vitaminB2,
      vitaminB3: i.vitaminB3,
      vitaminB5: i.vitaminB5,
      vitaminB6: i.vitaminB6,
      vitaminB12: i.vitaminB12,
      vitaminC: i.vitaminC,
      vitaminD: i.vitaminD,
      vitaminE: i.vitaminE,
      vitaminK: i.vitaminK,
      folate: i.folate,
      folicAcid: i.folicAcid,
      iodine: i.iodine,
      selenium: i.selenium
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
    return measures.find((m: Measurement) => m.id === id);
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
  private mapIIngredientDtoIngredient(i: IIngredient): Ingredient {
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
      sodium: i.nutrition.nutrients.sodium,
      caffeine: i.nutrition.nutrients.caffeine,
      manganese: i.nutrition.nutrients.manganese,
      potassium: i.nutrition.nutrients.potassium,
      magnesium: i.nutrition.nutrients.magnesium,
      calcium: i.nutrition.nutrients.calcium,
      copper: i.nutrition.nutrients.copper,
      zinc: i.nutrition.nutrients.zinc,
      phosphorus: i.nutrition.nutrients.phosphorus,
      fluoride: i.nutrition.nutrients.fluoride,
      choline: i.nutrition.nutrients.choline,
      iron: i.nutrition.nutrients.iron,
      vitaminA: i.nutrition.nutrients.vitaminA,
      vitaminB1: i.nutrition.nutrients.vitaminB1,
      vitaminB2: i.nutrition.nutrients.vitaminB2,
      vitaminB3: i.nutrition.nutrients.vitaminB3,
      vitaminB5: i.nutrition.nutrients.vitaminB5,
      vitaminB6: i.nutrition.nutrients.vitaminB6,
      vitaminB12: i.nutrition.nutrients.vitaminB12,
      vitaminC: i.nutrition.nutrients.vitaminC,
      vitaminD: i.nutrition.nutrients.vitaminD,
      vitaminE: i.nutrition.nutrients.vitaminE,
      vitaminK: i.nutrition.nutrients.vitaminK,
      folate: i.nutrition.nutrients.folate,
      folicAcid: i.nutrition.nutrients.folicAcid,
      iodine: i.nutrition.nutrients.iodine,
      selenium: i.nutrition.nutrients.selenium
    };

    return ing;
  }
}
