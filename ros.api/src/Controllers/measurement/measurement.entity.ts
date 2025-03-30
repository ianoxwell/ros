import { RosBaseEntity } from '@base/base.entity';
import { Conversion } from '@controllers/ingredient/conversion/conversion.entity';
import { Ingredient } from '@controllers/ingredient/ingredient.entity';
import { RecipeIngredient } from '@controllers/recipe/recipe-ingredient/recipe-ingredient.entity';
import { EPurchasedBy } from '@models/ingredient.dto';
import { ECountryCode, IMeasurement } from '@models/measurement.dto';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, Unique } from 'typeorm';

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
