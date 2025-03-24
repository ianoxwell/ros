import { RosBaseEntity } from '@base/base.entity';
import { Column, Entity, JoinTable, ManyToMany, Unique } from 'typeorm';
import { Recipe } from '../recipe.entity';

@Entity()
@Unique(['name'])
export class Equipment extends RosBaseEntity {
  @Column({ length: 120 })
  name!: string;

  @Column({ length: 120, nullable: true })
  altName?: string;

  @Column({ type: 'integer', nullable: true })
  spoonId?: number;

  @Column({ length: 512, nullable: true })
  description?: string;

  @Column({ length: 120, nullable: true })
  image?: string;

  @ManyToMany(() => Recipe)
  @JoinTable()
  recipes: Recipe[];
}
