import { HttpStatus } from '@nestjs/common';
import { IMessage } from 'Models/message.dto';

export class CMessage implements IMessage {
  message: string;
  status?: HttpStatus;

  constructor(message: string, status: HttpStatus = HttpStatus.OK) {
    this.message = message;
    this.status = status;
  }
}
