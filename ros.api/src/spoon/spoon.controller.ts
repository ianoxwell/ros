import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IMessage } from 'src/base/message.dto';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { MeasurementService } from 'src/measurement/measurement.service';
import { Recipe } from 'src/recipe/recipe.enitity';
import { ISpoonConversion } from './models/spoon-conversion.dto';
import { ISpoonSuggestions } from './models/spoon-suggestions.dto';
import { SpoonService } from './spoon.service';

@ApiTags('Spoonfed')
@Controller('spoon')
export class SpoonController {
  constructor(private spoonService: SpoonService, private measureService: MeasurementService) {}

  // TODO Make these ALL admin only!!!

  @Get('suggestion/ingredient')
  @ApiQuery({ name: 'name', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getIngredientSuggestion(@Query('name') name: string, @Query('limit') limit = 5): Promise<ISpoonSuggestions[]> {
    return this.spoonService.getSpoonIngredientSuggestion(name, limit);
  }

  @Get('ingredient')
  @ApiQuery({ name: 'id', required: true, type: String })
  @ApiQuery({ name: 'amount', required: false, type: Number })
  @ApiQuery({ name: 'unit', required: false, type: String })
  async getSpoonIngredientById(@Query('id') id: string, @Query('amount') amount: number, @Query('unit') unit: string): Promise<Ingredient> {
    return this.spoonService.getSpoonIngredientById(id, amount, unit);
  }

  @Get('conversion')
  @ApiQuery({ name: 'foodName', required: true, example: 'wholemeal flour', type: String })
  @ApiQuery({ name: 'sourceUnit', required: true, example: 'grams', type: String })
  @ApiQuery({ name: 'sourceAmount', required: true, example: 100, type: Number })
  @ApiQuery({ name: 'targetUnit', required: true, example: 'cup', type: String })
  async getSpoonConversion(
    @Query('foodName') foodName: string,
    @Query('sourceUnit') sourceUnit: string,
    @Query('sourceAmount') sourceAmount: number,
    @Query('targetUnit') targetUnit: string
  ): Promise<ISpoonConversion> {
    const findSourceUnit = await this.measureService.findOne(sourceUnit);
    if (findSourceUnit !== null) {
      return await this.spoonService.getSpoonConversion(foodName, findSourceUnit, sourceAmount, targetUnit);
    }
  }

  @Get('suggestion/recipe')
  @ApiQuery({ name: 'diet', required: true, type: String, description: 'Ketogenic, Pescetarian, Vegetarian, Lacto-Vegetarian' })
  async getSpoonRecipeSuggestions(@Query('diet') diet: string): Promise<any> {
    return this.spoonService.getSpoonRecipeSuggestion(diet, '', 1);
  }

  @Get('recipe/random')
  @ApiQuery({
    name: 'tags',
    required: false,
    type: String,
    description: 'comma separated tags: keto, Pescetarian, Vegetarian, Lacto-Vegetarian'
  })
  @ApiOkResponse({ type: Recipe })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getSpoonRandom(@Query('tags') tags = '', @Query('limit') limit = 1): Promise<Recipe | IMessage> {
    return this.spoonService.getSpoonRandomRecipe(tags, limit);
  }

  @Get('recipe/id')
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Spoonacular recipe Id'
  })
  @ApiOkResponse({ type: Recipe })
  async getSpoonRecipeId(@Query('id') id: number): Promise<Recipe | IMessage> {
    return await this.spoonService.getSpoonRecipeId(id);
  }
}
