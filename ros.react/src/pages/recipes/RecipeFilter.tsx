import { useAppDispatch } from '@app/hooks';
import { RootState } from '@app/store';
import { EOrder } from '@domain/base.dto';
import { IFilter } from '@domain/filter.dto';
import { ActionIcon, Button, CloseButton, Flex, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Search } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { setNewFilter } from './recipeFilter.slice';

const RecipeFilter = ({ styles }: { styles: React.CSSProperties }) => {
  const filter = useSelector((store: RootState) => store.recipeFilter);
  const dispatch = useAppDispatch();
  const [sortOrder, setSortOrder] = useState(filter.order);
  const sortBy = [
    { value: 'name', label: 'Name' },
    { value: 'cookingMinutes', label: 'Cooking Time' },
    { value: 'healthScore', label: 'Health rating' },
    { value: 'servings', label: 'Servings' }
  ];

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { ...filter },
    onSubmitPreventDefault: 'always'
  });

  const submitForm = (values: IFilter) => {
    console.log('submit form', values);
    dispatch(setNewFilter({ ...values, order: sortOrder }));
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === EOrder.ASC ? EOrder.DESC : EOrder.ASC);
  };

  return (
    <section className="filter-content" style={styles}>
      <form onSubmit={form.onSubmit((values) => submitForm(values))}>
        <Stack gap="md">
          <TextInput
            leftSection={<Search size={16} />}
            type="search"
            placeholder="Recipe name"
            key={form.key('keyword')}
            {...form.getInputProps('keyword')}
            rightSection={
              <CloseButton
                aria-label="Clear input"
                onClick={() => form.setFieldValue('keyword', '')}
                style={{ display: form.getValues().keyword ? undefined : 'none' }}
              />
            }
          />
          <Flex direction="row" gap="md" align="center">
            <Select placeholder="Sort" data={sortBy} allowDeselect={false} {...form.getInputProps('sort')} className='sort-by--select' />
            <ActionIcon aria-label="sort order" type="button" onClick={toggleSortOrder}>
              {sortOrder === EOrder.ASC ? <ArrowDownWideNarrow size={16} /> : <ArrowUpWideNarrow size={16} />}
            </ActionIcon>
          </Flex>
          <Button type="submit">Apply Filters</Button>
        </Stack>
      </form>
    </section>
  );
};

export default RecipeFilter;
