import { UpdateUserDto } from './dto/update-user.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import UserServiceError from 'src/errors/user-service.error';
import { PrismaService } from 'src/prisma.service';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
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
      const hashedPassword = await bcrypt.hash(data.password, 10);

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

      if (userList.length === 0) {
        throw new UserServiceError('No users found', HttpStatus.NOT_FOUND);
      }

      // Transform the data to match the GetUsersDto type
      const transformedUserList = userList.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: [user.role], // Convert the enum value to an array of strings
      }));

      return plainToInstance(GetUsersDto, transformedUserList);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new UserServiceError(
        `Failed to retrieve users. Error: ${error instanceof Error ? error.message : String(error)}`,
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
  async getUserById(id: string): Promise<GetUsersDto> {
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
        role: user.role, // Convert the Role enum to an array of strings
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new UserServiceError(
        `Failed to retrieve user. Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Updates an existing user's information in the database.
   *
   * This method allows updating a user's name, email and role. If updating email,
   * it checks if the new email is not already taken by another user.
   *
   * @param {string} id - The unique identifier of the user to update
   * @param {UpdateUserDto} updateUserDto - The DTO containing the fields to update:
   *                                       - name (optional): User's new name
   *                                       - email (optional): User's new email address
   *                                       - role (optional): User's new role
   * @returns {Promise<CreateUserResponseDto>} A promise that resolves to the updated user data,
   *                                          transformed to exclude sensitive information
   * @throws {UserServiceError} When user is not found or email is already taken
   * @throws {BadRequestException} When there's a unique constraint violation
   * @throws {InternalServerErrorException} When an unexpected error occurs during update
   */
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<CreateUserResponseDto> {
    /**
     * Checks if the user exists in the database.
     * If not, throws an error with a custom message and status code.
     */
    const existingUser = await this.prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      throw new UserServiceError('User not found', HttpStatus.NOT_FOUND);
    }

    /**
     * If the email is provided and different from the existing user's email,
     * checks if the email is already taken by another user.
     * If it is, throws an error with a custom message and status code.
     */
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailTaken = await this.emailExists(updateUserDto.email, id);
      if (emailTaken) {
        throw new UserServiceError('Email already in use', HttpStatus.CONFLICT);
      }
    }

    /**
     * Updates the user in the database.
     * If the update fails, throws an error with a custom message and status code.
     */
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          name: updateUserDto.name ?? existingUser.name ?? null,
          email: updateUserDto.email ?? existingUser.email,
          role: updateUserDto.role ?? existingUser.role,
        },
      });

      // format the data to match the CreateUserResponseDto type
      const userDataUpdated = plainToInstance(
        CreateUserResponseDto,
        updatedUser,
        { excludeExtraneousValues: true },
      );

      return userDataUpdated;
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Email already in use');
        }
      }

      throw new InternalServerErrorException(
        'An unknown error occurred while updating the user',
      );
    }
  }

  /**
   * Deletes a user from the database.
   *
   * @param {string} id - The unique identifier of the user to delete
   * @returns {Promise<object>} A promise that resolves to an object containing a success message
   * @throws {UserServiceError} When the user is not found
   * @throws {InternalServerErrorException} When an unexpected error occurs during deletion
   */
  async deleteUser(id: string): Promise<object> {
    /**
     * Checks if the user exists in the database.
     * If not, throws an error with a custom message and status code.
     */
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new UserServiceError('User not found', HttpStatus.NOT_FOUND);
    }

    /**
     * Deletes the user from the database.
     * If the deletion fails, throws an error with a custom message and status code.
     */
    try {
      await this.prisma.user.delete({ where: { id } });
      return { message: 'User deleted' };
    } catch (_: unknown) {
      throw new InternalServerErrorException(
        'An unknown error occurred while deleting the user',
      );
    }
  }

  // ----|||-------------------------|||----
  // ----|||---- Private methods ----|||----
  // ----|||-------------------------|||----

  /**
   * Checks if an email already exists in the database.
   *
   * @param {string} email - The email to check.
   * @param {string} [excludeUserId] - The ID of the user to exclude from the check.
   * @returns {Promise<boolean>} - A promise that resolves to true if the email exists, false otherwise.
   */
  private async emailExists(
    email: string | undefined,
    excludeUserId?: string,
  ): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        NOT: { id: excludeUserId },
      },
    });

    return !!user; // true si un utilisateur est trouvé
  }
}
