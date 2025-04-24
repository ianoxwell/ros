import { ISchedule, IScheduleRecipe } from '@domain/schedule.dto';
import { createFormContext } from '@mantine/form';

export const [ScheduleFormProvider, useScheduleFormContext, useScheduleForm] = createFormContext<ISchedule>();
export const CBlankScheduleRecipe: IScheduleRecipe = { recipeId: '', quantity: 1, id: 0 };
