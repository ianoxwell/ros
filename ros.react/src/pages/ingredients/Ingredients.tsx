import { useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import SortAndFilterButton from '@components/SortAndFilterButton/SortAndFilterButton.component';
import { IIngredientShort } from '@domain/ingredient.dto';
import { IUserToken } from '@domain/user.dto';
import { useGetIngredientsMutation } from '@features/api/apiSlice';
import { Button, Modal, Table, Title } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { sentenceCase } from '@utils/stringUtils';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import IngredientModal from './IngredientModal';

export const Ingredients = () => {
  const ingredientFilter = useSelector((store: RootState) => store.ingredientFilter);
  const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;
  const [getIngredients, { data, isLoading }] = useGetIngredientsMutation();
  const [filterOpen, { toggle }] = useDisclosure(false);
  const [ingredientOpened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery(`(max-width: 1599px)`);
  const [viewIngredient, setViewIngredient] = useState<IIngredientShort | undefined>(undefined);

  useEffect(() => {
    try {
      getIngredients(ingredientFilter);
    } catch (error) {
      console.log('error getting ingredients', error);
    }
  }, [ingredientFilter, getIngredients]);

  const openModal = (ingredientShort: IIngredientShort) => {
    console.log('open the modal now');
    setViewIngredient(ingredientShort);
    open();
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

  const IngredientTable = () => {
    return (
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
  };

  return (
    <>
      <Modal
        opened={ingredientOpened}
        onClose={close}
        transitionProps={{ transition: 'slide-left' }}
        fullScreen
        radius={0}
        withCloseButton={false}
        padding={0}
        aria-label={viewIngredient?.name || 'Recipe'}
      >
        {/* Modal content */}
        {viewIngredient && <IngredientModal ingredientShort={viewIngredient} closeModal={close} />}
      </Modal>

      <div className="title-bar">
        <div className="text-muted">Hello {user.givenNames}</div>
        <Title className="title-bar--title">What ingredients would you like to use today?</Title>
      </div>

      <SortAndFilterButton meta={data?.meta} toggle={toggle} page="ingredients" />
      <IngredientTable />
    </>
  );
};
