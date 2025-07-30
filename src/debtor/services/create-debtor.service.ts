import { HttpStatus } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { CreateDebtorDto } from '../dtos/create-debtor.dto';
import { plainToInstance } from 'class-transformer';

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

    try {
      // Check if the debtor already exists
      const existingDebtor = await this.prisma.debtor.findFirst({
        where: {
          reference: data.reference,
        },
      });

      if (existingDebtor) {
        throw new MyServicesError('Debtor already exists', HttpStatus.CONFLICT);
      }

      // Create the debtor
      const createdDebtor = await this.prisma.debtor.create({
        data: data,
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
