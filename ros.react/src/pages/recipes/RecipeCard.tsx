import { IRecipeShort } from '@domain/recipe.dto';
import { Card, Image } from '@mantine/core';
import parse from 'html-react-parser';

const RecipeCard = ({ recipe }: { recipe: IRecipeShort }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={recipe.images[0]} height={200} alt={recipe.name} />
      </Card.Section>
      <h2>{recipe.name}</h2>
      <p>{parse(recipe.shortSummary)}</p>
    </Card>
  );
};

export default RecipeCard;
