import { ApiProperty } from '@nestjs/swagger';
import { RosBaseEntity } from 'src/base/base.entity';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, Unique } from 'typeorm';
import { User } from '../account/user.entity';
import { Ingredient } from '../ingredient/ingredient.entity';
import { CuisineType } from './cuisine-type/cuisine-type.entity';
import { DishType } from './dish-type/dish-type.entity';
import { Equipment } from './equipment/equipment.entity';
import { HealthLabel } from './health-label/health-label.entity';
import { RecipeIngredient } from './recipe-ingredient/recipe-ingredient.entity';
import { RecipeSteppedInstruction } from './recipe-stepped-instructions/recipe-stepped-instructions.entity';

@Entity()
@Unique(['name'])
export class Recipe extends RosBaseEntity {
  @Index()
  @Column({ length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ nullable: true, length: 240 })
  shortSummary: string;

  @Column({ type: 'money', nullable: true })
  pricePerServing: number;

  @Column({ type: 'simple-array' })
  images: string[];

  /** Meta information */
  @Column({ type: 'integer', default: -1 })
  preparationMinutes: number;
  @Column({ type: 'integer', default: -1 })
  cookingMinutes: number;
  @Column({ type: 'integer', default: 0 })
  aggregateLikes: number;
  @Column({ type: 'integer', nullable: true })
  healthScore: number;
  @Column({ type: 'integer', default: 0 })
  readyInMinutes: number;
  @Column({ type: 'integer', default: 0 })
  servings: number;

  /** Source information */
  @Column({ type: 'integer', nullable: true })
  spoonId: number;
  @Column({ length: 120 })
  sourceUrl: string;
  @ApiProperty({ example: 'Foodista.com – The Cooking Encyclopedia Everyone Can Edit' })
  @Column({ length: 120 })
  creditsText: string;
  @ApiProperty({ example: 'CC BY 3.0' })
  @Column({ length: 120, nullable: true })
  license?: string;
  @Column({ length: 120, nullable: true })
  sourceName?: string;
  @Column({ length: 120, nullable: true })
  spoonacularSourceUrl?: string;

  /** Health boolean labels */
  @Column({ type: 'boolean', default: false })
  vegetarian: boolean;
  @Column({ type: 'boolean', default: false })
  vegan: boolean;
  @Column({ type: 'boolean', default: false })
  glutenFree: boolean;
  @Column({ type: 'boolean', default: false })
  dairyFree: boolean;
  @Column({ type: 'boolean', default: false })
  veryHealthy: boolean;
  @Column({ type: 'boolean', default: false })
  cheap: boolean;
  @Column({ type: 'boolean', default: false })
  veryPopular: boolean;
  @Column({ type: 'boolean', default: false })
  sustainable: boolean;
  @Column({ type: 'boolean', default: false })
  lowFodmap: boolean;
  @Column({ type: 'integer', default: 0 })
  weightWatcherSmartPoints: number;
  @Column({ length: 20 })
  gaps: string;

  /** Relationship tables */
  @ManyToMany(() => Ingredient, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable()
  ingredients: Ingredient[];

  @ManyToMany(() => CuisineType)
  @JoinTable()
  cuisineType: CuisineType[];

  @ManyToMany(() => DishType)
  @JoinTable()
  dishType: DishType[];

  @ManyToMany(() => Equipment, { cascade: true })
  @JoinTable()
  equipment: Equipment[];

  @ManyToMany(() => HealthLabel)
  @JoinTable()
  diets: HealthLabel[];

  // contains ingredient reference, quantity meta etc.
  @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe, { cascade: true })
  ingredientList: RecipeIngredient[];

  @OneToMany(() => RecipeSteppedInstruction, (steppedInstruction) => steppedInstruction.recipe, { cascade: true })
  steppedInstructions: RecipeSteppedInstruction[];

  @ManyToOne(() => User, (user) => user.createdRecipes)
  createdBy?: User;

  @ManyToOne(() => User, (user) => user.editedRecipes)
  editedBy?: User;

  @ManyToMany(() => User, (user) => user.favoriteRecipes)
  @JoinTable()
  favoriteBy?: User[];
}
