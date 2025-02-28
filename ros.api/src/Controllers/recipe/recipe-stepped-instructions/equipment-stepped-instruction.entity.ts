import { RosBaseEntity } from '@base/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Equipment } from '../equipment/equipment.entity';
import { RecipeSteppedInstruction } from './recipe-stepped-instructions.entity';

@Entity()
export class EquipmentSteppedInstruction extends RosBaseEntity {
  @ManyToOne(() => Equipment, { onDelete: 'CASCADE' })
  equipment: Equipment;

  @ManyToOne(() => RecipeSteppedInstruction, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeSteppedInstructionId' })
  recipeSteppedInstruction: RecipeSteppedInstruction;

  @Column({ name: 'recipeSteppedInstructionId' })
  recipeSteppedInstructionId: number;

  @Column({ type: 'integer', nullable: true })
  temperature?: number;

  @ApiProperty({ description: 'Fahrenheit or Celsius' })
  @Column({ length: 80, nullable: true })
  temperatureUnit?: string;
}
