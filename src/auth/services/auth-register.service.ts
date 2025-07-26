import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { hashPassword } from 'src/utils/hash-password';
import { LoginDto } from '../dtos/login.dto';
import { UserPayload } from 'src/auth/jwt.strategy';

@Injectable()
export class AuthRegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(authBody: LoginDto): Promise<any> {
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
      const hashUserPassword = hashPassword(authBody.password);

      // Create the user
      const createdUser = await this.prisma.user.create({
        data: {
          email: authBody.email,
          password: await hashUserPassword,
        },
      });

      return await this.authenticateUser({ id: createdUser.id });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to register user. Please check your credentials and try again.';
      throw new UnauthorizedException(message);
    }
  }

  // -----|||-------------------------|||----
  // -----|||---- Private methods ----|||----
  // -----|||-------------------------|||----

  /**
   * Authenticates a user and generates a JWT access token
   * @param {UserPayload} payload - Object containing the user ID to authenticate
   * @param {string} payload.userId - The unique identifier of the user
   * @returns {Promise<{access_token: string}>} A promise that resolves to an object containing the JWT access token
   * @throws {UnauthorizedException} If the authentication process fails
   */
  async authenticateUser({
    id: userId,
  }: UserPayload): Promise<{ access_token: string }> {
    const payload: UserPayload = { id: userId };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }
}
