import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { DebtorResponseDto } from '../dtos/debtor-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindManyDebtorsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Service for retrieving multiple debtors
   * @class FindManyDebtorsService
   */

  /**
   * Service to retrieve multiple debtors from the database
   *
   * @remarks
   * This service provides functionality to fetch all debtors with their associated client information
   * @returns Promise<DebtorResponseDto[]> - Array of debtor objects transformed into DTOs
   * @throws {MyServicesError}
   * - With status NOT_FOUND (404) if no debtors are found in the database
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
          client: {
            select: {
              id: true,
              internalRef: true,
              name: true,
            },
          },
        },
      });

      if (!existingDebtors) {
        throw new MyServicesError('No debtors found', HttpStatus.NOT_FOUND);
      }

      return plainToInstance(DebtorResponseDto, existingDebtors);
    } catch (error) {
      if (error instanceof Error) {
        throw new MyServicesError(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new InternalServerErrorException(
        'An unknown error occurred while try deleting the debtor',
      );
    }
  }
}
