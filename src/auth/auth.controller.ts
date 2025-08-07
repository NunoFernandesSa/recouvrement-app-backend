import { VerifyUserService } from './services/verifyUser.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { RequestWithUserId } from 'src/common/requestWithUserId.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
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
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User login', description: 'User login' })
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const user = await this.verifyUserService.verifyUser(
      loginDto.email,
      loginDto.password,
    );

    return await this.authService.userLogin(user);
  }

  // ----- register -----
  @Post('register')
  @ApiOperation({ summary: 'User register', description: 'User register' })
  async register(@Body() loginDto: LoginDto): Promise<any> {
    return await this.authService.userRegister(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async authenticateUser(@Req() req: RequestWithUserId): Promise<any> {
    if ('user' in req) {
      return await this.userService.findOne(req.user.id);
    }
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') token: string) {
    try {
      const payload: { email: string; sub: string } =
        await this.jwtService.verify(token, {
          secret: process.env.JWT_REFRESH_SECRET,
        });

      const newAccessToken = this.jwtService.sign(
        { email: payload.email, sub: payload.sub },
        { expiresIn: '15m' },
      );

      return { access_token: newAccessToken };
    } catch (_e) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
