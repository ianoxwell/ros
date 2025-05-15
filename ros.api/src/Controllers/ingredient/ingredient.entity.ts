import { RosBaseEntity } from '@base/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, Unique } from 'typeorm';
import { EPurchasedBy, IIngredientRecipeVeryShort } from '../../../Models/ingredient.dto';
import { Measurement } from '../measurement/measurement.entity';
import { RecipeIngredient } from '../recipe/recipe-ingredient/recipe-ingredient.entity';
import { Reference } from '../reference/reference.entity';
import { Conversion } from './conversion/conversion.entity';

@Entity()
@Unique(['name'])
export class Ingredient extends RosBaseEntity {
  @ApiProperty({
    description: `Ingredient name should be unique`,
    example: 'Wheat flour - white'
  })
  @Index()
  @Column({ length: 200, unique: true })
  name!: string;

  @Column({ length: 200, nullable: true })
  originalName: string;

  @Column({ length: 200, nullable: true })
  image?: string;

  @ApiProperty({
    description: `Equipment has a spoonacular reference`,
    example: 23
  })
  @Column({ nullable: true })
  externalId?: number;

  @ApiProperty({
    description: `Probably not a lot of use - think of it as a tag list? https://spoonacular.com/food-api/docs#List-of-Ingredients`,
    example: 'Nut butters, Jams, and Honey'
  })
  @Column({ length: 100, nullable: true })
  aisle?: string;

  @ApiProperty({
    description: `Most things are purchased by weight (grams), or volume (mls), dictates what the default measurement is in the shopping list. Built from field Ingredient consistency`,
    example: 'EPurchasedBy.weight'
  })
  @Column({
    type: 'enum',
    enum: EPurchasedBy,
    default: EPurchasedBy.weight
  })
  purchasedBy: EPurchasedBy;
  @ApiProperty({
    description: `Preferred Shopping Unit - user-defined preferred unit for this ingredient`,
    example: 'gram'
  })
  @ManyToOne(() => Measurement, (measurement) => measurement.ingredientsWithPreferredUnit, { nullable: true })
  preferredShoppingUnit?: Measurement;

  @Column({ type: 'money', nullable: true })
  estimatedCost?: number;

  @Column({ nullable: true })
  estimatedCostUnit?: string;

  /** Relationships */
  @ApiProperty({
    description: `Possible Units - assists the conversions`,
    example: '["teaspoon", "cup", "serving", "tablespoon"]'
  })
  @ManyToMany(() => Measurement)
  @JoinTable()
  possibleUnits: Measurement[];

  @ManyToMany(() => Reference)
  @JoinTable()
  allergies: Reference[];

  @OneToMany(() => Conversion, (conversion) => conversion.ingredient, { cascade: true })
  conversions?: Conversion[];

  @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.ingredient, { cascade: true })
  recipeIngredientList: RecipeIngredient[];

  /** Nutrient breakdown - note nutrition is always 100 of base units (e.g. 100 grams, or 100 mls)*/
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  calories?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  fat?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  transFat?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  saturatedFat?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  monoUnsaturatedFat?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  polyUnsaturatedFat?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  protein?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  cholesterol?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  carbohydrates?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  netCarbohydrates?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  alcohol?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  fiber?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  sugar?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  sodium?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  caffeine?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  manganese?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  potassium?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  magnesium?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  calcium?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  copper?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  zinc?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  phosphorus?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  fluoride?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  choline?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  iron?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  vitaminA?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  vitaminB1?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  vitaminB2?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  vitaminB3?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  vitaminB5?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  vitaminB6?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  vitaminB12?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  vitaminC?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  vitaminD?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  vitaminE?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  vitaminK?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  folate?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  folicAcid?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  iodine?: number;
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  selenium?: number;

  /** Nutrition properties */
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  glycemicIndex?: number;

  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  glycemicLoad?: number;

  @Column('decimal', { precision: 20, scale: 15, nullable: true })
  nutritionScore?: number;

  /** Caloric Breakdown */
  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  percentProtein: number;

  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  percentFat: number;

  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  percentCarbs: number;

  @Column('boolean', { default: true })
  isActive: boolean;
}

export interface IIngredientEntityExtended extends Ingredient {
  recipes?: IIngredientRecipeVeryShort[];
}
