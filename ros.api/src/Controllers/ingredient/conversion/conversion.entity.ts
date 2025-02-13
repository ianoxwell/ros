import { ApiProperty } from '@nestjs/swagger';
import { RosBaseEntity } from 'src/base/base.entity';
import { Measurement } from 'src/Controllers/measurement/measurement.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IConversion } from '../../../../../Models/conversion.dto';
import { Ingredient } from '../ingredient.entity';

@Entity()
export class Conversion extends RosBaseEntity implements IConversion {
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.conversions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;

  @Column({ name: 'ingredientId' })
  ingredientId: number;

  @Column('decimal', { precision: 5, scale: 2 })
  sourceAmount: number;

  @ManyToOne(() => Measurement)
  @JoinColumn({ name: 'sourceUnitId' })
  sourceUnit: Measurement;
  @Column({ name: 'sourceUnitId' })
  sourceUnitId: number;

  @Column('decimal', { precision: 5, scale: 2 })
  targetAmount: number;

  @ManyToOne(() => Measurement)
  @JoinColumn({ name: 'targetUnitId' })
  targetUnit: Measurement;
  @Column({ name: 'targetUnitId' })
  targetUnitId: number;

  @ApiProperty({
    description: `English conversion sentence`,
    example: '1 cup olive oil translates to 216 g.'
  })
  @Column({ length: 200, nullable: true })
  answer: string;

  @ApiProperty({
    description: `Unsure of some of the values here, the example give was CONVERSION`,
    example: 'CONVERSION'
  })
  @Column({ length: 80, nullable: true })
  type: string;
}
