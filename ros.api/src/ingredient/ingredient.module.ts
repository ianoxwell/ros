import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Measurement } from 'src/measurement/measurement.entity';
import { IngredientController } from './ingredient.controller';
import { Ingredient } from './ingredient.entity';
import { IngredientService } from './ingredient.service';
import { ConversionService } from './conversion/conversion.service';
import { Conversion } from './conversion/conversion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, Measurement, Conversion]), PassportModule],
  controllers: [IngredientController],
  providers: [IngredientService, JwtStrategy, ConversionService],
  exports: [IngredientService, ConversionService]
})
export class IngredientModule {}
