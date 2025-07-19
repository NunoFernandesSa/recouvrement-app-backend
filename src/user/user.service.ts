import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UserServiceError from 'src/errors/user-service.error';
import { PrismaService } from 'src/prisma.service';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<CreateUserDto> {
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
     * Hashes the password using bcrypt and creates a new user in the database.
     * Returns the created user object.
     */
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.prisma.user.create({
        data: {
          name: data.name ?? null,
          email: data.email,
          password: hashedPassword,
        },
      });
      return user;
    } catch (error) {
      /**
       * If the error is an instance of HttpException, re-throws it to be handled by the controller.
       */
      if (error instanceof HttpException) {
        throw error;
      }

      /**
       * If the error is not an instance of HttpException, throws a custom error with a custom message and status code.
       */
      throw new UserServiceError(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieves a list of users from the database.
   *
   * @returns {Promise<GetUsersDto[]>} A promise that resolves to an array of user objects.
   * @throws {UserServiceError} Throws an error if no users are found or if there's a failure during retrieval.
   * @throws {HttpException} Re-throws any HttpException encountered during the process.
   */
  async getUsers(): Promise<GetUsersDto[]> {
    try {
      const userList = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      // Transform the data to match the GetUsersDto type
      const transformedUserList = userList.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: [user.role], // Convert the enum value to an array of strings
      }));

      if (transformedUserList.length === 0) {
        throw new UserServiceError('No users found', HttpStatus.NOT_FOUND);
      }

      return transformedUserList;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new UserServiceError(
        `Failed to retrieve users. Error: ${error.message || error}`,
      );
    }
  }

  /**
   * Retrieves a user by their ID from the database.
   *
   * @param {string} id The ID of the user to retrieve.
   * @returns {Promise<GetUsersDto>} A promise that resolves to the user object with the given ID.
   * @throws {UserServiceError} Throws an error if the user is not found or if there's a failure during retrieval.
   * @throws {HttpException} Re-throws any HttpException encountered during the process.
   */
  async getUserById(id: string): Promise<GetUsersDto | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      if (!user) {
        throw new UserServiceError('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.id !== id) {
        throw new UserServiceError('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: [user.role], // Convert the Role enum to an array of strings
      };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new UserServiceError(
        `Failed to retrieve user. Error: ${e.message || e}`,
      );
    }
  }
}
