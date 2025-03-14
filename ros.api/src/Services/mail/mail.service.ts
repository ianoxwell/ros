import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private config: ConfigService) {}

  async sendPasswordReset(email: string, name: string, token: string, host: string): Promise<any> {
    host = host || this.config.get('WEBSITE');
    const url = `${host}/account/reset-password?token=${token}&email=${email}`;

    return await this.mailerService.sendMail({
      to: email,
      subject: 'ROS - password reset request',
      template: '../../../../Services/mail/templates/password-reset', // `.hbs` extension is appended automatically
      context: {
        name,
        url
      }
    });
  }

  async sendRegistrationEmail(email: string, name: string, verificationToken: string, host: string): Promise<any> {
    host = host || this.config.get('WEBSITE');
    const url = `${host}/verify-email?token=${verificationToken}&email=${email}`;

    return await this.mailerService.sendMail({
      to: email,
      subject: 'ROS - email verification',
      template: '../../../../Services/mail/templates/confirmation', // `.hbs` extension is appended automatically
      context: {
        name,
        url
      }
    });
  }
}
