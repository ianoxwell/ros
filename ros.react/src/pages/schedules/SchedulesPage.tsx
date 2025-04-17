import { useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import { ETimeSlot, ISchedule, IScheduleRecipe } from '@domain/schedule.dto';
import { IUserToken } from '@domain/user.dto';
import { useGetMyScheduledRecipesQuery, useSaveScheduleMutation } from '@features/api/apiSlice';
import {
  ActionIcon,
  Button,
  ComboboxItem,
  Flex,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Space,
  Title
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { getDateFromIndex, getIncrementalDateObject } from '@utils/dateUtils';
import dayjs from 'dayjs';
import { Plus, Trash } from 'lucide-react';
import { useSelector } from 'react-redux';
import './schedules.scss';

export const SchedulesPage = () => {
  const scheduleFilter = useSelector((store: RootState) => store.scheduleFilter);
  const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;

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

  const pickATime: ComboboxItem[] = [
    { value: ETimeSlot.BREAKFAST, label: 'Breakfast' },
    // { value: ETimeSlot.MORNING_SNACK, label: 'Morning snack' },
    { value: ETimeSlot.LUNCH, label: 'Lunch' },
    // { value: ETimeSlot.AFTERNOON_SNACK, label: 'Afternoon snack' },
    { value: ETimeSlot.DINNER, label: 'Dinner' }
    // { value: ETimeSlot.EVENING_SNACK, label: 'Evening snack' }
  ];

  const pickARecipe: ComboboxItem[] = [
    { value: '83', label: 'Cheese and leek strata' },
    { value: '96', label: 'Buffalo Ranch Chicken Dip' },
    { value: '94', label: 'Chicken Burritos' }
  ];

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      date: getIncrementalDateObject(4),
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

  const newItem = (slot: ComboboxItem, dateIndex: string) => {
    console.log('open a new modal to create a new recipe', slot, dateIndex);
  };

  const removeRecipeFromSlot = (schedule: ISchedule, recipe: IScheduleRecipe) => {
    console.log('should remove and save the schedule', schedule, recipe);
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
      <div className="title-bar">
        <div className="text-muted">Hello {user.givenNames}</div>
        <Title className="title-bar--title">What meals would you like to eat this week?</Title>
      </div>
      {/* <DatePickerInput
        type="range"
        label="Pick dates range"
        placeholder="Pick dates range"
        value={value}
        onChange={setValue}
      /> */}
      <section className="schedule-grid">
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5, xl: 7 }} spacing="0" verticalSpacing="md">
          {schedule &&
            Object.entries(schedule).map(([key, value], index: number) => {
              const date = dayjs(getDateFromIndex(key));
              return (
                <article className={`schedule-item ${index % 2 === 0 ? 'odd' : ''}`}>
                  <div className="schedule-item--day">{date.format('dddd')}</div>
                  <div className="schedule-item--date">{date.format('MMMM D, YYYY')}</div>
                  {pickATime.map((slot) => {
                    const slotItems = value.filter((schedule) => schedule.timeSlot === slot.value);
                    return (
                      <>
                        <div className="schedule-item--slot">
                          <span>{slot.label}</span>
                          <button type="button" onClick={() => newItem(slot, key)} title="New" className="nav-fab">
                            <Plus />
                          </button>
                        </div>
                        {slotItems.map((item: ISchedule) => (
                          <>
                            {item.scheduleRecipes.map((recipe: IScheduleRecipe) => (
                              <Flex gap="sm" justify="space-between">
                                <Flex gap="xs">
                                  <b>{recipe.quantity}</b>
                                  <span>{recipe.recipeName}</span>
                                </Flex>
                                <ActionIcon
                                  color="red"
                                  title="Remove item from this slot"
                                  onClick={() => removeRecipeFromSlot(item, recipe)}
                                >
                                  <Trash size={16} />
                                </ActionIcon>
                              </Flex>
                            ))}
                          </>
                        ))}
                      </>
                    );
                  })}
                </article>
              );
            })}
        </SimpleGrid>
      </section>

      {/* TODO Shift to a modal */}
      <Space h="xl" />
      <Title order={2}>Create a booking</Title>
      <form onSubmit={form.onSubmit((values) => submitForm(values))}>
        <DatePickerInput
          label="Pick date"
          placeholder="Pick date"
          clearable
          withAsterisk
          minDate={new Date()}
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
