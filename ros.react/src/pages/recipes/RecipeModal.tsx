import { Plural } from '@components/plural/Plural';
import { IRecipeIngredient } from '@domain/recipe-ingredient.dto';
import { IRecipeShort } from '@domain/recipe.dto';
import { useGetRecipeQuery } from '@features/api/apiSlice';
import { ActionIcon, Badge, Chip, Flex, Group, Image, SimpleGrid, Space, Spoiler, Stack, Title } from '@mantine/core';
import { fractionNumber } from '@utils/numberUtils';
import { parseRecipeInstructions, sentenceCase } from '@utils/stringUtils';
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
          <Group gap="xs">
            {data?.dishType.map((dish, index) => (
              <Chip key={index}>{sentenceCase(dish)}</Chip>
            ))}
          </Group>
          <Space h="md" />
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
          <Space h="md" />

          <Spoiler maxHeight={56} showLabel="Show more" hideLabel="Hide">
            {parse(recipeShort.summary)}
          </Spoiler>
          <Space h="md" />

          <Title order={3}>Diets</Title>
          <Space h="xs" />
          <Group gap="xs">
            {data?.diets.map((diet, index) => (
              <Chip key={index}>{sentenceCase(diet)}</Chip>
            ))}
          </Group>
          <Space h="md" />

          <Title order={3}>Ingredients</Title>
          <Space h="xs" />
          {data && (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md" verticalSpacing="md">
              {data.ingredientList.map((ri: IRecipeIngredient) => (
                <Flex key={ri.id} align="center" direction="row" gap="xs">
                  <Image
                    height={40}
                    src={`https://img.spoonacular.com/ingredients_100x100/${ri.ingredient.image}`}
                    alt={ri.ingredient.name}
                  />

                  <div>
                    {parse(fractionNumber(ri.amount))} <b>{ri.measure.shortName}</b> {sentenceCase(ri.ingredient.name)}
                  </div>
                </Flex>
              ))}
            </SimpleGrid>
          )}
          <Space h="md" />

          <Title order={3}>Equipment</Title>
          <Space h="xs" />
          <Group gap="xs">
            {data?.equipment.map((item, index) => (
              <Chip key={index}>{sentenceCase(item)}</Chip>
            ))}
          </Group>
          <Space h="md" />

          <Title order={3}>Instructions</Title>
          <Space h="xs" />
          {data &&
            (() => {
              if (data.steppedInstructions?.length && data.steppedInstructions[0].stepNumber === 1) {
                return (
                  <Stack>
                    {data.steppedInstructions.map((item) => (
                      <Flex direction="row" align="center" gap="xs" key={item.id}>
                        <Badge circle>{item.stepNumber}</Badge>
                        <div>{parse(item.step)}</div>
                      </Flex>
                    ))}
                  </Stack>
                );
              }

              return (
                <Stack>
                  {parseRecipeInstructions(data.instructions).map((instruction, index) => (
                    <Flex direction="row" align="center" gap="xs" key={index}>
                      <Badge circle>{index + 1}</Badge>
                      <div>{parse(instruction || '')}</div>
                    </Flex>
                  ))}
                </Stack>
              );
            })()}
        </div>
      </div>
    </>
  );
};

export default RecipeModal;
