import { MeasurementModule } from '@controllers/measurement/measurement.module';
import { CuisineType } from '@controllers/recipe/cuisine-type/cuisine-type.entity';
import { DishType } from '@controllers/recipe/dish-type/dish-type.entity';
import { Equipment } from '@controllers/recipe/equipment/equipment.entity';
import { HealthLabel } from '@controllers/recipe/health-label/health-label.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '@services/auth/jwt.strategy';
import { ReferenceController } from './reference.controller';
import { Reference } from './reference.entity';
import { ReferenceService } from './reference.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reference, Equipment, HealthLabel, DishType, CuisineType]), MeasurementModule],
  providers: [ReferenceService, JwtStrategy],
  controllers: [ReferenceController],
  exports: [ReferenceService]
})
export class ReferenceModule {}
