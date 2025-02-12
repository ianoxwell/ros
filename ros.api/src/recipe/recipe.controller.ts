import { Controller, Get, Param } from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IMessage } from 'src/base/message.dto';
import { PaginatedDto } from 'src/base/paginated.dto';
import { IRecipe, IRecipeShort } from './recipe.dto';
import { RecipeService } from './recipe.service';

@ApiTags('Recipe')
@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  /** Quick and dirty get */
  @Get()
  async findAll(): Promise<PaginatedDto<IRecipeShort>> {
    return await this.recipeService.findAll();
  }

  /** Gets a specific recipe by Id */
  @Get(':id')
  @ApiOkResponse({
    description: 'Single Recipe',
    type: IRecipe
  })
  async find(@Param('id') id: string): Promise<IRecipe | IMessage> {
    return this.recipeService.getRecipeById(parseInt(id));
  }

  /** Deletes a single recipe. */
  @Delete(':id')
  async deleteRecipe(@Param('id') id: string): Promise<any> {
    return this.recipeService.deleteById(parseInt(id));
  }
}
