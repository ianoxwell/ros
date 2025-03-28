import { useAppDispatch } from '@app/hooks';
import { RootState } from '@app/store';
import { EOrder } from '@domain/base.dto';
import { CBlankFilter, IRecipeFilter } from '@domain/filter.dto';
import { useGetReferencesQuery } from '@features/api/apiSlice';
import { ActionIcon, Button, CloseButton, Flex, MultiSelect, Select, Space, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { sortLabels } from '@utils/stringUtils';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Search } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { setNewFilter } from './recipeFilter.slice';

const RecipeFilter = () => {
  const filter = useSelector((store: RootState) => store.recipeFilter);
  const references = useGetReferencesQuery();
  const healthLabels = sortLabels(references.data?.healthLabel);
  const cuisineTypes = sortLabels(references.data?.cuisineType);
  const dishTypes = sortLabels(references.data?.dishType);
  const equipment = sortLabels(references.data?.equipment);

  const dispatch = useAppDispatch();
  const [sortOrder, setSortOrder] = useState(filter.order);
  const sortBy = [
    { value: 'name', label: 'Name' },
    { value: 'readyInMinutes', label: 'Cooking Time' },
    { value: 'healthScore', label: 'Health rating' },
    { value: 'servings', label: 'Servings' }
  ];

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { ...filter },
    onSubmitPreventDefault: 'always'
  });

  const submitForm = (values: IRecipeFilter) => {
    console.log('submit form', values);
    dispatch(setNewFilter({ ...values, page: 0, order: sortOrder }));
  };

  const resetFilters = () => {
    dispatch(setNewFilter(CBlankFilter));
  }

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
          <Flex direction="row" gap="md" align="center">
            <Select
              placeholder="Sort"
              label="Sort by"
              data={sortBy}
              allowDeselect={false}
              {...form.getInputProps('sort')}
              className="sort-by--select"
            />
            <ActionIcon aria-label="sort order" type="button" onClick={toggleSortOrder}>
              {sortOrder === EOrder.ASC ? <ArrowDownWideNarrow size={16} /> : <ArrowUpWideNarrow size={16} />}
            </ActionIcon>
          </Flex>
          <MultiSelect
            data={cuisineTypes}
            label="Cuisine types"
            placeholder="Include cuisine type in search results"
            checkIconPosition="right"
            searchable
            clearable
            key={form.key('cuisineTypes')}
            {...form.getInputProps('cuisineTypes')}
          />
          <MultiSelect
            data={healthLabels}
            label="Diets"
            placeholder="Include diet type in search results - keto, vegetarian"
            checkIconPosition="right"
            searchable
            clearable
            key={form.key('diets')}
            {...form.getInputProps('diets')}
          />
          <MultiSelect
            data={dishTypes}
            label="Dish types"
            placeholder="Include dish type in search results - breakfast, dinner etc"
            checkIconPosition="right"
            searchable
            clearable
            key={form.key('dishTypes')}
            {...form.getInputProps('dishTypes')}
          />
          <MultiSelect
            data={equipment}
            label="Equipment"
            placeholder="Include equipment in search results"
            checkIconPosition="right"
            searchable
            clearable
            key={form.key('equipment')}
            {...form.getInputProps('equipment')}
          />

          <Space h="xl" />
          <Button type="submit">Apply Filters</Button>
          <Button type="button" onClick={resetFilters} variant="outline">
            Clear Filters
          </Button>
          <Space h="xl" />
        </Stack>
      </form>
    </section>
  );
};

export default RecipeFilter;
