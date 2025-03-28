import { useAppDispatch } from '@app/hooks';
import Loader from '@components/Loader/Loader.component';
import { IPagedResult } from '@domain/base.dto';
import { IRecipeShort } from '@domain/recipe.dto';
import { Group, Pagination, SimpleGrid, Space } from '@mantine/core';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import RecipeCard from './RecipeCard';
import { setRecipePageNumber } from './recipeFilter.slice';

// TODO also change to Skeleton for the Loader please
const RecipeGrid = ({
  data,
  isLoading,
  openModal
}: {
  data: IPagedResult<IRecipeShort>;
  isLoading: boolean;
  openModal: (recipeShort: IRecipeShort) => void;
}) => {
  const dispatch = useAppDispatch();

  const setPageNumber = (page: number) => {
    dispatch(setRecipePageNumber(page - 1));
  };

  return (
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
      {data && (
        <>
          <Space h="xl" />
          <Pagination.Root
            siblings={1}
            defaultValue={1}
            value={data.meta.page + 1}
            onChange={setPageNumber}
            total={data.meta.pageCount}
          >
            <Group justify="center" gap="xs" className="ros-paginator">
              <Pagination.First icon={ChevronsLeft} />
              <Pagination.Items />
              <Pagination.Last icon={ChevronsRight} />
            </Group>
          </Pagination.Root>
          <Space h="xl" />
        </>
      )}
    </section>
  );
};

export default RecipeGrid;
