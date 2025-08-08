import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../interface/token-payload.interface';

@Injectable()
export class AuthLoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(user: User, response: Response) {
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
