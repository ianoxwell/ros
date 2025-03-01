import { IFilterBase } from '@base/filter.entity';
import { CMessage } from '@base/message.class';
import { PageMetaDto, PaginatedDto } from '@base/paginated.entity';
import { Measurement } from '@controllers/measurement/measurement.entity';
import { IFilter } from '@models/filter.dto';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { Delete, Query, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { IIngredient, IIngredientShort } from 'Models/ingredient.dto';
import { Repository } from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { IngredientService } from './ingredient.service';

@ApiTags('Ingredient')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@Controller('ingredient')
export class IngredientController {
  constructor(
    private ingredientService: IngredientService,
    @InjectRepository(Measurement) private readonly measurementRepository: Repository<Measurement>
  ) {}

  @Get('suggestion')
  async ingredientSuggestionList(@Query('filter') filter: string): Promise<PaginatedDto<IIngredientShort>> {
    //  @Query('limit') limit: number
    const limit = 10;
    if (filter.length < 2) {
      return new PaginatedDto([], new PageMetaDto({ pageOptionsDto: { page: 0, take: limit, skip: 0 }, itemCount: 0 }));
    }

    return this.ingredientService.getSuggestedIngredients(filter, limit);
  }

  @Delete(':id')
  async deleteIngredient(@Param('id') id: string): Promise<CMessage> {
    return await this.ingredientService.deleteIngredientById(parseInt(id));
  }

  @Post('/search')
  @ApiOkResponse({ type: PaginatedDto<IIngredient> })
  @HttpCode(200)
  async searchIngredients(@Body() filter: IFilter): Promise<PaginatedDto<IIngredient>> {
    const filterBase: IFilterBase = {
      ...filter,
      skip: filter.page * filter.take
    };
    return await this.ingredientService.getIngredients(filterBase);
  }

  @Get('check-name')
  async isIngredientNameAvailable(@Param('name') name: string): Promise<boolean> {
    return await this.ingredientService.ingredientNameAvailable(name);
  }

  /**
   * Without an Id or with an Id of 0 indicates a create - otherwise attempts to update
   * @param ingredient IIngredient
   * @returns either the new created/updated ingredient or a message in case of failure
   */
  @Post()
  async createUpdateIngredient(@Body() ingredient: IIngredient): Promise<IIngredient | CMessage> {
    if (ingredient === null) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Missing ingredient' }, HttpStatus.BAD_REQUEST);
    }

    if (ingredient.id) {
      return (await this.ingredientService.updateIngredient(ingredient.id, ingredient)).raw;
    }

    const ing = await this.ingredientService.createIngredientFromDto(ingredient);
    const measures = await this.measurementRepository.find();
    return ing instanceof CMessage ? ing : this.ingredientService.mapIngredientToIIngredientDTO(ing, true, measures);
  }

  /** Quick and dirty get */
  @Get('list')
  async findAll(): Promise<PaginatedDto<Ingredient>> {
    return await this.ingredientService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get a single Ingredient by Id'
  })
  async find(@Param('id') id: string): Promise<Ingredient> {
    return this.ingredientService.getIngredientByIdForRecipe(parseInt(id));
  }
}
