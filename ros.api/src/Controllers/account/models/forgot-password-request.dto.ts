import { ApiProperty } from '@nestjs/swagger';

export class IForgotPassword {
  @ApiProperty({ required: true })
  email: string;
}
