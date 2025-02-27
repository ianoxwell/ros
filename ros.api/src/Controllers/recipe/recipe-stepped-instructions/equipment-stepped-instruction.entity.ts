import { RosBaseEntity } from '@base/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Equipment } from '../equipment/equipment.entity';

@Entity()
export class EquipmentSteppedInstruction extends RosBaseEntity {
  @ManyToOne(() => Equipment, { onDelete: 'CASCADE' })
  equipment: Equipment;

  @Column({ name: 'recipeSteppedInstructionId' })
  recipeSteppedInstructionId: number;

  @Column({ type: 'integer', nullable: true })
  temperature?: number;

  @ApiProperty({ description: 'Fahrenheit or Celsius' })
  @Column({ length: 80, nullable: true })
  temperatureUnit?: string;
}
