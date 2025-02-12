import { Controller, Get } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IMessage } from 'src/base/message.dto';

@ApiTags('Health')
@Controller('status')
export class StatusController {
  @Get()
  @ApiOkResponse()
  ping(): IMessage {
    return new IMessage('Everything online and working', HttpStatus.OK);
  }
}
