import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { RequestWithUserId } from 'src/common/requestWithUserId.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // ----- login -----
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User login', description: 'User login' })
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return await this.authService.userLogin(loginDto);
  }

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

  // @UseGuards(RefreshTokenGuard)
  // @Post('refresh')
  // async refreshTokens(
  //   @Req() req: RequestWithUserId,
  //   @Body() body: RefreshTokenDto,
  // ) {
  //   return this.authService.refreshTokens(req.user.id, body.refreshToken);
  // }
}
