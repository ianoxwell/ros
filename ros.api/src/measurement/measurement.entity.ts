import { RosBaseEntity } from 'src/base/base.entity';
import { Conversion } from 'src/ingredient/conversion/conversion.entity';
import { EPurchasedBy } from 'src/ingredient/ingredient.dto';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { RecipeIngredient } from 'src/recipe/recipe-ingredient/recipe-ingredient.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, Unique } from 'typeorm';
import { ECountryCode, IMeasurement } from './measurement.dto';

@Entity()
@Unique(['title'])
export class Measurement extends RosBaseEntity implements IMeasurement {
  @Column({ length: 80 })
  title!: string;

  @Column({
    type: 'enum',
    enum: EPurchasedBy
  })
  measurementType: EPurchasedBy;

  @Column({ length: 80 })
  shortName: string;

  @Column({ length: 80, nullable: true })
  altShortName?: string;

  @ManyToOne(() => Measurement, (measurement) => measurement.id)
  convertsToId: number;

  @Column('decimal', { precision: 7, scale: 3 })
  quantity: number;

  @Column({
    type: 'enum',
    enum: ECountryCode,
    default: ECountryCode.AU
  })
  countryCode: ECountryCode;

  /** External Relationships */
  @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.measure)
  recipeIngredients?: RecipeIngredient[];

  @OneToMany(() => Conversion, (conversion) => conversion.sourceUnit)
  conversionSourceUnits?: Conversion[];

  @OneToMany(() => Conversion, (conversion) => conversion.targetUnit)
  conversionTargetUnits?: Conversion[];

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.possibleUnits)
  ingredientPossibleUnits?: Ingredient[];
}
