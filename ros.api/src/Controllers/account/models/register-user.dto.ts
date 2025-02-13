import { ApiProperty } from '@nestjs/swagger';

export class IRegisterUser {
  givenNames: string;
  familyName: string;
  email: string;
  password: string;
  photoUrl: string[];

  @ApiProperty({ required: false })
  verified?: Date;

  @ApiProperty({ default: 'ros' })
  loginProvider: 'google' | 'ros';

  @ApiProperty({ required: false })
  loginProviderId?: string;
}
