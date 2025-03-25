import { ISimpleReference } from '@domain/recipe.dto';
import { ComboboxItem } from '@mantine/core';

export const sentenceCase = (sentence: string | undefined): string => {
  if (!sentence) {
    return '';
  }

  return sentence[0].toUpperCase() + sentence.substring(1).toLowerCase();
};

export const parseRecipeInstructions = (htmlString: string) => {
  // Create a temporary DOM element to parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Extract text content from <li> elements inside <ol>
  return Array.from(doc.querySelectorAll('ol li')).map((li) => li.textContent?.trim());
};

/** Takes a simple reference (id and name) and transforms to value and label for mantine Multiselect */
export const sortLabels = (data: ISimpleReference[] | undefined) => {
  return data
    ?.map((item) => ({ value: item.id.toString(), label: sentenceCase(item.name) } as ComboboxItem))
    .sort((a, b) => a.label.localeCompare(b.label));
};
