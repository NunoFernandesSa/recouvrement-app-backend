import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard for handling JWT authentication
 *
 * This guard extends Passport's AuthGuard to use the 'jwt' strategy
 * for authenticating requests with JWT tokens. It is used to protect
 * routes that require JWT validation.
 *
 * @class JwtAuthGuard
 * @extends AuthGuard
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
