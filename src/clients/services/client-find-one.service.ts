import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClientsServiceError } from 'src/errors/clients-service-error';
import { PrismaService } from 'src/prisma.service';
import { CreateClientResponseDto } from '../dto/create-client-response.dto';

@Injectable()
export class FindOneClientService {
  constructor(private readonly prisma: PrismaService) {}

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

      throw new ClientsServiceError(
        `Failed to retrieve clients. Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
