import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientModule } from 'src/ingredient/ingredient.module';
import { Measurement } from 'src/measurement/measurement.entity';
import { CuisineType } from './cuisine-type/cuisine-type.entity';
import { DishType } from './dish-type/dish-type.entity';
import { Equipment } from './equipment/equipment.entity';
import { HealthLabel } from './health-label/health-label.entity';
import { HealthLabelService } from './health-label/health-label.service';
import { RecipeIngredient } from './recipe-ingredient/recipe-ingredient.entity';
import { EquipmentSteppedInstruction } from './recipe-stepped-instructions/equipment-stepped-instruction.entity';
import { RecipeSteppedInstruction } from './recipe-stepped-instructions/recipe-stepped-instructions.entity';
import { RecipeController } from './recipe.controller';
import { Recipe } from './recipe.enitity';
import { RecipeService } from './recipe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe,
      CuisineType,
      DishType,
      Equipment,
      HealthLabel,
      RecipeIngredient,
      RecipeSteppedInstruction,
      EquipmentSteppedInstruction,
      Measurement
    ]),
    PassportModule,
    IngredientModule
  ],
  controllers: [RecipeController],
  providers: [RecipeService, HealthLabelService],
  exports: [RecipeService, HealthLabelService]
})
export class RecipeModule {}
