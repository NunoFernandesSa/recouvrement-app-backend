import { AuthRegisterService } from './services/auth-register.service';
import { LoginDto } from './dtos/login.dto';
import { AuthLoginService } from './services/auth-login.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authLoginService: AuthLoginService,
    private readonly authRegisterService: AuthRegisterService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Authenticates a user by validating their login credentials
   * @param dto - The login credentials DTO containing username/email and password
   * @returns Promise containing the authentication result (e.g. access token)
   *
   * @throws UnauthorizedException if credentials are invalid
   *
   * @example
   * ```typescript
   * const loginDto = { email: 'user@example.com', password: 'password123' };
   * const result = await authService.userLogin(loginDto);
   * ```
   */
  async userLogin(dto: LoginDto): Promise<any> {
    return await this.authLoginService.login(dto);
  }

  /**
   * Authenticates a user by validating their credentials
   * @param dto - The login credentials DTO containing username/email and password
   * @returns Promise containing the authentication result (e.g. access token)
   *
   * @example
   * ```typescript
   * const loginDto = { email: 'user@example.com', password: 'password123' };
   * const result = await authService.userLogin(loginDto);
   * ```
   */
  async userRegister(dto: LoginDto): Promise<any> {
    return await this.authRegisterService.register(dto);
  }

  async getTokens(userId: string) {
    const payload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '5d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string) {
    const tokens = await this.getTokens(userId);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
