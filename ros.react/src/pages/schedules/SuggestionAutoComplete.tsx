import { IRecipeShort } from '@domain/recipe.dto';
import { IScheduleRecipe } from '@domain/schedule.dto';
import { useGetRecipeSuggestionsQuery } from '@features/api/apiSlice';
import { CloseButton, Combobox, Loader, TextInput, useCombobox } from '@mantine/core';
import { randomId, useDebouncedValue } from '@mantine/hooks';
import { useState } from 'react';

const SuggestionAutoComplete = ({
  item,
  onSelectionChange
}: {
  item: IScheduleRecipe;
  onSelectionChange: (id: number, recipeName: string) => void;
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  });
  const [value, setValue] = useState(item.recipeName || '');
  const [debounced] = useDebouncedValue(value, 200, { leading: true });
  const { data, isLoading } = useGetRecipeSuggestionsQuery(debounced);

  const options = (data?.results || []).map((item: IRecipeShort) => (
    <Combobox.Option value={item.name || ''} itemID={item.id?.toString()} key={item.id || randomId()}>
      {item.name}
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue, props) => {
        if (props.itemID && !isNaN(Number(props.itemID)) && Number.isInteger(Number(props.itemID))) {
          onSelectionChange(Number(props.itemID), optionValue);
        }

        setValue(optionValue);
        combobox.closeDropdown();
      }}
      withinPortal={true}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          label="Pick value or type anything"
          placeholder="Search groceries"
          className="schedule--modal__recipe"
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            // fetchOptions(event.currentTarget.value);
            combobox.resetSelectedOption();
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => {
            combobox.openDropdown();
          }}
          onBlur={() => combobox.closeDropdown()}
          rightSection={
            (isLoading && <Loader size={18} />) ||
            (value.length && <CloseButton aria-label="Clear input" onClick={() => setValue('')} />)
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}
          <Combobox.Empty hidden={!!data?.results.length}>No results found</Combobox.Empty>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default SuggestionAutoComplete;
