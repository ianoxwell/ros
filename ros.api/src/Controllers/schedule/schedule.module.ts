import { RecipeModule } from '@controllers/recipe/recipe.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '@services/auth/jwt.strategy';
import { ScheduleRecipe } from './schedule-recipe.entity';
import { ScheduleController } from './schedule.controller';
import { Schedule } from './schedule.entity';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, ScheduleRecipe]), RecipeModule],
  controllers: [ScheduleController],
  providers: [ScheduleService, JwtStrategy],
  exports: [ScheduleService]
})
export class ScheduleModule {}
