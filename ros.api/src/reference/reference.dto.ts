import { EReferenceType } from './reference.entity';

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
