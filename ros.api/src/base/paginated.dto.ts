import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PaginatedDto<TData> {
  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  @ApiProperty({ isArray: true })
  results: TData[];

  constructor(data: TData[], meta: PageMetaDto) {
    this.results = data;
    this.meta = meta;
  }
}

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export enum EOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: EOrder, default: EOrder.ASC })
  readonly order?: EOrder = EOrder.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1
  })
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 25
  })
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
