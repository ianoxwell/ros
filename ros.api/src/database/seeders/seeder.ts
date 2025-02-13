import { Measurement } from '@controllers//measurement/measurement.entity';
import { MeasurementService } from '@controllers//measurement/measurement.service';
import { HealthLabelService } from '@controllers//recipe/health-label/health-label.service';
import { ReferenceService } from '@controllers//reference/reference.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Seeder {
  constructor(
    private readonly referenceService: ReferenceService,
    private measurementService: MeasurementService,
    private healthLabelService: HealthLabelService
  ) {}
  async seed() {
    await Promise.all([this.measurements(), this.references(), this.healthLabels()])
      .then((completed) => {
        console.debug('Successfuly completed seeding stuff...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        console.error('Failed seeding stuff...');
        Promise.reject(error);
      });
  }

  async measurements() {
    return await Promise.all(this.measurementService.seedCreate())
      .then((result: Measurement[]) => {
        console.log('Measurement result', result.length);
      })
      .catch((error) => console.error('oops', error));
  }

  async references() {
    return await Promise.all(this.referenceService.seedCreate())
      .then((createdReferences) => {
        console.log('No. of references created : ', createdReferences.length);
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }

  async healthLabels() {
    return await Promise.all(this.healthLabelService.seedCreate())
      .then((createdReferences) => {
        console.log('No. of health labels created : ', createdReferences.length);
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
}
