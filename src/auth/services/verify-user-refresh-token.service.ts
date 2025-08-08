import { HttpStatus, Injectable } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VerifyUserRefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyUserRefreshToken(refreshToken: string, userId: string) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!existingUser) {
        throw new MyServicesError('User not found', HttpStatus.NOT_FOUND);
      }

      const authenticated = await bcrypt.compare(
        refreshToken,
        existingUser.refreshToken as string,
      );

      if (!authenticated) {
        throw new MyServicesError(
          'Invalid refresh token or token has expired',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return existingUser;
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error ? error.message : 'Refresh token is not valid',
      );
    }
  }
}
