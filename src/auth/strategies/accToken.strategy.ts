import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { constantsJWT } from '../jwt-secret';

type JwtPayload = {
  sub: string;
  username: string;
};

const extactFromCookie = request => {
  let token = null
  if (request && request.cookies) token = request.cookies["access_token"]
  return token
}


@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extactFromCookie]),
      secretOrKey:constantsJWT[0],
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}