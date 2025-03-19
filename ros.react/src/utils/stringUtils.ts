export const sentenceCase = (sentence: string | undefined): string => {
  if (!sentence) {
    return '';
  }

  return sentence[0].toUpperCase() + sentence.substring(1).toLowerCase();
};
