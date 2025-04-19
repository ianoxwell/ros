import { ETimeSlot } from '@domain/schedule.dto';
import { ComboboxItem } from '@mantine/core';

export const pickATime: ComboboxItem[] = [
  { value: ETimeSlot.BREAKFAST, label: 'Breakfast' },
  // { value: ETimeSlot.MORNING_SNACK, label: 'Morning snack' },
  { value: ETimeSlot.LUNCH, label: 'Lunch' },
  // { value: ETimeSlot.AFTERNOON_SNACK, label: 'Afternoon snack' },
  { value: ETimeSlot.DINNER, label: 'Dinner' }
  // { value: ETimeSlot.EVENING_SNACK, label: 'Evening snack' }
];
