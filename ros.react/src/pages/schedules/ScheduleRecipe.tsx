import { CRoutes } from '@app/routes.const';
import { ISchedule, IScheduleRecipe } from '@domain/schedule.dto';
import { useDeleteScheduleMutation, useSaveScheduleMutation } from '@features/api/apiSlice';
import { ActionIcon, Avatar, Flex, Group, HoverCard, Stack, Text } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import parse from 'html-react-parser';
import { Trash2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

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
          <HoverCard width={320} shadow="md" withArrow openDelay={200} closeDelay={400}>
            <HoverCard.Target>
              <Flex gap="xs">
                <b>{recipe.quantity}</b>
                <span>{recipe.recipeName}</span>
              </Flex>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Group wrap="nowrap">
                {recipe.recipeImage && (
                  <Avatar src={recipe.recipeImage} radius="xl" size="lg" aria-label={recipe.recipeName} />
                )}
                <Stack gap="xs">
                  <NavLink to={`../${CRoutes.recipe}/${recipe.recipeId}`} aria-label={recipe.recipeName}>
                    <Text size="sm" fw={700}>
                      {recipe.recipeName}
                    </Text>
                  </NavLink>
                  <Text c="dimmed" size="xs">
                    {recipe.servings} Servings
                  </Text>
                </Stack>
              </Group>
              {recipe.shortSummary && (
                <Text size="sm" mt="md">
                  {parse(recipe.shortSummary)}
                </Text>
              )}
            </HoverCard.Dropdown>
          </HoverCard>

          <Flex className="recipe-item--actions">
            <ActionIcon
              color="var(--muted-text)"
              variant="transparent"
              title="Remove item from this slot"
              className="recipe-item--actions__delete"
              onClick={() => confirmRemoveRecipeFromSlot(slotItem, recipe)}
            >
              <Trash2 size={16} />
            </ActionIcon>
          </Flex>
        </Flex>
      ))}
    </>
  );
};

export default ScheduleRecipe;
