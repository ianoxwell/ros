import { RosBaseEntity } from 'src/base/base.entity';
import { Recipe } from '../recipe.enitity';
import { Entity, Unique, Column, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['name'])
export class CuisineType extends RosBaseEntity {
  @ApiProperty({ example: 'Chinese, Indian' })
  @Column({ length: 120 })
  name!: string;

  @Column({ length: 120, nullable: true })
  altName?: string;

  @Column({ length: 512, nullable: true })
  description?: string;

  @ManyToMany(() => Recipe, (recipe) => recipe.cuisineType)
  @JoinTable()
  recipes: Recipe[];
}
