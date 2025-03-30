import { useAppDispatch } from '@app/hooks';
import { RootState } from '@app/store';
import { EOrder } from '@domain/base.dto';
import { CBlankFilter, IIngredientFilter } from '@domain/filter.dto';
import { ActionIcon, Button, CloseButton, Flex, Select, Space, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Search } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { setNewIngredientFilter } from './ingredientFilter.slice';

const IngredientFilter = () => {
  const filter = useSelector((store: RootState) => store.ingredientFilter);
  const dispatch = useAppDispatch();
  const [sortOrder, setSortOrder] = useState(filter.order);
  const sortBy = [
    { value: 'name', label: 'Name' },
    { value: 'percentProtein', label: 'Protein' },
    { value: 'percentFat', label: 'Fat' },
    { value: 'percentCarbs', label: 'Carbs' }
  ];

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { ...filter },
    onSubmitPreventDefault: 'always'
  });

  const submitForm = (values: IIngredientFilter) => {
    dispatch(setNewIngredientFilter({ ...values, page: 0, order: sortOrder }));
  };

  const resetFilters = () => {
    dispatch(setNewIngredientFilter(CBlankFilter));
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === EOrder.ASC ? EOrder.DESC : EOrder.ASC);
  };

  return (
    <section className="filter-content">
      <form onSubmit={form.onSubmit((values) => submitForm(values))}>
        <Stack gap="md">
          <TextInput
            leftSection={<Search size={16} />}
            type="search"
            label="Keyword search"
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
          <Flex direction="row" gap="md" align="flex-end">
            <Select
              placeholder="Sort"
              label="Sort by"
              data={sortBy}
              allowDeselect={false}
              {...form.getInputProps('sort')}
              className="sort-by--select"
            />
            <ActionIcon aria-label="sort order" type="button" size="lg" onClick={toggleSortOrder}>
              {sortOrder === EOrder.ASC ? <ArrowDownWideNarrow size={20} /> : <ArrowUpWideNarrow size={20} />}
            </ActionIcon>
          </Flex>

          <Space h="xl" />
          <Flex direction={{ base: 'column', md: 'row-reverse' }} gap="md">
            <Button type="submit" fullWidth>
              Apply Filters
            </Button>
            <Button type="button" onClick={resetFilters} variant="outline" fullWidth>
              Clear Filters
            </Button>
          </Flex>
          <Space h="xl" />
        </Stack>
      </form>
    </section>
  );
};

export default IngredientFilter;
