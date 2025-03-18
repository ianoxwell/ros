import { useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import { IUserToken } from '@domain/user.dto';
import { useGetRecipesMutation } from '@features/api/apiSlice';
import { SimpleGrid, Text, Title } from '@mantine/core';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import RecipeCard from './RecipeCard';
import RecipeFilter from './RecipeFilter';
import './recipe.scss';
import Loader from '@components/Loader/Loader.component';

export const Recipes = () => {
  const recipeFilter = useSelector((store: RootState) => store.recipeFilter);
  const [getRecipes, { data, isLoading }] = useGetRecipesMutation();
  const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;

  useEffect(() => {
    try {
      console.log('got recipe filter', recipeFilter);
      getRecipes(recipeFilter);
    } catch (error) {
      console.log('made a boo boo', error);
    }
  }, [recipeFilter, getRecipes]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className='title-bar'>
            <div className="text-muted">Hello {user.givenNames}</div>
            <Title>What would you like to cook today?</Title>
          </div>

          <div className="recipes-wrapper">
            <RecipeFilter meta={data?.meta} />
            <section className="recipes">
              <SimpleGrid
                cols={{ base: 2, md: 3, lg: 4, xl: 5 }}
                spacing={{ base: 10, sm: 'md' }}
                verticalSpacing={{ base: 'md', sm: 'md' }}
              >
                {data?.results.map((recipe) => {
                  return <RecipeCard key={recipe.id} recipe={recipe} />;
                })}
              </SimpleGrid>
              <div>Pagination here</div>
            </section>
          </div>
        </>
      )}
    </>
  );
};
