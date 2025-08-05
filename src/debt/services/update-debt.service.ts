import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateDebtDto } from '../dtos/update-debt.dto';
import MyServicesError from 'src/errors/my-services.error';
import { plainToInstance } from 'class-transformer';
import { DebtState } from 'generated/prisma';

@Injectable()
export class UpdateDebtService {
  constructor(private readonly prisma: PrismaService) {}

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

      // ----- Calculate the new payment -----
      const newPayment: number = data.amountPaid ?? 0;

      // ----- Calculate the updated amount paid -----
      const updatedAmountPaid =
        Number(existingDebt.amountPaid ?? 0) + newPayment;

      // ----- Calculate the amount remaining -----
      const amountRemaining =
        Number(existingDebt.amountTTC) - updatedAmountPaid;

      const statePaid = updatedAmountPaid >= Number(existingDebt.amountTTC);

      // ----- Update the debt -----
      const updatedDebt = await this.prisma.debt.update({
        where: {
          id,
        },
        data: {
          ...data,
          amountPaid: updatedAmountPaid,
          amountRemaining: amountRemaining,
          state: statePaid ? DebtState.PAID : DebtState.PENDING,
          updatedAt: new Date(),
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
