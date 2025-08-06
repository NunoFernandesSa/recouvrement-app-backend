import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateDebtDto } from '../dtos/update-debt.dto';
import MyServicesError from 'src/errors/my-services.error';
import { plainToInstance } from 'class-transformer';
import { DebtState } from 'generated/prisma';

@Injectable()
export class UpdateDebtService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Updates a debt record in the database
   * @class UpdateDebtService
   */

  /**
   * Updates a debt record with new payment information and status
   * @param id - The unique identifier of the debt to update
   * @param data - The DTO containing the update information
   * @returns An object containing a success message and the updated debt data
   * @throws MyServicesError if debt is not found or update fails
   *
   * This method:
   * - Validates the debt exists
   * - Calculates new payment amounts and remaining balance
   * - Updates payment status based on amount paid
   * - Updates the debt record with new information
   * - Returns the updated debt data
   */
  async updateDebt(
    id: string,
    data: UpdateDebtDto,
  ): Promise<{ message: string; data: UpdateDebtDto }> {
    try {
      const existingDebt = await this.prisma.debt.findUnique({
        where: {
          id,
        },
      });

      if (!existingDebt) {
        throw new MyServicesError('Debt not found', HttpStatus.NOT_FOUND);
      }

      // ----- Calculate the new payment, updated amount paid and amount remaining -----
      const newPayment: number = data.amountPaid ?? 0;

      const updatedAmountPaid =
        Number(existingDebt.amountPaid ?? 0) + newPayment;

      const amountRemaining =
        Number(existingDebt.amountTTC) - updatedAmountPaid;

      // check if the debt is paid
      const statePaid =
        Number(updatedAmountPaid) < Number(existingDebt.amountTTC)
          ? DebtState.PENDING
          : DebtState.PAID;

      // ----- Update the debt -----
      const updatedDebt = await this.prisma.debt.update({
        where: {
          id,
        },
        data: {
          ...data,
          amountPaid: updatedAmountPaid,
          amountRemaining: amountRemaining,
          state: data.state ?? statePaid,
          updatedAt: new Date(),
        },
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

      return {
        message: 'Debt updated successfully',
        data: plainToInstance(UpdateDebtDto, updatedDebt),
      };
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error ? error.message : 'Error on update debt',
      );
    }
  }
}
