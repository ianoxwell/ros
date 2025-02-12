import { RosBaseEntity } from 'src/base/base.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { Measurement } from 'src/measurement/measurement.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Recipe } from '../recipe.enitity';

@Entity()
export class RecipeIngredient extends RosBaseEntity {
  @Column('decimal', { precision: 8, scale: 3, nullable: false })
  amount: number;

  @Column({ length: 120 })
  consistency: string;

  @Column({ type: 'simple-array', nullable: true })
  meta?: string[];

  @ManyToOne(() => Measurement, (measure) => measure.recipeIngredients)
  @JoinColumn({ name: 'measureId' })
  measure: Measurement;
  @Column({ name: 'measureId' })
  measureId: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredientList, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column({ name: 'recipeId' })
  recipeId: number;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredientList, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;

  @Column({ name: 'ingredientId' })
  ingredientId: number;
}
