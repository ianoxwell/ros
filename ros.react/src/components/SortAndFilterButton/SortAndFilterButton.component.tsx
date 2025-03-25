import { IPagedMeta } from '@domain/base.dto';
import { Button, Flex, Text } from '@mantine/core';
import { SlidersVerticalIcon } from 'lucide-react';

const SortAndFilterButton = ({
  meta,
  page,
  toggle
}: {
  meta: IPagedMeta | undefined;
  page: string;
  toggle: () => void;
}) => {
  return (
    <Button
      variant="transparent"
      justify="space-between"
      rightSection={
        <div>
          {meta?.itemCount} {page}
        </div>
      }
      fullWidth
      className="filter--button"
      type="button"
      onClick={toggle}
    >
      <Flex align="center" gap="sm">
        <SlidersVerticalIcon size={20} />
        <Text tt="uppercase" fw={500}>
          Sort and Filter
        </Text>
      </Flex>
    </Button>
  );
};

export default SortAndFilterButton;
