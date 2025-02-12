import { ISimpleEquipment } from '../equipment/equipment.dto';

export interface IEquipmentSteppedInstruction extends ISimpleEquipment {
  temperature?: number;
  temperatureUnit?: string;
  recipeSteppedInstructionId: number;
}
