import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard for handling local authentication
 *
 * This guard extends Passport's AuthGuard to use the 'local' strategy
 * for authenticating requests with username and password. It is used to protect
 * routes that require local authentication.
 *
 * @class LocalAuthGuard
 * @extends AuthGuard
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
