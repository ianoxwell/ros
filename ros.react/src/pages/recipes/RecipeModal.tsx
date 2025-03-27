import { CImageUrl } from '@app/routes.const';
import { Plural } from '@components/plural/Plural';
import { IRecipeIngredient } from '@domain/recipe-ingredient.dto';
import { useGetRecipeQuery } from '@features/api/apiSlice';
import {
  ActionIcon,
  Avatar,
  Badge,
  Chip,
  Flex,
  Group,
  Image,
  Modal,
  SimpleGrid,
  Space,
  Spoiler,
  Stack,
  Title
} from '@mantine/core';
import { fractionNumber } from '@utils/numberUtils';
import { parseRecipeInstructions, sentenceCase } from '@utils/stringUtils';
import parse from 'html-react-parser';
import { ChevronLeft, Heart, Timer, UserRound } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const RecipeModal = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetRecipeQuery(id, { skip: !id });
  const heartRecipe = () => {
    // TODO favourite/update the recipe
    console.log('should probably write something for this in the api');
  };

  const closeModal = () => {
    navigate('/');
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
      aria-label={data?.name || 'Recipe'}
    >
      {isLoading || !data ? (
        <p>Loading...</p>
      ) : (
        <div className="recipe-modal">
          <Image src={data.images[0]} height={420} alt={data.name} />
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

            <Title order={2}>{data.name}</Title>
            <Space h="xs" />
            {data?.dishType?.length && (
              <>
                <Group gap="xs">
                  {data?.dishType.map((dish, index) => (
                    <Chip key={index}>{sentenceCase(dish)}</Chip>
                  ))}
                </Group>
                <Space h="md" />
              </>
            )}

            {data?.cuisineType?.length && (
              <>
                <Group gap="xs">
                  {data?.cuisineType.map((cuisine, index) => (
                    <Chip key={index}>{sentenceCase(cuisine)}</Chip>
                  ))}
                </Group>
                <Space h="md" />
              </>
            )}

            <Flex direction="row" gap="md">
              <Group gap="xs">
                <Timer size={16} />
                <span>
                  {data.readyInMinutes}
                  <Plural text="min" num={data.readyInMinutes} />
                </span>
              </Group>
              <Group gap="xs">
                <UserRound size={16} />
                <span>
                  {data.servings} <Plural text="serving" num={data.servings} />
                </span>
              </Group>
              {/* Add in the health score */}
              {/* Add in the number of likes? */}
            </Flex>
            <Space h="md" />

            <Spoiler maxHeight={56} showLabel="Show more" hideLabel="Hide">
              {parse(data.summary)}
            </Spoiler>
            <Space h="xl" />

            {data?.diets?.length && (
              <>
                <Title order={3}>Diets</Title>
                <Space h="xs" />
                <Group gap="xs">
                  {data.diets.map((diet, index) => (
                    <Chip key={index}>{sentenceCase(diet)}</Chip>
                  ))}
                </Group>
                <Space h="xl" />
              </>
            )}
            {data && (
              <>
                <Title order={3}>Ingredients</Title>
                <Space h="xs" />
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md" verticalSpacing="md">
                  {data.ingredientList.map((ri: IRecipeIngredient) => (
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

            {data?.equipment?.length && (
              <>
                {' '}
                <Title order={3}>Equipment</Title>
                <Space h="xs" />
                <Group gap="xs">
                  {data?.equipment.map((item, index) => (
                    <Chip key={index}>{sentenceCase(item.name)}</Chip>
                  ))}
                </Group>
                <Space h="xl" />
              </>
            )}

            {data?.instructions && (
              <>
                <Title order={3}>Instructions</Title>
                <Space h="xs" />
                {data &&
                  (() => {
                    if (data.steppedInstructions?.length && data.steppedInstructions[0].stepNumber === 1) {
                      return (
                        <Stack>
                          {data.steppedInstructions.map((item, index) => (
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
                        {parseRecipeInstructions(data.instructions).map((instruction, index) => (
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
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RecipeModal;
