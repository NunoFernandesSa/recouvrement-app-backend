import { HttpStatus, Injectable } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { CreateDebtorDto } from '../dtos/create-debtor.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateDebtorService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Service responsible for creating and managing debtor records
   * @class CreateDebtorService
   */

  /**
   * Creates a new debtor entry in the system
   * @param data - CreateDebtorDto containing the debtor information:
   *  - reference: Unique identifier for the debtor record
   *  - name: Full name or business name of the debtor
   *  - email: Array of contact email addresses (minimum 1 required)
   *  - phone: Array of contact phone numbers (optional)
   *  - address: Street address or mailing address (optional)
   *  - city: City/municipality of residence (optional)
   *  - zipcode: Postal/ZIP code (optional)
   *  - country: Country of residence or registration (optional)
   *  - siret: French business registration number (optional)
   *  - type: Classification of debtor (optional)
   *  - status: Current account status (optional)
   *  - clientId: Associated client account identifier
   * @throws {MyServicesError} BAD_REQUEST (400) - Missing or invalid required fields
   * @throws {MyServicesError} CONFLICT (409) - Duplicate debtor reference detected
   * @throws {MyServicesError} NOT_FOUND (404) - Referenced client account not found
   * @throws {MyServicesError} INTERNAL_SERVER_ERROR (500) - System or database error
   * @returns {Promise<CreateDebtorDto>} Newly created debtor record details
   */
  async createDebtor(data: CreateDebtorDto): Promise<CreateDebtorDto> {
    try {
      // Check if the debtor already exists
      const existingDebtor = await this.prisma.debtor.findFirst({
        where: {
          reference: data.reference,
        },
      });

      if (existingDebtor) {
        throw new MyServicesError(
          `Debtor '${data.reference}' already exists`,
          HttpStatus.CONFLICT,
        );
      }

      // check if the client exists in the database for the given clientId
      const clientExists = await this.prisma.client.findUnique({
        where: {
          id: data.clientId,
        },
      });
      if (!clientExists) {
        throw new MyServicesError('Client not found', HttpStatus.NOT_FOUND);
      }

      // Create the debtor
      const createdDebtor = await this.prisma.debtor.create({
        data: {
          reference: data.reference,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          zipcode: data.zipcode,
          country: data.country,
          siret: data.siret,
          type: data.type,
          status: data.status,
          client: {
            connect: {
              id: data.clientId,
            },
          },
        },
      });

      return plainToInstance(CreateDebtorDto, createdDebtor);
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while trying to create debtor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
