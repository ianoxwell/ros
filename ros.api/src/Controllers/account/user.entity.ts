import { ApiProperty } from '@nestjs/swagger';
import { RosBaseEntity } from 'src/base/base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, Unique } from 'typeorm';
import { Recipe } from '../recipe/recipe.entity';

@Entity()
@Unique(['email'])
export class User extends RosBaseEntity {
  /** User Details */

  @Column({ length: 120 })
  familyName: string;

  @Column({ length: 120 })
  givenNames: string;

  @Column({ length: 120 })
  email!: string;

  @Column({ length: 80, nullable: true })
  phoneNumber?: string;

  @Column({ type: 'simple-array' })
  photoUrl: string[];

  @Column({ type: 'bool', default: false })
  isActive: boolean;

  @Column({ type: 'bool', default: false })
  isAdmin: boolean;

  /** Login details */
  @Column({ length: 200, nullable: true })
  passwordHash?: string;

  @Column({ length: 200 })
  loginProvider: string;

  @Column({ length: 200, nullable: true })
  loginProviderId?: string;

  @Column({ type: 'int', default: 0 })
  failedLoginAttempt?: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastFailedLoginAttempt?: Date;

  @Column({ type: 'int', default: 0 })
  timesLoggedIn: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  firstLogin?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastLogin?: Date;

  /** Token content */

  @Column({ length: 200, nullable: true })
  verificationToken?: string;

  @Column({ length: 200, nullable: true })
  resetToken?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  resetTokenExpires?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  passwordLastReset?: Date;

  @ApiProperty({
    description: 'Has date implies that the user has been verified.'
  })
  @Column({ type: 'timestamp with time zone', nullable: true })
  verified?: Date;

  @Column({ type: 'simple-array', nullable: true })
  refreshTokens?: string[];

  @OneToMany(() => Recipe, (recipe) => recipe.createdBy)
  createdRecipes: Recipe[];

  @OneToMany(() => Recipe, (recipe) => recipe.editedBy)
  editedRecipes: Recipe[];

  @ManyToMany(() => Recipe, (recipe) => recipe.favoriteBy)
  @JoinTable()
  favoriteRecipes: Recipe[];
}
