/**
 * MET reference types.
 * Enum name must match context entity name.
 * PLEASE:
 * - keep these in alpha order
 * - sync changes to ReferenceType.cs (it's in MET.Dto)
 */
export enum EReferenceType {
  AllergyWarning = 1,
  CuisineType,
  DishTag,
  DishType,
  Equipment,
  HealthLabel,
  IngredientFoodGroup,
  IngredientState,
  LogLevel,
  PermissionGroup
}

export enum EReferenceDetail {
  Basic = 1,
  Full
}

export interface IReferenceItem {
  id: number;
  title: string;
}
export interface IReferenceItemFull extends IReferenceItem {
  symbol: string;
  summary: string;
  altTitle?: string;
  onlineId?: number; // equipment has a spoonacular reference
  sortOrder: number;
  createdAt: Date;
  rowVer: string;
}

/**
 * Note in alphabetical order - add to when references change
 */
export interface IReferenceAll {
  AllergyWarning?: IReferenceItemFull[];
  CuisineType?: IReferenceItemFull[];
  DishTag?: IReferenceItemFull[];
  DishType?: IReferenceItemFull[];
  Equipment?: IReferenceItemFull[];
  HealthLabel?: IReferenceItemFull[];
  IngredientFoodGroup?: IReferenceItemFull[];
  IngredientState?: IReferenceItemFull[];
  LogLevel?: IReferenceItemFull[];
  PermissionGroup?: IReferenceItemFull[];
}
