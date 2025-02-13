import { RosBaseEntity } from 'src/base/base.entity';
import { Recipe } from '../recipe.entity';
import { Entity, Unique, Column, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['name'])
export class DishType extends RosBaseEntity {
  @ApiProperty({ example: 'side dish, main meal, dessert' })
  @Column({ length: 120 })
  name!: string;

  @Column({ length: 120, nullable: true })
  altName?: string;

  @Column({ length: 512, nullable: true })
  description?: string;

  @ManyToMany(() => Recipe, (recipe) => recipe.dishType)
  @JoinTable()
  recipes: Recipe[];
}
