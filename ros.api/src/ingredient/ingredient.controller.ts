import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IFilterBase } from 'src/base/filter.dto';
import { PaginatedDto } from 'src/base/paginated.dto';
import { IIngredient } from './ingredient.dto';
import { Ingredient } from './ingredient.entity';
import { IngredientService } from './ingredient.service';

@ApiTags('Ingredient')
@Controller('ingredient')
export class IngredientController {
  constructor(private ingredientService: IngredientService) {}

  @Get(':id')
  @ApiOkResponse({
    description: 'Single Ingredient',
    type: IIngredient
  })
  async find(@Param('id') id: string): Promise<Ingredient> {
    return this.ingredientService.getIngredientByIdForRecipe(parseInt(id));
  }

  @Delete(':id')
  async deleteIngredient(@Param('id') id: string): Promise<any> {
    return this.ingredientService.deleteIngredientById(parseInt(id));
  }

  @Post('/search')
  @ApiOkResponse({ type: PaginatedDto<IIngredient> })
  @HttpCode(200)
  async searchIngredients(@Body() filter: IFilterBase): Promise<PaginatedDto<Ingredient>> {
    return await this.ingredientService.getIngredients(filter);
  }

  /** Quick and dirty get */
  @Get()
  async findAll(): Promise<PaginatedDto<Ingredient>> {
    return await this.ingredientService.findAll();
  }
}
