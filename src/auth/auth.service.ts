import { AuthRegisterService } from './services/auth-register.service';
import { LoginDto } from './dtos/login.dto';
import { AuthLoginService } from './services/auth-login.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from 'src/common/token-payload.interface';

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

  //
  // ---- tokens ----
  //
  async getTokens(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: TokenPayload = {
      sub: userId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await this.hashData(refreshToken);
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

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }
}
