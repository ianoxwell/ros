import { Module } from '@nestjs/common';
import { IngredientModule } from 'src/ingredient/ingredient.module';
import { MeasurementModule } from 'src/measurement/measurement.module';
import { RecipeModule } from 'src/recipe/recipe.module';
import { SpoonController } from './spoon.controller';
import { SpoonService } from './spoon.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, IngredientModule, MeasurementModule, RecipeModule],
  providers: [SpoonService],
  controllers: [SpoonController],
  exports: [SpoonService]
})
export class SpoonModule {}
