import { ISchedule, IScheduleRecipe } from '@domain/schedule.dto';
import { ActionIcon, Flex } from '@mantine/core';
import { Trash } from 'lucide-react';

const ScheduleRecipe = ({ scheduleRecipes, slotItem }: { scheduleRecipes: IScheduleRecipe[]; slotItem: ISchedule }) => {
  const removeRecipeFromSlot = (schedule: ISchedule, recipe: IScheduleRecipe) => {
    console.log('should remove and save the schedule', schedule, recipe);
    // todo display a confirmation modal
  };
  return (
    <>
      {scheduleRecipes.map((recipe: IScheduleRecipe) => (
        <Flex gap="sm" justify="space-between" align="center" className="recipe-item">
          <Flex gap="xs">
            <b>{recipe.quantity}</b>
            <span>{recipe.recipeName}</span>
          </Flex>
          <Flex className="recipe-item--actions">
            <ActionIcon
              color="var(--burnt-orange)"
              title="Remove item from this slot"
              onClick={() => removeRecipeFromSlot(slotItem, recipe)}
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
