import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Controllers/account/user.entity';
import { UserModule } from './Controllers/account/user.module';
import { Conversion } from './Controllers/ingredient/conversion/conversion.entity';
import { Ingredient } from './Controllers/ingredient/ingredient.entity';
import { IngredientModule } from './Controllers/ingredient/ingredient.module';
import { Measurement } from './Controllers/measurement/measurement.entity';
import { MeasurementModule } from './Controllers/measurement/measurement.module';
import { CuisineType } from './Controllers/recipe/cuisine-type/cuisine-type.entity';
import { DishType } from './Controllers/recipe/dish-type/dish-type.entity';
import { Equipment } from './Controllers/recipe/equipment/equipment.entity';
import { HealthLabel } from './Controllers/recipe/health-label/health-label.entity';
import { RecipeIngredient } from './Controllers/recipe/recipe-ingredient/recipe-ingredient.entity';
import { EquipmentSteppedInstruction } from './Controllers/recipe/recipe-stepped-instructions/equipment-stepped-instruction.entity';
import { RecipeSteppedInstruction } from './Controllers/recipe/recipe-stepped-instructions/recipe-stepped-instructions.entity';
import { Recipe } from './Controllers/recipe/recipe.entity';
import { RecipeModule } from './Controllers/recipe/recipe.module';
import { Reference } from './Controllers/reference/reference.entity';
import { ReferenceModule } from './Controllers/reference/reference.module';
import { SpoonModule } from './Controllers/spoon/spoon.module';
import { StatusModule } from './Controllers/status/status.module';
import { AuthModule } from './Services/auth/auth.module';
import { MailModule } from './Services/mail/mail.module';

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
