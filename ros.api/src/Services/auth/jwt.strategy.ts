import { IUserJwtPayload } from '@models/user.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_KEY')
    });
  }

  validate(payload: any): IUserJwtPayload {
    return { userId: payload.sub, username: payload.username, name: payload.name, isAdmin: payload.admin };
  }
}
