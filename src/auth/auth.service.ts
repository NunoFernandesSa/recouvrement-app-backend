import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthBody } from './auth.controller';
import { PrismaService } from 'src/prisma.service';

import { hashPassword, isPasswordValid } from './utils';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login({ authBody }: { authBody: AuthBody }): Promise<void> {
    // ----- Validate the user credentials -----

    try {
      // Hash the password
      const hashedPassword = await hashPassword({
        password: authBody.password,
      });
      console.log('Mot de passe:', hashedPassword, authBody.password);

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

      if (!isThisPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
    } catch (error: unknown) {
      throw new UnauthorizedException(error, 'Invalid credentials');
    }
  }
}
