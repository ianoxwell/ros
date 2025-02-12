import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CMeasurementData } from './measurement.data';
import { IMeasurement } from './measurement.dto';
import { Measurement } from './measurement.entity';

@Injectable()
export class MeasurementService {
  constructor(
    @InjectRepository(Measurement)
    private readonly repository: Repository<Measurement>
  ) {}

  async findAll(): Promise<Measurement[]> {
    return await this.repository.find({
      relations: ['convertsToId'],
      loadRelationIds: true
    });
  }

  /** Finds only grams (the basis for all conversions) */
  async findGrams(): Promise<Measurement> {
    return await this.repository.findOne({ where: { title: 'Grams' } });
  }

  async findOne(shortName: string): Promise<Measurement> {
    return await this.repository.findOne({ where: { shortName } });
  }

  /** Fires when npm run seed is run. */
  seedCreate(): Promise<Measurement>[] {
    // return await this.repository.upsert(CMeasurementData, { conflictPaths: ['title'], skipUpdateIfNoValuesChanged: true });
    return CMeasurementData.map(async (ref: IMeasurement) => {
      return await this.repository
        .findOne({ where: { title: ref.title, countryCode: ref.countryCode } })
        .then(async (dbReference: Measurement) => {
          if (dbReference) {
            dbReference = { ...dbReference, ...ref };
            return Promise.resolve(await this.repository.save(dbReference));
          }

          return Promise.resolve(await this.repository.save(ref));
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
