import { CMessage } from '@base/message.class';
import { PaginatedDto } from '@base/paginated.entity';
import { Controller, Get, Param } from '@nestjs/common';
import { Delete, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IRecipe, IRecipeShort } from '../../../Models/recipe.dto';
import { RecipeService } from './recipe.service';

@ApiTags('Recipe')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
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
    description: 'Single Recipe'
  })
  async find(@Param('id') id: string): Promise<IRecipe | CMessage> {
    return this.recipeService.getRecipeById(parseInt(id));
  }

  /** Deletes a single recipe. */
  @Delete(':id')
  async deleteRecipe(@Param('id') id: string): Promise<any> {
    return this.recipeService.deleteById(parseInt(id));
  }
}
