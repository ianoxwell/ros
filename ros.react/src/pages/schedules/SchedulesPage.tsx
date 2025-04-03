import { RootState } from '@app/store';
import { ETimeSlot, ISchedule } from '@domain/schedule.dto';
import { useGetMyScheduledRecipesQuery, useSaveScheduleMutation } from '@features/api/apiSlice';
import { ActionIcon, Button, Group, NumberInput, Select, Space, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { Trash } from 'lucide-react';
import { useSelector } from 'react-redux';

export const SchedulesPage = () => {
  const scheduleFilter = useSelector((store: RootState) => store.scheduleFilter);
  // const [value, setValue] = useState<[string, string]>([scheduleFilter.dateFrom, scheduleFilter.dateTo]);
  const { data: schedule, isLoading } = useGetMyScheduledRecipesQuery(scheduleFilter, { skip: !scheduleFilter });
  const [saveSchedule, { isLoading: scheduleIsSaving }] = useSaveScheduleMutation();

  //   useEffect(() => {
  //     try {
  //       getSchedules(scheduleFilter);
  //     } catch (error) {
  //       console.log('made a boo boo', error);
  //     }
  //   }, [scheduleFilter, getSchedules]);

  const pickATime = [
    { value: ETimeSlot.BREAKFAST, label: 'Breakfast' },
    { value: ETimeSlot.LUNCH, label: 'Lunch' },
    { value: ETimeSlot.DINNER, label: 'Dinner' }
  ];

  const pickARecipe = [
    { value: '83', label: 'Cheese and leek strata' },
    { value: '96', label: 'Buffalo Ranch Chicken Dip' },
    { value: '94', label: 'Chicken Burritos' }
  ];

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      date: new Date(),
      timeSlot: ETimeSlot.BREAKFAST,
      scheduleRecipes: [{ recipeId: '', quantity: 1, key: randomId() }]
    },
    onSubmitPreventDefault: 'always'
  });

  const submitForm = (values: ISchedule) => {
    console.log('push this to server', values);
    const newSchedule = {
      ...values,
      scheduleRecipes: values.scheduleRecipes?.map((s) => ({
        recipeId: parseInt(s.recipeId.toString()),
        quantity: s.quantity
      }))
    };
    saveSchedule(newSchedule);
    // dispatch(setNewRecipeFilter({ ...values, page: 0, order: sortOrder }));
  };

  const scheduleRecipesFields = form.getValues().scheduleRecipes.map((item, index) => (
    <Group key={item.key} mt="xs">
      <Select
        placeholder="Recipe"
        label="Pick a recipe"
        data={pickARecipe}
        allowDeselect={false}
        key={form.key(`scheduleRecipes.${index}.recipeId`)}
        {...form.getInputProps(`scheduleRecipes.${index}.recipeId`)}
        className="sort-by--select"
      />
      <NumberInput
        label="Cook how many"
        placeholder="Whole numbers only"
        allowNegative={false}
        allowDecimal={false}
        min={0}
        max={100}
        key={form.key(`scheduleRecipes.${index}.quantity`)}
        {...form.getInputProps(`scheduleRecipes.${index}.quantity`)}
      />
      <ActionIcon color="red" onClick={() => form.removeListItem('scheduleRecipes', index)}>
        <Trash size={16} />
      </ActionIcon>
    </Group>
  ));

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <section>
      It is the schedules page - probably a calendar thing
      {/* <DatePickerInput
        type="range"
        label="Pick dates range"
        placeholder="Pick dates range"
        value={value}
        onChange={setValue}
      /> */}
      <div>Length {schedule?.length || 0}</div>
      <Space h="xl" />
      <Title order={2}>Create a booking</Title>
      <form onSubmit={form.onSubmit((values) => submitForm(values))}>
        <DatePickerInput
          label="Pick date"
          placeholder="Pick date"
          key={form.key(`date`)}
          {...form.getInputProps('date')}
        />
        <Select
          placeholder="Time slot"
          label="Pick a time slot"
          data={pickATime}
          allowDeselect={false}
          {...form.getInputProps('timeSlot')}
          className="sort-by--select"
        />
        {scheduleRecipesFields}
        <Button onClick={() => form.insertListItem('scheduleRecipes', { recipe: '', quantity: 1, key: randomId() })}>
          Add employee
        </Button>
        <Button type="submit" loading={scheduleIsSaving}>
          Create
        </Button>
      </form>
    </section>
  );
};
