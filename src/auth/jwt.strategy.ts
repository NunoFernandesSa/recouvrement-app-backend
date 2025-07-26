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
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'default-secret',
    });
  }

  /**
   * JWT Strategy for authentication
   * @class JwtStrategy
   * @extends PassportStrategy
   *
   * This strategy validates JWT tokens and extracts the user payload
   * It uses the JWT_SECRET from environment variables for token verification
   *
   * @method validate - Validates the JWT payload and returns the user data
   * @param payload - The decoded JWT payload containing user information
   * @returns Promise<UserPayload> - Returns the validated user payload
   */
  async validate(payload: UserPayload): Promise<UserPayload> {
    return { id: payload.id };
  }
}
