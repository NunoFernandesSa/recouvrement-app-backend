import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DebtResponseDto } from '../dtos/debt-response.dto';
import MyServicesError from 'src/errors/my-services.error';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindManyDebtsService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Finds all debts in the system
   * @class FindManyDebtsService
   */

  /**
   * Retrieves all debts from the database with their associated details
   * @returns {Promise<DebtResponseDto[]>} Array of debt objects transformed into DTOs, including invoice numbers, amounts, states and dates
   * @throws {MyServicesError} When no debts are found in the database or if there's an error during data retrieval
   */
  async findManyDebts(): Promise<DebtResponseDto[]> {
    try {
      const existingDebts = await this.prisma.debt.findMany({
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
        },
      });

      if (!existingDebts || existingDebts.length === 0) {
        throw new MyServicesError('No debts found');
      }

      return plainToInstance(DebtResponseDto, existingDebts);
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error ? error.message : 'Error finding many debts',
      );
    }
  }
}
