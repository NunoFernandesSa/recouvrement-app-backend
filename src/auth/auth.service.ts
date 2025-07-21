import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { isPasswordValid } from 'src/utils/is-password-valid';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(authBody: LoginDto): Promise<any> {
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

      return await this.authenticateUser(existingUser.id);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Invalid credentials';
      throw new UnauthorizedException(message);
    }
  }

  // -----|||-------------------------|||----
  // -----|||---- Private methods ----|||----
  // -----|||-------------------------|||----

  /**
   * Authenticates a user and generates a JWT access token
   * @param userId - The unique identifier of the user to authenticate
   * @returns A promise that resolves to an object containing the JWT access token
   * @throws {UnauthorizedException} If the authentication fails
   */
  async authenticateUser(userId: string): Promise<{ access_token: string }> {
    const payload = { userId };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }
}
