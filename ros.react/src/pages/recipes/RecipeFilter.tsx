import { useAppDispatch } from '@app/hooks';
import { RootState } from '@app/store';
import { IPagedMeta } from '@domain/base.dto';
import { Flex } from '@mantine/core';
import { SlidersVerticalIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

const RecipeFilter = ({ meta }: { meta: IPagedMeta | undefined }) => {
  const filter = useSelector((store: RootState) => store.recipeFilter);
  const dispatch = useAppDispatch();

  return (
    <Flex justify="space-between" className='filter-bar'>
      <Flex align="center" gap="sm">
        <SlidersVerticalIcon size={16} />
        <span>Sort and Filter</span>
      </Flex>
      {meta && <div>{meta.itemCount} items</div>}
    </Flex>
  );
};

export default RecipeFilter;
