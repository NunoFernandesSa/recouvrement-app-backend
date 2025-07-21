import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UserServiceError from 'src/errors/user-service.error';
import { PrismaService } from 'src/prisma.service';
import { GetUsersDto } from '../dtos/get-users.dto';

@Injectable()
/**
 * Service responsible for retrieving individual user records from the database.
 *
 * This service provides methods to fetch a single user by their unique identifier,
 * handling all database interactions and error cases appropriately. It ensures
 * proper validation of user existence and handles potential errors during the
 * retrieval process.
 *
 * The service integrates with Prisma ORM to perform database operations and
 * implements error handling to provide meaningful feedback when issues occur.
 *
 * @class UserReadOneService
 * @throws {UserServiceError} When user lookup fails or returns invalid data
 * @throws {HttpException} When HTTP-related errors occur during processing
 */
export class UserReadOneService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves a user by their ID from the database.
   *
   * @param {string} id - Unique identifier of the user to retrieve
   * @returns {Promise<GetUsersDto>} User object containing id, email, name, role, isActive status, timestamps, associated clients and actions
   * @throws {UserServiceError} When user is not found or retrieval fails
   * @throws {HttpException} When an HTTP-related error occurs during processing
   */
  async getUserById(id: string): Promise<GetUsersDto> {
    try {
      // Retrieve the user from the database
      const user = (await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          clients: {
            select: {
              id: true,
              name: true,
            },
          },
          actions: {
            select: {
              title: true,
            },
          },
        },
      })) as GetUsersDto;

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
        clients: user.clients,
        actions: user.actions,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new UserServiceError(
        `Failed to retrieve user. Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
