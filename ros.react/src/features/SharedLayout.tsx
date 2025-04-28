import { useAppDispatch, useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import Loader from '@components/Loader/Loader.component';
import { useMatches } from '@mantine/core';
import { setRecipeTakeSize } from '@pages/recipes/recipeFilter.slice';
import ScheduleModal from '@pages/schedules/schedule-modal/ScheduleModal';
import { getDateFromIndex } from '@utils/dateUtils';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { GlobalNavigation } from '../components/global-navigation/GlobalNavigation.component';
import { useGetReferencesQuery } from './api/apiSlice';

const SharedLayout = () => {
  // Load all references prematurely so they are immediately available to all other components
  const { isLoading } = useGetReferencesQuery();
  const globalModal = useAppSelector((store: RootState) => store.globalModal);
  const dispatch = useAppDispatch();
  const takeRecipes = useMatches({
    base: 8,
    md: 9,
    lg: 12,
    xl: 15
  });

  useEffect(() => {
    dispatch(setRecipeTakeSize(takeRecipes));
  }, [takeRecipes, dispatch]);

  return (
    <main>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {globalModal.modalOpen && (
            <ScheduleModal
              isOpen={globalModal.modalOpen === 'schedule' && !!globalModal.schedule}
              schedule={
                globalModal.schedule
                  ? { ...globalModal.schedule, date: getDateFromIndex(globalModal.schedule.date) }
                  : undefined
              }
            />
          )}
          <GlobalNavigation />
          <section className="main-content">
            <Outlet />
          </section>
        </>
      )}
    </main>
  );
};

export default SharedLayout;
