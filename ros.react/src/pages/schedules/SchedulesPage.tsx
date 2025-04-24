import { useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import { ETimeSlot, ISchedule } from '@domain/schedule.dto';
import { IUserToken } from '@domain/user.dto';
import { useGetMyScheduledRecipesQuery } from '@features/api/apiSlice';
import { ActionIcon, ComboboxItem, SimpleGrid, Title } from '@mantine/core';
import { randomId, useDisclosure } from '@mantine/hooks';
import { getDateFromIndex } from '@utils/dateUtils';
import dayjs from 'dayjs';
import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { pickATime } from './schedule.const';
import ScheduleModal from './schedule-modal/ScheduleModal';
import ScheduleRecipe from './ScheduleRecipe';
import './schedules.scss';

export const SchedulesPage = () => {
  const scheduleFilter = useSelector((store: RootState) => store.scheduleFilter);
  const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;
  const [opened, { open, close }] = useDisclosure(false);
  const [schedule, setSchedule] = useState<ISchedule | undefined>();
  // const [value, setValue] = useState<[string, string]>([scheduleFilter.dateFrom, scheduleFilter.dateTo]);
  const { data: weeklySchedule, isLoading } = useGetMyScheduledRecipesQuery(scheduleFilter, { skip: !scheduleFilter });

  const newItem = (slot: ComboboxItem, dateIndex: string) => {
    const newSchedule: ISchedule = {
      date: getDateFromIndex(dateIndex),
      timeSlot: slot.value as ETimeSlot,
      scheduleRecipes: [],
      notes: ''
    };
    console.log('open a new modal to create a new recipe', slot, dateIndex, newSchedule);
    setSchedule(newSchedule);
    open();
  };

  const editItem = (item: ISchedule) => {
    setSchedule(item);
    open();
  };

  const closeModal = () => {
    setSchedule(undefined);
    close();
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <section>
      <div className="title-bar">
        <div className="text-muted">Hello {user.givenNames}</div>
        <Title className="title-bar--title">What meals would you like to eat this week?</Title>
      </div>
      {schedule && <ScheduleModal onClose={closeModal} isOpen={opened} schedule={schedule} />}
      {/* <DatePickerInput
        type="range"
        label="Pick dates range"
        placeholder="Pick dates range"
        value={value}
        onChange={setValue}
      /> */}
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
                              title="Edit item in this slot"
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
