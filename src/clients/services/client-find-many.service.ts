import { HttpException, Injectable } from '@nestjs/common';
import { ClientsServiceError } from 'src/errors/clients-service-error';
import { PrismaService } from 'src/prisma.service';
import { GetClientDto } from '../dto/get-client-dot';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindManyClientsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Service for retrieving clients from the database
   * @class FindManyClientsService
   */

  /**
   * Retrieves all clients from the database with their associated user and debtor IDs
   *
   * @description Fetches a list of all clients with their complete information including
   * internal references, contact details, and associated relationships
   *
   * @returns {Promise<GetClientDto[]>} A promise that resolves to an array of GetClientDto objects
   * containing the client information
   *
   * @throws {ClientsServiceError} When no clients are found in the database or if there's an error
   * during the retrieval process
   * @throws {HttpException} When an HTTP-related error occurs during the database query
   */
  async findAllClients(): Promise<GetClientDto[]> {
    try {
      const existingClients = await this.prisma.client.findMany({
        select: {
          id: true,
          internalRef: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          zipcode: true,
          country: true,
          siret: true,
          type: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
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

      if (existingClients.length === 0) {
        throw new ClientsServiceError('No clients found in the database');
      }

      return plainToInstance(GetClientDto, existingClients);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new ClientsServiceError(
        `Failed to retrieve clients. Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
