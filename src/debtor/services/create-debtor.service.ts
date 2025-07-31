import { HttpStatus, Injectable } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { CreateDebtorDto } from '../dtos/create-debtor.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateDebtorService {
  constructor(private readonly prisma: PrismaService) {}

  async createDebtor(data: CreateDebtorDto): Promise<CreateDebtorDto> {
    // ----- Validate the data -----

    // Check if the reference is not empty
    if (!data.reference) {
      throw new MyServicesError(
        'Reference is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if the name is not empty
    if (!data.name) {
      throw new MyServicesError('Name is required', HttpStatus.BAD_REQUEST);
    }

    // Check if the email is not empty
    if (data.email.length === 0) {
      throw new MyServicesError(
        'At least one email is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // ckeck if the clientId is not empty
    if (!data.clientId) {
      throw new MyServicesError(
        'Client ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }

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
      // Handle any errors that occurred during the process
      if (error instanceof Error) {
        throw error;
      }

      // Handle other types of errors
      throw new MyServicesError(
        'Failed to create debtor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
