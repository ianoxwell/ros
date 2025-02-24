import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private config: ConfigService) {}

  async sendPasswordReset(email: string, name: string, token: string): Promise<any> {
    // URL is in reference to the FE github pages site - not the API
    const url = `${this.config.get('WEBSITE')}/account/reset-password?token=${token}&email=${email}`;

    return await this.mailerService.sendMail({
      to: email,
      subject: 'Recipe Ordering Simplified - password reset request',
      template: '../../../../Services/mail/templates/password-reset', // `.hbs` extension is appended automatically
      context: {
        name,
        url
      }
    });
  }
}
