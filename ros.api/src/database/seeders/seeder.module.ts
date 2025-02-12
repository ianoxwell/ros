import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversion } from 'src/ingredient/conversion/conversion.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { Measurement } from 'src/measurement/measurement.entity';
import { MeasurementModule } from 'src/measurement/measurement.module';
import { CuisineType } from 'src/recipe/cuisine-type/cuisine-type.entity';
import { DishType } from 'src/recipe/dish-type/dish-type.entity';
import { Equipment } from 'src/recipe/equipment/equipment.entity';
import { HealthLabel } from 'src/recipe/health-label/health-label.entity';
import { RecipeIngredient } from 'src/recipe/recipe-ingredient/recipe-ingredient.entity';
import { RecipeSteppedInstruction } from 'src/recipe/recipe-stepped-instructions/recipe-stepped-instructions.entity';
import { Recipe } from 'src/recipe/recipe.enitity';
import { RecipeModule } from 'src/recipe/recipe.module';
import { Reference } from 'src/reference/reference.entity';
import { ReferenceModule } from 'src/reference/reference.module';
import { User } from 'src/user/user.entity';
import { Seeder } from './seeder';
import { EquipmentSteppedInstruction } from 'src/recipe/recipe-stepped-instructions/equipment-stepped-instruction.entity';

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
