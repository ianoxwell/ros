import { IEquipmentSteppedInstruction } from '@models/equipment-stepped-instruction.dto';
import { ISimpleEquipment } from '@models/equipment.dto';
import { IIngredient } from '@models/ingredient.dto';
import { CMessage } from '@base/message.class';
import { IRecipeIngredient } from '@models/recipe-ingredient.dto';
import { IRecipeSteppedInstruction } from '@models/recipe-stepped-instructions.dto';
import { IRecipe, IRecipeShort, THealthBooleanLabels } from '@models/recipe.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CPageOptionsDto } from 'src/base/filter.const';
import { PageMetaDto, PaginatedDto } from 'src/Base/paginated.entity';
import { ILike, Repository } from 'typeorm';
import { Ingredient } from '../ingredient/ingredient.entity';
import { IngredientService } from '../ingredient/ingredient.service';
import { Measurement } from '../measurement/measurement.entity';
import { ISpoonRecipe, SpoonEquipment } from '../spoon/models/spoon-random-recipe.dto';
import { CuisineType } from './cuisine-type/cuisine-type.entity';
import { DishType } from './dish-type/dish-type.entity';
import { Equipment } from './equipment/equipment.entity';
import { HealthLabel } from './health-label/health-label.entity';
import { RecipeIngredient } from './recipe-ingredient/recipe-ingredient.entity';
import { EquipmentSteppedInstruction } from './recipe-stepped-instructions/equipment-stepped-instruction.entity';
import { RecipeSteppedInstruction } from './recipe-stepped-instructions/recipe-stepped-instructions.entity';
import { Recipe } from './recipe.entity';
import { CIngredientShort } from '../ingredient/ingredient-short.dto';

@Injectable()
export class RecipeService {
  readonly healthLabelKeys: THealthBooleanLabels[] = [
    'vegetarian',
    'vegan',
    'glutenFree',
    'dairyFree',
    'veryHealthy',
    'cheap',
    'veryPopular',
    'sustainable',
    'lowFodmap'
  ];

  startTime: number | undefined;

  constructor(
    @InjectRepository(Recipe) private readonly repository: Repository<Recipe>,
    @InjectRepository(Equipment) private readonly equipmentRepository: Repository<Equipment>,
    @InjectRepository(EquipmentSteppedInstruction)
    private readonly equipmentSteppedInstructionRepository: Repository<EquipmentSteppedInstruction>,
    @InjectRepository(RecipeSteppedInstruction) private readonly steppedInstructionRepository: Repository<RecipeSteppedInstruction>,
    @InjectRepository(HealthLabel) private readonly healthLabelRepository: Repository<HealthLabel>,
    @InjectRepository(DishType) private readonly dishTypeRepository: Repository<DishType>,
    @InjectRepository(CuisineType) private readonly cuisineTypeRepository: Repository<CuisineType>,
    @InjectRepository(RecipeIngredient) private readonly recipeIngredientRepository: Repository<RecipeIngredient>,
    @InjectRepository(Measurement) private readonly measurementRepository: Repository<Measurement>,
    private ingredientService: IngredientService
  ) {}

  /** Quick and dirty find and count all items, return in paginated response. */
  async findAll(): Promise<PaginatedDto<IRecipeShort>> {
    const [result, itemCount] = await this.repository.findAndCount({
      relations: {
        cuisineType: true,
        dishType: true,
        diets: true
      }
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: CPageOptionsDto });
    const fullResult = result.map((recipe: Recipe) => this.mapRecipeToShortRecipeDto(recipe));

    return new PaginatedDto(fullResult, pageMetaDto);
  }

