import { useAppDispatch } from '@app/hooks';
import { setCurrentSchedule } from '@components/GlobalNavigation/globalModal.slice';
import { Plural } from '@components/plural/Plural';
import { IRecipeShort } from '@domain/recipe.dto';
import { ETimeSlot } from '@domain/schedule.dto';
import { Button, Card, Flex, Group, Image, Space, Text, Title, Tooltip } from '@mantine/core';
import { getIncrementedDateIndex } from '@utils/dateUtils';
import parse from 'html-react-parser';
import { Eye, Plus, Timer, UserRound } from 'lucide-react';

const RecipeCard = ({
  recipe,
  openModal
}: {
  recipe: IRecipeShort;
  openModal: (recipeShort: IRecipeShort) => void;
}) => {
  const iconSize = 16;
  const dispatch = useAppDispatch();
  const viewRecipe = () => {
    openModal(recipe);
  };

  const newScheduleItem = () => {
    dispatch(
      setCurrentSchedule({
        date: getIncrementedDateIndex(1),
        timeSlot: ETimeSlot.BREAKFAST,
        scheduleRecipes: [
          {
            recipeId: recipe.id || '',
            quantity: 1,
            recipeName: recipe.name,
            shortSummary: recipe.shortSummary,
            recipeImage: recipe.images[0],
            servings: recipe.servings
          }
        ],
        notes: ''
      })
    );
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="recipe-card">
      <Card.Section>
        <Image src={recipe.images[0]} height={320} alt={recipe.name} />
      </Card.Section>
      <Space h="xs" />
      <Group className="text-muted" justify="flex-end">
        <Flex align="center" gap="sm">
          <Timer size={iconSize} />
          <span>
            {recipe.readyInMinutes}
            <Plural text="min" num={recipe.readyInMinutes} />
          </span>
        </Flex>
        <Flex align="center" gap="sm">
          <UserRound size={iconSize} />
          <span>
            {recipe.servings} <Plural text="serving" num={recipe.servings} />
          </span>
        </Flex>
      </Group>
      <Tooltip label={recipe.name}>
        <Title order={2} lineClamp={2} className="recipe-card--title">
          {recipe.name}
        </Title>
      </Tooltip>

      <Text lineClamp={3} size="sm">
        {parse(recipe.shortSummary)}
      </Text>
      <Space h="lg" />
      <Flex gap="sm" className="recipe-card--buttons">
        <Button type="button" onClick={newScheduleItem} leftSection={<Plus size={iconSize} />}>
          Schedule
        </Button>
        <Button type="button" variant="outline" onClick={viewRecipe} leftSection={<Eye size={iconSize} />}>
          View
        </Button>
      </Flex>
    </Card>
  );
};

export default RecipeCard;
