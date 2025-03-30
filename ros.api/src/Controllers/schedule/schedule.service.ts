import { PageMetaDto, PaginatedDto } from '@base/paginated.entity';
import { ISchedule } from '@models/schedule.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Schedule } from './schedule.entity';
import { CPageOptionsDto } from '@base/filter.const';

@Injectable()
export class ScheduleService {
  constructor(@InjectRepository(Schedule) private readonly repository: Repository<Schedule>) {}

  async findAllForUser(id: number): Promise<PaginatedDto<ISchedule>> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure the time is set to the start of the day

    const [result, itemCount] = await this.repository.findAndCount({
      where: {
        user: { id },
        date: MoreThanOrEqual(today) // Add condition for date >= today
      },
      relations: ['scheduleRecipes', 'scheduleRecipes.recipe'] // Include related entities
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: CPageOptionsDto });
    const fullResult: ISchedule[] = result.map((s) => this.mapScheduleToIScheduleDto(s));
    return new PaginatedDto(fullResult, pageMetaDto);
  }

  private mapScheduleToIScheduleDto(s: Schedule): ISchedule {
    return {
      id: s.id,
      date: s.date,
      timeSlot: s.timeSlot,
      scheduleRecipes: s.scheduleRecipes.map((sr) => ({
        id: sr.id,
        quantity: sr.quantity,
        recipe: {
          id: sr.recipe.id,
          name: sr.recipe.name,
          shortSummary: sr.recipe.shortSummary,
          images: sr.recipe.images
        }
      })),
      userId: s.user.id,
      notes: s.notes
    };
  }
}
