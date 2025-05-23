import { User } from '@controllers/account/user.entity';
import { UserModule } from '@controllers/account/user.module';
import { Conversion } from '@controllers/ingredient/conversion/conversion.entity';
import { Ingredient } from '@controllers/ingredient/ingredient.entity';
import { IngredientModule } from '@controllers/ingredient/ingredient.module';
import { Measurement } from '@controllers/measurement/measurement.entity';
import { MeasurementModule } from '@controllers/measurement/measurement.module';
import { OrdersModule } from '@controllers/orders/orders.module';
import { CuisineType } from '@controllers/recipe/cuisine-type/cuisine-type.entity';
import { DishType } from '@controllers/recipe/dish-type/dish-type.entity';
import { Equipment } from '@controllers/recipe/equipment/equipment.entity';
import { HealthLabel } from '@controllers/recipe/health-label/health-label.entity';
import { RecipeIngredient } from '@controllers/recipe/recipe-ingredient/recipe-ingredient.entity';
import { Recipe } from '@controllers/recipe/recipe.entity';
import { RecipeModule } from '@controllers/recipe/recipe.module';
import { Reference } from '@controllers/reference/reference.entity';
import { ReferenceModule } from '@controllers/reference/reference.module';
import { ScheduleRecipe } from '@controllers/schedule/schedule-recipe.entity';
import { Schedule } from '@controllers/schedule/schedule.entity';
import { ScheduleModule } from '@controllers/schedule/schedule.module';
import { SpoonModule } from '@controllers/spoon/spoon.module';
import { StatusModule } from '@controllers/status/status.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@services/auth/auth.module';
import { MailModule } from '@services/mail/mail.module';

// if online then uses fly.io secret for DATABASE_URL, else use `flyctl proxy 5432 -a api-ros-db` and local hidden .env file.
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true // no need to import into other modules
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'api_ros',
      url: process.env.DATABASE_URL || process.env.PG_URL,
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
        Schedule,
        ScheduleRecipe
      ],
      logging: ['error', 'warn'],
      poolSize: 5,
      maxQueryExecutionTime: 5000,
      migrations: [],
      synchronize: false
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10
        }
      ]
    }),

    IngredientModule,
    ReferenceModule,
    StatusModule,
    UserModule,
    RecipeModule,
    MeasurementModule,
    MailModule,
    AuthModule,
    SpoonModule,
    ScheduleModule,
    OrdersModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
