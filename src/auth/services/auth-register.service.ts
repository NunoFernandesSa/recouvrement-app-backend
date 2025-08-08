import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { hashPassword } from 'src/utils/hash-password';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
/**
 * Service handling user registration and account creation
 *
 * @class AuthRegisterService
 * @description Manages new user registration process including:
 * - Email validation
 * - Password hashing and secure storage
 * - User account creation
 * - Duplicate account prevention
 */
export class AuthRegisterService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new user in the database with the provided credentials
   *
   * @param authBody - The registration data containing:
   *                   - email: User's email address
   *                   - password: User's password (will be hashed)
   *                   - name: Optional user's name
   * @returns Object containing:
   *          - message: Success message
   *          - user: Created user object with id, name and email
   * @throws UnauthorizedException if user already exists or registration fails
   */
  async register(authBody: LoginDto): Promise<{ message: string; user: any }> {
    // ----- Validate the user credentials -----
    try {
      // Find the user by email
      const existingUser = await this.prisma.user.findUnique({
        where: { email: authBody.email },
      });

      // Check if the user exists, If the user exists, throw an UnauthorizedException
      if (existingUser) {
        throw new UnauthorizedException('This user already exists.');
      }

      // hash the password
      const hashUserPassword: Promise<string> = hashPassword(authBody.password);

      // Create the user in the database
      const createdUser = await this.prisma.user.create({
        data: {
          name: authBody.name ?? undefined,
          email: authBody.email,
          password: await hashUserPassword,
        },
      });

      return {
        message: 'User registered successfully',
        user: {
          id: createdUser.id,
          name: createdUser.name ?? '',
          email: createdUser.email,
        },
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to register user. Please check your credentials and try again.';
      throw new UnauthorizedException(message);
    }
  }
}
