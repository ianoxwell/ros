import { useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import SortAndFilterButton from '@components/SortAndFilterButton/SortAndFilterButton.component';
import { IRecipeShort } from '@domain/recipe.dto';
import { IUserToken } from '@domain/user.dto';
import { useGetRecipesMutation } from '@features/api/apiSlice';
import { ActionIcon, AppShell, Collapse, Flex, Group, Modal, Space, Text, Title } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ChevronLeft, SlidersVerticalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './recipe.scss';
import RecipeFilter from './RecipeFilter';
import RecipeGrid from './RecipeGrid';
import RecipeModal from './RecipeModal';

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

      <SortAndFilterButton meta={data?.meta} toggle={toggle} page="recipes" />
      <div className="recipes-wrapper">
        {(() => {
          if (!data) {
            return;
          }

          if (!isMobile) {
            return (
              <>
                <AppShell navbar={{ width: 320, breakpoint: 'lg', collapsed: { desktop: !filterOpen } }}>
                  <AppShell.Navbar p="md">
                    <Flex align="center" justify="space-between">
                      <Group gap="sm">
                        <SlidersVerticalIcon size={20} />
                        <Text tt="uppercase" fw={500}>
                          Sort and Filter
                        </Text>
                      </Group>
                      <ActionIcon size="lg" variant="outline" color="dark.6" type="button" onClick={toggle} radius="xl">
                        <ChevronLeft size={24} />
                      </ActionIcon>
                    </Flex>
                    <Space h="xl" />
                    <RecipeFilter />
                  </AppShell.Navbar>
                  <AppShell.Main>
                    <RecipeGrid data={data} isLoading={isLoading} openModal={openModal} />
                  </AppShell.Main>
                </AppShell>
              </>
            );
          }

          return (
            <>
              <Collapse in={filterOpen}>
                <RecipeFilter />
              </Collapse>
              <RecipeGrid data={data} isLoading={isLoading} openModal={openModal} />
            </>
          );
        })()}
      </div>
    </>
  );
};
