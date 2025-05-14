import { Measurement } from '@controllers/measurement/measurement.entity';
import { Recipe } from '@controllers/recipe/recipe.entity';
import { ScheduleModule } from '@controllers/schedule/schedule.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { IngredientModule } from '@controllers/ingredient/ingredient.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, Measurement]), ScheduleModule, IngredientModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