  /** Gets a single recipe */
  async getRecipeById(id: number): Promise<IRecipe | CMessage> {
    const measures = await this.measurementRepository.find();

    const getRecipe: Recipe = await this.repository.findOne({
      where: { id },
      loadRelationIds: true
    });

    if (!getRecipe || getRecipe === null) {
      const queryTime = new Date().getTime() - this.startTime;

      return new CMessage('Recipe by id not found, ' + queryTime + 'ms', HttpStatus.NOT_FOUND);
    }

    const cuisineType: CuisineType[] = await Promise.all(
      (getRecipe.cuisineType as unknown as number[]).map(async (id: number) => {
        return await this.cuisineTypeRepository.findOne({ where: { id } });
      })
    );

    const equipment: Equipment[] = await Promise.all(
      (getRecipe.equipment as unknown as number[]).map(async (id: number) => {
        return await this.equipmentRepository.findOne({ where: { id } });
      })
    );

    const dishType: DishType[] = await Promise.all(
      (getRecipe.dishType as unknown as number[]).map(async (id: number) => {
        return await this.dishTypeRepository.findOne({ where: { id } });
      })
    );

    const diets: HealthLabel[] = await Promise.all(
      (getRecipe.diets as unknown as number[]).map(async (id: number) => {
        return await this.healthLabelRepository.findOne({ where: { id } });
      })
    );

    const ingredients: Ingredient[] = await Promise.all(
      (getRecipe.ingredients as unknown as number[]).map(async (id: number) => {
        return await this.ingredientService.getIngredientByIdForRecipe(id);
      })
    );

    const steppedInstructions: RecipeSteppedInstruction[] = await this.steppedInstructionRepository.find({
      where: { recipeId: id },
      relations: {
        equipment: {
          equipment: true
        },
        ingredients: true
      }
    });

    const ingredientList: RecipeIngredient[] = await this.recipeIngredientRepository.find({
      where: { recipeId: id },
      loadRelationIds: true
    });

    getRecipe.ingredients = ingredients;
    getRecipe.steppedInstructions = steppedInstructions;
    getRecipe.ingredientList = ingredientList;
    getRecipe.cuisineType = cuisineType;
    getRecipe.equipment = equipment;
    getRecipe.dishType = dishType;
    getRecipe.diets = diets;

    return this.mapRecipeToRecipeDto(getRecipe, measures);
  }

  private mapRecipeToShortRecipeDto(recipe: Recipe): IRecipeShort {
    const cuisineType: string[] = recipe.cuisineType.map((item: CuisineType) => item.name);
    const dishType: string[] = recipe.dishType.map((item: DishType) => item.name);
    const diets: string[] = recipe.diets.map((item: HealthLabel) => item.name);
    const healthLabels: THealthBooleanLabels[] = this.healthLabelKeys.filter((key: THealthBooleanLabels) => recipe[key]);

    return {
      id: recipe.id,
      name: recipe.name,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
      instructions: recipe.instructions,
      summary: recipe.summary,
      shortSummary: recipe.shortSummary,
      pricePerServing: recipe.pricePerServing,
      images: recipe.images,
      preparationMinutes: recipe.preparationMinutes,
      cookingMinutes: recipe.cookingMinutes,
      readyInMinutes: recipe.readyInMinutes,
      aggregateLikes: recipe.aggregateLikes,
      healthScore: recipe.healthScore,
      servings: recipe.servings,
      spoonId: recipe.spoonId,
      sourceUrl: recipe.sourceUrl,
      creditsText: recipe.creditsText,
      license: recipe.license,
      sourceName: recipe.sourceName,
      spoonacularSourceUrl: recipe.spoonacularSourceUrl,
      weightWatcherSmartPoints: recipe.weightWatcherSmartPoints,
      gaps: recipe.gaps,
      healthLabels,
      cuisineType,
      dishType,
      diets
    };
  }

  private mapRecipeToRecipeDto(recipe: Recipe, measures: Measurement[]): IRecipe {
    // const cuisineType: string[] = recipe.cuisineType.map((item: CuisineType) => item.name);
    // const dishType: string[] = recipe.dishType.map((item: DishType) => item.name);
    // const diets: string[] = recipe.diets.map((item: HealthLabel) => item.name);
    // const healthLabels: THealthBooleanLabels[] = this.healthLabelKeys.filter((key: THealthBooleanLabels) => recipe[key]);
    const ingredients: IIngredient[] = recipe.ingredients.map((i: Ingredient) =>
      this.ingredientService.mapIngredientToIIngredientDTO(i, true, measures)
    );
    const ingredientList: IRecipeIngredient[] = recipe.ingredientList.map((il: RecipeIngredient) =>
      this.ingredientService.mapRecipeIngredientToIRecipeIngredient(il, recipe.id, measures, recipe.ingredients)
    );
    const steppedInstructions: IRecipeSteppedInstruction[] = recipe.steppedInstructions.map((si: RecipeSteppedInstruction) =>
      this.mapRecipeSteppedInstructionToISteppedInstruction(si, recipe.id)
    );

    return {
      ...this.mapRecipeToShortRecipeDto(recipe),
      ingredients,
      ingredientList,
      steppedInstructions
    };
  }

  /** Deletes a single recipe - quick and dirty. */
  async deleteById(id: number): Promise<any> {
    return await this.repository.delete({ id });
  }

  /** Checks for unique name and spoonId, returns true if item found. */
  async isSpoonRecipeAlreadySaved(spoonRecipe: ISpoonRecipe): Promise<boolean> {
    const findRecipe: Recipe | null = await this.repository.findOne({
      where: [{ name: ILike(spoonRecipe.title) }, { spoonId: spoonRecipe.id }]
    });

    return findRecipe !== null;
  }

