import { HttpStatus, Injectable } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
/**
 * Service responsible for verifying user refresh tokens
 *
 * This service provides functionality to validate refresh tokens against stored user data
 * by comparing the provided refresh token with the hashed token stored in the database.
 *
 * @class VerifyUserRefreshTokenService
 *
 */
export class VerifyUserRefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verifies a user's refresh token against the stored hash
   *
   * @param refreshToken - The refresh token to verify
   * @param userId - The ID of the user to verify the token for
   * @returns The user object if verification is successful
   * @throws {MyServicesError} When user is not found or token is invalid
   */
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
