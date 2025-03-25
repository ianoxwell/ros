import { IIngredientShort } from '@domain/ingredient.dto';
import { ActionIcon, Title } from '@mantine/core';
import { ChevronLeft } from 'lucide-react';

const IngredientModal = ({
  ingredientShort,
  closeModal
}: {
  ingredientShort: IIngredientShort;
  closeModal: () => void;
}) => {
  return (
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
      <Title order={2}>{ingredientShort.name}</Title>
    </div>
  );
};

export default IngredientModal;
