import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IngredientModule } from '../ingredient/ingredient.module';
import { MeasurementModule } from '../measurement/measurement.module';
import { RecipeModule } from '../recipe/recipe.module';
import { SpoonController } from './spoon.controller';
import { SpoonService } from './spoon.service';
import { FileService } from '@services/file.service';

@Module({
  imports: [HttpModule, IngredientModule, MeasurementModule, RecipeModule],
  providers: [SpoonService, FileService],
  controllers: [SpoonController],
  exports: [SpoonService]
})
export class SpoonModule {}
