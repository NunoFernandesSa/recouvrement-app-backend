import { PrismaService } from 'src/prisma.service';
import { UpdateClientDto } from '../dto/update-client.dto';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientsServiceError } from 'src/errors/clients-service-error';
import { ClientType } from 'generated/prisma';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateClientService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Service responsible for handling client update operations in the database.
   * Provides functionality to modify existing client records with new information.
   * @class UpdateClientService
   */

  /**
   * Updates an existing client's information in the database
   * @param id - The unique identifier (UUID) of the client to update
   * @param dto - UpdateClientDto containing the client's updated information including:
   *             name, email, phone, address, city, country, zipCode, siret, type, and notes
   * @returns An object containing:
   *          - data: The updated client information as UpdateClientDto
   *          - message: Success confirmation message
   * @throws ClientsServiceError if client is not found (404) or update operation fails (500)
   * @throws InternalServerErrorException for unexpected system errors during execution
   */
  async updateClient(
    id: string,
    dto: UpdateClientDto,
  ): Promise<{ data: UpdateClientDto; message: string }> {
    try {
      // Find the existing client by ID
      // If the client is not found, throw an error
      const existingClient = await this.prisma.client.findUnique({
        where: { id },
      });

      if (!existingClient) {
        throw new ClientsServiceError(
          `Client not found with ID: ${id}`,
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedClient = await this.prisma.client.update({
        where: { id },
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          address: dto.address,
          city: dto.city,
          country: dto.country,
          zipcode: dto.zipCode,
          siret: dto.siret,
          type: dto.type as ClientType,
          notes: dto.notes,
        },
      });

      const updatedData = plainToInstance(UpdateClientDto, updatedClient, {
        excludeExtraneousValues: true,
      });
      return { data: updatedData, message: 'Client updated successfully' };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unknown error occurred while updating the client',
      );
    }
  }
}
