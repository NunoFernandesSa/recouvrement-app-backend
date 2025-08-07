import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './jwt.strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req?.headers?.authorization?.startsWith('Bearer ')) {
            return req.headers.authorization.split(' ')[1];
          }
          return null;
        },
      ]),
      secretOrKey:
        configService.get<string>('JWT_REFRESH_SECRET') || 'default-secret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: UserPayload): Promise<UserPayload> {
    const refreshToken = req.headers.authorization?.split(' ')[1];

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (refreshToken !== user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (isValid === false) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { id: payload.id };
  }
}
