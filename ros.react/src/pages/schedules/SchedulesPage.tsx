import { useAppDispatch, useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import { setCurrentSchedule } from '@components/GlobalNavigation/globalModal.slice';
import { ETimeSlot, ISchedule } from '@domain/schedule.dto';
import { IUserToken } from '@domain/user.dto';
import { useGetMyScheduledRecipesQuery, useGetRandomWeekRecipesMutation } from '@features/api/apiSlice';
import { ActionIcon, Button, ComboboxItem, Flex, SimpleGrid, Space, Title } from '@mantine/core';
import { DatePickerInput, DateValue } from '@mantine/dates';
import { randomId } from '@mantine/hooks';
import { getDateFromIndex, getDateIndex } from '@utils/dateUtils';
import dayjs from 'dayjs';
import { Calendar, Edit, Plus } from 'lucide-react';
import { pickATime } from './schedule.const';
import { setScheduleFilter } from './scheduleFilter.slice';
import ScheduleRecipe from './ScheduleRecipe';
import './schedules.scss';

export const SchedulesPage = () => {
  const scheduleFilter = useAppSelector((store: RootState) => store.scheduleFilter);
  const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;
  const { data: weeklySchedule, isLoading } = useGetMyScheduledRecipesQuery(scheduleFilter, { skip: !scheduleFilter });
  const [createRandomWeek, { isLoading: isRandomLoading }] = useGetRandomWeekRecipesMutation();
  const dispatch = useAppDispatch();

  const newItem = (slot: ComboboxItem, dateIndex: string) => {
    dispatch(
      setCurrentSchedule({ date: dateIndex, timeSlot: slot.value as ETimeSlot, scheduleRecipes: [], notes: '' })
    );
  };

  const setDateFromValue = (value: DateValue) => {
    if (value) {
      dispatch(setScheduleFilter({ dateFrom: getDateIndex(value) }));
    }
  };

  const editItem = (item: ISchedule) => {
    dispatch(setCurrentSchedule({ ...item, date: getDateIndex(item.date) }));
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <section>
      <div className="title-bar">
        <div className="text-muted">Hello {user.givenNames}</div>
        <Title className="title-bar--title">What meals would you like to eat this week?</Title>
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
        <Button type="button" onClick={() => createRandomWeek(scheduleFilter.dateFrom)} loading={isRandomLoading}>
          Create Random Meal Plan
        </Button>
      </Flex>

      <Space h="lg" />
      <section className="schedule-grid">
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5, xl: 7 }} spacing="0" verticalSpacing="md">
          {weeklySchedule &&
            Object.entries(weeklySchedule).map(([key, value], index: number) => {
              const date = dayjs(getDateFromIndex(key));
              return (
                <article className={`schedule-item ${index % 2 === 0 ? 'odd' : ''}`} key={`${key}-${index}`}>
                  <div className="schedule-item--day">{date.format('dddd')}</div>
                  <div className="schedule-item--date">{date.format('MMMM D, YYYY')}</div>
                  {pickATime.map((slot) => {
                    const slotItems = value.filter((schedule) => schedule.timeSlot === slot.value);
                    return (
                      <section key={randomId()}>
                        <div className="schedule-item--slot">
                          <span>{slot.label}</span>
                          {slotItems.length ? (
                            <ActionIcon
                              title={`Edit ${slot.label} items`}
                              variant="outline"
                              onClick={() => editItem(slotItems[0])}
                            >
                              <Edit size={16} />
                            </ActionIcon>
                          ) : (
                            <button type="button" onClick={() => newItem(slot, key)} title="New" className="nav-fab">
                              <Plus />
                            </button>
                          )}
                        </div>
                        {slotItems.map((item: ISchedule) => (
                          <ScheduleRecipe
                            scheduleRecipes={item.scheduleRecipes}
                            slotItem={item}
                            key={item.id || randomId()}
                          />
                        ))}
                      </section>
                    );
                  })}
                </article>
              );
            })}
        </SimpleGrid>
      </section>
    </section>
  );
};
