import { IBaseDto } from 'src/base/base.dto';
import { IIngredientShort } from 'src/ingredient/ingredient-short.dto';
import { IEquipmentSteppedInstruction } from './equipment-stepped-instruction.dto';

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
