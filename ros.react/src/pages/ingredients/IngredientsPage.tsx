import { useAppSelector } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import SortAndFilterButton from '@components/SortAndFilterButton/SortAndFilterButton.component';
import { IIngredient } from '@domain/ingredient.dto';
import { IUserToken } from '@domain/user.dto';
import { useGetIngredientsMutation } from '@features/api/apiSlice';
import { Button, Table, Title } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { sentenceCase } from '@utils/stringUtils';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './ingredients.scss';

export const IngredientsPage = () => {
  const ingredientFilter = useSelector((store: RootState) => store.ingredientFilter);
  const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;
  const [getIngredients, { data, isLoading }] = useGetIngredientsMutation();
  const [filterOpen, { toggle }] = useDisclosure(false);
  const isMobile = useMediaQuery(`(max-width: 1599px)`);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      getIngredients(ingredientFilter);
    } catch (error) {
      console.log('error getting ingredients', error);
    }
  }, [ingredientFilter, getIngredients]);

  const openModal = (ing: IIngredient) => {
    navigate(`${CRoutes.ingredients}/${ing.id}`);
  };

  const rows = data?.results.map((ingredient) => (
    <Table.Tr key={ingredient.id}>
      <Table.Td>{sentenceCase(ingredient.name)}</Table.Td>
      <Table.Td>{ingredient.aisle}</Table.Td>
      <Table.Td>
        <Button type="button" onClick={() => openModal(ingredient)}>
          View
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  const IngredientTable = () => (
    <Table stickyHeader horizontalSpacing="md" striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Ingredient</Table.Th>
          <Table.Th>Aisle</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );

  return (
    <>
      <div className="title-bar">
        <div className="text-muted">Hello {user.givenNames}</div>
        <Title className="title-bar--title">What ingredients would you like to know more about today?</Title>
      </div>

      <SortAndFilterButton meta={data?.meta} toggle={toggle} page="ingredients" />
      <IngredientTable />
    </>
  );
};
