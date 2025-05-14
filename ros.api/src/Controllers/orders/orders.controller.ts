import { CMessage } from '@base/message.class';
import { CurrentUser } from '@controllers/account/current-user.decorator';
import { IOrder } from '@models/order.dto';
import { IUserJwtPayload } from '@models/user.dto';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { convertDateIndexToDate, getIncrementalDateFromTarget } from '@services/utils';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrdersByDate(
    @CurrentUser() user: IUserJwtPayload,
    @Query('from') from: string,
    @Query('days') days?: number
  ): Promise<IOrder | CMessage> {
    if (!user) {
      return new CMessage(`User ID is missing or invalid`, HttpStatus.BAD_REQUEST);
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
    if (isNaN(fromDate.getTime())) {
      return new CMessage('Query parameters "date" must be valid date', HttpStatus.BAD_REQUEST);
    }

    if (fromDate.getTime() < today.getTime()) {
      return new CMessage('"from" date must be greater than today', HttpStatus.BAD_REQUEST);
    }

    return this.ordersService.getOrdersByDate(user.userId, fromDate, toDate);
  }
}
