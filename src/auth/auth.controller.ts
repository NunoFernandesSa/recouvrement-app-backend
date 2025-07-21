import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

export type AuthBody = {
  email: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ----- login -----
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() authBody: AuthBody) {
    return this.authService.login({ authBody });
  }
}
