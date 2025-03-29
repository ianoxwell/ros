import { CPageOptionsDto } from '@base/filter.const';
import { IFilterBase } from '@base/filter.entity';
import { CMessage } from '@base/message.class';
import { PageMetaDto, PaginatedDto } from '@base/paginated.entity';
import { EOrder } from '@models/base.dto';
import { IRecipeFilter } from '@models/filter.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IEquipmentSteppedInstruction } from 'Models/equipment-stepped-instruction.dto';
import { ISimpleEquipment } from 'Models/equipment.dto';
import { IIngredientShort } from 'Models/ingredient.dto';
import { IRecipeIngredient } from 'Models/recipe-ingredient.dto';
import { IRecipeSteppedInstruction } from 'Models/recipe-stepped-instructions.dto';
import { IRecipe, IRecipeShort, THealthBooleanLabels } from 'Models/recipe.dto';
import { ILike, In, Raw, Repository } from 'typeorm';
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
import { calculateRecipeNutrition } from './recipe-nutrition-calculator';
import { IEquipmentStepDto, IRecipeSteppedInstructionDto } from './recipe-stepped-instructions/recipe-stepped-instructions.model';
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

  /** Used for quick and dirty json update - but this might be what we need for actual updates? */
  async updateRecipeOneTime(recipePartial: Partial<Recipe>) {
    const updatedRecipe = await this.repository.preload(recipePartial);
    return await this.repository.save(updatedRecipe);
  }

  /** Filter ingredients and paginate the results. */
  async getRecipes(pageOptionsDto: IRecipeFilter): Promise<PaginatedDto<IRecipeShort>> {
    const additionalQueryParams = {
      ...(pageOptionsDto.cuisineTypes?.length && { cuisineType: { id: In(pageOptionsDto.cuisineTypes) } }),
      ...(pageOptionsDto.diets?.length && { diets: { id: In(pageOptionsDto.diets) } }),
      ...(pageOptionsDto.dishTypes?.length && { dishType: { id: In(pageOptionsDto.dishTypes) } }),
      ...(pageOptionsDto.equipment?.length && { equipment: { id: In(pageOptionsDto.equipment) } })
    };
    const [result, itemCount] = await this.repository.findAndCount({
      where: [
        { name: Raw((alias) => `LOWER(${alias}) Like '%${pageOptionsDto.keyword.toLowerCase()}%'`), ...additionalQueryParams },
        { summary: ILike(pageOptionsDto.keyword) }
      ],
      order: { [pageOptionsDto.sort || 'name']: pageOptionsDto.order || EOrder.DESC },
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
      where: { name: Raw((alias) => `LOWER(${alias}) Like '%${pageOptionsDto.keyword.toLowerCase()}%'`) },
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

  async getRecipeByName(name: string): Promise<Recipe | boolean> {
    const getRecipe: Recipe = await this.repository.findOne({
      where: { name: Raw((alias) => `LOWER(${alias}) Like '%${name.toLowerCase()}%'`) }
    });
    return getRecipe || false;
  }

  /** Gets a single recipe */
  async getRecipeById(id: number): Promise<IRecipe | CMessage> {
    console.time('get recipe start');

    const rawRecipe: any[] = await this.repository.query(
      `SELECT r.*, 
      json_agg(DISTINCT i.*) FILTER (WHERE i.id IS NOT NULL) AS ingredients,
      jsonb_agg(DISTINCT c.*) FILTER (WHERE c.id IS NOT NULL) AS "ingredientConversions", 
      json_agg(DISTINCT ri.*) FILTER (WHERE ri.id IS NOT NULL) AS "ingredientList",
      json_agg(DISTINCT e.*) FILTER (WHERE e.id IS NOT NULL) AS equipment,
      ARRAY_AGG(DISTINCT ct."name") FILTER (WHERE ct.id IS NOT NULL) AS "cuisineType",
      ARRAY_AGG(DISTINCT dt."name") FILTER (WHERE dt.id IS NOT NULL) AS "dishType",
      ARRAY_AGG(DISTINCT hl."name") FILTER (WHERE hl.id IS NOT NULL) AS diets
      FROM recipe r
      LEFT JOIN recipe_ingredient ri ON ri."recipeId" = r.id
      LEFT JOIN ingredient i on i.id = ri."ingredientId"
      LEFT JOIN conversion c on c."ingredientId" = i.id
      LEFT JOIN recipe_equipment_equipment ree ON ree."recipeId" = r.id
      LEFT JOIN equipment e ON e.id = ree."equipmentId"
      LEFT JOIN recipe_cuisine_type_cuisine_type rct ON rct."recipeId" = r.id
      LEFT JOIN cuisine_type ct on ct.id = rct."cuisineTypeId" 
      LEFT JOIN recipe_dish_type_dish_type rdt ON rdt."recipeId" = r.id
      LEFT JOIN dish_type dt on dt.id = rdt."dishTypeId" 
      LEFT JOIN recipe_diets_health_label rhl ON rhl."recipeId" = r.id
      LEFT JOIN health_label hl ON hl.id = rhl."healthLabelId"
      WHERE r.id = $1
      GROUP BY r.id`,
      [id]
    );

    if (!rawRecipe || rawRecipe === null || !rawRecipe.length) {
      const queryTime = new Date().getTime() - this.startTime;

      return new CMessage('Recipe by id not found, ' + queryTime + 'ms', HttpStatus.NOT_FOUND);
    }

    if (!!rawRecipe[0].ingredients && !!rawRecipe[0].ingredientConversions) {
      rawRecipe[0].ingredients = rawRecipe[0].ingredients.map((i) => ({
        ...i,
        conversions: rawRecipe[0].ingredientConversions.filter((ic) => ic.ingredientId === i.id)
      }));
    }

    // raw query is wrapped in an array
    const getRecipe: Recipe = rawRecipe[0] as Recipe;

    getRecipe.cuisineType = getRecipe.cuisineType ?? [];
    getRecipe.dishType = getRecipe.dishType ?? [];
    getRecipe.diets = getRecipe.diets ?? [];
    if (!Array.isArray(getRecipe.images)) {
      getRecipe.images = [getRecipe.images];
    }

    console.timeEnd('get recipe start');
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
      where: [{ name: ILike(spoonRecipe.title) }]
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

    const updatedRecipe = await this.mapRecipeDtoToRecipeEntity(recipe);
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

    const newRecipeEntity = await this.mapRecipeDtoToRecipeEntity(recipe);
    const result = await this.repository.save(newRecipeEntity);
    return result ? await this.mapRecipeToRecipeDto(result) : new CMessage('Unknown failure on save', HttpStatus.BAD_REQUEST);
  }

  /** Maps the spoon equipment to Equipment and saves, else returns the equipment. */
  async createSpoonEquipment(equip: SpoonEquipment): Promise<Equipment> {
    const newEquip = new Equipment();
    newEquip.name = equip.name;
    newEquip.altName = equip.localizedName;
    newEquip.spoonId = equip.id;
    newEquip.image = equip.image;

    return await this.equipmentRepository.save(newEquip);
  }

  async getAllEquipment(): Promise<Equipment[]> {
    return await this.equipmentRepository.find();
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
      cuisineType: recipe.cuisineType as unknown as string[],
      dishType: recipe.dishType as unknown as string[],
      diets: recipe.diets as unknown as string[]
    };
  }

  private async mapRecipeDtoToRecipeEntity(r: IRecipe): Promise<Recipe> {
    const ingredientIds = r.ingredients.map((i) => i.id).filter((id) => !!id);
    const measures = await this.measurementRepository.find();
    const cuisines = await this.cuisineTypeRepository.find();
    const dishTypes = await this.dishTypeRepository.find();
    const equipments = await this.equipmentRepository.find();
    const healthLabels = await this.healthLabelRepository.find();
    const ingredientsPartial = await this.ingredientService.getIngredientFromIdList(ingredientIds);

    const equipmentIdList = r.equipment.map((e) => e.id);
    const cuisineType: CuisineType[] = cuisines.filter((c) => r.cuisineType.includes(c.name));
    const dishType: DishType[] = dishTypes.filter((d) => r.dishType.includes(d.name));
    const equipment: Equipment[] = equipments.filter((e) => equipmentIdList.includes(e.id));
    const diets: HealthLabel[] = healthLabels.filter((h) => r.diets.includes(h.name));
    // Map any ingredients not found in the repository
    const ingredients: Ingredient[] = [...ingredientsPartial]; // TODO confirm this is correct way to do this , ...openIngredients

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
      analyzedInstructions: [] // TODO complete this
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

  private async mapRecipeToRecipeDto(recipe: Recipe): Promise<IRecipe> {
    const measures = await this.measurementRepository.find();

    const ingredients: IIngredientShort[] = recipe.ingredients.map((i: Ingredient) =>
      this.ingredientService.mapIngredientToIIngredientShort(i, measures)
    );
    const ingredientList: IRecipeIngredient[] = recipe.ingredientList.map((il: RecipeIngredient) =>
      this.ingredientService.mapRecipeIngredientToIRecipeIngredientDto(il, recipe.id, measures, recipe.ingredients)
    );
    const steppedInstructions: IRecipeSteppedInstruction[] = recipe.analyzedInstructions
      .map((si: IRecipeSteppedInstructionDto) =>
        this.mapRecipeSteppedInstructionToISteppedInstruction(si, recipe.ingredients, recipe.equipment)
      )
      .sort((a, b) => a.stepNumber - b.stepNumber);

    const mappedRecipe: IRecipe = {
      ...this.mapRecipeToShortRecipeDto(recipe),
      ingredients,
      ingredientList,
      steppedInstructions,
      equipment: recipe.equipment.map((equip) => ({ id: equip.id, name: equip.name, image: equip.image }))
    };
    mappedRecipe.nutrition = calculateRecipeNutrition(mappedRecipe.ingredientList, mappedRecipe.ingredients);
    return mappedRecipe;
  }

  private mapRecipeSteppedInstructionToISteppedInstruction(
    si: IRecipeSteppedInstructionDto,
    recipeIngredients: Ingredient[],
    recipeEquipment: Equipment[]
  ): IRecipeSteppedInstruction {
    return {
      step: si.step,
      stepName: si.stepName,
      stepNumber: si.stepNumber,
      lengthTimeValue: si.lengthTimeValue,
      lengthTimeUnit: si.lengthTimeUnit,
      ingredients: si.ingredientIds.map((i: number) => {
        const ing = recipeIngredients.find((ingred) => ingred.id === i);
        return new CIngredientShort(ing);
      }),
      equipment: si.equipment.length
        ? si.equipment
            .map((eSi: IEquipmentStepDto) => this.mapEquipmentSteppedInstructionToIEquip(eSi, recipeEquipment))
            .filter((eSi) => !!eSi)
        : []
    };
  }

  private mapEquipmentSteppedInstructionToIEquip(
    eSi: IEquipmentStepDto,
    recipeEquipment: Equipment[]
  ): IEquipmentSteppedInstruction | null {
    const equip = recipeEquipment.find((item) => item.id === eSi.equipmentId);
    if (!equip) {
      return null;
    }

    return {
      temperature: eSi.temperature,
      temperatureUnit: eSi.temperatureUnit,
      ...this.mapEquipmentToISimpleEquipment(equip)
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
