import { CPageOptionsDto } from '@base/filter.const';
import { CMessage } from '@base/message.class';
import { PageMetaDto, PaginatedDto } from '@base/paginated.entity';
import { RecipeService } from '@controllers/recipe/recipe.service';
import { ISchedule, IWeeklySchedule } from '@models/schedule.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Schedule } from './schedule.entity';
import { getDateIndex } from '@services/utils';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule) private readonly repository: Repository<Schedule>,
    private recipeService: RecipeService
  ) {}

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

  async findByDateRange(userId: number, from: Date, to: Date): Promise<IWeeklySchedule> {
    const result: ISchedule[] = await this.repository.query(
      `SELECT s.id, s.date, s."timeSlot", s.notes, 
      json_agg(DISTINCT jsonb_build_object(
          'id', sr.id, 
          'quantity', sr.quantity, 
          'recipeId', r.id, 
          'recipeName', r.name, 
          'shortSummary', r."shortSummary", 
          'recipeImages', r."images"
       )) as "scheduleRecipes"
       FROM schedule s
       LEFT JOIN schedule_recipe sr ON sr."scheduleId" = s.id
       LEFT JOIN recipe r ON r.id = sr."recipeId"
       WHERE s."userId" = $1 AND s.date BETWEEN $2 AND $3
       GROUP BY s.id`,
      [userId, from, to]
    );
    const weeklySchedule: IWeeklySchedule = {};

    // Generate date indexes for the range using Array.from
    const dateIndexes = Array.from({ length: Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1 }, (_, i) => {
      const date = new Date(from);
      date.setDate(date.getDate() + i);
      return getDateIndex(date); // Assuming getDateIndex is imported from utils.ts
    });

    // Initialize the weekly schedule with empty arrays
    dateIndexes.forEach((dateIndex) => {
      weeklySchedule[dateIndex] = [];
    });

    // Populate the weekly schedule with the results
    result.forEach((schedule) => {
      const dateIndex = getDateIndex(schedule.date);
      if (weeklySchedule[dateIndex]) {
        weeklySchedule[dateIndex].push(schedule);
      }
    });

    return weeklySchedule;
  }

  async findScheduleById(scheduleId: number): Promise<ISchedule> {
    const result: ISchedule[] = await this.repository.query(
      `SELECT s.id, s.date, s."timeSlot", s.notes, 
        json_agg(DISTINCT jsonb_build_object(
            'id', sr.id, 
            'quantity', sr.quantity, 
            'recipeId', r.id, 
            'recipeName', r.name, 
            'shortSummary', r."shortSummary", 
            'recipeImages', r."images"
         )) as scheduleRecipes
         FROM schedule s
         LEFT JOIN schedule_recipe sr ON sr."scheduleId" = s.id
         LEFT JOIN recipe r ON r.id = sr."recipeId"
         WHERE s.id = $1
         GROUP BY s.id`,
      [scheduleId]
    );

    return result[0];
  }

  async createSchedule(userId: number, schedule: ISchedule): Promise<ISchedule> {
    const entity: Schedule = this.repository.create({
      date: schedule.date,
      timeSlot: schedule.timeSlot,
      notes: schedule.notes,
      user: { id: userId },
      scheduleRecipes: await Promise.all(
        schedule.scheduleRecipes.map(async (sr) => ({
          quantity: sr.quantity,
          recipe: await this.recipeService.getRecipeEntityById(parseInt(sr.recipeId.toString())) // { id: sr.recipeId }
        }))
      )
    });

    const savedEntity = await this.repository.save(entity);
    return this.findScheduleById(savedEntity.id);
  }

  async updateSchedule(updatedSchedule: ISchedule): Promise<ISchedule | CMessage> {
    const existingSchedule = await this.repository.findOne({
      where: { id: updatedSchedule.id },
      relations: ['scheduleRecipes', 'scheduleRecipes.recipe']
    });

    if (!existingSchedule) {
      return new CMessage('Schedule not found', HttpStatus.NOT_FOUND);
    }

    const updatedEntity = this.repository.merge(existingSchedule, {
      date: updatedSchedule.date,
      timeSlot: updatedSchedule.timeSlot,
      notes: updatedSchedule.notes,
      scheduleRecipes: updatedSchedule.scheduleRecipes.map((sr) => ({
        id: sr.id,
        quantity: sr.quantity,
        recipeId: sr.recipeId
      }))
    });

    const savedEntity = await this.repository.save(updatedEntity);
    return this.mapScheduleToIScheduleDto(savedEntity);
  }

  private mapScheduleToIScheduleDto(s: Partial<Schedule>): ISchedule {
    console.log('s', s);
    return {
      id: s.id,
      date: s.date,
      timeSlot: s.timeSlot,
      scheduleRecipes: [],
      //   s.scheduleRecipes.map((sr) => ({
      // id: sr.id,
      // quantity: sr.quantity,
      // recipeId: sr.recipeId,
      // name: sr.name,
      // shortSummary: sr.shortSummary,
      // images: sr.images
      //   })),
      notes: s.notes
    };
  }
}
