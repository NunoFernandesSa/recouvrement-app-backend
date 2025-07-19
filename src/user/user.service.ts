import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UserServiceError from 'src/errors/user-service.error';
import { PrismaService } from 'src/prisma.service';
import { GetUsersDto } from './dto/get-users.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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
   * @returns {Promise<any>} A promise that resolves to the user object with the given ID.
   * @throws {UserServiceError} Throws an error if the user is not found or if there's a failure during retrieval.
   * @throws {HttpException} Re-throws any HttpException encountered during the process.
   */
  async getUserById(id: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
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

      return user;
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
