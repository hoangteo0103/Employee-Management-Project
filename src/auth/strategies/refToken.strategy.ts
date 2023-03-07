import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { constantsJWT } from '../jwt-secret';

const extactFromCookie = (request) => {
  let token = null;
  if (request && request.cookies) token = request.cookies['refresh_token'];
  return token;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extactFromCookie]),
      secretOrKey: constantsJWT[1],
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.cookies['refresh_token'];
    return { ...payload, refreshToken };
  }
}
