import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDebtDto } from '../dtos/create-debt.dto';
import { DebtResponseDto } from '../dtos/debt-response.dto';
import { PrismaService } from 'src/prisma.service';
import MyServicesError from 'src/errors/my-services.error';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateDebtService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Service responsible for creating and managing debt records
   * @class CreateDebtService
   */

  /**
   * Creates a new debt record in the system with associated debtor information
   * @param data - The debt information containing invoice number, amount, and debtor details
   * @returns A promise containing the created debt record with included debtor data
   * @throws {MyServicesError}
   * - CONFLICT (409) - When attempting to create a debt with an existing invoice number
   * - INTERNAL_SERVER_ERROR (500) - For any unexpected errors during debt creation
   * @remarks
   * - The debt is created with an initial state of 'PENDING'
   * - The debtor information is automatically linked to the debt record
   */
  async createDebt(data: CreateDebtDto): Promise<DebtResponseDto> {
    try {
      // check if debt already exists
      // if it does, throw an error
      const existingDebt = await this.prisma.debt.findFirst({
        where: {
          invoiceNumber: data.invoiceNumber,
        },
        select: {
          invoiceNumber: true,
        },
      });

      if (existingDebt) {
        throw new MyServicesError(
          'A debt with this invoice number already exists',
          HttpStatus.CONFLICT,
        );
      }

      // create the debt
      const createdDebt = await this.prisma.debt.create({
        data: {
          ...data,
          state: 'PENDING',
        },
        include: {
          debtor: true,
        },
      });

      // return the created debt with the correct type
      return plainToInstance(DebtResponseDto, createdDebt);
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : 'An unknow error occurred while creating the debt',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
