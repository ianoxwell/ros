import { CMessage } from '@base/message.class';
import { IResetPasswordRequest } from '@models/reset-password-request.dto';
import { IUserLogin, IUserProfile, IUserSummary, IUserToken } from '@models/user.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '@services/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { IsNull, Not, Repository } from 'typeorm';
import { IRegisterUser } from './models/register-user.dto';
import { IVerifyTokenRequest } from './models/verify-token.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private mailService: MailService,
    private readonly jwtTokenService: JwtService
  ) {}

  /** Checks the email address to find out if the email address has been registered */
  async emailAvailable(email: string): Promise<boolean> {
    // , verified: Not(IsNull())
    const findExistingUser = await this.repository.findOne({ where: { email, isActive: true } });
    return findExistingUser === null;
  }

  async registerUser(user: IRegisterUser, host: string): Promise<IUserToken | User> {
    const isSocial = user.loginProvider?.toLowerCase() === 'google';

    let existNonVerifiedUser = await this.repository.findOne({ where: { email: user.email, verified: Not(IsNull()), isActive: true } });
    if (existNonVerifiedUser) {
      existNonVerifiedUser = {
        ...existNonVerifiedUser,
        verificationToken: randomBytes(16).toString('hex'),
        familyName: user.familyName,
        givenNames: user.givenNames,
        passwordHash: !!user.password ? await bcrypt.hash(user.password, 10) : null,
        photoUrl: user.photoUrl || [],
        isActive: true
      };
      // send email
      this.mailService.sendRegistrationEmail(user.email, user.givenNames, existNonVerifiedUser.verificationToken, host);
      return existNonVerifiedUser;
    }

    const newUser: Partial<User> = {
      familyName: user.familyName,
      givenNames: user.givenNames,
      email: user.email,
      passwordHash: !!user.password ? await bcrypt.hash(user.password, 10) : null,
      photoUrl: user.photoUrl || [],
      isActive: true,
      loginProvider: user.loginProvider || 'ros',
      loginProviderId: user.loginProviderId,
      verified: user.verified || null,
      firstLogin: isSocial ? new Date() : null,
      lastLogin: isSocial ? new Date() : null,
      timesLoggedIn: isSocial ? 1 : 0,
      verificationToken: isSocial ? null : randomBytes(16).toString('hex'),
      passwordLastReset: isSocial ? new Date() : null
    };

    const freshUser = await this.repository.save(newUser);
    if (!isSocial && newUser.verificationToken) {
      // send email
      this.mailService.sendRegistrationEmail(user.email, user.givenNames, newUser.verificationToken, host);
      return freshUser;
    }

    return { user: this.mapUserToSummary(freshUser), token: this.createToken(freshUser) };
  }

  async findById(id: number): Promise<IUserSummary | undefined> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user || !user.isActive) {
      return undefined;
    }

    return this.mapUserToSummary(user);
  }

  mapUserToSummary(user: User): IUserSummary {
    return {
      familyName: user.familyName,
      givenNames: user.givenNames,
      fullName: `${user.givenNames} ${user.familyName}`,
      email: user.email,
      photoUrl: user.photoUrl,
      isActive: user.isActive,
      phoneNumber: user.phoneNumber,
      loginProvider: user.loginProvider,
      loginProviderId: user.loginProviderId,
      verified: user.verified,
      isAdmin: user.isAdmin,
      failedLoginAttempt: user.failedLoginAttempt,
      lastFailedLoginAttempt: user.lastFailedLoginAttempt,
      timesLoggedIn: user.timesLoggedIn,
      firstLogin: user.firstLogin,
      lastLogin: user.lastLogin
    };
  }

  /** Only to be used by the auth service */
  async findOneUser(basicAuth: IUserLogin): Promise<IUserToken | CMessage> {
    const user = await this.repository.findOne({ where: { email: basicAuth.email } });
    if (!user) {
      return { message: 'No such email address found.', status: HttpStatus.NOT_FOUND };
    }

    if (!user.isActive || !['ros', 'Local'].includes(user.loginProvider)) {
      return {
        message: !user.isActive ? 'Account has been deactivated' : 'Try logging in with Social provider (Google)',
        status: HttpStatus.UNAUTHORIZED
      };
    }

    if (!user.verified) {
      return { message: 'Account has not yet been verified.', status: HttpStatus.PRECONDITION_REQUIRED };
    }

    if (user.failedLoginAttempt > 3) {
      user.isActive = false;
      await this.repository.update(user.id, user);
      return {
        message: 'Account has been locked out and deactivated - contact your friendly IT support person.',
        status: HttpStatus.UNAUTHORIZED
      };
    }

    if (user.lastFailedLoginAttempt) {
      const timeNow = new Date().getTime();
      const lockoutTime = user.lastFailedLoginAttempt.getTime() + 6 * 1000;
      if (lockoutTime > timeNow) {
        return { message: 'Too fast speedy, have a think, slow down a little.', status: HttpStatus.TOO_MANY_REQUESTS };
      }
    }

    if (!bcrypt.compareSync(basicAuth.password, user.passwordHash)) {
      user.failedLoginAttempt++;
      user.lastFailedLoginAttempt = new Date();

      await this.repository.update(user.id, user);
      return { message: 'Wrong password, have a think and try again in a bit.', status: HttpStatus.UNAUTHORIZED };
    }

    const currentDateTime = new Date();
    user.lastLogin = currentDateTime;
    user.timesLoggedIn++;
    user.failedLoginAttempt = 0;
    user.lastFailedLoginAttempt = null;
    if (!user.firstLogin) {
      user.firstLogin = currentDateTime;
    }

    const result = await this.repository.update(user.id, user);
    if (!result) {
      return { message: 'Something went pear shaped updating the DB.', status: HttpStatus.INTERNAL_SERVER_ERROR };
    }

    return { token: this.createToken(user), user: this.mapUserToSummary(user) };
  }

  /** Temp or partial - later will secure or remove */
  findAll(): Promise<IUserProfile[]> {
    return this.repository.find().then((result: User[]) => {
      return result.map((user: User) => {
        return {
          familyName: user.familyName,
          givenNames: user.givenNames,
          email: user.email,
          token: user.verificationToken
        };
      });
    });
  }

  async verifyUser(user: IVerifyTokenRequest): Promise<IUserToken | CMessage> {
    const account = await this.repository.findOne({ where: { email: user.email, isActive: true } });
    if (!account) {
      return new CMessage('That email address does not match any of our current records', HttpStatus.NOT_FOUND);
    }

    if (!account.verificationToken && account.verified) {
      return new CMessage('Looks like the account is already verified, please log in normally', HttpStatus.MISDIRECTED);
    }

    if (account.verificationToken !== user.token) {
      return new CMessage(
        'Looks like there is something wrong with the verification token, please try registering again',
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    account.verified = new Date();
    account.verificationToken = null;

    const result = await this.repository.update(account.id, account);
    if (!result) {
      return new CMessage('Something went wrong trying to update', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { token: this.createToken(account), user: this.mapUserToSummary(account) };
  }

  async forgotPassword(email: string, host: string): Promise<CMessage> {
    const account = await this.repository.findOne({ where: { email } });

    if (account.loginProvider.toLocaleLowerCase() === 'google') {
      return { message: 'Please login through your google account', status: HttpStatus.UNAUTHORIZED };
    }

    if (!account.verified) {
      return { message: 'Need to verify the account first', status: HttpStatus.PRECONDITION_REQUIRED };
    }

    account.resetToken = randomBytes(16).toString('hex');
    const date = new Date().getTime() + 2 * 60 * 60 * 1000;
    account.resetTokenExpires = new Date(date);

    this.repository.update(account.id, account);

    const result = await this.mailService.sendPasswordReset(email, account.givenNames, account.resetToken, host);

    if (!!result && !!result.accepted.length) {
      return { message: 'Please check your registered email account for password reset instructions', status: HttpStatus.OK };
    }

    return { message: 'Looks like that did not work as intended, try with a different account', status: HttpStatus.NOT_ACCEPTABLE };
  }

  /** Reset tokens are a one time, time limited token to enable a password reset action to occur */
  async validateResetToken(verify: IVerifyTokenRequest): Promise<boolean> {
    const account = await this.repository.findOne({ where: { email: verify.email, resetToken: verify.token } });
    if (!!account && !!account.resetTokenExpires && account.resetTokenExpires.getTime() > new Date().getTime()) {
      return true;
    }

    return false;
  }

  /** Takes the reset token and email and applies a hashed copy of the users new password. */
  async resetPassword(reset: IResetPasswordRequest): Promise<IUserToken | CMessage> {
    const account = await this.repository.findOne({ where: { email: reset.email, resetToken: reset.token } });
    if (!account || !account.resetTokenExpires) {
      return { message: 'No account with that email and token has been found.', status: HttpStatus.NOT_FOUND };
    }

    if (account.resetTokenExpires.getTime() < new Date().getTime()) {
      return { message: 'Reset token has expired, please get new link and try again.', status: HttpStatus.RESET_CONTENT };
    }

    const currentDateTime = new Date();
    account.passwordHash = await bcrypt.hash(reset.password, 10);
    account.passwordLastReset = new Date();
    account.lastLogin = currentDateTime;
    account.resetToken = null;
    account.resetTokenExpires = null;
    account.failedLoginAttempt = 0;
    account.timesLoggedIn++;
    if (!account.firstLogin) {
      account.firstLogin = currentDateTime;
    }

    const result = await this.repository.update(account.id, account);
    if (!result) {
      return { message: 'Something went pear shaped.', status: HttpStatus.INTERNAL_SERVER_ERROR };
    }

    return { token: this.createToken(account), user: this.mapUserToSummary(account) };
  }

  private createToken(user: User): string {
    return this.jwtTokenService.sign({
      username: user.email,
      sub: user.id,
      name: `${user.givenNames} ${user.familyName}`,
      admin: user.isAdmin
    });
  }
}
