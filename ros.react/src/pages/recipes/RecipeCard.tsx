import { Plural } from '@components/plural/Plural';
import { IRecipeShort } from '@domain/recipe.dto';
import { Button, Card, Flex, Group, Image, Space, Text, Title, Tooltip } from '@mantine/core';
import parse from 'html-react-parser';
import { Timer, UserRound } from 'lucide-react';

const RecipeCard = ({ recipe, openModal }: { recipe: IRecipeShort; openModal: (recipeShort: IRecipeShort) => void }) => {
  const viewRecipe = () => {
    console.log('time to view this recipe', recipe.id);
    openModal(recipe);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="recipe-card">
      <Card.Section>
        <Image src={recipe.images[0]} height={320} alt={recipe.name} />
      </Card.Section>
      <Space h="xs" />
      <Group className="text-muted" justify="flex-end">
        <Flex align="center" gap="sm">
          <Timer size={16} />
          <span>
            {recipe.readyInMinutes}
            <Plural text="min" num={recipe.readyInMinutes} />
          </span>
        </Flex>
        <Flex align="center" gap="sm">
          <UserRound size={16} />
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
      <Button type="button" variant="outline" onClick={viewRecipe}>
        View Recipe
      </Button>
    </Card>
  );
};

export default RecipeCard;
