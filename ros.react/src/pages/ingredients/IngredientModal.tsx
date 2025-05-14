import { CImageUrlLarge, CRoutes } from '@app/routes.const';
import { calculateRdaPercent, CMacroNutrientRda } from '@domain/vitamin-mineral-const';
import { useGetIngredientQuery } from '@features/api/apiSlice';
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  HoverCard,
  Image,
  List,
  Modal,
  SimpleGrid,
  Space,
  Title
} from '@mantine/core';
import { fixWholeNumber } from '@utils/numberUtils';
import { sentenceCase } from '@utils/stringUtils';
import parse from 'html-react-parser';
import { ChevronLeft } from 'lucide-react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import NutritionCurveLeft from './nutritionCurveLeft';
import NutritionCurveRight from './nutritionCurveRight';
import NutritionText from './NutritionText.component';

const IngredientModal = () => {
  const base = import.meta.env.VITE_BASE_URL;

  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { data: ingredient, isLoading } = useGetIngredientQuery(id, { skip: !id });

  const closeModal = () => {
    navigate(`${base}${CRoutes.ingredients}`);
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
      aria-label={sentenceCase(ingredient?.name || 'Ingredient')}
    >
      {isLoading || !ingredient ? (
        <p>Loading...</p>
      ) : (
        <div className="ingredient-modal">
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
          <Title order={2} className="ingredient-modal--title">
            {sentenceCase(ingredient.name)}
          </Title>
          <Space h="xl" />
          <div>
            Typically found in <b>{sentenceCase(ingredient.aisle)}</b> aisle
          </div>
          <Flex direction="column" justify="center" align="center">
            <Title order={3}>Nutrition</Title>
            <Flex gap="md">
              <div className="vitamins title">Vitamins</div>
              <Flex className="calories title" direction="column" align="center">
                <div>Calories</div>
                <span>{fixWholeNumber(ingredient.nutrition?.nutrients.calories)} kcal</span>
              </Flex>
              <div className="minerals title">Minerals</div>
            </Flex>
            <Flex direction="row" align="center">
              <NutritionCurveLeft />
              <Image
                alt={ingredient.name}
                h={320}
                w={320}
                fit="contain"
                className="nutrition-image"
                src={`${CImageUrlLarge}${ingredient.image}`}
              />
              <NutritionCurveRight />
            </Flex>
            <div className="nutrition-parent">
              <div className="vitamins">
                <div className="nutrition--text left">
                  <NutritionText data={ingredient.nutrition?.vitamins} reverse={false} />
                </div>
              </div>
              <div className="minerals">
                <div className="nutrition--text">
                  <NutritionText data={ingredient.nutrition?.minerals} reverse />
                </div>
              </div>
            </div>
            <div className="serving-size-label">Serving size: 100 g</div>
            <Space h="xl" />
            <Flex direction="row" gap="xl" className="nutrition-summary">
              <div>
                <Title order={4}>Protein</Title>
                <span>
                  {fixWholeNumber(ingredient.nutrition?.nutrients.protein, 2)} g (
                  {calculateRdaPercent(CMacroNutrientRda.protein.rda, ingredient.nutrition?.nutrients.protein || 0)}%
                  rda)
                </span>
              </div>
              <div>
                <Title order={4}>Carbohydrates</Title>
                <span>
                  {fixWholeNumber(ingredient.nutrition?.nutrients.carbohydrates, 1)} g (
                  {calculateRdaPercent(
                    CMacroNutrientRda.carbohydrates.rda,
                    ingredient.nutrition?.nutrients.carbohydrates || 0
                  )}
                  % rda)
                </span>
              </div>
              <div>
                <Title order={4}>Fat</Title>
                <span>
                  {fixWholeNumber(ingredient.nutrition?.nutrients.fat, 1)} g (
                  {calculateRdaPercent(CMacroNutrientRda.fat.rda, ingredient.nutrition?.nutrients.fat || 0)}% rda)
                </span>
              </div>
              <div>
                <Title order={4}>Dietary fibre</Title>
                <span>
                  {fixWholeNumber(ingredient.nutrition?.nutrients.fiber, 1)} g (
                  {calculateRdaPercent(CMacroNutrientRda.fiber.rda, ingredient.nutrition?.nutrients.fiber || 0)}%
                  rda)
                </span>
              </div>
            </Flex>
          </Flex>
          <Space h="lg" />

          {!!ingredient.conversions?.length && (
            <section>
              <Title order={2}>Typical conversions in grams</Title>
              <List>
                {ingredient.conversions.map((convert, index) => (
                  <List.Item key={index}>{convert.answer}</List.Item>
                ))}
              </List>
            </section>
          )}
          <Space h="lg" />

          {ingredient.recipes?.length && (
            <section>
              <Title order={2}>Recipes</Title>
              <SimpleGrid cols={{ base: 3, md: 4, lg: 5, xl: 6 }} spacing="md" verticalSpacing="md">
                {ingredient.recipes.map((recipe) => (
                  <HoverCard width={320} shadow="md" key={recipe.id}>
                    <HoverCard.Target>
                      <NavLink to={`/${CRoutes.recipe}/${recipe.id}`} aria-label={recipe.name}>
                        <Flex direction="column">
                          <Image src={recipe.images} alt={recipe.name} h="180" radius="md" />
                          <div className="recipe-title">{recipe.name}</div>
                        </Flex>
                      </NavLink>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>{parse(recipe.summary)}</HoverCard.Dropdown>
                  </HoverCard>
                ))}
              </SimpleGrid>
            </section>
          )}
          <Space h="xl" />
          <Group justify="flex-end" mt="lg">
            <Button variant="outline" onClick={closeModal} type="button">
              Close
            </Button>
          </Group>
        </div>
      )}
    </Modal>
  );
};

export default IngredientModal;
