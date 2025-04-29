import { useAppDispatch } from '@app/hooks';
import { closeAllGlobalModals } from '@components/GlobalNavigation/globalModal.slice';
import RichEditorInput from '@components/RichEditorInput/EditorInput';
import { ETimeSlot, ISchedule } from '@domain/schedule.dto';
import { useLazyGetScheduleForDateQuery, useSaveScheduleMutation } from '@features/api/apiSlice';
import { Button, Flex, Modal, Select, Space } from '@mantine/core';
import { DatePickerInput, DateValue } from '@mantine/dates';
import { isInRange, isNotEmpty } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { getDateIndex, getIncrementalDateObject } from '@utils/dateUtils';
import { CloudUploadIcon, Loader, Plus } from 'lucide-react';
import { useState } from 'react';
import { pickATime } from '../schedule.const';
import { CBlankScheduleRecipe, ScheduleFormProvider, useScheduleForm } from './scheduleModalForm.context';
import ScheduleRecipesFields from './ScheduleRecipesFields';

interface ScheduleModalProps {
  schedule: ISchedule | undefined;
  isOpen: boolean;
}

const ScheduleModal = ({ schedule, isOpen }: ScheduleModalProps) => {
  const [saveSchedule, { isLoading: scheduleIsSaving }] = useSaveScheduleMutation();
  const [getDaySchedule, { data }] = useLazyGetScheduleForDateQuery();
  const [isDayScheduleLoading, setIsDayScheduleLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(!!schedule?.scheduleRecipes.length && !!schedule.scheduleRecipes[0].id);
  const dispatch = useAppDispatch();

  const form = useScheduleForm({
    mode: 'uncontrolled',
    initialValues: {
      id: schedule?.id,
      date: schedule?.date
        ? typeof schedule.date === 'string'
          ? new Date(schedule.date)
          : schedule.date
        : getIncrementalDateObject(2),
      timeSlot: schedule?.timeSlot || ETimeSlot.BREAKFAST,
      scheduleRecipes: schedule?.scheduleRecipes.length ? schedule.scheduleRecipes : [CBlankScheduleRecipe],
      notes: schedule?.notes || ''
    },
    validate: {
      date: isNotEmpty('Date is required'),
      timeSlot: isNotEmpty('Time slot is required'),
      scheduleRecipes: {
        quantity: isInRange({ min: 1, max: 500 }, 'Can only have between 1 and 500 copies of recipe'),
        recipeId: isNotEmpty('Need a recipe to prepare')
      }
    },
    onSubmitPreventDefault: 'always'
  });

  if (!schedule || !isOpen) {
    return null;
  }

  const closeModal = () => {
    dispatch(closeAllGlobalModals());
  };

  // console.log('test', schedule?.scheduleRecipes.length, isEdit, form.getValues());
  /** On form submission, attempts to save the current schedule and then close the modal */
  const submitForm = async (values: ISchedule) => {
    if (!form.isValid()) {
      return;
    }

    try {
      await saveSchedule(values).unwrap();
      notifications.show({
        title: 'Success',
        color: 'green',
        message: `Recipe(s) scheduled for ${values.timeSlot}.`
      });
      closeModal();
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

    setIsDayScheduleLoading(true);
    form.setFieldValue('date', value);
    try {
      const payload = await getDaySchedule(getDateIndex(value)).unwrap();
      formChangeScheduleModal(payload);
      // TODO now update the form (keep dirty fields)
    } catch (error) {
      console.log('error happened trying to fetch for the date', value, error);
    } finally {
      setIsDayScheduleLoading(false);
    }
  };

  const timeSlotChange = async (value: string | null) => {
    if (!value) {
      return;
    }

    setIsDayScheduleLoading(true);
    const enumValue = Object.values(ETimeSlot).find((slot) => slot === value) || value;
    form.setFieldValue('timeSlot', enumValue as ETimeSlot);
    try {
      const payload = await getDaySchedule(getDateIndex(form.getValues().date)).unwrap();
      formChangeScheduleModal(payload);
    } catch (error) {
      console.log('error happened trying to fetch for the date', value, error);
    } finally {
      setIsDayScheduleLoading(false);
    }
  };

  const formChangeScheduleModal = (payload: ISchedule[]) => {
    const isEdit = checkIsEdit(payload);
    const rawForm = form.getValues();
    setIsEdit(isEdit);
    const findSlot = payload.find((s: ISchedule) => s.timeSlot === rawForm.timeSlot);
    console.log('new date', payload, data, findSlot, isEdit);

    if (isEdit) {
      form.setFieldValue('id', findSlot?.id || 0);
      console.log('an edit', form.isDirty('notes'));
      if (form.isDirty('scheduleRecipes')) {
        console.log('now I have to decide what to do with the existing data');
      } else {
        form.setFieldValue('scheduleRecipes', findSlot?.scheduleRecipes || [CBlankScheduleRecipe]);
      }

      if (form.isDirty('notes')) {
        console.log('notes was considered dirty?');
        form.setFieldValue('notes', form.getValues().notes?.concat(findSlot?.notes || ''));
      } else {
        console.log('have set the notes to the findSlot', findSlot?.notes);
        form.setFieldValue('notes', findSlot?.notes || '');
      }

      form.resetDirty();
    } else if (!findSlot) {
      if (!form.isDirty('scheduleRecipes')) {
        form.setFieldValue('scheduleRecipes', [CBlankScheduleRecipe]);
      }

      if (!form.isDirty('notes')) {
        form.setFieldValue('notes', '');
      }

      form.resetDirty();
    }
  };

  const checkIsEdit = (payload: ISchedule[] | undefined): boolean => {
    const slotItems = (payload || [schedule] || []).filter((sched) => sched.timeSlot === form.getValues().timeSlot);
    return !!slotItems.length && !!slotItems[0].scheduleRecipes.length;
  };

  return (
    <Modal
      opened={isOpen}
      onClose={closeModal}
      transitionProps={{ transition: 'slide-left' }}
      withCloseButton={true}
      closeButtonProps={{ 'aria-label': 'Close' }}
      size="lg"
      aria-label={'Schedule'}
      title={`${isEdit ? 'Edit' : 'Create a'} schedule`}
      className="schedule--modal"
    >
      {isDayScheduleLoading ? (
        <Loader />
      ) : (
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
              key={form.key(`timeSlot`)}
              {...form.getInputProps('timeSlot')}
              onChange={timeSlotChange}
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
      )}
    </Modal>
  );
};

export default ScheduleModal;
