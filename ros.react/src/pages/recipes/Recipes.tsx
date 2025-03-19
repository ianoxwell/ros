import { useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import Loader from '@components/Loader/Loader.component';
import RosPagination from '@components/RosPagination/RosPagination.component';
import { IRecipeShort } from '@domain/recipe.dto';
import { IUserToken } from '@domain/user.dto';
import { useGetRecipesMutation } from '@features/api/apiSlice';
import { Button, Flex, Modal, SimpleGrid, Text, Title, Transition } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { SlidersVerticalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import RecipeCard from './RecipeCard';
import RecipeFilter from './RecipeFilter';
import RecipeModal from './RecipeModal';
import './recipe.scss';

export const Recipes = () => {
  const recipeFilter = useSelector((store: RootState) => store.recipeFilter);
  const [getRecipes, { data, isLoading }] = useGetRecipesMutation();
  const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;
  const [filterOpen, { toggle }] = useDisclosure(false);
  const [recipeOpened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery(`(max-width: 1599px)`);
  const [viewRecipe, setViewRecipe] = useState<IRecipeShort | undefined>(undefined);

  useEffect(() => {
    try {
      console.log('got recipe filter', recipeFilter);
      getRecipes(recipeFilter);
    } catch (error) {
      console.log('made a boo boo', error);
    }
  }, [recipeFilter, getRecipes]);

  const openModal = (recipeShort: IRecipeShort) => {
    console.log('open the modal now', recipeShort);
    setViewRecipe(recipeShort);
    open();
  };



  return (
    <>
      <Modal
        opened={recipeOpened}
        onClose={close}
        transitionProps={{ transition: 'slide-left' }}
        fullScreen
        radius={0}
        withCloseButton={false}
        padding={0}
        aria-label={viewRecipe?.name || 'Recipe'}
      >
        {/* Modal content */}
        {viewRecipe && <RecipeModal recipeShort={viewRecipe} closeModal={close} />}
      </Modal>

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
                  return <RecipeCard key={recipe.id} recipe={recipe} openModal={openModal} />;
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
