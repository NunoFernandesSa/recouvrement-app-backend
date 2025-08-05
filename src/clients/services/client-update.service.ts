import { PrismaService } from 'src/prisma.service';
import { UpdateClientDto } from '../dtos/update-client.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ClientType } from 'generated/prisma';
import { plainToInstance } from 'class-transformer';
import MyServicesError from 'src/errors/my-services.error';

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
        throw new MyServicesError(
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
          notes: Array.isArray(dto.notes)
            ? dto.notes.filter(
                (note): note is string => typeof note === 'string',
              )
            : typeof dto.notes === 'string'
              ? [dto.notes]
              : [],
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
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while updating the client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
