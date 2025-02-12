import { HttpStatus } from '@nestjs/common';

export class IMessage {
  message: string;
  status?: HttpStatus;

  constructor(message: string, status: HttpStatus = HttpStatus.OK) {
    this.message = message;
    this.status = status;
  }
}
