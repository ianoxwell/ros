import { ApiProperty } from '@nestjs/swagger';
import { RosBaseEntity } from 'src/base/base.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Recipe } from '../recipe.enitity';
import { EquipmentSteppedInstruction } from './equipment-stepped-instruction.entity';

@Entity()
export class RecipeSteppedInstruction extends RosBaseEntity {
  @Column({ type: 'text' })
  step: string;

  @Column({ length: 120, nullable: true })
  stepName?: string;

  @Column({ type: 'integer' })
  stepNumber: number;

  @ApiProperty({ description: '4 minutes to complete this step' })
  @Column({ type: 'integer', nullable: true })
  lengthTimeValue?: number;

  @ApiProperty({ description: 'minutes, hours, seconds etc' })
  @Column({ length: 80, nullable: true })
  lengthTimeUnit?: string;

  @ManyToMany(() => Ingredient)
  @JoinTable()
  ingredients: Ingredient[];

  @OneToMany(() => EquipmentSteppedInstruction, (steppedEquip) => steppedEquip.recipeSteppedInstruction, { cascade: true })
  equipment: EquipmentSteppedInstruction[];

  @ManyToOne(() => Recipe, (recipe) => recipe.steppedInstructions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column({ name: 'recipeId' })
  recipeId: number;
}
