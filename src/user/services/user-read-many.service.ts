import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UserServiceError from 'src/common/errors/user-service.error';
import { PrismaService } from 'src/prisma.service';
import { GetUsersDto } from '../dtos/get-users.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
/**
 * Service responsible for retrieving multiple user records from the database.
 *
 * This service provides functionality to fetch a list of users with their basic information
 * including ID, email, name and role. It handles data transformation and error cases.
 *
 * @class UserReadManyService
 */
export class UserReadManyService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves a list of users from the database with their basic information.
   *
   * The returned users contain their ID, email, name and role.
   * If no users are found, throws a NOT_FOUND error.
   *
   * @returns {Promise<GetUsersDto[]>} Array of user objects containing id, email, name and role
   * @throws {UserServiceError} When no users are found (404) or database operation fails
   * @throws {HttpException} Re-throws any NestJS HTTP exceptions that occur
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
}
