import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../interface/token-payload.interface';

@Injectable()
/**
 * Service handling user authentication and login functionality
 *
 * @class AuthLoginService
 *
 * This service is responsible for:
 * - Generating JWT access tokens for authenticated users
 * - Setting secure HTTP-only cookies with the access token
 * - Managing token expiration and configuration
 */
export class AuthLoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Handles user login by generating and setting a JWT access token
   *
   * @param user - The authenticated user object
   * @param response - Express Response object to set cookies
   * @returns Promise that resolves when the login process is complete
   *
   * @throws {Error} If JWT configuration values are missing
   *
   * This method:
   * 1. Generates an expiration date for the access token
   * 2. Creates a token payload with the user ID
   * 3. Signs a JWT access token with configured secret and expiration
   * 4. Sets the token in a secure HTTP-only cookie
   */
  async login(user: User, response: Response): Promise<void> {
    const expiresAccesToken = new Date();
    expiresAccesToken.setMilliseconds(
      expiresAccesToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          ),
        ),
    );

    const tokenPayload: TokenPayload = {
      id: user.id,
    };

    const accessToken: string = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}ms`,
    });

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresAccesToken,
    });
  }
}
