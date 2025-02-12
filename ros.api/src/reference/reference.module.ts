import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ReferenceController } from './reference.controller';
import { Reference } from './reference.entity';
import { ReferenceService } from './reference.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reference])],
  providers: [ReferenceService, JwtStrategy],
  controllers: [ReferenceController],
  exports: [ReferenceService]
})
export class ReferenceModule {}
