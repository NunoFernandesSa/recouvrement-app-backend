import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UserServiceError from 'src/errors/user-service.error';
import { PrismaService } from 'src/prisma.service';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import bcrypt from 'bcrypt';
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
     * Hashes the password using bcrypt.
     * If the hashing fails, throws an error with a custom message and status code.
     */
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(data.password, 10);
    } catch (error: unknown) {
      console.log('Hashing error:', error);
      throw new UserServiceError(
        'Failed to hash password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    /**
     * Creates a new user in the database with the provided data.
     * If the creation fails, throws an error with a custom message and status code.
     */
    try {
      const user = await this.prisma.user.create({
        data: {
          name: data.name ?? null,
          email: data.email,
          password: hashedPassword,
        },
      });

      // returns the created user object without the password
      return plainToInstance(CreateUserResponseDto, user);
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
   * @param {string} id The ID of the user to update
   * @param {UpdateUserDto} updateUserDto The data to update the user with
   * @returns {Promise<CreateUserResponseDto>} The updated user object
   * @throws {UserServiceError} Throws an error if the user is not found or if there's a failure during update
   * @throws {HttpException} Re-throws any HttpException encountered during the process
   */
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<CreateUserResponseDto> {
    // ----- Check if the user exists -----
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new UserServiceError('User not found', HttpStatus.NOT_FOUND);
    }

    // ----- Check if the email is already taken by other user -----
    if (updateUserDto.email && existingUser.email !== existingUser.email) {
      const emailTaken = await this.emailExists(updateUserDto.email, id);
      if (emailTaken) {
        throw new UserServiceError('Email already in use', HttpStatus.CONFLICT);
      }
    }

    // ----- Update the user -----
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          name: updateUserDto.name ?? existingUser.name ?? null,
          email: updateUserDto.email ?? existingUser.email,
          role: updateUserDto.role ?? existingUser.role,
        },
      });

      // ----- returns the updated user object without the password -----
      const userDataUpdated = plainToInstance(
        CreateUserResponseDto,
        updatedUser,
        {
          excludeExtraneousValues: true,
        },
      );
      return userDataUpdated;
    } catch (error: unknown) {
      // Prisma error handling
      if (error instanceof PrismaClientKnownRequestError) {
        // Code d'erreur de contrainte unique
        if (error.code === 'P2002') {
          throw new UserServiceError(
            'Email already in use',
            HttpStatus.CONFLICT, // 409
          );
        }
      }

      // Other errors
      if (error instanceof Error) {
        throw new UserServiceError(
          `Failed to update user. Error: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Unknown errors
      /**
       * If the error is not an instance of HttpException, throws a custom error with a custom message and status code.
       */
      throw new UserServiceError(
        'Failed to update user due to unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
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
    email: string,
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
