import { useAppDispatch, useAppSelector } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { IUserToken } from '@domain/user.dto';
import { useGetWeeklyOrdersQuery } from '@features/api/apiSlice';
import { Space, Title } from '@mantine/core';
import { DatePickerInput, DateValue } from '@mantine/dates';
import { setScheduleFilter } from '@pages/schedules/scheduleFilter.slice';
import { getDateFromIndex, getDateIndex } from '@utils/dateUtils';
import { fractionNumber } from '@utils/numberUtils';
import { sentenceCase } from '@utils/stringUtils';
import parse from 'html-react-parser';
import { Calendar } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './orders.scss';

export const Orders = () => {
  const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;
  const scheduleFilter = useAppSelector((store: RootState) => store.scheduleFilter);
  const { data: weeklyOrders, isLoading } = useGetWeeklyOrdersQuery(scheduleFilter.dateFrom, { skip: !scheduleFilter });

  const dispatch = useAppDispatch();

  const setDateFromValue = (value: DateValue) => {
    if (value) {
      dispatch(setScheduleFilter({ dateFrom: getDateIndex(value) }));
    }
  };
  return isLoading ? (
    <div>Loading...</div>
  ) : (
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
      <section>
        <h2>Weekly shopping list</h2>
        {weeklyOrders?.ingredients && (
          <ul className="square-box">
            {weeklyOrders.ingredients.map((iL) => (
              <li key={iL.id}>
                {parse(fractionNumber(iL.amount))} <b>{iL.unit}</b> {sentenceCase(iL.ingredient?.name)}
              </li>
            ))}{' '}
          </ul>
        )}
      </section>
      <Space h="xl" />
      <section>
        <h2>Recipes for this week</h2>
        {weeklyOrders?.recipes &&
          weeklyOrders.recipes.map((rL) => (
            <div key={rL.id}>
              {parse(fractionNumber(rL.quantity))}{' '}
              <NavLink to={`/${CRoutes.recipe}/${rL.recipeId}`} aria-label={rL.recipeName}>
                {sentenceCase(rL.recipeName)}
              </NavLink>
            </div>
          ))}
      </section>
      <Space h="xl" />
    </section>
  );
};
