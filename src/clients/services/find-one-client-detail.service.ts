import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma.service';
import { CreateClientResponseDto } from '../dtos/create-client-response.dto';
import MyServicesError from 'src/errors/my-services.error';

@Injectable()
export class FindOneClientDetailService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Service responsible for retrieving detailed client information from the database
   * @class FindOneClientDetailService
   */

  /**
   * Retrieves detailed information for a single client by their ID
   * @param id - The unique identifier of the client to retrieve
   * @returns A CreateClientResponseDto object containing the client's complete information
   * @throws HttpException with 404 status if no client is found with the given ID
   * @throws MyServicesError if a database or internal error occurs during the query
   */
  async findOneClientDetail(id: string) {
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
          siret: true,
          type: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
          debtor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              name: true,
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
        error instanceof Error
          ? error.message
          : `An unknown error occurred while finding the client detail`,
      );
    }
  }
}
