export enum ETimeSlot {
  BREAKFAST = 'breakfast',
  MORNING_SNACK = 'morning_snack',
  LUNCH = 'lunch',
  AFTERNOON_SNACK = 'afternoon_snack',
  DINNER = 'dinner',
  EVENING_SNACK = 'evening_snack'
}

/** Wraps the individual schedules in a weekly object e.g. '20251017': [{id: 4, timeSlot: 'breakfast'...}] */
export interface IWeeklySchedule {
  [dateIndex: string]: ISchedule[] 
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

  recipeName?: string;
  shortSummary?: string;
  recipeImage?: string;
  servings?: number;
}
