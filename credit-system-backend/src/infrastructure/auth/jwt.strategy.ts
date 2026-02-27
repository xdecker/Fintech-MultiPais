import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || '774437823accca4e9d923b76003f42c7',
    });
  }

  async validate(payload: any) {
    // payload.sub = userId
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