  /** This is it - save / create the new recipe. */
  async createRecipe(recipe: Recipe): Promise<Recipe> {
    return await this.repository.save(recipe);
  }

  async updateRecipe(recipe: Recipe): Promise<Recipe | null> {
    const findRecipe = this.repository.findOne({ where: { id: recipe.id } });

    if (!findRecipe || findRecipe === null) {
      return null;
    }

    return await this.repository.save(recipe);
  }

  /** Maps the spoon equipment to Equipment and saves, else returns the equipment. */
  async createSpoonEquipment(equip: SpoonEquipment): Promise<Equipment> {
    const findEquip = await this.equipmentRepository.findOne({ where: { name: ILike(equip.name), spoonId: equip.id } });

    if (!findEquip) {
      const newEquip = new Equipment();
      newEquip.name = equip.name;
      newEquip.altName = equip.localizedName;
      newEquip.spoonId = equip.id;
      newEquip.image = equip.image;

      return await this.equipmentRepository.save(newEquip);
    }

    return findEquip;
  }

  /** After the instruction has been mapped, just save it. */
  async createSteppedInstruction(instruction: RecipeSteppedInstruction): Promise<RecipeSteppedInstruction> {
    return await this.steppedInstructionRepository.save(instruction);
  }

  async createSteppedInstructionEquipment(equip: EquipmentSteppedInstruction): Promise<EquipmentSteppedInstruction> {
    return await this.equipmentSteppedInstructionRepository.save(equip);
  }

  /** A recipeIngredient contains the amount and unit of the ingredient required for the recipe - e.g. 2 cups wholemeal flour  */
  async saveRecipeIngredient(recipeIngredient: RecipeIngredient): Promise<RecipeIngredient> {
    return await this.recipeIngredientRepository.save(recipeIngredient);
  }

  /** Creates health label or returns the found label. */
  async createHealthLabel(label: string): Promise<HealthLabel> {
    label = label.toLocaleLowerCase();
    const findLabel: HealthLabel | null = await this.healthLabelRepository.findOne({
      where: [{ name: ILike(label) }, { altName: ILike(label) }]
    });
    if (!findLabel) {
      const newLabel = new HealthLabel();
      newLabel.name = label;

      return await this.healthLabelRepository.save(newLabel);
    }

    return findLabel;
  }

  /** Creates dish type or returns the found dish type. */
  async createDishType(label: string): Promise<DishType> {
    label = label.toLocaleLowerCase();
    const findLabel: DishType | null = await this.dishTypeRepository.findOne({
      where: [{ name: ILike(label) }, { altName: ILike(label) }]
    });
    if (!findLabel) {
      const newLabel = new DishType();
      newLabel.name = label;

      return await this.dishTypeRepository.save(newLabel);
    }

    return findLabel;
  }

  /** Creates the cuisine type or returns the found cuisine type. */
  async createCuisineType(cuisine: string): Promise<CuisineType> {
    cuisine = cuisine.toLocaleLowerCase();
    const findCuisine: CuisineType | null = await this.cuisineTypeRepository.findOne({
      where: [{ name: ILike(cuisine) }, { altName: ILike(cuisine) }]
    });
    if (!findCuisine) {
      const newLabel = new CuisineType();
      newLabel.name = cuisine;

      return await this.cuisineTypeRepository.save(newLabel);
    }

    return findCuisine;
  }

  private mapRecipeSteppedInstructionToISteppedInstruction(si: RecipeSteppedInstruction, recipeId: number): IRecipeSteppedInstruction {
    return {
      id: si.id,
      recipeId,
      step: si.step,
      stepName: si.stepName,
      stepNumber: si.stepNumber,
      lengthTimeValue: si.lengthTimeValue,
      lengthTimeUnit: si.lengthTimeUnit,
      ingredients: si.ingredients.map((i: Ingredient) => new CIngredientShort(i)),
      equipment: si.equipment.map((eSi: EquipmentSteppedInstruction) => this.mapEquipmentSteppedInstructionToIEquip(eSi, si.id))
    };
  }

  private mapEquipmentSteppedInstructionToIEquip(
    eSi: EquipmentSteppedInstruction,
    recipeSteppedInstructionId: number
  ): IEquipmentSteppedInstruction {
    return {
      id: eSi.id,
      recipeSteppedInstructionId,
      temperature: eSi.temperature,
      temperatureUnit: eSi.temperatureUnit,
      ...this.mapEquipmentToISimpleEquipment(eSi.equipment)
    };
  }

  private mapEquipmentToISimpleEquipment(equip: Equipment): ISimpleEquipment {
    return {
      equipmentId: equip.id,
      name: equip.name,
      description: equip.description,
      image: equip.image
    };
  }
}
