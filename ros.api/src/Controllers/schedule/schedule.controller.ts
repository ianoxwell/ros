import { CMessage } from '@base/message.class';
import { PaginatedDto } from '@base/paginated.entity';
import { CurrentUser } from '@controllers/account/current-user.decorator';
import { ISchedule, IWeeklySchedule } from '@models/schedule.dto';
import { IUserJwtPayload } from '@models/user.dto';
import { Body, Controller, Get, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { convertDateIndexToDate } from '@services/utils';
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
    @Query('to') to: string
  ): Promise<IWeeklySchedule | CMessage> {
    if (!user) {
      return new CMessage('User ID is missing or invalid', HttpStatus.BAD_REQUEST);
    }

    if (!from || !to) {
      return new CMessage('Query parameters "from" and "to" are required', HttpStatus.BAD_REQUEST);
    }

    const fromDate = convertDateIndexToDate(from);
    const toDate = convertDateIndexToDate(to);
    const today = new Date();

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return new CMessage('Query parameters "from" and "to" must be valid dates', HttpStatus.BAD_REQUEST);
    }

    if (fromDate.getTime() < today.getTime()) {
      return new CMessage('"from" date must be greater than today', HttpStatus.BAD_REQUEST);
    }

    if (toDate.getTime() <= fromDate.getTime()) {
      return new CMessage('"to" date must be greater than "from" date', HttpStatus.BAD_REQUEST);
    }

    return this.scheduleService.findByDateRange(user.userId, fromDate, toDate);
  }

  @Post()
  async createOrUpdateSchedule(@CurrentUser() user: IUserJwtPayload, @Body() schedule: ISchedule): Promise<ISchedule | CMessage> {
    if (!user) {
      return new CMessage('User ID is missing or invalid', HttpStatus.BAD_REQUEST);
    }

    if (!schedule) {
      return new CMessage('Schedule data is required', HttpStatus.BAD_REQUEST);
    }

    // Update existing or create new schedule
    return schedule.id ? this.scheduleService.updateSchedule(schedule) : this.scheduleService.createSchedule(user.userId, schedule);
  }
}
