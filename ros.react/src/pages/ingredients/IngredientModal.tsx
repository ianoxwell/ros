import { CImageUrlLarge, CRoutes } from '@app/routes.const';
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
                  <NutritionText data={ingredient.nutrition?.minerals} reverse/>
                </div>
              </div>
            </div>
            <div className="serving-size-label">Serving size: 100 g</div>
          </Flex>
        </div>
      )}
    </Modal>
  );
};

export default IngredientModal;
