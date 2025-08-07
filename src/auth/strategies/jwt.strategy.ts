import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type UserPayload = {
  id: string;
};

export type RequestWithUser = {
  user: UserPayload;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        configService.get<string>('JWT_ACCESS_SECRET') ?? 'default-secret',
    });
  }

  async validate(payload: UserPayload): Promise<UserPayload> {
    return { id: payload.id };
  }
}
