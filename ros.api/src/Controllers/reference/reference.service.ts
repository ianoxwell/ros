import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { allergyReference } from './reference.data';
import { EReferenceType, IAllReferences, IReference } from '../../../Models/reference.dto';
import { Reference } from './reference.entity';
import { MeasurementService } from '@controllers/measurement/measurement.service';
import { IMeasurement } from '@models/measurement.dto';
import { Equipment } from '@controllers/recipe/equipment/equipment.entity';
import { HealthLabel } from '@controllers/recipe/health-label/health-label.entity';
import { CuisineType } from '@controllers/recipe/cuisine-type/cuisine-type.entity';
import { DishType } from '@controllers/recipe/dish-type/dish-type.entity';
import { ISimpleReference } from '@models/recipe.dto';

@Injectable()
export class ReferenceService {
  constructor(
    @InjectRepository(Reference)
    private readonly referenceRepository: Repository<Reference>,
    @InjectRepository(Equipment) private readonly equipmentRepository: Repository<Equipment>,
    @InjectRepository(HealthLabel) private readonly healthLabelRepository: Repository<HealthLabel>,
    @InjectRepository(CuisineType) private readonly cuisineTypeRepository: Repository<CuisineType>,
    @InjectRepository(DishType) private readonly dishTypeRepository: Repository<DishType>,
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
    const measurements = await this.measurementService.findAll();
    const equipment = await this.equipmentRepository.find();
    const healthLabel = await this.healthLabelRepository.find();
    const cuisineType = await this.cuisineTypeRepository.find();
    const dishType = await this.dishTypeRepository.find();

    return {
      allergyWarning: rawReferences.filter((ref) => ref.refType === EReferenceType.allergyWarning),
      cuisineType: cuisineType.map((cuisine) => this.mapSimpleReference(cuisine)),
      healthLabel: healthLabel.map((cuisine) => this.mapSimpleReference(cuisine)),
      measurements,
      equipment: equipment.map((equip) => ({ ...this.mapSimpleReference(equip), image: equip.image })),
      dishType: dishType.map((d) => this.mapSimpleReference(d))
    };
  }

  private mapSimpleReference(item: HealthLabel | DishType | CuisineType): ISimpleReference {
    return {
      id: item.id,
      name: item.name,
      description: item.description
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
