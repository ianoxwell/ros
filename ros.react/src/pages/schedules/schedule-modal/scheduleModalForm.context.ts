import { ISchedule } from '@domain/schedule.dto';
import { createFormContext } from '@mantine/form';

export const [ScheduleFormProvider, useScheduleFormContext, useScheduleForm] = createFormContext<ISchedule>();
