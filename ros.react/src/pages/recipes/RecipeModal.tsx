import { Plural } from '@components/plural/Plural';
import { IIngredient } from '@domain/ingredient.dto';
import { IRecipeShort } from '@domain/recipe.dto';
import { useGetRecipeQuery } from '@features/api/apiSlice';
import { ActionIcon, Flex, Group, Image, List, Space, Spoiler, Title } from '@mantine/core';
import parse from 'html-react-parser';
import { ChevronLeft, Heart, Timer, UserRound } from 'lucide-react';

const RecipeModal = ({ recipeShort, closeModal }: { recipeShort: IRecipeShort; closeModal: () => void }) => {
  const { data, isLoading } = useGetRecipeQuery(recipeShort.id || 0);
  const heartRecipe = () => {
    console.log('should probably write something for this in the api');
  };

  return (
    <>
      <div className="recipe-modal">
        <Image src={recipeShort.images[0]} height={420} alt={recipeShort.name} />
        <div className="flex-float-header">
          <ActionIcon
            type="button"
            size="xl"
            aria-label="back"
            onClick={closeModal}
            variant="white"
            color="dark.6"
            radius="xl"
          >
            <ChevronLeft size={28} />
          </ActionIcon>
        </div>
        <div className="recipe-modal--contents">
          {/* <ScrollArea h={250} offsetScrollbars> */}
          <Flex justify="flex-end" className="favorite-recipe">
            <ActionIcon
              type="button"
              size="xl"
              title="Favorite this recipe"
              onClick={heartRecipe}
              variant="white"
              color="dark.6"
              radius="xl"
              className="favorite-recipe--icon"
            >
              <Heart size={28} />
            </ActionIcon>
          </Flex>

          <Title order={2}>{recipeShort.name}</Title>
          <Space h="xs" />
          <Flex direction="row" gap="md">
            <Group gap="xs">
              <Timer size={16} />
              <span>
                {recipeShort.readyInMinutes}
                <Plural text="min" num={recipeShort.readyInMinutes} />
              </span>
            </Group>
            <Group gap="xs">
              <UserRound size={16} />
              <span>
                {recipeShort.servings} <Plural text="serving" num={recipeShort.servings} />
              </span>
            </Group>
            {/* Add in the health score */}
            {/* Add in the number of likes? */}
          </Flex>
          {/* Add in the health labels chips */}
          <Space h="xs" />
          <Spoiler maxHeight={56} showLabel="Show more" hideLabel="Hide">
            {parse(recipeShort.summary)}
          </Spoiler>
          <Space h="md" />

          <Title order={3}>Ingredients</Title>
          {data && (
            <List>
              {data.ingredients.map((ingredient: IIngredient) => (
                <List.Item key={ingredient.id}>{ingredient.name}</List.Item>
                // TODO add in the quantities
              ))}
            </List>
          )}
        {/* Add in List of equipment */}

          {/* TODO add in the instructions etc */}
          {/* @if (selectedRecipe.steppedInstructions) {
          <mat-list>
            @for (item of selectedRecipe.steppedInstructions; track item) {
              <mat-list-item>
                <div class="flex-box flex-row p-1">
                  <span class="text-small text-muted mr-2 w-7 align-self-center">Step {{ item.stepNumber }}</span>
                  <span [innerHTML]="item.step | safeHtml"></span>
                </div>
                <mat-divider></mat-divider>
              </mat-list-item>
            }
          </mat-list>
        } @else {
          <div [innerHTML]="selectedRecipe.instructions"></div>
        } */}
        </div>
      </div>
    </>
  );
};

export default RecipeModal;
