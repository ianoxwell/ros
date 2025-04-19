import { ETimeSlot, ISchedule, IScheduleRecipe } from '@domain/schedule.dto';
import { ActionIcon, Button, ComboboxItem, Flex, Group, Modal, NumberInput, Select, Space, Title } from '@mantine/core';
import { pickATime } from './schedule.const';
import { useSaveScheduleMutation } from '@features/api/apiSlice';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { getIncrementalDateObject } from '@utils/dateUtils';
import { Trash } from 'lucide-react';

interface ScheduleModalProps {
  schedule: ISchedule | undefined;
  focusRecipe: IScheduleRecipe | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleModal = ({ schedule, isOpen, focusRecipe, onClose }: ScheduleModalProps) => {
  const [saveSchedule, { isLoading: scheduleIsSaving }] = useSaveScheduleMutation();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      date: schedule?.date
        ? typeof schedule.date === 'string'
          ? new Date(schedule.date)
          : schedule.date
        : getIncrementalDateObject(2),
      timeSlot: schedule?.timeSlot || ETimeSlot.BREAKFAST,
      scheduleRecipes: schedule?.scheduleRecipes.length
        ? schedule.scheduleRecipes
        : [{ recipeId: '', quantity: 1, id: 0 }]
    },
    onSubmitPreventDefault: 'always'
  });

  if (!schedule || !isOpen) {
    return null;
  }

  console.log('open the modal', schedule, form.getValues());
  const pickARecipe: ComboboxItem[] = [
    { value: '83', label: 'Cheese and leek strata' },
    { value: '96', label: 'Buffalo Ranch Chicken Dip' },
    { value: '94', label: 'Chicken Burritos' }
  ];
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
    <Flex gap="sm" align="flex-end" key={item.id || randomId()} mt="xs">
      <NumberInput
        label="Prepare Qty"
        placeholder="Whole number"
        allowNegative={false}
        allowDecimal={false}
        min={0}
        max={100}
        key={form.key(`scheduleRecipes.${index}.quantity`)}
        {...form.getInputProps(`scheduleRecipes.${index}.quantity`)}
      />
      <Select
        placeholder="Recipe"
        label="Pick a recipe"
        data={pickARecipe}
        allowDeselect={false}
        key={form.key(`scheduleRecipes.${index}.recipeId`)}
        {...form.getInputProps(`scheduleRecipes.${index}.recipeId`)}
        className="sort-by--select"
      />

      <ActionIcon color="red" onClick={() => form.removeListItem('scheduleRecipes', index)}>
        <Trash size={16} />
      </ActionIcon>
    </Flex>
  ));

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      transitionProps={{ transition: 'slide-left' }}
      withCloseButton={false}
      aria-label={'Schedule'}
    >
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
    </Modal>
  );
};

export default ScheduleModal;
