import { useAppDispatch, useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import { IUserToken } from '@domain/user.dto';
import { useGetMyScheduledRecipesQuery, useGetRandomWeekRecipesMutation } from '@features/api/apiSlice';
import { Button, Flex, SimpleGrid, Space, Text, Title } from '@mantine/core';
import { DatePickerInput, DateValue } from '@mantine/dates';
import { modals } from '@mantine/modals';
import { getDateFromIndex, getDateIndex } from '@utils/dateUtils';
import { Calendar } from 'lucide-react';
import ScheduleCard from './ScheduleCard';
import { setScheduleFilter } from './scheduleFilter.slice';
import './schedules.scss';

export const SchedulesPage = () => {
  const scheduleFilter = useAppSelector((store: RootState) => store.scheduleFilter);
  const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;
  const { data: weeklySchedule, isLoading } = useGetMyScheduledRecipesQuery(scheduleFilter, { skip: !scheduleFilter });
  const [createRandomWeek, { isLoading: isRandomLoading }] = useGetRandomWeekRecipesMutation();
  const dispatch = useAppDispatch();

  const confirmCreateRandomMealPlan = () => {
    modals.openConfirmModal({
      title: 'Create a random meal plan',
      children: (
        <Text size="sm">
          The longer term plan is to use some AI in the background to fuzzy search for breakfast, lunch and dinner{' '}
          appropriate meals with appropriate tags and to give guidance as preference type - e.g. keto, vegetarian,{' '}
          <p>
            number servings etc. At this point of time this is purely randomly assigning one meal per slot with an 80%
            chance of filling an empty spot.
          </p>
          <p>Press confirm to populate the current week.</p>
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      closeButtonProps: { 'aria-label': 'Close' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => createRandomWeek(scheduleFilter.dateFrom)
    });
  };

  const setDateFromValue = (value: DateValue) => {
    if (value) {
      dispatch(setScheduleFilter({ dateFrom: getDateIndex(value) }));
    }
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <section className="schedule">
      <div className="title-bar">
        <div className="text-muted">Hello {user.givenNames}</div>
        <Title className="title-bar--title">What meals would you like to plan this week?</Title>
      </div>
      <Flex
        gap="md"
        align={{ base: 'flex-start', sm: 'flex-end' }}
        justify="space-between"
        direction={{ base: 'column', sm: 'row' }}
      >
        <DatePickerInput
          label="When does your week start?"
          placeholder="When does your week start?"
          leftSection={<Calendar size={18} />}
          leftSectionPointerEvents="none"
          value={getDateFromIndex(scheduleFilter.dateFrom)}
          minDate={new Date()}
          clearable={false}
          onChange={setDateFromValue}
          className="schedule--date-picker"
        />
        <Button type="button" onClick={confirmCreateRandomMealPlan} loading={isRandomLoading}>
          Create Random Meal Plan
        </Button>
      </Flex>

      <Space h="lg" />
      <section className="schedule-grid">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 7 }} spacing="md" verticalSpacing="md">
          {weeklySchedule &&
            Object.entries(weeklySchedule).map(([key, value], index: number) => {
              return <ScheduleCard key={`${key}-${index}`} schedules={value} dateStr={key} />;
            })}
        </SimpleGrid>
      </section>
    </section>
  );
};
