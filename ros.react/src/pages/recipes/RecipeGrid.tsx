import Loader from '@components/Loader/Loader.component';
import RosPagination from '@components/RosPagination/RosPagination.component';
import { IPagedResult } from '@domain/base.dto';
import { IRecipeShort } from '@domain/recipe.dto';
import { SimpleGrid } from '@mantine/core';
import RecipeCard from './RecipeCard';

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
      {data && <RosPagination meta={data.meta} />}
    </section>
  );
};

export default RecipeGrid;
