import { CMessage } from '@base/message.class';
import { PageMetaDto, PaginatedDto } from '@base/paginated.entity';
import { IPagedResult } from '@models/base.dto';
import { IRecipeFilter } from '@models/filter.dto';
import { IRecipe, IRecipeShort } from '@models/recipe.dto';
import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { Body, Delete, HttpCode, Post, Query, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RecipeService } from './recipe.service';

@ApiTags('Recipe')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  /** Quick and dirty get, limit of 20 items */
  @Get('list')
  async findAll(): Promise<IPagedResult<IRecipeShort>> {
    return await this.recipeService.findAll();
  }

  @Post('/search')
  @ApiOkResponse({ description: 'uses filter to search recipe, results paginated results' })
  @HttpCode(200)
  async searchIngredients(@Body() filter: IRecipeFilter): Promise<IPagedResult<IRecipeShort>> {
    const filterBase: IRecipeFilter = {
      ...filter,
      skip: filter.page * filter.take
    };
    return await this.recipeService.getRecipes(filterBase);
  }

  @Get('suggestion')
  @ApiOkResponse({
    description: 'Gets short recipes that include the filter string in the name'
  })
  async ingredientSuggestionList(@Query('filter') filter: string): Promise<IPagedResult<IRecipeShort>> {
    //  @Query('limit') limit: number
    console.log('filter', filter);
    const limit = 10;

    return this.recipeService.getSuggestedRecipes(filter, limit);
  }

  @Get('check-name')
  @ApiOkResponse({
    description: 'Checks that the name exists, returns true if the name is available'
  })
  async isRecipeNameAvailable(@Param() name: string): Promise<boolean> {
    return this.recipeService.recipeNameAvailable(name);
  }

  /** Gets a specific recipe by Id */
  @Get(':id')
  @ApiOkResponse({
    description: 'Single Recipe'
  })
  async find(@Param('id') id: string): Promise<IRecipe | CMessage> {
    return await this.recipeService.getRecipeById(parseInt(id));
  }

  /** Deletes a single recipe. */
  @Delete(':id')
  async deleteRecipe(@Param('id') id: string): Promise<any> {
    return this.recipeService.deleteById(parseInt(id));
  }

  /**
   * Without an Id or with an Id of 0 indicates a create - otherwise attempts to update
   * @param recipe IRecipe
   * @returns either the new created/updated ingredient or a message in case of failure
   */
  @Post()
  @ApiOkResponse({
    description: 'Without an Id or with an Id of 0 indicates a create - otherwise attempts to update'
  })
  async createUpdateIngredient(@Body() recipe: IRecipe): Promise<IRecipe | CMessage> {
    if (recipe === null) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Missing recipe' }, HttpStatus.BAD_REQUEST);
    }

    if (recipe.id) {
      return await this.recipeService.updateRecipe(recipe);
    }

    return await this.recipeService.createRecipe(recipe);
  }
}
