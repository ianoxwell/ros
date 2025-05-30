import { ApiProperty } from '@nestjs/swagger';
import { RosBaseEntity } from '@base/base.entity';
import { Column, Entity } from 'typeorm';
import { EReferenceType, IReference } from '../../../Models/reference.dto';

@Entity()
export class Reference extends RosBaseEntity implements IReference {
  @Column({ length: 120 })
  title: string;

  @Column({
    type: 'enum',
    enum: EReferenceType,
    default: EReferenceType.allergyWarning
  })
  refType: EReferenceType;

  @Column({ length: 80, nullable: true })
  symbol?: string;

  @Column({ length: 300, nullable: true })
  summary?: string;

  @Column({ length: 120, nullable: true })
  altTitle?: string;

  @ApiProperty({
    description: `Equipment has a spoonacular reference`,
    example: 23
  })
  @Column({ type: 'int', nullable: true })
  onlineId?: number;

  @Column({ type: 'int', nullable: true })
  sortOrder?: number;
}
