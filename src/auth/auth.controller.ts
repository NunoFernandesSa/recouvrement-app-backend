import { VerifyUserService } from './services/verifyUser.service';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly verifyUserService: VerifyUserService,
  ) {}

  // ----- login -----

  // ----- register -----
  @Post('register')
  @ApiOperation({ summary: 'User register', description: 'User register' })
  async register(@Body() loginDto: LoginDto): Promise<any> {
    return await this.authService.userRegister(loginDto);
  }
}
