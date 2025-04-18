import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLogger } from '@services/logger.service';
import { JwtStrategy } from 'src/Services/auth/jwt.strategy';
import { MailModule } from 'src/Services/mail/mail.module';
import { AccountController } from './account.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_KEY'),
        signOptions: { expiresIn: '2h' }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AccountController],
  providers: [UserService, JwtStrategy, CustomLogger],
  exports: [UserService]
})
export class UserModule {}
