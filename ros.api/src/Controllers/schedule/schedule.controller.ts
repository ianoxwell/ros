import { CMessage } from '@base/message.class';
import { PaginatedDto } from '@base/paginated.entity';
import { CurrentUser } from '@controllers/account/current-user.decorator';
import { ISchedule, IWeeklySchedule } from '@models/schedule.dto';
import { IUserJwtPayload } from '@models/user.dto';
import { Body, Controller, Get, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { convertDateIndexToDate, getIncrementalDateFromTarget, getIncrementedDateIndex } from '@services/utils';
import { ScheduleService } from './schedule.service';

@ApiTags('Schedule')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get('all')
  async getSchedule(@CurrentUser() user: IUserJwtPayload): Promise<PaginatedDto<ISchedule> | CMessage> {
    if (!user) {
      return new CMessage('User ID is missing or invalid', HttpStatus.BAD_REQUEST);
    }

    return this.scheduleService.findAllForUser(user.userId);
  }

  @Get()
  async getScheduleByDate(
    @CurrentUser() user: IUserJwtPayload,
    @Query('from') from: string,
    @Query('days') days?: number
  ): Promise<IWeeklySchedule | CMessage> {
    if (!user) {
      return new CMessage('User ID is missing or invalid', HttpStatus.BAD_REQUEST);
    }

    if (!from) {
      return new CMessage('Query parameters "from" is required', HttpStatus.BAD_REQUEST);
    }

    if (!days || days < 1) {
      days = 7;
    }

    const fromDate = convertDateIndexToDate(from);
    const toDate = getIncrementalDateFromTarget(fromDate, days);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure the time is set to the start of the day

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return new CMessage(`Query parameters "from" must be valid dates`, HttpStatus.BAD_REQUEST);
    }

    if (fromDate.getTime() < today.getTime()) {
      return new CMessage('"from" date must be greater than today', HttpStatus.BAD_REQUEST);
    }

    if (toDate.getTime() <= fromDate.getTime()) {
      return new CMessage(`"to" date must be greater than "from" date, ${fromDate} - ${toDate}, ${days}`, HttpStatus.BAD_REQUEST);
    }

    return this.scheduleService.findByDateRange(user.userId, fromDate, toDate);
  }

  @Get('day')
  async getScheduleForOneDay(@CurrentUser() user: IUserJwtPayload, @Query('date') date: string): Promise<ISchedule[] | CMessage> {
    if (!user) {
      return new CMessage('User ID is missing or invalid', HttpStatus.BAD_REQUEST);
    }

    if (!date) {
      return new CMessage('Query parameters "from" and "to" are required', HttpStatus.BAD_REQUEST);
    }

    const dateItem = convertDateIndexToDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure the time is set to the start of the day
    if (isNaN(dateItem.getTime())) {
      return new CMessage('Query parameters "date" must be valid date', HttpStatus.BAD_REQUEST);
    }

    if (dateItem.getTime() < today.getTime()) {
      return new CMessage('"from" date must be greater than today', HttpStatus.BAD_REQUEST);
    }

    return this.scheduleService.findScheduleOnDate(user.userId, dateItem);
  }

  @Post()
  async createOrUpdateSchedule(@CurrentUser() user: IUserJwtPayload, @Body() schedule: ISchedule): Promise<ISchedule | CMessage> {
    if (!user) {
      return new CMessage('User ID is missing or invalid', HttpStatus.BAD_REQUEST);
    }

    if (!schedule) {
      return new CMessage('Schedule data is required', HttpStatus.BAD_REQUEST);
    }

    // Prevent duplicates for same day, user and time slot
    const findExistingSchedule = await this.scheduleService.findExistingScheduleToPreventDuplicates(user.userId, schedule);
    if (findExistingSchedule) {
      return this.scheduleService.mergeExistingSchedules(schedule, findExistingSchedule);
    }

    // Update existing or create new schedule
    return schedule.id
      ? this.scheduleService.updateSchedule(user.userId, schedule)
      : this.scheduleService.createSchedule(user.userId, schedule);
  }
}
