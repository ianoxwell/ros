import { useAppDispatch, useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import { IUserToken } from '@domain/user.dto';
import { Space, Title } from '@mantine/core';
import { DatePickerInput, DateValue } from '@mantine/dates';
import { setScheduleFilter } from '@pages/schedules/scheduleFilter.slice';
import { getDateFromIndex, getDateIndex } from '@utils/dateUtils';
import { Calendar } from 'lucide-react';

export const Orders = () => {
  const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;
  const scheduleFilter = useAppSelector((store: RootState) => store.scheduleFilter);
  const dispatch = useAppDispatch();

  const setDateFromValue = (value: DateValue) => {
    if (value) {
      dispatch(setScheduleFilter({ dateFrom: getDateIndex(value) }));
    }
  };
  return (
    <section className="orders">
      <div className="title-bar">
        <div className="text-muted">Hello {user.givenNames}</div>
        <Title className="title-bar--title">Shopping order for this week</Title>
      </div>
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
      <Space h="xl" />
      <section>Under construction</section>
    </section>
  );
};
