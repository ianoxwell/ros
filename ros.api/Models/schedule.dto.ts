import { IRecipeShort, IRecipeTease } from './recipe.dto';

export enum TTimeSlot {
  BREAKFAST = 'breakfast',
  MORNING_SNACK = 'morning_snack',
  LUNCH = 'lunch',
  AFTERNOON_SNACK = 'afternoon_snack',
  DINNER = 'dinner',
  EVENING_SNACK = 'evening_snack'
}

export interface ISchedule {
  id?: number;
  date: Date;
  timeSlot: TTimeSlot;
  scheduleRecipes: IScheduleRecipe[];
  userId: number;
  notes: string;
}

export interface IScheduleRecipe {
  id?: number;
  recipe: IRecipeTease;
  quantity: number;
}
