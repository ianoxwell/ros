
import { IEquipmentSteppedInstruction } from './equipment-stepped-instruction.dto';
import { IBaseDto } from './base.dto';
import { IIngredientShort } from './ingredient.dto';

export interface IRecipeSteppedInstruction extends IBaseDto {
  step: string;
  stepName?: string;
  stepNumber: number;
  lengthTimeValue?: number;
  lengthTimeUnit?: string;
  equipment: IEquipmentSteppedInstruction[];
  recipeId: number;
  ingredients: IIngredientShort[];
}
