import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'generated/prisma';
import { Response } from 'express';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ----- login -----
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User login', description: 'User login' })
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.userLogin(user, res);
  }

  // ----- register -----
  @Post('register')
  @ApiOperation({ summary: 'User register', description: 'User register' })
  async register(
    @Body() loginDto: LoginDto,
  ): Promise<{ message: string; user: any }> {
    return await this.authService.userRegister(loginDto);
  }

  // ----- refresh token -----
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.userLogin(user, res);
  }
}
