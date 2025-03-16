import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferenceController } from './reference.controller';
import { Reference } from './reference.entity';
import { ReferenceService } from './reference.service';
import { JwtStrategy } from '@services/auth/jwt.strategy';
import { MeasurementModule } from '@controllers/measurement/measurement.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reference]), MeasurementModule],
  providers: [ReferenceService, JwtStrategy],
  controllers: [ReferenceController],
  exports: [ReferenceService]
})
export class ReferenceModule {}
