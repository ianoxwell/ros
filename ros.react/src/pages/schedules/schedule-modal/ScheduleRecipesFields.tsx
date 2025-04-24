import { IScheduleRecipe } from '@domain/schedule.dto';
import { ActionIcon, Flex, NumberInput } from '@mantine/core';
import { Trash } from 'lucide-react';
import SuggestionAutoComplete from './SuggestionAutoComplete';
import { useScheduleFormContext } from './scheduleModalForm.context';

const ScheduleRecipesFields = ({ item, index }: { item: IScheduleRecipe; index: number }) => {
  const form = useScheduleFormContext();
  return (
    <Flex gap="sm" align="flex-end" mt="xs">
      <NumberInput
        label="Prepare Qty"
        placeholder="Whole number"
        className="schedule--modal__quantity"
        allowNegative={false}
        allowDecimal={false}
        withAsterisk
        min={1}
        max={100}
        key={form.key(`scheduleRecipes.${index}.quantity`)}
        {...form.getInputProps(`scheduleRecipes.${index}.quantity`)}
        onChange={(value: number | string) =>
          form.replaceListItem('scheduleRecipes', index, { ...item, quantity: Number(value) })
        }
      />
      <SuggestionAutoComplete
        item={item}
        onSelectionChange={(id, name) => {
          form.replaceListItem('scheduleRecipes', index, { ...item, recipeId: id, recipeName: name });
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

export default ScheduleRecipesFields;
