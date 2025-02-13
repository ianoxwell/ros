import { ApiProperty } from '@nestjs/swagger';

export class IVerifyTokenRequest {
  @ApiProperty({ description: 'Email address to verify', required: true })
  email: string;

  @ApiProperty({ description: 'Encrypted string sent as part of email registration template', required: true })
  token: string;
}
