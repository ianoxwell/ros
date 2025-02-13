import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferenceController } from './reference.controller';
import { Reference } from './reference.entity';
import { ReferenceService } from './reference.service';
import { JwtStrategy } from '@services/auth/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Reference])],
  providers: [ReferenceService, JwtStrategy],
  controllers: [ReferenceController],
  exports: [ReferenceService]
})
export class ReferenceModule {}
