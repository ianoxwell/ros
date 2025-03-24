import { IngredientModule } from '@controllers/ingredient/ingredient.module';
import { Measurement } from '@controllers/measurement/measurement.entity';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuisineType } from './cuisine-type/cuisine-type.entity';
import { DishType } from './dish-type/dish-type.entity';
import { Equipment } from './equipment/equipment.entity';
import { HealthLabel } from './health-label/health-label.entity';
import { HealthLabelService } from './health-label/health-label.service';
import { RecipeIngredient } from './recipe-ingredient/recipe-ingredient.entity';
import { RecipeController } from './recipe.controller';
import { Recipe } from './recipe.entity';
import { RecipeService } from './recipe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, CuisineType, DishType, Equipment, HealthLabel, RecipeIngredient, Measurement]),
    PassportModule,
    IngredientModule
  ],
  controllers: [RecipeController],
  providers: [RecipeService, HealthLabelService],
  exports: [RecipeService, HealthLabelService]
})
export class RecipeModule {}
