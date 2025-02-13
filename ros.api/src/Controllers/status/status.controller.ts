import { CMessage } from '@base/message.class';
import { Controller, Get } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('status')
export class StatusController {
  @Get()
  @ApiOkResponse()
  ping(): CMessage {
    return new CMessage('Everything online and working', HttpStatus.OK);
  }
}
