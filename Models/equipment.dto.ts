import { IBaseDto } from "./base.dto";

export interface ISimpleEquipment extends IBaseDto {
  equipmentId: number;
  name: string;
  description: string;
  image?: string;
}
