import { User } from '@controllers//account/user.entity';
import { Conversion } from '@controllers//ingredient/conversion/conversion.entity';
import { Ingredient } from '@controllers//ingredient/ingredient.entity';
import { Measurement } from '@controllers//measurement/measurement.entity';
import { MeasurementModule } from '@controllers//measurement/measurement.module';
import { CuisineType } from '@controllers//recipe/cuisine-type/cuisine-type.entity';
import { DishType } from '@controllers//recipe/dish-type/dish-type.entity';
import { Equipment } from '@controllers//recipe/equipment/equipment.entity';
import { HealthLabel } from '@controllers//recipe/health-label/health-label.entity';
import { RecipeIngredient } from '@controllers//recipe/recipe-ingredient/recipe-ingredient.entity';
import { EquipmentSteppedInstruction } from '@controllers//recipe/recipe-stepped-instructions/equipment-stepped-instruction.entity';
import { RecipeSteppedInstruction } from '@controllers//recipe/recipe-stepped-instructions/recipe-stepped-instructions.entity';
import { Recipe } from '@controllers//recipe/recipe.entity';
import { RecipeModule } from '@controllers//recipe/recipe.module';
import { Reference } from '@controllers//reference/reference.entity';
import { ReferenceModule } from '@controllers//reference/reference.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seeder } from './seeder';

/**
 * Modified from the medium article on seeding https://medium.com/the-crowdlinker-chronicle/seeding-databases-using-nestjs-cd6634e8efc5
 */

// if online then uses fly.io secret for DATABASE_URL, else use `flyctl proxy 5432 -a api-ros-db` and local hidden .env file.

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true // no need to import into other modules
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'ros',
      entities: [
        Reference,
        User,
        Recipe,
        Ingredient,
        Conversion,
        Measurement,
        Recipe,
        CuisineType,
        DishType,
        Equipment,
        HealthLabel,
        RecipeIngredient,
        RecipeSteppedInstruction,
        EquipmentSteppedInstruction
      ],
      migrations: [],
      synchronize: true,
      url: process.env.DATABASE_URL || process.env.PG_URL
    }),
    ReferenceModule,
    MeasurementModule,
    RecipeModule
  ],
  providers: [Seeder]
})
export class SeederModule {}
