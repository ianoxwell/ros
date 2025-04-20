import { ETimeSlot, ISchedule, IScheduleRecipe } from '@domain/schedule.dto';
import { useSaveScheduleMutation } from '@features/api/apiSlice';
import { ActionIcon, Button, Flex, Modal, NumberInput, Select, Space, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { getIncrementalDateObject } from '@utils/dateUtils';
import { Trash } from 'lucide-react';
import { pickATime } from './schedule.const';
import SuggestionAutoComplete from './SuggestionAutoComplete';

interface ScheduleModalProps {
  schedule: ISchedule | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleModal = ({ schedule, isOpen, onClose }: ScheduleModalProps) => {
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
  const submitForm = (values: ISchedule) => {
    saveSchedule(values);
    // TODO when saveSchedule complete then close the modal
  };

  const ScheduleRecipesFields = ({ item, index }: { item: IScheduleRecipe; index: number }) => {
    return (
      <Flex gap="sm" align="flex-end" mt="xs">
        <NumberInput
          label="Prepare Qty"
          placeholder="Whole number"
          className="schedule--modal__quantity"
          allowNegative={false}
          allowDecimal={false}
          min={0}
          max={100}
          key={form.key(`scheduleRecipes.${index}.quantity`)}
          {...form.getInputProps(`scheduleRecipes.${index}.quantity`)}
        />
        <SuggestionAutoComplete
          item={item}
          onSelectionChange={(id, name) => {
            form.setFieldValue(`scheduleRecipes.${index}.recipeId`, id);
            form.setFieldValue(`scheduleRecipes.${index}.recipeName`, name);
          }}
        />

        {!!index && (
          <ActionIcon color="red" onClick={() => form.removeListItem('scheduleRecipes', index)}>
            <Trash size={16} />
          </ActionIcon>
        )}
      </Flex>
    );
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      transitionProps={{ transition: 'slide-left' }}
      withCloseButton={false}
      aria-label={'Schedule'}
      className="schedule--modal"
    >
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
        {form.getValues().scheduleRecipes.map((item, index) => (
          <ScheduleRecipesFields key={item.id || randomId()} item={item} index={index} />
        ))}
        <Space h="xl" />
        <Flex gap="sm" justify="space-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.insertListItem('scheduleRecipes', { recipe: '', quantity: 1, key: randomId() })}
          >
            Additional recipe
          </Button>
          <Button type="submit" loading={scheduleIsSaving}>
            Create
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default ScheduleModal;
