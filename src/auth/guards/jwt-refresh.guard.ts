import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard for handling JWT refresh token authentication
 *
 * This guard extends Passport's AuthGuard to use the 'jwt-refresh' strategy
 * for authenticating requests with refresh tokens. It is used to protect
 * routes that require refresh token validation.
 *
 * @class RefreshTokenGuard
 * @extends AuthGuard
 */
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {}
