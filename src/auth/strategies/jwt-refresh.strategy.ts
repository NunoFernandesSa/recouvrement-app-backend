import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interface/token-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
/**
 * Strategy for handling JWT refresh token authentication
 *
 * This strategy validates refresh tokens stored in cookies and verifies them
 * against the user's stored refresh token. It extends Passport's JWT strategy
 * and is specifically used for refresh token flows.
 *
 * @class JwtRefreshStrategy
 * @extends PassportStrategy
 */
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.RefreshToken as string,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  /**
   * Validates the refresh token and payload
   *
   * @param req - Express Request object containing the refresh token in cookies
   * @param payload - JWT token payload containing user information
   * @returns Promise resolving to the validated user if token is valid
   * @throws UnauthorizedException if token validation fails
   */
  async validate(req: Request, payload: TokenPayload) {
    return this.authService.verifyUserRefreshToken(
      req.cookies?.RefreshToken as string,
      payload.id,
    );
  }
}
