import { ISimpleEquipment } from 'Models/equipment.dto';

export class CSimpleEquipment implements ISimpleEquipment {
  equipmentId: number;
  name: string;
  description: string;
  image?: string;
}
