import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from './schedule.entity';
import { Recipe } from '../recipe/recipe.entity';

@Entity()
export class ScheduleRecipe {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.scheduleRecipes, { onDelete: 'CASCADE' })
  schedule: Schedule;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  recipe: Recipe;

  @Column({ type: 'integer' })
  quantity: number;
}
