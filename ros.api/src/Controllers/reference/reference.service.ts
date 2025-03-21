import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { allergyReference } from './reference.data';
import { EReferenceType, IAllReferences, IReference } from '../../../Models/reference.dto';
import { Reference } from './reference.entity';
import { MeasurementService } from '@controllers/measurement/measurement.service';
import { IMeasurement } from '@models/measurement.dto';

@Injectable()
export class ReferenceService {
  constructor(
    @InjectRepository(Reference)
    private readonly referenceRepository: Repository<Reference>,
    private measurementService: MeasurementService
  ) {}

  findAll(): Promise<Reference[]> {
    return this.referenceRepository.find();
  }

  findByType(refType: EReferenceType): Promise<Reference[]> {
    return this.referenceRepository.find({ where: { refType } });
  }

  find(idString: string): Promise<Reference> {
    const id = parseInt(idString, 10);
    const record: Promise<Reference> = this.referenceRepository.findOne({
      where: { id }
    });

    if (record) {
      return record;
    }

    throw new Error('No record found');
  }

  async getAllReferences(): Promise<IAllReferences> {
    const rawReferences = await this.referenceRepository.find();
    const measurements = (await this.measurementService.findAll()) as IMeasurement[];

    return {
      allergyWarning: rawReferences.filter((ref) => ref.refType === EReferenceType.allergyWarning),
      healthLabel: rawReferences.filter((ref) => ref.refType === EReferenceType.healthLabel),
      measurements
    };
  }

  /** Fires when npm run seed is run. */
  seedCreate(): Promise<Reference>[] {
    const refList = [...allergyReference];
    return refList.map(async (ref: IReference) => {
      return await this.referenceRepository
        .findOne({ where: { title: ref.title, refType: ref.refType } })
        .then(async (dbReference) => {
          if (dbReference) {
            dbReference = { ...dbReference, ...ref };
            return Promise.resolve(await this.referenceRepository.save(dbReference));
          }

          return Promise.resolve(await this.referenceRepository.save(ref));
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
