import { HttpStatus, Injectable } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DeleteClientService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Service for deleting clients from the system
   * @class DeleteClientService
   */

  /**
   * Deletes a client from the database by their ID
   * @param {string} id - The unique identifier of the client to delete
   * @returns {Promise<{message: string, success: boolean}>} A promise that resolves to an object containing a success message and status
   * @throws {MyServicesError} When client is not found (404) or deletion fails (500)
   */
  async deleteClient(id: string): Promise<object> {
    try {
      // Check if client exists
      const existingClient = await this.prisma.client.findUnique({
        where: { id },
      });

      if (!existingClient) {
        throw new MyServicesError(
          `Client with ID: |${id}| not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      try {
        // Delete client
        await this.prisma.client.delete({
          where: { id },
        });
        return { message: 'Client deleted successfully', success: true };
      } catch (error) {
        throw new MyServicesError(
          error instanceof Error
            ? error.message
            : `Error deleting client with ID: |${id}|`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : `An unknown error occurred while try deleting the client with ID: |${id}|`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
