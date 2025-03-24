import { IEquipmentSteppedInstruction } from './equipment-stepped-instruction.dto';
import { IIngredientShort } from './ingredient.dto';

export interface IRecipeSteppedInstruction {
  step: string;
  stepName?: string;
  stepNumber: number;
  lengthTimeValue?: number;
  lengthTimeUnit?: string;
  equipment: IEquipmentSteppedInstruction[];
  ingredients: IIngredientShort[];
}
