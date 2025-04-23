import RichEditorInput from '@components/RichEditorInput/EditorInput';
import { ETimeSlot, ISchedule } from '@domain/schedule.dto';
import { useLazyGetScheduleForDateQuery, useSaveScheduleMutation } from '@features/api/apiSlice';
import { Button, Flex, Modal, Select, Space } from '@mantine/core';
import { DatePickerInput, DateValue } from '@mantine/dates';
import { isNotEmpty } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { getDateIndex, getIncrementalDateObject } from '@utils/dateUtils';
import { CloudUploadIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import { pickATime } from '../schedule.const';
import ScheduleRecipesFields from './ScheduleRecipesFields';
import { ScheduleFormProvider, useScheduleForm } from './scheduleModalForm.context';

interface ScheduleModalProps {
  schedule: ISchedule | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleModal = ({ schedule, isOpen, onClose }: ScheduleModalProps) => {
  const [saveSchedule, { isLoading: scheduleIsSaving }] = useSaveScheduleMutation();
  const [getDaySchedule, { data, isLoading }] = useLazyGetScheduleForDateQuery();
  const [isEdit, setIsEdit] = useState<boolean>(!!schedule?.scheduleRecipes.length && !!schedule.scheduleRecipes[0].id);
  console.log('test', schedule?.scheduleRecipes.length, isEdit);

  const form = useScheduleForm({
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
        : [{ recipeId: '', quantity: 1, id: 0 }],
      notes: schedule?.notes || ''
    },
    validate: { date: isNotEmpty('Date is required') },
    onSubmitPreventDefault: 'always'
  });

  if (!schedule || !isOpen) {
    return null;
  }

  /** On form submission, attempts to save the current schedule and then close the modal */
  const submitForm = async (values: ISchedule) => {
    try {
      await saveSchedule(values).unwrap();
      notifications.show({
        title: 'Success',
        color: 'green',
        message: `Recipe(s) scheduled for ${values.timeSlot}.`
      });
      onClose();
    } catch (error: unknown) {
      console.log('looks like an error occurred', error);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        notifications.show({ message: (error as { message: string }).message, color: 'red' });
      }
    }
  };

  const dateChange = async (value: DateValue) => {
    if (!value) {
      return;
    }

    try {
      form.setFieldValue('date', value);
      const payload = await getDaySchedule(getDateIndex(value)).unwrap();
      setIsEdit(checkIsEdit());
      console.log('new date', form.getValues().date, payload, data, isEdit, checkIsEdit());

      // TODO now update the form (keep dirty fields)
    } catch (error) {
      console.log('error happened trying to fetch for the date', value, error);
    }
  };

  const checkIsEdit = (): boolean => {
    const slotItems = (data || [schedule] || []).filter((sched) => sched.timeSlot === form.getValues().timeSlot);
    return !!slotItems.length && !!slotItems[0].scheduleRecipes.length;
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      transitionProps={{ transition: 'slide-left' }}
      withCloseButton={true}
      closeButtonProps={{ 'aria-label': 'Close' }}
      size="lg"
      aria-label={'Schedule'}
      title={`${isEdit ? 'Edit' : 'Create a'} schedule`}
      className="schedule--modal"
    >
      <ScheduleFormProvider form={form}>
        <form onSubmit={form.onSubmit((values) => submitForm(values))}>
          <DatePickerInput
            label="Pick date"
            placeholder="Pick date"
            withAsterisk
            minDate={new Date()}
            key={form.key(`date`)}
            {...form.getInputProps('date')}
            onChange={dateChange}
          />
          <Space h="md" />
          <Select
            placeholder="Time slot"
            label="Pick a time slot"
            data={pickATime}
            withAsterisk
            allowDeselect={false}
            {...form.getInputProps('timeSlot')}
            className="sort-by--select"
          />
          <Space h="md" />
          {form.getValues().scheduleRecipes.map((item, index) => (
            <ScheduleRecipesFields key={item.id || randomId()} item={item} index={index} />
          ))}
          <Space h="md" />
          <RichEditorInput {...form.getInputProps('notes')} label="Notes" />

          <Space h="xl" />
          <Flex gap="sm" justify="space-between">
            <Button
              type="button"
              variant="outline"
              leftSection={<Plus size={16} />}
              onClick={() => form.insertListItem('scheduleRecipes', { recipe: '', quantity: 1, key: randomId() })}
            >
              <span>Additional recipe</span>
            </Button>
            <Button type="submit" loading={scheduleIsSaving} leftSection={<CloudUploadIcon />}>
              {isEdit ? 'Save' : 'Create'}
            </Button>
          </Flex>
        </form>
      </ScheduleFormProvider>
    </Modal>
  );
};

export default ScheduleModal;
