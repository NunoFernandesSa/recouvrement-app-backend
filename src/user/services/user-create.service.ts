import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UserServiceError from 'src/errors/user-service.error';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserResponseDto } from '../dtos/create-user-response.dto';

import { hashPassword } from 'src/utils/hash-password';

@Injectable()
/**
 * Service responsible for creating new users in the application.
 *
 * This service handles user creation operations including:
 * - Validating user input data
 * - Checking for existing users
 * - Password hashing
 * - Database operations
 *
 * @class UserCreateService
 * @injectable
 */
export class UserCreateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new user in the database.
   *
   * @param data The data to create the user with.
   * @returns {Promise<CreateUserResponseDto>} The created user object without the password.
   * @throws {UserServiceError} Throws an error if the email and password are not provided, or if a user with the provided email already exists.
   * @throws {HttpException} Re-throws any HttpException encountered during the process.
   */
  async createUser(data: CreateUserDto): Promise<CreateUserResponseDto> {
    /**
     * Checks if the email and password are provided in the request data.
     * If not, throws an error with a custom message and status code.
     */
    if (!data.email || !data.password) {
      throw new UserServiceError(
        'Email and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    /**
     * Checks if a user with the provided email already exists in the database.
     */
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    /**
     * If a user with the provided email already exists, throws an error with a custom message and status code.
     */
    if (existingUser) {
      throw new UserServiceError(
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );
    }

    /**
     * Creates a new user in the database with the provided data.
     * If the creation fails, throws an error with a custom message and status code.
     */
    try {
      /**
       * Hashes the password using bcrypt.
       * If the hashing fails, throws an error with a custom message and status code.
       */
      const hashedPassword = await hashPassword(data.password);

      if (!hashedPassword) {
        throw new UserServiceError(
          'Failed to hash password',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // ----- Creates the user in the database -----
      const user = await this.prisma.user.create({
        data: {
          name: data.name ?? null,
          email: data.email,
          password: hashedPassword,
        },
      });

      // returns the created user object without the password
      const userData = plainToInstance(CreateUserResponseDto, user, {
        excludeExtraneousValues: true,
      });
      return userData;
    } catch (error: unknown) {
      // If the error is an instance of HttpException, re-throws it to be handled by the controller.
      if (error instanceof HttpException) {
        throw error;
      }

      // If the error is not an instance of HttpException, throws a custom error with a custom message and status code.
      throw new UserServiceError(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
