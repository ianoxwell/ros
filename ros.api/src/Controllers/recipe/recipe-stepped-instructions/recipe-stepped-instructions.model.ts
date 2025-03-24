export interface IEquipmentStepDto {
  equipmentId: number;
  temperature?: number;
  temperatureUnit?: string;
}

export interface IRecipeSteppedInstructionDto {
  step: string;
  stepName?: string;
  stepNumber: number;
  lengthTimeValue?: number;
  lengthTimeUnit?: string;
  equipment: IEquipmentStepDto[];
  ingredientIds: number[];
}
