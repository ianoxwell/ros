import { CMessage } from '@base/message.class';
import { IResetPasswordRequest, IUserBasicAuth } from 'Models/reset-password-request.dto';
import { IUserProfile, IUserSummary } from 'Models/user.dto';
import { Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { Body, Get, HttpCode, Query, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { IAccessToken } from 'src/Services/auth/access-token.dto';
import { CurrentUser } from './current-user.decorator';
import { IForgotPassword } from './models/forgot-password-request.dto';
import { IRegisterUser } from './models/register-user.dto';
import { IVerifyTokenRequest } from './models/verify-token.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('Accounts')
@Controller({ path: 'account' })
export class AccountController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOkResponse({
    description: 'Quick and dirty get all current users'
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async findAll(): Promise<IUserProfile[]> {
    return this.userService.findAll();
  }

  @Post('register')
  @ApiBody({ type: IRegisterUser })
  @ApiCreatedResponse({
    description: 'User return'
  })
  async register(@Body() registerUser: IRegisterUser): Promise<IUserProfile> {
    if (await !this.userService.emailAvailable(registerUser.email)) {
      throw new HttpException({ status: HttpStatus.CONFLICT, message: 'Email address is already registered' }, HttpStatus.CONFLICT);
    }

    return this.userService.registerUser(registerUser).then((user: User) => {
      return {
        id: user.id,
        familyName: user.familyName,
        givenNames: user.givenNames,
        email: user.email
      };
    });
  }

  @Post('verify-email')
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @HttpCode(200)
  @ApiOkResponse({
    description: 'A success message if the account exists and token matches',
    type: CMessage
  })
  async verifyEmail(@Body() verify: IVerifyTokenRequest): Promise<CMessage> {
    if (!verify.email || verify.email.length < 4 || !verify.email.includes('@')) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Email address does not look right' }, HttpStatus.BAD_REQUEST);
    }

    // If email address doesn't exist throw bad juju
    if (await this.userService.emailAvailable(verify.email)) {
      throw new HttpException(
        { status: HttpStatus.FORBIDDEN, message: 'Email address not exist, super suspicious like' },
        HttpStatus.FORBIDDEN
      );
    }

    const result: boolean = await this.userService.verifyUser(verify);
    return { message: result ? 'Verification successful, you can now login' : 'Verification Failed' };
  }

  @Post('forgot-password')
  @HttpCode(200)
  @ApiBadRequestResponse()
  @ApiOkResponse({
    description: 'Confirms email address message has been sent',
    type: CMessage
  })
  async forgotPassword(@Body() mail: IForgotPassword): Promise<CMessage> {
    if (!mail.email || mail.email.length < 4 || !mail.email.includes('@')) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Email address does not look right' }, HttpStatus.BAD_REQUEST);
    }

    // If email address doesn't exist throw bad juju
    if (await this.userService.emailAvailable(mail.email)) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, message: 'Email address not exist, super suspicious like' },
        HttpStatus.NOT_FOUND
      );
    }

    return this.userService.forgotPassword(mail.email);
  }

  @Post('validate-reset-token')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Confirms password reset and returns jwk to login with',
    type: CMessage
  })
  @ApiBadRequestResponse()
  async validateResetToken(@Body() verify: IVerifyTokenRequest): Promise<CMessage> {
    if (!verify || !verify.token || verify.token.length < 16 || !verify.email) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, message: 'Not verifying something with no information' },
        HttpStatus.BAD_REQUEST
      );
    }

    const result = await this.userService.validateResetToken(verify);

    return { message: result ? 'Token is valid' : 'Invalid Token' };
  }

  @Post('reset-password')
  @HttpCode(200)
  @ApiOkResponse({
    description:
      'Confirms password reset and returns jwk to login with. In terms of flow, the front end on receiving success message will then use the same pw to login.'
  })
  async resetPassword(@Body() reset: IResetPasswordRequest): Promise<CMessage> {
    if (!reset.email || reset.email.length < 4 || !reset.email.includes('@')) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Email address does not look right' }, HttpStatus.BAD_REQUEST);
    }

    if (!reset.token || reset.token.length < 16) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, message: 'Token is not looking correct, try again' },
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.userService.resetPassword(reset);
  }

  @Get('email-available')
  async checkEmailAvailable(@Query('email') email: string): Promise<boolean> {
    if (!email || email.length < 4 || !email.includes('@')) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Email address does not look right' }, HttpStatus.BAD_REQUEST);
    }

    return this.userService.emailAvailable(email);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'jwt bearer token my man'
  })
  @ApiBadRequestResponse()
  async userLogin(@Body() user: IUserBasicAuth): Promise<IAccessToken | CMessage> {
    if (!user.email || user.email.length < 4 || !user.email.includes('@')) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Email address does not look right' }, HttpStatus.BAD_REQUEST);
    }

    return await this.userService.findOneUser(user);
  }

  // get-account
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  async whoAmI(@CurrentUser() user): Promise<IUserSummary | CMessage> {
    const result = this.userService.findById(user.userId);
    if (!result) {
      return { message: 'You have an existential crisis - your not real', status: HttpStatus.AMBIGUOUS };
    }

    return result;
  }
}
