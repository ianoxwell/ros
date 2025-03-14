export interface IReference {
  id?: number;
  title: string;
  refType: EReferenceType;
  symbol?: string;
  summary?: string;
  altTitle?: string;
  onlineId?: number;
  sortOrder?: number;
}

export enum EReferenceType {
  allergyWarning,
  cuisineType,
  dishTag,
  dishType,
  equipment,
  healthLabel,
  ingredientFoodGroup,
  ingredientState
}
