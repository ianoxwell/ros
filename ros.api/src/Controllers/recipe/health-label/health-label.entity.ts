import { RosBaseEntity } from 'src/base/base.entity';
import { Column, Entity, JoinTable, ManyToMany, Unique } from 'typeorm';
import { Recipe } from '../recipe.entity';

@Entity()
@Unique(['name'])
export class HealthLabel extends RosBaseEntity {
  @Column({ length: 120 })
  name!: string;

  @Column({ length: 120, nullable: true })
  altName?: string;

  @Column({ length: 512, nullable: true })
  description?: string;

  @ManyToMany(() => Recipe, (recipe) => recipe.diets)
  @JoinTable()
  recipes?: Recipe[];
}
