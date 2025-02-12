import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Ingredient } from './ingredient/ingredient.entity';
import { IngredientModule } from './ingredient/ingredient.module';
import { MailModule } from './mail/mail.module';
import { Measurement } from './measurement/measurement.entity';
import { MeasurementModule } from './measurement/measurement.module';
import { Recipe } from './recipe/recipe.enitity';
import { RecipeModule } from './recipe/recipe.module';
import { Reference } from './reference/reference.entity';
import { ReferenceModule } from './reference/reference.module';
import { StatusModule } from './status/status.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { SpoonModule } from './spoon/spoon.module';
import { CuisineType } from './recipe/cuisine-type/cuisine-type.entity';
import { DishType } from './recipe/dish-type/dish-type.entity';
import { Equipment } from './recipe/equipment/equipment.entity';
import { HealthLabel } from './recipe/health-label/health-label.entity';
import { RecipeIngredient } from './recipe/recipe-ingredient/recipe-ingredient.entity';
import { RecipeSteppedInstruction } from './recipe/recipe-stepped-instructions/recipe-stepped-instructions.entity';
import { Conversion } from './ingredient/conversion/conversion.entity';
import { EquipmentSteppedInstruction } from './recipe/recipe-stepped-instructions/equipment-stepped-instruction.entity';

// if online then uses fly.io secret for DATABASE_URL, else use `flyctl proxy 5432 -a api-ros-db` and local hidden .env file.
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true // no need to import into other modules
    }),
    IngredientModule,
    ReferenceModule,
    StatusModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'api_ros',
      entities: [
        Reference,
        User,
        Recipe,
        Ingredient,
        Conversion,
        Measurement,
        CuisineType,
        DishType,
        Equipment,
        HealthLabel,
        RecipeIngredient,
        RecipeSteppedInstruction,
        EquipmentSteppedInstruction
      ],
      migrations: [],
      synchronize: false,
      url: process.env.DATABASE_URL || process.env.PG_URL
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10
        }
      ]
    }),

    UserModule,
    RecipeModule,
    MeasurementModule,
    MailModule,
    AuthModule,
    SpoonModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
