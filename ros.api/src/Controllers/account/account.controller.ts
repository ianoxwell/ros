import { CMessage } from '@base/message.class';
import { IResetPasswordRequest } from '@models/reset-password-request.dto';
import { IUserJwtPayload, IUserLogin, IUserProfile, IUserSummary, IUserToken } from '@models/user.dto';
import { Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { Body, Get, Headers, HttpCode, Query, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
  async register(@Body() registerUser: IRegisterUser, @Headers() headers): Promise<IUserProfile | IUserToken | CMessage> {
    const isEmailAvailable = await this.userService.emailAvailable(registerUser.email);
    if (!isEmailAvailable) {
      return new CMessage('Email address is already registered', HttpStatus.CONFLICT);
    }

    let user: User | IUserToken = await this.userService.registerUser(registerUser, headers.origin);

    if (user.hasOwnProperty('token')) {
      return user;
    }

    user = user as User;
    return {
      id: user.id,
      familyName: user.familyName,
      givenNames: user.givenNames,
      email: user.email
    };
  }

  @Post('verify-email')
  @ApiBadRequestResponse()
  @HttpCode(200)
  @ApiOkResponse({
    description: 'A success message if the account exists and token matches',
    type: CMessage
  })
  async verifyEmail(@Body() verify: IVerifyTokenRequest): Promise<CMessage | IUserToken> {
    if (!verify.email || verify.email.length < 4 || !verify.email.includes('@')) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Email address does not look right' }, HttpStatus.BAD_REQUEST);
    }

    return await this.userService.verifyUser(verify);
  }

  @Post('forgot-password')
  @HttpCode(200)
  @ApiBadRequestResponse()
  @ApiOkResponse({
    description: 'Confirms email address message has been sent',
    type: CMessage
  })
  async forgotPassword(@Body() mail: IForgotPassword, @Headers() headers): Promise<CMessage> {
    if (!mail.email || mail.email.length < 4 || !mail.email.includes('@')) {
      return new CMessage('Email address does not look right, try correcting and send again', HttpStatus.BAD_REQUEST);
    }

    // If email address doesn't exist throw bad juju
    if (await this.userService.emailAvailable(mail.email)) {
      return new CMessage('Email address not exist, super suspicious like', HttpStatus.NOT_FOUND);
    }

    return this.userService.forgotPassword(mail.email, headers.origin);
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
  async resetPassword(@Body() reset: IResetPasswordRequest): Promise<CMessage | IUserToken> {
    if (!reset.email || reset.email.length < 4 || !reset.email.includes('@')) {
      return new CMessage('Email address does not look right', HttpStatus.BAD_REQUEST);
    }

    if (!reset.token || reset.token.length < 16) {
      return new CMessage('Token is not looking correct, try again', HttpStatus.BAD_REQUEST);
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
  async userLogin(@Body() user: IUserLogin): Promise<IUserToken | CMessage> {
    if (!user.email || user.email.length < 4 || !user.email.includes('@')) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Email address does not look right' }, HttpStatus.BAD_REQUEST);
    }

    return await this.userService.findOneUser(user);
  }

  // get-account
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  async whoAmI(@CurrentUser() user: IUserJwtPayload): Promise<IUserSummary | CMessage> {
    const result = this.userService.findById(user.userId);
    if (!result) {
      return { message: 'You have an existential crisis - your not real', status: HttpStatus.AMBIGUOUS };
    }

    return result;
  }
}
