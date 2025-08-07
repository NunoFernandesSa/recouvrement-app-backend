import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { isPasswordValid } from 'src/utils/is-password-valid';
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthLoginService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /**
   * Authenticates a user with their email and password
   * @param authBody - The login credentials containing email and password
   * @returns A promise that resolves to an object containing the JWT access token
   * @throws {UnauthorizedException} If the credentials are invalid, user doesn't exist,
   *         user is inactive, or password is incorrect
   */
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

      // Call authService to generate the 2 tokens
      const tokens = await this.authService.getTokens(existingUser.id);

      // Save the hashed refresh token
      await this.authService.updateRefreshToken(
        existingUser.id,
        tokens.refreshToken,
      );

      return tokens;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Invalid credentials';
      throw new UnauthorizedException(message);
    }
  }
}
