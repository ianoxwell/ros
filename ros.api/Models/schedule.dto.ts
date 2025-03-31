import { IRecipeShort, IRecipeTease } from './recipe.dto';

export enum ETimeSlot {
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
  timeSlot: ETimeSlot;
  scheduleRecipes: IScheduleRecipe[];
  notes?: string;
}

export interface IScheduleRecipe {
  id?: number;
  recipeId: number | string;
  quantity: number;

  name?: string;
  shortSummary?: string;
  images?: string[];
}
