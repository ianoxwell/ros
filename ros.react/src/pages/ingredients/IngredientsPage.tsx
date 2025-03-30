import { useAppDispatch, useAppSelector } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import SortAndFilterButton from '@components/SortAndFilterButton/SortAndFilterButton.component';
import { IIngredientShort } from '@domain/ingredient.dto';
import { IUserToken } from '@domain/user.dto';
import { useGetIngredientsMutation } from '@features/api/apiSlice';
import { Button, Collapse, Group, Pagination, Space, Table, Title } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { sentenceCase } from '@utils/stringUtils';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './ingredients.scss';
import { setIngredientPageNumber } from './ingredientFilter.slice';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import IngredientFilter from './IngredientFilter';
import { fixWholeNumber } from '@utils/numberUtils';

export const IngredientsPage = () => {
  const ingredientFilter = useSelector((store: RootState) => store.ingredientFilter);
  const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;
  const [getIngredients, { data, isLoading }] = useGetIngredientsMutation();
  const [filterOpen, { toggle }] = useDisclosure(false);
  const isMobile = useMediaQuery(`(max-width: 1599px)`);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      getIngredients(ingredientFilter);
    } catch (error) {
      console.log('error getting ingredients', error);
    }
  }, [ingredientFilter, getIngredients]);

  const openModal = (ing: IIngredientShort) => {
    navigate(`${CRoutes.ingredients}/${ing.id}`);
  };

  const openFilter = () => {
    toggle();
  };

  const setPageNumber = (page: number) => {
    dispatch(setIngredientPageNumber(page - 1));
  };

  const rows = data?.results.map((ingredient) => (
    <Table.Tr key={ingredient.id}>
      <Table.Td>{sentenceCase(ingredient.name)}</Table.Td>
      {!isMobile && <Table.Td>{ingredient.aisle}</Table.Td>}
      <Table.Td align="center" className="small-column">
        {fixWholeNumber(ingredient.nutrition?.caloricBreakdown.percentProtein, 1)}%
      </Table.Td>
      <Table.Td align="center" className="small-column">
        {fixWholeNumber(ingredient.nutrition?.caloricBreakdown.percentCarbs, 1)}%
      </Table.Td>
      <Table.Td align="center" className="small-column">
        {fixWholeNumber(ingredient.nutrition?.caloricBreakdown.percentFat, 1)}%
      </Table.Td>
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
          {!isMobile && <Table.Th>Aisle</Table.Th>}
          <Table.Th align="center" className="small-column">
            Protein%
          </Table.Th>
          <Table.Th align="center" className="small-column">
            Carbs%
          </Table.Th>
          <Table.Th align="center" className="small-column">
            Fat%
          </Table.Th>
          <Table.Th align="center" className="small-column">
            View
          </Table.Th>
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
      <Space h="md" />
      <SortAndFilterButton meta={data?.meta} toggle={openFilter} page="ingredients" />
      <Collapse in={filterOpen}>
        <IngredientFilter />
      </Collapse>

      {!!data?.results.length && (
        <section>
          <IngredientTable />
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
        </section>
      )}
    </>
  );
};
