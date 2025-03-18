import { useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import Loader from '@components/Loader/Loader.component';
import RosPagination from '@components/RosPagination/RosPagination.component';
import { IUserToken } from '@domain/user.dto';
import { useGetRecipesMutation } from '@features/api/apiSlice';
import { Button, Flex, SimpleGrid, Text, Title, Transition } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { SlidersVerticalIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import RecipeCard from './RecipeCard';
import RecipeFilter from './RecipeFilter';
import './recipe.scss';

export const Recipes = () => {
  const recipeFilter = useSelector((store: RootState) => store.recipeFilter);
  const [getRecipes, { data, isLoading }] = useGetRecipesMutation();
  const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;
  const [filterOpen, { toggle }] = useDisclosure(false);
  const isMobile = useMediaQuery(`(max-width: 1599px)`);

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
      <div className="title-bar">
        <div className="text-muted">Hello {user.givenNames}</div>
        <Title className="title-bar--title">What would you like to cook today?</Title>
      </div>

      <Button
        variant="transparent"
        justify="space-between"
        rightSection={<div>{data?.meta.itemCount} recipes</div>}
        fullWidth
        className="filter--button"
        type="button"
        onClick={toggle}
      >
        <Flex align="center" gap="sm">
          <SlidersVerticalIcon size={20} />
          <Text tt="uppercase" fw={500}>
            Sort and Filter
          </Text>
        </Flex>
      </Button>
      <div className="recipes-wrapper">
        {/* className={filterOpen ? 'filter-content filter-content--open' : 'filter-content filter-content--closed'} */}
        <Transition mounted={filterOpen} transition={isMobile ? 'slide-down' : 'slide-right'} duration={400}>
          {(styles) => <RecipeFilter styles={styles} />}
        </Transition>
        <section className="recipes">
          {isLoading || !data ? (
            <Loader />
          ) : (
            <>
              <SimpleGrid cols={{ base: 2, md: 3, lg: 4, xl: 5 }} spacing="md" verticalSpacing="md">
                {data.results.map((recipe) => {
                  return <RecipeCard key={recipe.id} recipe={recipe} />;
                })}
              </SimpleGrid>
            </>
          )}
          {data && <RosPagination meta={data.meta} />}
        </section>
      </div>
    </>
  );
};
