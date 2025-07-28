import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma.service';
import { CreateClientResponseDto } from '../dtos/create-client-response.dto';
import MyServicesError from 'src/errors/my-services.error';

@Injectable()
export class FindOneClientService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Service for retrieving a client from the system
   * @class FindOneClientService
   */

  /**
   * Finds a single client by their ID
   * @param id - The unique identifier of the client to find
   * @returns The client data transformed to CreateClientResponseDto
   * @throws HttpException if client is not found
   * @throws ClientsServiceError if there is an error during retrieval
   */
  async findOneClient(id: string) {
    try {
      // Find the client by ID in the database
      const existingClient = await this.prisma.client.findUnique({
        where: { id },
        select: {
          id: true,
          internalRef: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          country: true,
          zipcode: true,
          type: true,
          notes: true,
          user: {
            select: {
              id: true,
            },
          },
          debtor: {
            select: {
              id: true,
            },
          },
        },
      });

      // If the client does not exist in the database, throw an error
      if (!existingClient) {
        throw new HttpException('Client not found', 404);
      }

      return plainToInstance(CreateClientResponseDto, existingClient);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new MyServicesError(
        `Failed to retrieve clients. Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
