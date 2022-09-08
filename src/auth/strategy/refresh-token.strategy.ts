import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from 'src/shared/types/payload.type';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['refresh_token'];

          return data.tokens;
        },
      ]),
      secretOrKey: config.get('JWT_REFRESH_TOKEN'),
      passReqToCallback: true, // request will be passed to verify callback
    });
  }

  validate(req: Request, payload: Payload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

    return { ...payload, refreshToken };
  }
}
