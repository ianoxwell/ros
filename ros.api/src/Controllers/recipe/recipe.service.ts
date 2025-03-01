import { CPageOptionsDto } from '@base/filter.const';
import { IFilterBase } from '@base/filter.entity';
import { CMessage } from '@base/message.class';
import { PageMetaDto, PaginatedDto } from '@base/paginated.entity';
import { EOrder } from '@models/base.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IEquipmentSteppedInstruction } from 'Models/equipment-stepped-instruction.dto';
import { ISimpleEquipment } from 'Models/equipment.dto';
import { IIngredient } from 'Models/ingredient.dto';
import { IRecipeIngredient } from 'Models/recipe-ingredient.dto';
import { IRecipeSteppedInstruction } from 'Models/recipe-stepped-instructions.dto';
import { IRecipe, IRecipeShort, THealthBooleanLabels } from 'Models/recipe.dto';
import { ILike, Like, Raw, Repository } from 'typeorm';
import { CIngredientShort } from '../ingredient/ingredient-short.dto';
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

  /** Quick and dirty find and count all items, return in paginated response with a limit of 20 */
  async findAll(): Promise<PaginatedDto<IRecipeShort>> {
    const [result, itemCount] = await this.repository.findAndCount({
      relations: {
        cuisineType: true,
        dishType: true,
        diets: true
      },
      take: 20
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: CPageOptionsDto });
    const fullResult = result.map((recipe: Recipe) => this.mapRecipeToShortRecipeDto(recipe));

    return new PaginatedDto(fullResult, pageMetaDto);
  }

  /** Filter ingredients and paginate the results. */
  async getRecipes(pageOptionsDto: IFilterBase): Promise<PaginatedDto<IRecipeShort>> {
    const [result, itemCount] = await this.repository.findAndCount({
      where: { name: Raw((alias) => `LOWER(${alias}) Like '%${pageOptionsDto.keyword.toLowerCase()}%'`) },
      order: { name: pageOptionsDto.order || EOrder.DESC },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const fullResult = result.map((recipe: Recipe) => this.mapRecipeToShortRecipeDto(recipe));

    return new PaginatedDto(fullResult, pageMetaDto);
  }

  /** get a short list of recipe suggestions */
  async getSuggestedRecipes(filter: string, limit = 10): Promise<PaginatedDto<IRecipeShort>> {
    const pageOptionsDto: IFilterBase = {
      keyword: filter,
      page: 1,
      take: limit,
      skip: 0
    };
    const [result, itemCount] = await this.repository.findAndCount({
      where: { name: Like(`%${filter}%`) },
      order: { name: EOrder.ASC },
      take: limit,
      skip: 0
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PaginatedDto(
      result.map((recipe) => this.mapRecipeToShortRecipeDto(recipe)),
      pageMetaDto
    );
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

    const ingredientIds = (getRecipe.ingredients as unknown as number[]).map((il) => il);
    const ingredients = await this.ingredientService.getIngredientFromIdList(ingredientIds);

    const steppedInstructions: RecipeSteppedInstruction[] = await this.steppedInstructionRepository.find({
      where: { recipeId: id },
      relations: {
        equipment: {
          equipment: true
        },
        ingredients: true
      },
      order: { stepNumber: EOrder.ASC }
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

    return this.mapRecipeToRecipeDto(getRecipe);
  }

  /** Returns true IF the recipe is NOT found. */
  async recipeNameAvailable(name: string): Promise<boolean> {
    return await this.repository.findOne({ where: { name: ILike(name) } }).then((result: Recipe) => {
      return result === null;
    });
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
  async createRecipeFromEntity(recipe: Recipe): Promise<Recipe> {
    return await this.repository.save(recipe);
  }

  async updateRecipeFromEntity(recipe: Recipe): Promise<Recipe | null> {
    const findRecipe = await this.repository.findOne({ where: { id: recipe.id } });
    if (!findRecipe || findRecipe === null) {
      return null;
    }

    const result = await this.repository.update(findRecipe.id, recipe);
    return result ? recipe : null;
  }

  /** Takes the recipe DTO finds the existing recipe and updates database */
  async updateRecipe(recipe: IRecipe): Promise<IRecipe | CMessage> {
    const findRecipe = await this.repository.findOne({ where: { id: recipe.id } });

    if (!findRecipe || findRecipe === null) {
      return null;
    }

    const updatedRecipe = await this.mapRecipeDtoToRecipe(recipe);
    updatedRecipe.id = recipe.id;
    const result = await this.repository.update(findRecipe.id, updatedRecipe);
    return result ? recipe : null;
  }

  /** Creates a new recipe, returns the new result mapped back to the recipe DTO */
  async createRecipe(recipe: IRecipe): Promise<IRecipe | CMessage> {
    const nameAvailable = await this.recipeNameAvailable(recipe.name);
    if (!nameAvailable) {
      return new CMessage('Recipe name already exists, change name and save again', HttpStatus.CONFLICT);
    }

    const newRecipeEntity = await this.mapRecipeDtoToRecipe(recipe);
    const result = await this.repository.save(newRecipeEntity);
    return result ? await this.mapRecipeToRecipeDto(result) : new CMessage('Unknown failure on save', HttpStatus.BAD_REQUEST);
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

  private mapRecipeToShortRecipeDto(recipe: Recipe): IRecipeShort {
    const cuisineType: string[] = recipe.cuisineType?.map((item: CuisineType) => item.name);
    const dishType: string[] = recipe.dishType?.map((item: DishType) => item.name);
    const diets: string[] = recipe.diets?.map((item: HealthLabel) => item.name);
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

  private async mapRecipeDtoToRecipe(r: IRecipe): Promise<Recipe> {
    const ingredientIds = r.ingredients.map((i) => i.id).filter((id) => !!id);
    const measures = await this.measurementRepository.find();
    const cuisines = await this.cuisineTypeRepository.find();
    const dishTypes = await this.dishTypeRepository.find();
    const equipments = await this.equipmentRepository.find();
    const healthLabels = await this.healthLabelRepository.find();
    const ingredientsPartial = await this.ingredientService.getIngredientFromIdList(ingredientIds);

    const cuisineType: CuisineType[] = cuisines.filter((c) => r.cuisineType.includes(c.name));
    const dishType: DishType[] = dishTypes.filter((d) => r.dishType.includes(d.name));
    const equipment: Equipment[] = equipments.filter((e) => r.equipment.includes(e.name));
    const diets: HealthLabel[] = healthLabels.filter((h) => r.diets.includes(h.name));
    // Map any ingredients not found in the repository
    const openIngredients: Ingredient[] = r.ingredients
      .filter((i) => !i.id)
      .map((ing) => this.ingredientService.mapIIngredientDtoIngredient(ing));
    const ingredients: Ingredient[] = [...ingredientsPartial, ...openIngredients]; // TODO confirm this is correct way to do this

    const recipe: Recipe = {
      name: r.name,
      instructions: r.instructions,
      summary: r.summary,
      shortSummary: r.shortSummary,
      pricePerServing: r.pricePerServing,
      images: r.images,
      preparationMinutes: r.preparationMinutes,
      cookingMinutes: r.cookingMinutes,
      aggregateLikes: r.aggregateLikes,
      healthScore: r.healthScore,
      readyInMinutes: r.readyInMinutes,
      servings: r.servings,
      spoonId: r.spoonId,
      sourceUrl: r.sourceUrl,
      creditsText: r.creditsText,
      license: r.license,
      sourceName: r.sourceName,
      spoonacularSourceUrl: r.spoonacularSourceUrl,
      vegetarian: r.healthLabels.includes(this.healthLabelKeys[0]),
      vegan: r.healthLabels.includes(this.healthLabelKeys[1]),
      glutenFree: r.healthLabels.includes(this.healthLabelKeys[2]),
      dairyFree: r.healthLabels.includes(this.healthLabelKeys[3]),
      veryHealthy: r.healthLabels.includes(this.healthLabelKeys[4]),
      cheap: r.healthLabels.includes(this.healthLabelKeys[5]),
      veryPopular: r.healthLabels.includes(this.healthLabelKeys[6]),
      sustainable: r.healthLabels.includes(this.healthLabelKeys[7]),
      lowFodmap: r.healthLabels.includes(this.healthLabelKeys[8]),
      weightWatcherSmartPoints: r.weightWatcherSmartPoints,
      gaps: r.gaps,
      cuisineType,
      dishType,
      equipment,
      diets,
      ingredients,
      ingredientList: r.ingredientList.map((iL) => this.mapRecipeIngredientDtoToRecipeIngredient(recipe, iL, ingredients, measures)),
      steppedInstructions: r.steppedInstructions.map((si) => this.mapSteppedInstructionsDtoToEntity(recipe, si, ingredients, equipment))
    };
    return recipe;
  }

  private mapRecipeIngredientDtoToRecipeIngredient(
    recipe: Recipe,
    ri: IRecipeIngredient,
    ingredients: Ingredient[],
    measures: Measurement[]
  ): RecipeIngredient {
    const measure = measures.find((m) => m.id === ri.measure.id);
    const ingredient = ingredients.find((i) => i.id === ri.ingredientId);
    return {
      id: ri.id,
      amount: ri.amount,
      consistency: ri.consistency,
      meta: ri.meta,
      recipeId: recipe.id,
      ingredientId: ri.ingredientId,
      ingredient,
      measure,
      recipe,
      measureId: measure.id
    };
  }

  private mapSteppedInstructionsDtoToEntity(
    recipe: Recipe,
    si: IRecipeSteppedInstruction,
    recipeIngredients: Ingredient[],
    equipments: Equipment[]
  ): RecipeSteppedInstruction {
    const stepIngredientIds = si.ingredients.map((i) => i.id);
    const recipeSteppedInstruction: RecipeSteppedInstruction = {
      id: si.id,
      step: si.step,
      stepName: si.stepName,
      stepNumber: si.stepNumber,
      lengthTimeValue: si.lengthTimeValue,
      lengthTimeUnit: si.lengthTimeUnit,
      recipe,
      recipeId: recipe.id,
      equipment: si.equipment.map((e) => this.mapEquipmentSteppedInstructionToEntity(recipeSteppedInstruction, e, equipments)),
      ingredients: recipeIngredients.filter((i) => stepIngredientIds.includes(i.id))
    };

    return recipeSteppedInstruction;
  }

  private mapEquipmentSteppedInstructionToEntity(
    recipeSteppedInstruction: RecipeSteppedInstruction,
    e: IEquipmentSteppedInstruction,
    equipments: Equipment[]
  ): EquipmentSteppedInstruction {
    return {
      equipment: equipments.find((eq) => eq.id === e.equipmentId),
      recipeSteppedInstruction,
      recipeSteppedInstructionId: recipeSteppedInstruction.id,
      temperature: e.temperature,
      temperatureUnit: e.temperatureUnit
    };
  }

  private async mapRecipeToRecipeDto(recipe: Recipe): Promise<IRecipe> {
    // const cuisineType: string[] = recipe.cuisineType.map((item: CuisineType) => item.name);
    // const dishType: string[] = recipe.dishType.map((item: DishType) => item.name);
    // const diets: string[] = recipe.diets.map((item: HealthLabel) => item.name);
    // const healthLabels: THealthBooleanLabels[] = this.healthLabelKeys.filter((key: THealthBooleanLabels) => recipe[key]);
    const measures = await this.measurementRepository.find();

    const ingredients: IIngredient[] = recipe.ingredients.map((i: Ingredient) =>
      this.ingredientService.mapIngredientToIIngredientDTO(i, true, measures)
    );
    const ingredientList: IRecipeIngredient[] = recipe.ingredientList.map((il: RecipeIngredient) =>
      this.ingredientService.mapRecipeIngredientToIRecipeIngredientDto(il, recipe.id, measures, recipe.ingredients)
    );
    const steppedInstructions: IRecipeSteppedInstruction[] = recipe.steppedInstructions.map((si: RecipeSteppedInstruction) =>
      this.mapRecipeSteppedInstructionToISteppedInstruction(si, recipe.id)
    );

    return {
      ...this.mapRecipeToShortRecipeDto(recipe),
      ingredients,
      ingredientList,
      steppedInstructions,
      equipment: recipe.equipment.map((equip) => equip.name)
    };
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
