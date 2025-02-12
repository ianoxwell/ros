import { IBaseDto } from 'src/base/base.dto';

export class ISimpleEquipment extends IBaseDto {
  equipmentId: number;
  name: string;
  description: string;
  image?: string;
}
