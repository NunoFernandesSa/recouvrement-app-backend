import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UserServiceError from 'src/errors/user-service.error';
import { PrismaService } from 'src/prisma.service';
import { GetUsersDto } from '../dtos/get-users.dto';

@Injectable()
/**
 * Service responsible for retrieving individual user records from the database.
 *
 * This service provides methods to fetch a single user by their unique identifier,
 * handling all database interactions and error cases appropriately.
 *
 * @class UserReadOneService
 */
export class UserReadOneService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves a user by their ID from the database.
   *
   * @param {string} id - Unique identifier of the user to retrieve
   * @returns {Promise<GetUsersDto>} User object containing id, email, name, role and timestamps
   * @throws {UserServiceError} When user is not found or retrieval fails
   * @throws {HttpException} When an HTTP-related error occurs during processing
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
          isActive: true,
          createdAt: true,
          updatedAt: true,
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
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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
}
