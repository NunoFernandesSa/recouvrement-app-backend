import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import UserServiceError from 'src/errors/user-service.error';
import { PrismaService } from 'src/prisma.service';
import { plainToInstance } from 'class-transformer';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
/**
 * Service responsible for handling user update and deletion operations.
 *
 * This service provides methods to:
 * - Update existing user information (name, email, role)
 * - Delete users from the system
 * - Validate email uniqueness
 *
 * It uses Prisma as the database ORM and implements various error checks
 * to ensure data integrity and proper error handling.
 */
export class UserUpdateService {
  constructor(private readonly prisma: PrismaService) {}

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
   * @returns {Promise<UpdateUserDto>} A promise that resolves to the updated user data,
   *                                  transformed to exclude sensitive information
   * @throws {UserServiceError} When user is not found or email is already taken
   * @throws {BadRequestException} When there's a unique constraint violation
   * @throws {InternalServerErrorException} When an unexpected error occurs during update
   */
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
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
        throw new UserServiceError(
          'This email address is already associated with an account. Please use a different email address.',
          HttpStatus.CONFLICT,
        );
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
      const userDataUpdated = plainToInstance(UpdateUserDto, updatedUser, {
        excludeExtraneousValues: true,
      });

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
