import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversion } from './conversion.entity';

@Injectable()
export class ConversionService {
  constructor(@InjectRepository(Conversion) private readonly repository: Repository<Conversion>) {}

  /** Save/create the conversion. */
  async createConversion(convert: Conversion): Promise<Conversion> {
    return await this.repository.save(convert);
  }
}
