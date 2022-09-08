import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from 'src/shared/types/payload.type';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt_access') {
  constructor(config: ConfigService) {
    super({
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request: Request) => {
      //     const data = request?.cookies['access_token'];
      //     console.log('ddata:', data);
      //     return data;
      //   },
      // ]),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_ACCESS_TOKEN'),
    });
  }

  validate(payload: any) {
    console.log('payload:', payload);
    return payload;
  }
}
