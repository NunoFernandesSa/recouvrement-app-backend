import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { isPasswordValid } from 'src/utils/is-password-valid';
import { LoginDto } from '../dtos/login.dto';
import MyServicesError from 'src/errors/my-services.error';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthLoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user with their email and password
   * @param authBody - The login credentials containing email and password
   * @returns A promise that resolves to an object containing the JWT access token
   * @throws {UnauthorizedException} If the credentials are invalid, user doesn't exist,
   *         user is inactive, or password is incorrect
   */
  async login(dto: LoginDto): Promise<any> {
    // ----- Validate the user credentials -----
    try {
      // Find the user by email
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      // Check the user exi ifsts
      if (!existingUser) {
        throw new UnauthorizedException('This user does not exist');
      }

      // Check if the user is active
      if (!existingUser.isActive) {
        throw new UnauthorizedException('This user is not active');
      }

      // Check if the password is correct
      const isThisPasswordValid = await isPasswordValid(
        dto.password,
        existingUser.password,
      );

      // if password is not valid, throw an error
      if (!isThisPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      // Generate the 2 tokens
      const payload = { email: existingUser.email, sub: existingUser.id };
      const accessToken: string = this.jwtService.sign(payload);
      const refreshToken: string = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '5d',
      });

      // send refresh token to BDD
      await this.prisma.user.update({
        where: { id: existingUser.id },
        data: { refreshToken: refreshToken },
      });

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error ? error.message : 'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
