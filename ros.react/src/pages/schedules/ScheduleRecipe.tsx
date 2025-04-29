import { ISchedule, IScheduleRecipe } from '@domain/schedule.dto';
import { useDeleteScheduleMutation, useSaveScheduleMutation } from '@features/api/apiSlice';
import { ActionIcon, Flex, Text } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { Trash } from 'lucide-react';

const ScheduleRecipe = ({ scheduleRecipes, slotItem }: { scheduleRecipes: IScheduleRecipe[]; slotItem: ISchedule }) => {
  const [saveSchedule] = useSaveScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();
  
  const confirmRemoveRecipeFromSlot = (schedule: ISchedule, recipe: IScheduleRecipe) => {
    modals.openConfirmModal({
      title: 'Please confirm removing recipe',
      children: (
        <Text size="sm">
          Confirm that you would like to remove{' '}
          <b>
            {recipe.quantity} {recipe.recipeName}
          </b>{' '}
          from {schedule.timeSlot} on {dayjs(schedule.date).format('MMMM D, YYYY')}?
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      closeButtonProps: { 'aria-label': 'Close' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => removeRecipeFromSchedule(schedule, recipe)
    });
  };

  const removeRecipeFromSchedule = async (schedule: ISchedule, recipe: IScheduleRecipe) => {
    console.log('should remove something?', schedule);
    if (!schedule.id) {
      return;
    }

    if (schedule.scheduleRecipes.length <= 1) {
      const result = await deleteSchedule(schedule.id).unwrap();
      console.log('delete result', result);
    } else {
      const updatedSchedule = {
        ...schedule,
        scheduleRecipes: schedule.scheduleRecipes.filter((item) => item.id !== recipe.id)
      };
      console.log('updated sched', updatedSchedule);
      await saveSchedule(updatedSchedule).unwrap();
      notifications.show({
        title: 'Success',
        color: 'green',
        message: `Recipe(s) removed from ${schedule.timeSlot}.`
      });
    }
  };

  return (
    <>
      {scheduleRecipes.map((recipe: IScheduleRecipe) => (
        <Flex gap="sm" justify="space-between" align="center" className="recipe-item" key={recipe.id || randomId()}>
          <Flex gap="xs">
            <b>{recipe.quantity}</b>
            <span>{recipe.recipeName}</span>
          </Flex>
          <Flex className="recipe-item--actions">
            <ActionIcon
              color="var(--burnt-orange)"
              title="Remove item from this slot"
              onClick={() => confirmRemoveRecipeFromSlot(slotItem, recipe)}
            >
              <Trash size={16} />
            </ActionIcon>
          </Flex>
        </Flex>
      ))}
    </>
  );
};

export default ScheduleRecipe;
