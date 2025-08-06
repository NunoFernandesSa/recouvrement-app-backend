import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetClientDto } from '../dtos/get-client-dot';
import { plainToInstance } from 'class-transformer';
import MyServicesError from 'src/errors/my-services.error';

@Injectable()
export class FindManyClientsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Service for retrieving clients from the database
   * @class FindManyClientsService
   */

  /**
   * Retrieves all clients from the database
   *
   * @description Fetches a list of all clients with their basic information including:
   * - Internal references (id, internalRef)
   * - Contact details (name, email, phone)
   * - Address information (address, city, zipcode, country)
   * - Business details (siret, type)
   * - Additional info (notes)
   * - Timestamps (createdAt, updatedAt)
   *
   * @returns {Promise<GetClientDto[]>} A promise that resolves to an array of GetClientDto objects
   * containing the client information
   *
   * @throws {MyServicesError} When no clients are found (NOT_FOUND) or if there's an error
   * during the retrieval process (INTERNAL_SERVER_ERROR)
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
        },
      });

      if (existingClients.length === 0) {
        throw new MyServicesError(
          'No clients found in the database',
          HttpStatus.NOT_FOUND,
        );
      }

      return plainToInstance(GetClientDto, existingClients);
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : `Failed to retrieve clients. Error: ${String(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
