import { IRecipeShort } from '@domain/recipe.dto';
import { Card, Image, Text, Title } from '@mantine/core';
import parse from 'html-react-parser';

const RecipeCard = ({ recipe }: { recipe: IRecipeShort }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className='recipe-card'>
      <Card.Section>
        <Image src={recipe.images[0]} height={256} alt={recipe.name} />
      </Card.Section>
      <Title order={2} lineClamp={2} className='recipe-card--title'>{recipe.name}</Title>
      <Text lineClamp={3}>{parse(recipe.shortSummary)}</Text>
    </Card>
  );
};

export default RecipeCard;
