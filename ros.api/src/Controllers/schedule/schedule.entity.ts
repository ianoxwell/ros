import { TTimeSlot } from '@models/schedule.dto';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../account/user.entity';
import { ScheduleRecipe } from './schedule-recipe.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: TTimeSlot })
  timeSlot: TTimeSlot;

  @OneToMany(() => ScheduleRecipe, (scheduleRecipe) => scheduleRecipe.schedule, { cascade: true })
  scheduleRecipes: ScheduleRecipe[];

  @ManyToOne(() => User, (user) => user.schedules, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
