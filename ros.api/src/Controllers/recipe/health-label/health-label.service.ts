import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CHealthLabel } from './health-label.data';
import { HealthLabel } from './health-label.entity';

@Injectable()
export class HealthLabelService {
  constructor(@InjectRepository(HealthLabel) private readonly repository: Repository<HealthLabel>) {}

  /** Standard seed create for data */
  seedCreate(): Promise<HealthLabel | UpdateResult>[] {
    return CHealthLabel.map(async (ref: HealthLabel) => {
      return await this.repository
        .findOne({ where: { name: ref.name } })
        .then(async (dbReference) => {
          if (dbReference) {
            dbReference = { ...dbReference, ...ref };
            return Promise.resolve(await this.repository.update(dbReference.id, dbReference));
          }

          return Promise.resolve(await this.repository.save(ref));
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
