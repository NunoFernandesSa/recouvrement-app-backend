import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DebtResponseDto } from '../dtos/debt-response.dto';
import MyServicesError from 'src/errors/my-services.error';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindOneDebtService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Finds a single debt by its ID on the database
   * @class FindOneDebtService
   */

  /**
   * Finds a debt by its ID
   * @param id - The unique identifier of the debt to find
   * @returns A promise that resolves to the debt response DTO
   * @throws {MyServicesError} When debt is not found or if an error occurs during retrieval
   */
  async findOneDebt(id: string): Promise<DebtResponseDto> {
    try {
      // find the debt in the database and check if it exists
      const existingDebt = await this.prisma.debt.findUnique({
        where: { id },
        select: {
          id: true,
          invoiceNumber: true,
          amountHT: true,
          amountTTC: true,
          amountPaid: true,
          amountRemaining: true,
          amountOverdue: true,
          dueDate: true,
          state: true,
          notes: true,
          lastReminderSentAt: true,
          createdAt: true,
          updatedAt: true,
          debtor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!existingDebt) {
        throw new MyServicesError(
          `Debt with id '${id}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return plainToInstance(DebtResponseDto, existingDebt);
    } catch (error) {
      if (error instanceof Error) {
        throw new MyServicesError(error.message);
      }

      throw new MyServicesError(
        'An unexpected error occurred while retrieving the debt',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
