import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EOrder } from './paginated.dto';

export class IFilterBase {
  @ApiProperty({ default: 25, maximum: 100, minimum: 1, required: true })
  take: number;

  @ApiProperty({ minimum: 1, default: 1, required: true })
  page: number;

  @ApiPropertyOptional({ description: 'field to sort/filter on', default: 'name' })
  sort?: string;

  @ApiPropertyOptional({ enum: EOrder, default: EOrder.ASC })
  readonly order?: EOrder = EOrder.ASC;

  @ApiPropertyOptional({ description: 'Text to filter' })
  keyword?: string;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
