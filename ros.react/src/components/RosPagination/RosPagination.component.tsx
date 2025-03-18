import { IPagedMeta } from '@domain/base.dto';
import './RosPagination.component.scss';
import { useAppDispatch } from '@app/hooks';
import { Button, Group } from '@mantine/core';
import { setRecipePageNumber } from '@pages/recipes/recipeFilter.slice';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

const RosPagination = ({ meta }: { meta: IPagedMeta }) => {
  const dispatch = useAppDispatch();

  const setPageNumber = (page: number) => {
    dispatch(setRecipePageNumber(page));
  };

  // !TODO make limit on the number of pages that can be shown e.g. only 4 with middle item being center of range
  // for example there are 7 pages - current page is 5 so show .. 4 5 6 7

  return (
    <>
      {meta.itemCount > meta.take && (
        <section className="ros-paginator">
          <Group justify="center" gap="xs">
            <Button
              variant="outline"
              type="button"
              onClick={() => setPageNumber(0)}
              className="white-background"
              leftSection={<ChevronsLeft size={14} />}
            >
              First
            </Button>
            {[...Array(meta.pageCount).keys()].map((value: number) => (
              <Button
                variant={value === meta.page ? 'accent' : 'outline'}
                className={value === meta.page ? '' : 'white-background'}
                type="button"
                onClick={() => setPageNumber(value)}
                key={value}
              >
                {value + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              type="button"
              className="white-background"
              onClick={() => setPageNumber(meta.pageCount - 1)}
              rightSection={<ChevronsRight size={14} />}
            >
              Last
            </Button>
          </Group>
        </section>
      )}
    </>
  );
};

export default RosPagination;
