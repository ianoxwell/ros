import { CImageUrlLarge, CRoutes } from '@app/routes.const';
import { CMacroNutrientRda } from '@domain/vitamin-mineral-const';
import { useGetIngredientQuery } from '@features/api/apiSlice';
import { ActionIcon, Flex, Image, Modal, Space, Title } from '@mantine/core';
import { fixWholeNumber, sentenceCase } from '@utils/stringUtils';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import NutritionCurveLeft from './nutritionCurveLeft';
import NutritionCurveRight from './nutritionCurveRight';
import NutritionText from './NutritionText.component';

const IngredientModal = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { data: ingredient, isLoading } = useGetIngredientQuery(id, { skip: !id });

  const closeModal = () => {
    navigate(CRoutes.ingredients);
  };

  if (!id) return null;

  const calculateRdaPercent = (rdaAmount: number, value: number) => {
    return fixWholeNumber((value / rdaAmount) * 100, 2);
  };

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
          <Title order={2}>{sentenceCase(ingredient.name)}</Title>
          <Space h="xl" />

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
                  {calculateRdaPercent(CMacroNutrientRda.protein.amount, ingredient.nutrition?.nutrients.protein || 0)}%
                  rda)
                </span>
              </div>
              <div>
                <Title order={4}>Carbohydrates</Title>
                <span>
                  {fixWholeNumber(ingredient.nutrition?.nutrients.carbohydrates, 1)} g (
                  {calculateRdaPercent(
                    CMacroNutrientRda.carbohydrates.amount,
                    ingredient.nutrition?.nutrients.carbohydrates || 0
                  )}
                  % rda)
                </span>
              </div>
              <div>
                <Title order={4}>Fat</Title>
                <span>
                  {fixWholeNumber(ingredient.nutrition?.nutrients.fat, 1)} g (
                  {calculateRdaPercent(CMacroNutrientRda.fat.amount, ingredient.nutrition?.nutrients.fat || 0)}% rda)
                </span>
              </div>
              <div>
                <Title order={4}>Dietary fibre</Title>
                <span>
                  {fixWholeNumber(ingredient.nutrition?.nutrients.fiber, 1)} g (
                  {calculateRdaPercent(CMacroNutrientRda.fiber.amount, ingredient.nutrition?.nutrients.fiber || 0)}%
                  rda)
                </span>
              </div>
            </Flex>
          </Flex>

          <div>List of conversions in text</div>

          <div>Some sort of list of recipes (with links) that this ingredient is in</div>
        </div>
      )}
    </Modal>
  );
};

export default IngredientModal;
