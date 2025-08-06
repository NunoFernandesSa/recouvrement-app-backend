import { HttpStatus, Injectable } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { DebtorResponseDto } from '../dtos/debtor-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindManyDebtorsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Service for retrieving multiple debtors from the database
   * @class FindManyDebtorsService
   */

  /**
   * Retrieves all debtors from the database
   *
   * @description
   * Fetches all debtors with their basic information including:
   * - Reference number
   * - Name and contact details (email, phone)
   * - Address information (street, city, zipcode, country)
   * - Business details (SIRET number, type)
   * - Status and timestamps
   *
   * @returns Promise<DebtorResponseDto[]> Array of debtor records
   * @throws {MyServicesError}
   * - NOT_FOUND (404) if no debtors exist in the database
   * - INTERNAL_SERVER_ERROR (500) if a database error occurs during the operation
   */
  async findManyDebtors(): Promise<DebtorResponseDto[]> {
    try {
      const existingDebtors = await this.prisma.debtor.findMany({
        select: {
          id: true,
          reference: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          zipcode: true,
          country: true,
          siret: true,
          type: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!existingDebtors) {
        throw new MyServicesError('No debtors found', HttpStatus.NOT_FOUND);
      }

      return plainToInstance(DebtorResponseDto, existingDebtors);
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while trying to find debtors',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
