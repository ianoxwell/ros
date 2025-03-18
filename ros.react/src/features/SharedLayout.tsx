import { useAppDispatch } from '@app/hooks';
import Loader from '@components/Loader/Loader.component';
import { useMatches } from '@mantine/core';
import { setRecipeTakeSize } from '@pages/recipes/recipeFilter.slice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { GlobalNavigation } from '../components/global-navigation/GlobalNavigation.component';
import { useGetReferencesQuery } from './api/apiSlice';

const SharedLayout = () => {
  // Load all references prematurely so they are immediately available to all other components
  const { isLoading } = useGetReferencesQuery();
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
