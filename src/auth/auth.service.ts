import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthBody } from './auth.controller';
import { PrismaService } from 'src/prisma.service';

import { isPasswordValid } from './utils';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login({ authBody }: { authBody: AuthBody }): Promise<any> {
    // ----- Validate the user credentials -----

    try {
      // Find the user by email
      const existingUser = await this.prisma.user.findUnique({
        where: { email: authBody.email },
      });

      // Check if the user exists
      if (!existingUser) {
        throw new UnauthorizedException('This user does not exist');
      }

      // Check if the user is active
      if (!existingUser.isActive) {
        throw new UnauthorizedException('This user is not active');
      }

      // Check if the password is correct
      const isThisPasswordValid = await isPasswordValid(
        authBody.password,
        existingUser.password,
      );

      // if password is not valid, throw an error
      if (!isThisPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      return { user: existingUser.email };
    } catch (error: unknown) {
      throw new UnauthorizedException(error, 'Invalid credentials');
    }
  }
}
