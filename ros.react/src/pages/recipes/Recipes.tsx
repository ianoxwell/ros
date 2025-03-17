import { RootState } from '@app/store';
import { useGetRecipesMutation } from '@features/api/apiSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const Recipes = () => {
  const recipeFilter = useSelector((store: RootState) => store.recipeFilter);
  const [getRecipes, { data, isLoading }] = useGetRecipesMutation();

  useEffect(() => {
    try {
      console.log('got recipe filter', recipeFilter);
      getRecipes(recipeFilter);
    } catch (error) {
      console.log('made a boo boo', error);
    }
  }, [recipeFilter, getRecipes]);

  return (
    <section>
      <div>It is the recipe / home page bit</div>
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <>
          <div>Finished, {data?.meta.itemCount}</div>
        </>
      )}
    </section>
  );
};
