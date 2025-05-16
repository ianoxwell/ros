import { useAppDispatch } from '@app/hooks';
import { CImageUrl } from '@app/routes.const';
import { setCurrentSchedule } from '@components/GlobalNavigation/globalModal.slice';
import { Plural } from '@components/plural/Plural';
import { IRecipeIngredient } from '@domain/recipe-ingredient.dto';
import { ETimeSlot } from '@domain/schedule.dto';
import { calculateRdaPercent, CMacroNutrientRda, CVitaminsMinerals } from '@domain/vitamin-mineral-const';
import { useGetRecipeQuery } from '@features/api/apiSlice';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Chip,
  Divider,
  Flex,
  Group,
  Image,
  Modal,
  SimpleGrid,
  Space,
  Spoiler,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { getIncrementedDateIndex } from '@utils/dateUtils';
import { fixWholeNumber, fractionNumber } from '@utils/numberUtils';
import { parseRecipeInstructions, sentenceCase } from '@utils/stringUtils';
import parse from 'html-react-parser';
import { ChevronLeft, Heart, Plus, Timer, UserRound } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const RecipeModal = () => {
  const base = import.meta.env.VITE_BASE_URL;
  const iconSize = 16;
  const iconPlusSize = 28;
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { data: recipe, isLoading } = useGetRecipeQuery(id, { skip: !id });
  const dispatch = useAppDispatch();
  const heartRecipe = () => {
    // TODO favourite/update the recipe
    console.log('should probably write something for this in the api');
  };

  const closeModal = () => {
    navigate(base);
  };

  const newScheduleItem = () => {
    if (!recipe) return;

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

  if (!id) return null;

  return (
    <Modal
      opened={!!id}
      onClose={closeModal}
      transitionProps={{ transition: 'slide-left' }}
      fullScreen
      radius={0}
      withCloseButton={false}
      padding={0}
      aria-label={recipe?.name || 'Recipe'}
    >
      {isLoading || !recipe ? (
        <p>Loading...</p>
      ) : (
        <div className="recipe-modal">
          <Image src={recipe.images[0]} height={420} alt={recipe.name} />
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
              <ChevronLeft size={iconPlusSize} />
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
                <Heart size={iconPlusSize} />
              </ActionIcon>
            </Flex>
            <Title order={2}>{recipe.name}</Title>
            <Space h="xs" />
            {!!recipe?.dishType?.length && (
              <>
                <Group gap="xs">
                  {recipe?.dishType.map((dish, index) => (
                    <Chip key={index}>{sentenceCase(dish)}</Chip>
                  ))}
                </Group>
                <Space h="md" />
              </>
            )}
            {!!recipe?.cuisineType?.length && (
              <>
                <Group gap="xs">
                  {recipe?.cuisineType.map((cuisine, index) => (
                    <Chip key={index}>{sentenceCase(cuisine)}</Chip>
                  ))}
                </Group>
                <Space h="md" />
              </>
            )}
            <Flex direction="row" gap="md">
              <Group gap="xs">
                <Timer size={iconSize} />
                <span>
                  {recipe.readyInMinutes}
                  <Plural text="min" num={recipe.readyInMinutes} />
                </span>
              </Group>
              <Group gap="xs">
                <UserRound size={iconSize} />
                <span>
                  {recipe.servings} <Plural text="serving" num={recipe.servings} />
                </span>
              </Group>
              {/* Add in the health score */}
              {/* Add in the number of likes? */}
            </Flex>
            <Space h="md" />
            <Spoiler maxHeight={56} showLabel="Show more" hideLabel="Hide">
              {parse(recipe.summary)}
            </Spoiler>
            <Space h="xl" />
            {!!recipe?.diets?.length && (
              <>
                <Title order={3}>Diets</Title>
                <Space h="xs" />
                <Group gap="xs">
                  {recipe.diets.map((diet, index) => (
                    <Chip key={index}>{sentenceCase(diet)}</Chip>
                  ))}
                </Group>
                <Space h="xl" />
              </>
            )}
            {recipe && (
              <>
                <Title order={3}>Ingredients</Title>
                <Space h="xs" />
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md" verticalSpacing="md">
                  {recipe.ingredientList.map((ri: IRecipeIngredient) => (
                    <Flex key={ri.id} align="center" direction="row" gap="xs">
                      <Image height={40} src={`${CImageUrl}${ri.ingredient.image}`} alt={ri.ingredient.name} />

                      <div>
                        {parse(fractionNumber(ri.amount))} <b>{ri.measure.shortName}</b>{' '}
                        {sentenceCase(ri.ingredient.name)}
                      </div>
                    </Flex>
                  ))}
                </SimpleGrid>
                <Space h="xl" />
              </>
            )}
            {!!recipe?.equipment?.length && (
              <>
                {' '}
                <Title order={3}>Equipment</Title>
                <Space h="xs" />
                <Group gap="xs">
                  {recipe?.equipment.map((item, index) => (
                    <Chip key={index}>{sentenceCase(item.name)}</Chip>
                  ))}
                </Group>
                <Space h="xl" />
              </>
            )}
            {recipe?.instructions && (
              <>
                <Title order={3}>Instructions</Title>
                <Space h="xs" />
                {recipe &&
                  (() => {
                    if (!!recipe.steppedInstructions?.length && recipe.steppedInstructions[0].stepNumber === 1) {
                      return (
                        <Stack>
                          {recipe.steppedInstructions.map((item, index) => (
                            <Flex direction="row" align="center" gap="xs" key={index}>
                              <Avatar className="step-badge" size="md" radius="xl">
                                {item.stepNumber}
                              </Avatar>
                              <div>{parse(item.step)}</div>
                            </Flex>
                          ))}
                        </Stack>
                      );
                    }

                    return (
                      <Stack>
                        {parseRecipeInstructions(recipe.instructions).map((instruction, index) => (
                          <Flex direction="row" align="center" gap="xs" key={index}>
                            <Badge circle>{index + 1}</Badge>
                            <div>{parse(instruction || '')}</div>
                          </Flex>
                        ))}
                      </Stack>
                    );
                  })()}
              </>
            )}
            <Space h="xl" />

            {!!recipe.nutrition && (
              <Center>
                <section className="nutrition-facts">
                  <Title order={2}>Nutrition facts</Title>
                  <Text size="sm">Amount per serving</Text>
                  <Flex justify="space-between">
                    <Title order={3}>Calories</Title>
                    <Title order={3}>{fixWholeNumber(recipe.nutrition.nutrients.calories, 0)}</Title>
                  </Flex>
                  <Divider size="md" />

                  <Flex justify="flex-end">
                    <b>% Daily Value*</b>
                  </Flex>
                  <Divider size="xs" />

                  <Flex justify="space-between">
                    <span>
                      <b>Total fat</b> {fixWholeNumber(recipe.nutrition.nutrients.fat, 1)} g
                    </span>
                    <span>
                      {calculateRdaPercent(
                        CMacroNutrientRda.fat.rda,
                        recipe.nutrition.nutrients.fat / recipe.servings || 0
                      )}
                      %
                    </span>
                  </Flex>
                  <Divider size="xs" />

                  <Flex justify="flex-start">
                    <Box w={24} />
                    <span>Saturated fat {fixWholeNumber(recipe.nutrition.nutrients.saturatedFat, 1)} g</span>
                  </Flex>
                  <Divider size="xs" />

                  <Flex justify="space-between">
                    <span>
                      <b>Cholesterol</b> {fixWholeNumber(recipe.nutrition.nutrients.cholesterol, 1)} mg
                    </span>
                  </Flex>
                  <Divider size="xs" />

                  <Flex justify="space-between">
                    <span>
                      <b>Total carbohydrate</b> {fixWholeNumber(recipe.nutrition.nutrients.carbohydrates, 1)} g
                    </span>
                    <span>
                      {calculateRdaPercent(
                        CMacroNutrientRda.carbohydrates.rda,
                        recipe.nutrition.nutrients.carbohydrates / recipe.servings || 0
                      )}
                      %
                    </span>
                  </Flex>
                  <Divider size="xs" />

                  <Flex justify="flex-start">
                    <Box w={24} />
                    <span>Dietary fiber {fixWholeNumber(recipe.nutrition.nutrients.fiber, 1)} g</span>
                  </Flex>
                  <Divider size="xs" />
                  <Flex justify="flex-start">
                    <Box w={24} />
                    <span>Total sugars {fixWholeNumber(recipe.nutrition.nutrients.sugar, 1)} g</span>
                  </Flex>
                  <Divider size="xs" />
                  <Flex justify="space-between">
                    <span>
                      <b>Protein</b> {fixWholeNumber(recipe.nutrition.nutrients.protein, 1)} g
                    </span>
                    <span>
                      {calculateRdaPercent(
                        CMacroNutrientRda.protein.rda,
                        recipe.nutrition.nutrients.protein / recipe.servings || 0
                      )}
                      %
                    </span>
                  </Flex>
                  <Divider size="lg" />
                  <Flex justify="space-between">
                    <span>
                      Vitamin D {fixWholeNumber(recipe.nutrition.vitamins.vitaminD, 1)}{' '}
                      {CVitaminsMinerals.vitaminD.measure}
                    </span>
                    <span>
                      {calculateRdaPercent(
                        CVitaminsMinerals.vitaminD.rda,
                        recipe.nutrition.vitamins.vitaminD / recipe.servings || 0
                      )}
                      %
                    </span>
                  </Flex>
                  <Divider size="xs" />
                  <Flex justify="space-between">
                    <span>
                      Calcium {fixWholeNumber(recipe.nutrition.minerals.calcium, 1)} {CVitaminsMinerals.calcium.measure}
                    </span>
                    <span>
                      {calculateRdaPercent(
                        CVitaminsMinerals.calcium.rda,
                        recipe.nutrition.minerals.calcium / recipe.servings || 0
                      )}
                      %
                    </span>
                  </Flex>
                  <Divider size="xs" />
                  <Flex justify="space-between">
                    <span>
                      Iron {fixWholeNumber(recipe.nutrition.minerals.iron, 1)} {CVitaminsMinerals.iron.measure}
                    </span>
                    <span>
                      {calculateRdaPercent(
                        CVitaminsMinerals.iron.rda,
                        recipe.nutrition.minerals.iron / recipe.servings || 0
                      )}
                      %
                    </span>
                  </Flex>
                  <Divider size="xs" />
                  <Flex justify="space-between">
                    <span>
                      Potassium {fixWholeNumber(recipe.nutrition.minerals.potassium, 1)}{' '}
                      {CVitaminsMinerals.potassium.measure}
                    </span>
                    <span>
                      {calculateRdaPercent(
                        CVitaminsMinerals.potassium.rda,
                        recipe.nutrition.minerals.potassium / recipe.servings || 0
                      )}
                      %
                    </span>
                  </Flex>
                  <Divider size="xs" />

                  <Text size="sm">
                    *The % Daily Value (DV) tells you how much a nutrient in a food serving contributes to a daily diet.
                    2,000 calorie a day is used for general nutrition advice.
                  </Text>
                </section>
              </Center>
            )}

            {/* Close button */}
            <Group justify="flex-end" mt="lg">
              <Flex gap="xs">
                <Button onClick={newScheduleItem} type="button" leftSection={<Plus size={iconSize} />}>
                  Schedule
                </Button>
                <Button variant="outline" onClick={closeModal} type="button">
                  Close
                </Button>
              </Flex>
            </Group>
            <Space h="xl" />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RecipeModal;
