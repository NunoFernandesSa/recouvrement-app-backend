import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
   * @returns {Promise<object>} A promise that resolves to an object containing a success message
   * @throws {ClientsServiceError} When client is not found or deletion fails
   * @throws {InternalServerErrorException} When an unknown error occurs
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
      } catch (_: unknown) {
        throw new MyServicesError(
          'Error deleting client',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (_: unknown) {
      throw new InternalServerErrorException(
        'An unknown error occurred while try deleting the client',
      );
    }
  }
}
