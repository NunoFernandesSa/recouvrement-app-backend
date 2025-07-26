import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import UserServiceError from 'src/common/errors/user-service.error';
import { PrismaService } from 'src/prisma.service';

@Injectable()
/**
 * Service responsible for handling user deletion operations.
 *
 * This service provides functionality to safely remove users from the system
 * while handling various edge cases and maintaining data integrity.
 */
export class UserDeleteService {
  constructor(private readonly prisma: PrismaService) {}

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
}
