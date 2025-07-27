import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientsServiceError } from 'src/errors/clients-service-error';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DeleteClientService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteClient(id: string): Promise<object> {
    try {
      // Check if client exists
      const existingClient = await this.prisma.client.findUnique({
        where: { id },
      });

      if (!existingClient) {
        throw new ClientsServiceError(
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
        throw new ClientsServiceError(
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
